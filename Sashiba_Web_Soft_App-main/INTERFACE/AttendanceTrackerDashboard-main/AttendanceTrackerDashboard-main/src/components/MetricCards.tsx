import { Users, UserCheck, Clock, Umbrella, AlertCircle, TrendingUp } from 'lucide-react';
import type { Student, Subject } from '../types';

interface Props {
  students: Student[];
  subjects: Subject[];
  activeMetric: string | null;
  onMetricClick: (key: string) => void;
}

function CircularGauge({ pct }: { pct: number }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = circ - (pct / 100) * circ;
  const color = pct >= 90 ? '#10B981' : pct >= 75 ? '#F59E0B' : '#F43F5E';
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="flex-shrink-0">
      <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(100,116,139,0.15)" strokeWidth="5" />
      <circle
        cx="32" cy="32" r={r} fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={dash}
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="32" y="36" textAnchor="middle" fontSize="12" fontWeight="700" fill={color} fontFamily="JetBrains Mono, monospace">
        {pct}%
      </text>
    </svg>
  );
}

export default function MetricCards({ students, subjects, activeMetric, onMetricClick }: Props) {
  const total = students.length;

  const counts = students.reduce(
    (acc, st) => {
      const statuses = subjects.map(s => st.attendance[s.id] ?? 'P');
      const absent = statuses.filter(s => s === 'A').length;
      const late = statuses.filter(s => s === 'L').length;
      const leave = statuses.filter(s => s === 'Lv').length;
      const present = statuses.filter(s => s === 'P').length;

      if (absent > 0) acc.absent++;
      else if (late > 0) acc.late++;
      else if (leave > 0) acc.leave++;
      else if (present === subjects.length) acc.present++;

      return acc;
    },
    { present: 0, absent: 0, late: 0, leave: 0 }
  );

  const avgMonthly = total > 0
    ? Math.round(students.reduce((s, st) => s + st.monthlyAvg, 0) / total)
    : 0;

  const cards = [
    {
      key: 'total',
      label: 'Total Students',
      value: total,
      icon: Users,
      color: 'indigo',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      iconColor: 'text-indigo-500 dark:text-indigo-400',
      numColor: 'text-indigo-700 dark:text-indigo-200',
      labelColor: 'text-indigo-800 dark:text-indigo-300',
      activeBorder: 'border-indigo-500/60',
    },
    {
      key: 'present',
      label: 'Present Today',
      value: counts.present,
      icon: UserCheck,
      color: 'emerald',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      numColor: 'text-emerald-700 dark:text-emerald-200',
      labelColor: 'text-emerald-800 dark:text-emerald-300',
      activeBorder: 'border-emerald-500/60',
    },
    {
      key: 'late',
      label: 'Late Today',
      value: counts.late,
      icon: Clock,
      color: 'amber',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      numColor: 'text-amber-700 dark:text-amber-200',
      labelColor: 'text-amber-800 dark:text-amber-300',
      activeBorder: 'border-amber-500/60',
    },
    {
      key: 'leave',
      label: 'On Leave Today',
      value: counts.leave,
      icon: Umbrella,
      color: 'blue',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      numColor: 'text-blue-700 dark:text-blue-200',
      labelColor: 'text-blue-800 dark:text-blue-300',
      activeBorder: 'border-blue-500/60',
    },
    {
      key: 'absent',
      label: 'Absent Today',
      value: counts.absent,
      icon: AlertCircle,
      color: 'rose',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      iconColor: 'text-rose-600 dark:text-rose-400',
      numColor: 'text-rose-700 dark:text-rose-200',
      labelColor: 'text-rose-800 dark:text-rose-300',
      activeBorder: 'border-rose-500/60',
    },
  ];

  return (
    <div className="px-4 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 no-print">
      {cards.map(c => {
        const Icon = c.icon;
        const active = activeMetric === c.key;
        return (
          <button
            key={c.key}
            onClick={() => onMetricClick(c.key)}
            className={`
              relative text-left p-4 rounded-xl border transition-all duration-200 group shadow-card
              ${c.bg} ${active ? c.activeBorder : c.border}
              hover:${c.activeBorder} hover:scale-[1.02] hover:shadow-panel
              ${active ? 'ring-1 ring-offset-0 shadow-panel scale-[1.02]' : ''}
            `}
          >
            <div className={`w-8 h-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${c.iconColor}`} />
            </div>
            <p className={`font-mono-data text-2xl font-bold ${c.numColor} leading-none`}>{c.value}</p>
            <p className={`text-xs mt-1 font-semibold leading-tight ${c.labelColor}`}>{c.label}</p>
            {active && (
              <div className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${
                c.color === 'indigo' ? 'bg-indigo-500' :
                c.color === 'emerald' ? 'bg-emerald-500' :
                c.color === 'amber' ? 'bg-amber-500' :
                c.color === 'blue' ? 'bg-blue-500' :
                'bg-rose-500'
              }`} />
            )}
          </button>
        );
      })}

      {/* Attendance % Card with circular gauge */}
      <div
        className={`
          relative text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-card
          bg-teal-500/10 border-teal-500/20 hover:border-teal-500/50 hover:scale-[1.02] hover:shadow-panel
          ${activeMetric === 'attendance' ? 'border-teal-500/60 ring-1 scale-[1.02] shadow-panel' : ''}
          flex flex-col items-start justify-between
        `}
        onClick={() => onMetricClick('attendance')}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <div>
            <TrendingUp className="w-4 h-4 text-teal-400 mb-2" />
            <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold leading-tight">Overall Attendance</p>
            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium mt-0.5">Monthly avg</p>
          </div>
          <CircularGauge pct={avgMonthly} />
        </div>
        {activeMetric === 'attendance' && (
          <div className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-teal-500" />
        )}
      </div>
    </div>
  );
}
