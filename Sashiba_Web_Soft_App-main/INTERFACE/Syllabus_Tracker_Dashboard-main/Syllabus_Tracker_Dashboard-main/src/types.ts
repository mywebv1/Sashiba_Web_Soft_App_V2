export type UserRole = 'SUPER_ADMIN' | 'PRINCIPAL' | 'COORDINATOR' | 'TEACHER'
export type SessionType = 'LEC' | 'LAB' | 'REV' | 'AST' | 'ACT'
export type RowSource = 'AI' | 'MANUAL' | 'TEMPLATE'
export type SourceTag = 'AI_GEN' | 'TEACHER_EDIT' | 'IMPORTED' | 'COPIED' | 'TEMPLATE' | 'MERGED'
export type PlanStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type WorkflowStatus = 'DRAFT' | 'REVIEWED' | 'APPROVED' | 'PUBLISHED'

export interface AcademicSession {
  id: string; label: string; startYear: number; endYear?: number; isCrossYear: boolean
}
export interface Curriculum {
  id: string; name: string; code: string; medium: string
}
export interface EducationBoard {
  id: string; name: string; shortName: string; type: 'general' | 'madrasah' | 'technical' | 'international'
}
export interface Institution {
  id: string; name: string; code: string; type: string; boardId: string
}
export interface Campus {
  id: string; name: string; institutionId: string; address: string
}
export interface Grade {
  id: string; label: string; numericLevel: number; levelType: string; hasGroups: boolean
}
export interface SubjectGroup {
  id: string; name: string; code: string
}
export interface Section {
  id: string; name: string; capacity: number
}
export interface Subject {
  id: string; name: string; nameLocal: string; code: string; isCompulsory: boolean; weeklyPeriods: number
}
export interface Teacher {
  id: string; name: string; designation: string; employeeId: string; specialization: string; email: string
}
export interface Shift {
  id: string; name: string; startTime: string; endTime: string; periodsPerDay: number
}
export interface Room {
  id: string; name: string; type: 'classroom' | 'lab' | 'lecture_hall' | 'smart_class'; capacity: number; building: string
}

export interface CalendarSync {
  id: string; label: string; status: 'synced' | 'pending' | 'failed'; lastSync?: string
}

export interface CalendarStats {
  academicYear: string
  totalCalendarDays: number
  workingDays: number
  govtHolidays: number
  protectedExamDays: number
  institutionHolidays: number
  availableTeachingDays: number
  weeklyPeriods: number
  sessionStart: string
  sessionEnd: string
}

export interface Subtopic {
  id: string; title: string; durationMin: number; learningOutcomes: string[]
}

export interface VersionEntry {
  id: string; timestamp: string; changedBy: string; role: UserRole
  changeType: 'CREATE' | 'EDIT' | 'LOCK' | 'OVERRIDE' | 'AI_GEN' | 'REORDER'
  field?: string; before?: string; after?: string
}

export interface PlanRow {
  id: string; rowIndex: number
  date: string; dayOfWeek: string
  periodNumber: number; startTime: string; endTime: string
  shiftId: string; shiftName: string
  classLabel: string; sectionName: string
  subjectCode: string; subjectName: string
  chapterNo: number; chapterTitle: string
  topics: string[]
  subtopics: Subtopic[]
  sessionType: SessionType
  teacherName: string; teacherId: string
  roomName: string; durationMin: number
  source: RowSource; sourceTag: SourceTag
  isLocked: boolean; isManualOverride: boolean
  learningOutcomes: string[]
  aiReasoning: string
  versionHistory: VersionEntry[]
  createdAt: string; updatedAt: string
}

export interface PlanMeta {
  id: string; status: PlanStatus; workflowStatus: WorkflowStatus
  totalTeachingDays: number; workingDays: number
  completedLessons: number; pendingLessons: number
  topicsPlanned: number; topicsTotal: number
  aiGeneratedCount: number; manualCount: number; lockedCount: number; manualOverrideCount: number
  coveragePercent: number; generatedAt: string
}

export interface PreGenAnalytics {
  totalTopics: number; workingDays: number
  topicsPerWeek: number; topicsPerDay: number
  estimatedCompletionPercent: number
  validations: {
    difficultyBalanced: boolean; labAllocated: boolean
    revisionMapped: boolean; examWeeksProtected: boolean; teacherAvailable: boolean
  }
}

export interface PlanTemplate {
  id: string; name: string; description: string
  curriculum: string; boardType: string; gradeRange: string
  tags: string[]; icon: string; weekCount: number; topicCount: number
}

export interface FilterState {
  session: string; curriculum: string; board: string; institution: string; campus: string
  grade: string; group: string; section: string; subject: string; teacher: string
  shift: string; room: string; calendarSync: string
  dateFrom: string; dateTo: string
}

export interface FilterOptions {
  sessions: AcademicSession[]; curricula: Curriculum[]; boards: EducationBoard[]
  institutions: Institution[]; campuses: Campus[]; grades: Grade[]; groups: SubjectGroup[]
  sections: Section[]; subjects: Subject[]; teachers: Teacher[]; shifts: Shift[]; rooms: Room[]
  calendarSyncs: CalendarSync[]
}
