// =========================================================================
//                   সশিবা স্মার্ট শিক্ষা বাতায়ন - লেসন প্ল্যান ড্যাশবোর্ড লজিক
// =========================================================================
// এই ফাইলে সকল লজিক এবং লোকাল স্টোরেজ ডাটাবেস হ্যান্ডেল করা হয়েছে।
// কোড সহজে পরিবর্তনের সুবিধার্থে প্রতিটি অংশকে বাংলা ইন্ডিকেটর দিয়ে আলাদা করা হলো।

// ==========================================
// [১] কনফিগারেশন এবং স্ট্যাটিক ডাটাবেস (Configuration Database)
// ==========================================
const db = {
  // শিক্ষাবোর্ডের অধীন সকল ক্লাস তালিকা (বাংলা ও ইংরেজি সংস্করণে ব্যবহারের জন্য)
  classes: {
    bn: [
      "প্রথম",
      "দ্বিতীয়",
      "তৃতীয়",
      "চতুর্থ",
      "পঞ্চম",
      "ষষ্ঠ",
      "সপ্তম",
      "অষ্টম",
      "নবম",
      "দশম",
      "একাদশ",
      "দ্বাদশ",
    ],
    en: [
      "Class 1",
      "Class 2",
      "Class 3",
      "Class 4",
      "Class 5",
      "Class 6",
      "Class 7",
      "Class 8",
      "Class 9",
      "Class 10",
      "Class 11",
      "Class 12",
    ],
  },

  // ক্লাস এবং বিভাগ অনুযায়ী বিষয়ের তালিকা (বাংলা)
  subjects_bn: {
    প্রথম: ["বাংলা", "গণিত", "ইংরেজি"],
    দ্বিতীয়: ["বাংলা", "গণিত", "ইংরেজি", "পরিবেশ পরিচিতি"],
    তৃতীয়: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "প্রাথমিক বিজ্ঞান",
      "ধর্ম",
    ],
    চতুর্থ: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "প্রাথমিক বিজ্ঞান",
      "ধর্ম",
    ],
    পঞ্চম: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "প্রাথমিক বিজ্ঞান",
      "ধর্ম",
    ],
    ষষ্ঠ: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বিজ্ঞান",
      "ইতিহাস ও সামাজিক বিজ্ঞান",
      "ডিজিটাল প্রযুক্তি",
      "ধর্ম",
      "শিল্প ও সংস্কৃতি",
      "স্বাস্থ্য সুরক্ষা",
      "জীবন ও জীবিকা",
    ],
    সপ্তম: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বিজ্ঞান",
      "ইতিহাস ও সামাজিক বিজ্ঞান",
      "ডিজিটাল প্রযুক্তি",
      "ধর্ম",
      "শিল্প ও সংস্কৃতি",
      "স্বাস্থ্য সুরক্ষা",
      "জীবন ও জীবিকা",
    ],
    অষ্টম: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বিজ্ঞান",
      "ইতিহাস ও সামাজিক বিজ্ঞান",
      "ডিজিটাল প্রযুক্তি",
      "ধর্ম",
      "শিল্প ও সংস্কৃতি",
      "স্বাস্থ্য সুরক্ষা",
      "জীবন ও জীবিকা",
    ],
    Science: ["পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "উচ্চতর গণিত"],
    Arts: ["ভূগোল", "অর্থনীতি", "ইতিহাস", "যুক্তিবিদ্যা"],
    Commerce: ["হিসাববিজ্ঞান", "ব্যবসায় উদ্যোগ", "ফিন্যান্স ও ব্যাংকিং"],
    Compulsory: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "তথ্য ও যোগাযোগ প্রযুক্তি",
      "বাংলাদেশ ও বিশ্বপরিচয়",
    ],
  },

  // ক্লাস এবং বিভাগ অনুযায়ী বিষয়ের তালিকা (ইংরেজি)
  subjects_en: {
    "Class 1": ["Bangla", "Mathematics", "English"],
    "Class 2": ["Bangla", "Mathematics", "English", "Environmental Studies"],
    "Class 3": [
      "Bangla",
      "English",
      "Mathematics",
      "Bangladesh & Global Studies",
      "Elementary Science",
      "Religion",
    ],
    "Class 4": [
      "Bangla",
      "English",
      "Mathematics",
      "Bangladesh & Global Studies",
      "Elementary Science",
      "Religion",
    ],
    "Class 5": [
      "Bangla",
      "English",
      "Mathematics",
      "Bangladesh & Global Studies",
      "Elementary Science",
      "Religion",
    ],
    "Class 6": [
      "Bangla",
      "English",
      "Mathematics",
      "Science",
      "History & Social Science",
      "Digital Technology",
      "Religion",
      "Art & Culture",
      "Wellbeing",
      "Life & Livelihood",
    ],
    "Class 7": [
      "Bangla",
      "English",
      "Mathematics",
      "Science",
      "History & Social Science",
      "Digital Technology",
      "Religion",
      "Art & Culture",
      "Wellbeing",
      "Life & Livelihood",
    ],
    "Class 8": [
      "Bangla",
      "English",
      "Mathematics",
      "Science",
      "History & Social Science",
      "Digital Technology",
      "Religion",
      "Art & Culture",
      "Wellbeing",
      "Life & Livelihood",
    ],
    Science: ["Physics", "Chemistry", "Biology", "Higher Mathematics"],
    Arts: ["Geography", "Economics", "History", "Logic"],
    Commerce: ["Accounting", "Business Entrepreneurship", "Finance & Banking"],
    Compulsory: [
      "Bangla",
      "English",
      "Mathematics",
      "Information & Communication Technology",
      "Bangladesh & Global Studies",
    ],
  },

  // বিষয়ভিত্তিক ডাইনামিক অধ্যায় তালিকা (বাংলা)
  chapters_bn: {
    বাংলা: [
      "অধ্যায় ১: ভাষা ও ব্যাকরণ পরিচিতি",
      "অধ্যায় ২: ধ্বনিতত্ত্ব ও উচ্চারণ স্থান",
      "অধ্যায় ৩: শব্দ প্রকরণ ও বানান রীতি",
    ],
    গণিত: [
      "অধ্যায় ১: বাস্তব সংখ্যা ও সেট",
      "অধ্যায় ২: বীজগণিতীয় রাশি ও সূত্রাবলী",
      "অধ্যায় ৩: জ্যামিতিক অঙ্কন ও পরিমাপ",
    ],
    ইংরেজি: [
      "Chapter 1: Parts of Speech in Detail",
      "Chapter 2: Tense and Subject-Verb Agreement",
      "Chapter 3: Sentence Transformation & Voices",
    ],
    বিজ্ঞান: [
      "অধ্যায় ১: বিজ্ঞান ও অনুসন্ধানী পাঠ",
      "অধ্যায় ২: আমাদের চারপাশের পদার্থ",
      "অধ্যায় ৩: কোষ বিভাজন ও বংশগতি",
    ],
  },

  // বিষয়ভিত্তিক ডাইনামিক অধ্যায় তালিকা (ইংরেজি)
  chapters_en: {
    Bangla: [
      "Chapter 1: Introduction to Language and Grammar",
      "Chapter 2: Phonology and Pronunciation",
      "Chapter 3: Morphology and Spelling Rules",
    ],
    Mathematics: [
      "Chapter 1: Real Numbers and Sets",
      "Chapter 2: Algebraic Expressions and Formulae",
      "Chapter 3: Geometric Construction and Measurement",
    ],
    English: [
      "Chapter 1: Parts of Speech in Detail",
      "Chapter 2: Tense and Subject-Verb Agreement",
      "Chapter 3: Sentence Transformation & Voices",
    ],
    Science: [
      "Chapter 1: Science and Investigative Study",
      "Chapter 2: Matter Around Us",
      "Chapter 3: Cell Division and Heredity",
    ],
  },

  // অধ্যায়ভিত্তিক ডাইনামিক টপিক/পাঠ তালিকা (বাংলা)
  topics_bn: {
    "অধ্যায় ১: ভাষা ও ব্যাকরণ পরিচিতি": [
      "টপিক ১.১: ভাষার সংজ্ঞা, বৈশিষ্ট্য ও প্রকারভেদ",
      "টপিক ১.২: সাধু ও চলিত ভাষার রূপান্তর",
      "টপিক ১.৩: বাংলা ব্যাকরণের প্রয়োজনীয়তা ও আলোচ্য বিষয়",
    ],
    "অধ্যায় ২: ধ্বনিতত্ত্ব ও উচ্চারণ স্থান": [
      "টপিক ২.১: স্বরধ্বনি ও ব্যঞ্জনধ্বনির শ্রেণীবিন্যাস",
      "টপিক ২.২: বর্ণ ও বর্ণের উচ্চারণ স্থান",
      "টপিক ২.৩: নত্ব-বিধান ও ষত্ব-বিধান",
    ],
    "অধ্যায় ১: বাস্তব সংখ্যা ও সেট": [
      "টপিক ১.১: মূলদ ও অমূলদ সংখ্যার ধারণা",
      "টপিক ১.২: সেটের সংজ্ঞা ও প্রকাশের পদ্ধতিসমূহ",
      "টপিক ১.৩: উপসেট, ভেনচিত্র ও সংযোগ সেট",
    ],
    "Chapter 1: Parts of Speech in Detail": [
      "Topic 1.1: Nouns, Pronouns and Adjectives classification",
      "Topic 1.2: Identification of Verbs, Adverbs and Prepositions",
      "Topic 1.3: Conjunctions and Interjections usage",
    ],
  },

  // অধ্যায়ভিত্তিক ডাইনামিক টপিক/পাঠ তালিকা (ইংরেজি)
  topics_en: {
    "Chapter 1: Introduction to Language and Grammar": [
      "Topic 1.1: Definition, Characteristics and Types of Language",
      "Topic 1.2: Transformation of Sadhu and Chalit forms",
      "Topic 1.3: Necessity and Scope of Grammar",
    ],
    "Chapter 2: Phonology and Pronunciation": [
      "Topic 2.1: Classification of Vowels and Consonants",
      "Topic 2.2: Letters and Pronunciation Places",
      "Topic 2.3: Natwa and Shatwa Rules",
    ],
    "Chapter 1: Real Numbers and Sets": [
      "Topic 1.1: Concepts of Rational and Irrational Numbers",
      "Topic 1.2: Definition and Methods of representing Sets",
      "Topic 1.3: Subsets, Venn Diagrams and Intersection of Sets",
    ],
    "Chapter 1: Parts of Speech in Detail": [
      "Topic 1.1: Nouns, Pronouns and Adjectives classification",
      "Topic 1.2: Identification of Verbs, Adverbs and Prepositions",
      "Topic 1.3: Conjunctions and Interjections usage",
    ],
  },

  // পাঠদান পদ্ধতিসমূহ (বাংলা ও ইংরেজি)
  methods: {
    bn: [
      "আলোচনা ও লেকচার",
      "বাস্তব প্রদর্শন ও পরীক্ষণ",
      "দলীয় কাজ (Group Work)",
      "প্রশ্নোত্তর পর্ব (Q/A)",
      "জোড়ায় কাজ (Pair Work)",
      "অনুশীলন ও ফিডব্যাক",
      "কুইজ টেস্ট",
      "ব্রেনস্টর্মিং (বুদ্ধি যাচাই)",
    ],
    en: [
      "Discussion & Lecture",
      "Practical & Demonstration",
      "Group Work",
      "Question & Answer (Q/A)",
      "Pair Work",
      "Practice & Feedback",
      "Quiz Test",
      "Brainstorming",
    ],
  },

  // ব্লুমস ট্যাক্সোনমি স্তরসমূহ
  blooms: ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"],
};

