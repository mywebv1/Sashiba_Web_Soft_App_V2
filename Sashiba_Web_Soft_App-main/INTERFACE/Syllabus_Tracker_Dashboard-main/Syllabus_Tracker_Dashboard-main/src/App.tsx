import React, { useState, useEffect, useCallback, useRef, useMemo, type DragEvent, type ReactNode } from 'react'
import type {
  UserRole, FilterState, FilterOptions, PlanRow, PlanMeta,
  SessionType, RowSource, VersionEntry, SourceTag, WorkflowStatus,
  CalendarStats, PlanTemplate, PreGenAnalytics,
} from './types'
import {
  apiGetSessions, apiGetCurricula, apiGetBoards, apiGetInstitutions,
  apiGetCampuses, apiGetGrades, apiGetGroups, apiGetSections,
  apiGetSubjects, apiGetTeachers, apiGetShifts, apiGetRooms,
  apiGetCalendarSyncs, apiGetCalendarStats, apiGetTemplates,
  apiGetPreGenAnalytics, apiGeneratePlan,
} from './api'

// ─── Multi-Draft Versioning ───────────────────────────────────────────────────

interface SavedPlan {
  id: string
  versionId: string
  label: string
  rows: PlanRow[]
  meta: PlanMeta | null
  savedAt: string
  author: string
  role: UserRole
  workflowStatus: WorkflowStatus
  filters: FilterState
}

function genVersionId(index: number): string {
  const year = new Date().getFullYear()
  const major = Math.floor(index / 10) + 1
  const minor = index % 10
  return `LP-${year}-v${major}.${minor}`
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ─── Roles & Permissions ──────────────────────────────────────────────────────

const ROLES: { id: UserRole; label: string; color: string }[] = [
  { id: 'SUPER_ADMIN', label: 'Super Admin', color: '#D93E3E' },
  { id: 'PRINCIPAL',   label: 'Principal',   color: '#4263EB' },
  { id: 'COORDINATOR', label: 'Coordinator', color: '#0EA672' },
  { id: 'TEACHER',     label: 'Teacher',     color: '#E07C00' },
]
const ROLE_RANK: Record<UserRole, number> = { TEACHER: 0, COORDINATOR: 1, PRINCIPAL: 2, SUPER_ADMIN: 3 }
const CAN = {
  generate: (r: UserRole) => r !== 'TEACHER',
  publish:  (r: UserRole) => ROLE_RANK[r] >= ROLE_RANK['PRINCIPAL'],
  editAny:  (r: UserRole) => r !== 'TEACHER',
  advance:  (r: UserRole, minRole: UserRole) => ROLE_RANK[r] >= ROLE_RANK[minRole],
}

// ─── Translations (English / Bangla) ─────────────────────────────────────────

type Lang = 'en' | 'bn'

const TR = {
  en: {
    brand:        'CurriculumOS',
    brandSub:     'Academic Planning',
    headerSub:    'Annual Lesson Plan · Bangladesh',
    workspace:    'Curriculum Workspace',
    filterChain:  'Filter Chain',
    filterHint:   '— select left-to-right, each step unlocks the next',
    planHistory:  'Plan History',
    generate:     'AI Generate Lesson Plan',
    addSession:   'Add Session',
    createManual: 'Create Manual Plan',
    browseTemplates: 'Browse Templates',
    backDash:     '← Back to Dashboard',
    underDev:     'This module is under development. It will be connected to the full curriculum management engine in a future release.',
    activeRole:   'Active Role',
    light:        'Light', dark: 'Dark',
    nav: { dashboard:'Dashboard', curriculum:'Curriculum', schedule:'Schedule', teachers:'Teachers', reports:'Reports', settings:'Settings' },
    filterLabels: {
      session:'Session', curriculum:'Curriculum', board:'Board', institution:'Institution',
      campus:'Campus', grade:'Class', group:'Group', section:'Section',
      subject:'Subject', teacher:'Teacher', shift:'Shift', room:'Room', calendarSync:'Cal. Sync',
    },
    filterPH: {
      session:'Academic Year', curriculum:'Curriculum', board:'Education Board', institution:'School / College',
      campus:'Campus', grade:'Class', group:'Group', section:'Section',
      subject:'Subject', teacher:'Teacher', shift:'Shift', room:'Room', calendarSync:'Calendar Sync',
    },
    metrics: { workingDays:'Working Days', planned:'Planned', aiGen:'AI Generated', teacherEdit:'Teacher Edits', locked:'Locked', conflicts:'Conflicts', coverage:'Coverage' },
    calLabel: 'CAL',
  },
  bn: {
    brand:        'CurriculumOS',
    brandSub:     'একাডেমিক পরিকল্পনা',
    headerSub:    'বার্ষিক পাঠ পরিকল্পনা · বাংলাদেশ',
    workspace:    'পাঠ্যক্রম কর্মক্ষেত্র',
    filterChain:  'ফিল্টার চেইন',
    filterHint:   '— বাম থেকে ডানে নির্বাচন করুন, প্রতিটি ধাপ পরবর্তীটি উন্মুক্ত করে',
    planHistory:  'পরিকল্পনার ইতিহাস',
    generate:     'AI দিয়ে পাঠ পরিকল্পনা তৈরি করুন',
    addSession:   'অধিবেশন যোগ করুন',
    createManual: 'ম্যানুয়াল পরিকল্পনা তৈরি করুন',
    browseTemplates: 'টেমপ্লেট দেখুন',
    backDash:     '← ড্যাশবোর্ডে ফিরুন',
    underDev:     'এই মডিউলটি উন্নয়নাধীন। ভবিষ্যতে পূর্ণ পাঠ্যক্রম ব্যবস্থাপনা ইঞ্জিনের সাথে সংযুক্ত হবে।',
    activeRole:   'সক্রিয় ভূমিকা',
    light:        'আলো', dark: 'অন্ধকার',
    nav: { dashboard:'ড্যাশবোর্ড', curriculum:'পাঠ্যক্রম', schedule:'সময়সূচি', teachers:'শিক্ষকবৃন্দ', reports:'প্রতিবেদন', settings:'সেটিংস' },
    filterLabels: {
      session:'শিক্ষাবর্ষ', curriculum:'পাঠ্যক্রম', board:'বোর্ড', institution:'প্রতিষ্ঠান',
      campus:'ক্যাম্পাস', grade:'শ্রেণি', group:'গ্রুপ', section:'শাখা',
      subject:'বিষয়', teacher:'শিক্ষক', shift:'শিফট', room:'কক্ষ', calendarSync:'ক্যালেন্ডার',
    },
    filterPH: {
      session:'শিক্ষাবর্ষ', curriculum:'পাঠ্যক্রম', board:'শিক্ষা বোর্ড', institution:'বিদ্যালয় / কলেজ',
      campus:'ক্যাম্পাস', grade:'শ্রেণি', group:'গ্রুপ', section:'শাখা',
      subject:'বিষয়', teacher:'শিক্ষক', shift:'শিফট', room:'কক্ষ', calendarSync:'ক্যালেন্ডার সিঙ্ক',
    },
    metrics: { workingDays:'কর্মদিবস', planned:'পরিকল্পিত', aiGen:'AI তৈরি', teacherEdit:'শিক্ষক সম্পাদনা', locked:'লক', conflicts:'দ্বন্দ্ব', coverage:'কভারেজ' },
    calLabel: 'ক্যাল',
  },
}

const BN_DATA: Record<string, string> = {
  // Months & Dates
  'August 2025': 'অগাস্ট ২০২৫',
  'September 2025': 'সেপ্টেম্বর ২০২৫',
  'October 2025': 'অক্টোবর ২০২৫',
  'November 2025': 'নভেম্বর ২০২৫',
  'December 2025': 'ডিসেম্বর ২০২৫',

  // Days
  'Mon': 'সোম', 'Tue': 'মঙ্গল', 'Wed': 'বুধ', 'Thu': 'বৃহঃ', 'Fri': 'শুক্র', 'Sat': 'শনি', 'Sun': 'রবি',
  'Monday': 'সোমবার', 'Tuesday': 'মঙ্গলবার', 'Wednesday': 'বুধবার', 'Thursday': 'বৃহস্পতিবার', 'Friday': 'শুক্রবার',

  // Teachers
  'Md. Rafiqul Islam': 'মো: রফিকুল ইসলাম',
  'Farhana Begum': 'ফরহানা বেগম',
  'Md. Shahidul Haque': 'মো: শহীদুল হক',
  'Nasrin Akter': 'নাসরিন আক্তার',
  'Md. Kamal Hossain': 'মো: কামাল হোসেন',
  'Shirin Sultana': 'শিরিন সুলতানা',
  'Md. Aminur Rahman': 'মো: আমিনুর রহমান',
  'Dr. Rashed Karim': 'ড. রাশেদ করিম',
  'Meher Negar Chowdhury': 'মেহের নেগার চৌধুরী',
  'Md. Jamal Uddin': 'মো: জামাল উদ্দিন',
  'Rubina Yesmin': 'রুবিনা ইয়াসমিন',

  // Rooms
  'Room 101': 'কক্ষ ১০১',
  'Room 201': 'কক্ষ ২০১',
  'Room 301': 'কক্ষ ৩০১',
  'Physics Lab': 'পদার্থবিজ্ঞান ল্যাব',
  'Chemistry Lab': 'রসায়ন ল্যাব',
  'Biology Lab': 'জীববিজ্ঞান ল্যাব',
  'ICT Lab 1': 'আইসিটি ল্যাব ১',
  'Lecture Hall A': 'লেকচার হল এ',
  'Smart Classroom 1': 'স্মার্ট শ্রেণিকক্ষ ১',

  // Shifts
  'Morning': 'প্রভাতী',
  'Day': 'দিবা',
  'Evening': 'সাঁধ্য',
  'Morning Shift': 'প্রভাতী শিফট',
  'Day Shift': 'দিবা শিফট',
  'Evening Shift': 'সাঁধ্য শিফট',

  // Classes & Sections
  'Class I': 'প্রথম শ্রেণি', 'Class II': 'দ্বিতীয় শ্রেণি', 'Class III': 'তৃতীয় শ্রেণি', 'Class IV': 'চতুর্থ শ্রেণি',
  'Class V': 'পঞ্চম শ্রেণি', 'Class VI': 'ষষ্ঠ শ্রেণি', 'Class VII': 'সপ্তম শ্রেণি', 'Class VIII': 'অষ্টম শ্রেণি',
  'Class IX': 'নবম শ্রেণি', 'Class X (SSC)': 'দশম শ্রেণি (এসএসসি)', 'Class XI (HSC-I)': 'একাদশ শ্রেণি (এইচএসসি-১)', 'Class XII (HSC-II)': 'দ্বাদশ শ্রেণি (এইচএসসি-২)',
  'Section A': 'শাখা ক', 'Section B': 'শাখা খ', 'Section C': 'শাখা গ', 'Section D': 'শাখা ঘ',
  'Sec A': 'ক', 'Sec B': 'খ', 'Sec C': 'গ', 'Sec D': 'ঘ',

  // Subjects
  'Physics': 'পদার্থবিজ্ঞান',
  'Chemistry': 'রসায়ন',
  'Biology': 'জীববিজ্ঞান',
  'Higher Math': 'উচ্চতর গণিত',
  'Higher Mathematics': 'উচ্চতর গণিত',
  'English': 'ইংরেজি',
  'Bangla': 'বাংলা',
  'ICT': 'তথ্য ও যোগাযোগ প্রযুক্তি',
  'Mathematics': 'গণিত',
  'General Mathematics': 'সাধারণ গণিত',
  'Accounting': 'হিসাববিজ্ঞান',
  'Business Studies': 'ব্যবসায় উদ্যোগ',
  'Business Entrepreneurship': 'ব্যবসায় উদ্যোগ',
  'Finance & Banking': 'ফিন্যান্স ও ব্যাংকিং',
  'Economics': 'অর্থনীতি',
  'History': 'ইতিহাস',
  'History of Bangladesh & World': 'বাংলাদেশ ও বিশ্বের ইতিহাস',
  'Geography': 'ভূগোল',
  'Civics': 'পৌরনীতি ও নাগরিকতা',
  'Civics & Citizenship': 'পৌরনীতি ও নাগরিকতা',
  'Religious Studies': 'ধর্ম ও নৈতিক শিক্ষা',

  // Session Types
  'LEC': 'লেকচার', 'LAB': 'ল্যাব', 'REV': 'রিভিশন', 'AST': 'মূল্যায়ন', 'ACT': 'অ্যাক্টিভিটি',
  'Lecture': 'লেকচার', 'Lab': 'ল্যাব', 'Revision': 'রিভিশন', 'Assessment': 'মূল্যায়ন', 'Activity': 'অ্যাক্টিভিটি',

  // Statuses & Source Tags
  'DRAFT': 'খসড়া', 'PUBLISHED': 'প্রকাশিত', 'ARCHIVED': 'আর্কাইভড',
  'AI_GEN': 'এআই জেনারেট', 'TEACHER_EDIT': 'শিক্ষক এডিট', 'IMPORTED': 'ইম্পোর্ট করা', 'TEMPLATE': 'টেমপ্লেট', 'MERGED': 'সংযুক্ত',
  'AI Gen': 'এআই তৈরি', 'Edited': 'সম্পাদিত', 'Import': 'ইম্পোর্ট', 'Copied': 'কপি করা', 'Template': 'টেমপ্লেট', 'Merged': 'সংযুক্ত',
  'AI': 'এআই', 'MANUAL': 'ম্যানুয়াল', 'MAN': 'ম্যানুয়াল', 'TPL': 'টেমপ্লেট', 'LCK': 'লক', 'OVR': 'ওভাররাইড',

  // Metrics Bar & Headers
  'Working Days': 'কর্মদিবস',
  'Planned': 'পরিকল্পিত',
  'AI Generated': 'এআই তৈরি',
  'Teacher Edits': 'শিক্ষক সম্পাদনা',
  'Locked': 'লক করা',
  'Conflicts': 'দ্বন্দ্ব',
  'Coverage': 'কভারেজ',

  // Table Column Headers
  'Date / Day': 'তারিখ / দিন',
  'Period & Time': 'পিরিয়ড ও সময়',
  'Shift': 'শিফট',
  'Class / Sec': 'শ্রেণি / সেকশন',
  'Subject': 'বিষয়',
  'Chapter': 'অধ্যায়',
  'Topic ▼': 'বিষয়বস্তু ▼',
  'LO': 'শিক্ষণফল',
  'Type': 'ধরন',
  'Teacher': 'শিক্ষক',
  'Room': 'কক্ষ',
  'Source': 'উৎস',
  'Status': 'স্ট্যাটাস',
  'Actions': 'অ্যাকশন',

  // Chapters & Topics
  'Physical Quantities & Measurement': 'ভৌত রাশি ও পরিমাপ',
  'Motion': 'গতি',
  'Dynamics': 'বল ও গতিবিজ্ঞান',
  'Work, Power & Energy': 'কাজ, ক্ষমতা ও শক্তি',
  'States of Matter & Pressure': 'পদার্থের অবস্থা ও চাপ',
  'Introduction to Chemistry': 'রসায়নের পরিচিতি',
  'Matter, Atoms & Molecules': 'পদার্থ, পরমাণু ও অণু',
  'Periodic Table': 'পর্যায় সারণি',
  'Chemical Bonding': 'রাসায়নিক বন্ধন',
  'Chemical Reactions': 'রাসায়নিক বিক্রিয়া',
  'Acid, Base & Salt': 'এসিড, ক্ষারক ও লবণ',
  'Real Numbers & Algebra': 'বাস্তব সংখ্যা ও বীজগণিত',
  'Geometry': 'জ্যামিতি',
  'Coordinate Geometry': 'স্থানাঙ্ক জ্যামিতি',
  'Vectors & Scalars': 'ভেক্টর ও স্কেলার',
  'Kinematics': 'গতিবিদ্যা',
  'Laws of Motion': 'গতির সূত্রাবলী',

  // Topics
  'Nature of physics; Physical quantities and units': 'পদার্থবিজ্ঞানের প্রকৃতি; ভৌত রাশি ও একক',
  'Measurement instruments and errors': 'পরিমাপের যন্ত্রপাতি ও ত্রুটি',
  'Distance, displacement, speed and velocity': 'দূরত্ব, সরণ, দ্রুতি ও বেগ',
  'Equations of uniformly accelerated motion': 'সুষম ত্বরণের গতির সমীকরণ',
  "Newton's Laws of Motion": 'নিউটনীয় গতিসূত্র',
  'Momentum, impulse and conservation': 'ভরবেগ, বলের ঘাত ও সংরক্ষণ',
  'Work, power and their formulae': 'কাজ, ক্ষমতা ও তাদের সূত্র',
  'Kinetic and potential energy; conservation': 'গতিশক্তি ও বিভব শক্তি; সংরক্ষণ',
  'Pressure in solids, liquids and gases': 'কঠিন, তরল ও গ্যাসে চাপ',
  'Nature, scope and branches of chemistry': 'রসায়নের প্রকৃতি, পরিধি ও শাখা',
  "Dalton's atomic theory; sub-atomic particles": 'ডাল্টনের পরমাণুবাদ; মৌলিক কণিকা',
  'Periods and groups — trends in properties': 'পর্যায় ও গ্রুপ — পর্যায়বৃত্ত ধর্ম',
  'Ionic, covalent and metallic bonds': 'আয়নিক, সমযোজী ও ধাতব বন্ধন',
  'Types and balancing of chemical equations': 'রাসায়নিক বিক্রিয়ার ধরন ও সমতা বিধান',
  'pH scale, indicators and neutralisation': 'পিএইচ স্কেল, নির্দেশক ও প্রশমন',
  'Real numbers; surds, indices and logarithms': 'বাস্তব সংখ্যা; সূচক ও লগারিদম',
  'Triangles, circles and coordinate proofs': 'ত্রিভুজ, বৃত্ত ও স্থানাঙ্ক প্রমাণ',
  'Lines, circles and their equations': 'সরলরেখা, বৃত্ত ও সমীকরণ',
  'Vector operations and applications': 'ভেক্টর অপারেশন ও প্রয়োগ',
  'Projectile motion and relative velocity': 'প্রাস গতি ও আপেক্ষিক বেগ',
  "Newton's laws in vector form; circular motion": 'ভেক্টর রূপে নিউটনের সূত্র; বৃত্তাকার গতি',

  // Detail Panel & Drawers
  'Outcomes': 'শিক্ষণফল',
  'Learning Outcomes': 'শিক্ষণফল',
  'AI Reasoning': 'এআই যুক্তি ও বিশ্লেষণ',
  'History': 'পরিবর্তনের ইতিহাস',
  'SUBTOPICS': 'সাবটপিকসমূহ',
  'LEARNING OUTCOMES': 'শিক্ষণফলসমূহ',
  'Save Outcomes': 'শিক্ষণফল সংরক্ষণ করুন',
  'Enter one learning outcome per line…': 'প্রতি লাইনে একটি করে শিক্ষণফল লিখুন…',
  'No notes added yet. Click edit button to edit.': 'কোনো নোট নেই। এডিট করতে বাটনে ক্লিক করুন।',
};

function txt(s: string, lang: Lang): string {
  if (lang !== 'bn' || !s) return s;
  if (BN_DATA[s]) return BN_DATA[s];

  let res = s;
  const monthMap: Record<string, string> = {
    'Jan': 'জানু', 'Feb': 'ফেব্রু', 'Mar': 'মার্চ', 'Apr': 'এপ্রিল', 'May': 'মে', 'Jun': 'জুন',
    'Jul': 'জুলাই', 'Aug': 'অগাস্ট', 'Sep': 'সেপ্টে', 'Oct': 'অক্টো', 'Nov': 'নভে', 'Dec': 'ডিসে',
    'January': 'জানুয়ারি', 'February': 'ফেব্রুয়ারি', 'March': 'মার্চ', 'April': 'এপ্রিল', 'May': 'মে', 'June': 'জুন',
    'July': 'জুলাই', 'August': 'অগাস্ট', 'September': 'সেপ্টেম্বর', 'October': 'অক্টোবর', 'November': 'নভেম্বর', 'December': 'ডিসেম্বর'
  };
  for (const [en, bn] of Object.entries(monthMap)) {
    if (res.includes(en)) res = res.replace(en, bn);
  }
  const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  if (/^\d{2}\s[A-Za-z]{3}\s\d{4}$/.test(s) || /^\d+/.test(s)) {
    res = res.replace(/\d/g, d => bnDigits[parseInt(d)]);
  }
  return res;
}

// ─── Filter chain ─────────────────────────────────────────────────────────────

type FilterKey = keyof Omit<FilterState, 'dateFrom' | 'dateTo'>

const FILTER_CHAIN: FilterKey[] = [
  'session', 'curriculum', 'board', 'institution', 'campus',
  'grade', 'group', 'section', 'subject', 'teacher', 'shift', 'room', 'calendarSync',
]

const FILTER_META: Record<FilterKey, { label: string; placeholder: string }> = {
  session:      { label: 'Session',     placeholder: 'Academic Year' },
  curriculum:   { label: 'Curriculum',  placeholder: 'Curriculum' },
  board:        { label: 'Board',       placeholder: 'Education Board' },
  institution:  { label: 'Institution', placeholder: 'School / College' },
  campus:       { label: 'Campus',      placeholder: 'Campus' },
  grade:        { label: 'Class',       placeholder: 'Class' },
  group:        { label: 'Group',       placeholder: 'Group' },
  section:      { label: 'Section',     placeholder: 'Section' },
  subject:      { label: 'Subject',     placeholder: 'Subject' },
  teacher:      { label: 'Teacher',     placeholder: 'Teacher' },
  shift:        { label: 'Shift',       placeholder: 'Shift' },
  room:         { label: 'Room',        placeholder: 'Room' },
  calendarSync: { label: 'Cal. Sync',   placeholder: 'Calendar Sync' },
}

const OPTION_KEY_MAP: Record<FilterKey, keyof FilterOptions> = {
  session: 'sessions', curriculum: 'curricula', board: 'boards',
  institution: 'institutions', campus: 'campuses', grade: 'grades',
  group: 'groups', section: 'sections', subject: 'subjects',
  teacher: 'teachers', shift: 'shifts', room: 'rooms',
  calendarSync: 'calendarSyncs',
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const I = {
  Logo:    () => <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" width={18} height={18}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 17.5h7M17.5 14v7" strokeLinecap="round"/></svg>,
  Sun:     () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={14} height={14}><circle cx="10" cy="10" r="3.2"/><path d="M10 1.5v2m0 13v2M1.5 10h2m13 0h2M4.4 4.4l1.4 1.4m8.4 8.4 1.4 1.4M4.4 15.6l1.4-1.4m8.4-8.4 1.4-1.4" strokeLinecap="round"/></svg>,
  Moon:    () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={14} height={14}><path d="M16.5 12A7 7 0 0 1 8 3.5a7 7 0 1 0 8.5 8.5Z" strokeLinejoin="round"/></svg>,
  Spark:   () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={13} height={13}><path d="M10 2l1.6 5.4H18l-4.9 3.7L14.7 17 10 13.5 5.3 17l1.6-5.9L2 7.4h6.4L10 2Z" strokeLinejoin="round"/></svg>,
  Grid:    () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={16} height={16}><rect x="2" y="2" width="6.5" height="6.5" rx="1.2"/><rect x="11.5" y="2" width="6.5" height="6.5" rx="1.2"/><rect x="2" y="11.5" width="6.5" height="6.5" rx="1.2"/><rect x="11.5" y="11.5" width="6.5" height="6.5" rx="1.2"/></svg>,
  Save:    () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={13} height={13}><path d="M3 5a2 2 0 0 1 2-2h8l4 4v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z"/><path d="M7 17V11h6v6M7 3h5v4H7V3Z" strokeLinejoin="round"/></svg>,
  Send:    () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={13} height={13}><path d="M10 13V3m0 0L6.5 6.5M10 3l3.5 3.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 17h14" strokeLinecap="round"/></svg>,
  Edit:    () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={13} height={13}><path d="M13 3.5a2 2 0 1 1 2.8 2.8L7 15.1 3 17l1.9-4L13 3.5Z" strokeLinejoin="round"/></svg>,
  Trash:   () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={13} height={13}><path d="M3 6h14M8 6V4h4v2M6 6v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6H6Z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Lock:    () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={12} height={12}><rect x="3" y="9" width="14" height="9" rx="2"/><path d="M7 9V7a3 3 0 0 1 6 0v2" strokeLinecap="round"/></svg>,
  Unlock:  () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={12} height={12}><rect x="3" y="9" width="14" height="9" rx="2"/><path d="M7 9V7a3 3 0 0 1 6 0" strokeLinecap="round"/></svg>,
  Print:   () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={13} height={13}><rect x="4" y="7" width="12" height="9" rx="1.5"/><path d="M6 7V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3" strokeLinejoin="round"/><path d="M7 12h6M7 15h4" strokeLinecap="round"/></svg>,
  Eye:     () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={13} height={13}><path d="M1.5 10S5 4 10 4s8.5 6 8.5 6-3.5 6-8.5 6-8.5-6-8.5-6Z"/><circle cx="10" cy="10" r="2.5"/></svg>,
  Grip:    () => <svg viewBox="0 0 20 20" fill="currentColor" width={11} height={11}><circle cx="7" cy="5" r="1.3"/><circle cx="13" cy="5" r="1.3"/><circle cx="7" cy="10" r="1.3"/><circle cx="13" cy="10" r="1.3"/><circle cx="7" cy="15" r="1.3"/><circle cx="13" cy="15" r="1.3"/></svg>,
  Chevron: () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.6} stroke="currentColor" width={12} height={12}><path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ChevUp:  () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.6} stroke="currentColor" width={12} height={12}><path d="M15 12.5l-5-5-5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ChevR:   () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={11} height={11}><path d="M7.5 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Close:   () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={14} height={14}><path d="M5 5l10 10M15 5 5 15" strokeLinecap="round"/></svg>,
  Warn:    () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={15} height={15}><path d="M8.6 3.4a1.65 1.65 0 0 1 2.8 0L18.4 16A1.65 1.65 0 0 1 16.96 18H3.04A1.65 1.65 0 0 1 1.6 16L8.6 3.4Z" strokeLinejoin="round"/><path d="M10 8v3.5m0 2.5v.5" strokeLinecap="round"/></svg>,
  History: () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={14} height={14}><circle cx="10" cy="10" r="8"/><path d="M10 6v4l2.5 2.5" strokeLinecap="round"/></svg>,
  Target:  () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={13} height={13}><circle cx="10" cy="10" r="8"/><circle cx="10" cy="10" r="4"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/></svg>,
  Brain:   () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={13} height={13}><path d="M10 3a4 4 0 0 1 4 3.5c.5.2 2 1 2 2.5 0 1-.5 2-1.5 2.5.2.5.5 2-.5 3S11.5 16 10 16c-1.5 0-3-.5-4-1.5S5.3 12 5.5 11.5C4.5 11 4 10 4 9c0-1.5 1.5-2.3 2-2.5A4 4 0 0 1 10 3Z" strokeLinejoin="round"/><path d="M10 3v13M7 9c0-1.5 3-2 3-2s3 .5 3 2" strokeLinecap="round"/></svg>,
  Filter:  () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={14} height={14}><path d="M3 5h14M6 10h8M9 15h2" strokeLinecap="round"/></svg>,
  Add:     () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={13} height={13}><path d="M10 4v12M4 10h12" strokeLinecap="round"/></svg>,
  User:    () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={14} height={14}><circle cx="10" cy="7" r="3"/><path d="M3 18a7 7 0 0 1 14 0" strokeLinecap="round"/></svg>,
  Clock:   () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={12} height={12}><circle cx="10" cy="10" r="8"/><path d="M10 6v4l2.5 2.5" strokeLinecap="round"/></svg>,
  Check:   () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.8} stroke="currentColor" width={12} height={12}><path d="M3.5 10.5l4.5 4.5 8-9" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Reload:  () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={13} height={13}><path d="M4.5 10a5.5 5.5 0 1 0 1-3" strokeLinecap="round"/><path d="M4.5 4v3h3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Cal:     () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={14} height={14}><rect x="2" y="4" width="16" height="14" rx="2"/><path d="M6 2v4M14 2v4M2 9h16" strokeLinecap="round"/></svg>,
  Lib:     () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={14} height={14}><rect x="2" y="3" width="4" height="14" rx="1"/><rect x="8" y="3" width="4" height="14" rx="1"/><rect x="14" y="3" width="4" height="14" rx="1"/></svg>,
  Chart:   () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={14} height={14}><path d="M2 16l4-5 4 2 4-7 4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Info:    () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={12} height={12}><circle cx="10" cy="10" r="8"/><path d="M10 9v5m0-7.5v.5" strokeLinecap="round"/></svg>,
  Settings:() => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={15} height={15}><circle cx="10" cy="10" r="3"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.9 4.9l1.4 1.4M13.7 13.7l1.4 1.4M4.9 15.1l1.4-1.4M13.7 6.3l1.4-1.4" strokeLinecap="round"/></svg>,
  Duplicate:() => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={13} height={13}><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M3 13V3h10" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Restore: () => <svg viewBox="0 0 20 20" fill="none" strokeWidth={1.4} stroke="currentColor" width={13} height={13}><path d="M4 8a6 6 0 1 1 .5 3" strokeLinecap="round"/><path d="M4 4v4h4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Dot:     () => <svg viewBox="0 0 8 8" fill="currentColor" width={8} height={8}><circle cx="4" cy="4" r="4"/></svg>,
}

