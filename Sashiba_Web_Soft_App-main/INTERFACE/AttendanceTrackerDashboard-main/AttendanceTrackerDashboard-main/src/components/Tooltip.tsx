import { useState, useRef, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  content: string;
  children: ReactNode;
  placement?: 'auto' | 'top' | 'bottom';
  className?: string;
}

export default function Tooltip({ content, children, placement = 'auto', className = '' }: Props) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, above: true });
  const wrapRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback(() => {
    clearTimeout(hideTimer.current);
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const above = placement === 'bottom' ? false : placement === 'top' ? true : r.top > 72;
    setCoords({
      top: above ? r.top - 8 : r.bottom + 8,
      left: r.left + r.width / 2,
      above,
    });
    setVisible(true);
  }, [placement]);

  const hide = useCallback(() => {
    hideTimer.current = setTimeout(() => setVisible(false), 80);
  }, []);

  return (
    <>
      <div
        ref={wrapRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className={`inline-block ${className}`}
      >
        {children}
      </div>

      {visible && createPortal(
        <div
          role="tooltip"
          style={{
            position: 'fixed',
            left: coords.left,
            ...(coords.above
              ? { bottom: window.innerHeight - coords.top }
              : { top: coords.top }),
            transform: 'translateX(-50%)',
            zIndex: 9999,
            pointerEvents: 'none',
            background: 'var(--app-surface)',
            border: '1px solid var(--app-border-2)',
            boxShadow: 'var(--app-shadow-lg)',
            color: 'var(--app-t1)',
          }}
          className="animate-tooltip px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap"
        >
          {content}
          <span
            style={{
              borderTopColor: coords.above ? 'var(--app-border-2)' : undefined,
              borderBottomColor: !coords.above ? 'var(--app-border-2)' : undefined,
            }}
            className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
              coords.above ? 'top-full' : 'bottom-full'
            }`}
          />
        </div>,
        document.body
      )}
    </>
  );
}