// গ্লোবাল ল্যাঙ্গুয়েজ স্টেট (Default: Bangla)
let currentLang = "bn";

// ==========================================
// [২] সহায়ক লাইব্রেরি ফাংশন (Helper Library Functions)
// ==========================================

// ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর
function toBanglaDigits(num) {
  if (num === null || num === undefined) return "";
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
}

// বাংলা সংখ্যাকে ইংরেজি সংখ্যায় রূপান্তর
function toEnglishDigits(num) {
  if (num === null || num === undefined) return "";
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const banglaDigitsMap = {
    "০": 0,
    "১": 1,
    "২": 2,
    "৩": 3,
    "৪": 4,
    "৫": 5,
    "৬": 6,
    "৭": 7,
    "৮": 8,
    "৯": 9,
  };
  return num.toString().replace(/[০-৯]/g, (digit) => banglaDigitsMap[digit]);
}

// সংখ্যাকে ভাষা অনুযায়ী কনভার্ট করা
function formatDigits(num) {
  return currentLang === "bn" ? toBanglaDigits(num) : toEnglishDigits(num);
}

// ==========================================
// [৩] ভাষা ডিকশনারি ও ইন্টারফেস ট্রান্সলেশন (UI Translation Logic)
// ==========================================
const uiTranslations = {
  bn: {
    // সাইডবার
    sidebar_dashboard: '<i class="fa-solid fa-house"></i> ড্যাশবোর্ড',
    sidebar_new:
      '<i class="fa-solid fa-file-circle-plus"></i> নতুন লেসন প্ল্যান',
    sidebar_library:
      '<i class="fa-solid fa-clock-rotate-left"></i> পুরোনো লেসন প্ল্যান',
    sidebar_role: "প্রধান শিক্ষক",
    main_heading: "লেসন আর্কিটেক্ট",
    // টপ বার
    btn_save: "সেভ ও এক্সপোর্ট",
    opt_save_draft:
      "<strong>ড্রাফট সেভ করুন</strong><small>লোকাল স্টোরেজে সংরক্ষিত হবে</small>",
    opt_download_word:
      "<strong>MS Word ডাউনলোড</strong><small>ডকুমেন্ট ফাইল হিসেবে এক্সপোর্ট</small>",
    opt_print_pdf:
      "<strong>PDF ডাউনলোড / প্রিন্ট</strong><small>A4 সাইজে এক্সপোর্ট করুন</small>",
    // কার্ড হেডার
    card_school_header: '<i class="fa-solid fa-school"></i> প্রতিষ্ঠানের তথ্য',
    card_academic_header: '<i class="fa-solid fa-book"></i> একাডেমিক তথ্য',
    card_chapter_header: '<i class="fa-solid fa-list-ul"></i> অধ্যায় ও পাঠ',
    card_methods_header:
      '<i class="fa-solid fa-chalkboard-user"></i> পঠন পদ্ধতি',
    card_objective_header:
      '<i class="fa-solid fa-bullseye"></i> উদ্দেশ্য ও শিখনফল (AI)',
    card_grouping_header:
      '<i class="fa-solid fa-users"></i> শিক্ষার্থী বিবরণ (গ্রুপিং)',
    card_bloom_header: '<i class="fa-solid fa-brain"></i> Bloom\'s Taxonomy',
    // ইনপুট লেবেল ও প্লেসহোল্ডার
    placeholder_schName: "প্রতিষ্ঠানের নাম",
    placeholder_schAddr: "ঠিকানা",
    placeholder_schCode: "স্কুল কোড",
    placeholder_schYear: "প্রতিষ্ঠাকাল",
    label_board: "শিক্ষা বোর্ড",
    label_class: "শ্রেণি",
    label_group: "বিভাগ",
    label_subject: "বিষয়",
    placeholder_bookName: "বইয়ের নাম অটো ফিল",
    label_chapters: "অধ্যায়সমূহ:",
    label_topics: "পাঠসমূহ:",
    placeholder_duration: "समय (মিনিট)",
    placeholder_objective:
      "আজকের পাঠের উদ্দেশ্য লিখুন (যেমন: নিউটনের গতিসূত্র বা ভাষার প্রকারভেদ)",
    help_objective: "উদ্দেশ্য লিখলে AI শিখনফল ও লেসন টেবিল জেনারেট করবে।",
    placeholder_vgood: "খুব ভালো রোল (যেমন: ১, ২, ৩)",
    placeholder_avg: "মাঝারি রোল (যেমন: ৪, ৫, ৬)",
    placeholder_low: "নিম্নমান রোল (যেমন: ৭, ৮, ৯)",
    btn_generate:
      '<i class="fa-solid fa-wand-magic-sparkles"></i> জেনারেট লেসন প্ল্যান',
    // লাইব্রেরি সেকশন
    library_heading: "আমার লেসন প্ল্যান লাইব্রেরি",
    btn_back_dashboard:
      '<i class="fa-solid fa-arrow-left"></i> ব্যাক টু ড্যাশবোর্ড',
  },
  en: {
    sidebar_dashboard: '<i class="fa-solid fa-house"></i> Dashboard',
    sidebar_new: '<i class="fa-solid fa-file-circle-plus"></i> New Lesson Plan',
    sidebar_library:
      '<i class="fa-solid fa-clock-rotate-left"></i> Recent Lesson Plans',
    sidebar_role: "Headmaster",
    main_heading: "Lesson Architect",
    btn_save: "Save & Export",
    opt_save_draft:
      "<strong>Save Draft</strong><small>Will be saved in LocalStorage</small>",
    opt_download_word:
      "<strong>Download MS Word</strong><small>Export as document file</small>",
    opt_print_pdf:
      "<strong>Download / Print PDF</strong><small>Export in A4 size</small>",
    card_school_header: '<i class="fa-solid fa-school"></i> Institution Info',
    card_academic_header: '<i class="fa-solid fa-book"></i> Academic Info',
    card_chapter_header:
      '<i class="fa-solid fa-list-ul"></i> Chapters & Topics',
    card_methods_header:
      '<i class="fa-solid fa-chalkboard-user"></i> Teaching Methods',
    card_objective_header:
      '<i class="fa-solid fa-bullseye"></i> Objectives & Outcomes (AI)',
    card_grouping_header:
      '<i class="fa-solid fa-users"></i> Student Details (Grouping)',
    card_bloom_header: '<i class="fa-solid fa-brain"></i> Bloom\'s Taxonomy',
    placeholder_schName: "Institution Name",
    placeholder_schAddr: "Address",
    placeholder_schCode: "School Code",
    placeholder_schYear: "Established Year",
    label_board: "Education Board",
    label_class: "Class",
    label_group: "Group",
    label_subject: "Subject",
    placeholder_bookName: "Book Name Auto Fill",
    label_chapters: "Chapters:",
    label_topics: "Topics:",
    placeholder_duration: "Duration (minutes)",
    placeholder_objective:
      "Enter lesson objective (e.g. Newton's laws of motion or Types of languages)",
    help_objective: "Writing objective will generate outcomes and timeline.",
    placeholder_vgood: "Excellent Rolls (e.g. 1, 2, 3)",
    placeholder_avg: "Average Rolls (e.g. 4, 5, 6)",
    placeholder_low: "Needs Support Rolls (e.g. 7, 8, 9)",
    btn_generate:
      '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Lesson Plan',
    library_heading: "Recent Lesson Plan Library",
    btn_back_dashboard:
      '<i class="fa-solid fa-arrow-left"></i> Back to Dashboard',
  },
};

