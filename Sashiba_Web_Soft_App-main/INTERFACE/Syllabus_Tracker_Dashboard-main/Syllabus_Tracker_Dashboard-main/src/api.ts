import type {
  AcademicSession, Curriculum, EducationBoard, Institution, Campus,
  Grade, SubjectGroup, Section, Subject, Teacher, Shift, Room,
  PlanRow, PlanMeta, FilterState, SessionType, RowSource, VersionEntry,
  CalendarSync, CalendarStats, PlanTemplate, PreGenAnalytics, Subtopic, SourceTag,
} from './types'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

// ─── Master Data (Backend SSOT) ───────────────────────────────────────────────

const SESSIONS: AcademicSession[] = [
  { id: 'ses-2024', label: '2024', startYear: 2024, isCrossYear: false },
  { id: 'ses-2025', label: '2025', startYear: 2025, isCrossYear: false },
  { id: 'ses-2026', label: '2026', startYear: 2026, isCrossYear: false },
  { id: 'ses-2526', label: '2025–2026', startYear: 2025, endYear: 2026, isCrossYear: true },
  { id: 'ses-2627', label: '2026–2027', startYear: 2026, endYear: 2027, isCrossYear: true },
  { id: 'ses-2728', label: '2027–2028', startYear: 2027, endYear: 2028, isCrossYear: true },
]

const CURRICULA: Curriculum[] = [
  { id: 'cur-nctb-bm', name: 'NCTB – Bangla Medium', code: 'NCTB-BM', medium: 'bangla' },
  { id: 'cur-nctb-em', name: 'NCTB – English Version', code: 'NCTB-EM', medium: 'english' },
  { id: 'cur-mad', name: 'Madrasah Board (Dakhil/Alim)', code: 'MADRASA', medium: 'arabic' },
  { id: 'cur-bteb', name: 'Technical – BTEB', code: 'BTEB', medium: 'bangla' },
  { id: 'cur-cam', name: 'Cambridge (O/AS/A Level)', code: 'CAMBRIDGE', medium: 'english' },
  { id: 'cur-edx', name: 'Edexcel (IGCSE/IAL)', code: 'EDEXCEL', medium: 'english' },
]

const BOARDS: EducationBoard[] = [
  { id: 'brd-dhaka', name: 'Dhaka Education Board', shortName: 'Dhaka', type: 'general' },
  { id: 'brd-raj', name: 'Rajshahi Education Board', shortName: 'Rajshahi', type: 'general' },
  { id: 'brd-ctg', name: 'Chittagong Education Board', shortName: 'Chittagong', type: 'general' },
  { id: 'brd-syl', name: 'Sylhet Education Board', shortName: 'Sylhet', type: 'general' },
  { id: 'brd-bar', name: 'Barishal Education Board', shortName: 'Barishal', type: 'general' },
  { id: 'brd-com', name: 'Comilla Education Board', shortName: 'Comilla', type: 'general' },
  { id: 'brd-din', name: 'Dinajpur Education Board', shortName: 'Dinajpur', type: 'general' },
  { id: 'brd-mym', name: 'Mymensingh Education Board', shortName: 'Mymensingh', type: 'general' },
  { id: 'brd-jes', name: 'Jashore Education Board', shortName: 'Jashore', type: 'general' },
  { id: 'brd-mad', name: 'Bangladesh Madrasah Education Board', shortName: 'BMEB', type: 'madrasah' },
  { id: 'brd-tec', name: 'Bangladesh Technical Education Board', shortName: 'BTEB', type: 'technical' },
  { id: 'brd-cam', name: 'British Council Bangladesh', shortName: 'BC', type: 'international' },
  { id: 'brd-edx', name: 'Pearson / Edexcel Bangladesh', shortName: 'Pearson', type: 'international' },
]

const CURRICULUM_BOARDS: Record<string, string[]> = {
  'cur-nctb-bm': ['brd-dhaka', 'brd-raj', 'brd-ctg', 'brd-syl', 'brd-bar', 'brd-com', 'brd-din', 'brd-mym', 'brd-jes'],
  'cur-nctb-em': ['brd-dhaka', 'brd-raj', 'brd-ctg'],
  'cur-mad': ['brd-mad'],
  'cur-bteb': ['brd-tec'],
  'cur-cam': ['brd-cam'],
  'cur-edx': ['brd-edx'],
}

const INSTITUTIONS: Institution[] = [
  { id: 'ins-drmc', name: 'Dhaka Residential Model College', code: 'DRMC', type: 'school_and_college', boardId: 'brd-dhaka' },
  { id: 'ins-viqar', name: 'Viqarunnisa Noon School & College', code: 'VNSC', type: 'school_and_college', boardId: 'brd-dhaka' },
  { id: 'ins-rajcc', name: 'Rajshahi Collegiate School & College', code: 'RCSC', type: 'school_and_college', boardId: 'brd-raj' },
  { id: 'ins-ctgcol', name: 'Chittagong Government City College', code: 'CGCC', type: 'school_and_college', boardId: 'brd-ctg' },
  { id: 'ins-pol1', name: 'Dhaka Polytechnic Institute', code: 'DPI', type: 'technical', boardId: 'brd-tec' },
  { id: 'ins-cam1', name: 'Sunbeams School & College', code: 'SUNBEAMS', type: 'school_and_college', boardId: 'brd-cam' },
]

const CAMPUSES: Campus[] = [
  { id: 'cam-drmc-main', name: 'Main Campus, Mohammadpur', institutionId: 'ins-drmc', address: 'Mohammadpur, Dhaka-1207' },
  { id: 'cam-drmc-annex', name: 'Annexe Campus, Mirpur', institutionId: 'ins-drmc', address: 'Mirpur-12, Dhaka-1216' },
  { id: 'cam-viqar-main', name: 'Main Campus, Bailey Road', institutionId: 'ins-viqar', address: 'Bailey Road, Dhaka-1000' },
  { id: 'cam-rajcc-main', name: 'Main Campus, Rajshahi', institutionId: 'ins-rajcc', address: 'Shaheb Bazar, Rajshahi' },
  { id: 'cam-ctg-main', name: 'Main Campus, Chittagong', institutionId: 'ins-ctgcol', address: 'Chawkbazar, Chittagong' },
  { id: 'cam-pol1-main', name: 'Tejgaon Campus', institutionId: 'ins-pol1', address: 'Tejgaon, Dhaka-1208' },
  { id: 'cam-cam1-main', name: 'Uttara Campus', institutionId: 'ins-cam1', address: 'Uttara, Dhaka-1230' },
]

