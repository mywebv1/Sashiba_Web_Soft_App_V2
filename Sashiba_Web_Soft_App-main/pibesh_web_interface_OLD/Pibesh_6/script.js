// ==========================================
// STATE MANAGEMENT & DATABASES
// ==========================================
let currentLanguage = "BN"; // Default language
let currentTheme = "dark"; // Default theme

// Active Academic State Variables
let currentCategory = "স্কুল";
let currentSubCategory = "৬ষ্ঠ–১০ম";
let currentSubject = "পদার্থবিজ্ঞান";
let currentChapter = "১ম অধ্যায়";
let activeTab = "overview";

// Word Meaning & Flashcard State Indexes
let currentWordIndex = 0;
let filteredWords = [];
let wordCurrentPage = 1;
const wordsPerPage = 5;

// Mock Database for Word List & Flashcards
const schoolWords = [
  { word: "Velocity", meaning: "বেগ", completed: true },
  { word: "Acceleration", meaning: "ত্বরণ", completed: false },
  { word: "Force", meaning: "বল", completed: true },
  { word: "Inertia", meaning: "জড়তা", completed: false },
  { word: "Mass", meaning: "ভর", completed: true },
  { word: "Energy", meaning: "শক্তি", completed: false },
  { word: "Power", meaning: "ক্ষমতা", completed: false },
  { word: "Work", meaning: "কাজ", completed: true },
  { word: "Gravity", meaning: "মহাকর্ষ", completed: false },
  { word: "Friction", meaning: "ঘর্ষণ", completed: false },
];

// Mock Database for MCQs
const schoolMCQs = [
  {
    id: 1,
    question_bn: "বলের এসআই (SI) একক কোনটি?",
    question_en: "What is the SI unit of force?",
    options_bn: ["প্যাসকেল", "জুল", "নিউটন", "ওয়াট"],
    options_en: ["Pascal", "Joule", "Newton", "Watt"],
    answer: 2,
    userAnswer: null,
  },
  {
    id: 2,
    question_bn: "নিউটনের গতি বিষয়ক সূত্র কয়টি?",
    question_en: "How many laws of motion did Newton propose?",
    options_bn: ["২টি", "৩টি", "৪টি", "৫টি"],
    options_en: ["2", "3", "4", "5"],
    answer: 1,
    userAnswer: null,
  },
  {
    id: 3,
    question_bn: "কাজের সমীকরণ কোনটি?",
    question_en: "Which is the equation for work?",
    options_bn: ["W = Fs", "F = ma", "P = W/t", "v = u + at"],
    options_en: ["W = Fs", "F = ma", "P = W/t", "v = u + at"],
    answer: 0,
    userAnswer: null,
  },
];

// Publications Mock Database
const publicationsData = [
  {
    id: "pub-n8n",
    title_bn: "n8n দিয়ে কমপ্লিট অটোমেশন",
    title_en: "Complete Automation with n8n",
    desc_bn:
      "এআই প্রম্পট ব্যবহার করে আপনার বিজনেসকে ঘুমে রেখেও অটোমেট করার গাইডলাইন বুক।",
    desc_en:
      "Guidebook to automate your business processes using n8n and AI prompts while sleeping.",
    price_bn: "৳ ১৯৯",
    price_en: "৳ 199",
    old_price_bn: "৳ ৪৯৯",
    old_price_en: "৳ 499",
    discount_bn: "৬০% ছাড়",
    discount_en: "60% OFF",
    author_bn: "সাব্বির আহমেদ",
    author_en: "Sabbir Ahmed",
    cover_style: "bg-gradient-to-br from-indigo-900 to-indigo-700 text-white",
  },
  {
    id: "pub-code",
    title_bn: "ক্লুড কোড - AI ড্রিভেন ওয়েব",
    title_en: "Claude Code - AI Driven Web",
    desc_bn:
      "এইচটিএমএল বা সিএসএস না জানলেও কিভাবে এআই প্রম্পটিং দিয়ে ডায়নামিক ওয়েব অ্যাপ বানাবেন।",
    desc_en:
      "Learn how to build dynamic web applications using AI prompting without coding knowledge.",
    price_bn: "৳ ১৯৯",
    price_en: "৳ 199",
    old_price_bn: "৳ ৪৯৯",
    old_price_en: "৳ 499",
    discount_bn: "৬০% ছাড়",
    discount_en: "60% OFF",
    author_bn: "সাব্বির আহমেদ",
    author_en: "Sabbir Ahmed",
    cover_style: "bg-gradient-to-br from-cyan-900 to-blue-700 text-white",
  },
  {
    id: "pub-excel",
    title_bn: "এআই ড্রিভেন এক্সেল মাস্টারি",
    title_en: "AI Driven Excel Mastery",
    desc_bn:
      "কর্পোরেট দুনিয়ার জটিল সব ফর্মুলা ও ডেটা অ্যানালাইসিস এআই দিয়ে মাত্র এক ক্লিকে সমাধান।",
    desc_en:
      "Solve corporate formulas and perform data analysis in Excel with generative AI.",
    price_bn: "৳ ১৯৯",
    price_en: "৳ 199",
    old_price_bn: "৳ ৪৯৯",
    old_price_en: "৳ 499",
    discount_bn: "৬০% ছাড়",
    discount_en: "60% OFF",
    author_bn: "সাব্বির আহমেদ",
    author_en: "Sabbir Ahmed",
    cover_style: "bg-gradient-to-br from-emerald-900 to-teal-800 text-white",
  },
  {
    id: "pub-prompt",
    title_bn: "প্রম্পট ইঞ্জিনিয়ারিং ৮.০",
    title_en: "Prompt Engineering 8.0",
    desc_bn:
      "ক্লড এবং চ্যাটজিপিটি থেকে নিখুঁত আউটপুট বের করার প্রফেশনাল হ্যান্ডবুক।",
    desc_en:
      "A comprehensive prompt engineering handbook to unlock professional AI precision.",
    price_bn: "৳ ১৯৯",
    price_en: "৳ 199",
    old_price_bn: "৳ ৫০০",
    old_price_en: "৳ 500",
    discount_bn: "৬০% ছাড়",
    discount_en: "60% OFF",
    author_bn: "সাব্বির আহমেদ",
    author_en: "Sabbir Ahmed",
    cover_style: "bg-gradient-to-br from-purple-900 to-indigo-800 text-white",
  },
];