// সম্পূর্ণ ইউজার ইন্টারফেস (UI) ট্রান্সলেট করার ফাংশন
function translateUI() {
  const trans = uiTranslations[currentLang];

  // ১. সাইডবার ও টাইটেলসমূহ
  document.getElementById("sb-dashboard").innerHTML = trans.sidebar_dashboard;
  document.getElementById("sb-new").innerHTML = trans.sidebar_new;
  document.getElementById("sb-library").innerHTML = trans.sidebar_library;
  document.getElementById("sb-role").innerText = trans.sidebar_role;
  document.getElementById("hdr-title").innerText = trans.main_heading;

  // ২. অ্যাকশন বাটনসমূহ
  document.getElementById("btn-save-text").innerHTML =
    `<i class="fa-solid fa-cloud-arrow-down"></i> <span>${trans.btn_save}</span> <i class="fa-solid fa-chevron-down arrow-icon"></i>`;
  document.getElementById("opt-save").innerHTML =
    `<i class="fa-solid fa-floppy-disk"></i> <div class="item-text">${trans.opt_save_draft}</div>`;
  document.getElementById("opt-word").innerHTML =
    `<i class="fa-solid fa-file-word"></i> <div class="item-text">${trans.opt_download_word}</div>`;
  document.getElementById("opt-pdf").innerHTML =
    `<i class="fa-solid fa-file-pdf"></i> <div class="item-text">${trans.opt_print_pdf}</div>`;

  // ৩. ইনপুট কার্ডস হেডার
  document.getElementById("ch-school").innerHTML = trans.card_school_header;
  document.getElementById("ch-academic").innerHTML = trans.card_academic_header;
  document.getElementById("ch-chapter").innerHTML = trans.card_chapter_header;
  document.getElementById("ch-methods").innerHTML = trans.card_methods_header;
  document.getElementById("ch-objective").innerHTML =
    trans.card_objective_header;
  document.getElementById("ch-grouping").innerHTML = trans.card_grouping_header;
  document.getElementById("ch-bloom").innerHTML = trans.card_bloom_header;

  // ৪. লেবেল ও প্লেসহোল্ডার
  document.getElementById("schName").placeholder = trans.placeholder_schName;
  document.getElementById("schAddr").placeholder = trans.placeholder_schAddr;
  document.getElementById("schCode").placeholder = trans.placeholder_schCode;
  document.getElementById("schYear").placeholder = trans.placeholder_schYear;

  document.getElementById("lbl-board").innerText = trans.label_board;
  document.getElementById("lbl-class").innerText = trans.label_class;
  document.getElementById("lbl-group").innerText = trans.label_group;
  document.getElementById("lbl-subject").innerText = trans.label_subject;
  document.getElementById("bookName").placeholder = trans.placeholder_bookName;

  document.getElementById("lbl-chapters").innerText = trans.label_chapters;
  document.getElementById("lbl-topics").innerText = trans.label_topics;
  document.getElementById("duration").placeholder = trans.placeholder_duration;

  document.getElementById("lessonObjective").placeholder =
    trans.placeholder_objective;
  document.getElementById("lbl-help-obj").innerText = trans.help_objective;

  document.getElementById("roll-vgood").placeholder = trans.placeholder_vgood;
  document.getElementById("roll-avg").placeholder = trans.placeholder_avg;
  document.getElementById("roll-low").placeholder = trans.placeholder_low;

  document.getElementById("btn-generate-text").innerHTML = trans.btn_generate;

  // ৫. লাইব্রেরি সেকশন
  document.getElementById("lib-heading").innerText = trans.library_heading;
  document.getElementById("btn-back-dash").innerHTML = trans.btn_back_dashboard;

  // বিভাগ (Group) অপশন সমূহের টেক্সট অনুবাদ করা
  const groupSel = document.getElementById("group");
  if (groupSel) {
    const opts = groupSel.options;
    if (currentLang === "bn") {
      opts[0].text = "আবশ্যিক";
      opts[1].text = "বিজ্ঞান";
      opts[2].text = "মানবিক";
      opts[3].text = "ব্যবসায় শিক্ষা";
    } else {
      opts[0].text = "Compulsory";
      opts[1].text = "Science";
      opts[2].text = "Humanities";
      opts[3].text = "Business Studies";
    }
  }

  // সিলেক্ট ফিল্ড রিবিল্ড করা ভাষা ভেদে
  rebuildClassesAndMethods();
}