const GRADES: Grade[] = [
  { id: 'g1', label: 'Class I', numericLevel: 1, levelType: 'primary', hasGroups: false },
  { id: 'g2', label: 'Class II', numericLevel: 2, levelType: 'primary', hasGroups: false },
  { id: 'g3', label: 'Class III', numericLevel: 3, levelType: 'primary', hasGroups: false },
  { id: 'g4', label: 'Class IV', numericLevel: 4, levelType: 'primary', hasGroups: false },
  { id: 'g5', label: 'Class V', numericLevel: 5, levelType: 'primary', hasGroups: false },
  { id: 'g6', label: 'Class VI', numericLevel: 6, levelType: 'secondary', hasGroups: false },
  { id: 'g7', label: 'Class VII', numericLevel: 7, levelType: 'secondary', hasGroups: false },
  { id: 'g8', label: 'Class VIII', numericLevel: 8, levelType: 'secondary', hasGroups: false },
  { id: 'g9', label: 'Class IX', numericLevel: 9, levelType: 'secondary', hasGroups: true },
  { id: 'g10', label: 'Class X (SSC)', numericLevel: 10, levelType: 'secondary', hasGroups: true },
  { id: 'g11', label: 'Class XI (HSC-I)', numericLevel: 11, levelType: 'higher_secondary', hasGroups: true },
  { id: 'g12', label: 'Class XII (HSC-II)', numericLevel: 12, levelType: 'higher_secondary', hasGroups: true },
]

const GROUPS: SubjectGroup[] = [
  { id: 'grp-sci', name: 'Science', code: 'SCI' },
  { id: 'grp-hum', name: 'Humanities', code: 'HUM' },
  { id: 'grp-biz', name: 'Business Studies', code: 'BIZ' },
  { id: 'grp-ele', name: 'Electrical Trade', code: 'ELE' },
  { id: 'grp-civ', name: 'Civil Trade', code: 'CIV' },
  { id: 'grp-cse', name: 'Computer Science Trade', code: 'CSE' },
]

const SECTIONS: Section[] = [
  { id: 'sec-a', name: 'Section A', capacity: 50 },
  { id: 'sec-b', name: 'Section B', capacity: 50 },
  { id: 'sec-c', name: 'Section C', capacity: 48 },
  { id: 'sec-d', name: 'Section D', capacity: 45 },
]

const SUBJECTS: Subject[] = [
  { id: 'sub-phy', name: 'Physics', nameLocal: 'পদার্থবিজ্ঞান', code: 'PHY', isCompulsory: false, weeklyPeriods: 4 },
  { id: 'sub-chem', name: 'Chemistry', nameLocal: 'রসায়ন', code: 'CHEM', isCompulsory: false, weeklyPeriods: 4 },
  { id: 'sub-bio', name: 'Biology', nameLocal: 'জীববিজ্ঞান', code: 'BIO', isCompulsory: false, weeklyPeriods: 4 },
  { id: 'sub-math', name: 'Higher Mathematics', nameLocal: 'উচ্চতর গণিত', code: 'HMATH', isCompulsory: false, weeklyPeriods: 5 },
  { id: 'sub-bng', name: 'Bangla', nameLocal: 'বাংলা', code: 'BNG', isCompulsory: true, weeklyPeriods: 5 },
  { id: 'sub-eng', name: 'English', nameLocal: 'ইংরেজি', code: 'ENG', isCompulsory: true, weeklyPeriods: 5 },
  { id: 'sub-gmath', name: 'General Mathematics', nameLocal: 'সাধারণ গণিত', code: 'GMATH', isCompulsory: true, weeklyPeriods: 5 },
  { id: 'sub-ict', name: 'ICT', nameLocal: 'তথ্য ও যোগাযোগ প্রযুক্তি', code: 'ICT', isCompulsory: true, weeklyPeriods: 3 },
  { id: 'sub-rel', name: 'Religious Studies', nameLocal: 'ধর্ম ও নৈতিক শিক্ষা', code: 'REL', isCompulsory: true, weeklyPeriods: 3 },
  { id: 'sub-phy-hsc', name: 'Physics (HSC)', nameLocal: 'পদার্থবিজ্ঞান', code: 'PHY-HSC', isCompulsory: false, weeklyPeriods: 5 },
  { id: 'sub-chem-hsc', name: 'Chemistry (HSC)', nameLocal: 'রসায়ন', code: 'CHEM-HSC', isCompulsory: false, weeklyPeriods: 5 },
  { id: 'sub-bio-hsc', name: 'Biology (HSC)', nameLocal: 'জীববিজ্ঞান', code: 'BIO-HSC', isCompulsory: false, weeklyPeriods: 5 },
  { id: 'sub-math-hsc', name: 'Mathematics (HSC)', nameLocal: 'গণিত', code: 'MATH-HSC', isCompulsory: false, weeklyPeriods: 5 },
  { id: 'sub-acc', name: 'Accounting', nameLocal: 'হিসাববিজ্ঞান', code: 'ACC', isCompulsory: false, weeklyPeriods: 4 },
  { id: 'sub-bus', name: 'Business Entrepreneurship', nameLocal: 'ব্যবসায় উদ্যোগ', code: 'BUS', isCompulsory: false, weeklyPeriods: 4 },
  { id: 'sub-fin', name: 'Finance & Banking', nameLocal: 'ফিন্যান্স ও ব্যাংকিং', code: 'FIN', isCompulsory: false, weeklyPeriods: 4 },
  { id: 'sub-hist', name: 'History of Bangladesh & World', nameLocal: 'বাংলাদেশ ও বিশ্বের ইতিহাস', code: 'HIST', isCompulsory: false, weeklyPeriods: 4 },
  { id: 'sub-civics', name: 'Civics & Citizenship', nameLocal: 'পৌরনীতি ও নাগরিকতা', code: 'CIV', isCompulsory: false, weeklyPeriods: 4 },
  { id: 'sub-econ', name: 'Economics', nameLocal: 'অর্থনীতি', code: 'ECO', isCompulsory: false, weeklyPeriods: 4 },
]

