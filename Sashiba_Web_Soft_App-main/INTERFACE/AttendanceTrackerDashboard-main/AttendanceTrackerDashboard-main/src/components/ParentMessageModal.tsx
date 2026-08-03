import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, MessageSquare, Copy, Check } from 'lucide-react';
import type { Student, Subject, AttendanceStatus } from '../types';

interface Props {
  student: Student;
  subjects: Subject[];
  teacherName: string;
  schoolName: string;
  onClose: () => void;
}

type Lang = 'english' | 'bangla';

function getStatusLabel(status: AttendanceStatus, lang: Lang): string {
  const map: Record<AttendanceStatus, Record<Lang, string>> = {
    P:  { english: 'Present', bangla: 'উপস্থিত' },
    A:  { english: 'Absent',  bangla: 'অনুপস্থিত' },
    L:  { english: 'Late',    bangla: 'বিলম্বে উপস্থিত' },
    Lv: { english: 'on Leave',bangla: 'ছুটিতে' },
  };
  return map[status]?.[lang] ?? status;
}

function buildMessage(student: Student, subjects: Subject[], teacherName: string, schoolName: string, date: string, lang: Lang): string {
  const subjectLines = subjects.map(sub => {
    const status = student.attendance[sub.id] ?? 'P';
    return lang === 'english'
      ? `  • ${sub.name} (${sub.code}): ${getStatusLabel(status as AttendanceStatus, lang)}`
      : `  • ${sub.name} (${sub.code}): ${getStatusLabel(status as AttendanceStatus, lang)}`;
  });

  const absent = subjects.filter(s => (student.attendance[s.id] ?? 'P') === 'A');
  const allPresent = absent.length === 0;

  if (lang === 'english') {
    const mainStatus = allPresent ? 'fully present' : `absent in ${absent.length} subject(s)`;
    return `Dear ${student.guardian.name},

This is to inform you that your child ${student.name} (Roll No. ${student.rollNo}, Class ${student.classSection}) was ${mainStatus} on ${date}.

Subject-wise attendance:
${subjectLines.join('\n')}

${!allPresent ? `Kindly ensure your child's regular attendance. Consistent absence may affect academic progress.\n\n` : 'Thank you for supporting your child\'s regular attendance.\n\n'}Regards,
${teacherName}
${schoolName}`;
  } else {
    const mainStatus = allPresent ? 'সম্পূর্ণ উপস্থিত ছিল' : `${absent.length}টি বিষয়ে অনুপস্থিত ছিল`;
    return `প্রিয় ${student.guardian.name},

আপনাকে জানাতে চাই যে আপনার সন্তান ${student.name} (রোল নং ${student.rollNo}, শ্রেণি ${student.classSection}) ${date} তারিখে ${mainStatus}।

বিষয়ভিত্তিক উপস্থিতি:
${subjectLines.join('\n')}

${!allPresent ? `অনুগ্রহ করে আপনার সন্তানের নিয়মিত উপস্থিতি নিশ্চিত করুন। অনুপস্থিতি শিক্ষার উপর নেতিবাচক প্রভাব ফেলতে পারে।\n\n` : 'আপনার সন্তানের নিয়মিত উপস্থিতির জন্য ধন্যবাদ।\n\n'}শ্রদ্ধার সাথে,
${teacherName}
${schoolName}`;
  }
}

export default function ParentMessageModal({ student, subjects, teacherName, schoolName, onClose }: Props) {
  const [lang, setLang] = useState<Lang>('english');
  const [copied, setCopied] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const message = buildMessage(student, subjects, teacherName, schoolName, today, lang);

  async function handleCopy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSendSMS() {
    const encoded = encodeURIComponent(message);
    const phone = student.guardian.phone.replace(/\D/g, '');
    window.open(`sms:${phone}?body=${encoded}`, '_blank');
  }

  function handleSendWhatsApp() {
    const encoded = encodeURIComponent(message);
    const phone = student.guardian.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  }

  const absent = subjects.filter(s => (student.attendance[s.id] ?? 'P') === 'A');
  const isAlert = absent.length > 0;

  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Send parent message"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-app-border bg-app-surface shadow-modal overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top stripe */}
        <div className={`h-1 w-full ${isAlert ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-gradient-to-r from-teal-500 to-indigo-500'}`} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-app-border">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isAlert ? 'bg-rose-500/10 border border-rose-500/30' : 'bg-teal-500/10 border border-teal-500/30'}`}>
              <MessageSquare className={`w-4 h-4 ${isAlert ? 'text-rose-400' : 'text-teal-400'}`} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-app-t1">Message to Parent</h2>
              <p className="text-[10px] text-app-t4">{student.name} · Guardian: {student.guardian.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-app-t3 hover:text-app-t1 hover:bg-app-raised transition-all">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Student summary strip */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-app-raised border border-app-border">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: student.avatarColor }}>
              {student.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-app-t1">{student.name}</p>
              <p className="text-[10px] text-app-t3 font-mono">Roll #{student.rollNo} · {student.classSection}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-[10px] text-app-t4">Contact</p>
              <p className="text-xs font-mono font-semibold text-app-t2">{student.guardian.phone}</p>
            </div>
          </div>

          {/* Language toggle */}
          <div className="flex rounded-xl border border-app-border overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setLang('english')}
              className={`flex-1 py-2 transition-colors ${lang === 'english' ? 'bg-teal-600 text-white' : 'bg-app-raised text-app-t3 hover:text-app-t1'}`}
            >
              English
            </button>
            <button
              onClick={() => setLang('bangla')}
              className={`flex-1 py-2 transition-colors ${lang === 'bangla' ? 'bg-indigo-600 text-white' : 'bg-app-raised text-app-t3 hover:text-app-t1'}`}
            >
              বাংলা (Bangla)
            </button>
          </div>

          {/* Message preview */}
          <div className="relative">
            <textarea
              readOnly
              value={message}
              rows={12}
              className="w-full rounded-xl border border-app-border bg-app-raised text-xs text-app-t2 p-3 resize-none font-mono leading-relaxed focus:outline-none"
              style={{ fontFamily: lang === 'bangla' ? '"SolaimanLipi", "Kalpurush", "Nikosh", system-ui, sans-serif' : 'ui-monospace, monospace' }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${copied ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500' : 'border-app-border text-app-t2 hover:text-app-t1 hover:bg-app-raised'}`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>

            <button
              onClick={handleSendSMS}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-app-border text-xs font-semibold text-app-t2 hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              SMS
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>

            <div className="flex-1" />
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-app-border text-xs text-app-t2 hover:text-app-t1 hover:bg-app-raised transition-all">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