// শ্রেণি ও শিখন পদ্ধতির সিলেক্ট লিস্ট পুনরায় লোড করা (ভাষা অনুযায়ী)
function rebuildClassesAndMethods() {
  const clsSel = document.getElementById("class");
  const activeClass = clsSel.value; // সিলেক্টেড মান ধরে রাখা

  clsSel.innerHTML =
    currentLang === "bn"
      ? '<option value="">শ্রেণি নির্বাচন করুন</option>'
      : '<option value="">Select Class</option>';
  db.classes[currentLang].forEach((c, index) => {
    // বাংলা তালিকা আর ইংরেজি তালিকার ইনডেক্স সমান তাই আমরা ম্যাপিং করতে পারছি
    const bnVal = db.classes["bn"][index];
    clsSel.innerHTML += `<option value="${bnVal}" ${activeClass === bnVal ? "selected" : ""}>${c}</option>`;
  });

  const mList = document.getElementById("methods-list");
  if (mList) {
    // কোন কোন চেক করা আছে তা মনে রাখা
    const checkedMethods = Array.from(
      document.querySelectorAll(".meth-check:checked"),
    ).map((m) => m.value);
    mList.innerHTML = "";
    db.methods[currentLang].forEach((m, index) => {
      const bnVal = db.methods["bn"][index];
      const isChecked = checkedMethods.includes(bnVal);
      mList.innerHTML += `<label><input type="checkbox" class="meth-check" value="${bnVal}" ${isChecked ? "checked" : ""} onchange="updatePreview()"> ${m}</label>`;
    });
  }
}

// ==========================================
// [৪] পেজ ইনিশিয়ালাইজেশন এবং লোড (Initialization & Page Load)
// ==========================================
window.onload = () => {
  // ভাষা ডিকশনারি অনুযায়ী সম্পূর্ণ UI লোড করা
  translateUI();

  // ব্লুমস ট্যাক্সোনমি চেকবক্স তালিকা লোড করা
  const bList = document.getElementById("bloom-options");
  if (bList) {
    bList.innerHTML = "";
    db.blooms.forEach(
      (b) =>
        (bList.innerHTML += `<label><input type="checkbox" class="bloom-check" value="${b}"> ${b}</label>`),
    );
  }

  checkLibraryCount();
};

// ==========================================
// [৫] ইন্টারফেস সেকশন কন্ট্রোল (Section Navigation Controls)
// ==========================================
function showSection(section) {
  const mainBuilder = document.getElementById("mainBuilder");
  const librarySection = document.getElementById("librarySection");
  const navItems = document.querySelectorAll(".nav-menu .nav-item");

  mainBuilder.style.display = "none";
  librarySection.style.display = "none";

  navItems.forEach((item) => item.classList.remove("active"));

  if (section === "builder") {
    mainBuilder.style.display = "flex";
    navItems[0].classList.add("active");
  } else if (section === "library") {
    librarySection.style.display = "block";
    navItems[2].classList.add("active");
    renderLibrary();
  }
}

// ==========================================
// [৬] ভাষা পরিবর্তন লজিক (Language Toggle Feature)
// ==========================================
function toggleLanguage() {
  currentLang = currentLang === "bn" ? "en" : "bn";

  // বাটনের টেক্সট আপডেট
  const btn = document.getElementById("langToggleBtn");
  btn.querySelector("span").innerText =
    currentLang === "bn" ? "English" : "বাংলা";

  // সম্পূর্ণ UI উপাদান অনুবাদ
  translateUI();

  // প্রিভিউ রেন্ডার ও আপডেট
  updatePreview();

  // এআই জেনারেটেড কন্টেন্ট থাকলে পুনরায় জেনারেট করা
  const objective = document.getElementById("lessonObjective").value.trim();
  if (objective) {
    generateAI();
  }
}

// ==========================================
// [৭] ডাইনামিক ফিল্ড পপুলেশন (Academic Fields Population)
// ==========================================

function handleClassChange() {
  const cls = document.getElementById("class").value; // এটি সর্বদা বাংলা ভ্যালু (যেমন 'নবম') রিটার্ন করে
  const groupDiv = document.getElementById("group-wrapper");
  const groupVal = document.getElementById("group").value;

  if (!cls) {
    populateSubjects([]);
    return;
  }

  // নবম-দ্বাদশ চেক (বাংলা ভ্যালুর ওপর ভিত্তি করে)
  if (["নবম", "দশম", "একাদশ", "দ্বাদশ"].includes(cls)) {
    groupDiv.style.display = "block";
    const subDb = currentLang === "bn" ? db.subjects_bn : db.subjects_en;
    let list = [...subDb["Compulsory"]];
    if (groupVal !== "General") {
      list = list.concat(subDb[groupVal] || []);
    }
    populateSubjects(list);
  } else {
    groupDiv.style.display = "none";
    const subDb = currentLang === "bn" ? db.subjects_bn : db.subjects_en;
    // ইনডেক্স অনুযায়ী ক্লাস ম্যাচ করা
    const classIdx = db.classes["bn"].indexOf(cls);
    const enClsName = db.classes["en"][classIdx];
    populateSubjects(subDb[cls] || subDb[enClsName] || subDb["ষষ্ঠ"]);
  }

  updatePreview();
}

function populateSubjects(list) {
  const subSel = document.getElementById("subject");
  const selectLabel = currentLang === "bn" ? "বিষয় নির্বাচন" : "Select Subject";
  subSel.innerHTML = `<option value="">${selectLabel}</option>`;
  list.forEach(
    (s) => (subSel.innerHTML += `<option value="${s}">${s}</option>`),
  );

  const chLabel =
    currentLang === "bn" ? "অধ্যায় নির্বাচন করুন..." : "Select Chapter...";
  const tpLabel =
    currentLang === "bn" ? "পাঠ নির্বাচন করুন..." : "Select Topic...";
  document.getElementById("chapter-list").innerHTML = chLabel;
  document.getElementById("topic-list").innerHTML = tpLabel;
  document.getElementById("bookName").value = "";
}

function loadChapters() {
  const sub = document.getElementById("subject").value;
  const chapBox = document.getElementById("chapter-list");

  const chLabel =
    currentLang === "bn" ? "অধ্যায় নির্বাচন করুন..." : "Select Chapter...";
  const tpLabel =
    currentLang === "bn" ? "পাঠ নির্বাচন করুন..." : "Select Topic...";

  if (!sub) {
    chapBox.innerHTML = chLabel;
    document.getElementById("topic-list").innerHTML = tpLabel;
    document.getElementById("bookName").value = "";
    updatePreview();
    return;
  }

  document.getElementById("bookName").value = sub + " (NCTB)";

  // বিষয় অনুযায়ী অধ্যায় খোঁজা
  const chaptersDb = currentLang === "bn" ? db.chapters_bn : db.chapters_en;
  const matchedChapters = chaptersDb[sub] || [
    currentLang === "bn"
      ? `অধ্যায় ১: ${sub} এর প্রাথমিক ধারণা`
      : `Chapter 1: Introduction to ${sub}`,
    currentLang === "bn"
      ? `অধ্যায় ২: ${sub} এর বাস্তব প্রয়োগ`
      : `Chapter 2: Practical Application of ${sub}`,
    currentLang === "bn"
      ? `অধ্যায় ৩: ${sub} এর গাণিতিক/তাত্ত্বিক বিশ্লেষণ`
      : `Chapter 3: Theoretical Analysis of ${sub}`,
  ];

  chapBox.innerHTML = matchedChapters
    .map((ch) => {
      return `<label class="block mb-1">
      <input type="radio" name="chapter-select" class="chap-select" value="${ch}" onchange="loadTopics('${ch}')"> ${ch}
    </label>`;
    })
    .join("");

  document.getElementById("topic-list").innerHTML =
    currentLang === "bn"
      ? "অধ্যায় নির্বাচন করুন..."
      : "Select Chapter first...";
  updatePreview();
}