const TEACHERS: Teacher[] = [
  { id: 'tea-001', name: 'Md. Rafiqul Islam', designation: 'Senior Teacher (Physics)', employeeId: 'EMP-2341', specialization: 'PHY', email: 'rafiqul@drmc.edu.bd' },
  { id: 'tea-002', name: 'Farhana Begum', designation: 'Senior Teacher (Chemistry)', employeeId: 'EMP-2342', specialization: 'CHEM', email: 'farhana@drmc.edu.bd' },
  { id: 'tea-003', name: 'Md. Shahidul Haque', designation: 'Teacher (Mathematics)', employeeId: 'EMP-2343', specialization: 'MATH', email: 'shahidul@drmc.edu.bd' },
  { id: 'tea-004', name: 'Nasrin Akter', designation: 'Senior Teacher (Biology)', employeeId: 'EMP-2344', specialization: 'BIO', email: 'nasrin@drmc.edu.bd' },
  { id: 'tea-005', name: 'Md. Kamal Hossain', designation: 'Teacher (English)', employeeId: 'EMP-2345', specialization: 'ENG', email: 'kamal@drmc.edu.bd' },
  { id: 'tea-006', name: 'Shirin Sultana', designation: 'Teacher (Bangla)', employeeId: 'EMP-2346', specialization: 'BNG', email: 'shirin@drmc.edu.bd' },
  { id: 'tea-007', name: 'Md. Aminur Rahman', designation: 'ICT Instructor', employeeId: 'EMP-2347', specialization: 'ICT', email: 'aminur@drmc.edu.bd' },
  { id: 'tea-008', name: 'Dr. Rashed Karim', designation: 'Asst. Professor (Physics)', employeeId: 'EMP-2348', specialization: 'PHY-HSC', email: 'rashed@drmc.edu.bd' },
  { id: 'tea-009', name: 'Meher Negar Chowdhury', designation: 'Asst. Professor (Chemistry)', employeeId: 'EMP-2349', specialization: 'CHEM-HSC', email: 'meher@drmc.edu.bd' },
  { id: 'tea-010', name: 'Md. Jamal Uddin', designation: 'Teacher (Accounting)', employeeId: 'EMP-2350', specialization: 'ACC', email: 'jamal@drmc.edu.bd' },
  { id: 'tea-011', name: 'Rubina Yesmin', designation: 'Teacher (History)', employeeId: 'EMP-2351', specialization: 'HIST', email: 'rubina@drmc.edu.bd' },
]

const SHIFTS: Shift[] = [
  { id: 'shf-morn', name: 'Morning', startTime: '07:30', endTime: '12:00', periodsPerDay: 6 },
  { id: 'shf-day', name: 'Day', startTime: '11:30', endTime: '16:30', periodsPerDay: 6 },
  { id: 'shf-eve', name: 'Evening', startTime: '16:00', endTime: '20:00', periodsPerDay: 4 },
]

const ROOMS: Room[] = [
  { id: 'rm-101', name: 'Room 101', type: 'classroom', capacity: 50, building: 'Block A' },
  { id: 'rm-201', name: 'Room 201', type: 'classroom', capacity: 50, building: 'Block A' },
  { id: 'rm-301', name: 'Room 301', type: 'classroom', capacity: 50, building: 'Block B' },
  { id: 'rm-phy-lab', name: 'Physics Lab', type: 'lab', capacity: 30, building: 'Science Block' },
  { id: 'rm-chem-lab', name: 'Chemistry Lab', type: 'lab', capacity: 28, building: 'Science Block' },
  { id: 'rm-bio-lab', name: 'Biology Lab', type: 'lab', capacity: 28, building: 'Science Block' },
  { id: 'rm-ict-lab', name: 'ICT Lab', type: 'lab', capacity: 40, building: 'Tech Block' },
  { id: 'rm-sc-a', name: 'Smart Class A', type: 'smart_class', capacity: 60, building: 'Block C' },
  { id: 'rm-sc-b', name: 'Smart Class B', type: 'smart_class', capacity: 60, building: 'Block C' },
  { id: 'rm-lh1', name: 'Lecture Hall 1', type: 'lecture_hall', capacity: 120, building: 'Admin Block' },
]

// ─── Calendar Engine Data ─────────────────────────────────────────────────────

const CALENDAR_SYNCS: CalendarSync[] = [
  { id: 'sync-nctb', label: 'NCTB National Calendar 2025', status: 'synced', lastSync: '2025-01-01T06:00:00Z' },
  { id: 'sync-dhaka', label: 'Dhaka Board Academic Calendar', status: 'synced', lastSync: '2025-01-03T08:30:00Z' },
  { id: 'sync-inst', label: 'Institution Custom Calendar', status: 'pending' },
  { id: 'sync-manual', label: 'Manual Entry (No Sync)', status: 'failed' },
]

const CALENDAR_STATS_BASE: CalendarStats = {
  academicYear: '2025',
  totalCalendarDays: 365,
  workingDays: 182,
  govtHolidays: 43,
  protectedExamDays: 18,
  institutionHolidays: 11,
  availableTeachingDays: 182,
  weeklyPeriods: 6,
  sessionStart: '06 Jan 2025',
  sessionEnd: '20 Dec 2025',
}

// ─── Template Library ─────────────────────────────────────────────────────────

const TEMPLATES: PlanTemplate[] = [
  { id: 'tpl-nctb-ssc-sci', name: 'NCTB SSC — Science', description: 'Full-year plan for SSC Science group: Physics, Chemistry, Biology, Higher Math with board exam integration.', curriculum: 'NCTB', boardType: 'general', gradeRange: 'Class IX–X', tags: ['SSC', 'Science', 'NCTB', 'Board Prep'], icon: '⚗️', weekCount: 42, topicCount: 68 },
  { id: 'tpl-nctb-hsc-sci', name: 'NCTB HSC — Science', description: 'HSC-I & HSC-II Science group with Pratical sessions and board examination preparation built-in.', curriculum: 'NCTB', boardType: 'general', gradeRange: 'Class XI–XII', tags: ['HSC', 'Science', 'NCTB', 'Exam Prep'], icon: '🔬', weekCount: 44, topicCount: 82 },
  { id: 'tpl-nctb-ssc-biz', name: 'NCTB SSC — Business', description: 'SSC Business Studies: Accounting, Entrepreneurship, Finance. Includes project-based learning sessions.', curriculum: 'NCTB', boardType: 'general', gradeRange: 'Class IX–X', tags: ['SSC', 'Business', 'NCTB'], icon: '📊', weekCount: 42, topicCount: 54 },
  { id: 'tpl-nctb-hsc-hum', name: 'NCTB HSC — Humanities', description: 'HSC Humanities: History, Civics, Economics. Research-integrated curriculum with source analysis.', curriculum: 'NCTB', boardType: 'general', gradeRange: 'Class XI–XII', tags: ['HSC', 'Humanities', 'NCTB'], icon: '📜', weekCount: 44, topicCount: 60 },
  { id: 'tpl-cambridge-o', name: 'Cambridge O Level', description: 'Cambridge IGCSE / O Level template with past-paper integration, CIE mark scheme alignment.', curriculum: 'CAMBRIDGE', boardType: 'international', gradeRange: 'Grade 9–10', tags: ['Cambridge', 'IGCSE', 'O Level', 'CIE'], icon: '🎓', weekCount: 40, topicCount: 72 },
  { id: 'tpl-edexcel-ial', name: 'Edexcel IAL', description: 'Edexcel International A Level structured plan with unit-wise pacing and Pearson mark scheme.', curriculum: 'EDEXCEL', boardType: 'international', gradeRange: 'Grade 11–12', tags: ['Edexcel', 'IAL', 'A Level', 'Pearson'], icon: '🏛️', weekCount: 44, topicCount: 78 },
  { id: 'tpl-madrasah-dakhil', name: 'Madrasah Dakhil', description: 'Dakhil curriculum with Arabic language integration, Islamic Studies, and compulsory subjects.', curriculum: 'MADRASA', boardType: 'madrasah', gradeRange: 'Dakhil I–II', tags: ['Dakhil', 'Madrasah', 'BMEB'], icon: '📖', weekCount: 40, topicCount: 50 },
  { id: 'tpl-bteb-poly', name: 'BTEB Polytechnic', description: 'Diploma engineering curriculum: theory and practical sessions, industrial attachment weeks marked.', curriculum: 'BTEB', boardType: 'technical', gradeRange: '1st–4th Year', tags: ['BTEB', 'Polytechnic', 'Diploma', 'Engineering'], icon: '🔧', weekCount: 48, topicCount: 90 },
]

