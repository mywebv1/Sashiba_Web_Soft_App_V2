// ==========================================
// STATE MANAGEMENT & DATABASES
// ==========================================
let currentLanguage = "BN"; // Default language is Bangla
let currentTheme = "dark"; // Default theme is Dark

// Active Academic State Variables
let currentLevel = "১ম শ্রেণি";
let currentSubject = "ইংরেজি";
let currentChapter = "১ম অধ্যায়";

// Word Meaning state index
let currentWordIndex = 0;

// Dynamic Dictionary Mock Data
const schoolWords = [
  { word: "Apple", meaning: "আপেল", completed: true },
  { word: "Boy", meaning: "ছেলে", completed: true },
  { word: "Girl", meaning: "মেয়ে", completed: false },
  { word: "Book", meaning: "বই", completed: true },
  { word: "Teacher", meaning: "শিক্ষক", completed: false },
  { word: "School", meaning: "বিদ্যালয়", completed: true },
  { word: "Student", meaning: "ছাত্র", completed: false },
  { word: "Pen", meaning: "কলম", completed: true },
  { word: "Paper", meaning: "কাগজ", completed: false },
  { word: "Water", meaning: "পানি", completed: false },
];

let filteredWords = [...schoolWords];
let wordCurrentPage = 1;
const wordsPerPage = 5;

// Dynamic MCQ Mock Database
const schoolMCQs = [
  {
    id: 1,
    question: "Apple এর সঠিক বাংলা অর্থ কোনটি?",
    options: ["আম", "আপেল", "কলা", "লিচু"],
    answer: 1,
    userAnswer: null,
  },
  {
    id: 2,
    question: "Boy অর্থ কী?",
    options: ["ছেলে", "মেয়ে", "বই", "কলম"],
    answer: 0,
    userAnswer: null,
  },
  {
    id: 3,
    question: "Teacher শব্দের বাংলা অর্থ কোনটি?",
    options: ["ছাত্র", "শিক্ষক", "বিদ্যালয়", "কাগজ"],
    answer: 1,
    userAnswer: null,
  },
];