// Chapter Materials (Syllabus database)
const chapterMaterials = {
  "১ম অধ্যায়": {
    overview: {
      intro_bn:
        "এই অধ্যায়ে আমরা মূলত গতি, বলের সমীকরণ এবং নিউটনের সূত্রসমূহ নিয়ে বিস্তারিত প্র্যাক্টিকাল আলোচনা করব।",
      intro_en:
        "In this chapter, we will discuss motion, equations of force, and Newton's laws with practical examples.",
      outcomes_bn: [
        "💡 গতির সমীকরণগুলোর গাণিতিক প্রমাণ ও প্রয়োগ ব্যাখ্যা করতে পারবে।",
        "💡 বলের পরিমাপ ও নিউটনের তিনটি সূত্রের বাস্তব উদাহরণ বুঝতে পারবে।",
        "💡 জড়তা এবং ঘর্ষণ বলের ক্রিয়া বিশ্লেষণ করতে পারবে।",
      ],
      outcomes_en: [
        "💡 Explain and prove equations of motion mathematically.",
        "💡 Understand force measurements and Newton's three laws of motion.",
        "💡 Analyze the effects of inertia and frictional forces.",
      ],
    },
    learn: {
      board_book_bn:
        "NCTB অনুমোদিত পদার্থবিজ্ঞান মূল বইয়ের পৃষ্ঠা ১-২৫ ডাউনলোড করে অনলাইনে পড়তে পারেন।",
      board_book_en:
        "Read NCTB approved Physics textbook pages 1-25 directly online.",
      video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
  },
};

// ==========================================
// SYSTEM TRANSLATIONS DICTIONARY
// ==========================================
const translations = {
  BN: {
    "nav-school": "স্কুল",
    "nav-college": "কলেজ",
    "nav-higher": "উচ্চশিক্ষা",
    "nav-projects": "প্রজেক্ট ল্যাব",
    "nav-skills": "দক্ষতা উন্নয়ন",
    "nav-pub": "Publications",
    "nav-qbank": "Question Bank",
    "btn-login-header": "লগইন",
    "hero-title-top": "শুধু মুখস্থ নয়,",
    "hero-title-bottom": "বুঝে তৈরি করতে শিখুন।",
    "hero-desc":
      "স্কুল থেকে উচ্চশিক্ষা—প্রতিটি অধ্যায়ের কনসেপ্ট বুক, প্র্যাক্টিকাল ভিডিও, হ্যান্ডনোট ও অটোমেটেড এমসিকিউ পরীক্ষা এখন এক প্ল্যাটফর্মে।",
    "btn-free-trial": "পড়া শুরু করুন ➔",
    "btn-explore-projects": "🚀 প্রজেক্ট ল্যাব দেখুন",
    "pub-badge": "ফিচার্ড প্রকাশনা",
    "pub-header": "ই-বুক ও স্টাডি নোটস",
    "search-placeholder": "সার্চ করুন...",
    "footer-desc":
      "প্রজেক্ট ভিত্তিক শিক্ষা ব্যবস্থা ও স্কিল ডেভেলপমেন্টের জন্য বাংলাদেশের নির্ভরযোগ্য প্ল্যাটফর্ম। আমরা তৈরি করি আগামীর উদ্ভাবক।",
    "footer-app": "মোবাইল অ্যাপ ডাউনলোড করুন",
    "footer-col-explore": "এক্সপ্লোর করুন",
    "footer-col-support": "হেল্প ও সাপোর্ট",
    "footer-col-contact": "যোগাযোগ",
    "tab-overview": "Overview (পরিচিতি)",
    "tab-learn": "Learn (শিখুন)",
    "tab-practice": "Practice (অনুশীলন)",
    "tab-resources": "Resources (রিসোর্স)",
    "btn-vip": "💎 PRO",
    "sub-school-1": "১ম–৫ম শ্রেণি",
    "sub-school-2": "৬ষ্ঠ–১০ম শ্রেণি",
    "sub-school-3": "SSC প্রস্তুতি",
    "sub-school-4": "NCTB বই",
    "sub-school-5": "গাইড ও সহায়ক বই",
  },
  EN: {
    "nav-school": "School",
    "nav-college": "College",
    "nav-higher": "Higher Education",
    "nav-projects": "Project Lab",
    "nav-skills": "Skills Builder",
    "nav-pub": "Publications",
    "nav-qbank": "Question Bank",
    "btn-login-header": "Sign In",
    "hero-title-top": "Don't Just Memorize,",
    "hero-title-bottom": "Learn to Build.",
    "hero-desc":
      "From school to higher education—access textbook guides, practical videos, and interactive mock tests instantly.",
    "btn-free-trial": "Start Learning ➔",
    "btn-explore-projects": "🚀 Explore Projects",
    "pub-badge": "FEATURED RELEASES",
    "pub-header": "E-Books & Handnotes",
    "search-placeholder": "Search anything...",
    "footer-desc":
      "The ultimate hands-on project and skills platform in Bangladesh. Preparing the innovators of tomorrow.",
    "footer-app": "Download Our Mobile App",
    "footer-col-explore": "Explore",
    "footer-col-support": "Help & Support",
    "footer-col-contact": "Contact Us",
    "tab-overview": "Overview (Intro)",
    "tab-learn": "Learn (Lessons)",
    "tab-practice": "Practice (Exams)",
    "tab-resources": "Resources (PDFs)",
    "btn-vip": "💎 PRO",
    "sub-school-1": "Class 1–5",
    "sub-school-2": "Class 6–10",
    "sub-school-3": "SSC Exam Prep",
    "sub-school-4": "NCTB Books",
    "sub-school-5": "Reference Guides",
  },
};

// ==========================================
// THEME & LANGUAGE SWITCHER
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

function changeLanguage(lang) {
  currentLanguage = lang;

  if (lang === "BN") {
    document.getElementById("lang-bn").className =
      "bg-cyan-500 text-black px-2 py-1 rounded-lg transition duration-200";
    document.getElementById("lang-en").className =
      "px-2 py-1 text-gray-400 transition duration-200";
  } else {
    document.getElementById("lang-en").className =
      "bg-cyan-500 text-black px-2 py-1 rounded-lg transition duration-200";
    document.getElementById("lang-bn").className =
      "px-2 py-1 text-gray-400 transition duration-200";
  }

  // Update static layout translations
  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    if (translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });

  // Update input placeholders
  document.querySelectorAll("[data-placeholder-key]").forEach((el) => {
    const key = el.getAttribute("data-placeholder-key");
    if (translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  // Re-render UI components based on updated state
  renderPublications();
  if (!document.getElementById("dynamic-page").classList.contains("hidden")) {
    renderDashboardContent();
  }
}

// ==========================================
// DYNAMIC NAVIGATION LAYOUT CONTROLLER
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

// Global Category Navigation Router
function loadCategoryPage(category, subCategorySub) {
  currentCategory = category;
  currentSubCategory = subCategorySub;

  // Set breadcrumbs
  document.getElementById("bc-level").innerText = category;
  document.getElementById("bc-subject").innerText = subCategorySub;

  document.getElementById("dynamic-title").innerText =
    `${category} - ${subCategorySub}`;
  document.getElementById("dynamic-badge").innerText = category;

  renderChapterSidebar();
  renderDashboardContent();
  showDynamicPage();
}

function mobileNavSelect(category, subCategory) {
  toggleMobileDrawer();
  loadCategoryPage(category, subCategory);
}

function toggleMobileDrawer() {
  const drawer = document.getElementById("mobile-drawer");
  drawer.classList.toggle("hidden");
}

// শ্রেণি পরিবর্তন ড্রপ-ডাউন হ্যান্ডলার (Class Switcher Dropdown Handler)
function handleClassSelect(val) {
  if (!val) return;

  let category = "স্কুল";
  if (val === "একাদশ" || val === "দ্বাদশ" || val === "HSC প্রস্তুতি") {
    category = "কলেজ";
  }

  loadCategoryPage(category, val);
}

// ==========================================
// SIDEBAR ACCORDION CONTROLLER
// ==========================================
function renderChapterSidebar() {
  const sidebar = document.getElementById("dynamic-sidebar");
  sidebar.innerHTML = "";

  const subjects = [
    "পদার্থবিজ্ঞান",
    "রসায়ন",
    "উচ্চতর গণিত",
    "জীববিজ্ঞান",
    "ইংরেজি",
  ];
  const chapters = ["১ম অধ্যায়", "২য় অধ্যায়", "৩য় অধ্যায়", "৪র্থ অধ্যায়"];

  subjects.forEach((subj, sIdx) => {
    const accId = `sidebar-subj-${sIdx}`;
    let chapterLinks = "";

    chapters.forEach((chap) => {
      const activeClass =
        currentSubject === subj && currentChapter === chap
          ? "bg-cyan-500/15 text-cyan-400 font-bold border-l-2 border-cyan-500"
          : "text-theme-muted hover:bg-cyan-500/5 hover:text-cyan-400";

      chapterLinks += `
        <a href="javascript:void(0)" 
           onclick="selectChapter('${subj}', '${chap}')" 
           class="block py-2 px-3 text-xs rounded-lg transition pl-6 ${activeClass}">
          📖 ${chap}
        </a>
      `;
    });

    sidebar.innerHTML += `
      <div class="border-b border-theme/50 pb-2">
        <button onclick="toggleAccordion('${accId}')" class="flex items-center justify-between w-full font-bold text-xs py-2 text-theme hover:text-cyan-400 transition">
          <span>📘 ${subj}</span>
          <span class="text-[10px] text-gray-500">▼</span>
        </button>
        <div id="${accId}" class="hidden mt-1 space-y-1">
          ${chapterLinks}
        </div>
      </div>
    `;
  });

  // Open first subject accordion by default
  setTimeout(() => {
    toggleAccordion("sidebar-subj-0");
  }, 50);
}

function toggleAccordion(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("hidden");
}

function selectChapter(subj, chap) {
  currentSubject = subj;
  currentChapter = chap;
  document.getElementById("bc-subject").innerText = `${subj} / ${chap}`;
  renderChapterSidebar();
  renderDashboardContent();
}

// ==========================================
// DYNAMIC 4-TAB DASHBOARD RENDERER
// ==========================================
function switchChapterTab(tab) {
  activeTab = tab;

  // Highlight active tab button visually
  const tabs = ["overview", "learn", "practice", "resources"];
  tabs.forEach((t) => {
    const btn = document.getElementById(`tab-btn-${t}`);
    const panel = document.getElementById(`tab-${t}`);

    if (t === tab) {
      btn.className =
        "flex-1 py-3 px-4 rounded-xl transition text-center bg-cyan-500 text-black shadow-md";
      panel.classList.remove("hidden");
    } else {
      btn.className =
        "flex-1 py-3 px-4 rounded-xl transition text-center text-theme-muted hover:bg-theme-secondary hover:text-theme";
      panel.classList.add("hidden");
    }
  });

  renderDashboardContent();
}

function renderDashboardContent() {
  const isBN = currentLanguage === "BN";
  const mat = chapterMaterials["১ম অধ্যায়"]; // Fallback safe mock database lookup

  // 1. Overview Rendering
  const introText = isBN ? mat.overview.intro_bn : mat.overview.intro_en;
  document.getElementById("overview-intro").innerText = introText;

  const outcomesContainer = document.getElementById("overview-outcomes");
  outcomesContainer.innerHTML = "";
  const outcomesList = isBN
    ? mat.overview.outcomes_bn
    : mat.overview.outcomes_en;
  outcomesList.forEach((out) => {
    outcomesContainer.innerHTML += `
      <div class="p-3.5 bg-theme-secondary rounded-xl border border-theme text-xs text-theme-muted">
        ${out}
      </div>
    `;
  });

  // 2. Learn Rendering
  const learnArea = document.getElementById("learn-cards-area");
  learnArea.innerHTML = `
    <div class="bg-theme border border-theme p-5 rounded-2xl space-y-4">
      <h4 class="font-bold text-sm text-cyan-400">📖 ${isBN ? "বোর্ড বই অধ্যায়" : "Board Book Chapter"}</h4>
      <p class="text-xs text-theme-muted leading-relaxed">${isBN ? mat.learn.board_book_bn : mat.learn.board_book_en}</p>
      <button onclick="openInteractivePDFReader()" class="bg-cyan-500 text-black font-extrabold px-4 py-2 rounded-xl text-xs">${isBN ? "অনলাইনে পড়ুন" : "Read Online"}</button>
    </div>
    <div class="bg-theme border border-theme p-5 rounded-2xl space-y-4">
      <h4 class="font-bold text-sm text-purple-400">🎥 ${isBN ? "ভিডিও লেকচার" : "Video Lecture"}</h4>
      <div class="aspect-video bg-black rounded-xl overflow-hidden border border-theme">
        <iframe class="w-full h-full" src="${mat.learn.video_url}" frameborder="0" allowfullscreen></iframe>
      </div>
    </div>
  `;

  // 3. Practice Rendering
  const practiceArea = document.getElementById("practice-cards-area");
  practiceArea.innerHTML = `
    <div onclick="openWordListModal()" class="bg-theme border border-theme p-5 rounded-2xl cursor-pointer hover:border-cyan-500 transition space-y-2">
      <span class="text-2xl">📚</span>
      <h4 class="font-bold text-sm text-theme">${isBN ? "শব্দ তালিকা ও উচ্চারণ" : "Word Meanings & Practice"}</h4>
      <p class="text-[10px] text-theme-muted">${isBN ? "অধ্যায়ের প্রয়োজনীয় শব্দভাণ্ডার চর্চা করুন।" : "Practice vocabulary and pronunciation."}</p>
    </div>
    <div onclick="openSpellingModal()" class="bg-theme border border-theme p-5 rounded-2xl cursor-pointer hover:border-purple-500 transition space-y-2">
      <span class="text-2xl">🔤</span>
      <h4 class="font-bold text-sm text-theme">${isBN ? "বানান খেলা" : "Spelling Game"}</h4>
      <p class="text-[10px] text-theme-muted">${isBN ? "বানান চর্চা ও অটো-কারেকশন গেম।" : "Interactive spelling correction sandbox."}</p>
    </div>
    <div onclick="openMeaningModal()" class="bg-theme border border-theme p-5 rounded-2xl cursor-pointer hover:border-emerald-500 transition space-y-2">
      <span class="text-2xl">💡</span>
      <h4 class="font-bold text-sm text-theme">${isBN ? "ইন্টারেক্টিভ ফ্ল্যাশ কার্ড" : "Interactive Flashcard"}</h4>
      <p class="text-[10px] text-theme-muted">${isBN ? "কার্ড উল্টে মজার ছলে অর্থ মুখস্থ করুন।" : "Flip cards to memorize meanings easily."}</p>
    </div>
    <div onclick="openMCQModal()" class="bg-theme border border-theme p-5 rounded-2xl cursor-pointer hover:border-indigo-500 transition space-y-2 col-span-full">
      <span class="text-2xl">☑</span>
      <h4 class="font-bold text-sm text-theme">${isBN ? "অটোমেটেড পরীক্ষা দিন" : "Take MCQ Practice Test"}</h4>
      <p class="text-[10px] text-theme-muted">${isBN ? "নির্ধারিত প্রশ্নের উত্তর দিয়ে ইনস্ট্যান্ট স্কোর জানুন।" : "Instant scoring with automatic validation."}</p>
    </div>
  `;

  // 4. Resources Rendering
  const resourcesArea = document.getElementById("resources-list-area");
  resourcesArea.innerHTML = `
    <h3 class="text-lg font-bold text-cyan-400 border-b border-theme pb-2">${isBN ? "সহায়ক রিসোর্স ডাউনলোড" : "Download Reference Material"}</h3>
    <div class="divide-y divide-theme/60 text-xs">
      <div class="py-3 flex justify-between items-center">
        <span>📄 ${isBN ? "অধ্যায় হ্যান্ডনোট PDF" : "Physics Chapter Handnote PDF"}</span>
        <button onclick="alert('ডাউনলোড শুরু হচ্ছে...')" class="bg-theme border border-theme px-3 py-1.5 rounded-lg text-theme hover:bg-cyan-500 hover:text-black">Download</button>
      </div>
      <div class="py-3 flex justify-between items-center">
        <span>📄 ${isBN ? "বিগত ৫ বছরের বোর্ড প্রশ্ন সমাধান" : "Last 5 Years Board Q&A"}</span>
        <button onclick="alert('ডাউনলোড শুরু হচ্ছে...')" class="bg-theme border border-theme px-3 py-1.5 rounded-lg text-theme hover:bg-cyan-500 hover:text-black">Download</button>
      </div>
    </div>
  `;
}

// ==========================================
// RENDER PUBLICATIONS WITH HOVER EFFECT
// ==========================================
function renderPublications() {
  const grid = document.getElementById("publications-grid");
  if (!grid) return;

  grid.innerHTML = "";
  publicationsData.forEach((pub) => {
    const title = currentLanguage === "BN" ? pub.title_bn : pub.title_en;
    const desc = currentLanguage === "BN" ? pub.desc_bn : pub.desc_en;
    const author = currentLanguage === "BN" ? pub.author_bn : pub.author_en;
    const price = currentLanguage === "BN" ? pub.price_bn : pub.price_en;
    const oldPrice =
      currentLanguage === "BN" ? pub.old_price_bn : pub.old_price_en;
    const discount =
      currentLanguage === "BN" ? pub.discount_bn : pub.discount_en;
    const buyText = currentLanguage === "BN" ? "অর্ডার করুন ➔" : "Buy Book ➔";

    grid.innerHTML += `
      <div class="bg-theme border border-theme rounded-2xl p-5 peace-wave flex flex-col justify-between cursor-pointer" onclick="openPublicationDetail('${pub.id}')">
        <div>
          <div class="h-36 w-full ${pub.cover_style} rounded-xl mb-4 flex flex-col justify-between p-3 relative shadow-inner">
            <span class="text-[9px] font-black tracking-wider text-cyan-300 uppercase">PIBESH BOOK</span>
            <h4 class="text-xs font-extrabold leading-tight">${title}</h4>
            <span class="text-[9px] opacity-75">by ${author}</span>
            <div class="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
              ${discount}
            </div>
          </div>
          <h4 class="text-xs font-bold text-theme mb-1 leading-snug">${title}</h4>
          <p class="text-[10px] text-theme-muted line-clamp-2">${desc}</p>
        </div>
        <div class="border-t border-theme/50 pt-4 mt-4 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-theme-muted block line-through font-bold">${oldPrice}</span>
            <span class="text-sm font-black text-cyan-400">${price}</span>
          </div>
          <button class="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[10px] py-1.5 px-3 rounded-lg transition">
            ${buyText}
          </button>
        </div>
      </div>
    `;
  });
}

function openPublicationDetail(id) {
  const pub = publicationsData.find((p) => p.id === id);
  if (!pub) return;

  const title = currentLanguage === "BN" ? pub.title_bn : pub.title_en;
  const desc = currentLanguage === "BN" ? pub.desc_bn : pub.desc_en;
  const price = currentLanguage === "BN" ? pub.price_bn : pub.price_en;
  const oldPrice =
    currentLanguage === "BN" ? pub.old_price_bn : pub.old_price_en;
  const discount = currentLanguage === "BN" ? pub.discount_bn : pub.discount_en;

  openSkillDetail(
    title,
    desc,
    price,
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    oldPrice,
    discount,
  );
}

// ==========================================
// MODAL MANAGEMENT SYSTEMS
// ==========================================
function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

// Details Modal
function openSkillDetail(
  title,
  desc,
  price,
  videoUrl,
  oldPrice = "",
  discount = "",
) {
  document.getElementById("detail-title").innerText = title;
  document.getElementById("detail-desc").innerText = desc;
  document.getElementById("detail-price").innerText = price;
  document.getElementById("detail-video-iframe").src = videoUrl;

  const oldPriceEl = document.getElementById("detail-old-price");
  const discountEl = document.getElementById("detail-discount");

  if (oldPrice) {
    oldPriceEl.innerText = oldPrice;
    oldPriceEl.classList.remove("hidden");
  } else {
    oldPriceEl.classList.add("hidden");
  }

  if (discount) {
    discountEl.innerText = discount;
    discountEl.classList.remove("hidden");
  } else {
    discountEl.classList.add("hidden");
  }

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
    alert(
      currentLanguage === "BN"
        ? "দয়া করে সমস্ত তথ্য সঠিকভাবে পূরণ করুন।"
        : "Please fill in all information.",
    );
    return;
  }

  alert(
    currentLanguage === "BN"
      ? `ধন্যবাদ ${name}! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।`
      : `Thank you ${name}! Your order has been placed successfully.`,
  );
  closeModal("course-details");
}

// 1. Word List Modal Features
function openWordListModal() {
  document.getElementById("word-search").value = "";
  filteredWords = [...schoolWords];
  wordCurrentPage = 1;
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
    tableBody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-theme-muted">কোনো শব্দ খুঁজে পাওয়া যায়নি।</td></tr>`;
    return;
  }

  pageWords.forEach((item, index) => {
    const globalIdx = startIndex + index;
    tableBody.innerHTML += `
      <tr class="hover:bg-cyan-500/5 transition">
        <td class="p-3 font-bold text-theme">${item.word}</td>
        <td class="p-3 text-theme">${item.meaning}</td>
        <td class="p-3 text-right">
          <button onclick="toggleWordComplete(${globalIdx})" class="px-2 py-1 text-[10px] font-bold rounded-lg ${item.completed ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-theme-secondary text-theme-muted border border-theme"}">
            ${item.completed ? "✓ Complete" : "Mark Done"}
          </button>
        </td>
      </tr>
    `;
  });

  const totalPages = Math.ceil(filteredWords.length / wordsPerPage);
  document.getElementById("wl-pagination-text").innerText =
    `Page ${wordCurrentPage} of ${totalPages}`;
}

function toggleWordComplete(idx) {
  filteredWords[idx].completed = !filteredWords[idx].completed;
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

// 2. Spelling Game
let spellingTarget = {};
function openSpellingModal() {
  document.getElementById("spelling-input").value = "";
  document.getElementById("spelling-feedback").innerText = "";
  spellingTarget = schoolWords[Math.floor(Math.random() * schoolWords.length)];
  document.getElementById("spelling-bangla").innerText = spellingTarget.meaning;
  openModal("spelling-modal");
}

function checkSpelling() {
  const input = document
    .getElementById("spelling-input")
    .value.trim()
    .toLowerCase();
  const feedback = document.getElementById("spelling-feedback");
  if (input === spellingTarget.word.toLowerCase()) {
    feedback.className = "text-xs font-bold text-emerald-400";
    feedback.innerText = "✓ অসাধারণ! সঠিক বানান হয়েছে।";
    setTimeout(openSpellingModal, 1500);
  } else {
    feedback.className = "text-xs font-bold text-red-400";
    feedback.innerText = "❌ ভুল হয়েছে! আবার চেষ্টা করুন।";
  }
}

// 3. Flashcards
function openMeaningModal() {
  currentWordIndex = 0;
  loadFlashcard();
  openModal("meaning-modal");
}

function loadFlashcard() {
  const item = schoolWords[currentWordIndex];
  document.getElementById("card-main-text").innerText = item.word;
  document.getElementById("card-sub-text").innerText = item.meaning;
  document.getElementById("card-sub-text").classList.add("hidden");
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

// 4. MCQ Modal Integration
function openMCQModal() {
  document.getElementById("mcq-modal-subtitle").innerText =
    `${currentSubject} → ${currentChapter}`;
  renderMCQQuestions();
  openModal("mcq-modal");
}

function renderMCQQuestions() {
  const container = document.getElementById("mcq-questions-container");
  container.innerHTML = "";
  let correctCount = 0;

  schoolMCQs.forEach((q, qIdx) => {
    let optionsHTML = "";
    const optionsList = currentLanguage === "BN" ? q.options_bn : q.options_en;
    const questionText =
      currentLanguage === "BN" ? q.question_bn : q.question_en;

    optionsList.forEach((opt, optIdx) => {
      let style = "border-theme bg-theme-secondary text-theme";
      if (q.userAnswer !== null) {
        if (optIdx === q.answer) {
          style =
            "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold";
        } else if (optIdx === q.userAnswer) {
          style = "border-red-500 bg-red-500/10 text-red-400 font-bold";
        } else {
          style = "border-theme opacity-50";
        }
      }

      optionsHTML += `
        <label class="flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${style}" ${q.userAnswer === null ? `onclick="submitMCQ(${qIdx}, ${optIdx})"` : ""}>
          <input type="radio" name="mcq_ans_${q.id}" class="accent-indigo-600" ${q.userAnswer === optIdx ? "checked" : ""} ${q.userAnswer !== null ? "disabled" : ""}/>
          <span>${opt}</span>
        </label>
      `;
    });

    if (q.userAnswer !== null && q.userAnswer === q.answer) correctCount++;

    container.innerHTML += `
      <div class="bg-theme p-5 rounded-2xl border border-theme space-y-3">
        <h4 class="font-bold text-xs">${qIdx + 1}. ${questionText}</h4>
        <div class="grid grid-cols-2 gap-3">${optionsHTML}</div>
      </div>
    `;
  });

  document.getElementById("mcq-solved-count").innerText =
    `${correctCount}/${schoolMCQs.length}`;
}

function submitMCQ(qIdx, optIdx) {
  if (schoolMCQs[qIdx].userAnswer !== null) return;
  schoolMCQs[qIdx].userAnswer = optIdx;
  renderMCQQuestions();
}

// 5. PDF Reader Interface
function openInteractivePDFReader() {
  const mat = chapterMaterials["১ম অধ্যায়"];
  document.getElementById("pdf-reader-title").innerText =
    `${currentSubject} - ${currentChapter} কনসেপ্ট বুক`;
  document.getElementById("pdf-reader-body").innerHTML = `
    <div class="space-y-4">
      <h3 class="text-xl font-bold text-cyan-400">📝 অধ্যায়ের সংক্ষিপ্ত নোটস (Summary Sheet)</h3>
      <p>${currentLanguage === "BN" ? mat.overview.intro_bn : mat.overview.intro_en}</p>
      <div class="bg-theme-secondary p-5 rounded-xl border border-theme space-y-2">
        <h4 class="font-bold text-cyan-400">💡 প্র্যাক্টিকাল রুলস ও লজিক</h4>
        <p>গতির প্রধান সমীকরণগুলো হলো:</p>
        <ul class="list-disc pl-5 space-y-1 text-theme-muted font-bold">
          <li>v = u + at</li>
          <li>s = ut + ½at²</li>
          <li>v² = u² + 2as</li>
        </ul>
      </div>
    </div>
  `;
  openModal("pdf-reader-modal");
}

function adjustReaderFont(type) {
  const body = document.getElementById("pdf-reader-body");
  const currentSize = parseFloat(window.getComputedStyle(body).fontSize);
  body.style.fontSize =
    type === "plus" ? `${currentSize + 2}px` : `${currentSize - 2}px`;
}

// 6. Question Paper Generator
function openQGenModal() {
  document.getElementById("qgen-lbl-class").innerText = currentSubCategory;
  document.getElementById("qgen-lbl-subject").innerText = currentSubject;
  openModal("qgen-modal");
}

function triggerGeneratePaper() {
  closeModal("qgen-modal");

  const container = document.getElementById("printed-questions-area");
  container.innerHTML = `
    <div class="space-y-4 text-slate-800">
      <h3 class="font-bold border-b border-slate-300 pb-1">১. বহুনির্বাচনী প্রশ্ন (MCQ):</h3>
      <div class="space-y-3 pl-4">
        <div>
          <p>ক) বলের এসআই (SI) একক কোনটি?</p>
          <p class="text-slate-500 pl-4">১. প্যাসকেল &nbsp;&nbsp;&nbsp;&nbsp; ২. জুল &nbsp;&nbsp;&nbsp;&nbsp; ৩. নিউটন &nbsp;&nbsp;&nbsp;&nbsp; ৪. ওয়াট</p>
        </div>
        <div>
          <p>খ) গতির ১ম সমীকরণ কোনটি?</p>
          <p class="text-slate-500 pl-4">১. v = u + at &nbsp;&nbsp;&nbsp;&nbsp; ২. s = vt &nbsp;&nbsp;&nbsp;&nbsp; ৩. F = ma</p>
        </div>
      </div>
    </div>
  `;
  openModal("print-paper-modal");
}

// 7. Dynamic Projects Loader
function loadProjectsPage() {
  loadCategoryPage("প্রজেক্ট ল্যাব", "সকল প্রজেক্ট");

  // Custom project template injected on Grid
  const grid = document.getElementById("dynamic-grid");
  grid.innerHTML = `
    <div class="bg-theme border border-theme p-6 rounded-2xl flex flex-col justify-between peace-wave">
      <div>
        <span class="text-[10px] font-black uppercase px-2.5 py-1 rounded-full badge-kids">👦 KIDS ZONE</span>
        <h4 class="text-lg font-bold text-theme mt-3">DIY Solar Toy Car Kit</h4>
        <p class="text-xs text-theme-muted mt-2">সৌর শক্তির চমৎকার ও রোমাঞ্চকর পরীক্ষা! প্যানেল ও গিয়ার সহ প্রজেক্ট বিজ্ঞান বক্স।</p>
      </div>
      <div class="border-t border-theme pt-4 mt-6 flex justify-between items-center text-xs">
        <span class="font-bold text-cyan-400 text-base">৳ ৪৫০</span>
        <button onclick="openSkillDetail('DIY Solar Toy Car', 'সৌর শক্তির অবিশ্বাস্য ম্যাজিক টেস্ট!', '৳ ৪৫০', 'https://www.youtube.com/embed/dQw4w9WgXcQ')" class="bg-cyan-500 text-black px-3 py-1.5 rounded-lg font-bold">অর্ডার করুন</button>
      </div>
    </div>

    <div class="bg-theme border border-theme p-6 rounded-2xl flex flex-col justify-between peace-wave">
      <div>
        <span class="text-[10px] font-black uppercase px-2.5 py-1 rounded-full badge-upper">🚀 UPPER LEVEL</span>
        <h4 class="text-lg font-bold text-theme mt-3">Smart Home IoT Box</h4>
        <p class="text-xs text-theme-muted mt-2">আর্ডুইনো নোড-এমসিইউ এবং সেন্সর ব্যবহার করে অটোমেটেড প্রোজেক্ট মেকিং কিট।</p>
      </div>
      <div class="border-t border-theme pt-4 mt-6 flex justify-between items-center text-xs">
        <span class="font-bold text-cyan-400 text-base">৳ ২,৯৯৯</span>
        <button onclick="openSkillDetail('Smart Home IoT Box', 'আর্ডুইনো স্মার্ট সেচ প্রোজেক্ট', '৳ ২,৯৯৯', 'https://www.youtube.com/embed/dQw4w9WgXcQ')" class="bg-cyan-500 text-black px-3 py-1.5 rounded-lg font-bold">অর্ডার করুন</button>
      </div>
    </div>
  `;
}

// 8. Auth / Subscription Simulations
function switchAuthTab(tab) {
  const loginBtn = document.getElementById("auth-tab-login");
  const registerBtn = document.getElementById("auth-tab-register");
  const nameField = document.getElementById("auth-field-name");

  if (tab === "login") {
    loginBtn.className = "flex-1 py-3 text-cyan-400 border-b-2 border-cyan-400";
    registerBtn.className = "flex-1 py-3 text-theme-muted";
    nameField.classList.add("hidden");
    document.getElementById("auth-btn-submit").innerText =
      currentLanguage === "BN" ? "লগইন করুন" : "Sign In";
  } else {
    registerBtn.className =
      "flex-1 py-3 text-cyan-400 border-b-2 border-cyan-400";
    loginBtn.className = "flex-1 py-3 text-theme-muted";
    nameField.classList.remove("hidden");
    document.getElementById("auth-btn-submit").innerText =
      currentLanguage === "BN" ? "রেজিস্ট্রেশন করুন" : "Register Now";
  }
}

function handleAuthSubmit() {
  alert(
    currentLanguage === "BN"
      ? "অনুরোধটি সফল হয়েছে! স্বাগতম পিবেশে।"
      : "Welcome to PIBESH! Dynamic registration successful.",
  );
  closeModal("login-modal");
}

function openLoginModal() {
  switchAuthTab("login");
  openModal("login-modal");
}

function openSubscriptionModal() {
  document.getElementById("sub-phone").value = "";
  openModal("subscription-modal");
}

function submitSubscription() {
  const phone = document.getElementById("sub-phone").value;
  if (!phone) {
    alert(
      currentLanguage === "BN"
        ? "দয়া করে পেমেন্ট নম্বর দিন!"
        : "Please provide billing number.",
    );
    return;
  }
  alert(
    currentLanguage === "BN"
      ? "পেমেন্ট রিকোয়েস্ট জমা হয়েছে! ২৪ ঘন্টার মধ্যে একটিভ হবে।"
      : "VIP Request submitted! Access will activate shortly.",
  );
  closeModal("subscription-modal");
}

// ==========================================
// BACKGROUND FLOATING SYMBOLS
// ==========================================
const educationalSymbols = [
  "π",
  "H₂O",
  "E=mc²",
  "Ω",
  "Σ",
  "∫",
  "√",
  "F=ma",
  "CO₂",
  "✏️",
  "📖",
];

function initDynamicBackground() {
  const container = document.getElementById("dynamic-educational-bg");
  if (!container) return;

  container.innerHTML = "";
  const totalSymbols = 22; // Balanced performance threshold

  for (let i = 0; i < totalSymbols; i++) {
    const el = document.createElement("div");
    el.className = "floating-symbol";
    el.innerText =
      educationalSymbols[Math.floor(Math.random() * educationalSymbols.length)];

    const size = Math.floor(Math.random() * (36 - 16 + 1)) + 16;
    el.style.fontSize = `${size}px`;
    el.style.left = `${Math.random() * 100}%`;

    const duration = Math.random() * (30 - 15) + 15;
    const delay = Math.random() * -duration;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;

    container.appendChild(el);
  }
}

// Esc Key Event Listener to dismiss active modals
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
    closeModal("pdf-reader-modal");
  }
});

// System Initializer on window load
window.onload = function () {
  renderPublications();
  initDynamicBackground();
};
