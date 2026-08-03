import { useState, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import {
  X, Upload, FileSpreadsheet, FileText, ChevronRight, ChevronLeft,
  AlertTriangle, Check, ArrowRight, RefreshCw, File,
} from 'lucide-react';
import type { Student, AttendanceStatus } from '../types';

type SystemField = 'name' | 'roll' | 'phone' | 'guardian_name' | 'guardian_phone' | 'skip';
type Step = 'upload' | 'mapping' | 'preview' | 'done';

interface ColumnMapping { csvCol: string; field: SystemField }

interface ImportError { row: number; col: string; message: string }

interface ParsedRow { [key: string]: string }

const FIELD_LABELS: Record<SystemField, string> = {
  name: 'Student Name',
  roll: 'Roll Number',
  phone: 'Student Phone',
  guardian_name: 'Guardian Name',
  guardian_phone: 'Guardian Phone',
  skip: '— Skip Column —',
};

const FIELD_PATTERNS: Record<SystemField, RegExp> = {
  name: /student.?name|full.?name|^name$/i,
  roll: /roll.?no|roll.?num|student.?roll|^roll$/i,
  phone: /^phone$|^mobile$|student.?phone|student.?mobile|contact.?num/i,
  guardian_name: /guardian.?name|parent.?name|father|mother|^guardian$/i,
  guardian_phone: /guardian.?phone|guardian.?mobile|parent.?(phone|mobile|num)/i,
  skip: /^$/,
};

function detectField(colName: string): SystemField {
  const trimmed = colName.trim();
  for (const [field, pattern] of Object.entries(FIELD_PATTERNS) as [SystemField, RegExp][]) {
    if (field === 'skip') continue;
    if (pattern.test(trimmed)) return field;
  }
  return 'skip';
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur = '';
  let inQ = false;
  let row: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQ && text[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      row.push(cur.trim()); cur = '';
    } else if ((ch === '\n' || ch === '\r') && !inQ) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cur.trim()); cur = '';
      if (row.some(c => c !== '')) rows.push(row);
      row = [];
    } else {
      cur += ch;
    }
  }
  row.push(cur.trim());
  if (row.some(c => c !== '')) rows.push(row);
  return rows;
}

async function parseFile(file: File): Promise<{ headers: string[]; rows: ParsedRow[] }> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'csv') {
    const text = await file.text();
    const grid = parseCSV(text);
    if (grid.length < 2) return { headers: [], rows: [] };
    const headers = grid[0];
    const rows = grid.slice(1).map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ''])));
    return { headers, rows };
  }

  // XLSX / XLS
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: '' }) as string[][];
  if (data.length < 2) return { headers: [], rows: [] };
  const headers = data[0].map(String);
  const rows = data.slice(1).map(row => Object.fromEntries(headers.map((h, i) => [h, String(row[i] ?? '')])));
  return { headers, rows };
}

function validateRows(
  rows: ParsedRow[],
  mappings: ColumnMapping[],
  existingStudents: Student[]
): ImportError[] {
  const errors: ImportError[] = [];
  const existingRolls = new Set(existingStudents.map(s => String(s.rollNo)));
  const existingIds = new Set(existingStudents.map(s => s.id));
  const nameField = mappings.find(m => m.field === 'name')?.csvCol;
  const rollField = mappings.find(m => m.field === 'roll')?.csvCol;

  rows.forEach((row, i) => {
    if (nameField && !row[nameField]?.trim()) {
      errors.push({ row: i + 2, col: 'Name', message: 'Name is required' });
    }
    if (rollField) {
      const roll = row[rollField]?.trim();
      if (!roll) {
        errors.push({ row: i + 2, col: 'Roll', message: 'Roll number is required' });
      } else if (isNaN(Number(roll))) {
        errors.push({ row: i + 2, col: 'Roll', message: `"${roll}" is not a valid number` });
      } else if (existingRolls.has(roll)) {
        errors.push({ row: i + 2, col: 'Roll', message: `Roll ${roll} already exists` });
      }
    }
  });

  return errors;
}