// ─── Badge & config maps ──────────────────────────────────────────────────────

const ST: Record<SessionType, { label: string; color: string; bg: string }> = {
  LEC: { label: 'LEC', color: 'var(--lec-color)', bg: 'var(--lec-bg)' },
  LAB: { label: 'LAB', color: 'var(--lab-color)', bg: 'var(--lab-bg)' },
  REV: { label: 'REV', color: 'var(--rev-color)', bg: 'var(--rev-bg)' },
  AST: { label: 'AST', color: 'var(--ast-color)', bg: 'var(--ast-bg)' },
  ACT: { label: 'ACT', color: 'var(--act-color)', bg: 'var(--act-bg)' },
}

const SRC_CFG: Record<RowSource, { label: string; color: string; bg: string }> = {
  AI:       { label: 'AI',  color: 'var(--ai-color)',     bg: 'var(--ai-bg)'     },
  MANUAL:   { label: 'MAN', color: 'var(--manual-color)', bg: 'var(--manual-bg)' },
  TEMPLATE: { label: 'TPL', color: 'var(--tpl-color)',    bg: 'var(--tpl-bg)'    },
}
void SRC_CFG

const SOURCE_TAGS: Record<SourceTag, { label: string; icon: string; color: string; bg: string; desc: string }> = {
  AI_GEN:      { label: 'AI Gen',   icon: '★', color: 'var(--ai-color)',    bg: 'var(--ai-bg)',     desc: 'Generated by AI scheduling engine' },
  TEACHER_EDIT:{ label: 'Edited',   icon: '✎', color: 'var(--warning)',     bg: 'var(--warning-bg)',desc: 'Manually edited — protected from AI regeneration' },
  IMPORTED:    { label: 'Import',   icon: '↓', color: 'var(--tpl-color)',   bg: 'var(--tpl-bg)',   desc: 'Imported from external source or prior session' },
  COPIED:      { label: 'Copied',   icon: '⎘', color: 'var(--fg-muted)',   bg: 'var(--surface-3)',desc: "Copied from another section's plan" },
  TEMPLATE:    { label: 'Template', icon: '⊞', color: 'var(--tpl-color)',   bg: 'var(--tpl-bg)',   desc: 'Loaded from approved template library preset' },
  MERGED:      { label: 'Merged',   icon: '⊕', color: '#7C3AED',           bg: 'var(--lab-bg)',   desc: 'Merged from multiple source plans' },
}

const WORKFLOW_STEPS: { id: WorkflowStatus; label: string; minRole: UserRole }[] = [
  { id: 'DRAFT',    label: 'Draft',     minRole: 'TEACHER'     },
  { id: 'REVIEWED', label: 'Reviewed',  minRole: 'COORDINATOR' },
  { id: 'APPROVED', label: 'Approved',  minRole: 'PRINCIPAL'   },
  { id: 'PUBLISHED',label: 'Published', minRole: 'PRINCIPAL'   },
]

const SESSION_TYPE_OPTS: { value: SessionType; label: string }[] = [
  { value: 'LEC', label: 'LEC — Lecture' }, { value: 'LAB', label: 'LAB — Lab' },
  { value: 'REV', label: 'REV — Revision' }, { value: 'AST', label: 'AST — Assessment' },
  { value: 'ACT', label: 'ACT — Activity' },
]
const DAY_OPTS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const VALIDATION_LABELS: Record<string, string> = {
  difficultyBalanced: 'Difficulty Distribution Balanced (≤35% Hard)',
  labAllocated:       'Lab / Practical Sessions Allocated',
  revisionMapped:     'Revision Sessions Mapped per Chapter',
  examWeeksProtected: 'Board Exam Weeks Protected',
  teacherAvailable:   'Assigned Teacher Available',
}

const SIDEBAR_NAV = [
  { icon: <I.Grid/>,    label: 'Dashboard',  active: true },
  { icon: <I.Lib/>,     label: 'Curriculum', active: false },
  { icon: <I.Cal/>,     label: 'Schedule',   active: false },
  { icon: <I.User/>,    label: 'Teachers',   active: false },
  { icon: <I.Chart/>,   label: 'Reports',    active: false },
  { icon: <I.Settings/>,label: 'Settings',   active: false },
]

// ─── Utility components ───────────────────────────────────────────────────────

function Pill({ color, bg, children, size = 'sm' }: { color: string; bg: string; children: ReactNode; size?: 'xs' | 'sm' }) {
  const pad = size === 'xs' ? '1px 5px' : '2px 7px'
  const fs  = size === 'xs' ? 9.5 : 11
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:3, background:bg, color, borderRadius:4, padding:pad, fontSize:fs, fontWeight:600, fontFamily:"'JetBrains Mono',monospace", whiteSpace:'nowrap', lineHeight:1.45 }}>
      {children}
    </span>
  )
}

function Btn({ icon, label, onClick, variant='default', disabled=false, small=false }:{
  icon?: ReactNode; label?: string; onClick?: () => void
  variant?: 'default'|'primary'|'success'|'danger'|'ghost'; disabled?: boolean; small?: boolean
}) {
  const [hov, setHov] = useState(false)
  const styles: Record<string, React.CSSProperties> = {
    default: { background: hov ? 'var(--surface-3)' : 'var(--glass-surface)', border:'1px solid var(--glass-border-color)', color:'var(--fg-2)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)' },
    primary: { background: hov ? 'var(--primary-dark)' : 'var(--primary)', border:'none', color:'var(--primary-fg)' },
    success: { background: hov ? 'var(--success)' : 'var(--success-bg)', border:`1px solid var(--success)`, color: hov ? '#fff' : 'var(--success)' },
    danger:  { background: hov ? 'var(--danger-bg)' : 'transparent', border:`1px solid var(--danger)`, color:'var(--danger)' },
    ghost:   { background: 'transparent', border:'none', color:'var(--fg-muted)' },
  }
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:5, borderRadius:8, padding: small ? '4px 9px' : '6px 13px', fontSize: small ? 12 : 13, fontWeight:500, transition:'all 0.15s', opacity: disabled ? 0.45 : 1, cursor: disabled ? 'not-allowed' : 'pointer', ...styles[variant] }}>
      {icon}{label}
    </button>
  )
}

