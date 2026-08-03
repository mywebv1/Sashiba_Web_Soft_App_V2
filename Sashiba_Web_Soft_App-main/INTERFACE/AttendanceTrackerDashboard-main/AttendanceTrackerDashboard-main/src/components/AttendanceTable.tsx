import { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import { createPortal } from 'react-dom';
import {
  MessageSquare, Edit2, Printer, Trash2, Star, ChevronLeft, ChevronRight,
  ChevronDown, Check, Lock, Unlock, Phone, User, BookOpen, TrendingUp,
  RotateCcw, RotateCw, Pencil, X, Plus, Copy, MoreVertical, Eye, EyeOff,
  AlertTriangle, Columns3, PlusSquare, Minus,
} from 'lucide-react';
import type { Student, Subject, AttendanceStatus, RowDraft, ColumnKey, CustomColumn } from '../types';
import { SYLLABUS_BY_SUBJECT } from '../data';
import { printStudentReport } from '../utils/printUtils';
import TableEditModal from './TableEditModal';
import ParentMessageModal from './ParentMessageModal';

interface Props {
  students: Student[];
  allStudents: Student[];
  subjects: Subject[];
  selectedIds: Set<string>;
  onSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onStatusChange: (studentId: string, subjectId: string, status: AttendanceStatus, prevStatus: AttendanceStatus) => void;
  onRatingChange: (studentId: string, rating: number) => void;
  onCommentChange: (studentId: string, comment: string) => void;
  onDelete: (studentId: string) => void;
  onMessage: (studentId: string) => void;
  onSaveRow: (studentId: string, draft: RowDraft) => void;
  onSaveAll: (updates: Array<{ id: string; draft: RowDraft }>) => void;
  onInsertRowAfter: (afterId: string) => void;
  onDuplicateRow: (id: string) => void;
  onRowLockToggle: (id: string) => void;
  lockedRowIds: Set<string>;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (n: number) => void;
  isLocked: boolean;
  teacherName: string;
  schoolName: string;
  onAddStudent: () => void;
}

const STATUS_CYCLE: AttendanceStatus[] = ['P', 'A', 'L', 'Lv'];

const STATUS_STYLE: Record<AttendanceStatus, string> = {
  P:  'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25',
  A:  'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/25',
  L:  'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25',
  Lv: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/25',
};

const STATUS_FOCUS: Record<AttendanceStatus, string> = {
  P:  'ring-emerald-500/60', A: 'ring-rose-500/60', L: 'ring-amber-500/60', Lv: 'ring-blue-500/60',
};

const STATUS_DOT: Record<AttendanceStatus, string> = {
  P: 'bg-emerald-500', A: 'bg-rose-500', L: 'bg-amber-500', Lv: 'bg-blue-500',
};

const BUILT_IN_COLS: ColumnKey[] = ['class', 'status', 'attendance', 'evaluation'];
const BUILT_IN_LABELS: Record<ColumnKey, string> = {
  class: 'Class / Section', status: 'Today Status', attendance: 'Att. %', evaluation: 'Evaluation',
};

function studentToDraft(st: Student): RowDraft {
  return {
    rollNo: String(st.rollNo), name: st.name, classSection: st.classSection,
    attendance: { ...st.attendance }, comment: st.comment, manualRating: st.manualRating,
    guardianName: st.guardian.name, guardianPhone: st.guardian.phone, guardianRelation: st.guardian.relation,
  };
}

function computeTodayStatus(attendance: Record<string, AttendanceStatus>, subjects: Subject[]) {
  const statuses = subjects.map(s => attendance[s.id] ?? 'P');
  const absent = statuses.filter(s => s === 'A').length;
  const late   = statuses.filter(s => s === 'L').length;
  const leave  = statuses.filter(s => s === 'Lv').length;
  if (absent === 0 && late === 0 && leave === 0)
    return { label: 'All Present', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25' };
  if (absent === subjects.length)
    return { label: 'Absent',      cls: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' };
  if (absent > 0)
    return { label: `${absent} Sub. Absent`, cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' };
  if (late > 0)
    return { label: `${late} Sub. Late`,     cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
  return   { label: `${leave} Sub. Leave`,   cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
}

function autoRating(monthlyAvg: number): number {
  if (monthlyAvg >= 96) return 5;
  if (monthlyAvg >= 86) return 4;
  if (monthlyAvg >= 76) return 3;
  if (monthlyAvg >= 66) return 2;
  return 1;
}

function AttBar({ pct }: { pct: number }) {
  const color = pct >= 90 ? 'bg-emerald-500' : pct >= 75 ? 'bg-amber-500' : 'bg-rose-500';
  const textColor = pct >= 90 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 75 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400';
  return (
    <div className="w-full min-w-[80px]">
      <div className="flex items-center mb-1">
        <span className={`font-mono text-xs font-semibold ${textColor}`}>{pct}%</span>
      </div>
      <div className="w-full h-1 rounded-full bg-app-raised border border-app-border/50">
        <div className={`h-1 rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StarRating({ rating, onChange, disabled }: { rating: number; onChange: (r: number) => void; disabled?: boolean }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <button key={i} onClick={() => !disabled && onChange(i)}
          onMouseEnter={() => !disabled && setHover(i)} onMouseLeave={() => setHover(0)}
          disabled={disabled} aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
          className={`transition-transform ${!disabled ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
        >
          <Star className={`w-3 h-3 ${i <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-app-t4'}`} />
        </button>
      ))}
    </div>
  );
}

function WeekTimeline({ history }: { history: Student['weeklyHistory'] }) {
  return (
    <div className="flex items-end gap-3">
      {history.map((entry, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div className={`w-5 h-5 rounded-full ${STATUS_DOT[entry.status]} flex items-center justify-center`} title={`${entry.date}: ${entry.status}`}>
            <span className="text-[8px] font-bold text-white">{entry.status === 'Lv' ? 'V' : entry.status}</span>
          </div>
          <span className="text-[9px] text-app-t4 font-mono">{entry.label}</span>
        </div>
      ))}
    </div>
  );
}

function SyllabusBar({ subjectId, name }: { subjectId: string; name: string }) {
  const s = SYLLABUS_BY_SUBJECT[subjectId];
  if (!s) return null;
  const pct = Math.round((s.completed / s.total) * 100);
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-app-t3 w-16 flex-shrink-0 truncate">{name}</span>
      <div className="flex-1 h-1.5 rounded-full bg-app-raised border border-app-border/50 min-w-[60px]">
        <div className={`h-1.5 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-mono text-app-t3 flex-shrink-0">{s.completed}/{s.total}</span>
      <span className={`text-[10px] font-mono font-bold flex-shrink-0 ${pct >= 70 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>{pct}%</span>
    </div>
  );
}

interface FocusedCell { si: number; sj: number }
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function AttendanceTable({
  students, allStudents, subjects, selectedIds, onSelect, onSelectAll, onStatusChange,
  onRatingChange, onCommentChange, onDelete, onMessage, onSaveRow, onSaveAll,
  onInsertRowAfter, onDuplicateRow, onRowLockToggle, lockedRowIds,
  canUndo, canRedo, onUndo, onRedo,
  page, pageSize, totalCount, onPageChange, onPageSizeChange,
  isLocked, teacherName, schoolName, onAddStudent,
}: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [focusedCell, setFocusedCell] = useState<FocusedCell | null>(null);
  const [messageStudentId, setMessageStudentId] = useState<string | null>(null);

  // Portal menu state for ⋮ dropdown (fixes z-index clipping)
  const [portalMenuId, setPortalMenuId] = useState<string | null>(null);
  const [portalMenuPos, setPortalMenuPos] = useState({ top: 0, right: 0 });

  // Subject tooltip portal state
  const [subTooltip, setSubTooltip] = useState<{ subId: string; name: string; x: number; y: number } | null>(null);

  // Tier 1 single-row edit
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [rowDraft, setRowDraft] = useState<RowDraft | null>(null);
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});

  // Table edit modal (Tier 2)
  const [showTableEditModal, setShowTableEditModal] = useState(false);

  // Column management
  const [hiddenCols, setHiddenCols] = useState<Set<ColumnKey>>(new Set());
  const [hiddenSubjectIds, setHiddenSubjectIds] = useState<Set<string>>(new Set());
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([]);
  const [showColMenu, setShowColMenu] = useState(false);
  const [addColName, setAddColName] = useState('');
  const [showAddColInput, setShowAddColInput] = useState(false);
  const colMenuRef = useRef<HTMLDivElement>(null);
  const addColInputRef = useRef<HTMLInputElement>(null);

  // Row action menu
  const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
  const rowMenuRef = useRef<HTMLDivElement>(null);

  const cellRefs = useRef<(HTMLButtonElement | null)[][]>([]);
  useEffect(() => {
    cellRefs.current = Array.from({ length: students.length }, () =>
      Array.from({ length: subjects.length }, () => null)
    );
  }, [students.length, subjects.length]);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target as Node)) {
        setShowColMenu(false);
        setShowAddColInput(false);
        setAddColName('');
      }
      if (rowMenuRef.current && !rowMenuRef.current.contains(e.target as Node)) setOpenRowMenu(null);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    if (showAddColInput && addColInputRef.current) addColInputRef.current.focus();
  }, [showAddColInput]);

  function startRowEdit(st: Student) {
    if (isLocked || lockedRowIds.has(st.id)) return;
    setEditingRowId(st.id);
    setRowDraft(studentToDraft(st));
    setRowErrors({});
    setExpandedIds(prev => { const n = new Set(prev); n.delete(st.id); return n; });
  }

  function cancelRowEdit() { setEditingRowId(null); setRowDraft(null); setRowErrors({}); }

  function validateRowDraft(draft: RowDraft, studentId: string): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!draft.name.trim()) errors.name = 'Name required';
    const roll = parseInt(draft.rollNo);
    if (isNaN(roll) || roll < 1) errors.rollNo = 'Invalid roll';
    else if (allStudents.some(s => s.rollNo === roll && s.id !== studentId)) errors.rollNo = 'Duplicate roll';
    return errors;
  }

  function commitRowEdit(studentId: string) {
    if (!rowDraft) return;
    const errors = validateRowDraft(rowDraft, studentId);
    if (Object.keys(errors).length > 0) { setRowErrors(errors); return; }
    onSaveRow(studentId, rowDraft);
    setEditingRowId(null); setRowDraft(null); setRowErrors({});
  }

  function updateRowDraftField(patch: Partial<RowDraft>) {
    setRowDraft(prev => prev ? { ...prev, ...patch } : prev);
  }

  const handleCellKeyDown = useCallback((
    e: React.KeyboardEvent, si: number, sj: number, student: Student, subject: Subject
  ) => {
    if (isLocked) return;
    const current = student.attendance[subject.id] ?? 'P';
    const navigate = (nsi: number, nsj: number) => {
      e.preventDefault();
      const btn = cellRefs.current[nsi]?.[nsj];
      if (btn) { btn.focus(); setFocusedCell({ si: nsi, sj: nsj }); }
    };
    switch (e.key) {
      case 'p': case 'P': onStatusChange(student.id, subject.id, 'P', current); break;
      case 'a': case 'A': onStatusChange(student.id, subject.id, 'A', current); break;
      case 'l': case 'L': onStatusChange(student.id, subject.id, 'L', current); break;
      case 'v': case 'V': onStatusChange(student.id, subject.id, 'Lv', current); break;
      case 'ArrowUp': navigate(Math.max(0, si - 1), sj); break;
      case 'ArrowDown': navigate(Math.min(students.length - 1, si + 1), sj); break;
      case 'ArrowLeft': sj > 0 ? navigate(si, sj - 1) : si > 0 ? navigate(si - 1, subjects.length - 1) : undefined; break;
      case 'ArrowRight': case 'Tab':
        e.preventDefault();
        sj < subjects.length - 1 ? navigate(si, sj + 1) : si < students.length - 1 ? navigate(si + 1, 0) : undefined;
        break;
      case 'Enter': e.preventDefault(); si < students.length - 1 ? navigate(si + 1, sj) : undefined; break;
      case 'Escape': setFocusedCell(null); (e.target as HTMLElement).blur(); break;
    }
  }, [isLocked, students, subjects, onStatusChange]);

  function toggleExpanded(id: string) {
    if (editingRowId === id) return;
    setExpandedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function addCustomColumn() {
    const name = addColName.trim();
    if (!name) return;
    const id = `custom_${Date.now()}`;
    setCustomColumns(prev => [...prev, { id, name, values: {} }]);
    setAddColName('');
    setShowAddColInput(false);
  }

  function removeCustomColumn(id: string) {
    setCustomColumns(prev => prev.filter(c => c.id !== id));
  }

  function setCustomValue(colId: string, studentId: string, value: string) {
    setCustomColumns(prev => prev.map(c => c.id === colId ? { ...c, values: { ...c.values, [studentId]: value } } : c));
  }

  const visibleSubjects = subjects.filter(s => !hiddenSubjectIds.has(s.id));
  const showClass    = !hiddenCols.has('class');
  const showStatus   = !hiddenCols.has('status');
  const showAttPct   = !hiddenCols.has('attendance');
  const showEval     = !hiddenCols.has('evaluation');

  const baseColCount = 4 + visibleSubjects.length + (showClass ? 1 : 0) + (showStatus ? 1 : 0) + (showAttPct ? 1 : 0) + (showEval ? 1 : 0) + customColumns.length;
  const colCount = baseColCount;

  const sticky = 'sticky z-10';
  const stickyHead = 'sticky z-20';

  function stickyBg(si: number, selected: boolean): string {
    if (selected) return 'cell-sel';
    return si % 2 === 0 ? 'cell-even' : 'cell-odd';
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, totalCount);
  const allChecked  = students.length > 0 && students.every(s => selectedIds.has(s.id));
  const someChecked = students.some(s => selectedIds.has(s.id)) && !allChecked;

  const subjectSummary = visibleSubjects.map(sub => ({
    id: sub.id,
    P:  students.filter(s => (s.attendance[sub.id] ?? 'P') === 'P').length,
    A:  students.filter(s => (s.attendance[sub.id] ?? 'P') === 'A').length,
    L:  students.filter(s => (s.attendance[sub.id] ?? 'P') === 'L').length,
    Lv: students.filter(s => (s.attendance[sub.id] ?? 'P') === 'Lv').length,
  }));

  const sums = students.reduce((acc, st) => {
    const statuses = subjects.map(s => st.attendance[s.id] ?? 'P');
    const a  = statuses.filter(s => s === 'A').length;
    const l  = statuses.filter(s => s === 'L').length;
    const lv = statuses.filter(s => s === 'Lv').length;
    if (a === 0 && l === 0 && lv === 0) acc.p++;
    if (a > 0) acc.a++;
    if (l > 0 && a === 0) acc.l++;
    if (lv > 0 && a === 0 && l === 0) acc.lv++;
    return acc;
  }, { p: 0, a: 0, l: 0, lv: 0 });

  const pageNums = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const nums: (number | '...')[] = [1];
    if (page > 3) nums.push('...');
    for (let n = Math.max(2, page - 1); n <= Math.min(totalPages - 1, page + 1); n++) nums.push(n);
    if (page < totalPages - 2) nums.push('...');
    nums.push(totalPages);
    return nums;
  })();

  // Inline edit field
  function EditInput({ value, onChange, error, placeholder, type = 'text', className = '' }: {
    value: string; onChange: (v: string) => void; error?: string;
    placeholder?: string; type?: string; className?: string;
  }) {
    return (
      <div className="relative">
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full h-7 px-2 rounded border text-app-t1 text-xs placeholder-app-t4 focus:outline-none focus:ring-1 bg-app-bg transition-all ${
            error ? 'border-rose-500/70 focus:ring-rose-500/30' : 'border-teal-500/40 focus:ring-teal-500/20 focus:border-teal-500/70'
          } ${className}`}
        />
        {error && (
          <div className="absolute z-30 bottom-full left-0 mb-1 px-2 py-1 rounded-lg bg-rose-600 text-white text-[9px] whitespace-nowrap shadow-lg pointer-events-none">
            {error}
            <div className="absolute top-full left-3 border-4 border-transparent border-t-rose-600" />
          </div>
        )}
      </div>
    );
  }

  function DraftStatusBtn({ status, onChange }: { status: AttendanceStatus; onChange: (s: AttendanceStatus) => void }) {
    return (
      <button type="button" onClick={() => {
        const idx = STATUS_CYCLE.indexOf(status);
        onChange(STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]);
      }} className={`inline-flex items-center justify-center w-9 h-6 rounded border text-[11px] font-bold font-mono cursor-pointer hover:scale-105 active:scale-95 transition-all ${STATUS_STYLE[status]}`}>
        {status}
      </button>
    );
  }

  return (
    <>
      {/* ─── Table Toolbar ─────────────────────────────────────────── */}
      <div className="mx-4 mb-2 flex items-center gap-2 flex-wrap no-print">
        {/* Undo / Redo */}
        <button onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)" aria-label="Undo"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-app-border text-xs text-app-t2 hover:text-app-t1 hover:bg-app-raised disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <RotateCcw className="w-3.5 h-3.5" /><span className="hidden sm:inline">Undo</span>
        </button>
        <button onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)" aria-label="Redo"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-app-border text-xs text-app-t2 hover:text-app-t1 hover:bg-app-raised disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <RotateCw className="w-3.5 h-3.5" /><span className="hidden sm:inline">Redo</span>
        </button>
        <div className="w-px h-5 bg-app-border mx-0.5" />

        {/* Add Row */}
        <button onClick={onAddStudent} disabled={isLocked}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-app-border text-xs text-app-t2 hover:text-teal-500 hover:border-teal-500/40 hover:bg-teal-500/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <Plus className="w-3.5 h-3.5" /><span className="hidden sm:inline">Add Row</span>
        </button>

        {/* ── Manage Columns dropdown ── */}
        <div className="relative" ref={colMenuRef}>
          <button
            onClick={() => { setShowColMenu(v => !v); if (showColMenu) { setShowAddColInput(false); setAddColName(''); } }}
            aria-expanded={showColMenu}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-app-border text-xs text-app-t2 hover:text-app-t1 hover:bg-app-raised transition-all"
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Manage Columns</span>
            {(hiddenCols.size + hiddenSubjectIds.size) > 0 && (
              <span className="ml-0.5 px-1.5 py-px rounded-full bg-indigo-500/20 text-indigo-400 text-[9px] font-bold">
                {hiddenCols.size + hiddenSubjectIds.size}
              </span>
            )}
            <ChevronDown className={`w-3 h-3 transition-transform ${showColMenu ? 'rotate-180' : ''}`} />
          </button>

          {showColMenu && (
            <div className="animate-fade-in absolute top-10 left-0 z-30 w-60 rounded-xl border border-app-border bg-app-surface shadow-float overflow-hidden">
              {/* Built-in columns section */}
              <div className="px-3 py-2 border-b border-app-border/60">
                <p className="text-[9px] font-semibold text-app-t4 uppercase tracking-wider">Built-in Columns</p>
              </div>
              {BUILT_IN_COLS.map(col => {
                const hidden = hiddenCols.has(col);
                return (
                  <button key={col}
                    onClick={() => setHiddenCols(prev => { const n = new Set(prev); n.has(col) ? n.delete(col) : n.add(col); return n; })}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-app-t2 hover:bg-app-raised transition-colors"
                  >
                    <span className={hidden ? 'text-app-t4 line-through' : ''}>{BUILT_IN_LABELS[col]}</span>
                    {hidden ? <EyeOff className="w-3.5 h-3.5 text-app-t4" /> : <Eye className="w-3.5 h-3.5 text-teal-500" />}
                  </button>
                );
              })}

              {/* Subject columns section */}
              <div className="px-3 py-2 border-t border-app-border/60">
                <p className="text-[9px] font-semibold text-app-t4 uppercase tracking-wider">
                  Subject Columns ({subjects.length})
                </p>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {subjects.map(sub => {
                  const hidden = hiddenSubjectIds.has(sub.id);
                  return (
                    <button key={sub.id}
                      onClick={() => setHiddenSubjectIds(prev => { const n = new Set(prev); n.has(sub.id) ? n.delete(sub.id) : n.add(sub.id); return n; })}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-app-t2 hover:bg-app-raised transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${hidden ? 'bg-app-raised text-app-t4' : 'bg-teal-500/10 text-teal-500'}`}>{sub.code}</span>
                        <span className={hidden ? 'text-app-t4 line-through text-[10px]' : 'text-[10px]'}>{sub.name}</span>
                      </span>
                      {hidden ? <EyeOff className="w-3 h-3 text-app-t4" /> : <Eye className="w-3 h-3 text-teal-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom columns section */}
              <div className="border-t border-app-border/60">
                <div className="px-3 py-2">
                  <p className="text-[9px] font-semibold text-app-t4 uppercase tracking-wider">Custom Columns ({customColumns.length})</p>
                </div>
                {customColumns.map(col => (
                  <div key={col.id} className="flex items-center justify-between px-3 py-1.5 group">
                    <span className="text-xs text-app-t2">{col.name}</span>
                    <button onClick={() => removeCustomColumn(col.id)}
                      className="w-5 h-5 rounded flex items-center justify-center text-app-t4 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100">
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Add custom column */}
                {showAddColInput ? (
                  <div className="px-3 pb-2 flex items-center gap-1.5">
                    <input
                      ref={addColInputRef}
                      value={addColName}
                      onChange={e => setAddColName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') addCustomColumn(); if (e.key === 'Escape') { setShowAddColInput(false); setAddColName(''); } }}
                      placeholder="Column name…"
                      className="flex-1 h-7 px-2 rounded border border-teal-500/40 bg-app-bg text-xs text-app-t1 placeholder-app-t4 focus:outline-none focus:ring-1 focus:ring-teal-500/20"
                    />
                    <button onClick={addCustomColumn}
                      className="w-7 h-7 rounded-lg bg-teal-600 hover:bg-teal-500 flex items-center justify-center text-white transition-all">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddColInput(true)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-teal-500 hover:bg-teal-500/5 transition-colors border-t border-app-border/60"
                  >
                    <PlusSquare className="w-3.5 h-3.5" />
                    Add Subject / Custom Column
                  </button>
                )}
              </div>

              {/* Reset all */}
              {(hiddenCols.size + hiddenSubjectIds.size) > 0 && (
                <button
                  onClick={() => { setHiddenCols(new Set()); setHiddenSubjectIds(new Set()); }}
                  className="w-full px-3 py-2 text-[10px] text-app-t4 hover:text-app-t2 hover:bg-app-raised transition-colors border-t border-app-border/60 text-left"
                >
                  Reset to show all columns
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Edit Whole Table → opens modal */}
        <button
          onClick={() => setShowTableEditModal(true)}
          disabled={isLocked}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/20"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit Whole Table
        </button>
      </div>

      {/* ─── Main table card ───────────────────────────────────────── */}
      <div className="mx-4 mb-6 rounded-2xl border border-app-border overflow-hidden bg-app-surface shadow-panel" role="region" aria-label="Attendance table">
        {isLocked && (
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border-b border-indigo-500/20">
            <Lock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" aria-hidden />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Attendance Locked — editing disabled.
            </span>
          </div>
        )}

        {!isLocked && (
          <div className="flex items-center gap-3 px-4 py-2 bg-app-raised/60 border-b border-app-border/60 no-print" aria-hidden="true">
            <span className="text-[10px] text-app-t4">Keys:</span>
            {(['P = Present', 'A = Absent', 'L = Late', 'V = Leave'] as const).map(hint => {
              const [k, , ...rest] = hint.split(' ');
              return (
                <span key={k} className="flex items-center gap-1 text-[10px]">
                  <kbd className="px-1.5 py-0.5 rounded border border-app-border bg-app-surface text-app-t2 font-mono font-bold text-[9px] shadow-sm">{k}</kbd>
                  <span className="text-app-t4">{rest.join(' ')}</span>
                </span>
              );
            })}
            <span className="text-[10px] text-app-t4 ml-1">· Arrows navigate · Click ✏ or "Edit Whole Table"</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table
            className="w-full text-xs"
            style={{ minWidth: `${580 + visibleSubjects.length * 80}px`, borderCollapse: 'separate', borderSpacing: 0 }}
            role="grid"
            aria-label="Student attendance records"
          >
            <thead>
              <tr className="border-b border-app-border text-app-t3 uppercase tracking-wider text-[10px] font-semibold">
                <th scope="col" className={`${stickyHead} cell-head left-0 w-10 px-3 py-3 text-center border-r border-app-border/60`}>
                  <input type="checkbox" checked={allChecked}
                    ref={el => { if (el) el.indeterminate = someChecked; }}
                    onChange={e => onSelectAll(e.target.checked)}
                    aria-label="Select all" className="w-3.5 h-3.5 rounded accent-teal-500 cursor-pointer" />
                </th>
                <th scope="col" className={`${stickyHead} cell-head left-10 w-12 px-2 py-3 text-center border-r border-app-border/60`}>Roll</th>
                <th scope="col" className={`${stickyHead} cell-head left-[88px] w-52 px-3 py-3 text-left border-r border-app-border/60`}>Student</th>
                {showClass && <th scope="col" className="px-2 py-3 text-center w-14">Class</th>}
                {visibleSubjects.map(s => (
                  <th key={s.id} scope="col" className="px-2 py-3 text-center w-20">
                    <span
                      className="cursor-help"
                      onMouseEnter={e => {
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        setSubTooltip({ subId: s.id, name: s.name, x: rect.left + rect.width / 2, y: rect.top });
                      }}
                      onMouseLeave={() => setSubTooltip(null)}
                    >
                      {s.code}
                    </span>
                  </th>
                ))}
                {customColumns.map(col => (
                  <th key={col.id} scope="col" className="px-2 py-3 text-center w-24 text-teal-400">{col.name}</th>
                ))}
                {showStatus   && <th scope="col" className="px-3 py-3 text-center w-36">Today Status</th>}
                {showAttPct   && <th scope="col" className="px-3 py-3 text-center w-28">Att. %</th>}
                {showEval     && <th scope="col" className="px-3 py-3 text-left w-40">Evaluation</th>}
                <th scope="col" className={`${stickyHead} cell-head right-0 w-36 px-3 py-3 text-center border-l border-app-border/60`}>Actions</th>
              </tr>

              {/* Subject summary row */}
              <tr className="border-b border-app-border text-[9px]">
                <td className={`${stickyHead} cell-sub left-0 px-2 py-1.5 text-center border-r border-app-border/60`} />
                <td className={`${stickyHead} cell-sub left-10 px-2 py-1.5 border-r border-app-border/60`} />
                <td className={`${stickyHead} cell-sub left-[88px] px-3 py-1.5 border-r border-app-border/60`}>
                  <span className="text-app-t4 font-semibold uppercase tracking-wider text-[9px]">Subject Summary</span>
                </td>
                {showClass && <td className="px-2 py-1.5" />}
                {subjectSummary.map(s => (
                  <td key={s.id} className="px-1 py-1.5 text-center">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">P:{s.P}</span>
                      <span className="text-rose-600 dark:text-rose-400 font-mono">A:{s.A}</span>
                      <span className="text-amber-600 dark:text-amber-400 font-mono">L:{s.L}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-mono">V:{s.Lv}</span>
                    </div>
                  </td>
                ))}
                {customColumns.map(col => <td key={col.id} className="px-2 py-1.5" />)}
                {showStatus  && <td className="px-2 py-1.5" />}
                {showAttPct  && <td className="px-2 py-1.5" />}
                {showEval    && <td className="px-2 py-1.5" />}
                <td className={`${stickyHead} cell-sub right-0 px-2 py-1.5 border-l border-app-border/60`} />
              </tr>
            </thead>

            <tbody>
              {students.map((st, si) => {
                const todayStatus = computeTodayStatus(st.attendance, subjects);
                const isSelected  = selectedIds.has(st.id);
                const isExpanded  = expandedIds.has(st.id);
                const displayRating = st.manualRating !== null ? st.manualRating : autoRating(st.monthlyAvg);
                const stickyCls   = stickyBg(si, isSelected);
                const rowCls      = isSelected ? 'row-sel' : si % 2 !== 0 ? 'row-alt' : '';
                const isRowLocked = lockedRowIds.has(st.id);
                const isTier1     = editingRowId === st.id;
                const draft       = isTier1 ? rowDraft : null;
                const errors      = isTier1 ? rowErrors : {};

                return (
                  <Fragment key={st.id}>
                    <tr
                      className={`border-b border-app-border/50 transition-colors group ${rowCls} ${isTier1 ? 'ring-2 ring-inset ring-teal-500/40' : 'hover:bg-app-hover/40 cursor-pointer'}`}
                      aria-selected={isSelected}
                      onClick={e => {
                        const tgt = e.target as HTMLElement;
                        if (tgt.closest('button,input,a,select,textarea')) return;
                        if (!isTier1) toggleExpanded(st.id);
                      }}
                    >
                      {/* Checkbox */}
                      <td className={`${sticky} ${stickyCls} left-0 w-10 px-3 py-2 text-center border-r border-app-border/40`} onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={isSelected} onChange={e => onSelect(st.id, e.target.checked)}
                          aria-label={`Select ${st.name}`} className="w-3.5 h-3.5 rounded accent-teal-500 cursor-pointer" />
                      </td>

                      {/* Roll */}
                      <td className={`${sticky} ${stickyCls} left-10 w-12 px-2 py-2 text-center font-mono font-semibold text-app-t2 border-r border-app-border/40`} onClick={e => isTier1 && e.stopPropagation()}>
                        {isTier1 && draft ? (
                          <EditInput value={draft.rollNo} onChange={v => updateRowDraftField({ rollNo: v })} error={errors.rollNo} type="number" className="w-14 font-mono text-center" />
                        ) : (
                          st.rollNo
                        )}
                      </td>

                      {/* Student */}
                      <td className={`${sticky} ${stickyCls} left-[88px] w-52 px-3 py-2 border-r border-app-border/40`} onClick={e => isTier1 && e.stopPropagation()}>
                        {isTier1 && draft ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: st.avatarColor }}>{st.initials}</div>
                            <div className="flex-1 min-w-0">
                              <EditInput value={draft.name} onChange={v => updateRowDraftField({ name: v })} error={errors.name} placeholder="Full name" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group/name relative">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 shadow-sm" style={{ background: st.avatarColor }} aria-hidden>{st.initials}</div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-app-t1 truncate leading-tight">{st.name}</p>
                              <p className="text-[10px] text-app-t4 font-mono">{st.id}</p>
                            </div>
                            {isRowLocked && <Lock className="w-3 h-3 text-amber-500 flex-shrink-0 ml-auto" aria-label="Row locked" />}
                            {!isRowLocked && <ChevronDown className={`w-3 h-3 text-app-t4 ml-auto flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} aria-hidden />}
                            {/* Audit Trail tooltip */}
                            <div className="pointer-events-none absolute left-0 bottom-full mb-2 z-30 px-3 py-2 rounded-xl border border-app-border bg-app-surface shadow-float whitespace-nowrap opacity-0 group-hover/name:opacity-100 transition-opacity" role="tooltip">
                              <p className="text-[10px] font-semibold text-app-t1 mb-0.5">Audit Trail</p>
                              <p className="text-[10px] text-app-t3">Last edited by: <span className="text-app-t1 font-medium">{teacherName}</span></p>
                              <p className="text-[10px] text-app-t3">{st.lastUpdated}</p>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Class */}
                      {showClass && (
                        <td className="px-2 py-2 text-center" onClick={e => isTier1 && e.stopPropagation()}>
                          {isTier1 && draft ? (
                            <input value={draft.classSection} onChange={e => updateRowDraftField({ classSection: e.target.value })}
                              className="w-16 h-7 px-1.5 rounded border border-teal-500/40 bg-app-bg text-center text-[10px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 focus:outline-none" />
                          ) : (
                            <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono text-[10px] font-semibold">{st.classSection}</span>
                          )}
                        </td>
                      )}

                      {/* Subject attendance badges */}
                      {visibleSubjects.map((sub, sj) => {
                        if (isTier1 && draft) {
                          const draftStatus = (draft.attendance[sub.id] ?? 'P') as AttendanceStatus;
                          return (
                            <td key={sub.id} className="px-1.5 py-2 text-center" onClick={e => e.stopPropagation()}>
                              <DraftStatusBtn status={draftStatus}
                                onChange={s => updateRowDraftField({ attendance: { ...draft.attendance, [sub.id]: s } })} />
                            </td>
                          );
                        }
                        const status = st.attendance[sub.id] ?? 'P';
                        const isFocused = focusedCell?.si === si && focusedCell?.sj === sj;
                        return (
                          <td key={sub.id} className="px-1.5 py-2 text-center" onClick={e => e.stopPropagation()}>
                            <button
                              ref={el => { if (!cellRefs.current[si]) cellRefs.current[si] = []; cellRefs.current[si][sj] = el; }}
                              disabled={isLocked}
                              onClick={() => {
                                if (isLocked) return;
                                const idx = STATUS_CYCLE.indexOf(status as AttendanceStatus);
                                onStatusChange(st.id, sub.id, STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length], status as AttendanceStatus);
                              }}
                              onFocus={() => setFocusedCell({ si, sj })}
                              onBlur={() => setFocusedCell(null)}
                              onKeyDown={e => handleCellKeyDown(e, si, sj, st, sub)}
                              aria-label={`${sub.name}: ${status}. Click to cycle`}
                              className={`inline-flex items-center justify-center w-9 h-6 rounded border text-[11px] font-bold font-mono transition-all ${STATUS_STYLE[status as AttendanceStatus]} ${isLocked ? 'cursor-not-allowed opacity-60' : 'hover:scale-105 active:scale-95 cursor-pointer'} ${isFocused ? `ring-2 ring-offset-1 ring-offset-app-surface ${STATUS_FOCUS[status as AttendanceStatus]}` : ''}`}
                            >
                              {status}
                            </button>
                          </td>
                        );
                      })}

                      {/* Custom columns */}
                      {customColumns.map(col => (
                        <td key={col.id} className="px-2 py-2 text-center" onClick={e => e.stopPropagation()}>
                          <input
                            value={col.values[st.id] ?? ''}
                            onChange={e => setCustomValue(col.id, st.id, e.target.value)}
                            placeholder="—"
                            className="w-20 h-6 px-1.5 rounded border border-app-border bg-app-raised text-[10px] text-app-t2 text-center focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 placeholder-app-t4"
                          />
                        </td>
                      ))}

                      {/* Today Status */}
                      {showStatus && (
                        <td className="px-2 py-2 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-lg border text-[10px] font-semibold whitespace-nowrap ${todayStatus.cls}`}>{todayStatus.label}</span>
                        </td>
                      )}

                      {/* Att % */}
                      {showAttPct && (
                        <td className="px-3 py-2"><AttBar pct={
                          subjects.length > 0
                            ? Math.round(subjects.reduce((sum, s) => {
                                const status = st.attendance[s.id] ?? 'P';
                                return sum + (status === 'P' || status === 'Lv' ? 1 : status === 'L' ? 0.5 : 0);
                              }, 0) / subjects.length * 100)
                            : 100
                        } /></td>
                      )}

                      {/* Evaluation */}
                      {showEval && (
                        <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1">
                              <StarRating rating={displayRating} onChange={r => onRatingChange(st.id, r)} disabled={isLocked} />
                              {st.manualRating === null && <span className="text-[9px] text-app-t4 italic ml-1">auto</span>}
                            </div>
                            {editingComment === st.id ? (
                              <div className="flex items-center gap-1">
                                <input autoFocus value={commentDraft}
                                  onChange={e => setCommentDraft(e.target.value)}
                                  onBlur={() => { onCommentChange(st.id, commentDraft); setEditingComment(null); }}
                                  onKeyDown={e => { if (e.key === 'Enter') { onCommentChange(st.id, commentDraft); setEditingComment(null); } if (e.key === 'Escape') setEditingComment(null); }}
                                  aria-label="Edit comment"
                                  className="flex-1 text-[10px] bg-app-raised border border-teal-500/40 rounded px-1.5 py-0.5 text-app-t1 outline-none w-24"
                                />
                                <button onClick={() => { onCommentChange(st.id, commentDraft); setEditingComment(null); }} className="text-teal-500">
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => { if (!isLocked) { setEditingComment(st.id); setCommentDraft(st.comment); } }}
                                disabled={isLocked}
                                className={`text-[10px] text-app-t3 transition-colors truncate max-w-[130px] block text-left ${!isLocked ? 'hover:text-app-t1 cursor-text' : 'cursor-default'}`}>
                                {st.comment || <span className="italic text-app-t4">Add comment…</span>}
                              </button>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Actions */}
                      <td className={`${sticky} ${stickyCls} right-0 w-36 px-2 py-2 border-l border-app-border/40`} onClick={e => e.stopPropagation()}>
                        {isTier1 ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => commitRowEdit(st.id)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-semibold transition-all">
                              <Check className="w-3 h-3" /> Save
                            </button>
                            <button onClick={cancelRowEdit}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-app-border text-app-t3 hover:text-app-t1 hover:bg-app-raised text-[10px] transition-all">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-0.5">
                            {/* Edit row (Tier 1) */}
                            <button onClick={() => startRowEdit(st)} title="Edit row inline" aria-label={`Edit ${st.name}`}
                              disabled={isLocked || isRowLocked}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isLocked || isRowLocked ? 'text-app-t4 cursor-not-allowed' : 'text-app-t3 hover:text-teal-500 hover:bg-teal-500/10'}`}>
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Print student report */}
                            <button
                              onClick={() => printStudentReport(st, subjects, teacherName)}
                              title="Print individual student report"
                              aria-label={`Print report for ${st.name}`}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-app-t3 hover:text-indigo-500 hover:bg-indigo-500/10 transition-all"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            <button onClick={() => setMessageStudentId(st.id)} title="Message parent" aria-label={`Message parent of ${st.name}`}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-app-t3 hover:text-blue-500 hover:bg-blue-500/10 transition-all">
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>

                            {/* Row options ⋮ — portal-based to escape overflow clipping */}
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                if (portalMenuId === st.id) {
                                  setPortalMenuId(null);
                                } else {
                                  setPortalMenuId(st.id);
                                  setPortalMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                                }
                              }}
                              aria-label="More options" aria-expanded={portalMenuId === st.id}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-app-t3 hover:text-app-t1 hover:bg-app-raised transition-all">
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {isExpanded && !isTier1 && (
                      <tr className="border-b border-app-border/60">
                        <td colSpan={colCount} className="px-0 py-0 cell-exp">
                          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-6 border-l-2 border-teal-500/40 ml-[88px]">
                            <div>
                              <p className="text-[10px] text-app-t4 uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
                                <User className="w-3 h-3" aria-hidden /> Guardian Information
                              </p>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                    <User className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" aria-hidden />
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-app-t1">{st.guardian.name}</p>
                                    <p className="text-[10px] text-app-t3">{st.guardian.relation}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-app-t2">
                                  <Phone className="w-3 h-3 text-app-t4" aria-hidden />
                                  <span className="font-mono">{st.guardian.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-app-t3">
                                  <Phone className="w-3 h-3 text-app-t4" aria-hidden />
                                  <span className="font-mono">Student: {st.phone}</span>
                                </div>
                                <p className="text-[10px] text-app-t4 mt-1">
                                  Updated: <span className="text-app-t3">{st.lastUpdated}</span>
                                  <span className="mx-1">·</span>By: <span className="text-app-t3">{teacherName}</span>
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] text-app-t4 uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
                                <TrendingUp className="w-3 h-3" aria-hidden /> Weekly Attendance Trend
                              </p>
                              {st.weeklyHistory.length > 0
                                ? <WeekTimeline history={st.weeklyHistory} />
                                : <p className="text-xs text-app-t4">No history available</p>}
                              <div className="flex items-center gap-3 mt-3">
                                {(['P','A','L','Lv'] as AttendanceStatus[]).map(s => (
                                  <div key={s} className="flex items-center gap-1">
                                    <div className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[s]}`} aria-hidden />
                                    <span className="text-[10px] text-app-t3">{s === 'Lv' ? 'Leave' : s === 'P' ? 'Present' : s === 'A' ? 'Absent' : 'Late'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] text-app-t4 uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
                                <BookOpen className="w-3 h-3" aria-hidden /> Syllabus Progress
                              </p>
                              <div className="space-y-2">
                                {subjects.slice(0, 5).map(sub => <SyllabusBar key={sub.id} subjectId={sub.id} name={sub.code} />)}
                                {subjects.length > 5 && <p className="text-[10px] text-app-t4 text-center mt-1">+{subjects.length - 5} more subjects</p>}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}

              {students.length === 0 && (
                <tr><td colSpan={colCount} className="px-4 py-12 text-center text-app-t3 text-sm">No students match the current filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-app-border bg-app-raised/50 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-app-surface border border-app-border text-app-t2 text-xs font-mono shadow-sm">
              {start}–{end} of {totalCount}
              <span className="mx-1.5 text-app-t4">|</span>
              <span className="text-emerald-600 dark:text-emerald-400">P:{sums.p}</span><span className="mx-1 text-app-t4">·</span>
              <span className="text-rose-600 dark:text-rose-400">A:{sums.a}</span><span className="mx-1 text-app-t4">·</span>
              <span className="text-amber-600 dark:text-amber-400">L:{sums.l}</span><span className="mx-1 text-app-t4">·</span>
              <span className="text-blue-600 dark:text-blue-400">Lv:{sums.lv}</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs text-app-t3">
              <label htmlFor="page-size">Rows:</label>
              <select id="page-size" value={pageSize}
                onChange={e => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}
                className="h-7 px-1.5 rounded-lg border border-app-border bg-app-surface text-app-t1 text-xs focus:outline-none focus:border-teal-500/60 cursor-pointer shadow-sm">
                {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <nav aria-label="Table pagination">
            <div className="flex items-center gap-1">
              <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-app-t3 hover:text-app-t1 hover:bg-app-raised disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {pageNums.map((n, i) =>
                n === '...'
                  ? <span key={`e${i}`} className="w-7 text-center text-app-t4 text-xs">…</span>
                  : <button key={n} onClick={() => onPageChange(n as number)} aria-label={`Page ${n}`}
                      aria-current={n === page ? 'page' : undefined}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold font-mono transition-all ${n === page ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30' : 'text-app-t3 hover:text-app-t1 hover:bg-app-raised'}`}>
                      {n}
                    </button>
              )}
              <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages || totalPages === 0} aria-label="Next page"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-app-t3 hover:text-app-t1 hover:bg-app-raised disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </nav>
        </div>

        {/* Print signatures */}
        <div className="hidden print:flex items-end justify-around px-8 py-8 mt-8 border-t border-app-border">
          {['Class Teacher', 'Headmaster', 'Parent/Guardian'].map(sig => (
            <div key={sig} className="text-center">
              <div className="w-40 h-px bg-app-border-2 mb-2" />
              <p className="text-xs text-app-t3">{sig}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="animate-fade-in fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setConfirmDelete(null)} role="dialog" aria-modal="true">
          <div className="w-80 rounded-2xl border border-app-border bg-app-surface p-6 shadow-modal" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-semibold text-app-t1">Delete Student?</h3>
            </div>
            <p className="text-xs text-app-t2 mb-5 leading-relaxed">
              Permanently remove <strong className="text-app-t1">{students.find(s => s.id === confirmDelete)?.name ?? allStudents.find(s => s.id === confirmDelete)?.name}</strong> from the attendance record.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-lg border border-app-border text-app-t2 hover:text-app-t1 hover:bg-app-raised text-xs transition-all">Cancel</button>
              <button onClick={() => { onDelete(confirmDelete); setConfirmDelete(null); }} className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Table Edit Modal */}
      {showTableEditModal && (
        <TableEditModal
          students={students}
          allStudents={allStudents}
          subjects={subjects}
          lockedRowIds={lockedRowIds}
          teacherName={teacherName}
          onSave={onSaveAll}
          onClose={() => setShowTableEditModal(false)}
        />
      )}

      {/* Parent Message Modal */}
      {messageStudentId && (() => {
        const msgSt = students.find(s => s.id === messageStudentId) ?? allStudents.find(s => s.id === messageStudentId);
        if (!msgSt) return null;
        return (
          <ParentMessageModal
            student={msgSt}
            subjects={subjects}
            teacherName={teacherName}
            schoolName={schoolName}
            onClose={() => setMessageStudentId(null)}
          />
        );
      })()}

      {/* Portal: ⋮ row action menu — rendered outside overflow container */}
      {portalMenuId && createPortal(
        <>
          {/* Click-outside backdrop */}
          <div className="fixed inset-0 z-[99]" onClick={() => setPortalMenuId(null)} />
          <div
            className="animate-fade-in fixed z-[100] w-48 rounded-xl border border-app-border bg-app-surface shadow-float overflow-hidden"
            style={{ top: portalMenuPos.top, right: portalMenuPos.right }}
          >
            {(() => {
              const menuSt = students.find(s => s.id === portalMenuId) ?? allStudents.find(s => s.id === portalMenuId);
              const menuRowLocked = lockedRowIds.has(portalMenuId);
              return (
                <>
                  <button onClick={() => { if (menuSt) onInsertRowAfter(menuSt.id); setPortalMenuId(null); }} disabled={isLocked}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-app-t2 hover:bg-app-raised hover:text-app-t1 disabled:opacity-40 disabled:cursor-not-allowed">
                    <Plus className="w-3.5 h-3.5 text-teal-500" /> Insert Row Below
                  </button>
                  <button onClick={() => { if (menuSt) onDuplicateRow(menuSt.id); setPortalMenuId(null); }} disabled={isLocked}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-app-t2 hover:bg-app-raised hover:text-app-t1 disabled:opacity-40 disabled:cursor-not-allowed">
                    <Copy className="w-3.5 h-3.5 text-indigo-400" /> Duplicate Row
                  </button>
                  <div className="border-t border-app-border/60" />
                  <button onClick={() => { if (menuSt) onRowLockToggle(menuSt.id); setPortalMenuId(null); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-app-raised">
                    {menuRowLocked
                      ? <><Unlock className="w-3.5 h-3.5 text-amber-400" /><span className="text-amber-500">Unlock Row</span></>
                      : <><Lock className="w-3.5 h-3.5 text-app-t4" /><span className="text-app-t2">Lock Row</span></>}
                  </button>
                  <div className="border-t border-app-border/60" />
                  <button onClick={() => { if (menuSt) setConfirmDelete(menuSt.id); setPortalMenuId(null); }} disabled={isLocked}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-rose-500 hover:bg-rose-500/10 disabled:opacity-40 disabled:cursor-not-allowed">
                    <Trash2 className="w-3.5 h-3.5" /> Delete Row
                  </button>
                </>
              );
            })()}
          </div>
        </>,
        document.body
      )}

      {/* Portal: subject header tooltip */}
      {subTooltip && createPortal(
        <div
          className="fixed z-[100] pointer-events-none"
          style={{ top: subTooltip.y - 8, left: subTooltip.x, transform: 'translate(-50%, -100%)' }}
        >
          <div className="px-2.5 py-1.5 rounded-lg bg-app-surface border border-app-border text-app-t1 text-[11px] font-medium whitespace-nowrap shadow-float">
            {subTooltip.name}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-app-border" />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