function loadTopics(chapName) {
  const topicBox = document.getElementById("topic-list");

  const topicsDb = currentLang === "bn" ? db.topics_bn : db.topics_en;
  const matchedTopics = topicsDb[chapName] || [
    currentLang === "bn"
      ? `টপিক ১: ${chapName} এর মূল বিষয়বস্তু`
      : `Topic 1: Core Concepts of ${chapName}`,
    currentLang === "bn"
      ? `টপিক ২: পাঠের সহজ ব্যাখ্যা ও উদাহরণ`
      : `Topic 2: Easy Explanation & Examples`,
    currentLang === "bn"
      ? `টপিক ৩: পাঠ ও মূল্যায়ন প্রশ্নোত্তর`
      : `Topic 3: Discussion and Assessment Q/A`,
  ];

  topicBox.innerHTML = matchedTopics
    .map((tp) => {
      return `<label class="block mb-1">
      <input type="checkbox" class="topic-check" value="${tp}" onchange="updatePreview()"> ${tp}
    </label>`;
    })
    .join("");

  updatePreview();
}

// ==========================================
// [৮] এআই সিমুলেশন এবং জেনারেটর (AI Generation Logic)
// ==========================================
function generateAI() {
  const schName = document.getElementById("schName").value.trim();
  const cls = document.getElementById("class").value;
  const sub = document.getElementById("subject").value;

  if (!schName || !cls || !sub) {
    alert(
      currentLang === "bn"
        ? "অনুগ্রহ করে প্রতিষ্ঠানের নাম, শ্রেণি এবং বিষয় সিলেক্ট করুন!"
        : "Please select School Name, Class and Subject!",
    );
    return;
  }

  // রোল নম্বর সংগ্রহ (সব ডিজিট ক্লিঞ্জিং)
  const cleanRolls = (id) =>
    document
      .getElementById(id)
      .value.split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((r) => toEnglishDigits(r)); // ইন্টারনালি ইংরেজিতে রেখে পরে প্রসেস করব

  const vGood = cleanRolls("roll-vgood");
  const avg = cleanRolls("roll-avg");
  const low = cleanRolls("roll-low");

  if (vGood.length === 0 && avg.length === 0 && low.length === 0) {
    alert(
      currentLang === "bn"
        ? "অনুগ্রহ করে অন্তত ১টি রোল নম্বর ইনপুট দিন!"
        : "Please input at least 1 roll number!",
    );
    return;
  }

  // ১. শিক্ষার্থী গ্রুপিং এবং টীম লিডার সিলেকশন
  let allStudents = [];
  vGood.forEach((r) => allStudents.push({ roll: r, isHigh: true }));
  avg.forEach((r) => allStudents.push({ roll: r, isHigh: false }));
  low.forEach((r) => allStudents.push({ roll: r, isHigh: false }));

  // দল সংখ্যা নির্ধারণ
  let groupCount = Math.ceil(allStudents.length / 5);
  if (groupCount < 1) groupCount = 1;
  let groups = Array.from({ length: groupCount }, () => []);

  // রাউন্ড রবিন বন্টন
  allStudents.forEach((student, index) => {
    groups[index % groupCount].push(student);
  });

  // গ্রুপ কার্ড রেন্ডারিং ও টীম লিড লজিক
  let gHtml =
    currentLang === "bn"
      ? "<h4>👥 শিক্ষার্থী গ্রুপিং (টীম লিডার ও সদস্য তালিকা):</h4><div class='group-grid'>"
      : "<h4>👥 Student Grouping (Team Leader & Members):</h4><div class='group-grid'>";

  groups.forEach((g, i) => {
    // এই গ্রুপের উচ্চ স্তরের প্রথম শিক্ষার্থীকে টীম লিড করা
    let leadStudent = g.find((s) => s.isHigh);
    if (!leadStudent && g.length > 0) {
      leadStudent = g[0];
    }

    // বাকি সব টীম মেম্বার
    let members = g
      .filter((s) => s.roll !== leadStudent.roll)
      .map((s) => formatDigits(s.roll));
    let leadRollFormatted = formatDigits(leadStudent.roll);

    let leadLabel = currentLang === "bn" ? "টীম লিড" : "Team Lead";
    let memberLabel = currentLang === "bn" ? "টীম মেম্বার" : "Team Member";

    let leadStr = `${leadRollFormatted}-${leadLabel}`;
    // মেম্বারদের রোল কমা দিয়ে জুড়বো এবং শেষে টীম মেম্বার লেবেল বসাবো
    let memberStr =
      members.length > 0 ? `${members.join(", ")}-${memberLabel}` : "";

    let combinedStr = memberStr ? `${leadStr}, ${memberStr}` : leadStr;

    gHtml += `<div class='group-card'><strong>${currentLang === "bn" ? "দল" : "Team"} ${formatDigits(i + 1)}:</strong> (${combinedStr})</div>`;
  });
  document.getElementById("v-group-section").innerHTML = gHtml + "</div>";

  // ২. সিলেক্টেড টপিক
  const selectedTopics = Array.from(
    document.querySelectorAll(".topic-check:checked"),
  ).map((t) => t.value);
  const lessonName =
    selectedTopics.join(", ") ||
    (currentLang === "bn"
      ? "বাস্তব ভিত্তিক শিখন অনুশীলন"
      : "Practical Learning Session");

  // ৩. উদ্দেশ্য ও শিখনফল
  const objText =
    document.getElementById("lessonObjective").value.trim() || `${lessonName}`;

  if (currentLang === "bn") {
    document.getElementById("v-outcomes").innerHTML = `
      <li>শিক্ষার্থীরা ${objText} সম্পর্কে স্পষ্ট ধারণা লাভ করবে।</li>
      <li>দৈনন্দিন জীবনে ${lessonName} এর বিভিন্ন ব্যবহার বিশ্লেষণ করতে পারবে।</li>
      <li>অর্জিত জ্ঞান ব্যবহার করে বাস্তবমুখী সৃজনশীল কাজ করতে পারবে।</li>
      <li>দলগত কাজের মাধ্যমে পারস্পরিক সহযোগিতা ও নেতৃত্বদানের মনোভাব বিকশিত হবে।</li>
    `;
  } else {
    document.getElementById("v-outcomes").innerHTML = `
      <li>Students will gain a clear concept about: ${objText}.</li>
      <li>Students will be able to analyze practical usages of: ${lessonName}.</li>
      <li>Students can apply their knowledge to solve real-world creative problems.</li>
      <li>Teamwork will enhance student collaboration and leadership capabilities.</li>
    `;
  }

  // ৪. ব্লুমস ট্যাক্সোনমি
  const selectedBlooms = Array.from(
    document.querySelectorAll(".bloom-check:checked"),
  ).map((cb) => cb.value);
  const badgeRow = document.getElementById("v-bloom-badges");
  badgeRow.innerHTML = "";
  if (selectedBlooms.length > 0) {
    selectedBlooms.forEach(
      (b) => (badgeRow.innerHTML += `<span class="bloom-badge">${b}</span>`),
    );
  } else {
    badgeRow.innerHTML = `<span class="bloom-badge" style="background:#64748b">${currentLang === "bn" ? "তত্ত্বীয় জ্ঞান" : "Theoretical"}</span>`;
  }
  document.getElementById("v-bloom-desc").innerText =
    currentLang === "bn"
      ? `বিশ্লেষণ: শিক্ষার্থীরা এই পাঠের মাধ্যমে তাত্ত্বিক বিষয়ের প্রায়োগিক স্তরসমূহ সম্পন্ন করবে।`
      : `Analysis: Students will process cognitive dimensions through active participation.`;

  // ৫. টাইমটেবিল রেন্ডার
  const dur = parseInt(document.getElementById("duration").value) || 45;
  const methods = Array.from(
    document.querySelectorAll(".meth-check:checked"),
  ).map((m) => m.value);

  // শিখন পদ্ধতি তালিকা ভাষা অনুযায়ী রেন্ডার
  let selectedMethodVals = [];
  document.querySelectorAll(".meth-check:checked").forEach((cb) => {
    // UI-তে বর্তমানে দেখানো লেখার ইন্ডেক্স খুঁজে সেই ভাষার মান নেওয়া
    const bnIdx = db.methods["bn"].indexOf(cb.value);
    selectedMethodVals.push(db.methods[currentLang][bnIdx]);
  });
  const methodStr =
    selectedMethodVals.join(", ") ||
    (currentLang === "bn" ? "আলোচনা" : "Discussion");

  if (currentLang === "bn") {
    document.getElementById("v-table").innerHTML = `
      <tr>
        <td>${toBanglaDigits(Math.floor(dur * 0.15))} মি.</td>
        <td>শুভেচ্ছা বিনিময়, পূর্বজ্ঞান যাচাই এবং পাঠ ঘোষণা (পদ্ধতি: প্রশ্নোত্তর)</td>
        <td>শিক্ষকের দিকনির্দেশনা শোনা এবং উত্তর দেওয়া।</td>
      </tr>
      <tr>
        <td>${toBanglaDigits(Math.floor(dur * 0.65))} মি.</td>
        <td>মূল পাঠ আলোচনা, প্রজেক্ট প্রদর্শন ও দলগত কাজ পরিচালনা (পদ্ধতি: ${methodStr})</td>
        <td>সক্রিয়ভাবে অংশগ্রহণ, গ্রুপ ডিসকাশন ও নির্ধারিত কাজ সমাধান করা।</td>
      </tr>
      <tr>
        <td>${toBanglaDigits(Math.floor(dur * 0.2))} মি.</td>
        <td>সারসংক্ষেপ উপস্থাপন, ফিডব্যাক এবং বাড়ির কাজ প্রদান</td>
        <td>আজকের ক্লাসের অভিজ্ঞতা শেয়ার করা এবং বাড়ির কাজ লিখে নেওয়া।</td>
      </tr>
    `;
  } else {
    document.getElementById("v-table").innerHTML = `
      <tr>
        <td>${Math.floor(dur * 0.15)} min.</td>
        <td>Greetings, checking baseline knowledge & introducing lesson (Q/A)</td>
        <td>Paying attention and answering teacher's conceptual queries.</td>
      </tr>
      <tr>
        <td>${Math.floor(dur * 0.65)} min.</td>
        <td>Main lesson discussion, practical demonstration & team tasks (${methodStr})</td>
        <td>Actively participating, team collaboration & solving worksheets.</td>
      </tr>
      <tr>
        <td>${Math.floor(dur * 0.2)} min.</td>
        <td>Summarization, feedback collection and homework assignment</td>
        <td>Sharing learning experiences and noting down homework details.</td>
      </tr>
    `;
  }

  // ৬. বাড়ির কাজ
  document.getElementById("v-homework").innerText =
    currentLang === "bn"
      ? `${lessonName} এর ওপর ভিত্তি করে একটি সৃজনশীল কেইস-স্টাডি বা প্রশ্ন উত্তরসহ খাতায় লিখে নিয়ে আসবে।`
      : `Prepare a creative essay or write down 5 key questions and answers on ${lessonName}.`;

  updatePreview();
  alert(
    currentLang === "bn"
      ? "স্মার্ট লেসন প্ল্যান সফলভাবে জেনারেট হয়েছে!"
      : "Smart Lesson Plan successfully generated!",
  );
}

