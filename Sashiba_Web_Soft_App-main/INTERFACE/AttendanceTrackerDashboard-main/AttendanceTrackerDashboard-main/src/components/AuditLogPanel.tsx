import { X, History, ArrowRight, Clock } from 'lucide-react';
import type { AuditEntry, AttendanceStatus } from '../types';

interface Props {
  open: boolean;
  entries: AuditEntry[];
  onClose: () => void;
}

const STATUS_CLR: Record<AttendanceStatus, string> = {
  P: 'text-emerald-400',
  A: 'text-rose-400',
  L: 'text-amber-400',
  Lv: 'text-blue-400',
};

const STATUS_BG: Record<AttendanceStatus, string> = {
  P: 'bg-emerald-500/10 border-emerald-500/25',
  A: 'bg-rose-500/10 border-rose-500/25',
  L: 'bg-amber-500/10 border-amber-500/25',
  Lv: 'bg-blue-500/10 border-blue-500/25',
};

function StatusBadge({ s }: { s: AttendanceStatus }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-bold font-mono ${STATUS_CLR[s]} ${STATUS_BG[s]}`}>
      {s}
    </span>
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' · ' +
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AuditLogPanel({ open, entries, onClose }: Props) {
  return (
    <>
      {open && (
        <div
          className="animate-fade-in fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        role="complementary"
        aria-label="Audit log"
        aria-hidden={!open}
        className={`fixed top-0 right-0 h-full z-[61] w-80 bg-app-surface border-l border-app-border flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-app-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center">
              <History className="w-3.5 h-3.5 text-indigo-400" aria-hidden />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-app-t1">Audit Log</h3>
              <p className="text-[10px] text-app-t4">{entries.length} changes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close audit log"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-app-t3 hover:text-app-t1 hover:bg-app-raised transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <History className="w-8 h-8 text-app-t4" aria-hidden />
              <p className="text-xs text-app-t3 text-center">No changes recorded yet.<br />Changes will appear here.</p>
            </div>
          ) : (
            <div className="p-3 space-y-2" role="list" aria-label="Audit entries">
              {entries.map((e, idx) => (
                <div
                  key={e.id}
                  role="listitem"
                  className={`p-3 rounded-xl border bg-app-raised transition-colors ${idx === 0 ? 'border-teal-500/20 bg-teal-500/5' : 'border-app-border'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-app-t1 truncate">{e.studentName}</p>
                    <span className="text-[10px] font-mono text-app-t4 ml-2 flex-shrink-0">{e.studentId}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] text-app-t3 font-mono font-semibold">{e.subjectCode}</span>
                    <span className="text-app-t4">·</span>
                    <StatusBadge s={e.prevStatus} />
                    <ArrowRight className="w-3 h-3 text-app-t4" aria-hidden />
                    <StatusBadge s={e.newStatus} />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-app-t3">
                    <Clock className="w-2.5 h-2.5" aria-hidden />
                    {formatTime(e.timestamp)}
                    <span className="text-app-t4">·</span>
                    <span className="text-app-t3">{e.editedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {entries.length > 0 && (
          <div className="px-4 py-3 border-t border-app-border">
            <p className="text-[10px] text-app-t4 text-center">Showing last {Math.min(entries.length, 100)} changes</p>
          </div>
        )}
      </div>
    </>
  );
}
