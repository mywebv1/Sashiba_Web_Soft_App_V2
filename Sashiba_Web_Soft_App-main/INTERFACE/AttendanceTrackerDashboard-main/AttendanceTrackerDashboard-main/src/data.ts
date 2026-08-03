import type { Subject, Student, Notification, AttendanceStatus, WeeklyEntry, SyllabusSubject } from './types';

export const CLASS_SUBJECTS: Record<string, Subject[]> = {
  '1': [
    { id: 'ban', name: 'Bangla', code: 'BAN' },
    { id: 'eng', name: 'English', code: 'ENG' },
    { id: 'math', name: 'Math', code: 'MTH' },
  ],
  '2': [
    { id: 'ban', name: 'Bangla', code: 'BAN' },
    { id: 'eng', name: 'English', code: 'ENG' },
    { id: 'math', name: 'Math', code: 'MTH' },
    { id: 'sci', name: 'Science', code: 'SCI' },
  ],
  '3': [
    { id: 'ban', name: 'Bangla', code: 'BAN' },
    { id: 'eng', name: 'English', code: 'ENG' },
    { id: 'math', name: 'Math', code: 'MTH' },
    { id: 'sci', name: 'Science', code: 'SCI' },
    { id: 'bgs', name: 'Bangladesh Studies', code: 'BGS' },
  ],
  '4': [
    { id: 'ban', name: 'Bangla', code: 'BAN' },
    { id: 'eng', name: 'English', code: 'ENG' },
    { id: 'math', name: 'Math', code: 'MTH' },
    { id: 'sci', name: 'Science', code: 'SCI' },
    { id: 'bgs', name: 'Bangladesh Studies', code: 'BGS' },
    { id: 'rel', name: 'Religion', code: 'REL' },
  ],
  '5': [
    { id: 'ban', name: 'Bangla', code: 'BAN' },
    { id: 'eng', name: 'English', code: 'ENG' },
    { id: 'math', name: 'Math', code: 'MTH' },
    { id: 'sci', name: 'Science', code: 'SCI' },
    { id: 'bgs', name: 'Bangladesh Studies', code: 'BGS' },
    { id: 'rel', name: 'Religion', code: 'REL' },
  ],
  '6': [
    { id: 'ban', name: 'Bangla', code: 'BAN' },
    { id: 'eng', name: 'English', code: 'ENG' },
    { id: 'math', name: 'Math', code: 'MTH' },
    { id: 'sci', name: 'General Science', code: 'SCI' },
    { id: 'sst', name: 'Social Science', code: 'SST' },
    { id: 'rel', name: 'Religion', code: 'REL' },
    { id: 'ict', name: 'ICT', code: 'ICT' },
  ],
  '7': [
    { id: 'ban', name: 'Bangla', code: 'BAN' },
    { id: 'eng', name: 'English', code: 'ENG' },
    { id: 'math', name: 'Math', code: 'MTH' },
    { id: 'sci', name: 'General Science', code: 'SCI' },
    { id: 'sst', name: 'Social Science', code: 'SST' },
    { id: 'rel', name: 'Religion', code: 'REL' },
    { id: 'ict', name: 'ICT', code: 'ICT' },
  ],
  '8': [
    { id: 'ban', name: 'Bangla', code: 'BAN' },
    { id: 'eng', name: 'English', code: 'ENG' },
    { id: 'math', name: 'Math', code: 'MTH' },
    { id: 'sci', name: 'General Science', code: 'SCI' },
    { id: 'sst', name: 'Social Science', code: 'SST' },
    { id: 'rel', name: 'Religion', code: 'REL' },
    { id: 'ict', name: 'ICT', code: 'ICT' },
    { id: 'agri', name: 'Agriculture', code: 'AGR' },
  ],
  '9': [
    { id: 'phy', name: 'Physics', code: 'PHY' },
    { id: 'che', name: 'Chemistry', code: 'CHE' },
    { id: 'bio', name: 'Biology', code: 'BIO' },
    { id: 'hmt', name: 'Higher Math', code: 'HMT' },
    { id: 'eng', name: 'English', code: 'ENG' },
    { id: 'ban', name: 'Bangla', code: 'BAN' },
    { id: 'ict', name: 'ICT', code: 'ICT' },
  ],
  '10': [
    { id: 'phy', name: 'Physics', code: 'PHY' },
    { id: 'che', name: 'Chemistry', code: 'CHE' },
    { id: 'bio', name: 'Biology', code: 'BIO' },
    { id: 'hmt', name: 'Higher Math', code: 'HMT' },
    { id: 'eng', name: 'English', code: 'ENG' },
    { id: 'ban', name: 'Bangla', code: 'BAN' },
    { id: 'ict', name: 'ICT', code: 'ICT' },
    { id: 'rel', name: 'Religion', code: 'REL' },
  ],
  '11': [
    { id: 'phy', name: 'Physics', code: 'PHY' },
    { id: 'che', name: 'Chemistry', code: 'CHE' },
    { id: 'bio', name: 'Biology', code: 'BIO' },
    { id: 'hmt', name: 'Higher Math', code: 'HMT' },
    { id: 'eng', name: 'English', code: 'ENG' },
    { id: 'ban', name: 'Bangla', code: 'BAN' },
    { id: 'ict', name: 'ICT', code: 'ICT' },
    { id: 'stat', name: 'Statistics', code: 'STA' },
    { id: 'eco', name: 'Economics', code: 'ECO' },
    { id: 'acc', name: 'Accounting', code: 'ACC' },
  ],
  '12': [
    { id: 'phy', name: 'Physics', code: 'PHY' },
    { id: 'che', name: 'Chemistry', code: 'CHE' },
    { id: 'bio', name: 'Biology', code: 'BIO' },
    { id: 'hmt', name: 'Higher Math', code: 'HMT' },
    { id: 'eng', name: 'English', code: 'ENG' },
    { id: 'ban', name: 'Bangla', code: 'BAN' },
    { id: 'ict', name: 'ICT', code: 'ICT' },
    { id: 'stat', name: 'Statistics', code: 'STA' },
    { id: 'eco', name: 'Economics', code: 'ECO' },
    { id: 'acc', name: 'Accounting', code: 'ACC' },
    { id: 'agri', name: 'Agriculture', code: 'AGR' },
    { id: 'art', name: 'Fine Arts', code: 'ART' },
  ],
};