const AVATAR_COLORS = [
  '#0D9488','#6366F1','#10B981','#F59E0B','#F43F5E',
  '#8B5CF6','#EC4899','#14B8A6','#3B82F6','#F97316',
];

function rowsToStudents(
  rows: ParsedRow[],
  mappings: ColumnMapping[],
  subjects: { id: string }[],
  existingCount: number
): Student[] {
  const get = (row: ParsedRow, field: SystemField) => {
    const col = mappings.find(m => m.field === field)?.csvCol;
    return col ? (row[col] ?? '').trim() : '';
  };

  return rows.map((row, i) => {
    const name = get(row, 'name') || `Student ${existingCount + i + 1}`;
    const roll = parseInt(get(row, 'roll')) || existingCount + i + 1;
    const att: Record<string, AttendanceStatus> = {};
    subjects.forEach(s => { att[s.id] = 'P'; });
    const initials = name.split(' ').filter(Boolean).map((p: string) => p[0]).join('').slice(0, 2).toUpperCase();
    return {
      id: `STU${String(existingCount + i + 1).padStart(4, '0')}`,
      rollNo: roll,
      name,
      initials,
      avatarColor: AVATAR_COLORS[(existingCount + i) % AVATAR_COLORS.length],
      classSection: 'IX-A',
      rating: 3,
      manualRating: null,
      comment: '',
      attendance: att,
      monthlyAvg: 85,
      phone: get(row, 'phone') || 'N/A',
      guardian: {
        name: get(row, 'guardian_name') || 'N/A',
        phone: get(row, 'guardian_phone') || 'N/A',
        relation: 'Parent',
      },
      weeklyHistory: [],
      lastUpdated: new Date().toLocaleString(),
    } satisfies Student;
  });
}

interface Props {
  open: boolean;
  onClose: () => void;
  onImport: (students: Student[]) => void;
  existingStudents: Student[];
  subjects: { id: string; name: string; code: string }[];
}

const ACCEPT = '.csv,.xlsx,.xls';

