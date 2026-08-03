import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { X, GraduationCap } from 'lucide-react';
import type { FilterState, AttendanceStatus, Student, AuditEntry, BulkScope, RowDraft } from './types';
import { printClassRegister } from './utils/printUtils';
import { INITIAL_STUDENTS, INITIAL_NOTIFICATIONS, CLASS_SUBJECTS } from './data';
import { useDebounce } from './hooks/useDebounce';
import TopNav from './components/TopNav';
import SchoolBanner from './components/SchoolBanner';
import FilterBar from './components/FilterBar';
import MetricCards from './components/MetricCards';
import AttendanceTable from './components/AttendanceTable';
import BulkToolbar from './components/BulkToolbar';
import BulkConfirmModal from './components/BulkConfirmModal';
import ConfirmModal from './components/ConfirmModal';
import AuditLogPanel from './components/AuditLogPanel';
import KeyboardHelp from './components/KeyboardHelp';
import ImportModal from './components/ImportModal';

type SaveState = 'clean' | 'unsaved' | 'saving' | 'saved' | 'failed';
type ToastType = 'success' | 'info' | 'warning' | 'error';
type ExportFormat = 'excel' | 'csv' | 'pdf' | 'print';

interface Toast { id: number; message: string; type: ToastType }

const DEFAULT_FILTERS: FilterState = {
  academicYear: '2025-2026',
  classNum: '9',
  group: 'Science',
  section: 'A',
  shift: 'Morning',
  date: new Date().toISOString().slice(0, 10),
};

const DEFAULT_SCHOOL = {
  name: 'Ataullah High School & College',
  tagline: 'Nurturing Excellence Since 1985 — Empowering Future Leaders',
  address: '42 Education Rd, Dhaka 1205, Bangladesh',
  session: 'Academic Session 2025–2026',
};

let toastId = 0;
let auditId = 0;