// ==========================================
// [৯] রিয়েল-টাইম প্রিভিউ আপডেট (Real-Time Preview Updates)
// ==========================================
function updatePreview() {
  const labels = {
    bn: {
      schName: "প্রতিষ্ঠানের নাম",
      schAddr: "ঠিকানা এখানে আসবে",
      class: "শ্রেণি:",
      subject: "বিষয়:",
      time: "সময়:",
      code: "কোড:",
      est: "প্রতিষ্ঠাকাল:",
      title: "পাঠের শিরোনাম:",
      objective: "🎯 উদ্দেশ্য ও শিখনফল (AI Generated):",
      bloom: "🧠 AI Bloom's Taxonomy Analysis:",
      homework: "🏠 বাড়ির কাজ (AI):",
      footer: "স্মার্ট শিক্ষা বাতায়ন | AI জেনারেটেড লেসন প্ল্যান",
      timeLabel: "মিনিট",
      timeTable: ["সময়", "শিক্ষকের কাজ", "শিক্ষার্থীর কাজ"],
    },
    en: {
      schName: "Institution Name",
      schAddr: "Address will appear here",
      class: "Class:",
      subject: "Subject:",
      time: "Time:",
      code: "Code:",
      est: "Established:",
      title: "Lesson Title:",
      objective: "🎯 Objectives & Outcomes (AI Generated):",
      bloom: "🧠 AI Bloom's Taxonomy Analysis:",
      homework: "🏠 Homework (AI):",
      footer: "Smart Education Portal | AI Generated Lesson Plan",
      timeLabel: "minutes",
      timeTable: ["Time", "Teacher's Activity", "Student's Activity"],
    },
  }[currentLang];

  document.getElementById("v-schName").innerText =
    document.getElementById("schName").value.trim() || labels.schName;
  document.getElementById("v-schAddr").innerText =
    document.getElementById("schAddr").value.trim() || labels.schAddr;

  const codeVal = document.getElementById("schCode").value.trim();
  const estVal = document.getElementById("schYear").value.trim();
  const durVal = document.getElementById("duration").value || 45;

  document.getElementById("v-schCode").innerText = codeVal
    ? formatDigits(codeVal)
    : "-";
  document.getElementById("v-schYear").innerText = estVal
    ? formatDigits(estVal)
    : "-";

  // শ্রেণি নামও ইংরেজি সংস্করণে করা
  let classVal = document.getElementById("class").value;
  if (classVal && currentLang === "en") {
    const bnIdx = db.classes["bn"].indexOf(classVal);
    if (bnIdx !== -1) classVal = db.classes["en"][bnIdx];
  } else if (!classVal) {
    classVal = "-";
  } else {
    classVal = classVal + " শ্রেণি";
  }

  const subVal = document.getElementById("subject").value;

  document.getElementById("v-class").parentNode.innerHTML =
    `<span>${labels.class} <b id="v-class">${classVal}</b></span>`;
  document.getElementById("v-sub").parentNode.innerHTML =
    `<span>${labels.subject} <b id="v-sub">${subVal || "-"}</b></span>`;
  document.getElementById("v-time").parentNode.innerHTML =
    `<span>${labels.time} <b id="v-time">${formatDigits(durVal)} ${labels.timeLabel}</b></span>`;

  const extraDiv = document.querySelector(".sch-extra");
  extraDiv.innerHTML = `${labels.code} <span id="v-schCode">${codeVal ? formatDigits(codeVal) : "-"}</span> | ${labels.est} <span id="v-schYear">${estVal ? formatDigits(estVal) : "-"}</span>`;

  const selectedTopics = Array.from(
    document.querySelectorAll(".topic-check:checked"),
  ).map((t) => t.value);
  document.getElementById("v-title").parentNode.innerHTML =
    `${labels.title} <span id="v-title">${selectedTopics.join(", ") || (currentLang === "bn" ? "নির্বাচিত পাঠ" : "Selected Lesson")}</span>`;

  document.querySelector(".ai-content-box .ai-label").innerText =
    labels.objective;
  document.querySelector(".ai-content-box.bg-light-blue .ai-label").innerText =
    labels.bloom;

  const hwBox = document.querySelector(".homework-box strong");
  if (hwBox) hwBox.innerText = labels.homework;
  document.querySelector(".doc-footer").innerText = labels.footer;
}

// ==========================================
// [১০] ড্রপডাউন এবং এক্সপোর্ট কন্ট্রোল (Dropdown & Exports Controls)
// ==========================================
function toggleExportMenu() {
  document.getElementById("exportMenu").classList.toggle("show");
}