function SkelRow({ cols }: { cols: number }) {
  return (
    <tr style={{ borderBottom:'1px solid var(--border)' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="c"><div className="skel" style={{ height:14, width: i===0?20:i<3?50:'75%', borderRadius:4 }}/></td>
      ))}
    </tr>
  )
}

function SourceBadge({ tag }: { tag: SourceTag }) {
  const [hover, setHover] = useState(false)
  const cfg = SOURCE_TAGS[tag]
  return (
    <div style={{ position:'relative', display:'inline-flex' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Pill color={cfg.color} bg={cfg.bg} size="xs">{cfg.icon} {cfg.label}</Pill>
      {hover && (
        <div style={{ position:'absolute', bottom:'calc(100% + 6px)', left:'50%', transform:'translateX(-50%)',
          background:'var(--surface)', border:'1px solid var(--border-md)', borderRadius:8, padding:'8px 12px',
          fontSize:12, color:'var(--fg-2)', zIndex:400, boxShadow:'var(--shadow-md)',
          width:210, lineHeight:1.55, whiteSpace:'normal', pointerEvents:'none' }}>
          <div style={{ fontWeight:700, color:cfg.color, marginBottom:3 }}>{cfg.label}</div>
          {cfg.desc}
        </div>
      )}
    </div>
  )
}

// ─── Floating Glass Sidebar ───────────────────────────────────────────────────

function FloatingSidebar({ expanded, onMouseEnter, onMouseLeave }: {
  expanded: boolean; onMouseEnter: () => void; onMouseLeave: () => void
}) {
  return (
    <div className={`floating-sidebar no-print${expanded ? ' expanded' : ''}`}
      onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 10px', marginBottom:6, width:'100%', flexShrink:0 }}>
        <div style={{ width:30, height:30, borderRadius:8, background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 }}>
          <I.Logo/>
        </div>
        {expanded && (
          <span style={{ fontSize:13, fontWeight:800, color:'var(--fg)', fontFamily:"'Open Sans',system-ui,sans-serif", whiteSpace:'nowrap', letterSpacing:'-0.02em' }}>
            Curriculum
          </span>
        )}
      </div>
      <div style={{ width:'100%', height:1, background:'var(--border)', margin:'4px 0', flexShrink:0 }}/>
      {SIDEBAR_NAV.map((item, i) => (
        <button key={i} className={`sidebar-item${item.active ? ' active' : ''}`}
          style={{ justifyContent: expanded ? 'flex-start' : 'center' }}>
          <span style={{ display:'flex', alignItems:'center', flexShrink:0, width:18, height:18, justifyContent:'center' }}>{item.icon}</span>
          {expanded && <span style={{ overflow:'hidden', whiteSpace:'nowrap' }}>{item.label}</span>}
        </button>
      ))}
    </div>
  )
}

// ─── Plan History Dropdown ────────────────────────────────────────────────────

function PlanHistoryDropdown({ plans, onLoad, onDelete, onDuplicate, onClose }: {
  plans: SavedPlan[]
  onLoad: (p: SavedPlan) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onClose: () => void
}) {
  const wfColors: Record<WorkflowStatus, string> = {
    DRAFT: 'var(--fg-muted)', REVIEWED: 'var(--warning)', APPROVED: 'var(--success)', PUBLISHED: 'var(--primary)',
  }
  return (
    <div className="plan-history-dropdown">
      <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border-md)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:'var(--fg)', fontFamily:"'Open Sans',system-ui,sans-serif" }}>Saved Plan Versions</div>
          <div style={{ fontSize:12, color:'var(--fg-muted)', marginTop:1 }}>{plans.length} saved version{plans.length !== 1 ? 's' : ''} — no data loss on re-generation</div>
        </div>
        <button onClick={onClose} style={{ padding:6, border:'none', background:'var(--surface-2)', borderRadius:6, color:'var(--fg-muted)', display:'flex', cursor:'pointer' }}><I.Close/></button>
      </div>
      <div style={{ maxHeight:380, overflowY:'auto', padding:8 }}>
        {plans.length === 0 ? (
          <div style={{ padding:'32px 16px', textAlign:'center', color:'var(--fg-dim)', fontSize:13 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>📋</div>
            <div style={{ fontWeight:600, marginBottom:4, color:'var(--fg-muted)' }}>No saved versions yet</div>
            <div style={{ fontSize:12 }}>Generating or saving a plan auto-archives it here.</div>
          </div>
        ) : plans.map(p => (
          <div key={p.id}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 8px', borderRadius:8, borderBottom:'1px solid var(--border)', marginBottom:2, transition:'background 0.1s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, fontWeight:700, color:'var(--primary)' }}>{p.versionId}</span>
                <Pill color={wfColors[p.workflowStatus]} bg="var(--surface-3)" size="xs">{p.workflowStatus}</Pill>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--fg-2)', marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.label}</div>
              <div style={{ fontSize:11, color:'var(--fg-dim)', fontFamily:"'JetBrains Mono',monospace" }}>
                {fmtTime(p.savedAt)} · {p.author} · {p.rows.length} sessions
              </div>
            </div>
            <div style={{ display:'flex', gap:3, flexShrink:0 }}>
              <button onClick={() => onLoad(p)} title="Load this plan"
                style={{ padding:'4px 9px', fontSize:12, border:'1px solid var(--primary)', borderRadius:6, background:'var(--primary-muted)', color:'var(--primary)', cursor:'pointer', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                <I.Restore/>Load
              </button>
              <button onClick={() => onDuplicate(p.id)} title="Duplicate"
                style={{ padding:'4px 7px', border:'1px solid var(--border-md)', borderRadius:6, background:'transparent', color:'var(--fg-muted)', cursor:'pointer', display:'flex', alignItems:'center' }}>
                <I.Duplicate/>
              </button>
              <button onClick={() => onDelete(p.id)} title="Delete"
                style={{ padding:'4px 7px', border:'1px solid var(--danger)', borderRadius:6, background:'transparent', color:'var(--danger)', cursor:'pointer', display:'flex', alignItems:'center' }}>
                <I.Trash/>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:'8px 12px', borderTop:'1px solid var(--border)', background:'var(--surface-2)', fontSize:11.5, color:'var(--fg-dim)', display:'flex', alignItems:'center', gap:5 }}>
        <I.Info/> Current plan auto-archives before any re-generation.
      </div>
    </div>
  )
}

// ─── Bulk Action Toolbar ──────────────────────────────────────────────────────

function BulkActionToolbar({ count, onClear, onDeleteAll, onExport, notify }: {
  count: number; onClear: () => void; onDeleteAll: () => void; onExport: () => void
  notify: (msg: string, t?: 'ok'|'warn') => void
}) {
  return (
    <div className="bulk-toolbar" style={{
      background:'var(--glass-surface)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)',
      borderBottom:'1px solid var(--glass-border-color)',
      padding:'7px 80px', display:'flex', alignItems:'center', gap:10, zIndex:15,
    }}>
      <div style={{ width:22, height:22, borderRadius:'50%', background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>{count}</div>
      <span style={{ fontSize:13, color:'var(--fg-2)', fontWeight:500 }}>{count} session{count !== 1 ? 's' : ''} selected</span>
      <div style={{ display:'flex', gap:5, marginLeft:6 }}>
        <Btn label="💬 SMS" small onClick={() => notify('SMS feature — coming soon')}/>
        <Btn label="📱 WhatsApp" small onClick={() => notify('WhatsApp — coming soon')}/>
        <Btn label="📧 Email" small onClick={() => notify('Email — coming soon')}/>
        <Btn label="📤 Export" small onClick={onExport}/>
        <Btn label="🗑 Delete Selected" variant="danger" small onClick={onDeleteAll}/>
      </div>
      <button onClick={onClear}
        style={{ marginLeft:'auto', padding:'4px 10px', border:'1px solid var(--border-md)', borderRadius:7, background:'transparent', color:'var(--fg-muted)', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
        <I.Close/>Clear
      </button>
    </div>
  )
}

// ─── Calendar Engine Display ──────────────────────────────────────────────────

function CalendarEngine({ stats, syncStatus }: { stats: CalendarStats | null; syncStatus: 'synced' | 'pending' | 'failed' | null }) {
  if (!stats) return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 14px', background:'var(--glass-surface)', backdropFilter:'blur(12px)', borderRadius:8, fontSize:13, color:'var(--fg-dim)', border:'1px solid var(--glass-border-color)' }}>
      <I.Cal/><span>Calendar Engine — select Campus + Session to activate</span>
    </div>
  )
  const syncColors = { synced:'var(--success)', pending:'var(--warning)', failed:'var(--danger)' }
  const syncColor = syncStatus ? syncColors[syncStatus] : 'var(--fg-dim)'
  const Stat = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
      <span style={{ fontSize:18, fontWeight:800, fontFamily:"'Open Sans',system-ui,sans-serif", color, lineHeight:1 }}>{value}</span>
      <span style={{ fontSize:9, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--fg-muted)', fontFamily:"'Open Sans',system-ui,sans-serif", fontWeight:600, whiteSpace:'nowrap' }}>{label}</span>
    </div>
  )
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, padding:'6px 14px', background:'var(--glass-surface)', backdropFilter:'blur(12px)', borderRadius:8, border:'1px solid var(--glass-border-color)', flexWrap:'wrap' }}>
      <div style={{ display:'flex', alignItems:'center', gap:5 }}>
        <I.Cal/>
        <span style={{ fontSize:9.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--fg-2)', fontFamily:"'Open Sans',system-ui,sans-serif" }}>CAL {stats.academicYear}</span>
      </div>
      <div style={{ width:1, height:24, background:'var(--border-md)' }}/>
      <Stat label="Working Days" value={stats.workingDays} color="var(--success)"/>
      <div style={{ width:1, height:24, background:'var(--border)' }}/>
      <Stat label="Govt Holidays" value={stats.govtHolidays} color="var(--warning)"/>
      <div style={{ width:1, height:24, background:'var(--border)' }}/>
      <Stat label="Exam Days" value={stats.protectedExamDays} color="var(--danger)"/>
      <div style={{ width:1, height:24, background:'var(--border)' }}/>
      <Stat label="Inst Holidays" value={stats.institutionHolidays} color="var(--fg-muted)"/>
      <div style={{ width:1, height:24, background:'var(--border)' }}/>
      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'var(--fg-muted)' }}>{stats.sessionStart} → {stats.sessionEnd}</span>
      {syncStatus && (
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5, fontSize:11, color:syncColor }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:syncColor, display:'inline-block', flexShrink:0 }}/>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600 }}>{syncStatus.toUpperCase()}</span>
        </div>
      )}
    </div>
  )
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

function FilterBar({
  filters, options, loading, onChange, calendarStats, lang,
}: {
  filters: FilterState; options: FilterOptions; loading: Record<string, boolean>
  onChange: (key: FilterKey, val: string) => void
  calendarStats: CalendarStats | null
  lang: Lang
}) {
  const tl = TR[lang] ?? TR['en']
  const getOpts = (key: FilterKey) => (options[OPTION_KEY_MAP[key]] as { id: string; label?: string; name?: string; shortName?: string }[]) || []

  const isDisabled = (key: FilterKey): boolean => {
    if (key === 'section' || key === 'subject') {
      if (!filters.grade) return true
      const hasGroups = (options.groups || []).length > 0
      return hasGroups && !filters.group
    }
    if (key === 'group')        return !filters.grade
    if (key === 'teacher')      return !filters.subject
    if (key === 'shift')        return !filters.teacher
    if (key === 'room')         return !filters.shift
    if (key === 'calendarSync') return !filters.campus
    const idx = FILTER_CHAIN.indexOf(key)
    const parent = idx > 0 ? FILTER_CHAIN[idx - 1] : null
    if (!parent) return false
    return !(filters[parent as keyof FilterState] as string)
  }

  const fselStyle = (key: FilterKey): React.CSSProperties => ({
    background: filters[key] ? 'var(--primary-muted)' : 'var(--surface)',
    border: `1.5px solid ${filters[key] ? 'var(--primary)' : 'var(--border-md)'}`,
    color: filters[key] ? 'var(--primary)' : 'var(--fg)',
    fontWeight: 500,
  })

  const renderSelect = (key: FilterKey) => {
    const lbl = tl.filterLabels[key]
    const ph  = tl.filterPH[key]

    if (key === 'group' && filters.grade && !loading[key] && (options.groups || []).length === 0) {
      return (
        <div key={key} style={{ display:'flex', flexDirection:'column', gap:4, minWidth:125, width:135, flexShrink:0 }}>
          <span style={{ fontSize:12, fontWeight:600, color:'var(--fg-muted)', fontFamily:"'Open Sans',system-ui,sans-serif", whiteSpace:'nowrap' }}>{lbl}</span>
          <div style={{ padding:'0 10px', border:'1.5px dashed var(--border-strong)', borderRadius:7, height:36, display:'flex', alignItems:'center', gap:6, color:'var(--fg-muted)', background:'var(--surface-2)', fontSize:12 }}>
            <span style={{ fontSize:11, fontWeight:600, background:'var(--surface-3)', padding:'2px 6px', borderRadius:4, color:'var(--fg-dim)' }}>N/A</span>
            <span>{lang === 'bn' ? 'শ্রেণি ১–৮' : 'Class 1–8'}</span>
          </div>
        </div>
      )
    }
    const opts = getOpts(key)
    const dis = isDisabled(key) || loading[key]
    return (
      <div key={key} style={{ display:'flex', flexDirection:'column', gap:4, minWidth:125, width:135, flexShrink:0 }}>
        <span style={{ fontSize:12, fontWeight:600, color:'var(--fg-muted)', fontFamily:"'Open Sans',system-ui,sans-serif", whiteSpace:'nowrap' }}>
          {lbl}
        </span>
        {loading[key] ? (
          <div className="skel" style={{ height:36, borderRadius:7 }}/>
        ) : (
          <select className="fsel" value={filters[key]} disabled={dis} onChange={e => onChange(key, e.target.value)} style={{ ...fselStyle(key), height:36, fontSize:12, padding:'0 10px', borderRadius:7 }}>
            <option value="">{ph}</option>
            {opts.map((o: { id: string; label?: string; name?: string; shortName?: string }) => (
              <option key={o.id} value={o.id}>{txt(o.label || o.name || o.shortName || o.id, lang)}</option>
            ))}
          </select>
        )}
      </div>
    )
  }

  const selectedSync = (options.calendarSyncs || []).find(s => s.id === filters.calendarSync)

  return (
    <div className="filter-bar" style={{ background:'var(--surface)', borderBottom:'1px solid var(--border-md)', padding:'12px 80px 10px', position:'relative', zIndex:20 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
        <I.Filter/>
        <span style={{ fontSize:14, fontWeight:600, color:'var(--fg)', fontFamily:"'Open Sans',system-ui,sans-serif" }}>{tl.filterChain}</span>
        <span style={{ fontSize:13, fontWeight:400, color:'var(--fg-muted)' }}>{tl.filterHint}</span>
      </div>
      {/* Single horizontal line side-by-side filter chain */}
      <div style={{ display:'flex', alignItems:'center', gap:10, overflowX:'auto', paddingBottom:6 }}>
        {FILTER_CHAIN.map(key => renderSelect(key))}
      </div>
      <div style={{ marginTop:8 }}>
        <CalendarEngine stats={calendarStats} syncStatus={selectedSync?.status || null}/>
      </div>
    </div>
  )
}

// ─── Workflow Stepper ─────────────────────────────────────────────────────────

function WorkflowStepper({ status, role, onAdvance }: { status: WorkflowStatus; role: UserRole; onAdvance: (s: WorkflowStatus) => void }) {
  const currentIdx = WORKFLOW_STEPS.findIndex(s => s.id === status)
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0 }}>
      {WORKFLOW_STEPS.map((step, i) => {
        const isDone    = i < currentIdx
        const isCurrent = i === currentIdx
        const canClick  = i === currentIdx + 1 && CAN.advance(role, step.minRole)
        return (
          <React.Fragment key={step.id}>
            {i > 0 && <div style={{ width:22, height:1, background: isDone ? 'var(--primary)' : 'var(--border-md)', flexShrink:0 }}/>}
            <div onClick={() => canClick && onAdvance(step.id)} title={canClick ? `Advance to ${step.label}` : ''}
              style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 9px', borderRadius:6, flexShrink:0,
                background: isCurrent ? 'var(--primary)' : isDone ? 'var(--primary-muted)' : 'var(--surface-2)',
                border: `1px solid ${isCurrent ? 'var(--primary)' : isDone ? 'var(--primary)' : 'var(--border-md)'}`,
                color: isCurrent ? 'var(--primary-fg)' : isDone ? 'var(--primary)' : 'var(--fg-dim)',
                cursor: canClick ? 'pointer' : 'default', fontSize:12, fontWeight: isCurrent ? 700 : isDone ? 600 : 400, transition:'all 0.12s' }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:'currentColor', flexShrink:0 }}/>
              {step.label}
              {canClick && <span style={{ fontSize:9.5 }}>↑</span>}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Metrics Bar ──────────────────────────────────────────────────────────────

function MetricsBar({ meta, role, onGenerate, onCreateManual, onShowTemplates, onSave, onPublish, generating, onAdvanceWorkflow, calStats, lang }:{
  meta: PlanMeta | null; role: UserRole; generating: boolean; calStats: CalendarStats | null; lang: Lang
  onGenerate: () => void; onCreateManual: () => void; onShowTemplates: () => void
  onSave: () => void; onPublish: () => void; onAdvanceWorkflow: (s: WorkflowStatus) => void
}) {
  const Div = () => <div style={{ width:1, height:52, background:'var(--border-md)', flexShrink:0, alignSelf:'center' }}/>

  const KPI = (label: string, value: ReactNode, color: string) => (
    <div className="kpi-card" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, flexShrink:0, padding:'0 6px' }}>
      <div style={{ fontSize:30, fontWeight:700, fontFamily:"'Open Sans',system-ui,sans-serif", color, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--fg-muted)', fontFamily:"'Open Sans',system-ui,sans-serif", fontWeight:500, whiteSpace:'nowrap', textAlign:'center' }}>{txt(label, lang)}</div>
    </div>
  )

  const CoverageDial = ({ pct }: { pct: number }) => {
    const r = 20, circ = 2 * Math.PI * r
    const dash = (pct / 100) * circ
    const color = pct >= 80 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--danger)'
    return (
      <div className="kpi-card" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, flexShrink:0, padding:'0 6px' }}>
        <div style={{ position:'relative', width:48, height:48 }}>
          <svg width={48} height={48} style={{ transform:'rotate(-90deg)' }}>
            <circle cx={24} cy={24} r={r} fill="none" stroke="var(--border-md)" strokeWidth={4}/>
            <circle cx={24} cy={24} r={r} fill="none" stroke={color} strokeWidth={4}
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/>
          </svg>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color, fontFamily:"'Open Sans',system-ui,sans-serif" }}>{pct}%</div>
        </div>
        <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--fg-muted)', fontWeight:500, whiteSpace:'nowrap' }}>{lang === 'bn' ? 'কভারেজ' : 'Coverage'}</div>
      </div>
    )
  }

  const hasConflicts = false
  const validationPass = meta ? meta.coveragePercent >= 60 : false

  return (
    <div className="metrics-bar no-print" style={{ background:'var(--surface)', borderBottom:'1px solid var(--border-md)', flexShrink:0 }}>
      {/* KPI row */}
      <div style={{ padding:'10px 80px', display:'flex', alignItems:'center', gap:10, overflowX:'auto' }}>
        {KPI('Working Days',   calStats?.workingDays        ?? (meta?.workingDays ?? '—'),        '#3B82F6')}
        <Div/>
        {KPI('Govt. Holidays', calStats?.govtHolidays       ?? '—', '#F59E0B')}
        <Div/>
        {KPI('Exam Days',      calStats?.protectedExamDays  ?? '—', '#EF4444')}
        <Div/>
        {KPI('Inst. Holidays', calStats?.institutionHolidays ?? '—', '#8B5CF6')}
        <Div/>
        {KPI('Teaching Cap.',  calStats?.availableTeachingDays ?? '—', '#10B981')}
        <Div/>
        {meta ? (
          <>
            {KPI('AI Generated',  meta.aiGeneratedCount,  '#6D28D9')}
            <Div/>
            {KPI('Manual Edited', meta.manualCount,       '#0369A1')}
            <Div/>
            {KPI('Locked Rows',   meta.lockedCount,       meta.lockedCount > 0 ? '#E07C00' : 'var(--fg-muted)')}
            <Div/>
            <CoverageDial pct={meta.coveragePercent}/>
            <Div/>
            <div className="kpi-card" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, flexShrink:0, padding:'0 6px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:7,
                background: validationPass ? 'var(--success-bg)' : 'var(--danger-bg)',
                border: `1px solid ${validationPass ? 'var(--success)' : 'var(--danger)'}` }}>
                <span style={{ fontSize:14, color: validationPass ? 'var(--success)' : 'var(--danger)' }}>{validationPass ? '✓' : '✗'}</span>
                <span style={{ fontSize:13, fontWeight:700, color: validationPass ? 'var(--success)' : 'var(--danger)' }}>
                  {validationPass ? 'PASS' : 'FAIL'}
                </span>
              </div>
              <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--fg-muted)', fontWeight:500, whiteSpace:'nowrap' }}>
                Validation · {hasConflicts ? '⚠ Conflicts' : '0 Conflicts'}
              </div>
            </div>
          </>
        ) : (
          <span style={{ fontSize:13, color:'var(--fg-muted)', fontStyle:'italic' }}>Generate a plan to view session metrics</span>
        )}
      </div>
      {/* Workflow + action buttons row */}
      <div style={{ padding:'8px 80px', borderTop:'1px solid var(--border-md)', display:'flex', alignItems:'center', gap:8 }}>
        {meta && <WorkflowStepper status={meta.workflowStatus} role={role} onAdvance={onAdvanceWorkflow}/>}
        <div style={{ flex:1 }}/>
        {CAN.generate(role) && (
          <>
            <Btn icon={generating ? <span style={{ fontSize:10 }}>●</span> : <I.Spark/>}
              label={generating ? 'Generating…' : 'AI Generate'} variant="primary" onClick={onGenerate} disabled={generating}/>
            <Btn icon={<I.Add/>} label="Manual" onClick={onCreateManual}/>
          </>
        )}
        <Btn icon={<I.Lib/>} label="Templates" onClick={onShowTemplates}/>
        <Btn icon={<I.Save/>} label="Save Draft" onClick={onSave}/>
        {CAN.publish(role) && <Btn icon={<I.Send/>} label="Publish" variant="success" onClick={onPublish} disabled={!meta}/>}
      </div>
    </div>
  )
}

