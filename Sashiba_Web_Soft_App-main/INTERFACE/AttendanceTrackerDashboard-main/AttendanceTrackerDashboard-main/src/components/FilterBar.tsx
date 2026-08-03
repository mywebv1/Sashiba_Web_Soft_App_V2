import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search, Plus, Upload, Download, UserCheck, Clock, Umbrella,
  ChevronDown, X, FileText, FileSpreadsheet, Printer, SlidersHorizontal,
} from 'lucide-react';
import type { FilterState, AttendanceStatus, Student } from '../types';
import { useMediaQuery } from '../hooks/useMediaQuery';

type ExportFormat = 'excel' | 'csv' | 'pdf' | 'print';

interface Props {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, val: string) => void;
  onClearFilter: (key: keyof FilterState) => void;
  onClearAll: () => void;
  search: string;
  onSearchChange: (v: string) => void;
  onAddStudent: () => void;
  onImport: () => void;
  onBulkStatusRequest: (s: AttendanceStatus) => void;
  onExport: (format: ExportFormat) => void;
  allStudents: Student[];
  lastExportFormat: ExportFormat;
}

const FILTER_LABELS: Record<keyof FilterState, string> = {
  academicYear: 'Session',
  date: 'Date',
  classNum: 'Class',
  section: 'Section',
  group: 'Group',
  shift: 'Shift',
};

const FILTER_OPTIONS: Record<keyof FilterState, { label: string; value: string }[]> = {
  academicYear: [
    { label: '2024–2025', value: '2024-2025' },
    { label: '2025–2026', value: '2025-2026' },
    { label: '2026–2027', value: '2026-2027' },
  ],
  date: [],
  classNum: Array.from({ length: 12 }, (_, i) => ({ label: `Class ${i + 1}`, value: String(i + 1) })),
  section: ['A','B','C','D','E'].map(s => ({ label: `Section ${s}`, value: s })),
  group: [
    { label: 'Science', value: 'Science' },
    { label: 'Commerce', value: 'Commerce' },
    { label: 'Arts', value: 'Arts' },
    { label: 'General', value: 'General' },
  ],
  shift: [
    { label: 'Morning', value: 'Morning' },
    { label: 'Day', value: 'Day' },
  ],
};

// Natural teacher workflow order
const FILTER_ORDER: (keyof FilterState)[] = ['academicYear', 'date', 'classNum', 'section', 'group', 'shift'];

function Select({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`appearance-none h-8 pl-2.5 pr-7 rounded-lg border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-teal-500/30 transition-all cursor-pointer bg-app-surface text-app-t1 ${
          value ? 'border-teal-500/50 bg-teal-500/5' : 'border-app-border hover:border-app-border-2'
        }`}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-app-t3" />
    </div>
  );
}

interface SuggestionItem {
  student: Student;
  matchType: 'name' | 'roll' | 'id' | 'guardian';
}

function hl(text: string, q: string) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-teal-500/20 text-teal-300 rounded px-0.5 not-italic">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

const EXPORT_OPTIONS: { id: ExportFormat; label: string; icon: typeof FileText; color: string }[] = [
  { id: 'excel', label: 'Export Excel (.xlsx)', icon: FileSpreadsheet, color: 'text-emerald-400' },
  { id: 'csv',   label: 'Export CSV',           icon: FileText,        color: 'text-blue-400' },
  { id: 'pdf',   label: 'Save as PDF',          icon: FileText,        color: 'text-rose-400' },
  { id: 'print', label: 'Print',                icon: Printer,         color: 'text-app-t3' },
];

