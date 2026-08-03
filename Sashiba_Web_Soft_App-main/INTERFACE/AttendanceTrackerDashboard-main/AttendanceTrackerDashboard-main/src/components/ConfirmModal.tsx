import { AlertTriangle, Lock, Trash2, X } from 'lucide-react';

type Variant = 'danger' | 'warning' | 'lock';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_STYLES = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-rose-500/10 border-rose-500/25',
    iconColor: 'text-rose-500 dark:text-rose-400',
    confirmBtn: 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20',
    stripe: 'from-rose-600/40 via-rose-500/20 to-rose-600/40',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-500/10 border-amber-500/25',
    iconColor: 'text-amber-500 dark:text-amber-400',
    confirmBtn: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20',
    stripe: 'from-amber-600/40 via-amber-500/20 to-amber-600/40',
  },
  lock: {
    icon: Lock,
    iconBg: 'bg-indigo-500/10 border-indigo-500/25',
    iconColor: 'text-indigo-500 dark:text-indigo-400',
    confirmBtn: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20',
    stripe: 'from-indigo-600/40 via-indigo-500/20 to-indigo-600/40',
  },
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  const v = VARIANT_STYLES[variant];
  const Icon = v.icon;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-app-border bg-app-surface shadow-modal overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className={`h-0.5 w-full bg-gradient-to-r ${v.stripe}`} />
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${v.iconBg}`}>
              <Icon className={`w-5 h-5 ${v.iconColor}`} aria-hidden />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-app-t1 mb-1">{title}</h3>
              <p className="text-xs text-app-t2 leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onCancel}
              aria-label="Close dialog"
              className="text-app-t4 hover:text-app-t2 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-app-border text-app-t2 hover:text-app-t1 hover:bg-app-raised text-xs font-medium transition-all"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-5 py-2 rounded-lg text-white text-xs font-semibold transition-all shadow-md ${v.confirmBtn}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
