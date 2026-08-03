import { X, Keyboard } from 'lucide-react';
import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  {
    category: 'Global',
    items: [
      { keys: ['Ctrl', 'S'], label: 'Save all changes' },
      { keys: ['Ctrl', 'F'], label: 'Focus search box' },
      { keys: ['Esc'], label: 'Close modal / collapse row / cancel action' },
    ],
  },
  {
    category: 'Cell Attendance Entry',
    items: [
      { keys: ['P'], label: 'Mark Present' },
      { keys: ['A'], label: 'Mark Absent' },
      { keys: ['L'], label: 'Mark Late' },
      { keys: ['V'], label: 'Mark Leave' },
    ],
  },
  {
    category: 'Cell Navigation',
    items: [
      { keys: ['↑'], label: 'Move to previous student, same subject' },
      { keys: ['↓'], label: 'Move to next student, same subject' },
      { keys: ['←'], label: 'Move to previous subject' },
      { keys: ['→'], label: 'Move to next subject' },
      { keys: ['Tab'], label: 'Advance to next cell (wraps to next row)' },
      { keys: ['Enter'], label: 'Move to next student, same subject' },
    ],
  },
  {
    category: 'Row Actions',
    items: [
      { keys: ['Click row'], label: 'Expand / collapse student details' },
      { keys: ['Space'], label: 'Toggle row selection (when focused)' },
    ],
  },
];

export default function KeyboardHelp({ open, onClose }: Props) {
  if (!open) return null;

  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[85vh] rounded-2xl border border-app-border bg-app-surface shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-app-border">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-semibold text-app-t1">Keyboard Shortcuts</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-app-t3 hover:text-app-t1 hover:bg-app-raised transition-all">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {SHORTCUTS.map(section => (
            <div key={section.category}>
              <p className="text-[10px] font-semibold text-app-t4 uppercase tracking-wider mb-2">{section.category}</p>
              <div className="space-y-1">
                {section.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-app-border/40 last:border-0">
                    <span className="text-xs text-app-t2">{item.label}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {item.keys.map((k, ki) => (
                        <span key={ki} className="flex items-center gap-1">
                          <kbd className="px-2 py-0.5 rounded-md border border-app-border-2 bg-app-raised text-[10px] font-mono-data font-bold text-app-t1 shadow-sm">
                            {k}
                          </kbd>
                          {ki < item.keys.length - 1 && <span className="text-app-t4 text-[10px]">+</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-app-border">
          <p className="text-[10px] text-app-t4 text-center">On Mac, use <kbd className="px-1.5 py-0.5 rounded border border-app-border bg-app-raised text-[9px] font-mono-data">⌘</kbd> instead of <kbd className="px-1.5 py-0.5 rounded border border-app-border bg-app-raised text-[9px] font-mono-data">Ctrl</kbd></p>
        </div>
      </div>
    </div>,
    document.body
  );
}