export default function ImportModal({ open, onClose, onImport, existingStudents, subjects }: Props) {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep('upload'); setFile(null); setHeaders([]); setRows([]);
    setMappings([]); setErrors([]); setLoading(false);
  };

  async function handleFile(f: File) {
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!['csv','xlsx','xls'].includes(ext ?? '')) {
      alert('Unsupported file format. Use CSV, XLSX, or XLS.'); return;
    }
    setFile(f);
    setLoading(true);
    try {
      const { headers: hdrs, rows: rws } = await parseFile(f);
      setHeaders(hdrs);
      setRows(rws);
      setMappings(hdrs.map(h => ({ csvCol: h, field: detectField(h) })));
      setStep('mapping');
    } catch (e) {
      alert('Failed to parse file. Please check the format.');
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function proceedToPreview() {
    const errs = validateRows(rows, mappings, existingStudents);
    setErrors(errs);
    setStep('preview');
  }

  function doImport() {
    const validRows = errors.length > 0
      ? rows.filter((_, i) => !errors.some(e => e.row === i + 2))
      : rows;
    const students = rowsToStudents(validRows, mappings, subjects, existingStudents.length);
    onImport(students);
    setStep('done');
  }

  if (!open) return null;

  const errorRowNums = new Set(errors.map(e => e.row));
  const mappedFields = mappings.filter(m => m.field !== 'skip').map(m => m.field);

  const STEPS = ['Upload', 'Map Columns', 'Preview & Validate', 'Done'];
  const stepIdx = step === 'upload' ? 0 : step === 'mapping' ? 1 : step === 'preview' ? 2 : 3;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] rounded-2xl border border-app-border bg-app-surface shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
              <Upload className="w-4.5 h-4.5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-app-t1">Import Students</h2>
              <p className="text-[10px] text-app-t3">Supports CSV, XLSX, XLS</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-app-t3 hover:text-app-t1 hover:bg-app-raised transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center px-6 py-3 border-b border-app-border gap-2 flex-shrink-0">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 text-[10px] font-semibold ${i <= stepIdx ? 'text-teal-400' : 'text-app-t4'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${i < stepIdx ? 'bg-teal-500 text-white' : i === stepIdx ? 'bg-teal-500/20 border border-teal-500/50 text-teal-400' : 'bg-app-raised border border-app-border text-app-t4'}`}>
                  {i < stepIdx ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className="hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight className={`w-3 h-3 flex-shrink-0 ${i < stepIdx ? 'text-teal-400' : 'text-app-t4'}`} />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── UPLOAD STEP ── */}
          {step === 'upload' && (
            <div className="p-6">
              <div
                onDragEnter={e => { e.preventDefault(); setDragging(true); }}
                onDragOver={e => e.preventDefault()}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-4 h-52 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                  dragging
                    ? 'border-teal-500 bg-teal-500/5'
                    : 'border-app-border-2 hover:border-teal-500/50 hover:bg-app-raised'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-app-raised border border-app-border flex items-center justify-center">
                  <Upload className={`w-6 h-6 transition-colors ${dragging ? 'text-teal-400' : 'text-app-t3'}`} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-app-t1">{dragging ? 'Drop to upload' : 'Drop your file here'}</p>
                  <p className="text-xs text-app-t3 mt-1">or <span className="text-teal-400 underline">click to browse</span></p>
                  <p className="text-[10px] text-app-t4 mt-2">Accepts .csv · .xlsx · .xls</p>
                </div>
              </div>

              <input ref={fileRef} type="file" accept={ACCEPT} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

              {loading && (
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-app-t2">
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                  <span>Parsing file…</span>
                </div>
              )}

              {/* Supported formats */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { icon: FileText, label: 'CSV', sub: 'Comma-separated values' },
                  { icon: FileSpreadsheet, label: 'XLSX', sub: 'Excel 2007+' },
                  { icon: File, label: 'XLS', sub: 'Excel 97–2003' },
                ].map(f => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="flex items-center gap-2 p-3 rounded-xl border border-app-border bg-app-raised">
                      <Icon className="w-4 h-4 text-teal-400" />
                      <div>
                        <p className="text-xs font-semibold text-app-t1">{f.label}</p>
                        <p className="text-[10px] text-app-t3">{f.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── MAPPING STEP ── */}
          {step === 'mapping' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-teal-500/5 border border-teal-500/20">
                <File className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-teal-400 truncate">{file?.name}</p>
                  <p className="text-[10px] text-app-t3">{rows.length} data rows · {headers.length} columns detected</p>
                </div>
              </div>

              <p className="text-xs text-app-t2">Map each CSV column to a system field. Auto-detected fields are pre-filled.</p>

              <div className="space-y-2">
                {mappings.map((m, idx) => (
                  <div key={m.csvCol} className="flex items-center gap-3 p-3 rounded-xl border border-app-border bg-app-raised">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono-data font-semibold text-app-t1 truncate">{m.csvCol}</p>
                      <p className="text-[10px] text-app-t3 mt-0.5 truncate">
                        Sample: <span className="text-app-t2">{rows[0]?.[m.csvCol] ?? '—'}</span>
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-app-t4 flex-shrink-0" />
                    <select
                      value={m.field}
                      onChange={e => setMappings(prev => prev.map((p, i) => i === idx ? { ...p, field: e.target.value as SystemField } : p))}
                      className={`h-8 px-2 pr-6 rounded-lg border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-teal-500/30 transition-all bg-app-surface cursor-pointer appearance-none ${
                        m.field !== 'skip' ? 'border-teal-500/40 text-teal-400' : 'border-app-border text-app-t3'
                      }`}
                    >
                      {(Object.entries(FIELD_LABELS) as [SystemField, string][]).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <p className="text-[10px] text-app-t3 mr-2">Mapped:</p>
                {mappedFields.map(f => (
                  <span key={f} className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-400 text-[10px] font-semibold">{FIELD_LABELS[f]}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── PREVIEW STEP ── */}
          {step === 'preview' && (
            <div className="p-4">
              {errors.length > 0 && (
                <div className="mb-4 p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-amber-400">{errors.length} validation issue{errors.length > 1 ? 's' : ''} found</span>
                  </div>
                  <div className="space-y-1 max-h-28 overflow-y-auto">
                    {errors.map((e, i) => (
                      <p key={i} className="text-[10px] text-amber-300">Row {e.row} · {e.col}: {e.message}</p>
                    ))}
                  </div>
                  <p className="text-[10px] text-amber-500 mt-2">Rows with errors will be skipped. Valid rows ({rows.length - errors.length}) will still be imported.</p>
                </div>
              )}

              {errors.length === 0 && (
                <div className="mb-4 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400">All {rows.length} rows validated — ready to import</span>
                </div>
              )}

              <div className="overflow-x-auto rounded-xl border border-app-border">
                <table className="w-full text-xs" style={{ minWidth: '500px' }}>
                  <thead>
                    <tr className="border-b border-app-border bg-app-raised">
                      <th className="px-3 py-2 text-left text-[10px] font-semibold text-app-t3 uppercase tracking-wider w-10">#</th>
                      {mappings.filter(m => m.field !== 'skip').map(m => (
                        <th key={m.csvCol} className="px-3 py-2 text-left text-[10px] font-semibold text-app-t3 uppercase tracking-wider whitespace-nowrap">
                          {FIELD_LABELS[m.field]}
                        </th>
                      ))}
                      <th className="px-3 py-2 text-center w-20">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 8).map((row, i) => {
                      const hasError = errorRowNums.has(i + 2);
                      return (
                        <tr key={i} className={`border-b border-app-border/60 last:border-0 ${hasError ? 'bg-rose-500/5' : ''}`}>
                          <td className="px-3 py-2 text-app-t4 font-mono-data">{i + 2}</td>
                          {mappings.filter(m => m.field !== 'skip').map(m => (
                            <td key={m.csvCol} className="px-3 py-2 text-app-t1 truncate max-w-[140px]">{row[m.csvCol] ?? '—'}</td>
                          ))}
                          <td className="px-3 py-2 text-center">
                            {hasError
                              ? <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/25 text-[10px] font-bold">Skip</span>
                              : <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold">OK</span>
                            }
                          </td>
                        </tr>
                      );
                    })}
                    {rows.length > 8 && (
                      <tr>
                        <td colSpan={mappings.filter(m => m.field !== 'skip').length + 2} className="px-3 py-2 text-center text-[10px] text-app-t4">
                          … and {rows.length - 8} more rows
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── DONE STEP ── */}
          {step === 'done' && (
            <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-semibold text-app-t1 mb-1">Import Successful</h3>
                <p className="text-sm text-app-t2">Students have been added to the attendance register.</p>
              </div>
              <button onClick={() => { reset(); onClose(); }} className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-all shadow-lg shadow-teal-500/20 mt-2">
                Done
              </button>
            </div>
          )}
        </div>

        {/* Footer nav */}
        {step !== 'upload' && step !== 'done' && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-app-border flex-shrink-0">
            <button
              onClick={() => setStep(step === 'mapping' ? 'upload' : 'mapping')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-app-border text-app-t2 hover:text-app-t1 hover:bg-app-raised text-sm transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {step === 'mapping' && (
              <button
                onClick={proceedToPreview}
                disabled={!mappings.some(m => m.field === 'name')}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-md shadow-teal-500/20"
              >
                Preview & Validate <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 'preview' && (
              <button
                onClick={doImport}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-500/20"
              >
                <Check className="w-4 h-4" />
                Import {rows.length - errors.length} Student{rows.length - errors.length !== 1 ? 's' : ''}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
