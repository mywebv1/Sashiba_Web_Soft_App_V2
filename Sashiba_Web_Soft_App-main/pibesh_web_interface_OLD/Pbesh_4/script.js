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

// Technical Skill Database (Optimized Description and Discount)
const skillsData = [
  {
    id: "skill-chatgpt",
    title: "ChatGPT AI Design Masterclass",
    desc_bn:
      "প্রম্পট ইঞ্জিনিয়ারিং ও এআই টেকনোলজি ব্যবহার করে অ্যাডভান্সড কন্টেন্ট রাইটিং, হাই-কনভার্টিং গ্রাফিক্স ও কোডিং জেনারেশন শিখুন সম্পূর্ণ প্রফেশনালি। রিয়েল প্রজেক্ট গ্যারান্টি!",
    desc_en:
      "Learn advanced content writing, high-converting graphics generation, and software coding using prompts and AI technology professionally with real-world projects.",
    price: "৳ ৯৯৯",
    old_price: "৳ ৩,৫০০",
    discount: "৭১% ছাড়",
    modules_bn: "১৪টি মডিউল",
    modules_en: "14 Modules",
    category: "upper",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "skill-claude",
    title: "Claude AI Advanced Coding System",
    desc_bn:
      "অর্গানাইজড ডেভেলপমেন্ট ও প্রজেক্ট ক্রিয়েশনে এআই এর সুপার পাওয়ার কাজে লাগানোর কমপ্লিট ডাইনামিক হ্যান্ডস-অন প্রজেক্ট কোর্স!",
    desc_en:
      "A complete hands-on project course harnessing the incredible power of Claude AI for organized development and robust software creation.",
    price: "৳ ১,১৯৯",
    old_price: "৳ ৩,৯৯৯",
    discount: "৭০% ছাড়",
    modules_bn: "১২টি মডিউল",
    modules_en: "12 Modules",
    category: "upper",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "skill-uiux",
    title: "UI/UX Figma Design Blueprint",
    desc_bn:
      "প্রিমিয়াম কোয়ালিটি মোবাইল অ্যাপ এবং ওয়েবসাইট ইউজার ইন্টারফেস ডিজাইন করে আপওয়ার্ক ও ফাইভারের গ্লোবাল মার্কেটে আপনার সফল ক্যারিয়ার গড়ুন।",
    desc_en:
      "Build a successful career on global freelance marketplaces by designing premium mobile app and website user interfaces using Figma.",
    price: "৳ ১,৪৯৯",
    old_price: "৳ ৪,৯৯৯",
    discount: "৭০% ছাড়",
    modules_bn: "২৮টি মডিউল",
    modules_en: "28 Modules",
    category: "upper",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "skill-kids-scratch",
    title: "Scratch Kids Coding Magic",
    desc_bn:
      "ছোট বাচ্চাদের জন্য অত্যন্ত সহজ ও খেলার ছলে ব্লক-ভিত্তিক কোডিং লজিক শিখিয়ে গেম বানানোর কমপ্লিট গাইডলাইন!",
    desc_en:
      "A complete block-based coding guide for young kids to learn programming logic and design games playfully.",
    price: "৳ ৫৯৯",
    old_price: "৳ ১,৯৯৯",
    discount: "৭০% ছাড়",
    modules_bn: "১০টি ভিডিও মডিউল",
    modules_en: "10 Video Modules",
    category: "kids",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

// Physical Kits and Virtual Projects Database
const projectsData = [
  {
    id: "proj-solar",
    title: "DIY Solar-Powered Toy Car Kit",
    category: "kids",
    desc_bn:
      "ছোট্ট বাচ্চাদের জন্য সৌর শক্তির অবিশ্বাস্য জাদুর সরাসরি পরীক্ষা! চমৎকার ফিজিক্যাল গিয়ার্স ও সোলার প্যানেল সহ বিজ্ঞান বাক্সের আদলে তৈরি প্রজেক্ট কিট।",
    desc_en:
      "An incredible physical test of solar power for young kids! Comes with solar panels, gears, and wires in a beautiful project science box.",
    price: "৳ ৪৫০",
    old_price: "৳ ১,৫০০",
    discount: "৭০% ছাড়",
    modules_bn: "কমপ্লিট কিট + ভিডিও গাইড",
    modules_en: "Full Kit + Video Guide",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "proj-led",
    title: "LED Electronic Maze Game Kit",
    category: "kids",
    desc_bn:
      "সহজ সার্কিট মেকিং এবং ওয়ারিং প্যাটার্ন তৈরি করে খেলার ছলে ছোটদের ইলেকট্রনিক্স এর মূল ভিত্তি শক্তিশালী করার কমপ্লিট প্যাকেজ।",
    desc_en:
      "Strengthen the foundation of electronics in children playfully by constructing simple circuits and building wire loops.",
    price: "৳ ৩৫০",
    old_price: "৳ ১,২০০",
    discount: "৭১% ছাড়",
    modules_bn: "কিট + ভিডিও টিউটোরিয়াল",
    modules_en: "Kit + Video Tutorial",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "proj-iot",
    title: "Smart Irrigation Home IoT Box",
    category: "upper",
    desc_bn:
      "আর্ডুইনো নোড-এমসিইউ, সয়েল ময়েশ্চার সেন্সর এবং পাম্প ব্যবহার করে স্বয়ংক্রিয় সেচ প্রজেক্ট ডেভেলপমেন্ট প্র্যাক্টিকাল প্যাকেজ (বড়দের জন্য)।",
    desc_en:
      "Design an automated watering system using Arduino, soil moisture sensors, and dynamic pumps (designed for advanced learners).",
    price: "৳ ২,৯৯৯",
    old_price: "৳ ৭,৯৯৯",
    discount: "৬২% ছাড়",
    modules_bn: "আইওটি হার্ডওয়্যার কিট",
    modules_en: "Complete IoT Hardware Kit",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "proj-chatbot",
    title: "AI Chatbot Assistant using Python",
    category: "upper",
    desc_bn:
      "পাইথন ও ওপেনএআই এপিআই দিয়ে সম্পূর্ণ নিজস্ব প্রফেশনাল চ্যাটবট ডেভলপমেন্ট করার মাস্টারক্লাস কোর্স। রিয়েল ওয়ার্ল্ড এপিআই কলিং গাইডলাইন।",
    desc_en:
      "Build a customized generative AI assistant with Python, LangChain, and OpenAI API with real-world deployment guidelines.",
    price: "৳ ৮৯৯",
    old_price: "৳ ২,৯৯৯",
    discount: "৭০% ছাড়",
    modules_bn: "১০টি ভিডিও লেকচার",
    modules_en: "10 Video Lectures",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

// Publications Mock Database
const publicationsData = [
  {
    id: "pub-n8n",
    title: "n8n দিয়ে কমপ্লিট অটোমেশন",
    desc_bn:
      "ঘুমে থেকেও কিভাবে এআই দিয়ে আপনার বিজনেস অটোমেট করবেন? ওয়ার্কফ্লো জেনারেশন ও জ্যাপিয়ার ছাড়া n8n ব্যবহার করার একদম প্র্যাক্টিকাল বুক।",
    desc_en:
      "Learn how to automate your business workflows while sleeping. Practical integration with n8n, OpenAI, and cloud systems.",
    price: "৳ ১৯৯",
    old_price: "৳ ৪৯৯",
    discount: "৬০% ছাড়",
    author_bn: "সাব্বির আহমেদ",
    author_en: "Sabbir Ahmed",
    cover_style: "bg-gradient-to-br from-indigo-900 to-indigo-700 text-white",
  },
  {
    id: "pub-code",
    title: "ক্লুড কোড - AI ড্রিভেন ওয়েব",
    desc_bn:
      "এইচটিএমএল বা সিএসএস না জানলেও কিভাবে এআই প্রম্পটিং দিয়ে চমৎকার আধুনিক ডায়নামিক ওয়েব অ্যাপ্লিকেশন ডেভেলপ করবেন তার এক্সক্লুসিভ গাইড বুক।",
    desc_en:
      "Build elegant, modern web apps with custom prompts without prior HTML/CSS expertise.",
    price: "৳ ১৯৯",
    old_price: "৳ ৪৯৯",
    discount: "৬০% ছাড়",
    author_bn: "সাব্বির আহমেদ",
    author_en: "Sabbir Ahmed",
    cover_style: "bg-gradient-to-br from-cyan-900 to-blue-700 text-white",
  },
  {
    id: "pub-excel",
    title: "এআই ড্রিভেন এক্সেল মাস্টারি",
    desc_bn:
      "কর্পোরেট দুনিয়ার জটিল সব ফর্মুলা ও এক্সেল চার্টিং ডেটা অ্যানালাইসিস এআই দিয়ে মাত্র এক ক্লিকে সমাধান করার দুর্দান্ত কৌশল।",
    desc_en:
      "Solve critical financial formulas and visual charting in Excel within clicks using custom generative AI techniques.",
    price: "৳ ১৯৯",
    old_price: "৳ ৪৯৯",
    discount: "৬০% ছাড়",
    author_bn: "সাব্বির আহমেদ",
    author_en: "Sabbir Ahmed",
    cover_style: "bg-gradient-to-br from-emerald-900 to-teal-800 text-white",
  },
  {
    id: "pub-prompt",
    title: "প্রম্পট ইঞ্জিনিয়ারিং ৮.০ - এআই",
    desc_bn:
      "এআই জগতে প্রম্পট ইঞ্জিনিয়ারিং অত্যন্ত মূল্যবান স্কিল। কিভাবে ক্লড এবং চ্যাটজিপিটি থেকে সেরা আউটপুট বের করবেন তার একটি কমপ্লিট হ্যান্ডবুক।",
    desc_en:
      "A comprehensive prompt engineering manual to optimize output precision using ChatGPT and Claude systems.",
    price: "৳ ১৯৯",
    old_price: "৳ ৫০০",
    discount: "৬০% ছাড়",
    author_bn: "সাব্বির আহমেদ",
    author_en: "Sabbir Ahmed",
    cover_style: "bg-gradient-to-br from-purple-900 to-indigo-800 text-white",
  },
];

// Interactive PDF summaries / learning materials database
const chapterMaterials = {
  "১ম অধ্যায়": {
    title: "Chapter 1 - Summary & Cheat Sheets",
    summary: `
      <div class="space-y-4">
        <h4 class="text-xl font-bold text-cyan-400">📝 অধ্যায়ের সংক্ষিপ্ত নোটস (Quick Summary)</h4>
        <p class="text-theme">এই অধ্যায়ে আমরা মূলত ইংরেজি ভাষা ও ব্যাকরণের বেসিক ফাউন্ডেশন নিয়ে আলোচনা করব। নিচের ইন্টারেক্টিভ পয়েন্টগুলো এক নজরে দেখে নাও:</p>
        <ul class="space-y-3">
          <li class="bg-theme-secondary p-4 rounded-xl border border-theme">💡 <strong>Alphabet Foundation:</strong> ইংরেজি বর্ণমালায় ২৬টি বর্ণ আছে। এর মধ্যে ৫টি Vowel এবং ২১টি Consonant.</li>
          <li class="bg-theme-secondary p-4 rounded-xl border border-theme">💡 <strong>Interactive Rule:</strong> প্রতিটি Word গঠনে অন্তত একটি Vowel (অথবা Semi-Vowel যেমন W, Y) থাকা বাধ্যতামূলক।</li>
        </ul>
        <div class="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 mt-6">
          <p class="text-sm text-amber-500 font-bold">🧠 মজার টিপস: "Rhythm" এমন একটি বড় ইংরেজি শব্দ যার মধ্যে কোনো সাধারণ Vowel (A, E, I, O, U) নেই!</p>
        </div>
      </div>
    `,
  },
};

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
// SYSTEM TRANSLATIONS DICTIONARY
// ==========================================
const translations = {
  BN: {
    "nav-school": "স্কুল কারিকুলাম",
    "nav-college": "কলেজ কারিকুলাম",
    "nav-university": "ইউনিভার্সিটি",
    "nav-projects": "প্রোজেক্টস",
    "nav-skills": "স্কিলস",
    "btn-login-header": "লগ-ইন",
    "hero-title-top": "শুধু শিখবেন না,",
    "hero-title-bottom": "তৈরি করতে শিখুন।",
    "hero-desc":
      "পিবেশ—বাংলাদেশের প্রথম প্রজেক্ট-বেজড এডুকেশন সিস্টেম। এখানে আমরা থিওরি নয়, সরাসরি হাতে-কলমে প্রজেক্ট কাজ শিখি।",
    "btn-free-trial": "ফ্রি ট্রায়াল শুরু করুন",
    "btn-premium": "প্রিমিয়াম মেম্বারশিপ",
    "pub-badge": "নতুন রিলিজ",
    "pub-header": "ফিচার্ড ই-বুক ও স্টাডি নোটস",
    "pub-subheader":
      "আমাদের নিজস্ব অভিজ্ঞ লেখকদের তৈরি প্রিমিয়াম বই ও নোটপ্যাড",
    "search-placeholder": "সার্চ করুন এখানে...",
    "footer-desc":
      "প্রজেক্ট ভিত্তিক শিক্ষা ব্যবস্থা ও স্কিল ডেভেলপমেন্টের জন্য বাংলাদেশের নির্ভরযোগ্য প্ল্যাটফর্ম। আমরা তৈরি করি আগামীর উদ্ভাবক।",
    "footer-app": "মোবাইল অ্যাপ ডাউনলোড করুন",
    "footer-col-explore": "এক্সপ্লোর করুন",
    "footer-col-support": "হেল্প ও সাপোর্ট",
    "footer-col-contact": "যোগাযোগ",
    "order-heading": "অর্ডার নিশ্চিত করতে তথ্য দিন:",
    "order-name-ph": "আপনার নাম...",
    "order-phone-ph": "মোবাইল নম্বর...",
    "order-addr-ph": "ডেলিভারি ঠিকানা...",
  },
  EN: {
    "nav-school": "School Curriculum",
    "nav-college": "College Curriculum",
    "nav-university": "University Academic",
    "nav-projects": "Projects Catalog",
    "nav-skills": "Skills Development",
    "btn-login-header": "Sign In",
    "hero-title-top": "Don't Just Learn,",
    "hero-title-bottom": "Learn to Create.",
    "hero-desc":
      "PIBESH—Bangladesh's first project-based education platform. We focus on real-world practical building rather than boring theory.",
    "btn-free-trial": "Start Free Trial",
    "btn-premium": "Premium Membership",
    "pub-badge": "New Publications",
    "pub-header": "Featured E-Books & Handnotes",
    "pub-subheader":
      "Premium books and note sheets written by our master researchers",
    "search-placeholder": "Search anything here...",
    "footer-desc":
      "The ultimate project-based and technical skills building platform in Bangladesh. We nurture the innovators of tomorrow.",
    "footer-app": "Download Mobile App",
    "footer-col-explore": "Explore",
    "footer-col-support": "Help & Support",
    "footer-col-contact": "Contact Us",
    "order-heading": "Provide Details to Confirm Order:",
    "order-name-ph": "Your Name...",
    "order-phone-ph": "Phone Number...",
    "order-addr-ph": "Shipping Address...",
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
// LANGUAGE INTERACTIVITY (ENGLISH & BANGLA FIXED)
// ==========================================
function changeLanguage(lang) {
  currentLanguage = lang;

  if (lang === "BN") {
    document.getElementById("lang-bn").className =
      "bg-cyan-500 text-black px-2 py-0.5 rounded transition duration-200";
    document.getElementById("lang-en").className =
      "px-2 py-0.5 text-gray-400 transition duration-200";
  } else {
    document.getElementById("lang-en").className =
      "bg-cyan-500 text-black px-2 py-0.5 rounded transition duration-200";
    document.getElementById("lang-bn").className =
      "px-2 py-0.5 text-gray-400 transition duration-200";
  }

  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    if (translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });

  document.querySelectorAll("[data-placeholder-key]").forEach((el) => {
    const key = el.getAttribute("data-placeholder-key");
    if (translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  renderPublications();
  updateAuthModalTranslations();
}

// ==========================================
// RENDER PUBLICATIONS WITH PEACE-WAVE HOVER EFFECT
// ==========================================
function renderPublications() {
  const grid = document.getElementById("publications-grid");
  if (!grid) return;

  grid.innerHTML = "";
  publicationsData.forEach((pub) => {
    const title = pub.title;
    const desc = currentLanguage === "BN" ? pub.desc_bn : pub.desc_en;
    const author = currentLanguage === "BN" ? pub.author_bn : pub.author_en;
    const buyText = currentLanguage === "BN" ? "অর্ডার করুন ➔" : "Buy Book ➔";

    grid.innerHTML += `
      <div class="bg-theme border border-theme rounded-2xl p-5 peace-wave flex flex-col justify-between cursor-pointer" onclick="openPublicationDetail('${pub.id}')">
        <div>
          <div class="h-44 w-full ${pub.cover_style} rounded-xl mb-4 flex flex-col justify-between p-3 relative shadow-inner">
            <span class="text-[16px] font-black tracking-widest text-cyan-300 uppercase">PIBESH BOOK</span>
            <h4 class="text-md font-extrabold leading-tight tracking-tight">${title}</h4>
            <span class="text-[16px] opacity-75">by ${author}</span>
            <div class="absolute top-2 right-2 bg-emerald-500 text-white text-[16px] font-black px-2 py-0.5 rounded-full shadow-lg">
              ${pub.discount}
            </div>
          </div>
          <h4 class="text-md font-bold text-theme mb-1.5 leading-snug">${title}</h4>
          <p class="text-xm text-theme-muted line-clamp-2">${desc}</p>
        </div>
        <div class="border-t border-theme/50 pt-4 mt-4 flex items-center justify-between">
          <div>
            <span class="text-xm text-theme-muted block line-through font-bold">${pub.old_price}</span>
            <span class="text-lg font-black text-cyan-400">${pub.price}</span>
          </div>
          <button class="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[11px] py-1.5 px-3 rounded-lg transition">
            ${buyText}
          </button>
        </div>
      </div>
    `;
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

// ==========================================
// SHOW DYNAMIC PAGE
// ==========================================
function showDynamicPage() {
  document.getElementById("hero-section").classList.add("hidden");
  document.getElementById("dynamic-page").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// TOGGLE ACCORDION
// ==========================================
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
// SEARCH INTERACTION (HEADER SEARCH FUNCTIONAL)
// ==========================================
function handleHeaderSearch(e) {
  if (e.key === "Enter") {
    triggerHeaderSearch();
  }
}

function triggerHeaderSearch() {
  const query = document
    .getElementById("header-search-box")
    .value.trim()
    .toLowerCase();
  if (!query) return;

  const matchedSkills = skillsData.filter(
    (s) =>
      s.title.toLowerCase().includes(query) ||
      s.desc_bn.toLowerCase().includes(query),
  );
  const matchedProjects = projectsData.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.desc_bn.toLowerCase().includes(query),
  );

  if (matchedSkills.length > 0) {
    loadSkillsPage();
    document.getElementById("header-search-box").value = query;
  } else if (matchedProjects.length > 0) {
    loadProjectsPage();
    document.getElementById("header-search-box").value = query;
  } else {
    alert(
      currentLanguage === "BN"
        ? `"${query}" এর জন্য কোনো প্রোডাক্ট বা কোর্স পাওয়া যায়নি!`
        : `No products or courses found for "${query}"!`,
    );
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

  setTimeout(() => {
    toggleAccordion("school-subject-1");
    const links = document.querySelectorAll(".chapter-link");
    if (links.length > 0) links[0].click();
  }, 50);
}

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

  const grid = document.getElementById("dynamic-grid");
  grid.className = "grid grid-cols-1 md:grid-cols-3 gap-6 w-full col-span-full";
  grid.innerHTML = `
    <div class="bg-theme border border-theme rounded-3xl p-6 shadow-sm hover:shadow-md transition">
      <div class="flex items-center gap-2 mb-6">
        <span class="text-3xl">📚</span>
        <h3 class="text-2xl font-bold text-theme">Learning (পড়াশোনা)</h3>
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

    <div class="bg-theme border border-theme rounded-3xl p-6 shadow-sm hover:shadow-md transition">
      <div class="flex items-center gap-2 mb-6">
        <span class="text-3xl">📝</span>
        <h3 class="text-xl font-bold text-theme">Practice & Read</h3>
      </div>
      <div class="space-y-4">
        <div onclick="openMCQModal()" class="flex justify-between items-center bg-theme-secondary hover:bg-cyan-500/5 p-4 rounded-2xl border border-theme cursor-pointer transition">
          <div>
            <h4 class="font-bold text-theme text-sm">MCQ Test</h4>
            <p class="text-[10px] text-theme-muted">অধ্যায়ভিত্তিক অটোমেটেড এমসিকিউ</p>
          </div>
          <span class="text-xs font-bold text-indigo-400">পরীক্ষা দিন ➔</span>
        </div>
        
        <div onclick="openInteractivePDFReader('${chapterName}')" class="flex justify-between items-center bg-theme-secondary hover:bg-cyan-500/5 p-4 rounded-2xl border border-theme cursor-pointer transition">
          <div>
            <h4 class="font-bold text-theme text-sm">ইন্টারেক্টিভ কনসেপ্ট বুক (PDF)</h4>
            <p class="text-[10px] text-theme-muted">অনলাইনে মনোরম পরিবেশে পড়ুন</p>
          </div>
          <span class="text-xs font-bold text-cyan-400">পড়ুন ➔</span>
        </div>
      </div>
    </div>

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
// INTERACTIVE READ ONLINE (PDF ALTERNATIVE)
// ==========================================
function openInteractivePDFReader(chapter) {
  const data = chapterMaterials[chapter] || {
    title: `${chapter} - স্টাডি গাইড`,
    summary: `
      <div class="space-y-4">
        <h4 class="text-xl font-bold text-cyan-400">📚 অধ্যায়ের মূল আলোচনা</h4>
        <p class="text-theme">এই অধ্যায়ের সমস্ত থিওরি নোট এবং প্র্যাক্টিস শিট এখনো প্রসেসিং করা হচ্ছে। খুব দ্রুত এটি এভেইল্যাবল করা হবে!</p>
      </div>
    `,
  };

  document.getElementById("pdf-reader-title").innerText = data.title;
  document.getElementById("pdf-reader-body").innerHTML = data.summary;
  openModal("pdf-reader-modal");
}

function adjustReaderFont(type) {
  const el = document.getElementById("pdf-reader-body");
  let currentSize = parseFloat(
    window.getComputedStyle(el, null).getPropertyValue("font-size"),
  );
  if (type === "plus") {
    el.style.fontSize = currentSize + 2 + "px";
  } else {
    el.style.fontSize = currentSize - 2 + "px";
  }
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
          <div class="mt-4 flex gap-2 justify-center">
            <button onclick="openInteractivePDFReader('১ম অধ্যায়')" class="bg-cyan-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold">অনলাইনে পড়ুন</button>
            <button onclick="alert('ডাউনলোড শুরু হয়েছে...')" class="bg-theme border border-theme text-theme px-3 py-1.5 rounded-lg text-xs font-bold">ডাউনলোড</button>
          </div>
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
// LOAD UNIVERSITY CURRICULUM
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
          <p class="text-xs text-theme-muted mb-4">এই কোর্সের আন্ডারে সম্পন্ন করার মতো、《ল্যাব ও সেমিস্টার প্রজেক্টস》।</p>
          <button onclick="loadProjectsPage()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition">প্রজেক্ট লাইব্রেরিতে যান</button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// LOAD SKILLS PAGE (WITH DYNAMIC ZONE VISUAL SEPARATION)
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
      <h3 class="font-extrabold text-lg text-theme">⚙️ ফিল্টার অপশন</h3>
      <p class="text-theme-muted text-xs">ক্যাটাগরি অনুযায়ী বেছে নিন</p>
    </div>
    <div class="space-y-2 text-sm font-bold text-theme">
      <button onclick="filterSkills('all')" class="w-full text-left bg-cyan-500/10 text-cyan-400 p-3 rounded-xl border border-cyan-500/30">সকল স্কিলস</button>
      <button onclick="filterSkills('kids')" class="w-full text-left bg-theme-secondary hover:bg-theme-hover p-3 rounded-xl border border-theme">👧 Kids Zone (কিডস কোডিং)</button>
      <button onclick="filterSkills('upper')" class="w-full text-left bg-theme-secondary hover:bg-theme-hover p-3 rounded-xl border border-theme">👨‍💻 Upper Zone (প্রফেশনাল স্কিলস)</button>
    </div>
  `;

  filterSkills("all");
}

function filterSkills(cat) {
  const grid = document.getElementById("dynamic-grid");
  grid.className =
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full";
  grid.innerHTML = "";

  const list =
    cat === "all" ? skillsData : skillsData.filter((s) => s.category === cat);

  list.forEach((skill) => {
    const desc = currentLanguage === "BN" ? skill.desc_bn : skill.desc_en;
    const btnText =
      currentLanguage === "BN" ? "বিস্তারিত ও অর্ডার" : "Details & Buy";

    const badgeClass = skill.category === "kids" ? "badge-kids" : "badge-upper";
    const badgeLabel =
      skill.category === "kids" ? "👶 Kids Zone" : "🚀 Upper Zone";

    grid.innerHTML += `
      <div class="bg-theme border border-theme rounded-3xl p-6 peace-wave flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase px-3 py-1 rounded-full ${badgeClass}">
              ${badgeLabel}
            </span>
            <span class="text-[10px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full">
              ${skill.discount}
            </span>
          </div>
          <h4 class="text-xl font-extrabold text-theme mt-4">${skill.title}</h4>
          <p class="text-xs text-theme-muted mt-2 leading-relaxed">${desc}</p>
        </div>
        <div class="border-t border-theme pt-4 mt-6 flex justify-between items-center">
          <div>
            <span class="text-[10px] text-theme-muted block line-through font-bold">${skill.old_price}</span>
            <span class="text-lg font-black text-cyan-400">${skill.price}</span>
          </div>
          <button onclick="openSkillDetail('${skill.title}', '${desc}', '${skill.price}', '${skill.video}', '${skill.old_price}', '${skill.discount}')" class="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black py-2.5 px-4 rounded-xl transition">
            ${btnText}
          </button>
        </div>
      </div>
    `;
  });

  showDynamicPage();
}

// ==========================================
// LOAD PROJECTS PAGE (KIDS & UPPER ZONE SEPARATION)
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
      <button onclick="filterProjects('kids')" class="w-full text-left bg-theme-secondary hover:bg-theme-hover p-3 rounded-xl border border-theme">👨‍👧‍👦 Kids Zone (বিজ্ঞান বাক্স)</button>
      <button onclick="filterProjects('upper')" class="w-full text-left bg-theme-secondary hover:bg-theme-hover p-3 rounded-xl border border-theme">🚀 Upper Zone (এডভান্সড প্রজেক্টস)</button>
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
    const desc = currentLanguage === "BN" ? proj.desc_bn : proj.desc_en;
    const btnText =
      currentLanguage === "BN" ? "কিট অর্ডার করুন ➔" : "Order Kit ➔";

    const badgeClass = proj.category === "kids" ? "badge-kids" : "badge-upper";
    const badgeLabel =
      proj.category === "kids" ? "👦 Kids Kit" : "🚀 Upper Level";

    grid.innerHTML += `
      <div class="bg-theme border border-theme rounded-3xl p-6 peace-wave flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase px-3 py-1 rounded-full ${badgeClass}">
              ${badgeLabel}
            </span>
            <span class="text-[10px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full">
              ${proj.discount}
            </span>
          </div>
          <h4 class="text-xl font-extrabold text-theme mt-4">${proj.title}</h4>
          <p class="text-xs text-theme-muted mt-2 leading-relaxed">${desc}</p>
        </div>
        <div class="border-t border-theme pt-4 mt-6 flex justify-between items-center">
          <div>
            <span class="text-[10px] text-theme-muted block line-through font-bold">${proj.old_price}</span>
            <span class="text-lg font-black text-cyan-400">${proj.price}</span>
          </div>
          <button onclick="openSkillDetail('${proj.title}', '${desc}', '${proj.price}', '${proj.video}', '${proj.old_price}', '${proj.discount}')" class="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black py-2.5 px-4 rounded-xl transition">
            ${btnText}
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

function openPublicationDetail(id) {
  const pub = publicationsData.find((p) => p.id === id);
  if (!pub) return;

  const desc = currentLanguage === "BN" ? pub.desc_bn : pub.desc_en;
  const author = currentLanguage === "BN" ? pub.author_bn : pub.author_en;

  openSkillDetail(
    `${pub.title}`,
    `${desc} Author: ${author}`,
    pub.price,
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    pub.old_price,
    pub.discount,
  );
}

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
        ? "দয়া করে অর্ডারের সমস্ত তথ্য সঠিকভাবে পূরণ করুন।"
        : "Please fill in all order information properly.",
    );
    return;
  }

  alert(
    currentLanguage === "BN"
      ? `ধন্যবাদ ${name}! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। ২৪ ঘণ্টার মধ্যে আমাদের কনফার্মেশন কল যাবে।`
      : `Thank you ${name}! Your order was placed successfully. A confirmation call will reach you within 24 hours.`,
  );
  closeModal("course-details");
}

// ==========================================
// DYNAMIC SIGNUP & LOGIN MODAL VALIDATION
// ==========================================
let activeAuthTab = "login";
let activeAuthMethod = "phone";

function switchAuthTab(tab) {
  activeAuthTab = tab;
  const loginTab = document.getElementById("auth-tab-login");
  const registerTab = document.getElementById("auth-tab-register");
  const nameField = document.getElementById("auth-field-name");
  const methodSwitcher = document.getElementById(
    "auth-method-switcher-container",
  );

  if (tab === "login") {
    loginTab.className =
      "flex-1 py-3.5 text-center text-cyan-400 border-b-2 border-cyan-400 transition-all duration-300";
    registerTab.className =
      "flex-1 py-3.5 text-center text-theme-muted hover:text-theme transition-all duration-300";
    nameField.classList.add("hidden");
    methodSwitcher.classList.remove("hidden");
  } else {
    registerTab.className =
      "flex-1 py-3.5 text-center text-cyan-400 border-b-2 border-cyan-400 transition-all duration-300";
    loginTab.className =
      "flex-1 py-3.5 text-center text-theme-muted hover:text-theme transition-all duration-300";
    nameField.classList.remove("hidden");
    methodSwitcher.classList.add("hidden");
    switchAuthMethod("email");
  }

  updateAuthModalTranslations();
}

function switchAuthMethod(method) {
  activeAuthMethod = method;
  const phoneBtn = document.getElementById("auth-method-phone");
  const emailBtn = document.getElementById("auth-method-email");
  const phoneWrapper = document.getElementById("phone-input-wrapper");
  const emailWrapper = document.getElementById("email-input-wrapper");

  if (method === "phone") {
    phoneBtn.className =
      "flex-1 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white py-2 rounded-lg transition-all duration-300";
    emailBtn.className =
      "flex-1 text-theme-muted py-2 rounded-lg transition-all duration-300";
    phoneWrapper.classList.remove("hidden");
    emailWrapper.classList.add("hidden");
  } else {
    emailBtn.className =
      "flex-1 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white py-2 rounded-lg transition-all duration-300";
    phoneBtn.className =
      "flex-1 text-theme-muted py-2 rounded-lg transition-all duration-300";
    emailWrapper.classList.remove("hidden");
    phoneWrapper.classList.add("hidden");
  }
}

function togglePasswordVisibility() {
  const el = document.getElementById("auth-pass-input");
  el.type = el.type === "password" ? "text" : "password";
}

function validatePhoneLength() {
  const input = document.getElementById("auth-phone-input").value;
  const warning = document.getElementById("phone-warning-text");

  if (input.length > 11) {
    warning.classList.remove("hidden");
  } else {
    warning.classList.add("hidden");
  }
}

function handleAuthSubmit() {
  const pass = document.getElementById("auth-pass-input").value;

  if (activeAuthTab === "login") {
    if (activeAuthMethod === "phone") {
      const phone = document.getElementById("auth-phone-input").value;
      if (phone.length !== 11) {
        alert(
          currentLanguage === "BN"
            ? "মোবাইল নম্বরটি অবশ্যই সঠিক ১১ ডিজিটের হতে হবে।"
            : "Phone number must be exactly 11 digits.",
        );
        return;
      }
    } else {
      const email = document.getElementById("auth-email-input").value;
      if (!email.includes("@")) {
        alert(
          currentLanguage === "BN"
            ? "সঠিক ইমেইল এড্রেস প্রদান করুন।"
            : "Please provide a valid email address.",
        );
        return;
      }
    }

    if (!pass) {
      alert(
        currentLanguage === "BN"
          ? "পাসওয়ার্ড পূরণ করা আবশ্যক!"
          : "Password is required!",
      );
      return;
    }

    alert(
      currentLanguage === "BN"
        ? "অভিনন্দন! আপনি সফলভাবে লগইন হয়েছেন।"
        : "Congratulations! You have successfully signed in.",
    );
    closeModal("login-modal");
  } else {
    const name = document.getElementById("auth-name-input").value.trim();
    const email = document.getElementById("auth-email-input").value.trim();

    if (!name || !email || !pass) {
      alert(
        currentLanguage === "BN"
          ? "দয়া করে সবকটি ঘর পূরণ করুন।"
          : "Please fill in all inputs.",
      );
      return;
    }

    alert(
      currentLanguage === "BN"
        ? "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম পিবেশে।"
        : "Account created successfully! Welcome to PIBESH.",
    );
    closeModal("login-modal");
  }
}

function updateAuthModalTranslations() {
  const isBN = currentLanguage === "BN";

  document.getElementById("auth-title").innerText = isBN
    ? "লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন"
    : "Sign in or create a brand new account";

  document.getElementById("auth-tab-login").innerText = isBN
    ? "লগইন (Login)"
    : "Sign In";
  document.getElementById("auth-tab-register").innerText = isBN
    ? "রেজিস্ট্রেশন (Register)"
    : "Register";

  document.getElementById("lbl-fullname").innerText = isBN
    ? "পূর্ণ নাম"
    : "Full Name";
  document.getElementById("lbl-phonenumber").innerHTML = isBN
    ? `মোবাইল নম্বর <span class="text-red-500">*</span>`
    : `Phone Number <span class="text-red-500">*</span>`;
  document.getElementById("lbl-email").innerHTML = isBN
    ? `ইমেইল ঠিকানা <span class="text-red-500">*</span>`
    : `Email Address <span class="text-red-500">*</span>`;
  document.getElementById("lbl-password").innerHTML = isBN
    ? `পাসওয়ার্ড <span class="text-red-500">*</span>`
    : `Password <span class="text-red-500">*</span>`;

  document.getElementById("phone-warning-msg").innerText = isBN
    ? "মোবাইল নম্বর ১১ ডিজিটের বেশি হতে পারবে না"
    : "Phone number must not exceed 11 digits";

  document.getElementById("lbl-forgot-pass").innerText = isBN
    ? "পাসওয়ার্ড ভুলে গেছেন?"
    : "Forgot Password?";

  if (activeAuthTab === "login") {
    document.getElementById("auth-btn-submit").innerText = isBN
      ? "লগইন করুন"
      : "Sign In Now";
  } else {
    document.getElementById("auth-btn-submit").innerText = isBN
      ? "অ্যাকাউন্ট তৈরি করুন"
      : "Create Account";
  }
}

function openLoginModal() {
  document.getElementById("auth-phone-input").value = "";
  document.getElementById("auth-email-input").value = "";
  document.getElementById("auth-pass-input").value = "";
  document.getElementById("auth-name-input").value = "";
  switchAuthTab("login");
  openModal("login-modal");
}

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

// ==========================================
// NEXT WORD PAGE
// ==========================================
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
    }, 1500);
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

// ==========================================
// WINDOW LISTENERS & SYSTEM INIT
// ==========================================
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

// ==========================================
// DYNAMIC EDUCATIONAL SYMBOLS BACKGROUND
// ==========================================
const educationalSymbols = [
  "π",
  "H₂O",
  "E=mc²",
  "Ω",
  "Σ",
  "∫",
  "√",
  "sin(θ)",
  "cos(θ)",
  "📐",
  "⭕",
  "▱",
  "⬡",
  "F=ma",
  "λ",
  "CO₂",
  "NaCl",
  "eV",
  "W=Fd",
  "Δ",
  "α",
  "β",
  "γ",
  "Φ",
  "∞",
  "⚛",
  "⚡",
  "🔬",
  "🧪",
  "✏️",
  "📖",
  "ক",
  "আ",
];

function initDynamicBackground() {
  const bgContainer = document.getElementById("dynamic-educational-bg");
  if (!bgContainer) return;

  bgContainer.innerHTML = "";

  // ডাইনামিক প্রতীক সংখ্যা (স্ক্রিনের স্থায়িত্ব ও পারফরমেন্স বজায় রাখতে)
  const totalSymbols = 55;

  for (let i = 0; i < totalSymbols; i++) {
    createFloatingSymbol(bgContainer);
  }
}

function createFloatingSymbol(container) {
  const el = document.createElement("div");
  el.className = "floating-symbol";

  // প্রতীক নির্বাচন
  const symbol =
    educationalSymbols[Math.floor(Math.random() * educationalSymbols.length)];
  el.innerText = symbol;

  // ফন্ট সাইজ নির্ধারণ (16px থেকে 42px)
  const size = Math.floor(Math.random() * (42 - 16 + 1)) + 30;
  el.style.fontSize = `${size}px`;

  // স্ক্রিনের আনুভূমিক অবস্থান (0% থেকে 100%)
  const leftPos = Math.random() * 100;
  el.style.left = `${leftPos}%`;

  // অ্যানিমেশন সময় ও বিলম্ব নির্ধারণ
  const duration = Math.random() * (35 - 15) + 15; // ১৫ থেকে ৩৫ সেকেন্ড
  const delay = Math.random() * -duration; // ঋণাত্মক বিলম্ব যাতে লোড হওয়ার সাথে সাথেই প্রতীক ছড়ানো থাকে

  el.style.animationDuration = `${duration}s`;
  el.style.animationDelay = `${delay}s`;

  container.appendChild(el);
}

// পৃষ্ঠা লোড হওয়ার সাথে সাথে রেন্ডারিং নিশ্চিত করা
window.onload = function () {
  renderPublications();
  initDynamicBackground();
};