// ─── Pre-Gen Analytics Modal ──────────────────────────────────────────────────

function PreGenModal({ analytics, loading, onClose, onConfirm }: {
  analytics: PreGenAnalytics | null; loading: boolean; onClose: () => void; onConfirm: () => void
}) {
  const allPass = analytics ? Object.values(analytics.validations).every(Boolean) : false
  const warnCount = analytics ? Object.values(analytics.validations).filter(v => !v).length : 0
  return (
    <div className="modal-overlay" onClick={e => { if ((e.target as Element).classList.contains('modal-overlay')) onClose() }}>
      <div style={{ background:'var(--glass-surface)', backdropFilter:'var(--glass-blur)', WebkitBackdropFilter:'var(--glass-blur)', border:'1px solid var(--glass-border-color)', borderRadius:14, maxWidth:560, width:'95%', boxShadow:'var(--shadow-xl)', animation:'fade-in 0.2s ease' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border-md)', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <I.Chart/><h3 style={{ margin:0, fontSize:16, fontWeight:700, fontFamily:"'Open Sans',system-ui,sans-serif", color:'var(--fg)' }}>Pre-Generation Analytics</h3>
            </div>
            <p style={{ margin:0, fontSize:13, color:'var(--fg-muted)' }}>Auto-distribution analysis and safety validation before AI scheduling.</p>
          </div>
          <button onClick={onClose} style={{ padding:6, border:'none', background:'var(--surface-2)', borderRadius:6, color:'var(--fg-muted)', display:'flex', cursor:'pointer' }}><I.Close/></button>
        </div>
        <div style={{ padding:20 }}>
          {loading || !analytics ? (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {Array.from({length:6}).map((_,i) => <div key={i} className="skel" style={{ height:i===0?60:36, borderRadius:8 }}/>)}
            </div>
          ) : (
            <>
              <div style={{ background:'var(--surface-2)', borderRadius:10, padding:16, marginBottom:14, border:'1px solid var(--border)' }}>
                <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--fg-dim)', fontFamily:"'JetBrains Mono',monospace", marginBottom:12 }}>DISTRIBUTION PACE</div>
                <div style={{ display:'flex', gap:20, marginBottom:12 }}>
                  {[
                    { label:'Topics', value:analytics.totalTopics, color:'var(--primary)' },
                    { label:'Working Days', value:analytics.workingDays, color:'var(--fg-2)' },
                    { label:'Topics/Week', value:analytics.topicsPerWeek.toFixed(1), color: analytics.topicsPerWeek > 3 ? 'var(--danger)' : analytics.topicsPerWeek > 2 ? 'var(--warning)' : 'var(--success)' },
                    { label:'Topics/Day', value:analytics.topicsPerDay.toFixed(2), color:'var(--fg-muted)' },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign:'center' }}>
                      <div style={{ fontSize:24, fontWeight:800, fontFamily:"'Open Sans',system-ui,sans-serif", color:s.color, lineHeight:1 }}>{s.value}</div>
                      <div style={{ fontSize:9.5, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--fg-dim)', fontFamily:"'JetBrains Mono',monospace", marginTop:3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ height:6, borderRadius:3, background:'var(--surface-3)' }}>
                  <div style={{ height:'100%', borderRadius:3, background: analytics.topicsPerWeek > 3 ? 'var(--danger)' : analytics.topicsPerWeek > 2 ? 'var(--warning)' : 'var(--success)', width:`${Math.min(analytics.estimatedCompletionPercent, 100)}%`, transition:'width 0.4s ease' }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'var(--fg-dim)', marginTop:4, fontFamily:"'JetBrains Mono',monospace" }}>
                  <span>0%</span><span>Est. {analytics.estimatedCompletionPercent}% coverage</span><span>100%</span>
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--fg-dim)', fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>SAFETY VALIDATIONS</div>
                {Object.entries(analytics.validations).map(([key, pass]) => (
                  <div key={key} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', background: pass ? 'var(--success-bg)' : 'var(--danger-bg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color: pass ? 'var(--success)' : 'var(--danger)', flexShrink:0 }}>{pass ? '✓' : '✗'}</div>
                    <span style={{ fontSize:13, color:'var(--fg-2)', flex:1 }}>{VALIDATION_LABELS[key] || key}</span>
                    <Pill color={pass ? 'var(--success)' : 'var(--danger)'} bg={pass ? 'var(--success-bg)' : 'var(--danger-bg)'} size="xs">{pass ? 'PASS' : 'FAIL'}</Pill>
                  </div>
                ))}
              </div>
              {warnCount > 0 && (
                <div style={{ padding:'9px 12px', background:'var(--warning-bg)', border:'1px solid var(--warning)', borderRadius:8, fontSize:13, color:'var(--warning)', display:'flex', gap:7, alignItems:'center', marginBottom:14 }}>
                  <I.Warn/> {warnCount} rule{warnCount > 1 ? 's' : ''} failed — review or generate anyway.
                </div>
              )}
            </>
          )}
        </div>
        <div style={{ padding:'12px 20px', borderTop:'1px solid var(--border-md)', display:'flex', justifyContent:'flex-end', gap:8, background:'var(--surface-2)', borderRadius:'0 0 14px 14px' }}>
          <Btn label="Cancel" onClick={onClose}/>
          <Btn label={allPass ? 'Generate Plan' : 'Generate Anyway'} variant={allPass ? 'primary' : 'danger'} icon={<I.Spark/>} onClick={onConfirm} disabled={loading}/>
        </div>
      </div>
    </div>
  )
}

// ─── Template Library Modal ───────────────────────────────────────────────────