// ─── Curriculum Content (Book → Chapter → Topic → Subtopic → LO) ─────────────

interface SubtopicData { title: string; durationMin: number; learningOutcomes: string[] }
interface TopicData { main: string; subtopics: SubtopicData[] }
interface ChapterData { no: number; title: string; difficulty: 'easy' | 'medium' | 'hard'; topics: TopicData[]; labTopics?: string[] }

const CURRICULUM_CONTENT: Record<string, ChapterData[]> = {
  'PHY': [
    { no: 1, title: 'Physical Quantities & Measurement', difficulty: 'easy', topics: [
      { main: 'Nature of physics; Physical quantities and units', subtopics: [
        { title: 'Branches of physics and their scope', durationMin: 15, learningOutcomes: ['Define physics and list its major branches', 'Identify real-world applications of each branch'] },
        { title: 'SI units and derived units', durationMin: 20, learningOutcomes: ['Recall the 7 SI base units with symbols', 'Derive units for common quantities (speed, force, pressure)'] },
        { title: 'Significant figures and rounding rules', durationMin: 10, learningOutcomes: ['Apply rules for significant figures in calculations', 'Distinguish between accuracy and precision'] },
      ]},
      { main: 'Measurement instruments and errors', subtopics: [
        { title: 'Vernier caliper — principle and reading', durationMin: 20, learningOutcomes: ['Read a vernier caliper to 0.01 mm accuracy', 'Calculate least count for given vernier scale'] },
        { title: 'Screw gauge — pitch and least count', durationMin: 20, learningOutcomes: ['Determine least count of a micrometer screw gauge', 'Measure diameter of a wire using screw gauge'] },
        { title: 'Systematic and random errors', durationMin: 15, learningOutcomes: ['Distinguish between systematic and random errors', 'Calculate percentage error in a measurement'] },
      ]},
    ], labTopics: ['Measurement using Vernier caliper and screw gauge — practical session'] },
    { no: 2, title: 'Motion', difficulty: 'medium', topics: [
      { main: 'Distance, displacement, speed and velocity', subtopics: [
        { title: 'Scalar vs vector quantities — definitions', durationMin: 15, learningOutcomes: ['Distinguish scalar from vector quantities with examples', 'Define displacement as a vector quantity'] },
        { title: 'Average and instantaneous speed/velocity', durationMin: 20, learningOutcomes: ['Calculate average speed from distance and time', 'Interpret velocity as rate of change of displacement'] },
      ]},
      { main: 'Equations of uniformly accelerated motion', subtopics: [
        { title: 'Derivation of v = u + at; s = ut + ½at²', durationMin: 25, learningOutcomes: ['Derive the three kinematic equations from first principles', 'Apply kinematic equations to solve numerical problems'] },
        { title: 'Free fall and g = 9.8 m/s²', durationMin: 20, learningOutcomes: ['Explain free fall as a special case of uniform acceleration', 'Solve problems involving objects falling from rest'] },
      ]},
    ], labTopics: ['Velocity-time graph using ticker-tape timer'] },
    { no: 3, title: 'Dynamics', difficulty: 'medium', topics: [
      { main: "Newton's Laws of Motion", subtopics: [
        { title: "First Law — Concept of inertia", durationMin: 20, learningOutcomes: ["State Newton's First Law of Motion", 'Explain inertia with real-world examples'] },
        { title: "Second Law — F = ma and its applications", durationMin: 25, learningOutcomes: ["Apply F = ma to calculate net force or acceleration", 'Solve problems involving multiple forces on a body'] },
        { title: "Third Law — Action-reaction pairs", durationMin: 20, learningOutcomes: ["Identify action-reaction pairs in everyday situations", 'Explain why action and reaction do not cancel'] },
      ]},
      { main: 'Momentum, impulse and conservation', subtopics: [
        { title: 'Linear momentum — p = mv', durationMin: 15, learningOutcomes: ['Define momentum as a vector quantity', 'Calculate momentum for given mass and velocity'] },
        { title: 'Law of conservation of momentum', durationMin: 20, learningOutcomes: ['State and apply the conservation of momentum principle', 'Solve collision problems using momentum conservation'] },
      ]},
    ], labTopics: ["Verification of Newton's Second Law using trolley and pulley"] },
    { no: 4, title: 'Work, Power & Energy', difficulty: 'medium', topics: [
      { main: 'Work, power and their formulae', subtopics: [
        { title: 'Work done by a constant force — W = Fd cosθ', durationMin: 20, learningOutcomes: ['Calculate work done by a constant force at an angle', 'Determine when work is positive, negative, or zero'] },
        { title: 'Power = Work/Time — units and applications', durationMin: 15, learningOutcomes: ['Calculate power in watts and kilowatts', 'Apply power formula to engine and motor problems'] },
      ]},
      { main: 'Kinetic and potential energy; conservation', subtopics: [
        { title: 'KE = ½mv²; PE = mgh — derivation', durationMin: 20, learningOutcomes: ['Derive expressions for kinetic and potential energy', 'Apply work-energy theorem to solve problems'] },
        { title: 'Conservation of mechanical energy', durationMin: 25, learningOutcomes: ['State the law of conservation of energy', 'Verify conservation of energy in free-fall and simple pendulum'] },
      ]},
    ], labTopics: ['Energy conservation on an inclined track experiment'] },
    { no: 5, title: 'States of Matter & Pressure', difficulty: 'easy', topics: [
      { main: 'Pressure in solids, liquids and gases', subtopics: [
        { title: "Pressure = F/A; Pascal's Law", durationMin: 20, learningOutcomes: ["State Pascal's Law and its conditions", 'Calculate pressure at a depth in a liquid'] },
        { title: "Archimedes' Principle and buoyancy", durationMin: 20, learningOutcomes: ["State Archimedes' Principle", 'Determine whether an object floats or sinks'] },
      ]},
    ] },
  ],
  'CHEM': [
    { no: 1, title: 'Introduction to Chemistry', difficulty: 'easy', topics: [
      { main: 'Nature, scope and branches of chemistry', subtopics: [
        { title: 'Physical and chemical changes — differences', durationMin: 15, learningOutcomes: ['Distinguish physical from chemical changes with examples', 'Identify reversible and irreversible chemical changes'] },
        { title: 'Laboratory safety and equipment', durationMin: 20, learningOutcomes: ['Identify standard safety symbols and their meanings', 'Demonstrate correct use of common lab equipment'] },
      ]},
    ] },
    { no: 2, title: 'Matter, Atoms & Molecules', difficulty: 'medium', topics: [
      { main: "Dalton's atomic theory; sub-atomic particles", subtopics: [
        { title: 'Proton, neutron, electron — properties and location', durationMin: 20, learningOutcomes: ['State the properties of sub-atomic particles', 'Describe the structure of an atom using Bohr model'] },
        { title: 'Atomic number, mass number, isotopes', durationMin: 20, learningOutcomes: ['Define atomic number and mass number', 'Calculate neutrons and explain isotopes of hydrogen'] },
      ]},
    ], labTopics: ['Identifying substances by physical properties'] },
    { no: 3, title: 'Periodic Table', difficulty: 'medium', topics: [
      { main: "Mendeleev's law; modern periodic table", subtopics: [
        { title: 'Periods and groups — trends in properties', durationMin: 25, learningOutcomes: ['Explain periodic trends: atomic radius, electronegativity', 'Predict properties of an element from its position'] },
        { title: 'Group 1 alkali metals; Group 17 halogens', durationMin: 20, learningOutcomes: ['Describe physical and chemical properties of Group 1', 'Compare reactivity trends in Group 1 and Group 17'] },
      ]},
    ] },
    { no: 4, title: 'Chemical Bonding', difficulty: 'hard', topics: [
      { main: 'Ionic, covalent and metallic bonds', subtopics: [
        { title: 'Ionic bond — electron transfer; lattice structure', durationMin: 25, learningOutcomes: ['Explain ionic bond formation with electron diagrams', 'State properties of ionic compounds'] },
        { title: 'Covalent bond — electron sharing; Lewis structures', durationMin: 25, learningOutcomes: ['Draw Lewis dot structures for simple covalent molecules', 'Distinguish single, double and triple covalent bonds'] },
        { title: 'Electronegativity and polar covalent bonds', durationMin: 20, learningOutcomes: ['Define electronegativity and use Pauling scale', 'Predict bond polarity from electronegativity difference'] },
      ]},
    ] },
    { no: 5, title: 'Chemical Reactions', difficulty: 'medium', topics: [
      { main: 'Types and balancing of chemical equations', subtopics: [
        { title: 'Synthesis, decomposition, displacement reactions', durationMin: 20, learningOutcomes: ['Classify a given reaction into its type', 'Write and balance equations for each reaction type'] },
        { title: 'Oxidation and reduction — OIL RIG mnemonic', durationMin: 20, learningOutcomes: ['Define oxidation and reduction in terms of electrons', 'Identify oxidising and reducing agents in a reaction'] },
      ]},
    ], labTopics: ['Identifying redox reactions — copper sulfate and iron nail'] },
    { no: 6, title: 'Acid, Base & Salt', difficulty: 'medium', topics: [
      { main: 'pH scale, indicators and neutralisation', subtopics: [
        { title: 'Arrhenius and Brønsted–Lowry definitions', durationMin: 20, learningOutcomes: ['Define acids and bases using two theoretical models', 'Identify conjugate acid-base pairs'] },
        { title: 'pH scale — calculation and significance', durationMin: 20, learningOutcomes: ['Calculate pH from hydrogen ion concentration', 'Relate pH values to acidic, neutral and basic solutions'] },
      ]},
    ], labTopics: ['Determining pH using universal indicator and pH meter'] },
  ],
  'HMATH': [
    { no: 1, title: 'Real Numbers & Algebra', difficulty: 'medium', topics: [
      { main: 'Real numbers; surds, indices and logarithms', subtopics: [
        { title: 'Laws of indices — positive, negative, fractional', durationMin: 20, learningOutcomes: ['Apply laws of indices in simplification', 'Convert between index and surd form'] },
        { title: 'Logarithm laws and change of base', durationMin: 25, learningOutcomes: ['Apply product, quotient and power rules of logarithms', 'Solve equations using logarithms'] },
      ]},
    ] },
    { no: 2, title: 'Geometry', difficulty: 'medium', topics: [
      { main: 'Triangles, circles and coordinate proofs', subtopics: [
        { title: "Pythagoras theorem — proof and applications", durationMin: 25, learningOutcomes: ["Prove Pythagoras theorem using area argument", 'Apply Pythagoras to find missing sides in right triangles'] },
        { title: 'Circle theorems — angle at centre and circumference', durationMin: 25, learningOutcomes: ['State and apply the angle in a semicircle theorem', 'Prove the alternate segment theorem'] },
      ]},
    ] },
    { no: 3, title: 'Coordinate Geometry', difficulty: 'medium', topics: [
      { main: 'Lines, circles and their equations', subtopics: [
        { title: 'Gradient and equation of a straight line', durationMin: 20, learningOutcomes: ['Find the equation of a line given two points', 'Determine parallel and perpendicular line conditions'] },
        { title: 'Equation of a circle — centre-radius form', durationMin: 25, learningOutcomes: ['Write the equation of a circle given centre and radius', 'Find intersection of a line and a circle'] },
      ]},
    ] },
  ],
  'PHY-HSC': [
    { no: 1, title: 'Vectors & Scalars', difficulty: 'medium', topics: [
      { main: 'Vector operations and applications', subtopics: [
        { title: 'Vector addition — triangle and parallelogram laws', durationMin: 20, learningOutcomes: ['Add vectors using the parallelogram law', 'Resolve a vector into perpendicular components'] },
        { title: 'Dot product and cross product', durationMin: 25, learningOutcomes: ['Calculate scalar and vector products', 'Interpret physical meaning of dot and cross products'] },
      ]},
    ] },
    { no: 2, title: 'Kinematics', difficulty: 'medium', topics: [
      { main: 'Projectile motion and relative velocity', subtopics: [
        { title: 'Projectile motion — range, height, time of flight', durationMin: 25, learningOutcomes: ['Derive equations for range and maximum height', 'Solve projectile problems for given initial conditions'] },
        { title: 'Relative velocity in two dimensions', durationMin: 20, learningOutcomes: ['Calculate relative velocity of two moving objects', 'Apply relative velocity to river-crossing problems'] },
      ]},
    ] },
    { no: 3, title: 'Laws of Motion', difficulty: 'hard', topics: [
      { main: "Newton's laws in vector form; circular motion", subtopics: [
        { title: 'Centripetal force and acceleration', durationMin: 25, learningOutcomes: ['Derive expression for centripetal acceleration', 'Apply centripetal force formula to circular motion problems'] },
        { title: "Static and kinetic friction — coefficients", durationMin: 20, learningOutcomes: ['Define coefficients of static and kinetic friction', 'Solve inclined plane problems involving friction'] },
      ]},
    ], labTopics: ["Verification of Newton's laws using air track and photogate timer"] },
  ],
}

