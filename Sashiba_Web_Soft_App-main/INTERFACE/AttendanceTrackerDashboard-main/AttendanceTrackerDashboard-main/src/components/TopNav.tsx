import { useState, useRef, useEffect } from 'react';
import {
  Bell, Sun, Moon, Save, Check, Loader2, BookOpen, ChevronDown,
  History, Lock, Unlock, Keyboard, AlertCircle, WifiOff, Printer,
} from 'lucide-react';
import type { Notification } from '../types';

type SaveState = 'clean' | 'unsaved' | 'saving' | 'saved' | 'failed';

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  teacherName: string;
  onTeacherNameChange: (name: string) => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  saveState: SaveState;
  onSave: () => void;
  isLocked: boolean;
  onToggleLock: () => void;
  onShowAuditLog: () => void;
  onShowHelp: () => void;
  onPrintRegister: () => void;
}

const SAVE_CONFIG: Record<SaveState, {
  label: string;
  cls: string;
  disabled: boolean;
  icon: typeof Save | typeof Check | typeof Loader2 | typeof AlertCircle;
  spin?: boolean;
}> = {
  clean:   { label: 'No Changes',    cls: 'bg-app-raised border border-app-border text-app-t4 cursor-not-allowed',      disabled: true,  icon: Save },
  unsaved: { label: 'Save Changes',  cls: 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/25 ring-1 ring-teal-400/30', disabled: false, icon: Save },
  saving:  { label: 'Saving…',       cls: 'bg-teal-500/15 text-teal-400 border border-teal-500/25 cursor-not-allowed',   disabled: true,  icon: Loader2, spin: true },
  saved:   { label: 'Saved',         cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',             disabled: true,  icon: Check },
  failed:  { label: 'Failed — Retry',cls: 'bg-rose-600 hover:bg-rose-500 text-white',                                    disabled: false, icon: WifiOff },
};

export default function TopNav({
  darkMode,
  onToggleDark,
  teacherName,
  onTeacherNameChange,
  notifications,
  onMarkAllRead,
  saveState,
  onSave,
  isLocked,
  onToggleLock,
  onShowAuditLog,
  onShowHelp,
  onPrintRegister,
}: Props) {
  const [showNotif, setShowNotif] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(teacherName);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    try { return localStorage.getItem('teacherAvatarUrl'); } catch { return null; }
  });
  const notifRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);

  function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setAvatarUrl(url);
      try { localStorage.setItem('teacherAvatarUrl', url); } catch { /* */ }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  const unread = notifications.filter(n => !n.read).length;
  const cfg = SAVE_CONFIG[saveState] ?? SAVE_CONFIG.clean;
  const Icon = cfg.icon;

  useEffect(() => {
    function h(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    if (editingName && nameRef.current) nameRef.current.focus();
  }, [editingName]);

  function commitName() {
    setEditingName(false);
    if (nameVal.trim()) onTeacherNameChange(nameVal.trim());
    else setNameVal(teacherName);
  }

  const typeIcon: Record<string, string> = {
    info: 'bg-blue-500', warning: 'bg-amber-500', success: 'bg-emerald-500',
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 border-b border-app-border no-print"
      style={{ background: 'var(--app-nav)', backdropFilter: 'blur(20px)' }}
      role="banner"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20 flex-shrink-0">
          <BookOpen className="w-4 h-4 text-white" aria-hidden />
        </div>
        <span className="text-sm font-semibold text-app-t1 tracking-tight hidden sm:block">
          Sashiba <span className="text-teal-500">Academic OS</span>
        </span>

        {/* Unsaved badge */}
        {saveState === 'unsaved' && (
          <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 animate-fade-in">
            <AlertCircle className="w-3 h-3 text-amber-400" aria-hidden />
            <span className="text-[10px] font-semibold text-amber-400">Unsaved changes</span>
          </span>
        )}
        {saveState === 'failed' && (
          <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full border border-rose-500/30 bg-rose-500/10">
            <WifiOff className="w-3 h-3 text-rose-400" aria-hidden />
            <span className="text-[10px] font-semibold text-rose-400">Save failed</span>
          </span>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1" role="toolbar" aria-label="Top actions">
        {/* Print Full Register — distinct CTA */}
        <button
          onClick={onPrintRegister}
          title="Print full class register (A4)"
          aria-label="Print full attendance register"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 text-xs font-semibold transition-all mr-1"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Register
        </button>
        {/* Keyboard help */}
        <button
          onClick={onShowHelp}
          title="Keyboard shortcuts"
          aria-label="Show keyboard shortcuts"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-app-t3 hover:text-app-t1 hover:bg-app-raised transition-all"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Audit log */}
        <button
          onClick={onShowAuditLog}
          title="View audit log"
          aria-label="View audit log"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-app-t3 hover:text-app-t1 hover:bg-app-raised transition-all"
        >
          <History className="w-4 h-4" />
        </button>

        {/* Lock toggle */}
        <button
          onClick={onToggleLock}
          title={isLocked ? 'Unlock attendance' : 'Lock attendance'}
          aria-label={isLocked ? 'Unlock attendance (currently locked)' : 'Lock attendance'}
          aria-pressed={isLocked}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            isLocked ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 hover:bg-indigo-500/20' : 'text-app-t3 hover:text-app-t1 hover:bg-app-raised'
          }`}
        >
          {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(v => !v)}
            aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
            aria-expanded={showNotif}
            aria-haspopup="true"
            className="relative w-8 h-8 rounded-lg flex items-center justify-center text-app-t3 hover:text-app-t1 hover:bg-app-raised transition-all"
          >
            <Bell className="w-4 h-4" aria-hidden />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" aria-hidden />
            )}
          </button>

          {showNotif && (
            <div
              role="menu"
              aria-label="Notifications"
              className="animate-fade-in absolute top-10 right-0 w-80 rounded-xl border border-app-border bg-app-surface shadow-2xl shadow-black/30 overflow-hidden z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-app-border">
                <span className="text-xs font-semibold text-app-t1 uppercase tracking-wider">Notifications</span>
                {unread > 0 && (
                  <button onClick={onMarkAllRead} className="text-xs text-teal-500 hover:text-teal-400 transition-colors">Mark all read</button>
                )}
              </div>
              {notifications.map(n => (
                <div key={n.id} className={`px-4 py-3 border-b border-app-border/50 last:border-0 hover:bg-app-raised transition-colors ${!n.read ? 'bg-app-hover' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? typeIcon[n.type] : 'bg-app-t4'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-app-t1 mb-0.5">{n.title}</p>
                      <p className="text-xs text-app-t2 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-app-t4 mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Teacher profile */}
        <div
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-app-raised transition-all cursor-pointer group"
          onClick={() => setEditingName(true)}
          role="button"
          aria-label="Edit teacher name"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setEditingName(true)}
        >
          {/* Avatar with upload-on-click */}
          <div
            className="relative w-7 h-7 rounded-full flex-shrink-0 group/av"
            onClick={e => { e.stopPropagation(); avatarFileRef.current?.click(); }}
            title="Click to change photo"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Teacher avatar" className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                {teacherName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/av:opacity-100 flex items-center justify-center transition-opacity">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          </div>
          <input ref={avatarFileRef} type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" aria-label="Upload teacher photo" />
          {editingName ? (
            <input
              ref={nameRef}
              value={nameVal}
              onChange={e => setNameVal(e.target.value)}
              onBlur={commitName}
              onKeyDown={e => {
                if (e.key === 'Enter') commitName();
                if (e.key === 'Escape') { setEditingName(false); setNameVal(teacherName); }
              }}
              className="w-32 text-xs font-medium bg-app-raised border border-teal-500/50 rounded px-1.5 py-0.5 text-app-t1 outline-none"
              onClick={e => e.stopPropagation()}
              aria-label="Edit teacher name"
            />
          ) : (
            <span className="text-xs font-medium text-app-t2 group-hover:text-app-t1 transition-colors hidden sm:block truncate max-w-[120px]">
              {teacherName}
            </span>
          )}
          <ChevronDown className="w-3 h-3 text-app-t4 group-hover:text-app-t3 transition-colors" />
        </div>

        {/* Dark/Light toggle */}
        <button
          onClick={onToggleDark}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={darkMode ? 'Light mode' : 'Dark mode'}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-app-t3 hover:text-app-t1 hover:bg-app-raised transition-all"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Save button — 5 states */}
        <button
          onClick={() => !cfg.disabled && onSave()}
          disabled={cfg.disabled}
          aria-label={cfg.label}
          title={saveState === 'clean' ? 'No changes to save' : cfg.label}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${cfg.cls}`}
        >
          <Icon className={`w-3.5 h-3.5 ${cfg.spin ? 'animate-spin' : ''}`} aria-hidden />
          <span className="hidden sm:block">{cfg.label}</span>
        </button>
      </div>
    </header>
  );
}
