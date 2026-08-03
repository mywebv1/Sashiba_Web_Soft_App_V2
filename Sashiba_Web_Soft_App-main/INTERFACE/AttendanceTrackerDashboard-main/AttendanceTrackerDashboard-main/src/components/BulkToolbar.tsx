import { MessageSquare, Download, Trash2, Printer, UserCheck, Clock, Umbrella, X } from 'lucide-react';
import type { AttendanceStatus } from '../types';

interface Props {
  count: number;
  onBulkStatus: (s: AttendanceStatus) => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export default function BulkToolbar({ count, onBulkStatus, onBulkDelete, onClearSelection }: Props) {
  if (count === 0) return null;

  return (
    <div className="animate-slide-up fixed bottom-6 left-1/2 -translate-x-1/2 z-50 no-print" role="toolbar" aria-label="Bulk actions">
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-app-border bg-app-surface/95 backdrop-blur-xl shadow-2xl shadow-black/50">
        {/* Count pill */}
        <div className="flex items-center gap-2 pr-3 border-r border-app-border" aria-live="polite">
          <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-[10px] font-bold text-white">
            {count}
          </div>
          <span className="text-xs text-app-t2 font-medium">selected</span>
        </div>

        <button
          onClick={() => onBulkStatus('P')}
          aria-label="Mark selected students Present"
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-all"
        >
          <UserCheck className="w-3.5 h-3.5" aria-hidden /> Mark Present
        </button>
        <button
          onClick={() => onBulkStatus('L')}
          aria-label="Mark selected students Late"
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-all"
        >
          <Clock className="w-3.5 h-3.5" aria-hidden /> Mark Late
        </button>
        <button
          onClick={() => onBulkStatus('Lv')}
          aria-label="Mark selected students on Leave"
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold transition-all"
        >
          <Umbrella className="w-3.5 h-3.5" aria-hidden /> Mark Leave
        </button>

        <div className="h-5 w-px bg-app-border" aria-hidden />

        <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-app-border text-app-t3 hover:text-app-t1 hover:bg-app-raised text-xs transition-all">
          <MessageSquare className="w-3.5 h-3.5" aria-hidden /> Bulk SMS
        </button>
        <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-app-border text-app-t3 hover:text-app-t1 hover:bg-app-raised text-xs transition-all">
          <Printer className="w-3.5 h-3.5" aria-hidden /> Print
        </button>
        <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-app-border text-app-t3 hover:text-app-t1 hover:bg-app-raised text-xs transition-all">
          <Download className="w-3.5 h-3.5" aria-hidden /> Export
        </button>

        <div className="h-5 w-px bg-app-border" aria-hidden />

        <button
          onClick={onBulkDelete}
          aria-label="Delete selected students"
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" aria-hidden /> Delete
        </button>

        <button
          onClick={onClearSelection}
          aria-label="Clear selection"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-app-t3 hover:text-app-t1 hover:bg-app-raised transition-all ml-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