// ─── Period time slots per shift ──────────────────────────────────────────────

const PERIOD_TIMES: Record<string, { start: string; end: string }[]> = {
  'shf-morn': [
    { start: '07:30', end: '08:15' },{ start: '08:15', end: '09:00' },{ start: '09:00', end: '09:45' },
    { start: '10:00', end: '10:45' },{ start: '10:45', end: '11:30' },{ start: '11:30', end: '12:10' },
  ],
  'shf-day': [
    { start: '11:30', end: '12:15' },{ start: '12:15', end: '13:00' },{ start: '13:00', end: '13:45' },
    { start: '14:00', end: '14:45' },{ start: '14:45', end: '15:30' },{ start: '15:30', end: '16:15' },
  ],
  'shf-eve': [
    { start: '16:00', end: '16:50' },{ start: '16:50', end: '17:40' },{ start: '17:40', end: '18:30' },
    { start: '18:40', end: '19:30' },
  ],
}

const AI_REASONING_TEMPLATES = [
  'Scheduled based on prerequisite analysis — this topic builds directly on previous session concepts. Placed mid-week to leverage optimal retention windows.',
  'Positioned for moderate complexity rating. AI identified follow-up revision needed within 5 days based on Ebbinghaus forgetting curve model.',
  'Lab session scheduled on Friday per NCTB guidelines. Theory preparation session precedes this entry as per dependency graph.',
  'Revision session auto-inserted after 3+ topics without a consolidation break. Follows NCTB recommended pacing — spaced repetition principle.',
  'Assessment placed at chapter end per board examination pattern. AI cross-referenced past-paper frequency to weight topic coverage.',
]