export default function FilterBar({
  filters,
  onFilterChange,
  onClearFilter,
  onClearAll,
  search,
  onSearchChange,
  onAddStudent,
  onImport,
  onBulkStatusRequest,
  onExport,
  allStudents,
  lastExportFormat,
}: Props) {
  const [showExport, setShowExport] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const today = new Date().toISOString().slice(0, 10);

  // Active filters check
  const activeKeys = FILTER_ORDER.filter(k => filters[k]);
  const hasActiveFilters = activeKeys.length > 0 || search.trim().length > 0;

  function chipLabel(k: keyof FilterState): string {
    if (k === 'date') return `Date: ${filters[k]}`;
    const opt = FILTER_OPTIONS[k]?.find(o => o.value === filters[k]);
    return `${FILTER_LABELS[k]}: ${opt?.label ?? filters[k]}`;
  }

  const suggestions: SuggestionItem[] = search.trim().length > 0
    ? allStudents.flatMap((s): SuggestionItem[] => {
        const q = search.toLowerCase();
        if (s.name.toLowerCase().includes(q)) return [{ student: s, matchType: 'name' }];
        if (String(s.rollNo).includes(q)) return [{ student: s, matchType: 'roll' }];
        if (s.id.toLowerCase().includes(q)) return [{ student: s, matchType: 'id' }];
        if (s.guardian.name.toLowerCase().includes(q) || s.guardian.phone.includes(q)) return [{ student: s, matchType: 'guardian' }];
        return [];
      }).slice(0, 6)
    : [];

  useEffect(() => {
    function close(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExport(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const FilterControls = useCallback(() => (
    <div className="flex flex-wrap items-center gap-2">
      {/* Academic Session */}
      <Select label="Session" value={filters.academicYear} options={FILTER_OPTIONS.academicYear} onChange={v => onFilterChange('academicYear', v)} />

      {/* Date */}
      <input
        type="date"
        value={filters.date}
        onChange={e => onFilterChange('date', e.target.value)}
        max={today}
        className="h-8 pl-2.5 pr-2.5 rounded-lg border border-app-border hover:border-app-border-2 bg-app-surface text-app-t1 text-xs font-medium focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all cursor-pointer"
        style={{ colorScheme: 'inherit' }}
      />

      {/* Class */}
      <Select label="Class" value={filters.classNum} options={FILTER_OPTIONS.classNum} onChange={v => onFilterChange('classNum', v)} />

      {/* Section */}
      <Select label="Section" value={filters.section} options={FILTER_OPTIONS.section} onChange={v => onFilterChange('section', v)} />

      {/* Group */}
      <Select label="Group" value={filters.group} options={FILTER_OPTIONS.group} onChange={v => onFilterChange('group', v)} />

      {/* Shift */}
      <Select label="Shift" value={filters.shift} options={FILTER_OPTIONS.shift} onChange={v => onFilterChange('shift', v)} />
    </div>
  ), [filters, onFilterChange, today]);

  return (
    <div className="sticky top-14 z-40 bg-app-nav backdrop-blur-xl border-b border-app-border no-print">
      {/* ── Desktop filter row ── */}
      <div className="px-4 py-2.5 flex items-center gap-2">
        {!isMobile ? (
          <FilterControls />
        ) : (
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 h-8 px-3 rounded-lg border border-app-border text-app-t2 hover:text-app-t1 hover:bg-app-raised text-xs transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            {activeKeys.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-teal-500 text-white text-[9px] font-bold flex items-center justify-center">{activeKeys.length}</span>
            )}
          </button>
        )}

        <div className="flex-1 min-w-0" />

        {/* Search — prominent */}
        <div className="relative" ref={searchRef} style={{ minWidth: isMobile ? '180px' : '300px' }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-teal-500 pointer-events-none" style={{ width: 18, height: 18 }} />
          <input
            id="global-search"
            data-search-input
            type="text"
            value={search}
            onChange={e => { onSearchChange(e.target.value); setShowSuggestions(true); }}
            onFocus={() => search && setShowSuggestions(true)}
            placeholder="Search students by name, roll, ID…"
            aria-label="Search students by name, roll, ID, or guardian"
            className="w-full h-10 pl-10 pr-9 rounded-xl border-2 border-teal-500/50 bg-app-surface text-app-t1 text-sm placeholder-app-t3 font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 hover:border-teal-500/70 transition-all shadow-sm"
          />
          {search && (
            <button onClick={() => { onSearchChange(''); setShowSuggestions(false); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-app-raised hover:bg-teal-500/20 flex items-center justify-center text-app-t3 hover:text-teal-500 transition-all">
              <X className="w-3 h-3" />
            </button>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="animate-fade-in absolute top-11 left-0 right-0 rounded-xl border border-app-border bg-app-surface shadow-xl shadow-black/20 overflow-hidden z-50">
              {suggestions.map(({ student: s, matchType }) => (
                <button
                  key={s.id}
                  onClick={() => { onSearchChange(s.name); setShowSuggestions(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-app-raised transition-colors text-left border-b border-app-border/50 last:border-0"
                >
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white" style={{ background: s.avatarColor }}>
                    {s.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-app-t1">{hl(s.name, search)}</p>
                    <p className="text-[10px] text-app-t3 font-mono-data">
                      Roll {s.rollNo} · {s.id}
                      {matchType === 'guardian' && <span className="text-indigo-400 ml-1">· {s.guardian.name}</span>}
                    </p>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-app-raised border border-app-border text-app-t3 font-semibold flex-shrink-0 uppercase">
                    {matchType}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Chips + quick actions row ── */}
      <div className="px-4 pb-2.5 flex flex-wrap items-center gap-1.5">
        {/* Active filter chips */}
        {activeKeys.map(k => (
          <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-[10px] font-medium">
            {chipLabel(k)}
            <button
              onClick={() => onClearFilter(k)}
              aria-label={`Remove ${FILTER_LABELS[k]} filter`}
              className="w-3.5 h-3.5 rounded-full hover:bg-teal-500/30 flex items-center justify-center transition-all"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
        {search.trim() && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-[10px] font-medium">
            Search: "{search}"
            <button onClick={() => onSearchChange('')} className="w-3.5 h-3.5 rounded-full hover:bg-teal-500/30 flex items-center justify-center transition-all">
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        )}
        {hasActiveFilters && (
          <>
            <button onClick={onClearAll} className="text-[10px] text-app-t3 hover:text-rose-400 underline underline-offset-2 transition-colors ml-1">
              Clear All
            </button>
            <div className="h-3.5 w-px bg-app-border mx-0.5 hidden sm:block" />
          </>
        )}

        {/* Quick Actions */}
        <button onClick={onAddStudent} className="flex items-center gap-1.5 h-7 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-semibold transition-all shadow-sm shadow-teal-500/20">
          <Plus className="w-3 h-3" /> Add Student
        </button>

        <button
          onClick={onImport}
          className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-app-border text-app-t2 hover:text-app-t1 hover:border-app-border-2 hover:bg-app-raised text-[10px] transition-all"
        >
          <Upload className="w-3 h-3" /> Import
        </button>

        {/* Export Dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setShowExport(v => !v)}
            className={`flex items-center gap-1.5 h-7 px-2.5 rounded-lg border text-[10px] transition-all ${
              showExport ? 'border-teal-500/40 bg-teal-500/10 text-teal-400' : 'border-app-border text-app-t2 hover:text-app-t1 hover:border-app-border-2 hover:bg-app-raised'
            }`}
          >
            <Download className="w-3 h-3" />
            {EXPORT_OPTIONS.find(o => o.id === lastExportFormat)?.label.split(' ')[0] ?? 'Export'}
            <ChevronDown className={`w-3 h-3 transition-transform ${showExport ? 'rotate-180' : ''}`} />
          </button>
          {showExport && (
            <div className="animate-fade-in absolute top-9 left-0 w-48 rounded-xl border border-app-border bg-app-surface shadow-xl shadow-black/20 overflow-hidden z-50">
              {EXPORT_OPTIONS.map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => { onExport(opt.id); setShowExport(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-app-raised transition-colors text-left border-b border-app-border/50 last:border-0 ${lastExportFormat === opt.id ? 'bg-app-raised' : ''}`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
                    <span className="text-xs text-app-t1">{opt.label}</span>
                    {lastExportFormat === opt.id && <span className="ml-auto text-[9px] text-teal-400 font-semibold">Last used</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-3.5 w-px bg-app-border hidden sm:block mx-0.5" />

        <button onClick={() => onBulkStatusRequest('P')} className="flex items-center gap-1 h-7 px-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-medium transition-all">
          <UserCheck className="w-3 h-3" /> All Present
        </button>
        <button onClick={() => onBulkStatusRequest('L')} className="flex items-center gap-1 h-7 px-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-[10px] font-medium transition-all">
          <Clock className="w-3 h-3" /> All Late
        </button>
        <button onClick={() => onBulkStatusRequest('Lv')} className="flex items-center gap-1 h-7 px-2.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-[10px] font-medium transition-all">
          <Umbrella className="w-3 h-3" /> All Leave
        </button>
      </div>

      {/* ── Mobile filter drawer ── */}
      {showMobileFilters && (
        <div
          className="animate-fade-in fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          onClick={() => setShowMobileFilters(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[75vh] rounded-t-2xl bg-app-surface border-t border-app-border p-4 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-app-t1">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-app-t3 hover:text-app-t1 hover:bg-app-raised">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {FILTER_ORDER.map(k => (
                <div key={k}>
                  <label className="block text-[10px] font-semibold text-app-t3 uppercase tracking-wider mb-1">{FILTER_LABELS[k]}</label>
                  {k === 'date' ? (
                    <input
                      type="date"
                      value={filters[k]}
                      onChange={e => onFilterChange(k, e.target.value)}
                      max={today}
                      className="w-full h-9 px-3 rounded-lg border border-app-border bg-app-surface text-app-t1 text-sm focus:outline-none focus:border-teal-500/50"
                      style={{ colorScheme: 'inherit' }}
                    />
                  ) : (
                    <select
                      value={filters[k]}
                      onChange={e => onFilterChange(k, e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-app-border bg-app-surface text-app-t1 text-sm focus:outline-none focus:border-teal-500/50 appearance-none"
                    >
                      <option value="">All {FILTER_LABELS[k]}s</option>
                      {FILTER_OPTIONS[k]?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={onClearAll} className="flex-1 h-10 rounded-xl border border-app-border text-app-t2 text-sm hover:bg-app-raised transition-all">
                Clear All
              </button>
              <button onClick={() => setShowMobileFilters(false)} className="flex-1 h-10 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-all">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