function TemplateLibraryModal({ templates, onClose, onApply }: {
  templates: PlanTemplate[]; onClose: () => void; onApply: (t: PlanTemplate) => void
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const curricula = ['all', ...Array.from(new Set(templates.map(t => t.curriculum)))]
  const filtered = templates.filter(t =>
    (filter === 'all' || t.curriculum === filter) &&
    (search === '' || t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some(g => g.toLowerCase().includes(search.toLowerCase())))
  )
  return (
    <div className="modal-overlay" onClick={e => { if ((e.target as Element).classList.contains('modal-overlay')) onClose() }}>
      <div style={{ background:'var(--glass-surface)', backdropFilter:'var(--glass-blur)', WebkitBackdropFilter:'var(--glass-blur)', border:'1px solid var(--glass-border-color)', borderRadius:14, maxWidth:720, width:'96%', maxHeight:'88vh', display:'flex', flexDirection:'column', boxShadow:'var(--shadow-xl)', animation:'fade-in 0.2s ease' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border-md)', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}><I.Lib/><h3 style={{ margin:0, fontSize:16, fontWeight:700, fontFamily:"'Open Sans',system-ui,sans-serif", color:'var(--fg)' }}>Enterprise Template Library</h3></div>
            <p style={{ margin:0, fontSize:12.5, color:'var(--fg-muted)' }}>Pre-built academic plans for NCTB, Cambridge, Edexcel, Madrasah, BTEB and custom.</p>
          </div>
          <button onClick={onClose} style={{ padding:6, border:'none', background:'var(--surface-2)', borderRadius:6, color:'var(--fg-muted)', display:'flex', cursor:'pointer' }}><I.Close/></button>
        </div>
        <div style={{ padding:'10px 20px', display:'flex', gap:8, alignItems:'center', borderBottom:'1px solid var(--border)' }}>
          <input type="text" placeholder="Search templates…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex:1, background:'var(--surface-2)', border:'1px solid var(--border-md)', borderRadius:8, padding:'6px 12px', fontSize:13, color:'var(--fg)', outline:'none', fontFamily:'inherit', height:40 }}/>
          <div style={{ display:'flex', gap:4 }}>
            {curricula.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                style={{ padding:'4px 10px', borderRadius:7, border:'1px solid', fontSize:12, fontWeight:500, cursor:'pointer', background: filter===c ? 'var(--primary)' : 'var(--surface-2)', borderColor: filter===c ? 'var(--primary)' : 'var(--border-md)', color: filter===c ? 'var(--primary-fg)' : 'var(--fg-muted)' }}>
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
        </div>
        <div style={{ overflowY:'auto', padding:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {filtered.map(t => (
            <div key={t.id} onClick={() => onApply(t)}
              style={{ border:'1px solid var(--border-md)', borderRadius:10, padding:14, cursor:'pointer', transition:'border-color 0.12s, background 0.12s', background:'var(--surface-2)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='var(--primary)'; (e.currentTarget as HTMLElement).style.background='var(--primary-muted)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='var(--border-md)'; (e.currentTarget as HTMLElement).style.background='var(--surface-2)' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                <div style={{ fontSize:26, lineHeight:1, flexShrink:0 }}>{t.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--fg)', fontFamily:"'Open Sans',system-ui,sans-serif", marginBottom:3 }}>{t.name}</div>
                  <div style={{ fontSize:12, color:'var(--fg-muted)', lineHeight:1.5, marginBottom:8 }}>{t.description}</div>
                  <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:6 }}>
                    {t.tags.map(tag => <Pill key={tag} color="var(--fg-dim)" bg="var(--surface-3)" size="xs">{tag}</Pill>)}
                  </div>
                  <div style={{ display:'flex', gap:12, fontSize:11, color:'var(--fg-dim)', fontFamily:"'JetBrains Mono',monospace" }}>
                    <span>🗓 {t.weekCount}w</span><span>📋 {t.topicCount} topics</span><span>📚 {t.gradeRange}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ gridColumn:'1/-1', textAlign:'center', padding:40, color:'var(--fg-dim)', fontSize:13 }}>No templates match your search.</div>}
        </div>
      </div>
    </div>
  )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ row, onClose, onUpdate }: { row: PlanRow; onClose: () => void; onUpdate: (id: string, p: Partial<PlanRow>) => void }) {
  const [tab, setTab] = useState<'outcomes'|'ai'|'history'>('outcomes')
  const [outcomes, setOutcomes] = useState(row.learningOutcomes.join('\n'))
  const tabs = [
    { id:'outcomes' as const, label:'Outcomes', icon:<I.Target/> },
    { id:'ai' as const, label:'AI Reasoning', icon:<I.Brain/> },
    { id:'history' as const, label:'History', icon:<I.History/> },
  ]
  const saveOutcomes = () => onUpdate(row.id, { learningOutcomes: outcomes.split('\n').filter(Boolean) })
  const changeColors: Record<string, string> = { CREATE:'var(--success)', EDIT:'var(--primary)', LOCK:'var(--fg-muted)', OVERRIDE:'var(--warning)', AI_GEN:'var(--ai-color)', REORDER:'var(--tpl-color)' }

  return (
    <div className="detail-panel">
      <div style={{ padding:'13px 15px', borderBottom:'1px solid var(--border-md)', display:'flex', alignItems:'flex-start', gap:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:5, flexWrap:'wrap' }}>
            <Pill color={ST[row.sessionType].color} bg={ST[row.sessionType].bg}>{ST[row.sessionType].label}</Pill>
            <SourceBadge tag={row.sourceTag}/>
            {row.isLocked && <Pill color="var(--fg-muted)" bg="var(--surface-3)" size="xs"><I.Lock/>LCK</Pill>}
            {row.isManualOverride && <Pill color="var(--warning)" bg="var(--warning-bg)" size="xs">OVR</Pill>}
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--fg)', fontFamily:"'Open Sans',system-ui,sans-serif", lineHeight:1.4 }}>Ch {row.chapterNo}: {row.chapterTitle}</div>
          <div style={{ fontSize:12, color:'var(--fg-muted)', marginTop:3 }}>{row.topics[0]}</div>
          <div style={{ display:'flex', gap:10, marginTop:5, fontSize:11.5, color:'var(--fg-dim)', fontFamily:"'JetBrains Mono',monospace" }}>
            <span>{row.date} · {row.dayOfWeek}</span><span>P{row.periodNumber} · {row.startTime}</span><span>{row.durationMin}m</span>
          </div>
        </div>
        <button onClick={onClose} style={{ padding:4, borderRadius:6, border:'none', background:'var(--surface-2)', color:'var(--fg-muted)', display:'flex', cursor:'pointer' }}><I.Close/></button>
      </div>
      <div style={{ padding:'7px 15px', borderBottom:'1px solid var(--border)', background:'var(--surface-2)', display:'flex', gap:12, fontSize:12 }}>
        <span><span style={{ color:'var(--fg-dim)' }}>Teacher: </span><strong>{row.teacherName}</strong></span>
        <span><span style={{ color:'var(--fg-dim)' }}>Room: </span><strong>{row.roomName}</strong></span>
      </div>
      <div style={{ display:'flex', borderBottom:'1px solid var(--border-md)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex:1, padding:'9px 0', border:'none', borderBottom: tab===t.id ? '2px solid var(--primary)' : '2px solid transparent', background:'transparent', color: tab===t.id ? 'var(--primary)' : 'var(--fg-muted)', fontSize:12, fontWeight: tab===t.id ? 600 : 400, display:'flex', alignItems:'center', justifyContent:'center', gap:5, cursor:'pointer', transition:'color 0.12s' }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:15 }}>
        {tab === 'outcomes' && (
          <div className="fade-in">
            {row.subtopics.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:700, color:'var(--fg-dim)', textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>SUBTOPICS</div>
                {row.subtopics.map((st, si) => (
                  <div key={st.id} style={{ marginBottom:10, paddingLeft:12, borderLeft:'2px solid var(--primary-muted)' }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'var(--fg-2)', marginBottom:2 }}>{si+1}. {st.title}</div>
                    <div style={{ fontSize:11, color:'var(--fg-dim)', marginBottom:4, fontFamily:"'JetBrains Mono',monospace" }}>{st.durationMin} min</div>
                    <ul style={{ margin:0, paddingLeft:14, fontSize:12, color:'var(--fg-muted)', lineHeight:1.6 }}>
                      {st.learningOutcomes.map((lo, li) => <li key={li}>{lo}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            <div style={{ fontSize:10, fontWeight:700, color:'var(--fg-dim)', textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>LEARNING OUTCOMES</div>
            <textarea value={outcomes} onChange={e => setOutcomes(e.target.value)} rows={6}
              style={{ width:'100%', background:'var(--surface-2)', border:'1px solid var(--border-md)', borderRadius:7, color:'var(--fg)', padding:'10px 12px', fontSize:13, outline:'none', lineHeight:1.7, fontFamily:'inherit' }}
              placeholder="Enter one learning outcome per line…"/>
            <div style={{ marginTop:8 }}><Btn icon={<I.Check/>} label="Save Outcomes" variant="primary" small onClick={saveOutcomes}/></div>
          </div>
        )}
        {tab === 'ai' && (
          <div className="fade-in">
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}><I.Brain/><span style={{ fontSize:12, fontWeight:600, color:'var(--ai-color)' }}>AI Scheduling Rationale</span></div>
            {row.sourceTag === 'AI_GEN' ? (
              <div style={{ background:'var(--ai-bg)', border:'1px solid var(--ai-color)', borderRadius:8, padding:'12px 14px', fontSize:13, color:'var(--fg-2)', lineHeight:1.7 }}>{row.aiReasoning}</div>
            ) : (
              <div style={{ background:'var(--surface-2)', border:'1px solid var(--border-md)', borderRadius:8, padding:'12px 14px', fontSize:13, color:'var(--fg-muted)', lineHeight:1.7 }}>
                This row was added manually (<strong>{SOURCE_TAGS[row.sourceTag]?.label}</strong>) and does not carry AI rationale.
              </div>
            )}
          </div>
        )}
        {tab === 'history' && (
          <div className="fade-in">
            <div style={{ fontSize:12, color:'var(--fg-muted)', marginBottom:12 }}>{row.versionHistory.length} change{row.versionHistory.length !== 1 ? 's' : ''} recorded.</div>
            {[...row.versionHistory].reverse().map((v: VersionEntry, idx) => (
              <div key={v.id} style={{ display:'flex', gap:10, paddingBottom:12 }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ width:9, height:9, borderRadius:'50%', background: changeColors[v.changeType] || 'var(--fg-dim)', flexShrink:0, marginTop:2 }}/>
                  {idx < row.versionHistory.length-1 && <div style={{ width:1, flex:1, background:'var(--border-md)', marginTop:2 }}/>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:12, fontWeight:600, color: changeColors[v.changeType] || 'var(--fg-muted)' }}>{v.changeType.replace('_',' ')}</span>
                    <span style={{ fontSize:10.5, color:'var(--fg-dim)', fontFamily:"'JetBrains Mono',monospace" }}>{fmtTime(v.timestamp)}</span>
                  </div>
                  <div style={{ fontSize:12, color:'var(--fg-2)', marginTop:2 }}>{v.changedBy}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Regen Modal ──────────────────────────────────────────────────────────────

function RegenModal({ manualCount, lockedCount, onClose, onConfirm }: { manualCount: number; lockedCount: number; onClose: () => void; onConfirm: (keepOverrides: boolean) => void }) {
  const [choice, setChoice] = useState<'keep'|'full'>('keep')
  const RadioCard = ({ id, val, title, desc, color }: { id:'keep'|'full'; val:'keep'|'full'; title:string; desc:string; color:string }) => (
    <label style={{ display:'flex', gap:12, padding:'11px 13px', borderRadius:10, border:`1.5px solid ${choice===id?color:'var(--border-md)'}`, background: choice===id?(id==='keep'?'var(--success-bg)':'var(--danger-bg)'):'var(--surface-2)', cursor:'pointer', marginBottom:8, transition:'border-color 0.12s' }}>
      <input type="radio" value={val} checked={choice===id} onChange={()=>setChoice(id)} style={{ marginTop:3 }}/>
      <div>
        <div style={{ fontSize:13.5, fontWeight:600, color, fontFamily:"'Open Sans',system-ui,sans-serif" }}>{title}</div>
        <div style={{ fontSize:12, color:'var(--fg-muted)', marginTop:3, lineHeight:1.6 }}>{desc}</div>
      </div>
    </label>
  )
  return (
    <div className="modal-overlay" onClick={e => { if ((e.target as Element).classList.contains('modal-overlay')) onClose() }}>
      <div className="modal-box">
        <div style={{ display:'flex', gap:12, marginBottom:16 }}>
          <div style={{ padding:9, background:'var(--warning-bg)', borderRadius:8, color:'var(--warning)', flexShrink:0, display:'flex', alignItems:'center' }}><I.Warn/></div>
          <div>
            <h3 style={{ margin:0, fontSize:16, fontWeight:700, fontFamily:"'Open Sans',system-ui,sans-serif", color:'var(--fg)' }}>Regenerate Curriculum Plan?</h3>
            <p style={{ margin:'5px 0 0', fontSize:13, color:'var(--fg-muted)', lineHeight:1.6 }}>
              Current plan has <strong style={{ color:'var(--warning)' }}>{manualCount} manual override{manualCount!==1?'s':''}</strong> and <strong>{lockedCount} locked row{lockedCount!==1?'s':''}</strong>. Current version will be auto-archived.
            </p>
          </div>
        </div>
        <RadioCard id="keep" val="keep" title="Protect Teacher Edits (Recommended)"
          desc="AI regenerates only unlocked, non-overridden rows. All teacher edits are preserved."
          color="var(--success)"/>
        <RadioCard id="full" val="full" title="Full Regeneration"
          desc="All rows replaced by AI. Manual overrides, locks, and custom entries will be cleared."
          color="var(--danger)"/>
        {choice === 'full' && (
          <div style={{ padding:'8px 12px', background:'var(--danger-bg)', border:'1px solid var(--danger)', borderRadius:7, fontSize:13, color:'var(--danger)', marginBottom:12, display:'flex', gap:6 }}>
            <I.Warn/> Destructive — {manualCount+lockedCount} row{manualCount+lockedCount!==1?'s':''} will be overwritten.
          </div>
        )}
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:16 }}>
          <Btn label="Cancel" onClick={onClose}/>
          <Btn label={choice==='keep'?'Regenerate (Protected)':'Regenerate All'} variant={choice==='keep'?'success':'danger'} icon={<I.Reload/>} onClick={() => onConfirm(choice==='keep')}/>
        </div>
      </div>
    </div>
  )
}

// ─── Add / Edit Row Modal ─────────────────────────────────────────────────────

interface EditGridOptions {
  subjects: { value: string; label: string }[]
  teachers: { value: string; label: string }[]
  rooms:    { value: string; label: string }[]
  shifts:   { value: string; label: string }[]
}

function AddRowModal({ editRow, editGridOptions, role, onClose, onSave }: {
  editRow?: PlanRow; editGridOptions: EditGridOptions; role: UserRole; onClose: () => void; onSave: (row: PlanRow) => void
}) {
  const isEdit = !!editRow
  const mkId = () => `row-${Date.now()}-${Math.random().toString(36).slice(2,6)}`
  const [form, setForm] = useState<PlanRow>(() => ({
    id: editRow?.id ?? mkId(), rowIndex: editRow?.rowIndex ?? 0,
    date: editRow?.date ?? new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),
    dayOfWeek: editRow?.dayOfWeek ?? 'Mon',
    periodNumber: editRow?.periodNumber ?? 1, startTime: editRow?.startTime ?? '08:00', endTime: editRow?.endTime ?? '08:45',
    shiftId: editRow?.shiftId ?? (editGridOptions.shifts[0]?.value ?? ''),
    shiftName: editRow?.shiftName ?? (editGridOptions.shifts[0]?.label ?? ''),
    classLabel: editRow?.classLabel ?? '', sectionName: editRow?.sectionName ?? '',
    subjectCode: editRow?.subjectCode ?? (editGridOptions.subjects[0]?.value ?? ''),
    subjectName: editRow?.subjectName ?? (editGridOptions.subjects[0]?.label ?? ''),
    chapterNo: editRow?.chapterNo ?? 1, chapterTitle: editRow?.chapterTitle ?? '',
    topics: editRow?.topics ?? [''], subtopics: editRow?.subtopics ?? [],
    sessionType: editRow?.sessionType ?? 'LEC',
    teacherName: editRow?.teacherName ?? (editGridOptions.teachers[0]?.label ?? ''),
    teacherId: editRow?.teacherId ?? (editGridOptions.teachers[0]?.value ?? ''),
    roomName: editRow?.roomName ?? (editGridOptions.rooms[0]?.label ?? ''), durationMin: editRow?.durationMin ?? 45,
    source: 'MANUAL', sourceTag: 'TEACHER_EDIT',
    isLocked: editRow?.isLocked ?? false, isManualOverride: true,
    learningOutcomes: editRow?.learningOutcomes ?? [], aiReasoning: '',
    versionHistory: editRow?.versionHistory ?? [], createdAt: editRow?.createdAt ?? new Date().toISOString(), updatedAt: new Date().toISOString(),
  }))
  const set = <K extends keyof PlanRow>(key: K, val: PlanRow[K]) => setForm(p => ({ ...p, [key]: val }))
  const handleSave = () => {
    const entry: VersionEntry = { id:`vh-${Date.now()}`, timestamp:new Date().toISOString(), changedBy:ROLES.find(r=>r.id===role)?.label??role, role, changeType:isEdit?'OVERRIDE':'CREATE' }
    onSave({ ...form, versionHistory:[...form.versionHistory, entry], updatedAt:new Date().toISOString() })
  }
  const inp: React.CSSProperties = { background:'var(--surface-2)', border:'1px solid var(--border-md)', borderRadius:7, padding:'6px 10px', fontSize:13, color:'var(--fg)', outline:'none', fontFamily:'inherit', width:'100%', height:40 }
  const sel: React.CSSProperties = { ...inp, appearance:'none', WebkitAppearance:'none', backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 20 20' fill='none' stroke='%238E9DB8' stroke-width='1.5'%3E%3Cpath d='M5 7.5l5 5 5-5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat:'no-repeat', backgroundPosition:'right 8px center', paddingRight:28 }
  const Field = ({ label, children, span2 }: { label: string; children: ReactNode; span2?: boolean }) => (
    <div style={{ display:'flex', flexDirection:'column', gap:4, gridColumn:span2?'1/-1':undefined }}>
      <label style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--fg-dim)', fontFamily:"'JetBrains Mono',monospace" }}>{label}</label>
      {children}
    </div>
  )
  return (
    <div className="modal-overlay" onClick={e => { if ((e.target as Element).classList.contains('modal-overlay')) onClose() }}>
      <div style={{ background:'var(--glass-surface)', backdropFilter:'var(--glass-blur)', WebkitBackdropFilter:'var(--glass-blur)', border:'1px solid var(--glass-border-color)', borderRadius:14, maxWidth:680, width:'95%', maxHeight:'92vh', overflowY:'auto', boxShadow:'var(--shadow-xl)', animation:'fade-in 0.2s ease', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'15px 20px', borderBottom:'1px solid var(--border-md)', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <h3 style={{ margin:0, fontSize:16, fontWeight:700, fontFamily:"'Open Sans',system-ui,sans-serif", color:'var(--fg)' }}>{isEdit ? 'Edit Session Row' : 'Add New Session'}</h3>
            <p style={{ margin:'4px 0 0', fontSize:12.5, color:'var(--fg-muted)' }}>{isEdit ? 'Changes flagged as Teacher Edit — protected from AI regeneration.' : 'Manual rows are tagged Teacher Edit.'}</p>
          </div>
          <button onClick={onClose} style={{ padding:6, border:'none', background:'var(--surface-2)', borderRadius:6, color:'var(--fg-muted)', display:'flex', cursor:'pointer' }}><I.Close/></button>
        </div>
        <div style={{ padding:18, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, overflowY:'auto' }}>
          <Field label="Date"><input type="text" style={inp} value={form.date} onChange={e => set('date', e.target.value)}/></Field>
          <Field label="Day"><select style={sel} value={form.dayOfWeek} onChange={e => set('dayOfWeek', e.target.value)}>{DAY_OPTS.map(d=><option key={d} value={d}>{d}</option>)}</select></Field>
          <Field label="Period No."><input type="number" style={inp} min={1} max={10} value={form.periodNumber} onChange={e => set('periodNumber', parseInt(e.target.value)||1)}/></Field>
          <Field label="Duration (min)"><input type="number" style={inp} min={20} max={180} step={5} value={form.durationMin} onChange={e => set('durationMin', parseInt(e.target.value)||45)}/></Field>
          <Field label="Start Time"><input type="time" style={inp} value={form.startTime} onChange={e => set('startTime', e.target.value)}/></Field>
          <Field label="End Time"><input type="time" style={inp} value={form.endTime} onChange={e => set('endTime', e.target.value)}/></Field>
          <Field label="Shift">
            <select style={sel} value={form.shiftId} onChange={e => { const s=editGridOptions.shifts.find(x=>x.value===e.target.value); set('shiftId',e.target.value); set('shiftName',s?.label??'') }}>
              <option value="">— Select —</option>
              {editGridOptions.shifts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Session Type">
            <select style={sel} value={form.sessionType} onChange={e => set('sessionType', e.target.value as SessionType)}>
              {SESSION_TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="Subject">
            <select style={sel} value={form.subjectCode} onChange={e => { const s=editGridOptions.subjects.find(x=>x.value===e.target.value); set('subjectCode',e.target.value); set('subjectName',s?.label??e.target.value) }}>
              <option value="">— Select —</option>
              {editGridOptions.subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Teacher">
            <select style={sel} value={form.teacherId} onChange={e => { const t=editGridOptions.teachers.find(x=>x.value===e.target.value); set('teacherId',e.target.value); set('teacherName',t?.label??'') }}>
              <option value="">— Select —</option>
              {editGridOptions.teachers.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Room">
            <select style={sel} value={form.roomName} onChange={e => set('roomName', e.target.value)}>
              <option value="">— Select —</option>
              {editGridOptions.rooms.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </Field>
          <Field label="Chapter No."><input type="number" style={inp} min={1} max={99} value={form.chapterNo} onChange={e => set('chapterNo', parseInt(e.target.value)||1)}/></Field>
          <Field label="Chapter Title" span2><input type="text" style={inp} value={form.chapterTitle} onChange={e => set('chapterTitle', e.target.value)} placeholder="e.g. Physical Quantities & Measurement"/></Field>
          <Field label="Topic(s) — one per line" span2>
            <textarea style={{ ...inp, height:80, resize:'vertical' }} value={form.topics.join('\n')} onChange={e => set('topics', e.target.value.split('\n'))} placeholder="Enter one topic per line…"/>
          </Field>
          <Field label="Learning Outcomes — one per line" span2>
            <textarea style={{ ...inp, height:80, resize:'vertical' }} value={form.learningOutcomes.join('\n')} onChange={e => set('learningOutcomes', e.target.value.split('\n').filter(Boolean))} placeholder="Students will be able to…"/>
          </Field>
        </div>
        <div style={{ padding:'7px 20px', background:'var(--warning-bg)', borderTop:'1px solid var(--border-md)', display:'flex', alignItems:'center', gap:7, fontSize:13, color:'var(--warning)', flexShrink:0 }}>
          <I.Warn/> Row saved as <strong style={{ marginLeft:3 }}>Teacher Edit</strong> — locked from AI regeneration.
        </div>
        <div style={{ padding:'11px 20px', borderTop:'1px solid var(--border-md)', display:'flex', justifyContent:'flex-end', gap:8, background:'var(--surface-2)', flexShrink:0 }}>
          <Btn label="Cancel" onClick={onClose}/>
          <Btn label={isEdit ? 'Save Changes' : 'Add Session'} variant="primary" icon={isEdit ? <I.Check/> : <I.Add/>} onClick={handleSave}/>
        </div>
      </div>
    </div>
  )
}

// ─── Planning Grid ────────────────────────────────────────────────────────────

const COLS = [
  { label:'☑',              w:32  },
  { label:'#',              w:32  },
  { label:'Date / Day',     w:86  },
  { label:'Period & Time',  w:100 },
  { label:'Shift',          w:62  },
  { label:'Class / Sec',    w:78  },
  { label:'Subject',        w:80  },
  { label:'Chapter',        w:140 },
  { label:'Topic ▼',        w:185 },
  { label:'LO',             w:36  },
  { label:'Type',           w:50  },
  { label:'Teacher',        w:130 },
  { label:'Room',           w:82  },
  { label:'Source',         w:62  },
  { label:'Status',         w:56  },
  { label:'Actions',        w:130 },
]

function PlanningGrid({ rows, loading, selectedId, role, selectedRows, onToggleRow, onToggleAll, onSelect, onReorder, onUpdate, onDelete, onEditRow, editGridOptions, lang }:{
  rows: PlanRow[]; loading: boolean; selectedId: string|null; role: UserRole
  selectedRows: Set<string>; onToggleRow: (id: string) => void; onToggleAll: () => void
  onSelect: (r: PlanRow|null) => void; onReorder: (from: string, to: string) => void
  onUpdate: (id: string, p: Partial<PlanRow>) => void; onDelete: (id: string) => void
  onEditRow: (row: PlanRow) => void; editGridOptions: EditGridOptions; lang: Lang
}) {
  const [dragId, setDragId] = useState<string|null>(null)
  const [dragOver, setDragOver] = useState<string|null>(null)
  const [rippleIds, setRippleIds] = useState<Set<string>>(new Set())
  const [editCell, setEditCell] = useState<{id:string;field:string}|null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [teacherTooltip, setTeacherTooltip] = useState<{name:string;subject:string;email:string;x:number;y:number}|null>(null)
  const editRef = useRef<HTMLInputElement>(null)

  useEffect(() => { editRef.current?.focus() }, [editCell])

  const conflictSet = useMemo(() => {
    const seen = new Map<string, string>()
    const conflicts = new Set<string>()
    rows.forEach(row => {
      if (!row.teacherId || !row.date || !row.startTime) return
      const key = `${row.teacherId}-${row.date}-${row.startTime}`
      if (seen.has(key)) { conflicts.add(row.id); conflicts.add(seen.get(key)!) }
      else seen.set(key, row.id)
    })
    return conflicts
  }, [rows])

  const toggleExpand = (id: string) => setExpandedRows(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n })

  const startDrag = (e: DragEvent, id: string) => { setDragId(id); e.dataTransfer.effectAllowed='move' }
  const overDrag  = (e: DragEvent, id: string) => { e.preventDefault(); setDragOver(id) }
  const dropRow   = (e: DragEvent, toId: string) => {
    e.preventDefault()
    if (dragId && dragId !== toId) {
      onReorder(dragId, toId)
      const ids = new Set<string>()
      const fi = rows.findIndex(r=>r.id===dragId), ti = rows.findIndex(r=>r.id===toId)
      rows.slice(Math.min(fi,ti), Math.max(fi,ti)+1).forEach(r => ids.add(r.id))
      setRippleIds(ids); setTimeout(()=>setRippleIds(new Set()), 750)
    }
    setDragId(null); setDragOver(null)
  }

  const commitEdit = (id: string, field: string, val: string) => {
    const coerced: Partial<PlanRow> = ['periodNumber','chapterNo','durationMin'].includes(field)
      ? { [field]: parseInt(val) || 0 } : { [field]: val }
    onUpdate(id, coerced); setEditCell(null)
  }

  type EditType = 'text' | 'select' | 'number' | 'time'
  const editable = (row: PlanRow, field: string, val: string, cfg: { type?: EditType; opts?: {value:string;label:string}[]; style?: React.CSSProperties }) => {
    const { type='text', opts, style } = cfg
    const isEditing = editCell?.id===row.id && editCell.field===field
    const canEdit = !row.isLocked && CAN.editAny(role)
    if (isEditing) {
      if (type==='select' && opts) return (
        <select autoFocus className="cell-input" value={val} style={{ appearance:'none', WebkitAppearance:'none' }}
          onChange={e => commitEdit(row.id, field, e.target.value)} onBlur={() => setEditCell(null)}>
          {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )
      return (
        <input ref={editRef} className="cell-input" type={type==='number'?'number':type==='time'?'time':'text'}
          defaultValue={val}
          onBlur={e => commitEdit(row.id, field, e.target.value)}
          onKeyDown={e => { if(e.key==='Enter') commitEdit(row.id,field,(e.target as HTMLInputElement).value); if(e.key==='Escape') setEditCell(null) }}/>
      )
    }
    return (
      <span onClick={() => canEdit && setEditCell({id:row.id, field})}
        title={canEdit ? 'Click to edit' : row.isLocked ? 'Locked' : ''}
        style={{ display:'block', borderRadius:3, padding:'1px 2px', cursor:canEdit?'text':'default', ...style }}
        onMouseEnter={e => { if(canEdit)(e.target as HTMLElement).style.background='var(--surface-3)' }}
        onMouseLeave={e => { (e.target as HTMLElement).style.background='transparent' }}>
        {val || <span style={{ color:'var(--fg-dim)', fontStyle:'italic', fontSize:'0.88em' }}>—</span>}
      </span>
    )
  }

  const allSelected = rows.length > 0 && rows.every(r => selectedRows.has(r.id))
  const seenDate = new Set<string>()

  const TD = ({ children, style, cls, colSpan }: { children?: ReactNode; style?: React.CSSProperties; cls?: string; colSpan?: number }) => (
    <td className={`c ${cls||''}`} colSpan={colSpan} style={{ padding:'8px 10px', verticalAlign:'middle', ...style }}>{children}</td>
  )

  const ActionBtn = ({ icon, title, onClick, danger }: { icon: ReactNode; title: string; onClick: () => void; danger?: boolean }) => (
    <button onClick={onClick} title={title}
      style={{ padding:'4px 5px', borderRadius:5, border:`1px solid ${danger ? 'var(--danger)' : 'var(--border-md)'}`, background:'transparent', color: danger ? 'var(--danger)' : 'var(--fg-muted)', display:'flex', alignItems:'center', transition:'all 150ms', flexShrink:0 }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = danger ? 'var(--danger-bg)' : 'var(--surface-3)'; (e.currentTarget as HTMLElement).style.color = danger ? 'var(--danger)' : 'var(--fg)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = danger ? 'var(--danger)' : 'var(--fg-muted)' }}>
      {icon}
    </button>
  )

  return (
    <div style={{ overflowY:'auto', maxHeight:'calc(100vh - 228px)', width:'100%' }}>
      {teacherTooltip && (
        <div className="teacher-tooltip" style={{ left: teacherTooltip.x, top: teacherTooltip.y }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--primary-muted)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <I.User/>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--fg)' }}>{teacherTooltip.name}</div>
              <div style={{ fontSize:11, color:'var(--fg-muted)' }}>{teacherTooltip.subject}</div>
            </div>
          </div>
          <div style={{ fontSize:11, color:'var(--fg-dim)', fontFamily:"'JetBrains Mono',monospace" }}>{teacherTooltip.email}</div>
        </div>
      )}

      <table style={{ borderCollapse:'collapse', width:'100%', tableLayout:'fixed' }}>
        <colgroup>{COLS.map((c,i) => <col key={i} style={{ width:c.w }}/>)}</colgroup>
        <thead style={{ position:'sticky', top:0, zIndex:5 }}>
          <tr style={{ background:'var(--glass-surface)', backdropFilter:'blur(12px)', borderBottom:'1.5px solid var(--border-md)' }}>
            <th className="sticky-0" style={{ padding:'8px 10px', background:'var(--glass-surface)', backdropFilter:'blur(12px)', borderRight:'1px solid var(--border)' }}>
              <input type="checkbox" checked={allSelected} onChange={onToggleAll}
                style={{ width:15, height:15, cursor:'pointer', accentColor:'var(--primary)' }}/>
            </th>
            {COLS.slice(1).map((col, i) => (
              <th key={i} className={i===0?'sticky-1':i===1?'sticky-2':i===2?'sticky-3':''}
                style={{ textAlign:'left', fontSize:13, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--fg-dim)', whiteSpace:'nowrap', fontFamily:"'JetBrains Mono',monospace", borderRight:'1px solid var(--border)', background:'var(--glass-surface)', backdropFilter:'blur(12px)' }}>
                {txt(col.label, lang)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? Array.from({length:10}).map((_,i) => <SkelRow key={i} cols={COLS.length}/>)
          : rows.map(row => {
            const isDragging = dragId===row.id, isDragOver = dragOver===row.id
            const isSelected = selectedId===row.id || selectedRows.has(row.id)
            const isRipple = rippleIds.has(row.id)
            const isExpanded = expandedRows.has(row.id)
            const hasSubtopics = row.subtopics.length > 0
            const isConflict = conflictSet.has(row.id)
            const showDate = !seenDate.has(row.date)
            if(showDate) seenDate.add(row.date)

            return (
              <React.Fragment key={row.id}>
                <tr draggable
                  onDragStart={e=>startDrag(e,row.id)} onDragOver={e=>overDrag(e,row.id)}
                  onDrop={e=>dropRow(e,row.id)} onDragEnd={()=>{setDragId(null);setDragOver(null)}}
                  className={`grid-row${isDragging?' dragging':''}${isDragOver?' drag-over':''}${isSelected?' selected':''}${isRipple?' ripple':''}${isConflict?' conflict':''}`}
                  style={{ borderBottom:'1px solid var(--border)', cursor:'grab' }}>

                  <TD cls="sticky-0">
                    <input type="checkbox" checked={selectedRows.has(row.id)} onChange={() => onToggleRow(row.id)}
                      style={{ width:15, height:15, cursor:'pointer', accentColor:'var(--primary)' }}/>
                  </TD>

                  <TD cls="sticky-1">
                    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                      <span style={{ color:'var(--fg-dim)', opacity:.5, cursor:'grab' }}><I.Grip/></span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:400, color:'var(--fg-dim)' }}>{row.rowIndex+1}</span>
                    </div>
                  </TD>

                  <TD cls="sticky-2">
                    {showDate ? (
                      <div>
                        {editable(row,'date',row.date,{style:{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:'var(--fg-2)',fontWeight:500}})}
                        {editable(row,'dayOfWeek',txt(row.dayOfWeek, lang),{type:'select',opts:DAY_OPTS.map(d=>({value:d,label:txt(d, lang)})),style:{fontSize:12,color:'var(--fg-muted)'}})}
                      </div>
                    ) : <div style={{ width:2, height:14, background:'var(--border-md)', borderRadius:1 }}/>}
                  </TD>

                  <TD cls="sticky-3">
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:'var(--primary)', fontWeight:500, lineHeight:1.2 }}>
                      P{row.periodNumber}
                    </div>
                    <div style={{ fontSize:12, color:'var(--fg-muted)', display:'flex', alignItems:'center', gap:3, marginTop:1 }}>
                      {row.startTime}
                      <span style={{ opacity:.5 }}>→</span>
                      {editable(row,'endTime',row.endTime,{type:'time',style:{fontSize:11.5}})}
                    </div>
                    <div style={{ fontSize:11, color:'var(--fg-dim)', fontFamily:"'JetBrains Mono',monospace", marginTop:1 }}>{row.durationMin}m</div>
                  </TD>

                  <TD>
                    {editable(row,'shiftName',txt(row.shiftName, lang),{type:'select',opts:editGridOptions.shifts,
                      style:{fontSize:13,fontWeight:500,color:row.shiftId==='shf-morn'?'var(--warning)':row.shiftId==='shf-day'?'var(--primary)':'var(--lab-color)'}})}
                  </TD>

                  <TD>
                    <div style={{ fontSize:14, fontWeight:400, color:'var(--fg)' }}>{txt(row.classLabel, lang)}</div>
                    <div style={{ fontSize:12, color:'var(--fg-muted)' }}>{txt(row.sectionName, lang)}</div>
                  </TD>

                  <TD>
                    {editable(row,'subjectName',txt(row.subjectName, lang),{type:'select',opts:editGridOptions.subjects,
                      style:{fontSize:14,color:'var(--fg-2)',fontWeight:500}})}
                  </TD>

                  <TD>
                    <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, flexShrink:0, fontWeight:400, color:'var(--fg-dim)' }}>
                        {lang === 'bn' ? 'অধ্যায় ' : 'Ch'}{txt(String(row.chapterNo), lang)}
                      </span>
                      <span style={{ fontSize:13, color:'var(--fg-2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{txt(row.chapterTitle, lang)}</span>
                    </div>
                  </TD>

                  <TD>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:4 }}>
                      {hasSubtopics && (
                        <button onClick={e => { e.stopPropagation(); toggleExpand(row.id) }}
                          title={isExpanded ? 'Collapse subtopics' : `${row.subtopics.length} subtopics`}
                          style={{ border:'none', background:'none', padding:'1px 2px', cursor:'pointer', color:'var(--primary)', flexShrink:0, display:'flex', alignItems:'center', marginTop:2 }}>
                          {isExpanded ? <I.ChevUp/> : <I.Chevron/>}
                        </button>
                      )}
                      <div style={{ flex:1, minWidth:0 }}>
                        {editable(row,'topics',txt(row.topics[0]??'', lang),{style:{fontSize:14,color:'var(--fg-2)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}})}
                        {row.topics.length > 1 && <span style={{ fontSize:11, color:'var(--fg-dim)' }}>+{row.topics.length-1} {lang === 'bn' ? 'টি আরও' : 'more'}</span>}
                      </div>
                    </div>
                  </TD>

                  <TD>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:'var(--fg-muted)', fontWeight:600 }} title={row.learningOutcomes.join('\n')}>
                      {txt(String(row.learningOutcomes.length), lang)}
                    </span>
                  </TD>

                  <TD>
                    {editCell?.id===row.id && editCell.field==='sessionType' ? (
                      <select autoFocus className="cell-input" value={row.sessionType} style={{ appearance:'none', WebkitAppearance:'none' }}
                        onChange={e => commitEdit(row.id,'sessionType',e.target.value)} onBlur={() => setEditCell(null)}>
                        {SESSION_TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{txt(o.label, lang)}</option>)}
                      </select>
                    ) : (
                      <span onClick={() => CAN.editAny(role) && !row.isLocked && setEditCell({id:row.id,field:'sessionType'})}
                        style={{ cursor:CAN.editAny(role)&&!row.isLocked?'pointer':'default' }}>
                        <Pill color={ST[row.sessionType].color} bg={ST[row.sessionType].bg}>{txt(ST[row.sessionType].label, lang)}</Pill>
                      </span>
                    )}
                  </TD>

                  <TD>
                    <span
                      onMouseEnter={e => {
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                        setTeacherTooltip({ name:txt(row.teacherName, lang), subject:txt(row.subjectName, lang), email:`${row.teacherId}@school.edu`, x:rect.left, y:rect.top - 90 })
                      }}
                      onMouseLeave={() => setTeacherTooltip(null)}
                      style={{ display:'flex', alignItems:'center', gap:5, cursor:'default' }}>
                      <div style={{ width:22, height:22, borderRadius:'50%', background:'var(--primary-muted)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <I.User/>
                      </div>
                      <span style={{ fontSize:14, fontWeight:400, color:'var(--fg-2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{txt(row.teacherName, lang)}</span>
                    </span>
                    {isConflict && (
                      <div style={{ marginTop:2, display:'flex', alignItems:'center', gap:3 }}>
                        <Pill color="var(--danger)" bg="var(--danger-bg)" size="xs">⚠ {lang === 'bn' ? 'দ্বন্দ্ব' : 'Conflict'}</Pill>
                      </div>
                    )}
                  </TD>

                  <TD>
                    {editable(row,'roomName',txt(row.roomName, lang),{type:'select',opts:editGridOptions.rooms,
                      style:{fontSize:13,color:'var(--fg-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}})}
                  </TD>

                  <TD><SourceBadge tag={row.sourceTag}/></TD>

                  <TD>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:2 }}>
                      {row.isLocked && <Pill color="var(--fg-muted)" bg="var(--surface-3)" size="xs"><I.Lock/>LCK</Pill>}
                      {row.isManualOverride && <Pill color="var(--warning)" bg="var(--warning-bg)" size="xs">OVR</Pill>}
                    </div>
                  </TD>

                  <TD>
                    <div className="row-actions">
                      <ActionBtn icon={<I.Eye/>} title="View Details" onClick={() => onSelect(selectedId===row.id ? null : row)}/>
                      {CAN.editAny(role) && (
                        <>
                          <ActionBtn icon={<I.Edit/>} title="Edit Row" onClick={() => onEditRow(row)}/>
                          <ActionBtn icon={row.isLocked ? <I.Unlock/> : <I.Lock/>} title={row.isLocked?'Unlock':'Lock'} onClick={() => onUpdate(row.id, { isLocked: !row.isLocked })}/>
                        </>
                      )}
                      <ActionBtn icon={<I.Print/>} title="Print Row" onClick={() => window.print()}/>
                      {CAN.editAny(role) && <ActionBtn icon={<I.Trash/>} title="Delete" onClick={() => onDelete(row.id)} danger/>}
                    </div>
                  </TD>
                </tr>

                {isExpanded && row.subtopics.map((st, si) => (
                  <tr key={`${row.id}-st-${si}`} style={{ background:'var(--bg-alt)', borderBottom:'1px solid var(--border)' }}>
                    <td className="c" colSpan={COLS.length} style={{ paddingLeft:60, paddingTop:6, paddingBottom:6, paddingRight:16 }}>
                      <div style={{ display:'flex', alignItems:'flex-start', gap:10, borderLeft:'2px solid var(--primary-muted)', paddingLeft:12 }}>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'var(--fg-dim)', minWidth:20, marginTop:2, fontWeight:700 }}>{si+1}.</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, color:'var(--fg-2)', fontWeight:600, marginBottom:3 }}>{st.title}</div>
                          <div style={{ fontSize:11, color:'var(--fg-dim)', marginBottom:5, fontFamily:"'JetBrains Mono',monospace" }}>{st.durationMin} min</div>
                          {st.learningOutcomes.length > 0 && (
                            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                              {st.learningOutcomes.map((lo, li) => (
                                <span key={li} style={{ display:'flex', alignItems:'flex-start', gap:5, fontSize:12, color:'var(--fg-muted)', lineHeight:1.6 }}>
                                  <span style={{ color:'var(--success)', fontSize:9, marginTop:3, flexShrink:0 }}>▶</span>{lo}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── App Constants ────────────────────────────────────────────────────────────

const EMPTY_OPTIONS: FilterOptions = {
  sessions:[], curricula:[], boards:[], institutions:[], campuses:[],
  grades:[], groups:[], sections:[], subjects:[], teachers:[], shifts:[], rooms:[], calendarSyncs:[],
}
const DEFAULT_FILTERS: FilterState = {
  session:'', curriculum:'', board:'', institution:'', campus:'',
  grade:'', group:'', section:'', subject:'', teacher:'', shift:'', room:'', calendarSync:'',
  dateFrom:'2025-01-06', dateTo:'2025-12-20',
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [dark, setDark] = useState(true)
  const [role, setRole] = useState<UserRole>('PRINCIPAL')

  const [filters, setFilters]       = useState<FilterState>(DEFAULT_FILTERS)
  const [options, setOptions]       = useState<FilterOptions>(EMPTY_OPTIONS)
  const [filterLoading, setFilterLoading] = useState<Record<string, boolean>>({})
  const filtersRef = useRef<FilterState>(DEFAULT_FILTERS)
  filtersRef.current = filters

  const [rows, setRows]             = useState<PlanRow[]>([])
  const [meta, setMeta]             = useState<PlanMeta|null>(null)
  const [generating, setGenerating] = useState(false)
  const [gridLoading, setGridLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState<PlanRow|null>(null)
  const [planMode, setPlanMode]     = useState<'AI'|'MANUAL'|null>(null)

  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([])
  const [showPlanHistory, setShowPlanHistory] = useState(false)
  const planHistoryRef = useRef<HTMLDivElement>(null)

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'saved'|'saving'|'unsaved'>('saved')
  const [lastSyncTime, setLastSyncTime] = useState<Date|null>(null)

  const [calendarStats, setCalendarStats] = useState<CalendarStats|null>(null)
  const [templates, setTemplates]   = useState<PlanTemplate[]>([])
  const [showPreGen, setShowPreGen] = useState(false)
  const [preGenData, setPreGenData] = useState<PreGenAnalytics|null>(null)
  const [preGenLoading, setPreGenLoading] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  const [showRegen, setShowRegen]   = useState(false)
  const [addRowModal, setAddRowModal] = useState<{open:boolean;editRow?:PlanRow}>({open:false})
  const [toast, setToast]           = useState<{msg:string;type:'ok'|'warn'}|null>(null)
  const [page, setPage]             = useState(1)
  const [pageSize, setPageSize]     = useState(25)

  const notify = useCallback((msg: string, type: 'ok'|'warn' = 'ok') => {
    setToast({msg,type}); setTimeout(() => setToast(null), 3200)
  }, [])

  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (planHistoryRef.current && !planHistoryRef.current.contains(e.target as Node)) setShowPlanHistory(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (filters.campus && filters.session) apiGetCalendarStats(filters.campus, filters.session).then(setCalendarStats)
  }, [filters.campus, filters.session])

  useEffect(() => { apiGetTemplates().then(setTemplates) }, [])

  const archiveCurrentPlan = useCallback((customLabel?: string) => {
    if (!meta || rows.length === 0) return
    setSavedPlans(prev => {
      const plan: SavedPlan = {
        id: `saved-${Date.now()}`,
        versionId: genVersionId(prev.length),
        label: customLabel || `Auto-save — ${new Date().toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}`,
        rows: [...rows], meta: { ...meta }, savedAt: new Date().toISOString(),
        author: ROLES.find(r => r.id === role)?.label ?? role, role,
        workflowStatus: meta.workflowStatus,
        filters: { ...filtersRef.current },
      }
      return [plan, ...prev]
    })
    setSyncStatus('saved'); setLastSyncTime(new Date())
  }, [meta, rows, role])

  const loadSavedPlan = (plan: SavedPlan) => {
    archiveCurrentPlan('Auto-save before loading ' + plan.versionId)
    setRows(plan.rows)
    setMeta(plan.meta)
    setFilters(plan.filters)
    filtersRef.current = plan.filters
    setShowPlanHistory(false)
    setSelectedRow(null)
    notify(`Loaded: ${plan.label} (${plan.versionId})`)
  }

  const deleteSavedPlan = (id: string) => {
    setSavedPlans(prev => prev.filter(p => p.id !== id))
    notify('Version deleted')
  }

  const duplicateSavedPlan = (id: string) => {
    setSavedPlans(prev => {
      const src = prev.find(p => p.id === id)
      if (!src) return prev
      const dup: SavedPlan = { ...src, id:`saved-${Date.now()}`, versionId: genVersionId(prev.length), label: `Copy of ${src.label}`, savedAt: new Date().toISOString() }
      return [dup, ...prev]
    })
    notify('Version duplicated')
  }

  const saveCurrentManually = () => {
    if (!meta || rows.length === 0) { notify('Nothing to save — generate a plan first', 'warn'); return }
    setSyncStatus('saving')
    setTimeout(() => {
      archiveCurrentPlan(`Manual save — ${new Date().toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}`)
      notify('Plan saved to version history')
    }, 400)
  }

  const cascadeLoad = useCallback(async (changedKey: FilterKey, value: string, currentFilters: FilterState) => {
    const idx = FILTER_CHAIN.indexOf(changedKey)
    const nextKey = FILTER_CHAIN[idx + 1] as FilterKey | undefined
    if (!nextKey) return
    setFilterLoading(p => ({ ...p, [nextKey]: true }))
    try {
      const f = currentFilters
      let opts: Array<{ id: string }> = []
      if      (nextKey === 'curriculum')   opts = await apiGetCurricula(value)
      else if (nextKey === 'board')        opts = await apiGetBoards(value)
      else if (nextKey === 'institution')  opts = await apiGetInstitutions(value)
      else if (nextKey === 'campus')       opts = await apiGetCampuses(value)
      else if (nextKey === 'grade')        opts = await apiGetGrades(f.curriculum)
      else if (nextKey === 'group')        opts = await apiGetGroups(value)
      else if (nextKey === 'section')      opts = await apiGetSections(f.grade, f.group || undefined)
      else if (nextKey === 'subject')      opts = await apiGetSubjects(f.grade, f.group || undefined)
      else if (nextKey === 'teacher')      opts = await apiGetTeachers(f.institution, f.subject || undefined)
      else if (nextKey === 'shift')        opts = await apiGetShifts(f.campus)
      else if (nextKey === 'room')         opts = await apiGetRooms(f.campus)
      else if (nextKey === 'calendarSync') opts = await apiGetCalendarSyncs()
      setOptions(p => ({ ...p, [OPTION_KEY_MAP[nextKey]]: opts }))
      if (nextKey === 'group' && opts.length === 0) {
        setFilterLoading(p => ({ ...p, group: false }))
        await cascadeLoad('group', '', currentFilters)
        return
      }
      if (opts.length === 1) {
        const autoVal = opts[0].id
        const next: FilterState = { ...currentFilters, [nextKey]: autoVal }
        setFilters(next); filtersRef.current = next
        await cascadeLoad(nextKey, autoVal, next)
      }
    } finally {
      setFilterLoading(p => ({ ...p, [nextKey]: false }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    apiGetSessions().then(sessions => {
      setOptions(p => ({ ...p, sessions }))
      const s2025 = sessions.find(s => s.label === '2025')
      if (s2025) {
        const boot: FilterState = { ...DEFAULT_FILTERS, session: s2025.id }
        setFilters(boot); filtersRef.current = boot
        cascadeLoad('session', s2025.id, boot)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterChange = async (key: FilterKey, value: string) => {
    const live = filtersRef.current
    const idx = FILTER_CHAIN.indexOf(key)
    const children = FILTER_CHAIN.slice(idx + 1) as FilterKey[]
    const newFilters: FilterState = { ...live, [key]: value }
    children.forEach(c => { (newFilters as unknown as Record<string, string>)[c] = '' })
    filtersRef.current = newFilters; setFilters(newFilters)
    setOptions(p => { const next = { ...p }; children.forEach(c => { (next as unknown as Record<string, unknown[]>)[OPTION_KEY_MAP[c]] = [] }); return next })
    setRows([]); setMeta(null); setSelectedRow(null)
    await cascadeLoad(key, value, newFilters)
  }

  const doGenerate = async (keepOverrides = true) => {
    archiveCurrentPlan()
    setShowRegen(false); setShowPreGen(false); setGenerating(true); setGridLoading(true)
    try {
      const result = await apiGeneratePlan(filtersRef.current)
      setRows(prev => {
        if (keepOverrides && prev.length > 0) {
          const preserved = prev.filter(r => r.isManualOverride || r.isLocked)
          const fresh = result.rows.filter(r => !preserved.some(p => p.chapterNo===r.chapterNo && p.periodNumber===r.periodNumber))
          return [...preserved, ...fresh].sort((a,b) => a.rowIndex-b.rowIndex)
        }
        return result.rows
      })
      setMeta(m => ({ ...result.meta, workflowStatus: m?.workflowStatus ?? 'DRAFT', status: m?.status ?? 'DRAFT' }))
      setPlanMode('AI')
      setSyncStatus('unsaved')
      notify(`Plan generated — ${result.rows.length} sessions scheduled`)
    } catch {
      notify('Generation failed — please try again', 'warn')
    } finally {
      setGenerating(false); setGridLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (meta && (meta.manualOverrideCount > 0 || meta.lockedCount > 0)) { setShowRegen(true); return }
    setShowPreGen(true); setPreGenLoading(true); setPreGenData(null)
    try {
      const analytics = await apiGetPreGenAnalytics(filtersRef.current)
      setPreGenData(analytics)
    } finally { setPreGenLoading(false) }
  }

  const handleCreateManual = () => {
    setPlanMode('MANUAL'); setRows([]); setMeta(null); setSelectedRow(null)
    notify('Manual mode — add sessions row by row')
  }

  const handleReorder = (fromId: string, toId: string) => {
    setRows(prev => {
      const arr = [...prev]
      const fi = arr.findIndex(r=>r.id===fromId), ti = arr.findIndex(r=>r.id===toId)
      const [item] = arr.splice(fi, 1); arr.splice(ti, 0, item)
      return arr.map((r,i) => ({...r, rowIndex:i}))
    })
  }

  const handleUpdate = (id: string, patch: Partial<PlanRow>) => {
    const vhEntry: VersionEntry = { id:`vh-${Date.now()}`, timestamp:new Date().toISOString(), changedBy:ROLES.find(r=>r.id===role)?.label??role, role, changeType:'OVERRIDE', field:Object.keys(patch)[0] }
    setRows(prev => prev.map(r => r.id===id ? { ...r, ...patch, isManualOverride:!patch.isLocked&&r.isManualOverride, sourceTag: patch.isLocked!==undefined ? r.sourceTag : 'TEACHER_EDIT', updatedAt:new Date().toISOString(), versionHistory:[...r.versionHistory,vhEntry] } : r))
    setMeta(m => m ? { ...m, manualOverrideCount: m.manualOverrideCount + 1 } : m)
    if (selectedRow?.id===id) setSelectedRow(prev => prev ? {...prev,...patch} : prev)
    setSyncStatus('unsaved')
    notify('Cell edited — flagged as Teacher Edit')
  }

  const handleDelete = (id: string) => {
    setRows(prev => prev.filter(r=>r.id!==id))
    if (selectedRow?.id===id) setSelectedRow(null)
    setSelectedRows(prev => { const n = new Set(prev); n.delete(id); return n })
    setSyncStatus('unsaved')
    notify('Row removed')
  }

  const handlePublish = () => {
    setMeta(m => m ? {...m, status:'PUBLISHED', workflowStatus:'PUBLISHED'} : m)
    archiveCurrentPlan('Published version')
    notify('Curriculum plan published')
  }

  const handleAdvanceWorkflow = (status: WorkflowStatus) => {
    setMeta(m => m ? {...m, workflowStatus:status} : m)
    notify(`Workflow advanced to ${status}`)
  }

  const handleAddRowSave = (row: PlanRow) => {
    const isExisting = rows.some(r => r.id === row.id)
    setRows(prev => isExisting ? prev.map(r => r.id===row.id ? {...row,rowIndex:r.rowIndex} : r) : [...prev, {...row,rowIndex:prev.length}])
    setMeta(m => {
      if (!m) return { id:`plan-${Date.now()}`, status:'DRAFT', workflowStatus:'DRAFT', totalTeachingDays:172, workingDays:182, completedLessons:0, pendingLessons:1, topicsPlanned:1, topicsTotal:50, aiGeneratedCount:0, manualCount:1, lockedCount:0, manualOverrideCount:1, coveragePercent:2, generatedAt:new Date().toISOString() }
      return isExisting ? m : { ...m, topicsPlanned:m.topicsPlanned+1, pendingLessons:m.pendingLessons+1, manualCount:m.manualCount+1, manualOverrideCount:m.manualOverrideCount+1 }
    })
    setAddRowModal({open:false}); setSyncStatus('unsaved')
    notify(isExisting ? 'Session updated' : 'Session added')
  }

  const handleApplyTemplate = (t: PlanTemplate) => {
    setShowTemplates(false); notify(`Template "${t.name}" loaded — generate to apply`)
  }

  const toggleRowSelection = (id: string) => setSelectedRows(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleAllRows = () => setSelectedRows(prev => prev.size === rows.length && rows.length > 0 ? new Set() : new Set(rows.map(r => r.id)))
  const clearSelection = () => setSelectedRows(new Set())
  const deleteSelected = () => {
    setRows(prev => prev.filter(r => !selectedRows.has(r.id)))
    clearSelection(); setSyncStatus('unsaved')
    notify(`${selectedRows.size} sessions removed`)
  }
  const exportSelected = () => {
    const toExport = rows.filter(r => selectedRows.has(r.id))
    const csv = ['Date,Day,Period,Teacher,Subject,Chapter,Topic,Type,Room']
      .concat(toExport.map(r => `"${r.date}","${r.dayOfWeek}","P${r.periodNumber}","${r.teacherName}","${r.subjectName}","Ch${r.chapterNo} ${r.chapterTitle}","${r.topics[0]}","${r.sessionType}","${r.roomName}"`))
      .join('\n')
    const blob = new Blob([csv], { type:'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='lesson-plan.csv'; a.click()
    notify('Exported to CSV')
  }

  const editGridOptions: EditGridOptions = {
    subjects: options.subjects.map(s => ({ value:s.code, label:s.name })),
    teachers: options.teachers.map(t => ({ value:t.id, label:t.name })),
    rooms:    options.rooms.map(r => ({ value:r.name, label:`${r.name} (${r.building})` })),
    shifts:   options.shifts.map(s => ({ value:s.id, label:s.name })),
  }

  const roleColor = ROLES.find(r=>r.id===role)?.color || 'var(--primary)'
  const syncColor = { saved:'var(--success)', saving:'var(--warning)', unsaved:'var(--fg-muted)' }[syncStatus]
  const syncLabel = syncStatus === 'saved'
    ? `Saved · ${lastSyncTime ? lastSyncTime.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) : ''}`
    : syncStatus === 'saving' ? 'Saving…' : 'Unsaved changes'

  const [activePage, setActivePage] = useState<'dashboard'|'curriculum'|'schedule'|'teachers'|'reports'|'settings'>('dashboard')
  const [lang, setLang] = useState<Lang>('en')
  const t = TR[lang]

  const NAV_ITEMS: { id: typeof activePage; icon: ReactNode; label: string }[] = [
    { id:'dashboard',  icon:<I.Grid/>,     label: t.nav.dashboard  },
    { id:'curriculum', icon:<I.Lib/>,      label: t.nav.curriculum },
    { id:'schedule',   icon:<I.Cal/>,      label: t.nav.schedule   },
    { id:'teachers',   icon:<I.User/>,     label: t.nav.teachers   },
    { id:'reports',    icon:<I.Chart/>,    label: t.nav.reports    },
    { id:'settings',   icon:<I.Settings/>, label: t.nav.settings   },
  ]

  const PagePlaceholder = ({ title, icon }: { title: string; icon: ReactNode }) => (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, color:'var(--fg-muted)', padding:40 }}>
      <div style={{ width:64, height:64, borderRadius:18, background:'var(--primary-muted)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--primary)', fontSize:28 }}>{icon}</div>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:22, fontWeight:600, color:'var(--fg)', marginBottom:8 }}>{title}</div>
        <div style={{ fontSize:15, fontWeight:400, color:'var(--fg-muted)', maxWidth:380, lineHeight:1.7 }}>{t.underDev}</div>
      </div>
      <button onClick={() => setActivePage('dashboard')}
        style={{ marginTop:8, padding:'9px 22px', borderRadius:9, border:'none', background:'var(--primary)', color:'#fff', fontSize:14, fontWeight:500, cursor:'pointer' }}>
        {t.backDash}
      </button>
    </div>
  )

  return (
    <>
      <div style={{ height:'100vh', display:'flex', overflow:'hidden', background:'var(--bg)' }}>

        {/* ══ Full-height Sidebar ══ */}
        <aside
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
          style={{
            width: sidebarExpanded ? 220 : 58,
            flexShrink: 0,
            height: '100vh',
            background: dark
              ? 'rgba(8,14,30,0.96)'
              : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRight: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.09)'}`,
            display: 'flex', flexDirection: 'column',
            transition: 'width 220ms cubic-bezier(0.22,1,0.36,1)',
            overflow: 'hidden', zIndex: 30,
          }}>
          {/* Brand */}
          <div style={{
            height: 60, flexShrink: 0, display:'flex', alignItems:'center',
            gap: 10, padding: sidebarExpanded ? '0 16px' : '0',
            justifyContent: sidebarExpanded ? 'flex-start' : 'center',
            borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'}`,
            transition: 'padding 220ms',
          }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 }}>
              <I.Logo/>
            </div>
            {sidebarExpanded && (
              <div style={{ overflow:'hidden', whiteSpace:'nowrap' }}>
                <div style={{ fontSize:15, fontWeight:600, color: dark ? '#F8FAFC' : '#0F172A', lineHeight:1.2, fontFamily:"'Open Sans',system-ui,sans-serif" }}>{t.brand}</div>
                <div style={{ fontSize:11, fontWeight:400, color: dark ? '#CBD5E1' : '#475569', marginTop:1 }}>{t.brandSub}</div>
              </div>
            )}
          </div>
          {/* Nav items */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:2, padding:'10px 6px', overflowY:'auto' }}>
            {NAV_ITEMS.map(item => {
              const isActive = activePage === item.id
              return (
                <button key={item.id} onClick={() => setActivePage(item.id)}
                  style={{
                    display:'flex', alignItems:'center', gap:10,
                    padding: sidebarExpanded ? '10px 12px' : '10px 0',
                    justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                    borderRadius:9, border:'none', cursor:'pointer',
                    width:'100%', overflow:'hidden', whiteSpace:'nowrap',
                    fontFamily:"'Open Sans',system-ui,sans-serif", fontSize:14, fontWeight: isActive ? 600 : 400,
                    background: isActive ? 'var(--primary-muted)' : 'transparent',
                    color: isActive ? 'var(--primary)' : (dark ? '#E2E8F0' : '#334155'),
                    boxShadow: isActive ? `0 0 0 1px rgba(66,99,235,0.2)` : 'none',
                    transition:'all 150ms',
                  }}>
                  <span style={{ display:'flex', alignItems:'center', flexShrink:0, fontSize:17 }}>{item.icon}</span>
                  {sidebarExpanded && <span>{item.label}</span>}
                </button>
              )
            })}
          </div>
          {/* Bottom role badge */}
          {sidebarExpanded && (
            <div style={{ padding:'10px 10px', borderTop:`1px solid ${dark?'rgba(255,255,255,0.06)':'rgba(15,23,42,0.08)'}`, flexShrink:0 }}>
              <div style={{ padding:'8px 10px', borderRadius:8, background:'var(--primary-muted)', display:'flex', alignItems:'center', gap:8 }}>
                <I.User/>
                <div style={{ overflow:'hidden' }}>
                  <div style={{ fontSize:13, fontWeight:500, color:'var(--primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ROLES.find(r=>r.id===role)?.label}</div>
                  <div style={{ fontSize:11, fontWeight:400, color:'var(--fg-muted)' }}>{t.activeRole}</div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ══ Main column ══ */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* ── Header ── */}
        <header className="no-print" style={{
          background: dark ? 'rgba(10,16,34,0.96)' : 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          padding: '0 24px', height: 60,
          display: 'flex', alignItems: 'center', gap: 20,
          flexShrink: 0, zIndex: 10, position: 'relative',
        }}>
          {/* Brand */}
          <div style={{ display:'flex', alignItems:'center', gap:9, flexShrink:0 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
              <I.Logo/>
            </div>
            <div style={{ lineHeight:1.2 }}>
              <div style={{ fontFamily:"'Open Sans',system-ui,sans-serif", fontWeight:700, fontSize:15, color: dark ? '#FFFFFF' : '#0F172A' }}>{t.brand}</div>
              <div style={{ fontSize:11, fontWeight:400, color: dark ? '#CBD5E1' : '#475569', marginTop:1 }}>{t.headerSub}</div>
            </div>
          </div>

          <div style={{ width:1, height:24, background: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)', flexShrink:0 }}/>

          {/* Page title */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:14, fontWeight:600, color: dark ? '#F1F5F9' : '#1E293B', fontFamily:"'Open Sans',system-ui,sans-serif" }}>
              {t.workspace}
            </span>
            {meta && (
              <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:'var(--primary-muted)', color:'var(--primary)', borderRadius:6, padding:'2px 9px', fontSize:12, fontWeight:600 }}>
                {rows.length} {lang === 'bn' ? 'অধিবেশন' : 'sessions'}
              </span>
            )}
            {planMode === 'MANUAL' && (
              <span style={{ display:'inline-flex', alignItems:'center', background:'var(--warning-bg)', color:'var(--warning)', borderRadius:6, padding:'2px 9px', fontSize:12, fontWeight:600 }}>
                {lang === 'bn' ? 'ম্যানুয়াল' : 'MANUAL'}
              </span>
            )}
          </div>

          {/* Sync dot & Unsaved indicator with pulsing yellow dot */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span
              className={syncStatus === 'unsaved' ? 'pulse-dot-yellow' : ''}
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: syncStatus === 'unsaved' ? 'var(--warning)' : syncColor,
                display: 'inline-block', flexShrink: 0,
                boxShadow: syncStatus === 'unsaved' ? '0 0 8px var(--warning)' : `0 0 6px ${syncColor}`
              }}
            />
            <span style={{ fontSize:12, fontWeight: syncStatus === 'unsaved' ? 600 : 500, color: syncStatus === 'unsaved' ? 'var(--warning)' : (dark ? '#CBD5E1' : '#475569'), whiteSpace:'nowrap' }}>
              {syncLabel}
            </span>
          </div>

          <div style={{ flex:1 }}/>

          {/* Plan History */}
          <div style={{ position:'relative', flexShrink:0 }} ref={planHistoryRef}>
            <button onClick={() => setShowPlanHistory(p => !p)}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:8,
                border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                background: showPlanHistory ? 'var(--primary-muted)' : 'transparent',
                color: showPlanHistory ? 'var(--primary)' : (dark ? '#E2E8F0' : '#334155'),
                fontSize:13, fontWeight:500, cursor:'pointer', transition:'all 0.15s',
                fontFamily:"'Open Sans',system-ui,sans-serif" }}>
              <I.History/>
              {t.planHistory}
              {savedPlans.length > 0 && (
                <span style={{ background:'var(--primary)', color:'#fff', borderRadius:'50%', width:17, height:17, fontSize:10, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>{savedPlans.length}</span>
              )}
              <span style={{ fontSize:10 }}>▾</span>
            </button>
            {showPlanHistory && (
              <PlanHistoryDropdown
                plans={savedPlans}
                onLoad={loadSavedPlan}
                onDelete={deleteSavedPlan}
                onDuplicate={duplicateSavedPlan}
                onClose={() => setShowPlanHistory(false)}
              />
            )}
          </div>

          {/* Role */}
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:8,
            border:`1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
            background:'transparent', flexShrink:0 }}>
            <I.User/>
            <select value={role} onChange={e => setRole(e.target.value as UserRole)}
              style={{ border:'none', background:'transparent', color:roleColor, fontSize:13, fontWeight:500, outline:'none', cursor:'pointer', fontFamily:"'Open Sans',system-ui,sans-serif" }}>
              {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </div>

          {/* Unified Language Switcher */}
          <div style={{
            display:'inline-flex', alignItems:'center', padding:'3px', borderRadius:8,
            border:`1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
            background:'var(--surface-2)', flexShrink:0, cursor:'pointer'
          }}
          onClick={() => setLang(l => l === 'en' ? 'bn' : 'en')}>
            <span style={{
              padding:'3px 8px', borderRadius:6, fontSize:12, fontWeight: lang === 'bn' ? 700 : 500,
              background: lang === 'bn' ? 'var(--primary)' : 'transparent',
              color: lang === 'bn' ? '#fff' : (dark ? '#CBD5E1' : '#475569'),
              transition:'all 0.15s ease'
            }}>
              বাংলা
            </span>
            <span style={{ fontSize:11, color:'var(--fg-dim)', margin:'0 2px' }}>|</span>
            <span style={{
              padding:'3px 8px', borderRadius:6, fontSize:12, fontWeight: lang === 'en' ? 700 : 500,
              background: lang === 'en' ? 'var(--primary)' : 'transparent',
              color: lang === 'en' ? '#fff' : (dark ? '#CBD5E1' : '#475569'),
              transition:'all 0.15s ease'
            }}>
              English
            </span>
          </div>

          {/* Icon-Only Theme Toggle */}
          <button onClick={() => setDark(d => !d)} title={dark ? (lang === 'bn' ? 'হালকা মোড' : 'Light Mode') : (lang === 'bn' ? 'গাঢ় মোড' : 'Dark Mode')}
            style={{
              width:34, height:34, borderRadius:8,
              border:`1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
              background:'var(--surface-2)', color: dark ? '#F8FAFC' : '#0F172A',
              display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.15s ease', flexShrink:0
            }}>
            {dark ? <I.Sun/> : <I.Moon/>}
          </button>
        </header>

        <FilterBar filters={filters} options={options} loading={filterLoading} onChange={handleFilterChange} calendarStats={calendarStats} lang={lang}/>

        <MetricsBar meta={meta} role={role} onGenerate={handleGenerate} onCreateManual={handleCreateManual}
          onShowTemplates={() => setShowTemplates(true)} onSave={saveCurrentManually}
          onPublish={handlePublish} generating={generating} onAdvanceWorkflow={handleAdvanceWorkflow} calStats={calendarStats} lang={lang}/>

        {selectedRows.size > 0 && (
          <BulkActionToolbar count={selectedRows.size} onClear={clearSelection} onDeleteAll={deleteSelected} onExport={exportSelected} notify={notify}/>
        )}

        {meta && meta.manualOverrideCount > 0 && (
          <div className="warn-banner" style={{ background:'var(--warning-bg)', borderBottom:'1px solid var(--warning)', padding:'6px 80px', display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--warning)', flexShrink:0 }}>
            <I.Warn/>
            <span><strong>{meta.manualOverrideCount} teacher override{meta.manualOverrideCount!==1?'s':''}</strong> — AI regeneration will prompt before overwriting locked rows. Current plan will be auto-archived.</span>
            {CAN.generate(role) && (
              <button onClick={() => setShowRegen(true)}
                style={{ marginLeft:'auto', padding:'3px 10px', borderRadius:6, border:'1px solid var(--warning)', background:'transparent', color:'var(--warning)', fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:4, cursor:'pointer' }}>
                <I.Reload/>Re-generate
              </button>
            )}
          </div>
        )}

        <div style={{ flex:1, display:'flex', overflow:'hidden', position:'relative' }}>
          <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', marginRight: selectedRow ? 400 : 0, transition:'margin-right 0.22s cubic-bezier(0.22,1,0.36,1)' }}>
            {rows.length === 0 && !gridLoading ? (
              <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, color:'var(--fg-dim)', padding:40 }}>
                <div style={{ width:56, height:56, borderRadius:16, background:'var(--surface-2)', border:'1px solid var(--border-md)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <I.Grid/>
                </div>
                <div style={{ textAlign:'center', maxWidth:460 }}>
                  <div style={{ fontSize:18, fontWeight:600, fontFamily:"'Open Sans',system-ui,sans-serif", color:'var(--fg)', marginBottom:8 }}>
                    {planMode === 'MANUAL' ? 'Manual Plan — Add your first session' : 'Annual Lesson Plan — Not yet generated'}
                  </div>
                  <div style={{ fontSize:14, fontWeight:400, color:'var(--fg-muted)', lineHeight:1.7 }}>
                    {planMode === 'MANUAL'
                      ? 'Click "Add Session" to build the plan row by row. Each row is tagged as Teacher Edit.'
                      : 'Complete the filter chain above to select curriculum context, then choose a creation strategy below.'}
                  </div>
                </div>
                {CAN.generate(role) && (
                  <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
                    {planMode !== 'MANUAL' && (
                      <Btn icon={<I.Spark/>} label="AI Generate Lesson Plan" variant="primary" onClick={handleGenerate} disabled={generating}/>
                    )}
                    {planMode === 'MANUAL'
                      ? <Btn icon={<I.Add/>} label="Add First Session" variant="primary" onClick={() => setAddRowModal({open:true})}/>
                      : <Btn icon={<I.Add/>} label="Create Manual Plan" onClick={handleCreateManual}/>
                    }
                    <Btn icon={<I.Lib/>} label="Browse Templates" onClick={() => setShowTemplates(true)}/>
                  </div>
                )}
              </div>
            ) : (() => {
              const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
              const safePage   = Math.min(page, totalPages)
              const pagedRows  = rows.slice((safePage - 1) * pageSize, safePage * pageSize)
              const pageNums: (number|'…')[] = []
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pageNums.push(i)
              } else {
                pageNums.push(1)
                if (safePage > 3) pageNums.push('…')
                for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pageNums.push(i)
                if (safePage < totalPages - 2) pageNums.push('…')
                pageNums.push(totalPages)
              }
              return (
                <>
                  {/* Add Session button */}
                  {CAN.editAny(role) && (
                    <div style={{ display:'flex', justifyContent:'flex-end', padding:'8px 24px 0', flexShrink:0, marginTop:16 }}>
                      <Btn icon={<I.Add/>} label={lang === 'bn' ? 'অধিবেশন যোগ করুন' : 'Add Session'} onClick={() => setAddRowModal({open:true})} small/>
                    </div>
                  )}
                  {/* Scrollable table area with exact 24px padding */}
                  <div style={{ flex:1, overflow:'auto', padding:'8px 24px 0 24px' }}>
                    <PlanningGrid
                      rows={pagedRows} loading={gridLoading} selectedId={selectedRow?.id||null} role={role}
                      selectedRows={selectedRows} onToggleRow={toggleRowSelection} onToggleAll={toggleAllRows}
                      onSelect={setSelectedRow} onReorder={handleReorder} onUpdate={handleUpdate} onDelete={handleDelete}
                      onEditRow={row => setAddRowModal({open:true,editRow:row})} editGridOptions={editGridOptions}
                      lang={lang}
                    />
                  </div>
                  {/* Pagination bar with exact 24px padding */}
                  <div style={{ flexShrink:0, borderTop:'1px solid var(--border-md)', background:'var(--surface)', padding:'8px 24px', display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:13, color:'var(--fg-muted)', marginRight:4 }}>Show</span>
                    <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
                      style={{ border:'1px solid var(--border-md)', borderRadius:6, padding:'3px 22px 3px 8px', fontSize:13, background:'var(--surface)', color:'var(--fg)', outline:'none', cursor:'pointer', appearance:'none', backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 20 20' fill='none' stroke='%236B7B95' stroke-width='2'%3E%3Cpath d='M5 7.5l5 5 5-5'/%3E%3C/svg%3E\")", backgroundRepeat:'no-repeat', backgroundPosition:'right 6px center' }}>
                      {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <span style={{ fontSize:13, color:'var(--fg-muted)' }}>entries</span>
                    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
                        style={{ width:32, height:32, borderRadius:7, border:'1px solid var(--border-md)', background:'var(--surface)', color:'var(--fg-muted)', cursor:safePage===1?'not-allowed':'pointer', opacity:safePage===1?0.4:1, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>‹</button>
                      {pageNums.map((n, i) => n === '…'
                        ? <span key={`e${i}`} style={{ padding:'0 4px', color:'var(--fg-dim)', fontSize:13 }}>…</span>
                        : <button key={n} onClick={() => setPage(n as number)}
                            style={{ width:32, height:32, borderRadius:7, border:`1px solid ${n === safePage ? 'var(--primary)' : 'var(--border-md)'}`, background: n === safePage ? 'var(--primary)' : 'var(--surface)', color: n === safePage ? '#fff' : 'var(--fg)', cursor:'pointer', fontSize:13, fontWeight: n===safePage ? 600 : 400 }}>{n}</button>
                      )}
                      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                        style={{ width:32, height:32, borderRadius:7, border:'1px solid var(--border-md)', background:'var(--surface)', color:'var(--fg-muted)', cursor:safePage===totalPages?'not-allowed':'pointer', opacity:safePage===totalPages?0.4:1, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>›</button>
                    </div>
                    <span style={{ fontSize:13, color:'var(--fg-muted)' }}>
                      Showing {rows.length === 0 ? 0 : (safePage-1)*pageSize+1}–{Math.min(safePage*pageSize, rows.length)} of {rows.length} entries
                    </span>
                  </div>
                </>
              )
            })()}
          </main>

          {selectedRow && (
            <DetailPanel row={selectedRow} onClose={() => setSelectedRow(null)} onUpdate={handleUpdate}/>
          )}
        </div>

        {addRowModal.open && (
          <AddRowModal editRow={addRowModal.editRow} editGridOptions={editGridOptions} role={role}
            onClose={() => setAddRowModal({open:false})} onSave={handleAddRowSave}/>
        )}
        {showPreGen && (
          <PreGenModal analytics={preGenData} loading={preGenLoading}
            onClose={() => setShowPreGen(false)} onConfirm={() => doGenerate()}/>
        )}
        {showTemplates && (
          <TemplateLibraryModal templates={templates} onClose={() => setShowTemplates(false)} onApply={handleApplyTemplate}/>
        )}
        {showRegen && (
          <RegenModal manualCount={meta?.manualOverrideCount||0} lockedCount={meta?.lockedCount||0}
            onClose={() => setShowRegen(false)} onConfirm={doGenerate}/>
        )}

        {toast && (
          <div className="toast fade-in">
            <span style={{ color: toast.type==='warn' ? 'var(--warning)' : 'var(--success)' }}><I.Dot/></span>
            <span style={{ color:'var(--fg)' }}>{toast.msg}</span>
          </div>
        )}

        <div className="print-container">
          <div className="print-header">
            <h1>Annual Lesson Plan — {filters.grade} {filters.section}</h1>
            <p>Academic Session {filters.session} · Generated {new Date().toLocaleDateString('en-GB')}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th><th>Date</th><th>Period</th><th>Subject</th>
                <th>Chapter / Topic</th><th>Type</th><th>Teacher</th><th>Room</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id}>
                  <td>{i+1}</td><td>{row.date}</td><td>P{row.periodNumber} {row.startTime}</td>
                  <td>{row.subjectName}</td><td>Ch{row.chapterNo} {row.chapterTitle} — {row.topics[0]}</td>
                  <td>{row.sessionType}</td><td>{row.teacherName}</td><td>{row.roomName}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="print-signatures">
            {['Class Teacher','Registrar','Principal'].map(title => (
              <div key={title} className="print-sig-block">
                <div className="sig-line"/>
                <p>{title}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </>
  )
}