// ─── Plan row generation ──────────────────────────────────────────────────────

function makeSubtopics(topicData: TopicData, chapterNo: number, topicIdx: number): Subtopic[] {
  return topicData.subtopics.map((st, i) => ({
    id: `st-${chapterNo}-${topicIdx}-${i}`,
    title: st.title,
    durationMin: st.durationMin,
    learningOutcomes: st.learningOutcomes,
  }))
}

function generatePlanRows(
  subjectCode: string, gradeLabel: string, sectionName: string,
  teacherName: string, teacherId: string, shiftId: string, roomName: string,
  dateFrom: string, dateTo: string,
): PlanRow[] {
  const chapters: ChapterData[] = CURRICULUM_CONTENT[subjectCode] || CURRICULUM_CONTENT['PHY']
  const periodSlots = PERIOD_TIMES[shiftId] || PERIOD_TIMES['shf-morn']
  const rows: PlanRow[] = []
  let rowIndex = 0
  let id = 1

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu']
  const sessionDays = ['Mon', 'Tue', 'Wed', 'Thu']

  const start = new Date(dateFrom)
  const end   = new Date(dateTo)
  const dateList: { date: string; day: string }[] = []
  const cur = new Date(start)
  while (cur <= end) {
    const day = cur.toLocaleDateString('en-US', { weekday: 'short' })
    if (days.includes(day)) {
      dateList.push({ date: cur.toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' '), day })
    }
    cur.setDate(cur.getDate() + 1)
  }

  const teachingDays = dateList.filter(d => sessionDays.includes(d.day))
  let dateIdx = 0; let periodIdx = 0

  const sourceTags: SourceTag[] = ['AI_GEN', 'AI_GEN', 'AI_GEN', 'TEACHER_EDIT', 'AI_GEN', 'AI_GEN', 'TEMPLATE', 'AI_GEN', 'AI_GEN', 'MERGED']
  const sources: RowSource[] = ['AI', 'AI', 'AI', 'MANUAL', 'AI', 'AI', 'TEMPLATE', 'AI', 'AI', 'AI']
  let srcIdx = 0

  for (const chapter of chapters) {
    for (let tIdx = 0; tIdx < chapter.topics.length; tIdx++) {
      const topicData = chapter.topics[tIdx]
      if (dateIdx >= teachingDays.length) break
      const dateEntry = teachingDays[dateIdx]
      const slot = periodSlots[periodIdx % periodSlots.length]
      const source = sources[srcIdx % sources.length]
      const sourceTag = sourceTags[srcIdx % sourceTags.length]
      const isManualOverride = source === 'MANUAL' || sourceTag === 'TEACHER_EDIT'
      const isLocked = source === 'TEMPLATE' || (srcIdx % 8 === 0)
      const subtopics = makeSubtopics(topicData, chapter.no, tIdx)
      const allLOs = subtopics.flatMap(st => st.learningOutcomes)

      const versionHistory: VersionEntry[] = [{
        id: `vh-${id}-1`,
        timestamp: new Date(2025, 0, 15 + dateIdx, 8, 30).toISOString(),
        changedBy: isManualOverride ? teacherName : 'AI Engine v3.1',
        role: isManualOverride ? 'TEACHER' : 'SUPER_ADMIN',
        changeType: isManualOverride ? 'OVERRIDE' : 'AI_GEN',
      }]

      rows.push({
        id: `row-${String(id).padStart(3, '0')}`,
        rowIndex: rowIndex++,
        date: dateEntry.date, dayOfWeek: dateEntry.day,
        periodNumber: (periodIdx % periodSlots.length) + 1,
        startTime: slot.start, endTime: slot.end,
        shiftId, shiftName: shiftId === 'shf-morn' ? 'Morning' : shiftId === 'shf-day' ? 'Day' : 'Evening',
        classLabel: gradeLabel, sectionName,
        subjectCode, subjectName: SUBJECTS.find(s => s.code === subjectCode)?.name || subjectCode,
        chapterNo: chapter.no, chapterTitle: chapter.title,
        topics: [topicData.main],
        subtopics,
        sessionType: 'LEC' as SessionType,
        teacherName, teacherId,
        roomName, durationMin: 45,
        source, sourceTag,
        isLocked, isManualOverride,
        learningOutcomes: allLOs,
        aiReasoning: AI_REASONING_TEMPLATES[id % AI_REASONING_TEMPLATES.length],
        versionHistory,
        createdAt: new Date(2025, 0, 10).toISOString(),
        updatedAt: new Date(2025, 0, 15 + dateIdx).toISOString(),
      })

      id++; srcIdx++; periodIdx++
      if (periodIdx % 3 === 0) dateIdx++
    }

    // Lab session
    if (chapter.labTopics && chapter.labTopics.length > 0 && dateIdx < teachingDays.length) {
      const dateEntry = teachingDays[dateIdx]
      const slot = periodSlots[0]
      rows.push({
        id: `row-${String(id).padStart(3, '0')}`, rowIndex: rowIndex++,
        date: dateEntry.date, dayOfWeek: dateEntry.day,
        periodNumber: 1, startTime: slot.start, endTime: periodSlots[1]?.end || slot.end,
        shiftId, shiftName: shiftId === 'shf-morn' ? 'Morning' : 'Day',
        classLabel: gradeLabel, sectionName,
        subjectCode, subjectName: SUBJECTS.find(s => s.code === subjectCode)?.name || subjectCode,
        chapterNo: chapter.no, chapterTitle: chapter.title,
        topics: chapter.labTopics,
        subtopics: chapter.labTopics.map((lt, i) => ({
          id: `st-lab-${chapter.no}-${i}`, title: lt, durationMin: 30,
          learningOutcomes: ['Conduct practical safely', 'Record observations systematically', 'Write laboratory report per NCTB guidelines'],
        })),
        sessionType: 'LAB',
        teacherName, teacherId,
        roomName: subjectCode.includes('PHY') ? 'Physics Lab' : subjectCode.includes('CHEM') ? 'Chemistry Lab' : roomName,
        durationMin: 90, source: 'AI', sourceTag: 'AI_GEN',
        isLocked: false, isManualOverride: false,
        learningOutcomes: ['Conduct practical experiment', 'Record observations and analyse results', 'Write laboratory report'],
        aiReasoning: 'Lab session scheduled per NCTB practical curriculum. Chapter theory sessions complete.',
        versionHistory: [{ id: `vh-${id}-1`, timestamp: new Date(2025, 0, 20).toISOString(), changedBy: 'AI Engine v3.1', role: 'SUPER_ADMIN', changeType: 'AI_GEN' }],
        createdAt: new Date(2025, 0, 10).toISOString(), updatedAt: new Date(2025, 0, 20).toISOString(),
      })
      id++; dateIdx++
    }

    // Revision session
    if (dateIdx < teachingDays.length) {
      const dateEntry = teachingDays[dateIdx]
      const slot = periodSlots[2]
      rows.push({
        id: `row-${String(id).padStart(3, '0')}`, rowIndex: rowIndex++,
        date: dateEntry.date, dayOfWeek: dateEntry.day,
        periodNumber: 3, startTime: slot?.start || '09:45', endTime: slot?.end || '10:30',
        shiftId, shiftName: shiftId === 'shf-morn' ? 'Morning' : 'Day',
        classLabel: gradeLabel, sectionName,
        subjectCode, subjectName: SUBJECTS.find(s => s.code === subjectCode)?.name || subjectCode,
        chapterNo: chapter.no, chapterTitle: chapter.title,
        topics: [`Chapter ${chapter.no} Revision — MCQ Practice & Board Question Analysis`],
        subtopics: [
          { id: `st-rev-${chapter.no}-0`, title: 'MCQ practice — board pattern questions', durationMin: 15, learningOutcomes: ['Complete 20 MCQs within time limit', 'Review incorrect answers with teacher'] },
          { id: `st-rev-${chapter.no}-1`, title: 'Short-answer and structured questions', durationMin: 20, learningOutcomes: ['Attempt structured questions following mark scheme', 'Identify common mistakes and misunderstandings'] },
          { id: `st-rev-${chapter.no}-2`, title: 'Summary and weak-area identification', durationMin: 10, learningOutcomes: ['Summarise key formulae and concepts', 'Create a personal study plan for weak topics'] },
        ],
        sessionType: 'REV',
        teacherName, teacherId, roomName,
        durationMin: 45, source: 'AI', sourceTag: 'AI_GEN',
        isLocked: false, isManualOverride: false,
        learningOutcomes: [`Consolidate Chapter ${chapter.no}`, 'Solve board-pattern questions', 'Identify knowledge gaps'],
        aiReasoning: 'Revision auto-inserted after chapter completion. Spacing-effect research: review within 72 hours maximises retention.',
        versionHistory: [{ id: `vh-${id}-1`, timestamp: new Date(2025, 0, 22).toISOString(), changedBy: 'AI Engine v3.1', role: 'SUPER_ADMIN', changeType: 'AI_GEN' }],
        createdAt: new Date(2025, 0, 10).toISOString(), updatedAt: new Date(2025, 0, 22).toISOString(),
      })
      id++
    }
    if (dateIdx >= teachingDays.length) break
  }

  return rows.slice(0, 38)
}