function initDarkMode(): boolean {
  const stored = localStorage.getItem('theme');
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function initExportFormat(): ExportFormat {
  const v = localStorage.getItem('lastExportFormat');
  return (v as ExportFormat) ?? 'excel';
}

function makeInitials(name: string) {
  return name.split(' ').filter(Boolean).map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

function draftToStudent(st: Student, draft: RowDraft): Student {
  const name = draft.name.trim() || st.name;
  const roll = parseInt(draft.rollNo);
  return {
    ...st,
    rollNo: isNaN(roll) ? st.rollNo : roll,
    name,
    initials: makeInitials(name),
    classSection: draft.classSection || st.classSection,
    attendance: draft.attendance,
    comment: draft.comment,
    manualRating: draft.manualRating,
    guardian: {
      name: draft.guardianName || st.guardian.name,
      phone: draft.guardianPhone || st.guardian.phone,
      relation: draft.guardianRelation || st.guardian.relation,
    },
    lastUpdated: new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
  };
}

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(initDarkMode);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [school, setSchool] = useState(DEFAULT_SCHOOL);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [teacherName, setTeacherName] = useState('Mr. Rafiq Uddin');
  const [saveState, setSaveState] = useState<SaveState>('clean');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', rollNo: '', phone: '' });
  const [addErrors, setAddErrors] = useState<{ name?: string; rollNo?: string }>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [bulkStatusRequest, setBulkStatusRequest] = useState<AttendanceStatus | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [lastExportFormat, setLastExportFormat] = useState<ExportFormat>(initExportFormat);
  const [lockedRowIds, setLockedRowIds] = useState<Set<string>>(new Set());

  // Undo / Redo history
  const [undoStack, setUndoStack] = useState<Student[][]>([]);
  const [redoStack, setRedoStack] = useState<Student[][]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Theme persistence
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // beforeunload protection
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (saveState === 'unsaved') { e.preventDefault(); e.returnValue = ''; }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveState]);

  // Global keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.key === 's') {
        e.preventDefault();
        if (saveState === 'unsaved' || saveState === 'failed') handleSave();
        return;
      }
      if (meta && e.key === 'f') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('[data-search-input]')?.focus();
        return;
      }
      if (meta && e.key === 'z') {
        e.preventDefault();
        handleUndo();
        return;
      }
      if (meta && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        handleRedo();
        return;
      }
      if (e.key === 'Escape') {
        setShowKeyboardHelp(false);
        setShowImportModal(false);
        setShowAddStudent(false);
        setShowAuditLog(false);
        setBulkStatusRequest(null);
        setShowLockConfirm(false);
        setShowUnlockConfirm(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveState, undoStack, redoStack]);

  function addToast(message: string, type: ToastType = 'info') {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }

  function logAudit(entry: Omit<AuditEntry, 'id' | 'timestamp'>) {
    setAuditLog(prev => [{
      ...entry,
      id: String(++auditId),
      timestamp: new Date().toISOString(),
    }, ...prev].slice(0, 100));
  }

  function pushHistory(snapshot: Student[]) {
    setUndoStack(prev => [...prev.slice(-19), snapshot]);
    setRedoStack([]);
  }

  function handleUndo() {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack(r => [...r, students]);
    setStudents(prev);
    setUndoStack(u => u.slice(0, -1));
    markUnsaved();
    addToast('Undo', 'info');
  }

  function handleRedo() {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(u => [...u, students]);
    setStudents(next);
    setRedoStack(r => r.slice(0, -1));
    markUnsaved();
    addToast('Redo', 'info');
  }

  function handleSave() {
    setSaveState('saving');
    setTimeout(() => {
      const ok = Math.random() > 0.05;
      if (ok) {
        setSaveState('saved');
        addToast('All changes saved successfully', 'success');
        setTimeout(() => setSaveState('clean'), 3000);
      } else {
        setSaveState('failed');
        addToast('Save failed — please retry', 'error');
      }
    }, 1800);
  }

  function markUnsaved() {
    setSaveState(prev => prev === 'saving' ? prev : 'unsaved');
  }

  function handleMarkAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  const subjects = useMemo(() => CLASS_SUBJECTS[filters.classNum] ?? CLASS_SUBJECTS['9'], [filters.classNum]);

  useEffect(() => {
    const num = filters.classNum;
    const classRoman: Record<string, string> = {
      '1':'I','2':'II','3':'III','4':'IV','5':'V','6':'VI',
      '7':'VII','8':'VIII','9':'IX','10':'X','11':'XI','12':'XII',
    };
    const classLabel = classRoman[num] ?? `Class ${num}`;
    const sectionLabel = filters.section || 'A';
    const classSubs = CLASS_SUBJECTS[num] ?? CLASS_SUBJECTS['9'];
    setStudents(INITIAL_STUDENTS.map(st => {
      const newAtt: Record<string, AttendanceStatus> = {};
      classSubs.forEach(s => { newAtt[s.id] = 'P'; });
      return { ...st, attendance: newAtt, classSection: `${classLabel}-${sectionLabel}` };
    }));
    setSelectedIds(new Set());
    setPage(1);
  }, [filters.classNum, filters.section]);

  const filteredStudents = useMemo(() => {
    let result = students;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        String(s.rollNo).includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.guardian.name.toLowerCase().includes(q) ||
        s.guardian.phone.includes(q)
      );
    }
    if (activeMetric && activeMetric !== 'attendance') {
      result = result.filter(st => {
        const statuses = subjects.map(s => st.attendance[s.id] ?? 'P');
        const absent = statuses.filter(s => s === 'A').length;
        const late = statuses.filter(s => s === 'L').length;
        const leave = statuses.filter(s => s === 'Lv').length;
        switch (activeMetric) {
          case 'present': return absent === 0 && late === 0 && leave === 0;
          case 'absent': return absent > 0;
          case 'late': return late > 0 && absent === 0;
          case 'leave': return leave > 0 && absent === 0 && late === 0;
          default: return true;
        }
      });
    }
    return result;
  }, [students, debouncedSearch, activeMetric, subjects]);

  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, page, pageSize]);

  function handleFilterChange(key: keyof FilterState, val: string) {
    setFilters(prev => ({ ...prev, [key]: val }));
    setPage(1);
    setActiveMetric(null);
  }

  function handleStatusChange(studentId: string, subjectId: string, status: AttendanceStatus, prevStatus: AttendanceStatus) {
    if (isLocked) { addToast('Attendance is locked. Unlock to make changes.', 'error'); return; }
    const student = students.find(s => s.id === studentId);
    const subject = subjects.find(s => s.id === subjectId);
    setStudents(prev =>
      prev.map(s => s.id === studentId
        ? { ...s, attendance: { ...s.attendance, [subjectId]: status }, lastUpdated: new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) }
        : s
      )
    );
    markUnsaved();
    if (student && subject) {
      addToast(`${student.name} — ${subject.code}: ${prevStatus} → ${status}`, 'success');
      logAudit({ studentName: student.name, studentId: student.id, subjectCode: subject.code, prevStatus, newStatus: status, editedBy: teacherName });
    }
  }

  function handleSaveRow(studentId: string, draft: RowDraft) {
    const st = students.find(s => s.id === studentId);
    if (!st) return;
    pushHistory(students);
    setStudents(prev => prev.map(s => s.id === studentId ? draftToStudent(s, draft) : s));
    markUnsaved();
    addToast(`Saved — ${draft.name || st.name}`, 'success');
  }

  function handleSaveAll(updates: Array<{ id: string; draft: RowDraft }>) {
    if (updates.length === 0) { addToast('No changes in editing mode', 'info'); return; }
    pushHistory(students);
    setStudents(prev => prev.map(st => {
      const upd = updates.find(u => u.id === st.id);
      return upd ? draftToStudent(st, upd.draft) : st;
    }));
    markUnsaved();
    addToast(`${updates.length} row(s) updated`, 'success');
  }

  function handleInsertRowAfter(afterId: string) {
    pushHistory(students);
    const idx = students.findIndex(s => s.id === afterId);
    const maxRoll = students.length > 0 ? Math.max(...students.map(s => s.rollNo)) : 0;
    const id = `STU_${Date.now().toString(36).toUpperCase()}`;
    const att: Record<string, AttendanceStatus> = {};
    subjects.forEach(s => { att[s.id] = 'P'; });
    const colors = ['#0D9488','#6366F1','#10B981','#F59E0B','#F43F5E'];
    const newRow: Student = {
      id, rollNo: maxRoll + 1, name: 'New Student', initials: 'NS',
      avatarColor: colors[(students.length) % colors.length],
      classSection: filters.section || 'A',
      rating: 3, manualRating: null, comment: '',
      attendance: att, monthlyAvg: 85,
      phone: 'N/A', guardian: { name: 'N/A', phone: 'N/A', relation: 'Parent' },
      weeklyHistory: [], lastUpdated: new Date().toLocaleString(),
    };
    setStudents(prev => [
      ...prev.slice(0, idx + 1),
      newRow,
      ...prev.slice(idx + 1),
    ]);
    markUnsaved();
    addToast('New row inserted — click ✏ to edit', 'info');
  }

  function handleDuplicateRow(id: string) {
    const source = students.find(s => s.id === id);
    if (!source) return;
    pushHistory(students);
    const maxRoll = Math.max(...students.map(s => s.rollNo));
    const newId = `STU_${Date.now().toString(36).toUpperCase()}`;
    const copy: Student = {
      ...source,
      id: newId,
      rollNo: maxRoll + 1,
      name: `${source.name} (Copy)`,
      initials: makeInitials(source.name),
      lastUpdated: new Date().toLocaleString(),
    };
    const idx = students.findIndex(s => s.id === id);
    setStudents(prev => [
      ...prev.slice(0, idx + 1),
      copy,
      ...prev.slice(idx + 1),
    ]);
    markUnsaved();
    addToast(`Duplicated — ${source.name}`, 'success');
  }

  function handleRowLockToggle(id: string) {
    setLockedRowIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); addToast('Row unlocked', 'info'); }
      else { n.add(id); addToast('Row locked', 'info'); }
      return n;
    });
  }

  function handleBulkStatusConfirm(scope: BulkScope) {
    const status = bulkStatusRequest!;
    const targets: Set<string> =
      scope === 'page' ? new Set(paginatedStudents.map(s => s.id)) :
      scope === 'selected' ? new Set(selectedIds) :
      new Set(filteredStudents.map(s => s.id));
    setStudents(prev =>
      prev.map(st => {
        if (!targets.has(st.id)) return st;
        const newAtt: Record<string, AttendanceStatus> = { ...st.attendance };
        subjects.forEach(sub => { newAtt[sub.id] = status; });
        return { ...st, attendance: newAtt, lastUpdated: new Date().toLocaleString() };
      })
    );
    markUnsaved();
    const label = status === 'P' ? 'Present' : status === 'L' ? 'Late' : status === 'Lv' ? 'Leave' : 'Absent';
    addToast(`Marked ${targets.size} student(s) as ${label}`, 'success');
    setBulkStatusRequest(null);
    setSelectedIds(new Set());
  }

  function handleRatingChange(studentId: string, rating: number) {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, rating, manualRating: rating } : s));
    markUnsaved();
  }

  function handleCommentChange(studentId: string, comment: string) {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, comment } : s));
    markUnsaved();
  }

  function handleDelete(studentId: string) {
    const st = students.find(s => s.id === studentId);
    pushHistory(students);
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(studentId); return n; });
    markUnsaved();
    addToast(`${st?.name ?? 'Student'} removed`, 'warning');
  }

  function handleMessage(studentId: string) {
    const st = students.find(s => s.id === studentId);
    if (st) addToast(`Message sent to ${st.name}`, 'success');
  }

  function handleSelect(id: string, checked: boolean) {
    setSelectedIds(prev => { const n = new Set(prev); checked ? n.add(id) : n.delete(id); return n; });
  }

  function handleSelectAll(checked: boolean) {
    setSelectedIds(checked ? new Set(paginatedStudents.map(s => s.id)) : new Set());
  }

  function handleBulkDelete() {
    pushHistory(students);
    setStudents(prev => prev.filter(s => !selectedIds.has(s.id)));
    addToast(`Deleted ${selectedIds.size} student(s)`, 'warning');
    setSelectedIds(new Set());
    markUnsaved();
  }

  function handleMetricClick(key: string) {
    setActiveMetric(prev => prev === key ? null : key);
    setPage(1);
  }

  function validateNewStudent() {
    const errors: { name?: string; rollNo?: string } = {};
    if (!newStudent.name.trim()) errors.name = 'Name is required';
    if (newStudent.rollNo) {
      const roll = parseInt(newStudent.rollNo);
      if (isNaN(roll) || roll < 1) errors.rollNo = 'Invalid roll number';
      else if (students.some(s => s.rollNo === roll)) errors.rollNo = 'Roll number already exists';
    }
    setAddErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleAddStudent() {
    if (!validateNewStudent()) return;
    const roll = newStudent.rollNo ? parseInt(newStudent.rollNo) : (students.length > 0 ? Math.max(...students.map(s => s.rollNo)) + 1 : 1);
    const id = `STU${String(students.length + 1).padStart(4, '0')}`;
    const att: Record<string, AttendanceStatus> = {};
    subjects.forEach(s => { att[s.id] = 'P'; });
    const colors = ['#0D9488','#6366F1','#10B981','#F59E0B','#F43F5E'];
    const initials = makeInitials(newStudent.name);
    const classLabel = filters.classNum === '9' ? 'IX' : filters.classNum === '10' ? 'X' : filters.classNum === '11' ? 'XI' : filters.classNum === '12' ? 'XII' : filters.classNum;
    const sectionLabel = filters.section || 'A';
    const student: Student = {
      id, rollNo: roll, name: newStudent.name.trim(), initials,
      avatarColor: colors[students.length % colors.length],
      classSection: `${classLabel}-${sectionLabel}`,
      rating: 3, manualRating: null, comment: '',
      attendance: att, monthlyAvg: 85,
      phone: newStudent.phone || 'N/A',
      guardian: { name: 'N/A', phone: 'N/A', relation: 'Parent' },
      weeklyHistory: [], lastUpdated: new Date().toLocaleString(),
    };
    setStudents(prev => [...prev, student]);
    setShowAddStudent(false);
    setNewStudent({ name: '', rollNo: '', phone: '' });
    setAddErrors({});
    markUnsaved();
    addToast(`${student.name} added to Class ${classLabel}-${sectionLabel}`, 'success');
  }

  function handleImportStudents(newStudents: Student[]) {
    setStudents(prev => [...prev, ...newStudents]);
    markUnsaved();
    addToast(`Imported ${newStudents.length} student(s) successfully`, 'success');
  }

  const handleExport = useCallback((format: ExportFormat) => {
    setLastExportFormat(format);
    localStorage.setItem('lastExportFormat', format);
    if (format === 'print') { window.print(); return; }
    const labels: Record<string, string> = { excel: 'Excel (.xlsx)', csv: 'CSV', pdf: 'PDF' };
    addToast(`Exporting attendance as ${labels[format]}…`, 'info');
  }, []);

  const classLabel = filters.classNum === '9' ? 'IX' : filters.classNum === '10' ? 'X' : filters.classNum === '11' ? 'XI' : filters.classNum === '12' ? 'XII' : filters.classNum || '–';
  const sectionLabel = filters.section || 'A';

  const toastColors: Record<ToastType, string> = {
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    info: 'border-teal-500/40 bg-teal-500/10 text-teal-300',
    warning: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    error: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
  };

  void searchInputRef;

  return (
    <div className="min-h-screen bg-app-bg text-app-t1 transition-colors duration-200">
      <TopNav
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        teacherName={teacherName}
        onTeacherNameChange={setTeacherName}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        saveState={saveState}
        onSave={handleSave}
        isLocked={isLocked}
        onToggleLock={() => isLocked ? setShowUnlockConfirm(true) : setShowLockConfirm(true)}
        onShowAuditLog={() => setShowAuditLog(v => !v)}
        onShowHelp={() => setShowKeyboardHelp(true)}
        onPrintRegister={() => {
          const classLabel = filters.classNum === '9' ? 'IX' : filters.classNum === '10' ? 'X' : filters.classNum === '11' ? 'XI' : filters.classNum === '12' ? 'XII' : filters.classNum || '–';
          printClassRegister(
            students,
            subjects,
            school.name,
            `Class ${classLabel}-${filters.section || 'A'}`,
            filters.date,
            teacherName,
          );
        }}
      />

      <main className="pt-14">
        <SchoolBanner
          info={school}
          onInfoChange={setSchool}
          activeClass={classLabel}
          activeSection={sectionLabel}
        />

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilter={k => { setFilters(prev => ({ ...prev, [k]: '' })); setPage(1); }}
          onClearAll={() => { setFilters(DEFAULT_FILTERS); setSearch(''); setPage(1); setActiveMetric(null); }}
          search={search}
          onSearchChange={v => { setSearch(v); setPage(1); }}
          onAddStudent={() => { setShowAddStudent(true); setAddErrors({}); }}
          onImport={() => setShowImportModal(true)}
          onBulkStatusRequest={s => { if (isLocked) { addToast('Unlock attendance first.', 'error'); return; } setBulkStatusRequest(s); }}
          onExport={handleExport}
          allStudents={students}
          lastExportFormat={lastExportFormat}
        />

        <MetricCards
          students={filteredStudents}
          subjects={subjects}
          activeMetric={activeMetric}
          onMetricClick={handleMetricClick}
        />

        {/* Table section label */}
        <div className="px-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold text-app-t3 uppercase tracking-wider">Attendance Register</h2>
            <span className="px-2 py-0.5 rounded-full bg-app-raised text-app-t3 text-[10px] font-mono font-semibold border border-app-border">
              {filteredStudents.length} students
            </span>
            {activeMetric && (
              <span className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[10px] font-semibold">
                Filtered: {activeMetric}
                <button onClick={() => setActiveMetric(null)} className="ml-1.5 hover:text-teal-200" aria-label="Clear metric filter">×</button>
              </span>
            )}
          </div>
        </div>

        <AttendanceTable
          students={paginatedStudents}
          allStudents={students}
          subjects={subjects}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onStatusChange={handleStatusChange}
          onRatingChange={handleRatingChange}
          onCommentChange={handleCommentChange}
          onDelete={handleDelete}
          onMessage={handleMessage}
          onSaveRow={handleSaveRow}
          onSaveAll={handleSaveAll}
          onInsertRowAfter={handleInsertRowAfter}
          onDuplicateRow={handleDuplicateRow}
          onRowLockToggle={handleRowLockToggle}
          lockedRowIds={lockedRowIds}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
          onUndo={handleUndo}
          onRedo={handleRedo}
          page={page}
          pageSize={pageSize}
          totalCount={filteredStudents.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          isLocked={isLocked}
          teacherName={teacherName}
          schoolName={school.name}
          onAddStudent={() => { setShowAddStudent(true); setAddErrors({}); }}
        />
      </main>

      <BulkToolbar
        count={selectedIds.size}
        onBulkStatus={s => { if (isLocked) { addToast('Unlock attendance first.', 'error'); return; } setBulkStatusRequest(s); }}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedIds(new Set())}
      />

      <BulkConfirmModal
        open={bulkStatusRequest !== null}
        status={bulkStatusRequest}
        selectedCount={selectedIds.size}
        pageCount={paginatedStudents.length}
        totalCount={filteredStudents.length}
        onConfirm={handleBulkStatusConfirm}
        onCancel={() => setBulkStatusRequest(null)}
      />

      <ConfirmModal
        open={showLockConfirm}
        title="Lock Attendance?"
        message="Once locked, no attendance changes can be made until an admin unlocks it. This is typically done after final submission."
        confirmLabel="Lock Attendance"
        variant="lock"
        onConfirm={() => { setIsLocked(true); setShowLockConfirm(false); addToast('Attendance locked successfully', 'info'); }}
        onCancel={() => setShowLockConfirm(false)}
      />

      <ConfirmModal
        open={showUnlockConfirm}
        title="Unlock Attendance?"
        message="This will re-enable editing for all attendance records. Only authorized personnel should unlock submitted attendance."
        confirmLabel="Unlock Attendance"
        variant="warning"
        onConfirm={() => { setIsLocked(false); setShowUnlockConfirm(false); addToast('Attendance unlocked', 'warning'); }}
        onCancel={() => setShowUnlockConfirm(false)}
      />

      <AuditLogPanel open={showAuditLog} entries={auditLog} onClose={() => setShowAuditLog(false)} />
      <KeyboardHelp open={showKeyboardHelp} onClose={() => setShowKeyboardHelp(false)} />
      <ImportModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportStudents}
        existingStudents={students}
        subjects={subjects}
      />

      {/* Add Student Modal */}
      {showAddStudent && (
        <div
          className="animate-fade-in fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => { setShowAddStudent(false); setAddErrors({}); }}
          role="dialog" aria-modal="true" aria-label="Add new student"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-app-border bg-app-surface shadow-modal overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-gradient-to-r from-teal-500 to-indigo-600" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-teal-400" aria-hidden />
                  </div>
                  <h3 className="text-sm font-semibold text-app-t1">Add New Student</h3>
                </div>
                <button onClick={() => { setShowAddStudent(false); setAddErrors({}); }} aria-label="Close" className="text-app-t3 hover:text-app-t1 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-app-t2 mb-1.5" htmlFor="add-name">Full Name *</label>
                  <input
                    id="add-name" autoFocus value={newStudent.name}
                    onChange={e => { setNewStudent(p => ({ ...p, name: e.target.value })); setAddErrors(p => ({ ...p, name: undefined })); }}
                    placeholder="e.g. Fatema Begum"
                    className={`w-full h-10 px-3 rounded-lg border text-app-t1 text-sm placeholder-app-t4 focus:outline-none focus:ring-1 transition-all bg-app-raised ${addErrors.name ? 'border-rose-500/60 focus:ring-rose-500/20' : 'border-app-border focus:border-teal-500/60 focus:ring-teal-500/20'}`}
                  />
                  {addErrors.name && <p className="text-[10px] text-rose-400 mt-1">{addErrors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-app-t2 mb-1.5" htmlFor="add-roll">Roll Number</label>
                    <input
                      id="add-roll" type="number" value={newStudent.rollNo}
                      onChange={e => { setNewStudent(p => ({ ...p, rollNo: e.target.value })); setAddErrors(p => ({ ...p, rollNo: undefined })); }}
                      placeholder="Auto"
                      className={`w-full h-10 px-3 rounded-lg border text-app-t1 text-sm placeholder-app-t4 focus:outline-none focus:ring-1 transition-all bg-app-raised font-mono ${addErrors.rollNo ? 'border-rose-500/60 focus:ring-rose-500/20' : 'border-app-border focus:border-teal-500/60 focus:ring-teal-500/20'}`}
                    />
                    {addErrors.rollNo && <p className="text-[10px] text-rose-400 mt-1">{addErrors.rollNo}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-app-t2 mb-1.5" htmlFor="add-phone">Phone</label>
                    <input
                      id="add-phone" value={newStudent.phone}
                      onChange={e => setNewStudent(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+880-XXX-XXXX"
                      className="w-full h-10 px-3 rounded-lg border border-app-border bg-app-raised text-app-t1 text-sm placeholder-app-t4 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/20 transition-all font-mono"
                    />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-app-raised border border-app-border text-xs text-app-t3">
                  Adding to <span className="text-app-t1 font-medium">Class {classLabel}-{sectionLabel}</span> ·
                  <span className="text-app-t1 font-medium"> {subjects.length} subjects</span> · Default: <span className="text-emerald-500 font-medium">Present</span>
                </div>
              </div>
              <div className="flex gap-2 mt-6 justify-end">
                <button onClick={() => { setShowAddStudent(false); setAddErrors({}); }} className="px-4 py-2 rounded-lg border border-app-border text-app-t2 hover:bg-app-raised text-sm transition-all">Cancel</button>
                <button onClick={handleAddStudent} className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-all shadow-md shadow-teal-500/20">Add Student</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <div className="fixed bottom-24 right-4 z-[80] flex flex-col gap-2 no-print pointer-events-none" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`animate-fade-in flex items-center gap-2 px-4 py-2.5 rounded-xl border backdrop-blur-xl text-xs font-medium shadow-lg max-w-xs ${toastColors[t.type]}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