export const SYLLABUS_BY_SUBJECT: Record<string, SyllabusSubject> = {
  phy: { id: 'phy', name: 'Physics', total: 19, completed: 12, lastUpdated: '2026-07-28' },
  che: { id: 'che', name: 'Chemistry', total: 16, completed: 10, lastUpdated: '2026-07-25' },
  bio: { id: 'bio', name: 'Biology', total: 22, completed: 14, lastUpdated: '2026-07-30' },
  hmt: { id: 'hmt', name: 'Higher Math', total: 18, completed: 11, lastUpdated: '2026-07-22' },
  eng: { id: 'eng', name: 'English', total: 12, completed: 9, lastUpdated: '2026-08-01' },
  ban: { id: 'ban', name: 'Bangla', total: 14, completed: 10, lastUpdated: '2026-07-29' },
  ict: { id: 'ict', name: 'ICT', total: 10, completed: 7, lastUpdated: '2026-07-31' },
  sci: { id: 'sci', name: 'Science', total: 15, completed: 9, lastUpdated: '2026-07-27' },
  math: { id: 'math', name: 'Math', total: 14, completed: 8, lastUpdated: '2026-07-26' },
  sst: { id: 'sst', name: 'Social Science', total: 12, completed: 7, lastUpdated: '2026-07-24' },
  rel: { id: 'rel', name: 'Religion', total: 10, completed: 6, lastUpdated: '2026-07-20' },
  bgs: { id: 'bgs', name: 'Bangladesh Studies', total: 11, completed: 6, lastUpdated: '2026-07-18' },
  stat: { id: 'stat', name: 'Statistics', total: 14, completed: 8, lastUpdated: '2026-07-25' },
  eco: { id: 'eco', name: 'Economics', total: 16, completed: 9, lastUpdated: '2026-07-23' },
  acc: { id: 'acc', name: 'Accounting', total: 13, completed: 7, lastUpdated: '2026-07-21' },
  agri: { id: 'agri', name: 'Agriculture', total: 12, completed: 6, lastUpdated: '2026-07-19' },
  art: { id: 'art', name: 'Fine Arts', total: 8, completed: 5, lastUpdated: '2026-07-17' },
};

