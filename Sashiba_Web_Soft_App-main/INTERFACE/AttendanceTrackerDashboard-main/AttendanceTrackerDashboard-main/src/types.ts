export type AttendanceStatus = 'P' | 'A' | 'L' | 'Lv';

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Guardian {
  name: string;
  phone: string;
  relation: string;
}

export interface WeeklyEntry {
  date: string;
  status: AttendanceStatus;
  label: string;
}

export interface Student {
  id: string;
  rollNo: number;
  name: string;
  initials: string;
  avatarColor: string;
  classSection: string;
  rating: number;
  manualRating: number | null;
  comment: string;
  attendance: Record<string, AttendanceStatus>;
  monthlyAvg: number;
  phone: string;
  guardian: Guardian;
  weeklyHistory: WeeklyEntry[];
  lastUpdated: string;
}

export interface FilterState {
  academicYear: string;
  classNum: string;
  group: string;
  section: string;
  shift: string;
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export interface AuditEntry {
  id: string;
  studentName: string;
  studentId: string;
  subjectCode: string;
  prevStatus: AttendanceStatus;
  newStatus: AttendanceStatus;
  editedBy: string;
  timestamp: string;
}

export interface SyllabusSubject {
  id: string;
  name: string;
  total: number;
  completed: number;
  lastUpdated: string;
}

export type BulkScope = 'page' | 'selected' | 'all';

export interface BulkStatusRequest {
  status: AttendanceStatus;
  label: string;
}

/** Draft state while a row is being edited (Tier 1 or Tier 2) */
export interface RowDraft {
  rollNo: string;
  name: string;
  classSection: string;
  attendance: Record<string, AttendanceStatus>;
  comment: string;
  manualRating: number | null;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
}

/** A user-defined extra column */
export interface CustomColumn {
  id: string;
  name: string;
  values: Record<string, string>;
}

/** Optional columns that can be toggled */
export type ColumnKey = 'class' | 'status' | 'attendance' | 'evaluation';