// ─── Public API Functions ─────────────────────────────────────────────────────

export async function apiGetSessions(): Promise<AcademicSession[]> {
  await delay(180); return [...SESSIONS]
}
export async function apiGetCurricula(_sessionId: string): Promise<Curriculum[]> {
  await delay(220); return [...CURRICULA]
}
export async function apiGetBoards(curriculumId: string): Promise<EducationBoard[]> {
  await delay(250)
  const ids = CURRICULUM_BOARDS[curriculumId] || []
  return BOARDS.filter(b => ids.includes(b.id))
}
export async function apiGetInstitutions(boardId: string): Promise<Institution[]> {
  await delay(300); return INSTITUTIONS.filter(i => i.boardId === boardId)
}
export async function apiGetCampuses(institutionId: string): Promise<Campus[]> {
  await delay(220); return CAMPUSES.filter(c => c.institutionId === institutionId)
}
export async function apiGetGrades(_curriculumId: string): Promise<Grade[]> {
  await delay(200); return [...GRADES]
}
export async function apiGetGroups(gradeId: string): Promise<SubjectGroup[]> {
  await delay(180)
  const grade = GRADES.find(g => g.id === gradeId)
  if (!grade?.hasGroups) return []
  return GROUPS.filter(g => ['grp-sci', 'grp-hum', 'grp-biz'].includes(g.id))
}
export async function apiGetSections(_gradeId: string, _groupId?: string): Promise<Section[]> {
  await delay(180); return [...SECTIONS]
}
export async function apiGetSubjects(gradeId: string, groupId?: string): Promise<Subject[]> {
  await delay(280)
  const grade = GRADES.find(g => g.id === gradeId)
  const compulsory = SUBJECTS.filter(s => s.isCompulsory)
  if (!grade) return compulsory
  const level = grade.numericLevel
  if (level <= 8) return compulsory
  if (groupId === 'grp-sci' && (level === 9 || level === 10))
    return [...compulsory, ...SUBJECTS.filter(s => ['PHY', 'CHEM', 'BIO', 'HMATH'].includes(s.code))]
  if (groupId === 'grp-sci' && (level === 11 || level === 12))
    return [...compulsory, ...SUBJECTS.filter(s => ['PHY-HSC', 'CHEM-HSC', 'BIO-HSC', 'MATH-HSC'].includes(s.code))]
  if (groupId === 'grp-biz')
    return [...compulsory, ...SUBJECTS.filter(s => ['ACC', 'BUS', 'FIN'].includes(s.code))]
  if (groupId === 'grp-hum')
    return [...compulsory, ...SUBJECTS.filter(s => ['HIST', 'CIV', 'ECO'].includes(s.code))]
  return compulsory
}
export async function apiGetTeachers(_institutionId: string, subjectIdOrCode?: string): Promise<Teacher[]> {
  await delay(300)
  if (!subjectIdOrCode) return [...TEACHERS]
  const subject = SUBJECTS.find(s => s.id === subjectIdOrCode || s.code === subjectIdOrCode)
  const code = subject?.code || subjectIdOrCode
  return TEACHERS.filter(t => t.specialization === code || t.specialization.startsWith(code.split('-')[0]))
}
export async function apiGetShifts(_campusId: string): Promise<Shift[]> {
  await delay(160); return [...SHIFTS]
}
export async function apiGetRooms(_campusId: string): Promise<Room[]> {
  await delay(160); return [...ROOMS]
}
export async function apiGetCalendarSyncs(): Promise<CalendarSync[]> {
  await delay(180); return [...CALENDAR_SYNCS]
}
export async function apiGetCalendarStats(_campusId: string, _sessionId: string): Promise<CalendarStats> {
  await delay(320); return { ...CALENDAR_STATS_BASE }
}
export async function apiGetTemplates(): Promise<PlanTemplate[]> {
  await delay(250); return [...TEMPLATES]
}
export async function apiGetPreGenAnalytics(filters: FilterState): Promise<PreGenAnalytics> {
  await delay(500)
  const subject = SUBJECTS.find(s => s.id === filters.subject)
  const code = subject?.code || 'PHY'
  const chapters = CURRICULUM_CONTENT[code] || CURRICULUM_CONTENT['PHY']
  const totalTopics = chapters.reduce((sum, ch) => sum + ch.topics.length, 0)
  const { workingDays } = CALENDAR_STATS_BASE
  const topicsPerDay = totalTopics / workingDays
  const topicsPerWeek = topicsPerDay * 5
  const hasLab = chapters.some(ch => ch.labTopics && ch.labTopics.length > 0)
  return {
    totalTopics,
    workingDays,
    topicsPerWeek: parseFloat(topicsPerWeek.toFixed(2)),
    topicsPerDay: parseFloat(topicsPerDay.toFixed(3)),
    estimatedCompletionPercent: Math.min(100, Math.round((totalTopics / (workingDays * 0.4)) * 100)),
    validations: {
      difficultyBalanced: chapters.filter(c => c.difficulty === 'hard').length <= chapters.length * 0.35,
      labAllocated: hasLab,
      revisionMapped: true,
      examWeeksProtected: true,
      teacherAvailable: !!filters.teacher,
    },
  }
}
export async function apiGeneratePlan(filters: FilterState): Promise<{ rows: PlanRow[]; meta: PlanMeta }> {
  await delay(900 + Math.random() * 400)
  const grade = GRADES.find(g => g.id === filters.grade)
  const teacher = TEACHERS.find(t => t.id === filters.teacher)
  const subject = SUBJECTS.find(s => s.id === filters.subject)
  const section = SECTIONS.find(s => s.id === filters.section)
  const subjectCode = subject?.code || 'PHY'
  const rows = generatePlanRows(
    subjectCode,
    grade?.label || 'Class IX',
    section?.name || 'Section A',
    teacher?.name || 'Md. Rafiqul Islam',
    teacher?.id || 'tea-001',
    filters.shift || 'shf-morn',
    filters.room ? (ROOMS.find(r => r.id === filters.room)?.name || 'Room 101') : 'Room 301',
    filters.dateFrom || '2025-01-01',
    filters.dateTo || '2025-06-30',
  )
  const aiCount = rows.filter(r => r.source === 'AI').length
  const manualCount = rows.filter(r => r.source === 'MANUAL').length
  const overrideCount = rows.filter(r => r.isManualOverride).length
  const lockedCount = rows.filter(r => r.isLocked).length
  const meta: PlanMeta = {
    id: `plan-${Date.now()}`, status: 'DRAFT', workflowStatus: 'DRAFT',
    totalTeachingDays: 172, workingDays: CALENDAR_STATS_BASE.workingDays,
    completedLessons: 0, pendingLessons: rows.length,
    topicsPlanned: rows.length, topicsTotal: Math.round(rows.length * 1.15),
    aiGeneratedCount: aiCount, manualCount, lockedCount, manualOverrideCount: overrideCount,
    coveragePercent: Math.round((rows.length / Math.round(rows.length * 1.15)) * 100),
    generatedAt: new Date().toISOString(),
  }
  return { rows, meta }
}