const AVATAR_COLORS = [
  '#0D9488','#6366F1','#10B981','#F59E0B','#F43F5E',
  '#8B5CF6','#EC4899','#14B8A6','#3B82F6','#F97316',
  '#0EA5E9','#A855F7','#22C55E','#EF4444','#D97706',
];

function mkInitials(name: string) {
  return name.split(' ').filter(Boolean).map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

// Deterministic "random" based on seed
function seededRand(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function genWeeklyHistory(monthlyAvg: number, seed: number): WeeklyEntry[] {
  const entries: WeeklyEntry[] = [];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(2026, 7, 2); // Fixed reference date for determinism
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    // Skip Friday (5) and Saturday (6) – Bangladesh weekend
    if (dayOfWeek === 5 || dayOfWeek === 6) continue;
    const rand = seededRand(seed + i) * 100;
    let status: AttendanceStatus;
    if (rand < monthlyAvg - 15) status = 'P';
    else if (rand < monthlyAvg - 5) status = 'P';
    else if (rand < monthlyAvg + 5) status = 'L';
    else if (rand < monthlyAvg + 10) status = 'Lv';
    else status = 'A';
    entries.push({
      date: d.toISOString().slice(0, 10),
      status,
      label: dayLabels[dayOfWeek],
    });
  }
  return entries;
}

function rs(seed: number): AttendanceStatus {
  const pool: AttendanceStatus[] = ['P','P','P','P','P','P','A','A','L','Lv'];
  return pool[Math.floor(seededRand(seed) * pool.length)];
}

const RAW = [
  {
    name: 'Arif Hossain',       rating: 4, comment: 'Good performance',       monthlyAvg: 92,
    phone: '+880-171-234-5678', guardian: { name: 'Hossain Ali', phone: '+880-171-234-0000', relation: 'Father' },
  },
  {
    name: 'Nasrin Akter',       rating: 5, comment: 'Excellent student',       monthlyAvg: 97,
    phone: '+880-181-345-6789', guardian: { name: 'Akter Rahman', phone: '+880-181-345-0000', relation: 'Father' },
  },
  {
    name: 'Md. Jahangir Alam',  rating: 3, comment: 'Needs improvement',       monthlyAvg: 78,
    phone: '+880-191-456-7890', guardian: { name: 'Jahangir Begum', phone: '+880-191-456-0000', relation: 'Mother' },
  },
  {
    name: 'Fatema Begum',       rating: 4, comment: 'Active in class',         monthlyAvg: 88,
    phone: '+880-171-567-8901', guardian: { name: 'Kamal Begum', phone: '+880-171-567-0000', relation: 'Father' },
  },
  {
    name: 'Karim Uddin',        rating: 2, comment: 'Frequent absences',       monthlyAvg: 65,
    phone: '+880-181-678-9012', guardian: { name: 'Uddin Mia', phone: '+880-181-678-0000', relation: 'Father' },
  },
  {
    name: 'Sumaiya Khanam',     rating: 5, comment: 'Top of the class',        monthlyAvg: 99,
    phone: '+880-191-789-0123', guardian: { name: 'Khanam Nessa', phone: '+880-191-789-0000', relation: 'Mother' },
  },
  {
    name: 'Tanvir Ahmed',       rating: 3, comment: 'Average performance',     monthlyAvg: 80,
    phone: '+880-171-890-1234', guardian: { name: 'Ahmed Reza', phone: '+880-171-890-0000', relation: 'Father' },
  },
  {
    name: 'Ruksana Parvin',     rating: 4, comment: 'Consistent attendance',   monthlyAvg: 91,
    phone: '+880-181-901-2345', guardian: { name: 'Parvin Banu', phone: '+880-181-901-0000', relation: 'Mother' },
  },
  {
    name: 'Imran Khan',         rating: 3, comment: 'Improving steadily',      monthlyAvg: 83,
    phone: '+880-191-012-3456', guardian: { name: 'Khan Saheb', phone: '+880-191-012-0000', relation: 'Father' },
  },
  {
    name: 'Sabrina Islam',      rating: 5, comment: 'Class representative',    monthlyAvg: 96,
    phone: '+880-171-123-4567', guardian: { name: 'Islam Bhai', phone: '+880-171-123-0000', relation: 'Father' },
  },
  {
    name: 'Mahmudul Hasan',     rating: 4, comment: 'Sports captain',          monthlyAvg: 87,
    phone: '+880-181-234-5678', guardian: { name: 'Hasan Mullah', phone: '+880-181-234-0000', relation: 'Father' },
  },
  {
    name: 'Nusrat Jahan',       rating: 4, comment: 'Good in Sciences',        monthlyAvg: 90,
    phone: '+880-191-345-6789', guardian: { name: 'Jahan Ara', phone: '+880-191-345-0000', relation: 'Mother' },
  },
  {
    name: 'Rakibul Islam',      rating: 2, comment: 'Needs counseling',        monthlyAvg: 60,
    phone: '+880-171-456-7890', guardian: { name: 'Islam Munshi', phone: '+880-171-456-0000', relation: 'Father' },
  },
  {
    name: 'Farida Yesmin',      rating: 5, comment: 'Merit scholarship',       monthlyAvg: 98,
    phone: '+880-181-567-8901', guardian: { name: 'Yesmin Banu', phone: '+880-181-567-0000', relation: 'Mother' },
  },
  {
    name: 'Abdullah Al Mamun',  rating: 3, comment: 'Regular attendee',        monthlyAvg: 82,
    phone: '+880-191-678-9012', guardian: { name: 'Al Mamun Sr.', phone: '+880-191-678-0000', relation: 'Father' },
  },
];

const subs9 = CLASS_SUBJECTS['9'];

export const INITIAL_STUDENTS: Student[] = RAW.map((s, i) => ({
  id: `STU${String(i + 1).padStart(4, '0')}`,
  rollNo: i + 1,
  name: s.name,
  initials: mkInitials(s.name),
  avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
  classSection: 'IX-A',
  rating: s.rating,
  manualRating: null,
  comment: s.comment,
  attendance: Object.fromEntries(subs9.map((sub, j) => [sub.id, rs(i * 10 + j)])),
  monthlyAvg: s.monthlyAvg,
  phone: s.phone,
  guardian: s.guardian,
  weeklyHistory: genWeeklyHistory(s.monthlyAvg, i * 100),
  lastUpdated: '2026-08-02 09:30 AM',
}));

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1', title: 'New Student Enrolled',
    message: 'Abdullah Al Mamun enrolled in Class IX-A',
    time: '2 min ago', read: false, type: 'success',
  },
  {
    id: '2', title: 'Low Attendance Alert',
    message: 'Karim Uddin has 3 consecutive absences this week',
    time: '1 hr ago', read: false, type: 'warning',
  },
  {
    id: '3', title: 'Report Ready',
    message: 'October attendance report is ready for download',
    time: '3 hrs ago', read: true, type: 'info',
  },
  {
    id: '4', title: 'System Maintenance',
    message: 'Scheduled maintenance: Nov 15 at 11:00 PM',
    time: 'Yesterday', read: true, type: 'info',
  },
];
