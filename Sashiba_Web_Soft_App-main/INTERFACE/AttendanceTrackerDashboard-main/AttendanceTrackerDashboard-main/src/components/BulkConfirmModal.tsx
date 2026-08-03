import { useState } from 'react';
import { UserCheck, Clock, Umbrella, Users, FileCheck, X } from 'lucide-react';
import type { AttendanceStatus, BulkScope } from '../types';

interface Props {
  open: boolean;
  status: AttendanceStatus | null;
  selectedCount: number;
  pageCount: number;
  totalCount: number;
  onConfirm: (scope: BulkScope) => void;
  onCancel: () => void;
}

const STATUS_META = {
  P:  { label: 'Present', icon: UserCheck, color: 'emerald', stripe: 'bg-emerald-500', btnCls: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20', iconCls: 'bg-emerald-500/10 border-emerald-500/25', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  A:  { label: 'Absent',  icon: UserCheck, color: 'rose',    stripe: 'bg-rose-500',    btnCls: 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20',       iconCls: 'bg-rose-500/10 border-rose-500/25',       iconColor: 'text-rose-600 dark:text-rose-400' },
  L:  { label: 'Late',    icon: Clock,     color: 'amber',   stripe: 'bg-amber-500',   btnCls: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20',    iconCls: 'bg-amber-500/10 border-amber-500/25',    iconColor: 'text-amber-600 dark:text-amber-400' },
  Lv: { label: 'Leave',   icon: Umbrella,  color: 'blue',    stripe: 'bg-blue-500',    btnCls: 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20',       iconCls: 'bg-blue-500/10 border-blue-500/25',       iconColor: 'text-blue-600 dark:text-blue-400' },
};

const SCOPE_OPTIONS: {
  value: BulkScope;
  label: string;
  desc: (counts: { page: number; sel: number; total: number }) => string;
  icon: typeof Users;
}[] = [
  { value: 'page',     label: 'Current Page',      desc: ({ page })  => `Apply to ${page} students on this page`, icon: FileCheck },
  { value: 'selected', label: 'Selected Students',  desc: ({ sel })   => sel > 0 ? `Apply to ${sel} selected students` : 'No students selected', icon: UserCheck },
  { value: 'all',      label: 'Entire Class',       desc: ({ total }) => `Apply to all ${total} students in the filtered view`, icon: Users },
];

export default function BulkConfirmModal({
  open,
  status,
  selectedCount,
  pageCount,
  totalCount,
  onConfirm,
  onCancel,
}: Props) {
  const [scope, setScope] = useState<BulkScope>('page');

  if (!open || !status) return null;

  const meta = STATUS_META[status];
  const Icon = meta.icon;
  const counts = { page: pageCount, sel: selectedCount, total: totalCount };
  const isSelDisabled = selectedCount === 0 && scope === 'selected';

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label={`Mark all as ${meta.label}`}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-app-border bg-app-surface shadow-modal overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className={`h-1 w-full ${meta.stripe}`} />
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${meta.iconCls}`}>
                <Icon className={`w-4 h-4 ${meta.iconColor}`} aria-hidden />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-app-t1">Mark All as {meta.label}</h3>
                <p className="text-xs text-app-t3 mt-0.5">Choose which students to update</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              aria-label="Close"
              className="text-app-t4 hover:text-app-t2 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 mt-5" role="radiogroup" aria-label="Scope selection">
            {SCOPE_OPTIONS.map(opt => {
              const OIcon = opt.icon;
              const disabled = opt.value === 'selected' && selectedCount === 0;
              const active = scope === opt.value;
              return (
                <button
                  key={opt.value}
                  role="radio"
                  aria-checked={active}
                  onClick={() => !disabled && setScope(opt.value)}
                  disabled={disabled}
                  className={`
                    w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all
                    ${active
                      ? 'border-teal-500/50 bg-teal-500/10'
                      : 'border-app-border bg-app-raised hover:border-app-border2 hover:bg-app-hover'
                    }
                    ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    active ? 'bg-teal-500/20 border border-teal-500/30' : 'bg-app-surface border border-app-border'
                  }`}>
                    <OIcon className={`w-4 h-4 ${active ? 'text-teal-500 dark:text-teal-400' : 'text-app-t3'}`} aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${active ? 'text-app-t1' : 'text-app-t2'}`}>
                      {opt.label}
                    </p>
                    <p className="text-[11px] text-app-t3 mt-0.5">{opt.desc(counts)}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                    active ? 'border-teal-500 bg-teal-500' : 'border-app-border2'
                  }`}>
                    {active && (
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 mt-5 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-app-border text-app-t2 hover:text-app-t1 hover:bg-app-raised text-xs font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => !isSelDisabled && onConfirm(scope)}
              disabled={isSelDisabled}
              className={`px-5 py-2 rounded-lg text-white text-xs font-semibold transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed ${meta.btnCls}`}
            >
              Apply — {meta.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
