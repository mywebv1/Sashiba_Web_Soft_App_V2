import { useState, useRef } from 'react';
import { Edit3, MapPin, Calendar, GraduationCap, Building2, Check, X, Camera } from 'lucide-react';

interface SchoolInfo {
  name: string;
  tagline: string;
  address: string;
  session: string;
}

interface Props {
  info: SchoolInfo;
  onInfoChange: (info: SchoolInfo) => void;
  activeClass: string;
  activeSection: string;
}

export default function SchoolBanner({ info, onInfoChange, activeClass, activeSection }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(info);
  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    try { return localStorage.getItem('schoolLogoUrl'); } catch { return null; }
  });
  const [logoHovered, setLogoHovered] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  function save() { onInfoChange(draft); setEditing(false); }
  function cancel() { setDraft(info); setEditing(false); }

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setLogoUrl(url);
      try { localStorage.setItem('schoolLogoUrl', url); } catch { /* storage full */ }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function removeLogo() {
    setLogoUrl(null);
    try { localStorage.removeItem('schoolLogoUrl'); } catch { /* */ }
  }

  return (
    <div className="mx-4 mt-4 rounded-2xl border border-app-border overflow-hidden bg-app-surface no-print">
      <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-600" />

      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">

          {/* ── Logo area with upload ── */}
          <div className="relative flex-shrink-0 group/logo"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <div
              onClick={() => fileRef.current?.click()}
              title="Click to change school logo"
              className="w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200 group-hover/logo:border-teal-500/60"
              style={{ borderColor: logoUrl ? 'transparent' : undefined, background: logoUrl ? 'transparent' : undefined }}
            >
              {logoUrl ? (
                <img src={logoUrl} alt="School logo" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-teal-500/20 to-indigo-600/20 border border-teal-500/30 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-teal-400" />
                </div>
              )}
            </div>

            {/* Hover overlay */}
            {logoHovered && (
              <div
                onClick={() => fileRef.current?.click()}
                className="animate-fade-in absolute inset-0 rounded-xl bg-black/50 flex flex-col items-center justify-center cursor-pointer z-10"
              >
                <Camera className="w-4 h-4 text-white mb-0.5" />
                <span className="text-[8px] text-white font-semibold">{logoUrl ? 'Change' : 'Upload'}</span>
              </div>
            )}

            {/* Remove button */}
            {logoUrl && logoHovered && (
              <button
                onClick={e => { e.stopPropagation(); removeLogo(); }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center z-20 shadow-md"
                title="Remove logo"
              >
                <X className="w-2.5 h-2.5 text-white" />
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleLogoFile}
              className="hidden"
              aria-label="Upload school logo"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            {editing ? (
              <div className="space-y-2">
                <input className="text-lg font-bold bg-app-raised border border-teal-500/40 rounded-lg px-3 py-1.5 text-app-t1 outline-none w-full max-w-sm text-sm"
                  value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="School Name" />
                <input className="text-sm bg-app-raised border border-app-border rounded-lg px-3 py-1.5 text-app-t2 outline-none w-full max-w-sm"
                  value={draft.tagline} onChange={e => setDraft(d => ({ ...d, tagline: e.target.value }))} placeholder="Tagline" />
                <input className="text-sm bg-app-raised border border-app-border rounded-lg px-3 py-1.5 text-app-t2 outline-none w-full max-w-md"
                  value={draft.address} onChange={e => setDraft(d => ({ ...d, address: e.target.value }))} placeholder="Address" />
                <input className="text-sm bg-app-raised border border-app-border rounded-lg px-3 py-1.5 text-app-t2 outline-none w-48"
                  value={draft.session} onChange={e => setDraft(d => ({ ...d, session: e.target.value }))} placeholder="Academic Session" />
              </div>
            ) : (
              <>
                <h1 className="text-base font-bold text-app-t1 leading-tight">{info.name}</h1>
                <p className="text-xs text-teal-500 font-medium mt-0.5">{info.tagline}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                  <span className="flex items-center gap-1 text-xs text-app-t3"><MapPin className="w-3 h-3" aria-hidden /> {info.address}</span>
                  <span className="flex items-center gap-1 text-xs text-app-t3"><Calendar className="w-3 h-3" aria-hidden /> {info.session}</span>
                  <span className="flex items-center gap-1 text-xs text-app-t3"><Building2 className="w-3 h-3" aria-hidden /> {today}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold font-mono">
            Class {activeClass} · Sec {activeSection}
          </div>
          {editing ? (
            <div className="flex gap-1.5">
              <button onClick={save} className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={cancel} className="w-8 h-8 rounded-lg bg-app-raised border border-app-border flex items-center justify-center text-app-t3 hover:bg-app-hover transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button onClick={() => { setDraft(info); setEditing(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-app-border text-app-t3 hover:text-app-t1 hover:border-app-border2 hover:bg-app-raised transition-all text-xs">
              <Edit3 className="w-3.5 h-3.5" /> Edit Info
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
