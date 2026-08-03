import { useState, useRef, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import type { Student, Subject, AttendanceStatus, RowDraft } from '../types';

interface Props {
  students: Student[];
  allStudents: Student[];
  subjects: Subject[];
  lockedRowIds: Set<string>;
  teacherName: string;
  onSave: (updates: Array<{ id: string; draft: RowDraft }>) => void;
  onClose: () => void;
}

const STATUS_CYCLE: AttendanceStatus[] = ['P', 'A', 'L', 'Lv'];
const STATUS_STYLE: Record<AttendanceStatus, string> = {
  P:  'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-400/40',
  A:  'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-400/40',
  L:  'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-400/40',
  Lv: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-400/40',
};

function studentToDraft(st: Student): RowDraft {
  return {
    rollNo: String(st.rollNo),
    name: st.name,
    classSection: st.classSection,
    attendance: { ...st.attendance },
    comment: st.comment,
    manualRating: st.manualRating,
    guardianName: st.guardian.name,
    guardianPhone: st.guardian.phone,
    guardianRelation: st.guardian.relation,
  };
}

function validate(draft: RowDraft, id: string, allStudents: Student[]): string[] {
  const errors: string[] = [];
  if (!draft.name.trim()) errors.push('Name is required');
  const roll = parseInt(draft.rollNo);
  if (isNaN(roll) || roll < 1) errors.push('Invalid roll number');
  else if (allStudents.some(s => s.rollNo === roll && s.id !== id)) errors.push('Duplicate roll number');
  return errors;
}

export default function TableEditModal({
  students, allStudents, subjects, lockedRowIds, teacherName, onSave, onClose,
}: Props) {
  const [drafts, setDrafts] = useState<Record<string, RowDraft>>(() => {
    const d: Record<string, RowDraft> = {};
    students.forEach(st => { if (!lockedRowIds.has(st.id)) d[st.id] = studentToDraft(st); });
    return d;
  });
  const [showErrors, setShowErrors] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Trap Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  function patchDraft(id: string, patch: Partial<RowDraft>) {
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  function patchAttendance(id: string, subId: string, status: AttendanceStatus) {
    setDrafts(prev => ({
      ...prev,
      [id]: { ...prev[id], attendance: { ...prev[id].attendance, [subId]: status } },
    }));
  }

  function cycleStatus(id: string, subId: string) {
    const cur: AttendanceStatus = (drafts[id]?.attendance[subId] ?? 'P') as AttendanceStatus;
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(cur) + 1) % STATUS_CYCLE.length];
    patchAttendance(id, subId, next);
  }

  const rowErrors: Record<string, string[]> = {};
  Object.entries(drafts).forEach(([id, draft]) => {
    const errs = validate(draft, id, allStudents);
    if (errs.length) rowErrors[id] = errs;
  });
  const hasErrors = Object.keys(rowErrors).length > 0;

  function handleSave() {
    if (hasErrors) { setShowErrors(true); return; }
    const updates = Object.entries(drafts).map(([id, draft]) => ({ id, draft }));
    onSave(updates);
    onClose();
  }

  const editableCount = Object.keys(drafts).length;
  const lockedCount   = students.filter(s => lockedRowIds.has(s.id)).length;

  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-[80] flex flex-col bg-app-bg/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Full table edit"
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b border-app-border flex-shrink-0"
        style={{ background: 'var(--app-nav)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-app-t1">Full Table Edit</h2>
            <p className="text-[10px] text-app-t4">
              {editableCount} editable row{editableCount !== 1 ? 's' : ''}
              {lockedCount > 0 && <span className="ml-2 text-amber-500">· {lockedCount} locked (skipped)</span>}
            </p>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-2">
          {showErrors && hasErrors && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs animate-fade-in">
              <AlertTriangle className="w-3.5 h-3.5" />
              {Object.keys(rowErrors).length} row{Object.keys(rowErrors).length > 1 ? 's have' : ' has'} errors
            </span>
          )}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-app-border text-app-t2 hover:text-app-t1 hover:bg-app-raised text-xs transition-all"
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md ${
              showErrors && hasErrors
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Apply All Changes
          </button>
        </div>
      </div>

      {/* ── Progress banner ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-6 py-2.5 border-b border-app-border bg-app-raised/50 flex-shrink-0 no-print">
        <span className="text-[10px] text-app-t4 uppercase tracking-wider font-semibold">
          Editing {editableCount} rows · {subjects.length} subjects
        </span>
        <div className="flex items-center gap-1 ml-auto text-[10px] text-app-t3">
          Click subject badges to cycle P → A → L → Lv
        </div>
        {lockedCount > 0 && (
          <span className="text-[10px] text-amber-500">
            {lockedCount} locked row{lockedCount > 1 ? 's' : ''} excluded
          </span>
        )}
      </div>

      {/* ── Spreadsheet table ───────────────────────────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-auto">
        <table
          className="w-full text-xs"
          style={{ minWidth: `${520 + subjects.length * 70}px`, borderCollapse: 'separate', borderSpacing: 0 }}
        >
          <thead>
            <tr className="text-[10px] text-app-t3 uppercase tracking-wider font-semibold border-b border-app-border">
              <th className="sticky top-0 z-20 cell-head left-0 w-10 px-3 py-3 text-center border-r border-app-border/60">#</th>
              <th className="sticky top-0 z-20 cell-head w-10 px-2 py-3 text-center border-r border-app-border/60">Roll</th>
              <th className="sticky top-0 z-20 cell-head w-52 px-3 py-3 text-left border-r border-app-border/60">Student Name</th>
              <th className="sticky top-0 z-20 cell-head w-14 px-2 py-3 text-center">Class</th>
              {subjects.map(s => (
                <th key={s.id} className="sticky top-0 z-20 cell-head px-2 py-3 text-center w-16" title={s.name}>{s.code}</th>
              ))}
              <th className="sticky top-0 z-20 cell-head px-3 py-3 text-left w-48">Comment</th>
              <th className="sticky top-0 z-20 cell-head px-3 py-3 text-center w-20">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((st, idx) => {
              const isLocked = lockedRowIds.has(st.id);
              const draft = drafts[st.id];
              const errors = showErrors ? (rowErrors[st.id] ?? []) : [];
              const hasErr = errors.length > 0;
              const rowBg = isLocked ? 'bg-app-raised/30' : idx % 2 === 0 ? 'cell-even' : 'cell-odd';
              const isExpanded = expandedId === st.id;

              return (
                <>
                  <tr
                    key={st.id}
                    className={`border-b border-app-border/40 transition-colors ${rowBg} ${hasErr ? 'ring-1 ring-inset ring-rose-500/40' : ''}`}
                  >
                    {/* Index */}
                    <td className="sticky left-0 z-10 px-3 py-2 text-center text-app-t4 font-mono cell-even border-r border-app-border/40">
                      {idx + 1}
                    </td>

                    {/* Roll */}
                    <td className="sticky left-10 z-10 px-2 py-2 border-r border-app-border/40 cell-even">
                      {isLocked ? (
                        <span className="font-mono text-app-t3">{st.rollNo}</span>
                      ) : (
                        <input
                          type="number"
                          value={draft?.rollNo ?? ''}
                          onChange={e => patchDraft(st.id, { rollNo: e.target.value })}
                          className={`w-14 h-7 px-2 rounded border bg-app-bg font-mono text-xs text-center text-app-t1 focus:outline-none focus:ring-1 ${hasErr && errors.some(e => e.includes('roll')) ? 'border-rose-500/60 focus:ring-rose-500/20' : 'border-teal-500/30 focus:ring-teal-500/20 focus:border-teal-500/60'}`}
                        />
                      )}
                    </td>

                    {/* Name */}
                    <td className="sticky left-[88px] z-10 px-3 py-2 border-r border-app-border/40 cell-even">
                      {isLocked ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: st.avatarColor }}>{st.initials}</div>
                          <span className="text-app-t3 text-xs">{st.name}</span>
                          <span className="ml-auto text-[9px] text-amber-500 font-semibold">LOCKED</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: st.avatarColor }}>{st.initials}</div>
                          <div className="flex-1">
                            <input
                              value={draft?.name ?? ''}
                              onChange={e => patchDraft(st.id, { name: e.target.value })}
                              placeholder="Full name"
                              className={`w-full h-7 px-2 rounded border bg-app-bg text-xs text-app-t1 focus:outline-none focus:ring-1 ${hasErr && errors.some(e => e.includes('Name')) ? 'border-rose-500/60 focus:ring-rose-500/20' : 'border-teal-500/30 focus:ring-teal-500/20 focus:border-teal-500/60'}`}
                            />
                            {hasErr && errors.length > 0 && (
                              <p className="text-[9px] text-rose-400 mt-0.5 leading-tight">{errors[0]}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Class */}
                    <td className="px-2 py-2 text-center">
                      {isLocked ? (
                        <span className="text-app-t3 text-[10px] font-mono">{st.classSection}</span>
                      ) : (
                        <input
                          value={draft?.classSection ?? ''}
                          onChange={e => patchDraft(st.id, { classSection: e.target.value })}
                          className="w-16 h-7 px-1 rounded border border-teal-500/30 bg-app-bg text-[10px] font-mono text-center text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-1 focus:ring-teal-500/20"
                        />
                      )}
                    </td>

                    {/* Subject attendance */}
                    {subjects.map(sub => {
                      const status: AttendanceStatus = isLocked
                        ? (st.attendance[sub.id] ?? 'P') as AttendanceStatus
                        : (draft?.attendance[sub.id] ?? 'P') as AttendanceStatus;
                      return (
                        <td key={sub.id} className="px-1 py-2 text-center">
                          {isLocked ? (
                            <span className={`inline-flex items-center justify-center w-9 h-6 rounded border text-[11px] font-bold font-mono opacity-50 ${STATUS_STYLE[status]}`}>{status}</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => cycleStatus(st.id, sub.id)}
                              title={`${sub.name}: ${status} — click to cycle`}
                              className={`inline-flex items-center justify-center w-9 h-6 rounded border text-[11px] font-bold font-mono cursor-pointer hover:scale-105 active:scale-95 transition-transform ${STATUS_STYLE[status]}`}
                            >
                              {status}
                            </button>
                          )}
                        </td>
                      );
                    })}

                    {/* Comment */}
                    <td className="px-3 py-2">
                      {isLocked ? (
                        <span className="text-[10px] text-app-t4 italic">{st.comment || '—'}</span>
                      ) : (
                        <input
                          value={draft?.comment ?? ''}
                          onChange={e => patchDraft(st.id, { comment: e.target.value })}
                          placeholder="Optional note…"
                          className="w-full h-7 px-2 rounded border border-teal-500/30 bg-app-bg text-[10px] text-app-t1 placeholder-app-t4 focus:outline-none focus:ring-1 focus:ring-teal-500/20"
                        />
                      )}
                    </td>

                    {/* Overall status indicator */}
                    <td className="px-3 py-2 text-center">
                      {(() => {
                        const att = isLocked ? st.attendance : (draft?.attendance ?? {});
                        const allP  = subjects.every(sub => (att[sub.id] ?? 'P') === 'P');
                        const anyA  = subjects.some(sub => (att[sub.id] ?? 'P') === 'A');
                        const label = allP ? 'Present' : anyA ? 'Absent' : 'Late/Lv';
                        const cls   = allP
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                          : anyA
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25';
                        return (
                          <span className={`inline-flex px-2 py-0.5 rounded-md border text-[9px] font-semibold whitespace-nowrap ${cls}`}>{label}</span>
                        );
                      })()}
                    </td>
                  </tr>

                  {/* Guardian expand row */}
                  {isExpanded && !isLocked && draft && (
                    <tr key={`${st.id}-expanded`} className="border-b border-app-border/40 bg-indigo-500/5">
                      <td colSpan={4 + subjects.length + 2} className="px-6 py-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] text-app-t4 mb-1 font-semibold uppercase tracking-wider">Guardian Name</label>
                            <input value={draft.guardianName} onChange={e => patchDraft(st.id, { guardianName: e.target.value })}
                              className="w-full h-7 px-2 rounded border border-teal-500/30 bg-app-bg text-xs text-app-t1 focus:outline-none focus:ring-1 focus:ring-teal-500/20" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-app-t4 mb-1 font-semibold uppercase tracking-wider">Phone</label>
                            <input value={draft.guardianPhone} onChange={e => patchDraft(st.id, { guardianPhone: e.target.value })}
                              className="w-full h-7 px-2 rounded border border-teal-500/30 bg-app-bg text-xs text-app-t1 font-mono focus:outline-none focus:ring-1 focus:ring-teal-500/20" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-app-t4 mb-1 font-semibold uppercase tracking-wider">Relation</label>
                            <input value={draft.guardianRelation} onChange={e => patchDraft(st.id, { guardianRelation: e.target.value })}
                              className="w-full h-7 px-2 rounded border border-teal-500/30 bg-app-bg text-xs text-app-t1 focus:outline-none focus:ring-1 focus:ring-teal-500/20" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer with second Save bar ─────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-app-border bg-app-raised/60 flex-shrink-0">
        <div className="text-[10px] text-app-t4">
          Prepared by <span className="text-app-t2 font-medium">{teacherName}</span> ·
          {' '}{editableCount} rows will be updated on "Apply All Changes"
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-app-border text-app-t2 hover:text-app-t1 hover:bg-app-raised text-xs transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Apply All Changes
          </button>
        </div>
      </div>

      {/* Hidden helper — suppress unused imports */}
      {false && <ChevronDown />}
    </div>,
    document.body
  );
}