window.addEventListener("click", function (e) {
  if (!e.target.closest(".dropdown-wrapper")) {
    const menu = document.getElementById("exportMenu");
    if (menu) menu.classList.remove("show");
  }
});

function handleSave() {
  const printableArea = document
    .getElementById("printableArea")
    .cloneNode(true);

  const content = `
    <table style="width: 100%; border: none; font-family: 'Hind Siliguri', sans-serif;">
      <tr><td style="text-align: center;">${printableArea.querySelector(".doc-header").innerHTML}</td></tr>
      <tr><td style="padding: 20px 0;">${printableArea.querySelector(".doc-body").innerHTML}</td></tr>
    </table>
  `;

  const styledContent = content
    .replace(
      /class="meta-row"/g,
      'style="display: table; width: 100%; margin: 15px 0; background-color: #f1f5f9; padding: 12px; border-radius: 6px;"',
    )
    .replace(
      /<table class="preview-table"/g,
      '<table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #333;"',
    )
    .replace(
      /<th/g,
      '<th style="border: 1px solid #333; padding: 10px; background-color: #f2f2f2; text-align: left;"',
    )
    .replace(/<td/g, '<td style="border: 1px solid #333; padding: 10px;"')
    .replace(
      /class="bloom-badge"/g,
      'style="background: #10b981; color: white; padding: 3px 10px; border-radius: 4px; font-size: 11px; margin-right: 5px;"',
    )
    .replace(
      /class="ai-content-box"/g,
      'style="margin-top: 15px; padding: 15px; border-left: 4px solid #4f46e5; background-color: #f5f7ff; border-radius: 4px;"',
    )
    .replace(
      /class="homework-box"/g,
      'style="margin-top: 20px; padding: 15px; background-color: #fffbeb; border: 1px dashed #d97706; border-radius: 6px;"',
    );

  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Lesson Plan</title></head>
    <body>`;
  const footer = "</body></html>";

  const sourceHTML = header + styledContent + footer;

  const blob = new Blob(["\ufeff", sourceHTML], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LessonPlan_${document.getElementById("v-sub").innerText || "Plan"}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  const menu = document.getElementById("exportMenu");
  if (menu) menu.classList.remove("show");
}

// ==========================================
// [১১] লোকাল স্টোরেজ লাইব্রেরি এবং ড্রাফট সেভ (Draft & Library Logic)
// ==========================================

function saveDraft() {
  const planId = Date.now().toString();
  const planData = {
    id: planId,
    lang: currentLang,
    date: new Date().toLocaleDateString(
      currentLang === "bn" ? "bn-BD" : "en-US",
      { year: "numeric", month: "long", day: "numeric" },
    ),
    schName:
      document.getElementById("schName").value.trim() || "নামহীন প্রতিষ্ঠান",
    schAddr: document.getElementById("schAddr").value.trim(),
    schCode: document.getElementById("schCode").value.trim(),
    schYear: document.getElementById("schYear").value.trim(),
    board: document.getElementById("board").value,
    class: document.getElementById("class").value,
    group: document.getElementById("group").value,
    subject: document.getElementById("subject").value,
    bookName: document.getElementById("bookName").value,
    duration: document.getElementById("duration").value,
    lessonObjective: document.getElementById("lessonObjective").value,

    methods: Array.from(document.querySelectorAll(".meth-check:checked")).map(
      (m) => m.value,
    ),
    blooms: Array.from(document.querySelectorAll(".bloom-check:checked")).map(
      (b) => b.value,
    ),

    outcomesHtml: document.getElementById("v-outcomes").innerHTML,
    groupHtml: document.getElementById("v-group-section").innerHTML,
    tableHtml: document.getElementById("v-table").innerHTML,
    homework: document.getElementById("v-homework").innerText,
  };

  if (!planData.subject) {
    alert(
      currentLang === "bn"
        ? "ড্রাফট সংরক্ষণ করার আগে অন্তত বিষয় ও লেসন প্ল্যান জেনারেট করুন!"
        : "Please select Subject and generate lesson plan before saving draft!",
    );
    return;
  }

  let savedLessons = JSON.parse(localStorage.getItem("sashiba_lessons")) || [];
  savedLessons.push(planData);
  localStorage.setItem("sashiba_lessons", JSON.stringify(savedLessons));

  checkLibraryCount();
  alert(
    currentLang === "bn"
      ? "লেসন প্ল্যানটি ড্রাফট হিসেবে সংরক্ষণ করা হয়েছে!"
      : "Lesson plan has been saved as draft!",
  );

  const menu = document.getElementById("exportMenu");
  if (menu) menu.classList.remove("show");
}

function checkLibraryCount() {
  const savedLessons =
    JSON.parse(localStorage.getItem("sashiba_lessons")) || [];
  const countBadge = document.querySelector(
    ".nav-item i.fa-clock-rotate-left",
  ).parentElement;

  let badge = countBadge.querySelector(".badge-count");
  if (savedLessons.length > 0) {
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "badge-count";
      badge.style =
        "background: #f43f5e; color: white; border-radius: 50%; padding: 1px 6px; font-size: 11px; margin-left: auto;";
      countBadge.appendChild(badge);
    }
    badge.innerText = formatDigits(savedLessons.length);
  } else if (badge) {
    badge.remove();
  }
}

function renderLibrary() {
  const grid = document.getElementById("libraryGrid");
  const savedLessons =
    JSON.parse(localStorage.getItem("sashiba_lessons")) || [];

  if (savedLessons.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #64748b;">
        <i class="fa-solid fa-folder-open" style="font-size: 48px; margin-bottom: 15px; color: #cbd5e1;"></i>
        <p style="font-size: 16px;">এখনো কোনো লেসন প্ল্যান সংরক্ষণ করা হয়নি।</p>
        <button class="btn btn-primary" onclick="showSection('builder')" style="margin: 15px auto 0;">লেসন তৈরি করুন</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = savedLessons
    .map((plan) => {
      return `
      <div class="library-card">
        <div class="card-meta">
          <span class="tag-class">${plan.class || "N/A"} শ্রেণি</span>
          <span class="tag-date">${plan.date}</span>
        </div>
        <h3 class="card-subject">${plan.subject || "নামহীন বিষয়"}</h3>
        <p class="card-school">${plan.schName}</p>
        <p class="card-objective">${plan.lessonObjective ? plan.lessonObjective.substring(0, 70) + "..." : "কোনো নির্দিষ্ট উদ্দেশ্য নেই।"}</p>
        <div class="card-actions">
          <button class="btn btn-outline btn-sm" onclick="loadDraft('${plan.id}')">
            <i class="fa-solid fa-folder-open"></i> লোড
          </button>
          <button class="btn btn-outline btn-sm" onclick="exportDraftToWord('${plan.id}')">
            <i class="fa-solid fa-cloud-arrow-down"></i> এক্সপোর্ট
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteDraft('${plan.id}')" style="background:#ef4444; color:white; border:none; padding: 6px 12px; border-radius: 6px; cursor:pointer;">
            <i class="fa-solid fa-trash-can"></i> ডিলিট
          </button>
        </div>
      </div>
    `;
    })
    .join("");
}

function loadDraft(id) {
  const savedLessons =
    JSON.parse(localStorage.getItem("sashiba_lessons")) || [];
  const plan = savedLessons.find((p) => p.id === id);

  if (!plan) return alert("লেসন প্ল্যানটি পাওয়া যায়নি!");

  currentLang = plan.lang || "bn";
  const btn = document.getElementById("langToggleBtn");
  btn.querySelector("span").innerText =
    currentLang === "bn" ? "English" : "বাংলা";

  document.getElementById("schName").value = plan.schName || "";
  document.getElementById("schAddr").value = plan.schAddr || "";
  document.getElementById("schCode").value = plan.schCode || "";
  document.getElementById("schYear").value = plan.schYear || "";
  document.getElementById("board").value = plan.board || "NCTB";
  document.getElementById("class").value = plan.class || "";

  handleClassChange();
  document.getElementById("group").value = plan.group || "General";
  document.getElementById("subject").value = plan.subject || "";

  loadChapters();

  document.getElementById("bookName").value = plan.bookName || "";
  document.getElementById("duration").value = plan.duration || 45;
  document.getElementById("lessonObjective").value = plan.lessonObjective || "";

  document.querySelectorAll(".meth-check").forEach((cb) => {
    cb.checked = plan.methods && plan.methods.includes(cb.value);
  });
  document.querySelectorAll(".bloom-check").forEach((cb) => {
    cb.checked = plan.blooms && plan.blooms.includes(cb.value);
  });

  document.getElementById("v-outcomes").innerHTML = plan.outcomesHtml || "";
  document.getElementById("v-group-section").innerHTML = plan.groupHtml || "";
  document.getElementById("v-table").innerHTML = plan.tableHtml || "";
  document.getElementById("v-homework").innerText = plan.homework || "";

  updatePreview();
  showSection("builder");
  alert(
    currentLang === "bn"
      ? "সংরক্ষিত লেসন প্ল্যানটি সফলভাবে লোড হয়েছে!"
      : "Saved lesson plan successfully loaded!",
  );
}

function exportDraftToWord(id) {
  const savedLessons =
    JSON.parse(localStorage.getItem("sashiba_lessons")) || [];
  const plan = savedLessons.find((p) => p.id === id);
  if (!plan) return;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = `
    <div class="doc-header">
      <h1>${plan.schName}</h1>
      <p>${plan.schAddr || ""}</p>
      <div>কোড: ${plan.schCode || "-"} | প্রতিষ্ঠাকাল: ${plan.schYear || "-"}</div>
      <div style="margin-top:15px; display:table; width:100%;">
        <span>শ্রেণি: <b>${plan.class || "-"}</b></span> | 
        <span>বিষয়: <b>${plan.subject || "-"}</b></span> | 
        <span>সময়: <b>${plan.duration || 45} মিনিট</b></span>
      </div>
    </div>
    <div class="doc-body">
      <div style="margin-top:15px; padding:15px; border-left:4px solid #4f46e5; background:#f5f7ff;">
        <strong>🎯 উদ্দেশ্য ও শিখনফল:</strong>
        <ul>${plan.outcomesHtml}</ul>
      </div>
      <div style="margin-top:15px;">
        ${plan.groupHtml}
      </div>
      <table style="width:100%; border-collapse:collapse; margin-top:20px; border:1px solid #333;">
        <thead>
          <tr style="background:#f2f2f2;">
            <th style="border:1px solid #333; padding:10px;">সময়</th>
            <th style="border:1px solid #333; padding:10px;">শিক্ষকের কাজ</th>
            <th style="border:1px solid #333; padding:10px;">শিক্ষার্থীর কাজ</th>
          </tr>
        </thead>
        <tbody>
          ${plan.tableHtml}
        </tbody>
      </table>
      <div style="margin-top:20px; padding:15px; background:#fffbeb; border:1px dashed #d97706;">
        <strong>🏠 বাড়ির কাজ (AI):</strong> ${plan.homework}
      </div>
    </div>
  `;

  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'></head>
    <body>`;
  const footer = "</body></html>";

  const sourceHTML = header + tempDiv.innerHTML + footer;
  const blob = new Blob(["\ufeff", sourceHTML], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LessonPlan_${plan.subject}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function deleteDraft(id) {
  if (
    !confirm(
      currentLang === "bn"
        ? "আপনি কি নিশ্চিতভাবে এই লেসন প্ল্যানটি মুছে ফেলতে চান?"
        : "Are you sure you want to delete this lesson plan?",
    )
  )
    return;

  let savedLessons = JSON.parse(localStorage.getItem("sashiba_lessons")) || [];
  savedLessons = savedLessons.filter((p) => p.id !== id);
  localStorage.setItem("sashiba_lessons", JSON.stringify(savedLessons));

  checkLibraryCount();
  renderLibrary();
}

// ==========================================
// [১৮] প্রেজেন্টেশন ড্যাশবোর্ডে ডেটা পাঠানো (Send to Presentation Dashboard)
// ==========================================
function sendToPresentation(planId) {
  let planToTransfer = null;
  if (planId) {
    const savedLessons = JSON.parse(localStorage.getItem("sashiba_lessons")) || [];
    planToTransfer = savedLessons.find((p) => p.id === planId);
  } else {
    // বর্তমান ফর্ম ইনপুটসমূহ
    const schName = document.getElementById("schName")?.value || "";
    const schAddr = document.getElementById("schAddr")?.value || "";
    const schCode = document.getElementById("schCode")?.value || "";
    const schYear = document.getElementById("schYear")?.value || "";
    const board = document.getElementById("board")?.value || "";
    const className = document.getElementById("class")?.value || "";
    const groupName = document.getElementById("group")?.value || "";
    const subject = document.getElementById("subject")?.value || "";
    const bookName = document.getElementById("bookName")?.value || "";
    const duration = document.getElementById("duration")?.value || "45";
    const objective = document.getElementById("lessonObjective")?.value || "";

    const selectedChapter =
      document
        .querySelector('input[name="ch"]:checked')
        ?.parentElement?.textContent?.trim() || "";
    const selectedTopics = Array.from(
      document.querySelectorAll('#topic-list input[type="checkbox"]:checked'),
    ).map((cb) => cb.parentElement.textContent.trim());
    const selectedMethods = Array.from(
      document.querySelectorAll('#methods-list input[type="checkbox"]:checked'),
    ).map((cb) => cb.parentElement.textContent.trim());
    const selectedBlooms = Array.from(
      document.querySelectorAll('#bloom-options input[type="checkbox"]:checked'),
    ).map((cb) => cb.value);

    const rollVGood = document.getElementById("roll-vgood")?.value || "";
    const rollAvg = document.getElementById("roll-avg")?.value || "";
    const rollLow = document.getElementById("roll-low")?.value || "";

    // শিখনফল ও টাইমটেবিল
    const outcomesNodes = document.querySelectorAll("#v-outcomes li");
    const outcomes = Array.from(outcomesNodes).map((li) =>
      li.textContent.trim(),
    );

    const tableRows = document.querySelectorAll("#v-table tr");
    const tableData = Array.from(tableRows)
      .map((tr) => {
        const tds = tr.querySelectorAll("td");
        if (tds.length === 3) {
          return {
            time: tds[0].textContent.trim(),
            teacher: tds[1].textContent.trim(),
            student: tds[2].textContent.trim(),
          };
        }
        return null;
      })
      .filter(Boolean);

    const homework = document.getElementById("v-homework")?.textContent || "";

    planToTransfer = {
      id: "transfer_" + Date.now(),
      date: new Date().toLocaleDateString(
        currentLang === "bn" ? "bn-BD" : "en-US",
      ),
      schName,
      schAddr,
      schCode,
      schYear,
      board,
      className,
      groupName,
      subject,
      bookName,
      duration,
      objective,
      chapter: selectedChapter,
      topics: selectedTopics,
      methods: selectedMethods,
      blooms: selectedBlooms,
      grouping: { vgood: rollVGood, avg: rollAvg, low: rollLow },
      outcomes,
      tableData,
      homework,
    };
  }

  if (planToTransfer) {
    localStorage.setItem(
      "sashiba_active_transfer_lesson",
      JSON.stringify(planToTransfer),
    );
    let savedLessons =
      JSON.parse(localStorage.getItem("sashiba_lessons")) || [];
    if (!savedLessons.some((p) => p.id === planToTransfer.id)) {
      savedLessons.unshift(planToTransfer);
      localStorage.setItem("sashiba_lessons", JSON.stringify(savedLessons));
    }
  }

  // প্রেজেন্টেশন ড্যাশবোর্ডে স্থানান্তর
  window.location.href = "../index.html?autoImport=true";
}