// Technical Skill Database (Replaced school curriculum reference under Skills page)
const skillsData = [
  {
    id: "skill-chatgpt",
    title: "ChatGPT AI Design Masterclass",
    desc: "প্রম্পট ও এআই টেকনোলজি দিয়ে অ্যাডভান্সড কন্টেন্ট রাইটিং, গ্রাফিক্স ও কোডিং জেনারেশন শিখুন প্রফেশনালি।",
    price: "৳ ৯৯৯",
    modules: "১৪টি মডিউল",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Rickroll default placeholder
  },
  {
    id: "skill-claude",
    title: "Claude AI Masterclass",
    desc: "অর্গানাইজড ডেভেলপমেন্ট ও প্রজেক্ট ক্রিয়েশনে এআই এর সুপার পাওয়ার কাজে লাগানোর কমপ্লিট কোর্স!",
    price: "৳ ১১৯৯",
    modules: "১২টি মডিউল",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "skill-uiux",
    title: "UI/UX Figma Design Blueprint",
    desc: "প্রিমিয়াম কোয়ালিটি মোবাইল ও ওয়েব ইন্টারফেস তৈরি করে গ্লোবাল মার্কেটে ক্যারিয়ার গড়ুন।",
    price: "৳ ১৪৯৯",
    modules: "২৮টি মডিউল",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

// Physical Kits and Virtual Projects Database (Like Shobor / Science Box)
const projectsData = [
  {
    id: "proj-solar",
    title: "DIY Solar-Powered Toy Car Kit",
    category: "kids",
    desc: "বাচ্চাদের জন্য সৌর শক্তির অবিশ্বাস্য জাদু সরাসরি বিজ্ঞান বাক্সের মাধ্যমে শেখার প্রজেক্ট।",
    price: "৳ ৪৫০",
    modules: "কিট + ভিডিও গাইড",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "proj-led",
    title: "LED Electronic Maze Game Kit",
    category: "kids",
    desc: "সহজ সার্কিট এবং ওয়ারিং তৈরি করে খেলার ছলে ছোটদের ইলেকট্রনিক্স শিখুন।",
    price: "৳ ৩৫০",
    modules: "কিট + ভিডিও গাইড",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "proj-iot",
    title: "Smart Irrigation Home IoT Box",
    category: "upper",
    desc: "আর্ডুইনো এবং সেন্সর ব্যবহার করে স্বয়ংক্রিয় প্রজেক্ট ডেভেলপমেন্ট (বড়দের জন্য)।",
    price: "৳ ২৯৯৯",
    modules: "কমপ্লিট আর্ডুইনো কিট",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "proj-chatbot",
    title: "AI Chatbot Assistant using Python",
    category: "upper",
    desc: "পাইথন ও ওপেনএআই এপিআই দিয়ে সম্পূর্ণ নিজস্ব প্রফেশনাল চ্যাটবট ডেভলপমেন্ট কোর্স।",
    price: "৳ ৮৯৯",
    modules: "১০টি ভিডিও লেকচার",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

// University Dynamic Course Structure
const universityData = {
  CSE: {
    title: "Computer Science & Engineering Curriculum",
    semesters: {
      "Semester 1": [
        "Introduction to Computing & Python",
        "Discrete Mathematics",
        "Physics & Electronics Lab",
      ],
      "Semester 2": [
        "Data Structures & Algorithms",
        "Object-Oriented Programming (C++)",
        "Calculus & Geometry",
      ],
      "Semester 3": [
        "Database Management Systems",
        "Software Engineering",
        "Computer Architecture",
      ],
    },
  },
  EEE: {
    title: "Electrical & Electronic Engineering Curriculum",
    semesters: {
      "Semester 1": [
        "Electrical Circuits I",
        "Engineering Electromagnetics",
        "Calculus I",
      ],
      "Semester 2": [
        "Electronic Devices & Circuits",
        "Digital Logic Design",
        "Signals & Systems",
      ],
    },
  },
  Civil: {
    title: "Civil Engineering Curriculum",
    semesters: {
      "Semester 1": [
        "Engineering Mechanics",
        "Civil Engineering Drawing",
        "Solid Mechanics",
      ],
    },
  },
  Mechanical: {
    title: "Mechanical Engineering Curriculum",
    semesters: {
      "Semester 1": [
        "Thermodynamics",
        "Fluid Mechanics",
        "Engineering Materials",
      ],
    },
  },
};

// College Academic chapters
const collegeData = {
  subjects: ["পদার্থবিজ্ঞান", "রসায়ন", "উচ্চতর গণিত", "জীববিজ্ঞান", "আইসিটি"],
  chapters: [
    "১ম অধ্যায় (ভৌত জগত)",
    "২য় অধ্যায় (ভেক্টর)",
    "৩য় অধ্যায় (গতিবিদ্যা)",
    "৪র্থ অধ্যায় (নিউটোনীয় বলবিদ্যা)",
  ],
};

// ==========================================
// SYSTEM TRANSLATIONS dictionary
// ==========================================
const translations = {
  BN: {
    "nav-school": "স্কুল কারিকুলাম",
    "nav-college": "কলেজ কারিকুলাম",
    "nav-university": "ইউনিভার্সিটি",
    "nav-projects": "প্রোজেক্টস",
    "nav-skills": "স্কিলস",
  },
  EN: {
    "nav-school": "School Curriculum",
    "nav-college": "College Curriculum",
    "nav-university": "University",
    "nav-projects": "Projects Catalog",
    "nav-skills": "Skills Center",
  },
};

// ==========================================
// INTERACTIVE THEME TOGGLE (DARK/LIGHT)
// ==========================================
function toggleTheme() {
  const body = document.body;
  if (body.classList.contains("theme-dark")) {
    body.classList.remove("theme-dark");
    body.classList.add("theme-light");
    document.getElementById("sun-icon").classList.add("hidden");
    document.getElementById("moon-icon").classList.remove("hidden");
    currentTheme = "light";
  } else {
    body.classList.remove("theme-light");
    body.classList.add("theme-dark");
    document.getElementById("moon-icon").classList.add("hidden");
    document.getElementById("sun-icon").classList.remove("hidden");
    currentTheme = "dark";
  }
}

// ==========================================
// LANGUAGE INTERACTIVITY
// ==========================================
function changeLanguage(lang) {
  currentLanguage = lang;

  // Update translation classes active state
  if (lang === "BN") {
    document.getElementById("lang-bn").className =
      "bg-cyan-500 text-black px-2.5 py-1 rounded transition duration-200";
    document.getElementById("lang-en").className =
      "px-2.5 py-1 text-gray-400 transition duration-200";
  } else {
    document.getElementById("lang-en").className =
      "bg-cyan-500 text-black px-2.5 py-1 rounded transition duration-200";
    document.getElementById("lang-bn").className =
      "px-2.5 py-1 text-gray-400 transition duration-200";
  }

  // Translate all DOM elements containing keys
  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    if (translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });
}

// ==========================================
// NAVIGATION SYSTEM
// ==========================================
function goHome() {
  document.getElementById("dynamic-page").classList.add("hidden");
  document.getElementById("hero-section").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showDynamicPage() {
  document.getElementById("hero-section").classList.add("hidden");
  document.getElementById("dynamic-page").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Sidebar subjects & chapters accordions
function toggleAccordion(id) {
  const container = document.getElementById(id);
  const arrow = document.getElementById("arrow-" + id);
  if (!container) return;

  if (container.classList.contains("hidden")) {
    container.classList.remove("hidden");
    if (arrow) arrow.style.transform = "rotate(180deg)";
  } else {
    container.classList.add("hidden");
    if (arrow) arrow.style.transform = "rotate(0deg)";
  }
}

// ==========================================
// LOAD SCHOOL PAGES
// ==========================================
function loadSchoolPage(className) {
  currentLevel = className;
  document.getElementById("dynamic-title").innerText = className + " কারিকুলাম";
  document.getElementById("dynamic-subtitle").innerText =
    "বাম পাশ থেকে আপনার পছন্দের বিষয় ও অধ্যায়টি নির্বাচন করুন";
  document.getElementById("dynamic-count").innerText = "অধ্যায়ভিত্তিক কন্টেন্ট";

  const sidebar = document.getElementById("dynamic-sidebar");
  sidebar.innerHTML = `
    <div class="mb-4">
      <h3 class="font-extrabold text-lg text-theme">📚 বিষয় ও অধ্যায়</h3>
      <p class="text-theme-muted text-xs">অধ্যায় নির্বাচন করতে বিষয়ে ক্লিক করুন</p>
    </div>
  `;

  const subjects = [
    "বাংলা",
    "ইংরেজি",
    "গণিত",
    "বিজ্ঞান",
    "বাংলাদেশ ও বিশ্বপরিচয়",
  ];
  const chapters = [
    "১ম অধ্যায়",
    "২য় অধ্যায়",
    "৩য় অধ্যায়",
    "৪র্থ অধ্যায়",
    "৫ম অধ্যায়",
  ];

  subjects.forEach((subject, subIndex) => {
    const accId = `school-subject-${subIndex}`;
    let chapterLinks = "";

    chapters.forEach((chap) => {
      chapterLinks += `
        <a href="javascript:void(0)" 
           onclick="selectSchoolChapter('${className}', '${subject}', '${chap}', this)" 
           class="chapter-link block py-2.5 px-4 hover:bg-cyan-500/10 text-theme-muted hover:text-cyan-400 rounded-lg text-sm transition pl-6 border-l-2 border-transparent">
          📖 ${chap}
        </a>
      `;
    });

    sidebar.innerHTML += `
      <div class="border-b border-theme py-3">
        <button onclick="toggleAccordion('${accId}')" class="flex items-center justify-between w-full font-bold text-sm text-theme hover:text-cyan-400 transition">
          <span>📙 ${subject}</span>
          <span id="arrow-${accId}" class="text-gray-400 text-xs transform transition-transform duration-200">▼</span>
        </button>
        <div id="${accId}" class="hidden mt-2 space-y-1">
          ${chapterLinks}
        </div>
      </div>
    `;
  });

  showDynamicPage();

  // Open default
  setTimeout(() => {
    toggleAccordion("school-subject-1");
    const links = document.querySelectorAll(".chapter-link");
    if (links.length > 0) links[0].click();
  }, 50);
}

// Select Chapter & load dynamic interactive grid (Rearranged beautifully to avoid overlapping)
function selectSchoolChapter(levelName, subjectName, chapterName, element) {
  currentLevel = levelName;
  currentSubject = subjectName;
  currentChapter = chapterName;

  document.querySelectorAll(".chapter-link").forEach((link) => {
    link.classList.remove("bg-cyan-500/10", "text-cyan-400", "border-cyan-500");
  });
  if (element) {
    element.classList.add("bg-cyan-500/10", "text-cyan-400", "border-cyan-500");
  }

  // Load interactive grids (Spelling, Word list clickables)
  const grid = document.getElementById("dynamic-grid");
  grid.className = "grid grid-cols-1 md:grid-cols-3 gap-6 w-full col-span-full";
  grid.innerHTML = `
    <!-- learning card -->
    <div class="bg-theme border border-theme rounded-3xl p-6 shadow-sm hover:shadow-md transition">
      <div class="flex items-center gap-2 mb-6">
        <span class="text-3xl">📚</span>
        <h3 class="text-xl font-bold text-theme">Learning (পড়াশোনা)</h3>
      </div>
      <div class="space-y-4">
        <div onclick="openWordListModal()" class="flex justify-between items-center bg-theme-secondary hover:bg-cyan-500/5 p-4 rounded-2xl border border-theme cursor-pointer transition">
          <div>
            <h4 class="font-bold text-theme text-sm">Word List</h4>
            <p class="text-[10px] text-theme-muted">ক্লিক করে শব্দ তালিকা ও উচ্চারণ শিখুন</p>
          </div>
          <span class="text-xs font-bold text-cyan-400">১০টি শব্দ ➔</span>
        </div>
        <div onclick="openSpellingModal()" class="flex justify-between items-center bg-theme-secondary hover:bg-cyan-500/5 p-4 rounded-2xl border border-theme cursor-pointer transition">
          <div>
            <h4 class="font-bold text-theme text-sm">Spelling Practice</h4>
            <p class="text-[10px] text-theme-muted">বানান চর্চা ও অটো-কারেকশন</p>
          </div>
          <span class="text-xs font-bold text-purple-400">বানান খেলুন ➔</span>
        </div>
        <div onclick="openMeaningModal()" class="flex justify-between items-center bg-theme-secondary hover:bg-cyan-500/5 p-4 rounded-2xl border border-theme cursor-pointer transition">
          <div>
            <h4 class="font-bold text-theme text-sm">Word Meaning</h4>
            <p class="text-[10px] text-theme-muted">ইন্টারেক্টিভ ফ্ল্যাশ কার্ড ও অর্থ</p>
          </div>
          <span class="text-xs font-bold text-emerald-400">ফ্ল্যাশ কার্ড ➔</span>
        </div>
      </div>
    </div>

    <!-- Practice card -->
    <div class="bg-theme border border-theme rounded-3xl p-6 shadow-sm hover:shadow-md transition">
      <div class="flex items-center gap-2 mb-6">
        <span class="text-3xl">📝</span>
        <h3 class="text-xl font-bold text-theme">Practice (অনুশীলনী)</h3>
      </div>
      <div class="space-y-4">
        <div onclick="openMCQModal()" class="flex justify-between items-center bg-theme-secondary hover:bg-cyan-500/5 p-4 rounded-2xl border border-theme cursor-pointer transition">
          <div>
            <h4 class="font-bold text-theme text-sm">MCQ Test</h4>
            <p class="text-[10px] text-theme-muted">অধ্যায়ভিত্তিক অটোমেটেড এমসিকিউ</p>
          </div>
          <span class="text-xs font-bold text-indigo-400">পরীক্ষা দিন ➔</span>
        </div>
        <div class="p-4 bg-theme-secondary rounded-2xl border border-theme opacity-60 flex justify-between items-center">
          <div>
            <h4 class="font-bold text-theme text-sm">সৃজনশীল প্রশ্ন (CQ)</h4>
            <p class="text-[10px] text-theme-muted">মডেল উত্তরপত্র সহ সলভ শীট</p>
          </div>
          <span class="text-xs text-theme-muted">লক 🔒</span>
        </div>
      </div>
    </div>

    <!-- Teacher Tools -->
    <div class="bg-theme border border-theme rounded-3xl p-6 shadow-sm hover:shadow-md transition">
      <div class="flex items-center gap-2 mb-6">
        <span class="text-3xl">👨‍🏫</span>
        <h3 class="text-xl font-bold text-theme">Teacher Tools (শিক্ষক প্যানেল)</h3>
      </div>
      <div class="space-y-4">
        <div onclick="openQGenModal()" class="flex justify-between items-center bg-theme-secondary hover:bg-emerald-500/5 p-4 rounded-2xl border border-theme cursor-pointer transition">
          <div>
            <h4 class="font-bold text-theme text-sm">Question Generator</h4>
            <p class="text-[10px] text-theme-muted">১ ক্লিকে প্রিন্ট উপযোগী প্রশ্নপত্র</p>
          </div>
          <span class="text-xs font-bold text-emerald-400">তৈরি করুন ➔</span>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// LOAD COLLEGE PAGES
// ==========================================
function loadCollegePage(className) {
  document.getElementById("dynamic-title").innerText = className + " কারিকুলাম";
  document.getElementById("dynamic-subtitle").innerText =
    "কলেজ বিভাগের উচ্চতর একাডেমিক টপিক ও লেকচার সমুহ";
  document.getElementById("dynamic-count").innerText = "৪টি বিষয় উপলব্ধ";

  const sidebar = document.getElementById("dynamic-sidebar");
  sidebar.innerHTML = `
    <div class="mb-4">
      <h3 class="font-extrabold text-lg text-theme">🎓 কলেজ বিষয়াবলী</h3>
      <p class="text-theme-muted text-xs">টপিক সিলেক্ট করতে বিষয়ে ক্লিক করুন</p>
    </div>
  `;

  collegeData.subjects.forEach((subject, subIndex) => {
    const accId = `college-sub-${subIndex}`;
    let chapterLinks = "";

    collegeData.chapters.forEach((chap) => {
      chapterLinks += `
        <a href="javascript:void(0)" 
           onclick="selectCollegeTopic('${className}', '${subject}', '${chap}', this)" 
           class="chapter-link block py-2.5 px-4 hover:bg-cyan-500/10 text-theme-muted hover:text-cyan-400 rounded-lg text-xs transition pl-6">
          📕 ${chap}
        </a>
      `;
    });

    sidebar.innerHTML += `
      <div class="border-b border-theme py-3">
        <button onclick="toggleAccordion('${accId}')" class="flex items-center justify-between w-full font-bold text-sm text-theme hover:text-cyan-400 transition">
          <span>📘 ${subject}</span>
          <span id="arrow-${accId}" class="text-gray-400 text-xs">▼</span>
        </button>
        <div id="${accId}" class="hidden mt-2 space-y-1">
          ${chapterLinks}
        </div>
      </div>
    `;
  });

  showDynamicPage();
  setTimeout(() => {
    toggleAccordion("college-sub-0");
    const links = document.querySelectorAll(".chapter-link");
    if (links.length > 0) links[0].click();
  }, 50);
}

function selectCollegeTopic(level, subject, chapter, element) {
  document.querySelectorAll(".chapter-link").forEach((link) => {
    link.classList.remove("bg-cyan-500/10", "text-cyan-400", "border-cyan-500");
  });
  if (element)
    element.classList.add("bg-cyan-500/10", "text-cyan-400", "border-cyan-500");

  const grid = document.getElementById("dynamic-grid");
  grid.innerHTML = `
    <div class="bg-theme border border-theme rounded-3xl p-6 col-span-full">
      <h3 class="text-2xl font-black text-theme mb-2">${subject} - ${chapter}</h3>
      <p class="text-theme-muted text-sm mb-6">এইচএসসি পরীক্ষার সেরা প্রস্তুতির জন্য থিওরি ও সৃজনশীল সমাধান</p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-theme-secondary p-6 rounded-2xl border border-theme text-center">
          <span class="text-4xl">📄</span>
          <h4 class="font-bold text-theme mt-3">কনসেপ্ট বুক (PDF)</h4>
          <p class="text-xs text-theme-muted mt-1">অধ্যায়ের সমস্ত সূত্রের ব্যাখ্যা ও শীট</p>
          <button onclick="alert('ডাউনলোড শুরু হয়েছে...')" class="mt-4 bg-cyan-500 text-black px-4 py-2 rounded-lg text-xs font-bold">ডাউনলোড করুন</button>
        </div>
        <div class="bg-theme-secondary p-6 rounded-2xl border border-theme text-center">
          <span class="text-4xl">🎥</span>
          <h4 class="font-bold text-theme mt-3">ভিডিও টিউটোরিয়াল</h4>
          <p class="text-xs text-theme-muted mt-1">এইচএসসি মেন্টরদের দ্বারা জটিল টপিকের এনিমেশন ভিত্তিক সমাধান</p>
          <button onclick="openVideoPlayerModal('এইচএসসি মাস্টারক্লাস লেকচার', 'HSC Chapter Analysis', 'https://www.youtube.com/embed/dQw4w9WgXcQ')" class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold">ভিডিও প্লে করুন</button>
        </div>
        <div class="bg-theme-secondary p-6 rounded-2xl border border-theme text-center">
          <span class="text-4xl">🏆</span>
          <h4 class="font-bold text-theme mt-3">লাইভ এক্সাম</h4>
          <p class="text-xs text-theme-muted mt-1">বাস্তব পরীক্ষার অভিজ্ঞতা নিয়ে সেলফ অ্যাসেসমেন্ট</p>
          <button onclick="alert('এক্সাম প্যানেল লোড হচ্ছে...')" class="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold">অংশ নিন</button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// LOAD UNIVERSITY CURRICULUM (CSE, EEE, ETC)
// ==========================================
function loadUniversityPage(deptName) {
  const dept = universityData[deptName];
  if (!dept) return;

  document.getElementById("dynamic-title").innerText = dept.title;
  document.getElementById("dynamic-subtitle").innerText =
    "সেমিস্টার-ভিত্তিক সাজানো থিওরি, প্র্যাক্টিকাল ক্লাস ও অ্যাসাইনমেন্টস";
  document.getElementById("dynamic-count").innerText = "অ্যাডভান্সড কারিকুলাম";

  const sidebar = document.getElementById("dynamic-sidebar");
  sidebar.innerHTML = `
    <div class="mb-4">
      <h3 class="font-extrabold text-lg text-theme">🏫 সেমিস্টার তালিকা</h3>
      <p class="text-theme-muted text-xs">সেমিস্টার চুজ করে সাবজেক্ট দেখুন</p>
    </div>
  `;

  Object.keys(dept.semesters).forEach((sem, semIndex) => {
    const accId = `uni-sem-${semIndex}`;
    let subLinks = "";

    dept.semesters[sem].forEach((subject) => {
      subLinks += `
        <a href="javascript:void(0)" 
           onclick="selectUniversitySubject('${deptName}', '${sem}', '${subject}', this)" 
           class="chapter-link block py-2.5 px-4 hover:bg-cyan-500/10 text-theme-muted hover:text-cyan-400 rounded-lg text-xs transition pl-6">
          🎓 ${subject}
        </a>
      `;
    });

    sidebar.innerHTML += `
      <div class="border-b border-theme py-3">
        <button onclick="toggleAccordion('${accId}')" class="flex items-center justify-between w-full font-bold text-sm text-theme hover:text-cyan-400 transition">
          <span>📅 ${sem}</span>
          <span id="arrow-${accId}" class="text-gray-400 text-xs">▼</span>
        </button>
        <div id="${accId}" class="hidden mt-2 space-y-1">
          ${subLinks}
        </div>
      </div>
    `;
  });

  showDynamicPage();
  setTimeout(() => {
    toggleAccordion("uni-sem-0");
    const links = document.querySelectorAll(".chapter-link");
    if (links.length > 0) links[0].click();
  }, 50);
}

function selectUniversitySubject(dept, semester, subject, element) {
  document.querySelectorAll(".chapter-link").forEach((link) => {
    link.classList.remove("bg-cyan-500/10", "text-cyan-400", "border-cyan-500");
  });
  if (element)
    element.classList.add("bg-cyan-500/10", "text-cyan-400", "border-cyan-500");

  const grid = document.getElementById("dynamic-grid");
  grid.innerHTML = `
    <div class="bg-theme border border-theme rounded-3xl p-6 col-span-full">
      <h3 class="text-2xl font-black text-theme mb-2">${subject}</h3>
      <p class="text-theme-muted text-sm mb-6">${dept} বিভাগ | ${semester} | থিওরি পেপারস ও ল্যাব রিসার্চ</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-theme-secondary p-6 rounded-2xl border border-theme">
          <h4 class="font-bold text-cyan-400 text-lg mb-2">🎥 লেকচার ও রিডিং রিসোর্স</h4>
          <p class="text-xs text-theme-muted mb-4">বিশ্বমানের প্রফেশনাল শিক্ষকদের ভিডিও টিউটোরিয়াল লেকচার গাইড।</p>
          <button onclick="openVideoPlayerModal('${subject} Lecture', 'Syllabus Core', 'https://www.youtube.com/embed/dQw4w9WgXcQ')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition">লেকচার প্লে করুন ➔</button>
        </div>
        <div class="bg-theme-secondary p-6 rounded-2xl border border-theme">
          <h4 class="font-bold text-purple-400 text-lg mb-2">🚀 ল্যাব ও সেমিস্টার প্রজেক্টস</h4>
          <p class="text-xs text-theme-muted mb-4">এই কোর্সের আন্ডারে সম্পন্ন করার মতো ইন্ডাস্ট্রি গ্রেড প্রজেক্ট বিল্ড-আপ।</p>
          <button onclick="loadProjectsPage()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition">প্রজেক্ট লাইব্রেরিতে যান</button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// LOAD SKILLS PAGE (DYNAMIC TECHNICAL SKILLS)
// ==========================================
function loadSkillsPage() {
  document.getElementById("dynamic-title").innerText = "স্কিল ডেভেলপমেন্ট";
  document.getElementById("dynamic-subtitle").innerText =
    "ক্যারিয়ার বুস্ট করার জন্য প্রয়োজনীয় টেকনিক্যাল স্কিলসমূহ";
  document.getElementById("dynamic-count").innerText =
    `${skillsData.length}টি স্কিল মডিউল`;

  const sidebar = document.getElementById("dynamic-sidebar");
  sidebar.innerHTML = `
    <div class="mb-4">
      <h3 class="font-extrabold text-lg text-theme">🛠️ স্কিলস ফিল্টার</h3>
      <p class="text-theme-muted text-xs">ক্যাটাগরি অনুযায়ী ফিল্টার করুন</p>
    </div>
    <div class="space-y-2 text-sm font-bold text-theme">
      <label class="flex items-center gap-3 bg-theme-secondary p-3 rounded-xl border border-theme cursor-pointer"><input type="checkbox" checked /> Artificial Intelligence</label>
      <label class="flex items-center gap-3 bg-theme-secondary p-3 rounded-xl border border-theme cursor-pointer"><input type="checkbox" checked /> Software Development</label>
      <label class="flex items-center gap-3 bg-theme-secondary p-3 rounded-xl border border-theme cursor-pointer"><input type="checkbox" checked /> UI/UX Designing</label>
    </div>
  `;

  const grid = document.getElementById("dynamic-grid");
  grid.className =
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full";
  grid.innerHTML = "";

  skillsData.forEach((skill) => {
    grid.innerHTML += `
      <div class="bg-theme border border-theme rounded-3xl p-6 hover:border-cyan-500/50 transition duration-300 flex flex-col justify-between">
        <div>
          <span class="text-xs font-bold bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full">স্কিল ক্লাস</span>
          <h4 class="text-xl font-extrabold text-theme mt-3">${skill.title}</h4>
          <p class="text-xs text-theme-muted mt-2">${skill.desc}</p>
        </div>
        <div class="border-t border-theme pt-4 mt-6 flex justify-between items-center">
          <div>
            <span class="text-[10px] text-theme-muted block font-bold">${skill.modules}</span>
            <span class="text-lg font-black text-cyan-400">${skill.price}</span>
          </div>
          <button onclick="openSkillDetail('${skill.title}', '${skill.desc}', '${skill.price}', '${skill.video}')" class="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black py-2.5 px-4 rounded-xl transition">
            বিস্তারিত ও অর্ডার
          </button>
        </div>
      </div>
    `;
  });

  showDynamicPage();
}

// ==========================================
// LOAD PROJECTS PAGE (KIDS & UPPER LEVEL)
// ==========================================
function loadProjectsPage() {
  document.getElementById("dynamic-title").innerText = "প্রোজেক্ট গ্যালারি";
  document.getElementById("dynamic-subtitle").innerText =
    "বাচ্চা এবং বড়দের জন্য 'বিজ্ঞান বাক্স' এর আদলে ডিজাইনকৃত প্রোজেক্ট সমূহ";
  document.getElementById("dynamic-count").innerText =
    `${projectsData.length}টি কিট্স পাওয়া গেছে`;

  const sidebar = document.getElementById("dynamic-sidebar");
  sidebar.innerHTML = `
    <div class="mb-4">
      <h3 class="font-extrabold text-lg text-theme">⚙️ প্রজেক্ট লেভেল</h3>
      <p class="text-theme-muted text-xs">লেভেল অনুযায়ী সর্ট করুন</p>
    </div>
    <div class="space-y-2 text-sm font-bold text-theme">
      <button onclick="filterProjects('all')" class="w-full text-left bg-cyan-500/10 text-cyan-400 p-3 rounded-xl border border-cyan-500/30">সকল প্রজেক্টস</button>
      <button onclick="filterProjects('kids')" class="w-full text-left bg-theme-secondary hover:bg-theme-hover p-3 rounded-xl border border-theme">প্রোজেক্টস ফর কিডস (Kids)</button>
      <button onclick="filterProjects('upper')" class="w-full text-left bg-theme-secondary hover:bg-theme-hover p-3 rounded-xl border border-theme">আপার লেভেল প্রোজেক্টস</button>
    </div>
  `;

  filterProjects("all");
}

function filterProjects(cat) {
  const grid = document.getElementById("dynamic-grid");
  grid.className =
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full";
  grid.innerHTML = "";

  const list =
    cat === "all"
      ? projectsData
      : projectsData.filter((p) => p.category === cat);

  list.forEach((proj) => {
    grid.innerHTML += `
      <div class="bg-theme border border-theme rounded-3xl p-6 hover:border-cyan-500/50 transition duration-300 flex flex-col justify-between">
        <div>
          <span class="text-xs font-bold ${proj.category === "kids" ? "bg-amber-500/10 text-amber-500" : "bg-purple-500/10 text-purple-400"} px-3 py-1 rounded-full">
            ${proj.category === "kids" ? "👨‍👧‍👦 Kids Kit" : "🚀 Upper Level"}
          </span>
          <h4 class="text-xl font-extrabold text-theme mt-3">${proj.title}</h4>
          <p class="text-xs text-theme-muted mt-2">${proj.desc}</p>
        </div>
        <div class="border-t border-theme pt-4 mt-6 flex justify-between items-center">
          <div>
            <span class="text-[10px] text-theme-muted block font-bold">${proj.modules}</span>
            <span class="text-lg font-black text-cyan-400">${proj.price}</span>
          </div>
          <button onclick="openSkillDetail('${proj.title}', '${proj.desc}', '${proj.price}', '${proj.video}')" class="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black py-2.5 px-4 rounded-xl transition">
            কিট অর্ডার করুন ➔
          </button>
        </div>
      </div>
    `;
  });

  showDynamicPage();
}

// ==========================================
// MODAL CONTROLLERS & LOGICS (DYNAMIC)
// ==========================================

function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

// --- Word List Modal Logic ---
function openWordListModal() {
  document.getElementById("word-search").value = "";
  filteredWords = [...schoolWords];
  wordCurrentPage = 1;
  document.getElementById("wl-modal-subtitle").innerText =
    `${currentLevel} → ${currentSubject} → ${currentChapter}`;
  renderWordListTable();
  openModal("word-list-modal");
}

function renderWordListTable() {
  const tableBody = document.getElementById("word-table-body");
  tableBody.innerHTML = "";

  const startIndex = (wordCurrentPage - 1) * wordsPerPage;
  const endIndex = startIndex + wordsPerPage;
  const pageWords = filteredWords.slice(startIndex, endIndex);

  if (pageWords.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-theme-muted text-sm">কোনো শব্দ খুঁজে পাওয়া যায়নি।</td></tr>`;
    document.getElementById("wl-pagination-text").innerText = "Page 0 of 0";
    document.getElementById("wl-prev-btn").disabled = true;
    document.getElementById("wl-next-btn").disabled = true;
    return;
  }

  pageWords.forEach((item, index) => {
    const globalIndex = startIndex + index;
    const isCompleted = item.completed;

    tableBody.innerHTML += `
      <tr class="hover:bg-cyan-500/5 transition">
        <td class="p-3 font-bold text-theme">${item.word}</td>
        <td class="p-3 text-theme">${item.meaning}</td>
        <td class="p-3 text-right">
          <button 
            onclick="toggleWordComplete(${globalIndex})" 
            class="px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              isCompleted
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-theme-secondary text-theme-muted border border-theme hover:bg-cyan-500/10 hover:text-cyan-400"
            }"
          >
            ${isCompleted ? "✓ Completed" : "Mark Complete"}
          </button>
        </td>
      </tr>
    `;
  });

  const totalPages = Math.ceil(filteredWords.length / wordsPerPage);
  document.getElementById("wl-pagination-text").innerText =
    `Page ${wordCurrentPage} of ${totalPages}`;
  document.getElementById("wl-prev-btn").disabled = wordCurrentPage === 1;
  document.getElementById("wl-next-btn").disabled =
    wordCurrentPage === totalPages;
}

function toggleWordComplete(index) {
  const targetWord = filteredWords[index];
  const masterWord = schoolWords.find((w) => w.word === targetWord.word);
  if (masterWord) masterWord.completed = !masterWord.completed;
  renderWordListTable();
}

function filterWordList() {
  const query = document
    .getElementById("word-search")
    .value.toLowerCase()
    .trim();
  filteredWords = schoolWords.filter(
    (item) =>
      item.word.toLowerCase().includes(query) || item.meaning.includes(query),
  );
  wordCurrentPage = 1;
  renderWordListTable();
}

function prevWordPage() {
  if (wordCurrentPage > 1) {
    wordCurrentPage--;
    renderWordListTable();
  }
}

function nextWordPage() {
  const totalPages = Math.ceil(filteredWords.length / wordsPerPage);
  if (wordCurrentPage < totalPages) {
    wordCurrentPage++;
    renderWordListTable();
  }
}

// --- Spelling Practice Logic ---
let spellingTarget = {};
function openSpellingModal() {
  document.getElementById("spelling-input").value = "";
  document.getElementById("spelling-feedback").innerText = "";

  // Pick random word from bank
  const randomWord =
    schoolWords[Math.floor(Math.random() * schoolWords.length)];
  spellingTarget = randomWord;
  document.getElementById("spelling-bangla").innerText = randomWord.meaning;
  openModal("spelling-modal");
}

function checkSpelling() {
  const inputVal = document
    .getElementById("spelling-input")
    .value.trim()
    .toLowerCase();
  const target = spellingTarget.word.toLowerCase();
  const feedback = document.getElementById("spelling-feedback");

  if (inputVal === target) {
    feedback.className = "text-sm font-bold text-emerald-400";
    feedback.innerText = "✓ অসাধারণ! সঠিক বানান হয়েছে।";
    setTimeout(() => {
      openSpellingModal();
    }, 1500); // load next spelling
  } else {
    feedback.className = "text-sm font-bold text-red-500";
    feedback.innerText = "❌ ভুল হয়েছে! আবার চেষ্টা করুন।";
  }
}

// --- Word Meaning Flashcard Logic ---
function openMeaningModal() {
  currentWordIndex = 0;
  loadFlashcard();
  openModal("meaning-modal");
}

function loadFlashcard() {
  const item = schoolWords[currentWordIndex];
  document.getElementById("card-main-text").innerText = item.word;
  document.getElementById("card-sub-text").innerText = item.meaning;
  document.getElementById("card-sub-text").classList.add("hidden"); // hidden by default until tapped
}

function flipFlashcard() {
  document.getElementById("card-sub-text").classList.toggle("hidden");
}

function nextFlashcard() {
  if (currentWordIndex < schoolWords.length - 1) {
    currentWordIndex++;
    loadFlashcard();
  }
}

function prevFlashcard() {
  if (currentWordIndex > 0) {
    currentWordIndex--;
    loadFlashcard();
  }
}

// --- Interactive MCQ Modal Logic ---
function openMCQModal() {
  document.getElementById("mcq-modal-subtitle").innerText =
    `${currentLevel} → ${currentSubject} → ${currentChapter}`;
  renderMCQQuestions();
  openModal("mcq-modal");
}

function renderMCQQuestions() {
  const container = document.getElementById("mcq-questions-container");
  container.innerHTML = "";

  let answeredCount = 0;
  let correctCount = 0;

  schoolMCQs.forEach((q, qIndex) => {
    let optionsHTML = "";

    q.options.forEach((opt, optIndex) => {
      let optStyle = "border-theme bg-theme-hover text-theme";

      if (q.userAnswer !== null) {
        if (optIndex === q.answer) {
          optStyle =
            "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold";
        } else if (optIndex === q.userAnswer) {
          optStyle = "border-red-500 bg-red-500/10 text-red-400 font-bold";
        } else {
          optStyle = "border-theme opacity-40";
        }
      }

      optionsHTML += `
        <label 
          class="flex items-center gap-3 p-3.5 rounded-xl border text-sm font-semibold cursor-pointer transition ${optStyle}"
          ${q.userAnswer === null ? `onclick="submitMCQ(${qIndex}, ${optIndex})"` : ""}
        >
          <input 
            type="radio" 
            name="mcq_q_${q.id}" 
            class="text-indigo-600 focus:ring-0"
            ${q.userAnswer === optIndex ? "checked" : ""} 
            ${q.userAnswer !== null ? "disabled" : ""} 
          />
          ${opt}
        </label>
      `;
    });

    if (q.userAnswer !== null) {
      answeredCount++;
      if (q.userAnswer === q.answer) correctCount++;
    }

    container.innerHTML += `
      <div class="bg-theme-secondary p-5 rounded-2xl border border-theme">
        <h4 class="font-extrabold text-theme mb-3 text-[15px]">${qIndex + 1}. ${q.question}</h4>
        <div class="grid grid-cols-2 gap-3 mt-4">
          ${optionsHTML}
        </div>
      </div>
    `;
  });

  document.getElementById("mcq-solved-count").innerText =
    `${correctCount}/${schoolMCQs.length}`;
}

function submitMCQ(qIndex, optIndex) {
  if (schoolMCQs[qIndex].userAnswer !== null) return;
  schoolMCQs[qIndex].userAnswer = optIndex;
  renderMCQQuestions();
}

// --- Question Generator Controller ---
function openQGenModal() {
  document.getElementById("qgen-lbl-class").innerText = currentLevel;
  document.getElementById("qgen-lbl-subject").innerText = currentSubject;
  document.getElementById("qgen-lbl-chapter").innerText = currentChapter;
  openModal("qgen-modal");
}

function triggerGeneratePaper() {
  closeModal("qgen-modal");
  document.getElementById("p-class").innerText = currentLevel;
  document.getElementById("p-subject").innerText = currentSubject;

  const container = document.getElementById("printed-questions-area");
  container.innerHTML = `
    <div>
      <h3 class="font-black text-slate-950 text-md mb-3">১. বহুনির্বাচনী প্রশ্ন (MCQ):</h3>
      <div class="space-y-4 pl-4 text-sm font-semibold text-slate-800">
        <div>
          <p>ক) 'Apple' শব্দের সঠিক বাংলা অনুবাদ কোনটি?</p>
          <p class="text-slate-500 mt-1 pl-4">১. আম &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ২. আপেল &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ৩. কলা &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ৪. লিচু</p>
        </div>
        <div>
          <p>খ) 'Boy' অর্থ কী?</p>
          <p class="text-slate-500 mt-1 pl-4">১. ছেলে &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ২. মেয়ে &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ৩. বই &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ৪. কলম</p>
        </div>
      </div>
    </div>
  `;

  openModal("print-paper-modal");
}

// --- Skill / Project Detail Controller (Order Form Embedded) ---
function openSkillDetail(title, desc, price, videoUrl) {
  document.getElementById("detail-title").innerText = title;
  document.getElementById("detail-desc").innerText = desc;
  document.getElementById("detail-price").innerText = price;
  document.getElementById("detail-video-iframe").src = videoUrl;

  // clear input fields
  document.getElementById("order-name").value = "";
  document.getElementById("order-phone").value = "";
  document.getElementById("order-address").value = "";

  openModal("course-details");
}

function submitOrder() {
  const name = document.getElementById("order-name").value.trim();
  const phone = document.getElementById("order-phone").value.trim();
  const address = document.getElementById("order-address").value.trim();

  if (!name || !phone || !address) {
    alert("দয়া করে অর্ডারের সমস্ত তথ্য সঠিকভাবে পূরণ করুন।");
    return;
  }

  alert(
    `ধন্যবাদ ${name}! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। ২৪ ঘণ্টার মধ্যে আমাদের কনফার্মেশন কল যাবে।`,
  );
  closeModal("course-details");
}

// --- Subscription Modal logic ---
function openSubscriptionModal() {
  document.getElementById("sub-phone").value = "";
  openModal("subscription-modal");
}

function submitSubscription() {
  const num = document.getElementById("sub-phone").value.trim();
  if (!num) {
    alert("দয়া করে পেমেন্ট নম্বরটি প্রবেশ করান!");
    return;
  }
  alert(
    "আপনার প্রিমিয়াম মেম্বারশিপ রিকোয়েস্ট সফলভাবে সাবমিট হয়েছে! পেমেন্ট ভেরিফাই হওয়ার পর VIP Access একটিভেট হবে।",
  );
  closeModal("subscription-modal");
}

// --- Login Simulation ---
function openLoginModal() {
  document.getElementById("login-email").value = "";
  document.getElementById("login-pass").value = "";
  openModal("login-modal");
}

function simulateLogin() {
  const mail = document.getElementById("login-email").value;
  const pass = document.getElementById("login-pass").value;
  if (!mail || !pass) {
    alert("দয়া করে ইমেইল ও পাসওয়ার্ড সঠিকভাবে লিখুন।");
    return;
  }
  alert("স্বাগতম! আপনি সফলভাবে লগইন হয়েছেন।");
  closeModal("login-modal");
}

// Handle Esc Key to Close Modals easily
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal("word-list-modal");
    closeModal("spelling-modal");
    closeModal("meaning-modal");
    closeModal("mcq-modal");
    closeModal("qgen-modal");
    closeModal("print-paper-modal");
    closeModal("course-details");
    closeModal("subscription-modal");
    closeModal("login-modal");
  }
});
