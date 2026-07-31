/* =========================================================================
             সশিবা স্মার্ট শিক্ষা বাতায়ন - প্রেজেন্টেশন ইঞ্জিনের মূল লজিক (script.js)
   ========================================================================= */

// ==================== থিম সিনক্রোনাইজেশন লজিক (postMessage & localStorage) ====================
(function initSubAppThemeSync() {
  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else if (theme === "light") {
      document.body.classList.remove("dark-mode");
    }
  }

  try {
    const savedTheme = localStorage.getItem("sashiba_theme");
    if (savedTheme) applyTheme(savedTheme);
  } catch (e) {}

  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "THEME_CHANGE") {
      applyTheme(event.data.theme);
    }
  });
})();

// এই ফাংশনটি যেকোনো ফরম্যাটের ক্লাস বা বিষয়কে ড্রপডাউনের ভ্যালুর সাথে মিলিয়ে দিবে (স্মার্ট মাস্টার ম্যাপার)
function getNormalizedValue(targetValue, elementId) {
    const select = document.getElementById(elementId);
    if (!select || !targetValue) return "";

    let cleanTarget = targetValue.toString().toLowerCase().replace(/শ্রেণি|class/gi, '').trim();

    // যদি কোনো ডিজিট থাকে (যেমন: "৮ম", "Class 8", "8th", "8"), তা শুধুমাত্র সংখ্যায় রূপান্তর করা
    let digitMatch = cleanTarget.match(/\d+/) || cleanTarget.match(/[০-৯]+/);
    if (digitMatch) {
        cleanTarget = digitMatch[0];
    }

    // শ্রেণি ম্যাপিং ডিকশনারি (English / Digit / Bangla to target values)
    const classMapping = {
        "1": "প্রথম", "one": "প্রথম", "first": "প্রথম", "১": "প্রথম",
        "2": "দ্বিতীয়", "two": "দ্বিতীয়", "second": "দ্বিতীয়", "২": "দ্বিতীয়",
        "3": "তৃতীয়", "three": "তৃতীয়", "third": "তৃতীয়", "৩": "তৃতীয়",
        "4": "চতুর্থ", "four": "চতুর্থ", "fourth": "চতুর্থ", "৪": "চতুর্থ",
        "5": "পঞ্চম", "five": "পঞ্চম", "fifth": "পঞ্চম", "৫": "পঞ্চম",
        "6": "ষষ্ঠ", "six": "ষষ্ঠ", "sixth": "ষষ্ঠ", "৬": "ষষ্ঠ",
        "7": "সপ্তম", "seven": "সপ্তম", "seventh": "সপ্তম", "৭": "সপ্তম",
        "8": "অষ্টম", "eight": "অষ্টম", "eighth": "অষ্টম", "৮": "অষ্টম",
        "9": "নবম", "nine": "নবম", "ninth": "নবম", "৯": "নবম",
        "10": "দশম", "ten": "দশম", "tenth": "দশম", "১০": "দশম",
        "11": "একাদশ", "eleven": "একাদশ", "১১": "একাদশ",
        "12": "দ্বাদশ", "twelve": "দ্বাদশ", "১২": "দ্বাদশ"
    };

    // বিষয় ম্যাপিং ডিকশনারি
    const subjectMapping = {
        "bangla": "বাংলা",
        "english": "ইংরেজি",
        "mathematics": "গণিত", "math": "গণিত",
        "science": "বিজ্ঞান",
        "ict": "তথ্য ও যোগাযোগ প্রযুক্তি",
        "religious": "ধর্ম", "religion": "ধর্ম",
        "art": "শিল্প", "arts": "শিল্প",
        "social": "ইতিহাস", "history": "ইতিহাস",
        "physics": "পদার্থবিজ্ঞান",
        "chemistry": "রসায়ন",
        "biology": "জীববিজ্ঞান",
        "accounting": "হিসাববিজ্ঞান"
    };

    if (elementId === "class" && classMapping[cleanTarget]) {
        cleanTarget = classMapping[cleanTarget];
    } else if (elementId === "subject" && subjectMapping[cleanTarget]) {
        cleanTarget = subjectMapping[cleanTarget];
    }

    // ড্রপডাউনের সব অপশন চেক করা
    for (let i = 0; i < select.options.length; i++) {
        let optionText = select.options[i].text.toLowerCase();
        let optionValue = select.options[i].value.toLowerCase();

        // যদি অপশনের টেক্সট বা ভ্যালুর মধ্যে আমাদের টার্গেট শব্দটি থাকে
        if (optionText.includes(cleanTarget.toLowerCase()) || optionValue.includes(cleanTarget.toLowerCase())) {
            return select.options[i].value;
        }
    }
    return ""; // কিছু না মিললে খালি থাকবে
}

// [১] ডেটাবেজ (NCTB শ্রেণি, বিষয়, অধ্যায়, বিষয়ভিত্তিক ডিজাইন এবং UI অপশনসমূহ)
const db = {
  classes: {
    bn: ["প্রথম", "দ্বিতীয়", "তৃতীয়", "চতুর্থ", "পঞ্চম", "ষষ্ঠ", "সপ্তম", "অষ্টম", "নবম", "দশম", "একাদশ", "দ্বাদশ"],
    en: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]
  },
  subjects_bn: {
    Compulsory: ["বাংলা", "ইংরেজি", "গণিত", "তথ্য ও যোগাযোগ প্রযুক্তি"],
    General: ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়", "তথ্য ও যোগাযোগ প্রযুক্তি", "ধর্ম ও নৈতিক শিক্ষা", "শিল্প ও সংস্কৃতি"],
    Science: ["পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "উচ্চতর গণিত"],
    Arts: ["ইতিহাস ও সামাজিক বিজ্ঞান", "পৌরনীতি ও নাগরিকতা", "ভূগোল ও পরিবেশ", "অর্থনীতি"],
    Commerce: ["হিসাববিজ্ঞান", "ব্যবসায় উদ্যোগ", "ফিন্যান্স ও ব্যাংকিং"]
  },
  subjects_en: {
    Compulsory: ["Bangla", "English", "Mathematics", "ICT"],
    General: ["Bangla", "English", "Mathematics", "Science", "Bangladesh & Global Studies", "ICT", "Religious Studies", "Arts & Culture"],
    Science: ["Physics", "Chemistry", "Biology", "Higher Mathematics"],
    Arts: ["History & Social Science", "Civics & Citizenship", "Geography & Environment", "Economics"],
    Commerce: ["Accounting", "Business Entrepreneurship", "Finance & Banking"]
  },
  chapters: {
    "বাংলা": [
      "অধ্যায় ১: ভাষা ও ব্যাকরণ পরিচিতি",
      "অধ্যায় ২: ধ্বনি ও বর্ণমালা",
      "অধ্যায় ৩: শব্দ ও পদের শ্রেণিবিভাগ",
      "অধ্যায় ৪: বাক্য গঠন ও প্রকারভেদ",
      "অধ্যায় ৫: বিরামচিহ্ন ও ব্যাকরণিক প্রয়োগ"
    ],
    "ইংরেজি": [
      "Unit 1: Talking to People",
      "Unit 2: Little Things",
      "Unit 3: Future Lies in Present",
      "Unit 4: Ask and Tell",
      "Unit 5: Together We are Strong"
    ],
    "গণিত": [
      "অধ্যায় ১: সংখ্যার গল্প (গণনার পরিচিতি)",
      "অধ্যায় ২: দ্বিমাত্রিক বস্তুর গল্প",
      "অধ্যায় ৩: তথ্য অনুসন্ধান ও বিশ্লেষণ",
      "অধ্যায় ৪: মৌলিক উৎপাদকের গাছ",
      "অধ্যায় ৫: ভগ্নাংশের খেলা"
    ],
    "বিজ্ঞান": [
      "অধ্যায় ১: বৈজ্ঞানিক অনুসন্ধান ও পদ্ধতি",
      "অধ্যায় ২: পদার্থের বৈশিষ্ট্য ও রূপান্তর",
      "অধ্যায় ৩: উদ্ভিদ ও প্রাণীর জীবনপ্রণালী",
      "অধ্যায় ৪: বল, গতি ও কাজ",
      "অধ্যায় ৫: পরিবেশ ও আমাদের খাদ্য"
    ],
    "পদার্থবিজ্ঞান": [
      "অধ্যায় ১: ভৌত রাশি ও পরিমাপ",
      "অধ্যায় ২: গতি ও গতির সমীকরণ",
      "অধ্যায় ৩: বল ও নিউটনের সূত্র",
      "অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি",
      "অধ্যায় ৫: পদার্থের অবস্থা ও চাপ"
    ],
    "রসায়ন": [
      "অধ্যায় ১: রসায়নের ধারণা",
      "অধ্যায় ২: পদার্থের অবস্থা",
      "অধ্যায় ৩: পদার্থের গঠন ও পরমাণু",
      "অধ্যায় ৪: পর্যায় সারণি",
      "অধ্যায় ৫: রাসায়নিক বন্ধন"
    ],
    "জীববিজ্ঞান": [
      "অধ্যায় ১: জীবন পাঠ",
      "অধ্যায় ২: জীবকোষ ও টিস্যু",
      "অধ্যায় ৩: কোষ বিভাজন",
      "অধ্যায় ৪: জীবনীশক্তি (সালোকসংশ্লেষণ)",
      "অধ্যায় ৫: খাদ্য, পুষ্টি ও পরিপাক"
    ],
    "তথ্য ও যোগাযোগ প্রযুক্তি": [
      "অধ্যায় ১: বিশ্ব ও বাংলাদেশ প্রেক্ষিত",
      "অধ্যায় ২: কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং",
      "অধ্যায় ৩: সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস"
    ],
    "ইতিহাস ও সামাজিক বিজ্ঞান": [
      "অধ্যায় ১: আমাদের পরিচিতি ও ঐতিহ্য",
      "অধ্যায় ২: ভৌগোলিক পরিবেশ ও সমাজ",
      "অধ্যায় ৩: নাগরিক অধিকার ও দায়িত্ব"
    ],
    "ভূগোল ও পরিবেশ": [
      "অধ্যায় ১: ভূগোল ও পরিবেশ ধারণা",
      "অধ্যায় ২: মহাবিশ্ব ও আমাদের পৃথিবী",
      "অধ্যায় ৩: মানচিত্র পঠন ও ব্যবহার"
    ]
  },
  topics: {
    "অধ্যায় ১: ভাষা ও ব্যাকরণ পরিচিতি": ["পাঠ ১.১: ভাষার সংজ্ঞা ও রূপভেদ", "পাঠ ১.২: বাংলা ভাষার জন্ম ও বিকাশ", "পাঠ ১.৩: মাতৃভাষা ও সাধু-চলিত রূপ", "পাঠ ১.৪: অনুশীলনী ও সংক্ষিপ্ত উত্তর"],
    "অধ্যায় ২: ধ্বনি ও বর্ণমালা": ["পাঠ ২.১: স্বরধ্বনি ও স্বরবর্ণ", "পাঠ ২.২: ব্যঞ্জনধ্বনি ও ব্যঞ্জনবর্ণ", "পাঠ ২.৩: উচ্চারণ স্থান ও বিধি"],
    "অধ্যায় ১: সংখ্যার গল্প (গণনার পরিচিতি)": ["পাঠ ১.১: প্রাচীন গণনার ইতিহাস", "পাঠ ১.২: স্থানিক মান ও গণনা পদ্ধতি", "পাঠ ১.৩: জোড়-বিজোড় সংখ্যার প্যাটার্ন", "পাঠ ১.৪: গাণিতিক ধাঁধা ও কাজ"],
    "অধ্যায় ১: বৈজ্ঞানিক অনুসন্ধান ও পদ্ধতি": ["পাঠ ১.১: পরীক্ষণ ও পর্যবেক্ষণ", "পাঠ ১.২: হাইপোথিসিস বা অনুকল্প", "পাঠ ১.৩: তথ্য সংগ্রহ ও ফলাফল উপস্থাপন"],
    "অধ্যায় ১: ভৌত রাশি ও পরিমাপ": ["পাঠ ১.১: মেপে দেখা ও পরিমাপের একক", "পাঠ ১.২: পরিমাপের যন্ত্রপাতি (স্কেল, স্লাইড ক্যালিফার্স)", "পাঠ ১.৩: ত্রুটি ও গাণিতিক হিসেব"],
    "Unit 1: Talking to People": ["Lesson 1.1: Greetings & Introductions", "Lesson 1.2: Formal vs Informal Expressions", "Lesson 1.3: Group Conversation Practice"]
  },
  presentationUI: {
    themes: [
      { id: "theme-modern", name: "মডার্ন ব্লু", color: "#4f46e5" },
      { id: "theme-minimal", name: "মিনিমাল হোয়াইট", color: "#64748b" },
      { id: "theme-dark", name: "ডার্ক স্লেট", color: "#0f172a" },
      { id: "theme-kids", name: "কিডস ওয়ার্ম", color: "#ea580c" },
      { id: "theme-kids-pastel", name: "পাস্টেল কিডস", color: "#db2777" },
      { id: "theme-kids-ocean", name: "কিডস ওশেন", color: "#0284c7" },
      { id: "theme-light-teal", name: "লাইট টিল", color: "#16a34a" },
      { id: "theme-light-lavender", name: "লাইট ল্যাভেন্ডার", color: "#9333ea" },
      { id: "theme-stem", name: "STEM গ্রিন", color: "#10b981" },
      { id: "theme-glass", name: "গ্লাস সিয়ান", color: "#0891b2" }
    ],
    subjectThemes: [
      { id: "sub-math", name: "🧮 গণিত ও লজিক", icon: "fa-calculator" },
      { id: "sub-sci", name: "⚛️ বিজ্ঞান ও প্রযুক্তি", icon: "fa-atom" },
      { id: "sub-geo", name: "🌍 ভূগোল ও সমাজ", icon: "fa-globe" },
      { id: "sub-lit", name: "📖 সাহিত্য ও ভাষা", icon: "fa-book" },
      { id: "sub-hist", name: "🏛️ ইতিহাস ও ঐতিহ্য", icon: "fa-landmark" },
      { id: "sub-ict", name: "💻 ICT ও কোডিং", icon: "fa-laptop-code" },
      { id: "sub-art", name: "🎨 শিল্প ও সংষ্কৃতিক", icon: "fa-palette" },
      { id: "sub-bio", name: "🌿 জীববিজ্ঞান ও প্রজাতি", icon: "fa-leaf" }
    ],
    visuals: [
      { id: "img", name: "🖼️ বিষয়ভিত্তিক ছবি", checked: true },
      { id: "icon", name: "✨ আইকন ও প্রতীক", checked: true },
      { id: "chart", name: "📊 চার্ট ও গ্রাফ", checked: true },
      { id: "info", name: "💡 ইনফোগ্রাফিক ডায়াগ্রাম", checked: true },
      { id: "table", name: "📋 ডাটা সারণি", checked: true },
      { id: "geo", name: "🗺️ মানচিত্র ও গ্রাফিক্স", checked: false },
      { id: "vid", name: "🎥 ভিডিও লিঙ্ক কন্টেন্ট", checked: false }
    ],
    sequence: [
      { id: "Cover", name: "১. কভার / শিরোনাম স্লাইড", checked: true },
      { id: "Outcomes", name: "২. শিখনফল ও উদ্দেশ্য স্লাইড", checked: true },
      { id: "Content", name: "৩. মূল পাঠ আলোচনা স্লাইড", checked: true },
      { id: "Table", name: "৪. সময়তালিকা ও গ্রুপ কাজ স্লাইড", checked: true },
      { id: "Quiz", name: "৫. সংক্ষিপ্ত কুইজ ও প্রশ্ন স্লাইড", checked: true },
      { id: "Homework", name: "৬. বাড়ির কাজ (Homework) স্লাইড", checked: true },
      { id: "Q&A", name: "৭. প্রশ্ন ও উত্তর এবং ধন্যবাদ স্লাইড", checked: true }
    ],
    templates: [
      { id: "temp-std", name: "🏫 স্ট্যান্ডার্ড ক্লাসরুম", checked: true },
      { id: "temp-stem", name: "🔬 STEM প্রজেক্ট প্রেজেন্টেশন", checked: false },
      { id: "temp-quiz", name: "🎮 গ্যামিফাইড কুইজ সেশন", checked: false },
      { id: "temp-story", name: "📚 গল্পভিত্তিক পাঠদান", checked: false }
    ]
  },
  methods: [
    { name: "🗣️ বক্তৃতা ও আলোচনা", checked: true },
    { name: "🔬 পরীক্ষণ ও পর্যবেক্ষণ", checked: true },
    { name: "👥 দলগত কাজ (Group Work)", checked: true },
    { name: "❓ প্রশ্নোত্তর পর্ব", checked: true },
    { name: "👫 জোড়ায় কাজ (Pair Work)", checked: false },
    { name: "📝 একক অনুশীলনী", checked: false },
    { name: "🎮 গেম বা কুইজ পদ্ধতি", checked: false },
    { name: "💡 ব্রেইনস্টর্মিং (চিন্তাভাবনা)", checked: false }
  ],
  blooms: [
    { name: "🧠 Remember (মনে রাখা)", checked: true },
    { name: "💡 Understand (অনুধাবন)", checked: true },
    { name: "⚙️ Apply (প্রয়োগ)", checked: true },
    { name: "🔍 Analyze (বিশ্লেষণ)", checked: false },
    { name: "⚖️ Evaluate (মূল্যায়ন)", checked: false },
    { name: "🎨 Create (সৃজনশীলতা)", checked: false }
  ]
};

// [২] স্টেট ভ্যারিয়েবল (Global State)
let currentLang = "bn";
let activeTheme = "theme-modern";
let activeSlideIndex = 0;
let slides = [];
let importedPlan = null;
let isManualMode = false;
let presenterTimer = null;
let timerSeconds = 0;

// [৩] পৃষ্ঠা লোড হওয়ার পরবর্তী ইনিশিয়ালাইজেশন
document.addEventListener("DOMContentLoaded", () => {
  initSubmenuUI();
  populateClasses();

  // ২. একটু সময় দিয়ে (setTimeout) ডিফল্ট ডাটা লোড করুন যাতে সব আইডি খুঁজে পায়
  setTimeout(() => {
    // 🚀 ক্লাস ম্যানেজার গ্লোবাল সেশন চেকিং
    try {
      const gSessionStr = localStorage.getItem("sashiba_global_active_session");
      if (gSessionStr) {
        const gSession = JSON.parse(gSessionStr);
        if (gSession.schoolName) {
          const schInput = document.getElementById("schName");
          if (schInput) schInput.value = gSession.schoolName;
        }
        if (gSession.className) {
          const clsSel = document.getElementById("class");
          if (clsSel) {
            let matchedCls = gSession.className;
            if (matchedCls.includes("অষ্টম") || matchedCls.includes("8")) matchedCls = "অষ্টম";
            else if (matchedCls.includes("পঞ্চম") || matchedCls.includes("5")) matchedCls = "পঞ্চম";
            clsSel.value = matchedCls;
          }
        }
      } else {
        const clsSel = document.getElementById("class");
        if (clsSel) clsSel.value = "ষষ্ঠ";
      }
    } catch(e) {
      const clsSel = document.getElementById("class");
      if (clsSel) clsSel.value = "ষষ্ঠ";
    }

    handleClassChange();
    checkAutoImportFromLessonPlan();
    generateSlidesFromForm();
  }, 100);

  // Global click listener for closing export dropdown
  document.addEventListener("click", (e) => {
    const dropdownWrapper = document.querySelector(".dropdown-wrapper");
    const exportMenu = document.getElementById("exportMenu");
    if (dropdownWrapper && exportMenu && !dropdownWrapper.contains(e.target)) {
      exportMenu.classList.remove("show");
    }
  });

  // Keydown event listener for presentation mode
  document.addEventListener("keydown", (e) => {
    const overlay = document.getElementById("fullscreenOverlay");
    if (overlay && overlay.style.display !== "none") {
      if (e.key === "ArrowRight" || e.key === " ") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") exitPresentationMode();
    }
  });
});

function initSubmenuUI() {
  const themeContainer = document.getElementById("theme-options");
  if (themeContainer) {
    themeContainer.innerHTML = db.presentationUI.themes
      .map(
        (t) => `
        <div class="theme-card-option ${t.id === activeTheme ? "selected" : ""}" onclick="selectPresentationTheme('${t.id}')">
          <span class="theme-dot" style="background:${t.color}"></span>
          <span>${t.name}</span>
        </div>
      `
      )
      .join("");
  }

  const subContainer = document.getElementById("subject-themes-list");
  if (subContainer) {
    subContainer.innerHTML = db.presentationUI.subjectThemes
      .map(
        (st, idx) => `
        <label>
          <input type="radio" name="subTheme" value="${st.id}" ${idx === 0 ? "checked" : ""} onchange="onDataInputUpdate()">
          <span><i class="fa-solid ${st.icon}"></i> ${st.name}</span>
        </label>
      `
      )
      .join("");
  }

  const visContainer = document.getElementById("visual-content-list");
  if (visContainer) {
    visContainer.innerHTML = db.presentationUI.visuals
      .map(
        (v) => `
        <label>
          <input type="checkbox" class="vis-check" value="${v.id}" ${v.checked ? "checked" : ""} onchange="onDataInputUpdate()">
          ${v.name}
        </label>
      `
      )
      .join("");
  }

  const seqContainer = document.getElementById("slide-sequence-list");
  if (seqContainer) {
    seqContainer.innerHTML = db.presentationUI.sequence
      .map(
        (s) => `
        <label>
          <input type="checkbox" class="seq-check" value="${s.id}" ${s.checked ? "checked" : ""} onchange="onDataInputUpdate()">
          ${s.name}
        </label>
      `
      )
      .join("");
  }

  const tempContainer = document.getElementById("ready-templates-list");
  if (tempContainer) {
    tempContainer.innerHTML = db.presentationUI.templates
      .map(
        (t) => `
        <label>
          <input type="radio" name="tmpl" value="${t.id}" ${t.checked ? "checked" : ""} onchange="onDataInputUpdate()">
          ${t.name}
        </label>
      `
      )
      .join("");
  }

  const methContainer = document.getElementById("methods-list");
  if (methContainer) {
    methContainer.innerHTML = db.methods
      .map(
        (m) => `
        <label>
          <input type="checkbox" class="meth-check" value="${m.name}" ${m.checked ? "checked" : ""} onchange="onDataInputUpdate()">
          ${m.name}
        </label>
      `
      )
      .join("");
  }

  const bloomContainer = document.getElementById("bloom-options");
  if (bloomContainer) {
    bloomContainer.innerHTML = db.blooms
      .map(
        (b) => `
        <label>
          <input type="checkbox" class="bloom-check" value="${b.name}" ${b.checked ? "checked" : ""} onchange="onDataInputUpdate()">
          ${b.name}
        </label>
      `
      )
      .join("");
  }
}

function selectPresentationTheme(themeId) {
  activeTheme = themeId;
  const cards = document.querySelectorAll(".theme-card-option");
  cards.forEach((c) => {
    if (c.getAttribute("onclick")?.includes(themeId)) {
      c.classList.add("selected");
    } else {
      c.classList.remove("selected");
    }
  });
  renderActiveCanvas();
}

function populateClasses() {
  const clsSel = document.getElementById("class");
  if (!clsSel) return;
  const list = currentLang === "bn" ? db.classes.bn : db.classes.en;
  const placeholder = currentLang === "bn" ? "-- শ্রেণি নির্বাচন করুন --" : "-- Select Class --";
  clsSel.innerHTML = `<option value="">${placeholder}</option>` + list.map((c) => `<option value="${c}">${c} ${currentLang === "bn" ? "শ্রেণি" : ""}</option>`).join("");
}

function handleClassChange() {
  const clsSel = document.getElementById("class");
  if (!clsSel) return;
  const cls = clsSel.value;
  const groupDiv = document.getElementById("group-wrapper");
  const groupVal = document.getElementById("group")?.value || "General";
  const subSel = document.getElementById("subject");

  if (!cls) {
    if (groupDiv) groupDiv.style.display = "none";
    if (subSel) {
      subSel.innerHTML = `<option value="">${currentLang === "bn" ? "-- বিষয় নির্বাচন করুন --" : "-- Select Subject --"}</option>`;
    }
    onSubjectChange();
    return;
  }

  if (["নবম", "দশম", "একাদশ", "দ্বাদশ", "Class 9", "Class 10", "Class 11", "Class 12"].includes(cls)) {
    if (groupDiv) groupDiv.style.display = "block";
    let list = [...db.subjects_bn["Compulsory"]];
    if (groupVal !== "General") list = list.concat(db.subjects_bn[groupVal] || []);
    else list = list.concat(db.subjects_bn["General"]);
    populateSubjects(list);
  } else {
    if (groupDiv) groupDiv.style.display = "none";
    populateSubjects(db.subjects_bn["General"]);
  }
}

function populateSubjects(subjectList) {
  const subSel = document.getElementById("subject");
  if (!subSel) return;
  const placeholder = currentLang === "bn" ? "-- বিষয় নির্বাচন করুন --" : "-- Select Subject --";
  subSel.innerHTML = `<option value="">${placeholder}</option>` + subjectList.map((s) => `<option value="${s}">${s}</option>`).join("");
  onSubjectChange();
}

function onSubjectChange() {
  const cls = document.getElementById("class")?.value || "";
  const sub = document.getElementById("subject")?.value || "";
  const bookInput = document.getElementById("bookName");

  if (bookInput) {
    bookInput.value = sub ? `${cls} ${currentLang === "bn" ? "শ্রেণি" : ""} - ${sub} (NCTB পাঠ্যবই)` : "";
  }

  if (!sub) {
    const chBox = document.getElementById("chapter-list");
    if (chBox) {
      chBox.innerHTML = `<p class="text-muted" style="font-size:12px; padding:8px;">${currentLang === "bn" ? "প্রথমে বিষয় নির্বাচন করুন" : "Please select subject first"}</p>`;
    }
    loadTopics();
    return;
  }

  // Subject Theme auto selection mapping
  let mappedThemeId = "sub-lit"; // default fallback
  const sLower = sub.toLowerCase();
  if (sLower.includes("গণিত") || sLower.includes("math")) {
    mappedThemeId = "sub-math";
  } else if (sLower.includes("পদার্থ") || sLower.includes("রসায়ন") || sLower.includes("বিজ্ঞান") || sLower.includes("phys") || sLower.includes("chem") || sLower.includes("sci")) {
    if (sLower.includes("জীব") || sLower.includes("bio")) {
      mappedThemeId = "sub-bio";
    } else {
      mappedThemeId = "sub-sci";
    }
  } else if (sLower.includes("জীব") || sLower.includes("bio")) {
    mappedThemeId = "sub-bio";
  } else if (sLower.includes("geo") || sLower.includes("ভূগোল") || sLower.includes("পরিবেশ") || sLower.includes("env")) {
    mappedThemeId = "sub-geo";
  } else if (sLower.includes("ইতিহাস") || sLower.includes("hist") || sLower.includes("পৌরনীতি") || sLower.includes("civic")) {
    mappedThemeId = "sub-hist";
  } else if (sLower.includes("তথ্য") || sLower.includes("ict") || sLower.includes("ডিজিটাল") || sLower.includes("comput") || sLower.includes("techno")) {
    mappedThemeId = "sub-ict";
  } else if (sLower.includes("শিল্প") || sLower.includes("art") || sLower.includes("সংস্কৃতি") || sLower.includes("paint") || sLower.includes("palette")) {
    mappedThemeId = "sub-art";
  }

  const radio = document.querySelector(`input[name="subTheme"][value="${mappedThemeId}"]`);
  if (radio) {
    radio.checked = true;
  }

  loadChapters();
}

function loadChapters() {
  const sub = document.getElementById("subject")?.value || "";
  const chBox = document.getElementById("chapter-list");
  if (!chBox) return;

  if (!sub) {
    chBox.innerHTML = `<p class="text-muted" style="font-size:12px; padding:8px;">${currentLang === "bn" ? "প্রথমে বিষয় নির্বাচন করুন" : "Please select subject first"}</p>`;
    loadTopics();
    return;
  }

  const chapList = db.chapters[sub] || [
    "অধ্যায় ১: পাঠ সূচনা ও পরিচিতি",
    "অধ্যায় ২: মূল বিষয়বস্তু ও আলোচনা",
    "অধ্যায় ৩: অনুশীলনী ও মূল্যায়ন"
  ];

  chBox.innerHTML = chapList
    .map(
      (c, idx) => `
      <label>
        <input type="radio" name="ch" value="${c}" ${idx === 0 ? "checked" : ""} onchange="loadTopics()">
        ${c}
      </label>
    `
    )
    .join("");

  loadTopics();
}

function loadTopics() {
  const selectedChapter = document.querySelector('input[name="ch"]:checked')?.value || "";
  const topicBox = document.getElementById("topic-list");
  if (!topicBox) return;

  if (!selectedChapter) {
    topicBox.innerHTML = `<p class="text-muted" style="font-size:12px; padding:8px;">${currentLang === "bn" ? "প্রথমে অধ্যায় নির্বাচন করুন" : "Please select chapter first"}</p>`;
    generateSlidesFromForm();
    return;
  }

  const topicList = db.topics[selectedChapter] || [
    "পাঠ ১: মূল ধারণা ও সংজ্ঞা",
    "পাঠ ২: বৈশিষ্ট্যাবলী ও বিশ্লেষণ",
    "পাঠ ৩: উদাহরণ ও প্রয়োগ",
    "পাঠ ৪: অনুশীলনী ও প্রশ্নোত্তর"
  ];

  topicBox.innerHTML = topicList
    .map(
      (t) => `
      <label>
        <input type="checkbox" class="topic-check" value="${t}" checked onchange="onDataInputUpdate()">
        ${t}
      </label>
    `
    )
    .join("");

  generateSlidesFromForm();
}

function onDataInputUpdate() {
  generateSlidesFromForm();
}

function autoGenerateAIOutcomes() {
  const obj = document.getElementById("lessonObjective")?.value || "আজকের পাঠের মূল আলোচনা";
  const sub = document.getElementById("subject")?.value || "বিষয়";

  const generatedOutcomes = [
    `১. [জ্ঞান] শিক্ষার্থীরা ${sub} বিষয়ে ${obj.substring(0, 35)} এর মূল ধারণা ব্যাখ্যা করতে পারবে।`,
    `২. [অনুধাবন] বিষয়টির প্রধান উপাদান ও বৈশিষ্ট্যসমূহ শ্রেণিকক্ষে আলোচনা করতে সক্ষম হবে।`,
    `৩. [প্রয়োগ] বাস্তব উদাহরণের মাধ্যমে অনুশীলনী সমাধান ও প্রশ্নের সঠিক উত্তর দেবে।`
  ];

  const fullText = `${obj}\n\n[AI জেনারেটেড শিখনফল]:\n${generatedOutcomes.join("\n")}`;
  const objInput = document.getElementById("lessonObjective");
  if (objInput) objInput.value = fullText;

  let outcomesSlide = slides.find((s) => s.type === "Outcomes");
  if (outcomesSlide) {
    outcomesSlide.bullets = [`মূল উদ্দেশ্য: ${obj.substring(0, 50)}`, ...generatedOutcomes];
    outcomesSlide.isCustomized = true;
  } else {
    slides.splice(1, 0, {
      id: "slide_outcomes_" + Date.now(),
      title: "🎯 AI শিখনফল ও উদ্দেশ্য",
      type: "Outcomes",
      layout: "card",
      bullets: [`पूल উদ্দেশ্য: ${obj.substring(0, 50)}`, ...generatedOutcomes],
      notes: "শিক্ষার্থীদের শিখনফলটি মনোযোগ দিয়ে দেখতে বলুন।",
      icon: "fa-bullseye"
    });
  }

  renderStudio();
  alert("✨ AI স্মার্ট শিখনফল সফলভাবে জেনারেট করে স্লাইডে যুক্ত করা হয়েছে!");
}

function checkAutoImportFromLessonPlan() {
  const urlParams = new URLSearchParams(window.location.search);
  const autoImport = urlParams.get("autoImport");
  const transferData = localStorage.getItem("sashiba_active_transfer_lesson");

  if (autoImport === "true" && transferData) {
    try {
      importedPlan = JSON.parse(transferData);
      applyImportedLessonPlan(importedPlan);
    } catch (e) {
      console.error("Error loading transfer lesson:", e);
    }
  }
}

async function applyImportedLessonPlan(plan) {
    if (!plan) return;
    isManualMode = false;

    // ১. টেক্সট ফিল্ডগুলো পূরণ করা
    document.getElementById("schName").value = plan.schName || plan.schoolName || "";
    document.getElementById("duration").value = plan.duration || "45";
    document.getElementById("lessonObjective").value = plan.lessonObjective || plan.objective || "";
    
    // ২. ক্লাস সিলেকশন (ম্যাপিং ও ডাইনামিক অপশন সংযোজন সহ)
    const classSelect = document.getElementById("class");
    if (classSelect) {
        let rawClass = plan.class || plan.className || "";
        let matchedClass = getNormalizedValue(rawClass, "class");
        if (matchedClass) {
            classSelect.value = matchedClass;
            handleClassChange(); // বিষয়ের তালিকা লোড করা
        } else if (rawClass) {
            const newOpt = document.createElement("option");
            newOpt.value = rawClass;
            newOpt.text = rawClass;
            classSelect.appendChild(newOpt);
            classSelect.value = rawClass;
            handleClassChange();
        }
    }

    // ৩. বিষয়ের তালিকা লোড হওয়ার জন্য ছোট বিরতি (জরুরি!)
    await new Promise(resolve => setTimeout(resolve, 150));

    // ৪. বিষয় নির্বাচন (ম্যাপিং ও ডাইনামিক অপশন সংযোজন সহ)
    const subjectSelect = document.getElementById("subject");
    if (subjectSelect) {
        let rawSubject = plan.subject || plan.subjectName || "";
        let matchedSubject = getNormalizedValue(rawSubject, "subject");
        if (matchedSubject) {
            subjectSelect.value = matchedSubject;
            onSubjectChange(); // অধ্যায় লোড করা
        } else if (rawSubject) {
            const newOpt = document.createElement("option");
            newOpt.value = rawSubject;
            newOpt.text = rawSubject;
            subjectSelect.appendChild(newOpt);
            subjectSelect.value = rawSubject;
            onSubjectChange();
        }
    }

    // ৫. অধ্যায় লোড হওয়ার জন্য ছোট বিরতি
    await new Promise(resolve => setTimeout(resolve, 150));

    // ৬. অধ্যায় ও টপিক সেট করা
    let targetChapter = plan.chapter || plan.chapterName;
    if (!targetChapter && plan.chapters && plan.chapters.length > 0) {
        targetChapter = plan.chapters[0];
    }

    if (targetChapter) {
        // রেডিও বাটনের টেক্সট ম্যাচ করানো
        const radios = document.querySelectorAll('input[name="ch"]');
        radios.forEach(radio => {
            if (radio.value.includes(targetChapter) || targetChapter.includes(radio.value)) {
                radio.checked = true;
            }
        });
        loadTopics();
        
        // টপিকগুলো ম্যাচ করানো
        if (plan.topics && plan.topics.length > 0) {
            setTimeout(() => {
                const topicChecks = document.querySelectorAll('.topic-check');
                topicChecks.forEach(cb => {
                    const isMatched = plan.topics.some(t => cb.value.includes(t) || t.includes(cb.value));
                    cb.checked = isMatched;
                });
            }, 50);
        }
    }

    // ৭. চূড়ান্ত: স্লাইড জেনারেট করা
    setTimeout(() => {
        // যদি ক্লাস এবং বিষয় উভয়ই সিলেক্ট হয়ে থাকে
        if (classSelect.value && subjectSelect.value) {
            generateSlidesFromForm(true);
            if (slides.length > 0) selectSlide(0);
            
            // সাকসেস মেসেজ
            const sourceBadge = document.getElementById("sourceBadge");
            if (sourceBadge) {
                sourceBadge.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${classSelect.value} - ${subjectSelect.value} এর প্রেজেন্টেশন রেডি!`;
                sourceBadge.style.background = "#dcfce7";
            }
        } else {
            alert("দুঃখিত, এই লেসন প্ল্যানের শ্রেণি বা বিষয় খুঁজে পাওয়া যায়নি। দয়া করে ম্যানুয়ালি নির্বাচন করুন।");
        }
    }, 300);
}

// [<ctrl42>] অটো স্লাইড জেনারেশন ইঞ্জিনের লজিক
function generateSlidesFromForm(force = false) {
    if (force) isManualMode = false;

    if (isManualMode) {
        renderStudio();
        return;
    }

    const className = document.getElementById("class").value;
    const subject = document.getElementById("subject").value;

    // যদি ইম্পোর্ট করার সময় ডাটা না পাওয়া যায়, শুধু তখনই অ্যালার্ট দিবে
    if (!className || !subject) {
        if (force && !importedPlan) { 
            alert("দয়া করে শ্রেণি এবং বিষয় নির্বাচন করুন!");
        }
        slides = [];
        renderStudio();
        return;
    }



  const schName = document.getElementById("schName")?.value || "সশিবা মডেল স্কুল";
  const duration = document.getElementById("duration")?.value || importedPlan?.duration || "45";
  const lessonCount = document.getElementById("lessonCount")?.value || "1";
  const objective = document.getElementById("lessonObjective")?.value || importedPlan?.objective || "আজকের পাঠের মূল ধারণা অর্জন করা";

  const selectedChapterRadio = document.querySelector('input[name="ch"]:checked');
  const selectedChapter = selectedChapterRadio ? selectedChapterRadio.value : (importedPlan?.chapter || "অধ্যায় ১: ভাষা ও ব্যাকরণ পরিচিতি");

  const selectedTopics = Array.from(document.querySelectorAll('.topic-check:checked')).map((cb) => cb.value);
  const topicsListStr = selectedTopics.length > 0 ? selectedTopics : ["পাঠ ১.১: মৌলিক পরিচিতি", "পাঠ ১.২: অনুশীলন ও প্রশ্ন"];

  const selectedMethods = Array.from(document.querySelectorAll('.meth-check:checked')).map((cb) => cb.value);
  const methodsStr = selectedMethods.length > 0 ? selectedMethods.join(", ") : "আলোচনা ও প্রশ্নোত্তর";

  const selectedBlooms = Array.from(document.querySelectorAll('.bloom-check:checked')).map((cb) => cb.value);
  const bloomsStr = selectedBlooms.length > 0 ? selectedBlooms.join(", ") : "Remember & Understand";

  const selectedSeq = Array.from(document.querySelectorAll('.seq-check:checked')).map((cb) => cb.value);
  const selectedTemplate = document.querySelector('input[name="tmpl"]:checked')?.value || "temp-std";

  const vGoodRolls = document.getElementById("roll-vgood")?.value || "১, ২, ৩";
  const avgRolls = document.getElementById("roll-avg")?.value || "৪, ৫, ৬";
  const lowRolls = document.getElementById("roll-low")?.value || "৭, ৮, ৯";

  const selectedSubThemeVal = document.querySelector('input[name="subTheme"]:checked')?.value || "sub-lit";
  let defaultIcon = "fa-graduation-cap";
  if (selectedSubThemeVal === "sub-math") defaultIcon = "fa-calculator";
  else if (selectedSubThemeVal === "sub-sci") defaultIcon = "fa-atom";
  else if (selectedSubThemeVal === "sub-bio") defaultIcon = "fa-leaf";
  else if (selectedSubThemeVal === "sub-geo") defaultIcon = "fa-globe";
  else if (selectedSubThemeVal === "sub-hist") defaultIcon = "fa-landmark";
  else if (selectedSubThemeVal === "sub-ict") defaultIcon = "fa-laptop-code";
  else if (selectedSubThemeVal === "sub-art") defaultIcon = "fa-palette";
  else if (selectedSubThemeVal === "sub-lit") defaultIcon = "fa-book-open";

  if (slides.length > 0 && slides.some((s) => s.isCustomized)) {
    renderStudio();
    return;
  }

  // Dynamic Bloom's Taxonomy Quiz questions generation
  let quizQuestions = [];
  selectedBlooms.forEach((b) => {
    if (b.includes("Remember") || b.includes("মনে রাখা")) {
      quizQuestions.push(`প্রশ্ন [মনে রাখা]: ${subject} বিষয়ের আজকের পাঠের প্রধান সংজ্ঞাটি কী?`);
    } else if (b.includes("Understand") || b.includes("অনুধাবন")) {
      quizQuestions.push(`প্রশ্ন [অনুধাবন]: ${selectedChapter.split(":")[1] || "আজকের পাঠ"} এর মূল ধারণাটি নিজের ভাষায় বুঝিয়ে বলো।`);
    } else if (b.includes("Apply") || b.includes("প্রয়োগ")) {
      quizQuestions.push(`প্রশ্ন [প্রয়োগ]: এই বিষয়টি বাস্তব জীবনে কোন ক্ষেত্রে প্রয়োগ করা সম্ভব?`);
    } else if (b.includes("Analyze") || b.includes("বিশ্লেষণ")) {
      quizQuestions.push(`প্রশ্ন [বিশ্লেষণ]: ${subject} এর এই পাঠের উপাদানগুলোর পারস্পরিক সম্পর্ক ব্যাখ্যা করো।`);
    } else if (b.includes("Evaluate") || b.includes("মূল্যায়ন")) {
      quizQuestions.push(`প্রশ্ন [মূল্যায়ন]: আপনি কি মনে করেন এই পদ্ধতির সমাধানটি যৌক্তিক? ব্যাখ্যা দিন।`);
    } else if (b.includes("Create") || b.includes("সৃজনশীলতা")) {
      quizQuestions.push(`প্রশ্ন [সৃজনশীলতা]: এই বিষয়ভিত্তিক একটি নতুন উদাহরণ বা রূপক গল্প তৈরি করো।`);
    }
  });

  if (quizQuestions.length === 0) {
    quizQuestions = [
      "প্রশ্ন ১: আজকের পাঠের মূল আলোচ্য বিষয় কোনটি?",
      "প্রশ্ন ২: আলোচিত বিষয়টি একটি উদাহরণের মাধ্যমে ব্যাখ্যা করো।",
      "প্রশ্ন ৩: দলগত সিদ্ধান্তের প্রধান ফলাফল কী?"
    ];
  }

  let newSlides = [];

  if (selectedTemplate === "temp-std") {
    // ১. Cover Slide
    if (selectedSeq.length === 0 || selectedSeq.includes("Cover")) {
      newSlides.push({
        id: "slide_cover_" + Date.now(),
        title: `${subject} - শ্রেণি: ${className}`,
        type: "Cover",
        layout: "single",
        bullets: [
          `🏫 প্রতিষ্ঠান: ${schName}`,
          `📖 অধ্যায়: ${selectedChapter}`,
          `📚 বিষয়: ${subject} (${className} শ্রেণি | পাঠ সংখ্যা: ${lessonCount})`,
          `⏱️ নির্ধারিত সময়: ${duration} মিনিট`
        ],
        notes: "শিক্ষার্থীদের কুশল বিনিময় করে স্লাইড প্রদর্শন শুরু করুন।",
        icon: defaultIcon
      });
    }

    // ২. Outcomes Slide
    if (selectedSeq.length === 0 || selectedSeq.includes("Outcomes")) {
      newSlides.push({
        id: "slide_outcomes_" + Date.now(),
        title: "🎯 উদ্দেশ্য ও শিখনফল",
        type: "Outcomes",
        layout: "card",
        bullets: [
          `মূল উদ্দেশ্য: ${objective.substring(0, 60)}`,
          "১. শিক্ষার্থীরা বিষয়টির মূল ধারণা সংজ্ঞায়িত ও ব্যাখ্যা করতে পারবে।",
          "২. শ্রেণিকক্ষের অনুশীলনী ও বাস্তব প্রয়োগ দেখাতে সমর্থ হবে।",
          "৩. প্রশ্নোত্তরের মাধ্যমে সক্রিয়ভাবে পাঠ গ্রহণ করবে।"
        ],
        notes: "শিক্ষার্থীদের বলুন আজকের ক্লাস শেষে তারা কী কী শিখবে।",
        icon: "fa-bullseye"
      });
    }

    // ৩. Content Slide
    if (selectedSeq.length === 0 || selectedSeq.includes("Content")) {
      newSlides.push({
        id: "slide_content_" + Date.now(),
        title: `📖 মূল পাঠ আলোচনা (${selectedChapter.split(":")[0] || "পাঠ"})`,
        type: "Content",
        layout: "split",
        bullets: [`পঠন পদ্ধতি: ${methodsStr}`, ...topicsListStr.map((t) => `🔹 ${t}`)],
        notes: "টপিকগুলো শিক্ষার্থীদের জিজ্ঞেস করে বিশদ আলোচনা করুন।",
        icon: "fa-book-open"
      });
    }

    // ৪. Table Slide
    if (selectedSeq.length === 0 || selectedSeq.includes("Table")) {
      newSlides.push({
        id: "slide_table_" + Date.now(),
        title: "📋 শ্রেণি সময়তালিকা ও স্মার্ট গ্রুপিং",
        type: "Table",
        layout: "card",
        bullets: [
          `⏱️ ০-১০ মিনিট: পূর্বজ্ঞান যাচাই ও সূচনা`,
          `⏱️ ১০-২৫ মিনিট: শিক্ষকের পাঠদান (${methodsStr})`,
          `⏱️ ২৫-৩৫ মিনিট: দলগত কাজ (গ্রুপ এ: রোল ${vGoodRolls} | গ্রুপ বি: রোল ${avgRolls} | গ্রুপ সি: রোল ${lowRolls})`,
          `⏱️ ৩৫-৪৫ মিনিট: মূল্যায়ন ও কুইজ`
        ],
        notes: "সময় মেনে প্রতিটি পর্ব পরিচালনা করুন।",
        icon: "fa-clock"
      });
    }

    // ৫. Quiz & 4-Way Logic Analysis Slide (নতুন ও বৈপ্লবিক ৪-মাত্রিক লজিক বিশ্লেষণ)
    if (selectedSeq.length === 0 || selectedSeq.includes("Quiz")) {
      newSlides.push({
        id: "slide_quiz_" + Date.now(),
        title: "❓ সংক্ষিপ্ত মূল্যায়ন ও কুইজ",
        type: "Quiz",
        layout: "quiz",
        bullets: [
          `জ্ঞানীয় স্তর: ${bloomsStr}`,
          ...quizQuestions
        ],
        notes: "শিক্ষার্থীদের হাত তুলতে বলুন এবং উত্তর দেওয়ার সুযোগ দিন।",
        icon: "fa-circle-question"
      });

      // 4-Way Logic Explanation Slide
      newSlides.push({
        id: "slide_logic_" + Date.now(),
        title: "💡 স্মার্ট প্রশ্ন ও ৪-মাত্রিক অপশন ব্যাখ্যা",
        type: "Content",
        layout: "split",
        bullets: [
          `📌 মডেল প্রশ্ন: ${subject} বিষয়ের আজকের পাঠে বর্ণিত মূল সূত্রের প্রয়োগ কোনটি?`,
          `✅ (ঘ) সঠিক উত্তর: এটি পাঠ্যবইয়ের নীতি ও গাণিতিক প্রমাণের সাথে শতভাগ সঙ্গতিপূর্ণ।`,
          `❌ (ক) ভুল কারণ: এটি ১৭৫৭ সালের ঐতিহাসিক ইভেন্ট সম্পর্কিত, যা এই সূত্রের সাথে অসংলগ্ন।`,
          `❌ (খ) ভুল কারণ: এতে প্রয়োজনীয় শর্ত অনুপস্থিত ছিল এবং এটি কেবল আংশিক প্রযোজ্য।`,
          `❌ (গ) ভুল কারণ: এটি সম্পূর্ণ বিপরীত ধারণা প্রকাশ করে।`
        ],
        notes: "শিক্ষার্থীদের ব্যাখ্যা করে বুঝিয়ে বলুন কেন প্রতিটি ভুল উত্তর ভুল এবং সঠিক উত্তরটি কেন সঠিক।",
        icon: "fa-lightbulb"
      });
    }

    // ৬. Homework Slide
    if (selectedSeq.length === 0 || selectedSeq.includes("Homework")) {
      newSlides.push({
        id: "slide_hw_" + Date.now(),
        title: "🏠 বাড়ির কাজ (Homework)",
        type: "Homework",
        layout: "single",
        bullets: [
          `📌 পাঠ্যভিত্তিক প্রশ্ন সমাধান করে খাতায় লিখে আনবে।`,
          "📌 আগামী ক্লাসের শুরুতেই বাড়ির কাজ জমা নেওয়া হবে।"
        ],
        notes: "বাড়ির কাজ খাতা লিখে নেওয়ার নির্দেশ দিন।",
        icon: "fa-house-laptop"
      });
    }

    // ৭. Q&A / Ending Slide
    if (selectedSeq.length === 0 || selectedSeq.includes("Q&A")) {
      newSlides.push({
        id: "slide_end_" + Date.now(),
        title: "🎉 ধন্যবাদ ও প্রশ্নোত্তর",
        type: "Q&A",
        layout: "single",
        bullets: [
          "❓ কারও কোনো প্রশ্ন থাকলে নির্দ্বিধায় বলুন!",
          "👏 সক্রিয় অংশগ্রহণের জন্য সবাইকে অনেক ধন্যবাদ।"
        ],
        notes: "সকলকে ধন্যবাদ জানিয়ে স্লাইড শেষ করুন।",
        icon: "fa-sparkles"
      });
    }
  } else if (selectedTemplate === "temp-stem") {
    // STEM Template
    newSlides.push({
      id: "slide_cover_" + Date.now(),
      title: `🔬 STEM প্রজেক্ট: ${subject}`,
      type: "Cover",
      layout: "single",
      bullets: [
        `🏫 প্রতিষ্ঠান: ${schName}`,
        `⚙️ প্রজেক্ট নাম: ${selectedChapter}`,
        `⏱️ প্রজেক্ট সময়: ${duration} মিনিট`,
        `👥 দল গঠন: গ্রুপ এ (${vGoodRolls}) | গ্রুপ বি (${avgRolls}) | গ্রুপ সি (${lowRolls})`
      ],
      notes: "শিক্ষার্থীদের প্রজেক্ট টিমে ভাগ হয়ে বসতে বলুন।",
      icon: "fa-flask"
    });

    newSlides.push({
      id: "slide_outcomes_" + Date.now(),
      title: "🎯 অনুকল্প ও শিখনফল (Hypothesis)",
      type: "Outcomes",
      layout: "card",
      bullets: [
        `অনুকল্প বা উদ্দেশ্য: ${objective.substring(0, 60)}`,
        "১. শিক্ষার্থীরা বৈজ্ঞানিক অনুসন্ধানের মাধ্যমে সমস্যাটির সমাধান করবে।",
        "২. প্রজেক্টের বিভিন্ন উপকরণ ব্যবহার করে পরীক্ষণ সম্পন্ন করবে।",
        "৩. প্রাপ্ত উপাত্ত বিশ্লেষণ করে যৌক্তিক সিদ্ধান্ত গ্রহণ করবে।"
      ],
      notes: "শিক্ষার্থীদের আজকের প্রজেক্টের লক্ষ্যটি বুঝিয়ে বলুন।",
      icon: "fa-lightbulb"
    });

    newSlides.push({
      id: "slide_content_" + Date.now(),
      title: "🔬 পরীক্ষণ পদ্ধতি ও উপকরণ",
      type: "Content",
      layout: "split",
      bullets: [
        `পদ্ধতি: ${methodsStr}`,
        `টপিকসমূহ: ${topicsListStr.join(", ")}`,
        "উপকরণ: বিষয়ভিত্তিক প্রজেক্ট গাইড, টেস্ট কিট ও ওয়ার্কশিট।"
      ],
      notes: "উপকরণ বিতরণ করুন এবং নিরাপত্তার নিয়মাবলী বুঝিয়ে দিন।",
      icon: "fa-vial"
    });

    newSlides.push({
      id: "slide_table_" + Date.now(),
      title: "📊 ডাটা সংগ্রহ ও সময় সারণি",
      type: "Table",
      layout: "card",
      bullets: [
        `⏱️ ০-১৫ মিনিট: প্রজেক্ট ব্রিফ ও উপকরণ প্রস্তুতি`,
        `⏱️ ১৫-৩৫ মিনিট: দলগত পরীক্ষণ ও ডাটা সারণি পূরণ (গ্রুপ এ: রোল ${vGoodRolls} | গ্রুপ বি: রোল ${avgRolls} | গ্রুপ সি: রোল ${lowRolls})`,
        `⏱️ ৩৫-৪৫ মিনিট: ফলাফল বিশ্লেষণ ও সিদ্ধান্ত`
      ],
      notes: "শিক্ষার্থীদের ল্যাব ডাটা সারণিতে সঠিকভাবে ডাটা ইনপুট করতে বলুন।",
      icon: "fa-table"
    });

    newSlides.push({
      id: "slide_quiz_" + Date.now(),
      title: "💡 প্রজেক্ট সিদ্ধান্ত ও কুইজ",
      type: "Quiz",
      layout: "quiz",
      bullets: [
        `জ্ঞানীয় স্তর: ${bloomsStr}`,
        ...quizQuestions
      ],
      notes: "প্রতিটি টিমকে তাদের পরীক্ষণ সিদ্ধান্তের সত্যতা প্রমাণ করতে বলুন।",
      icon: "fa-check-double"
    });

    newSlides.push({
      id: "slide_end_" + Date.now(),
      title: "🎉 প্রশ্নোত্তর ও সমাপ্তি",
      type: "Q&A",
      layout: "single",
      bullets: [
        "❓ প্রজেক্ট নিয়ে কোনো প্রশ্ন থাকলে হাত তুলুন।",
        "👏 সক্রিয় বৈজ্ঞানিক অনুসন্ধানের জন্য সবাইকে ধন্যবাদ!"
      ],
      notes: "সকলকে ধন্যবাদ জানিয়ে ল্যাব এলাকা পরিষ্কার করার নির্দেশ দিন।",
      icon: "fa-award"
    });
  } else if (selectedTemplate === "temp-quiz") {
    // Gamified Quiz Template
    newSlides.push({
      id: "slide_cover_" + Date.now(),
      title: `🎮 গ্যামিফাইড কুইজ: ${subject}`,
      type: "Cover",
      layout: "single",
      bullets: [
        `🏫 প্রতিষ্ঠান: ${schName}`,
        `📖 অধ্যায়: ${selectedChapter}`,
        `⏱️ কুইজ সময়: ${duration} মিনিট`,
        `🏆 কুইজ হোস্ট: শ্রেণি শিক্ষক`
      ],
      notes: "শিক্ষার্থীদের কুইজের জন্য প্রস্তুত হতে বলুন।",
      icon: "fa-gamepad"
    });

    newSlides.push({
      id: "slide_outcomes_" + Date.now(),
      title: "🎯 কুইজের নিয়মাবলী ও লক্ষ্য",
      type: "Outcomes",
      layout: "card",
      bullets: [
        `মূল লক্ষ্য: ${objective.substring(0, 60)}`,
        "১. সঠিক উত্তরের জন্য পাবেন ১০ পয়েন্ট।",
        "২. প্রতিটি প্রশ্নের জন্য নির্ধারিত সময় ৩০ সেকেন্ড।",
        `৩. দলগত আলোচনা করে কুইজে অংশ নিতে হবে: গ্রুপ এ (${vGoodRolls}), গ্রুপ বি (${avgRolls}), গ্রুপ সি (${lowRolls})`
      ],
      notes: "কুইজের নিয়মগুলো বুঝিয়ে বলুন এবং পয়েন্ট গণনা কার্ড দিন।",
      icon: "fa-list-check"
    });

    newSlides.push({
      id: "slide_content_" + Date.now(),
      title: "🎮 রাউন্ড ১: বহুনির্বাচনি কুইজ",
      type: "Quiz",
      layout: "quiz",
      bullets: [
        `পদ্ধতি: ${methodsStr}`,
        quizQuestions[0] || "আজকের পাঠের মূল বিষয় কোনটি?",
        "সঠিক উত্তরের কার্ডটি উঁচু করে দেখাও।"
      ],
      notes: "শিক্ষার্থীদের উত্তর দেওয়ার সুযোগ দিন এবং সঠিক ব্যাখ্যা বুঝিয়ে দিন।",
      icon: "fa-circle-question"
    });

    newSlides.push({
      id: "slide_table_" + Date.now(),
      title: "🧩 রাউন্ড ২: দলগত ধাঁধা ও সমাধান",
      type: "Table",
      layout: "card",
      bullets: [
        `⏱️ গ্রুপ এ (${vGoodRolls}): জটিল বিশ্লেষণী ধাঁধা সমাধান করবে।`,
        `⏱️ গ্রুপ বি (${avgRolls}): পাঠ্যবইয়ের গাণিতিক ধাঁধা সমাধান করবে।`,
        `⏱️ গ্রুপ সি (${lowRolls}): বেসিক সংজ্ঞামূলক ধাঁধা সমাধান করবে।`
      ],
      notes: "গ্রুপ ওয়ার্কের জন্য নির্ধারিত সময় মেনে কাজ পরিচালনা করুন।",
      icon: "fa-puzzle-piece"
    });

    newSlides.push({
      id: "slide_quiz_" + Date.now(),
      title: "📊 কুইজ স্কোরবোর্ড ও সঠিক উত্তর",
      type: "Quiz",
      layout: "quiz",
      bullets: [
        `জ্ঞানীয় স্তর: ${bloomsStr}`,
        ...quizQuestions.slice(1)
      ],
      notes: "পয়েন্ট হিসাব করে স্কোর বোর্ডে তুলে ধরুন।",
      icon: "fa-trophy"
    });

    newSlides.push({
      id: "slide_end_" + Date.now(),
      title: "🎉 বিজয়ী ঘোষণা ও প্রশ্নোত্তর",
      type: "Q&A",
      layout: "single",
      bullets: [
        "🏆 কুইজের বিজয়ী টিমকে অভিনন্দন!",
        "👏 সক্রিয় কুইজ খেলায় অংশ নেওয়ার জন্য ধন্যবাদ।"
      ],
      notes: "বিজয়ী দলকে পুরস্কৃত করুন এবং ক্লাস শেষ করুন।",
      icon: "fa-sparkles"
    });
  } else if (selectedTemplate === "temp-story") {
    // Story-based Template
    newSlides.push({
      id: "slide_cover_" + Date.now(),
      title: `📚 গল্পে গল্পে শিখি: ${subject}`,
      type: "Cover",
      layout: "single",
      bullets: [
        `🏫 প্রতিষ্ঠান: ${schName}`,
        `📖 অধ্যায়: ${selectedChapter}`,
        `⏱️ সময়: ${duration} মিনিট`,
        "📖 আজকের গল্প: রাজুর আবিষ্কার ও বাস্তব শিক্ষা"
      ],
      notes: "শিক্ষার্থীদের ক্লাসে মনোযোগ আকর্ষণ করতে একটি রূপক গল্প শুরু করুন।",
      icon: "fa-book-open-reader"
    });

    newSlides.push({
      id: "slide_outcomes_" + Date.now(),
      title: "🎭 পটভূমি ও চরিত্রের সমস্যা",
      type: "Outcomes",
      layout: "card",
      bullets: [
        `গল্পের মূল সমস্যা: ${objective.substring(0, 60)}`,
        "১. গল্পের চরিত্রের মুখোমুখি হওয়া প্রধান সমস্যা ও তার কারণ অনুসন্ধান করব।",
        "২. চরিত্রদের নেওয়া ভুল ও সঠিক সিদ্ধান্তের ফলাফল বিশ্লেষণ করব।"
      ],
      notes: "গল্পের চরিত্র এবং মূল সমস্যাটি বর্ণনা করুন।",
      icon: "fa-mask-face"
    });

    newSlides.push({
      id: "slide_content_" + Date.now(),
      title: "🚀 সমস্যার সমাধান ও মূল বিষয়বস্তু",
      type: "Content",
      layout: "split",
      bullets: [
        `পঠন পদ্ধতি: ${methodsStr}`,
        ...topicsListStr.map((t) => `📖 গল্পে যেভাবে ${t} এল`),
        "কীভাবে রাজু তার মেধা দিয়ে সমস্যা সমাধান করল তা আমরা জানব।"
      ],
      notes: "গল্পের সমাধানের অংশটি তুলে ধরুন এবং বিষয়ের সংযোগ ঘটিয়ে দিন।",
      icon: "fa-compass"
    });

    newSlides.push({
      id: "slide_table_" + Date.now(),
      title: "🎨 সৃজনশীল দলগত কাজ ও সময় তালিকা",
      type: "Table",
      layout: "card",
      bullets: [
        `⏱️ গ্রুপ এ (${vGoodRolls}): গল্পের বিকল্প ও নতুন সমাধান চিন্তা করবে।`,
        `⏱️ গ্রুপ বি (${avgRolls}): গল্পের চরিত্রের সিদ্ধান্তের ভালো-মন্দ লিখবে।`,
        `⏱️ গ্রুপ সি (${lowRolls}): গল্পটি নিজেদের ভাষায় পুনরাবৃত্তি করবে।`
      ],
      notes: "গ্রুপের কার্যক্রম ঘুরে ঘুরে দেখুন এবং উৎসাহ দিন।",
      icon: "fa-paint-brush"
    });

    newSlides.push({
      id: "slide_quiz_" + Date.now(),
      title: "🧠 গল্পের শিক্ষণীয় বিষয় ও মূল্যায়ন",
      type: "Quiz",
      layout: "quiz",
      bullets: [
        `জ্ঞানীয় স্তর: ${bloomsStr}`,
        ...quizQuestions
      ],
      notes: "শিক্ষার্থীদের জিজ্ঞেস করুন তারা রাজুর জায়গা থাকলে কী করতো।",
      icon: "fa-brain"
    });

    newSlides.push({
      id: "slide_end_" + Date.now(),
      title: "🎉 গল্পের সমাপ্তি ও ধন্যবাদ",
      type: "Q&A",
      layout: "single",
      bullets: [
        "❓ গল্প ও পাঠ নিয়ে কারও কোনো প্রশ্ন আছে কি?",
        "👏 সুন্দর গল্প শুনে শেখার জন্য ধন্যবাদ!"
      ],
      notes: "ক্লাসের সারসংক্ষেপ নিয়ে প্রশ্নোত্তর সেশন শেষ করুন।",
      icon: "fa-heart"
    });
  }

  // স্লাইডের তথ্য অতিরিক্ত বড় হলে স্বয়ংক্রিয়ভাবে আলাদা স্লাইডে বিভক্ত করার লজিক (Automatic Slide Splitting)
  let processedSlides = [];
  newSlides.forEach((slide) => {
    // We only split if it has bullets, and is not a Cover slide
    if (slide.type !== "Cover" && slide.bullets && slide.bullets.length > 4) {
      const maxBullets = 4;
      let part = 1;
      const totalParts = Math.ceil(slide.bullets.length / maxBullets);
      for (let i = 0; i < slide.bullets.length; i += maxBullets) {
        const chunk = slide.bullets.slice(i, i + maxBullets);
        const suffix = ` (পর্ব ${part}/${totalParts})`;
        processedSlides.push({
          ...slide,
          id: slide.id + "_p" + part,
          title: slide.title + suffix,
          bullets: chunk
        });
        part++;
      }
    } else {
      processedSlides.push(slide);
    }
  });

  slides = processedSlides;
  if (activeSlideIndex >= slides.length) activeSlideIndex = 0;

  renderStudio();
}

// [৬] স্লাইড প্রিভিউ স্টুডিও রেন্ডারিং (Thumbnails & Active Canvas & Editor Sync)
function renderStudio() {
  renderThumbnails();
  renderActiveCanvas();
  syncEditorForm();
}

function renderThumbnails() {
  const container = document.getElementById("slideThumbnailsContainer");
  const countBadge = document.getElementById("slideCountBadge");
  if (!container) return;

  if (countBadge) countBadge.innerText = `${currentLang === "bn" ? "স্লাইড" : "Slide"} ${slides.length === 0 ? 0 : activeSlideIndex + 1} / ${slides.length}`;

  container.innerHTML = slides
    .map(
      (s, idx) => `
      <div class="thumb-card ${idx === activeSlideIndex ? "active" : ""}" onclick="selectSlide(${idx})">
        <span class="thumb-num">${idx + 1}</span>
        <div class="thumb-title">${s.title}</div>
        <div class="thumb-type">${getSlideTypeName(s.type)}</div>
      </div>
    `
    )
    .join("");
}

function selectSlide(idx) {
  activeSlideIndex = idx;
  renderThumbnails();
  renderActiveCanvas();
  syncEditorForm();
}

function renderActiveCanvas() {
  const canvas = document.getElementById("slideCanvas");
  const inner = document.getElementById("slideInnerContent");
  const navInfo = document.getElementById("canvasSlideInfo");
  if (!canvas || !inner) return;

  if (slides.length === 0) {
    inner.innerHTML = "<h3>কোনো স্লাইড নেই</h3>";
    return;
  }

  const slide = slides[activeSlideIndex];
  const bgClass = slide.bg && slide.bg !== "default" ? slide.bg : "";
  canvas.className = `slide-frame ${activeTheme} ${bgClass}`;

  if (navInfo) navInfo.innerText = `${currentLang === "bn" ? "স্লাইড" : "Slide"} ${activeSlideIndex + 1} ${currentLang === "bn" ? "এর" : "of"} ${slides.length}`;

  // Get animations from slide object
  const titleAnimClass = slide.titleAnimation && slide.titleAnimation !== "none" ? `anim-${slide.titleAnimation}` : "";
  const contentAnimClass = slide.contentAnimation && slide.contentAnimation !== "none" ? `anim-${slide.contentAnimation}` : "";
  const imgAnimClass = slide.imageAnimation && slide.imageAnimation !== "none" ? `anim-${slide.imageAnimation}` : "";

  const bulletsHtml = slide.bullets
    .map(
      (b, bIdx) => `
      <div class="slide-bullet-item editable-element ${contentAnimClass}" contenteditable="true" onblur="onCanvasContentEdit(event, 'bullet', ${bIdx})">
        <i class="fa-solid fa-chevron-right" style="font-size:12px; opacity:0.7;"></i> 
        <span>${b}</span>
      </div>`
    )
    .join("");

  const teacherNotesHtml = slide.notes
    ? `<div class="teacher-notes-badge editable-element" contenteditable="true" onblur="onCanvasContentEdit(event, 'notes')"><i class="fa-solid fa-user-gear"></i> <strong>${currentLang === "bn" ? "শিক্ষক নোট:" : "Teacher Note:"}</strong> <span>${slide.notes}</span></div>`
    : "";

  let visualComponentHtml = "";
  const selectedVisuals = Array.from(document.querySelectorAll(".vis-check:checked")).map((cb) => cb.value);

  // Custom Image rendering with Whiteboard Editor OR Default Visual Components
  if (slide.image && slide.showImage !== false) {
    visualComponentHtml = `
      <div class="whiteboard-wrapper ${imgAnimClass}" id="wb_wrapper_${slide.id}">
        <!-- Whiteboard Toolbar -->
        <div class="whiteboard-toolbar">
          <div class="wb-tools-group">
            <button class="wb-btn active" onclick="setWbTool(this, 'select')" title="ছবির অবজেক্ট বা শেপ সিলেক্ট ও মুভ করুন"><i class="fa-solid fa-arrows-up-down-left-right"></i> মুভ</button>
            <button class="wb-btn" onclick="setWbTool(this, 'pen')" title="পেন দিয়ে ড্রয়িং করুন"><i class="fa-solid fa-pen"></i> পেন</button>
            <button class="wb-btn" onclick="setWbTool(this, 'eraser')" title="ড্রয়িং মুছুন"><i class="fa-solid fa-eraser"></i> ইরেজার</button>
            <button class="wb-btn" onclick="addWbText()" title="Draggable টেক্সট বক্স যোগ করুন"><i class="fa-solid fa-font"></i> টেক্সট</button>
            <button class="wb-btn" onclick="addWbShape('rect')" title="আয়তক্ষেত্র যোগ করুন"><i class="fa-regular fa-square"></i> আয়ত</button>
            <button class="wb-btn" onclick="addWbShape('circle')" title="বৃত্ত যোগ করুন"><i class="fa-regular fa-circle"></i> বৃত্ত</button>
            <button class="wb-btn" onclick="addWbShape('arrow')" title="তীরচিহ্ন যোগ করুন"><i class="fa-solid fa-arrow-right"></i> তীর</button>
          </div>
          <!-- Text formatting tools -->
          <div class="wb-tools-group" style="border-left: 1px solid rgba(0,0,0,0.1); padding-left: 6px;">
            <button class="wb-btn" onclick="changeWbTextSize(2)" title="লেখা বড় করুন"><i class="fa-solid fa-magnifying-glass-plus"></i> বড়</button>
            <button class="wb-btn" onclick="changeWbTextSize(-2)" title="লেখা ছোট করুন"><i class="fa-solid fa-magnifying-glass-minus"></i> ছোট</button>
            <button class="wb-btn" onclick="toggleWbTextBold()" title="বোল্ড / রেগুলার"><i class="fa-solid fa-bold"></i> বোল্ড</button>
          </div>
          <div class="wb-tools-group" style="gap: 8px;">
            <div style="display: flex; align-items: center; gap: 4px; font-size: 11.5px;">
              <span>সাইজ:</span>
              <input type="range" class="wb-img-size-slider" min="20" max="150" value="${slide.imageWidth || 60}" style="width: 40px; height:4px; cursor:pointer;" oninput="updateWbImageSize(this.value)">
            </div>
            <div class="wb-color-picker">
              <span class="wb-color-dot active" style="background:#ef4444;" onclick="setWbColor(this, '#ef4444')"></span>
              <span class="wb-color-dot" style="background:#3b82f6;" onclick="setWbColor(this, '#3b82f6')"></span>
              <span class="wb-color-dot" style="background:#10b981;" onclick="setWbColor(this, '#10b981')"></span>
              <span class="wb-color-dot" style="background:#f59e0b;" onclick="setWbColor(this, '#f59e0b')"></span>
              <span class="wb-color-dot" style="background:#0f172a;" onclick="setWbColor(this, '#0f172a')"></span>
              <span class="wb-color-dot" style="background:#ffffff;" onclick="setWbColor(this, '#ffffff')"></span>
            </div>
            <button class="wb-btn" onclick="clearWbDrawing()" style="color: var(--danger); font-weight:bold; padding: 2px 6px;"><i class="fa-solid fa-trash-can"></i> রিসেট</button>
          </div>
        </div>

        <!-- Canvas and Element Area -->
        <div class="whiteboard-canvas-area" id="wb_canvas_area_edit">
          <!-- Image Element (Draggable/Resizable) -->
          <div class="wb-element wb-image-container" id="wb_image_container_edit" style="left: ${slide.imageX || 20}%; top: ${slide.imageY || 10}%; width: ${slide.imageWidth || 60}%;">
            <img src="${slide.image}" class="wb-image-el" style="width: 100%; display: block;" alt="Slide Image">
            <div class="wb-resize-handle"></div>
          </div>

          <!-- Drawing Canvas Overlay -->
          <canvas class="wb-canvas" id="wb_canvas_edit"></canvas>

          <!-- Annotations container for shapes and text boxes -->
          <div class="wb-annotations-layer" id="wb_annotations_layer_edit" style="position: absolute; top:0; left:0; width:100%; height:100%; pointer-events: none; z-index:9;">
            <!-- Saved annotations loaded here -->
          </div>
        </div>
      </div>
    `;
  } else {
    let visualInner = "";
    if (slide.type === "Quiz" || slide.layout === "quiz") {
      visualInner = `
        <div class="quiz-options-grid">
          <div class="quiz-opt-card" onclick="toggleQuizAnswer(this)"><span>ক)</span> প্রথম বিকল্প</div>
          <div class="quiz-opt-card" onclick="toggleQuizAnswer(this)"><span>খ)</span> দ্বিতীয় উত্তর (সঠিক)</div>
          <div class="quiz-opt-card" onclick="toggleQuizAnswer(this)"><span>গ)</span> তৃতীয় বিকল্প</div>
          <div class="quiz-opt-card" onclick="toggleQuizAnswer(this)"><span>ঘ)</span> চতুর্থ বিকল্প</div>
        </div>
      `;
    } else if (slide.type === "Table" && selectedVisuals.includes("table")) {
      const vGoodRolls = document.getElementById("roll-vgood")?.value || "১, ২, ৩";
      const avgRolls = document.getElementById("roll-avg")?.value || "৪, ৫, ৬";
      const lowRolls = document.getElementById("roll-low")?.value || "৭, ৮, ৯";
      visualInner = `
        <strong style="font-size:12.5px; display:block; margin-bottom:6px;"><i class="fa-solid fa-users-gear"></i> スマート শিক্ষার্থী গ্রুপিং:</strong>
        <table class="slide-data-table">
          <thead>
            <tr><th>গ্রুপ</th><th>রোল নম্বর</th><th>কার্যক্রম</th></tr>
          </thead>
          <tbody>
            <tr style="border-left: 4px solid #10b981;"><td><strong>গ্রুপ এ (উন্নত)</strong></td><td>${vGoodRolls}</td><td>বিশ্লেষণমূলক সমাধান ও বাস্তব প্রয়োগ</td></tr>
            <tr style="border-left: 4px solid #f59e0b;"><td><strong>গ্রুপ বি (মাঝারি)</strong></td><td>${avgRolls}</td><td>পাঠ্যবইয়ের অনুশীলন ও গ্রুপ ওয়ার্ক</td></tr>
            <tr style="border-left: 4px solid #ef4444;"><td><strong>গ্রুপ সি (বিশেষ যত্ন)</strong></td><td>${lowRolls}</td><td>শিক্ষকের সহায়তায় বেসিক পুনরাবৃত্তি</td></tr>
          </tbody>
        </table>
      `;
    } else if (selectedVisuals.includes("chart")) {
      visualInner = `
        <strong style="font-size:12px; display:block; margin-bottom:4px;"><i class="fa-solid fa-chart-simple"></i> তথ্য চিত্র ও প্রজেক্ট অগ্রগতি:</strong>
        <div class="chart-bars-wrap">
          <div class="chart-bar-fill" style="height: 35%;"></div><span class="chart-bar-label">পরিকল্পনা (৩৫%)</span>
          <div class="chart-bar-fill" style="height: 70%;"></div><span class="chart-bar-label">পরীক্ষণ (৭০%)</span>
          <div class="chart-bar-fill" style="height: 90%;"></div><span class="chart-bar-label">বিশ্লেষণ (৯০%)</span>
          <div class="chart-bar-fill" style="height: 50%;"></div><span class="chart-bar-label">উপস্থাপন (৫০%)</span>
        </div>
      `;
    } else if (selectedVisuals.includes("table")) {
      visualInner = `
        <strong style="font-size:12px; display:block; margin-bottom:4px;"><i class="fa-solid fa-table"></i> বিষয় সারণি:</strong>
        <table class="slide-data-table">
          <thead>
            <tr><th>পর্ব</th><th>বিষয়বস্তু</th><th>সময়</th></tr>
          </thead>
          <tbody>
            <tr><td>১ম পর্ব</td><td>ধারণা স্পষ্টকরণ</td><td>১৫ মিনিট</td></tr>
            <tr><td>২য় পর্ব</td><td>দলগত কাজ ও উপস্থাপনা</td><td>২০ মিনিট</td></tr>
          </tbody>
        </table>
      `;
    } else if (selectedVisuals.includes("info")) {
      visualInner = `
        <strong style="font-size:12px; display:block; margin-bottom:8px;"><i class="fa-solid fa-lightbulb"></i> শিখন ধাপসমূহ:</strong>
        <div class="infographic-steps-wrap">
          <div class="info-step-card"><div class="step-num">১</div><div class="step-txt">ধারণা গ্রহণ</div></div>
          <div class="info-step-card"><div class="step-num">২</div><div class="step-txt">শ্রেণি অনুশীলন</div></div>
          <div class="info-step-card"><div class="step-num">৩</div><div class="step-txt">মূল্যায়ন ও কুইজ</div></div>
        </div>
      `;
    } else if (selectedVisuals.includes("vid")) {
      visualInner = `
        <div class="mock-video-player">
          <i class="fa-solid fa-play play-icon"></i>
          <span class="video-duration">03:45</span>
        </div>
        <span class="video-title"><i class="fa-solid fa-video"></i> ${slide.title} সম্পর্কিত মাল্টিমিডিয়া কন্টেন্ট</span>
      `;
    } else if (selectedVisuals.includes("img") || selectedVisuals.includes("geo")) {
      visualInner = `
        <div class="diagram-graphic-box">
          <div class="diagram-node">সংজ্ঞা ও সূচনা</div>
          <i class="fa-solid fa-arrow-right"></i>
          <div class="diagram-node" style="background:#10b981;">বিশ্লেষণ ও প্রয়োগ</div>
          <i class="fa-solid fa-arrow-right"></i>
          <div class="diagram-node" style="background:#f59e0b;">সিদ্ধান্ত গ্রহণ</div>
        </div>
      `;
    }

    if (visualInner) {
      visualComponentHtml = `
        <div class="visual-component-box ${imgAnimClass}">
          ${visualInner}
        </div>
      `;
    }
  }

  inner.className = `slide-inner-content`;

  let bodyContentHtml = "";
  if (slide.layout === "split") {
    bodyContentHtml = `
      <div class="slide-body-grid layout-split">
        <div class="slide-bullets-wrapper">
          ${bulletsHtml}
        </div>
        <div class="slide-visual-wrapper">
          ${visualComponentHtml}
        </div>
      </div>
    `;
  } else if (slide.layout === "card") {
    bodyContentHtml = `
      <div class="slide-body-grid layout-card">
        <div class="card-layout-wrapper">
          ${slide.bullets.map((b, bIdx) => `
            <div class="slide-bullet-card editable-element ${contentAnimClass}" contenteditable="true" onblur="onCanvasContentEdit(event, 'bullet', ${bIdx})">
              <i class="fa-solid ${slide.icon || 'fa-star'}" style="color:var(--primary); font-size:16px;"></i>
              <div class="bullet-card-text">${b}</div>
            </div>
          `).join("")}
        </div>
        ${visualComponentHtml ? `<div class="slide-visual-wrapper">${visualComponentHtml}</div>` : ""}
      </div>
    `;
  } else if (slide.layout === "quiz") {
    bodyContentHtml = `
      <div class="slide-body-grid layout-quiz">
        <div class="quiz-question-area">
          <div class="slide-bullets-wrapper">
            ${bulletsHtml}
          </div>
        </div>
        <div class="quiz-options-area">
          ${visualComponentHtml}
        </div>
      </div>
    `;
  } else {
    bodyContentHtml = `
      <div class="slide-body-grid layout-single">
        <div class="slide-bullets-wrapper">
          ${bulletsHtml}
        </div>
        ${visualComponentHtml ? `<div class="slide-visual-wrapper">${visualComponentHtml}</div>` : ""}
      </div>
    `;
  }

  inner.innerHTML = `
    <div class="slide-header-box">
      <span class="slide-tag">${getSlideTypeName(slide.type)}</span>
      <i class="fa-solid ${slide.icon || "fa-graduation-cap"} slide-icon-lg"></i>
    </div>
    <h2 class="slide-main-title editable-element ${titleAnimClass}" contenteditable="true" onblur="onCanvasContentEdit(event, 'title')">${slide.title}</h2>
    ${bodyContentHtml}
    ${teacherNotesHtml}
  `;

  // Init whiteboard if image is visible
  if (slide.image && slide.showImage !== false) {
    initWhiteboard(slide, false);
  }
}


function toggleQuizAnswer(el) {
  el.classList.toggle("selected-answer");
}

function onCanvasContentEdit(event, field, index) {
  if (slides.length === 0) return;
  const slide = slides[activeSlideIndex];
  const text = event.target.innerText.trim();

  if (field === "title") {
    slide.title = text || "শিরোনামহীন স্লাইড";
  } else if (field === "bullet" && index !== undefined) {
    if (slide.bullets[index] !== undefined) {
      slide.bullets[index] = text;
    }
  } else if (field === "notes") {
    slide.notes = text;
  }
  slide.isCustomized = true;
  syncEditorForm();
  renderThumbnails();
}


// হোয়াইটবোর্ড গ্লোবাল ভ্যারিয়েবলসমূহ
let wbActiveTool = 'select'; // select, pen, eraser
let wbActiveColor = '#ef4444';
let wbBrushSize = 3;
let wbIsDrawing = false;
let wbLastX = 0;
let wbLastY = 0;
let wbActiveElement = null; // element being dragged/resized
let wbLastActiveElement = null; // last interacted/selected text or shape element
let wbIsDragging = false;
let wbIsResizing = false;
let wbDragStartX = 0;
let wbDragStartY = 0;
let wbElementStartX = 0;
let wbElementStartY = 0;
let wbElementStartWidth = 0;
let wbElementStartHeight = 0;

function syncEditorForm() {
  if (slides.length === 0) return;
  const slide = slides[activeSlideIndex];
  if (document.getElementById("editSlideTitle")) document.getElementById("editSlideTitle").value = slide.title || "";
  if (document.getElementById("editSlideType")) document.getElementById("editSlideType").value = slide.type || "Content";
  if (document.getElementById("editSlideLayout")) document.getElementById("editSlideLayout").value = slide.layout || "single";
  if (document.getElementById("editSlideBullets")) document.getElementById("editSlideBullets").value = (slide.bullets || []).join("\n");
  if (document.getElementById("editTeacherNotes")) document.getElementById("editTeacherNotes").value = slide.notes || "";
  if (document.getElementById("editSlideIcon")) document.getElementById("editSlideIcon").value = slide.icon || "fa-graduation-cap";
  if (document.getElementById("editSlideBg")) document.getElementById("editSlideBg").value = slide.bg || "default";

  // sync animations
  if (document.getElementById("editTitleAnim")) document.getElementById("editTitleAnim").value = slide.titleAnimation || "none";
  if (document.getElementById("editContentAnim")) document.getElementById("editContentAnim").value = slide.contentAnimation || "none";
  if (document.getElementById("editImageAnim")) document.getElementById("editImageAnim").value = slide.imageAnimation || "none";

  // sync image
  if (document.getElementById("editShowImage")) document.getElementById("editShowImage").checked = slide.showImage !== false;
  if (document.getElementById("editImageUrl")) document.getElementById("editImageUrl").value = (slide.image && !slide.image.startsWith("data:")) ? slide.image : "";
  if (document.getElementById("editPresetImage")) document.getElementById("editPresetImage").value = "";

  const previewArea = document.getElementById("imagePreviewArea");
  const previewImg = document.getElementById("editImagePreview");
  if (previewArea && previewImg) {
    if (slide.image) {
      previewImg.src = slide.image;
      previewArea.style.display = "block";
    } else {
      previewImg.src = "";
      previewArea.style.display = "none";
    }
  }
}

function updateActiveSlideFromEditor() {
  if (slides.length === 0) return;
  const slide = slides[activeSlideIndex];

  const titleVal = document.getElementById("editSlideTitle")?.value;
  const typeVal = document.getElementById("editSlideType")?.value;
  const layoutVal = document.getElementById("editSlideLayout")?.value;
  const bulletsVal = document.getElementById("editSlideBullets")?.value;
  const notesVal = document.getElementById("editTeacherNotes")?.value;
  const iconVal = document.getElementById("editSlideIcon")?.value;
  const bgVal = document.getElementById("editSlideBg")?.value;

  const titleAnimVal = document.getElementById("editTitleAnim")?.value || "none";
  const contentAnimVal = document.getElementById("editContentAnim")?.value || "none";
  const imageAnimVal = document.getElementById("editImageAnim")?.value || "none";
  const showImageVal = document.getElementById("editShowImage")?.checked ?? false;
  const imageUrlVal = document.getElementById("editImageUrl")?.value || "";

  slide.title = titleVal || "শিরোনামহীন স্লাইড";
  slide.type = typeVal || "Content";
  slide.layout = layoutVal || "single";
  slide.bullets = bulletsVal ? bulletsVal.split("\n").filter((l) => l.trim() !== "") : [];
  slide.notes = notesVal || "";
  slide.icon = iconVal || "fa-graduation-cap";
  slide.bg = bgVal || "default";

  slide.titleAnimation = titleAnimVal;
  slide.contentAnimation = contentAnimVal;
  slide.imageAnimation = imageAnimVal;
  slide.showImage = showImageVal;
  if (imageUrlVal) {
    slide.image = imageUrlVal;
  }
  slide.isCustomized = true;

  renderThumbnails();
  renderActiveCanvas();
}

// ছবি আপলোড ও প্রিসেট হ্যান্ডলারসমূহ এবং অ্যানিমেশন প্রিভিউ ফাংশন
function handleImageUpload(event) {
  if (slides.length === 0) return;
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const slide = slides[activeSlideIndex];
    slide.image = e.target.result;
    slide.showImage = true;
    slide.isCustomized = true;

    // Reset default whiteboard coordinates for new image
    slide.imageX = 20;
    slide.imageY = 10;
    slide.imageWidth = 60;
    delete slide.canvasDrawing;
    slide.annotations = [];
    wbLastActiveElement = null;

    // Update preview
    const previewArea = document.getElementById("imagePreviewArea");
    const previewImg = document.getElementById("editImagePreview");
    if (previewArea && previewImg) {
      previewImg.src = e.target.result;
      previewArea.style.display = "block";
    }
    const showImageCheckbox = document.getElementById("editShowImage");
    if (showImageCheckbox) showImageCheckbox.checked = true;

    // Clear URL input
    const urlInput = document.getElementById("editImageUrl");
    if (urlInput) urlInput.value = "";

    updateActiveSlideFromEditor();
  };
  reader.readAsDataURL(file);
}

function applyPresetImage() {
  if (slides.length === 0) return;
  const presetSel = document.getElementById("editPresetImage");
  if (!presetSel) return;
  const val = presetSel.value;
  if (!val) return;

  const slide = slides[activeSlideIndex];
  slide.image = val;
  slide.showImage = true;
  slide.isCustomized = true;

  // Reset default whiteboard coordinates
  slide.imageX = 20;
  slide.imageY = 10;
  slide.imageWidth = 60;
  delete slide.canvasDrawing;
  slide.annotations = [];
  wbLastActiveElement = null;

  // Clear file input
  const fileInput = document.getElementById("editImageFile");
  if (fileInput) fileInput.value = "";

  // Update URL input
  const urlInput = document.getElementById("editImageUrl");
  if (urlInput) urlInput.value = val;

  // Update checkbox
  const showImageCheckbox = document.getElementById("editShowImage");
  if (showImageCheckbox) showImageCheckbox.checked = true;

  updateActiveSlideFromEditor();
}

function removeSlideImage() {
  if (slides.length === 0) return;
  const slide = slides[activeSlideIndex];
  delete slide.image;
  slide.showImage = false;
  slide.isCustomized = true;
  
  delete slide.canvasDrawing;
  slide.annotations = [];
  wbLastActiveElement = null;

  // Clear inputs
  const fileInput = document.getElementById("editImageFile");
  if (fileInput) fileInput.value = "";
  const urlInput = document.getElementById("editImageUrl");
  if (urlInput) urlInput.value = "";
  const presetSel = document.getElementById("editPresetImage");
  if (presetSel) presetSel.value = "";
  const showImageCheckbox = document.getElementById("editShowImage");
  if (showImageCheckbox) showImageCheckbox.checked = false;

  updateActiveSlideFromEditor();
}

function replayCanvasAnimations() {
  renderActiveCanvas();
}

// =================== হোয়াইটবোর্ড ইন্টারেক্টিভ ফাংশনসমূহ ===================

function initWhiteboard(slide, isPresenter) {
  const suffix = isPresenter ? "_pres" : "_edit";
  const canvas = document.getElementById("wb_canvas" + suffix);
  const area = document.getElementById("wb_canvas_area" + suffix);
  const wrapper = document.getElementById("wb_image_container" + suffix);
  const annotLayer = document.getElementById("wb_annotations_layer" + suffix);
  if (!canvas || !area) return;

  // সেটআপ ক্যানভাস রেজোলিউশন
  setTimeout(() => {
    const rect = area.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // লোড ক্যানভাস ড্রয়িং (PNG)
    if (slide.canvasDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = slide.canvasDrawing;
    }

    // লোড কাস্টম টেক্সট এবং শেপ অ্যানোটেশন
    if (annotLayer && slide.annotations) {
      annotLayer.innerHTML = "";
      slide.annotations.forEach((ann, index) => {
        const el = document.createElement("div");
        el.className = `wb-element ${ann.type === 'text' ? 'wb-text-box' : 'wb-shape wb-shape-' + ann.type}`;
        el.style.left = `${ann.x}%`;
        el.style.top = `${ann.y}%`;
        el.style.width = ann.width ? `${ann.width}%` : 'auto';
        el.style.height = ann.height ? `${ann.height}%` : 'auto';
        el.style.color = ann.color || '#ef4444';
        el.style.borderColor = ann.color || '#ef4444';
        el.dataset.id = ann.id || `ann_${index}`;

        if (ann.type === 'text') {
          el.contentEditable = !isPresenter;
          el.innerText = ann.text || 'টেক্সট';
          el.style.color = ann.color || '#ef4444';
          el.style.fontSize = ann.fontSize ? `${ann.fontSize}px` : '18px';
          el.style.fontWeight = ann.fontWeight || 'bold';
          el.onblur = () => {
            el.classList.remove("editing");
            saveWhiteboardState(slide);
          };
          el.onfocus = () => {
            el.classList.add("editing");
            wbLastActiveElement = el;
          };
        } else if (ann.type === 'arrow') {
          el.innerHTML = `<i class="fa-solid fa-arrow-right-long"></i>`;
        }

        // রিলিজ হ্যান্ডেল
        if (!isPresenter) {
          const handle = document.createElement("div");
          handle.className = "wb-resize-handle";
          el.appendChild(handle);
        }

        // মুছে ফেলার বাটন (delete button)
        if (!isPresenter) {
          const delBtn = document.createElement("div");
          delBtn.className = "wb-delete-btn";
          delBtn.innerHTML = `<i class="fa-solid fa-circle-xmark"></i>`;
          delBtn.onclick = (e) => {
            e.stopPropagation();
            el.remove();
            if (wbLastActiveElement === el) wbLastActiveElement = null;
            saveWhiteboardState(slide);
          };
          el.appendChild(delBtn);
        }

        annotLayer.appendChild(el);
        if (!isPresenter) {
          makeElementInteractable(el, slide);
        }
      });
    }

    if (!isPresenter) {
      makeElementInteractable(wrapper, slide);
    }
  }, 100);

  // Set initial tool pointer-events
  updateWbPointerEvents(isPresenter);

  // মাউস ও টাচ ইভেন্টস যুক্তকরণ
  canvas.addEventListener("mousedown", (e) => startDrawing(e, canvas));
  canvas.addEventListener("mousemove", (e) => draw(e, canvas, slide));
  canvas.addEventListener("mouseup", () => stopDrawing(slide));
  canvas.addEventListener("mouseout", () => stopDrawing(slide));

  canvas.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: t.clientX,
      clientY: t.clientY
    });
    canvas.dispatchEvent(mouseEvent);
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: t.clientX,
      clientY: t.clientY
    });
    canvas.dispatchEvent(mouseEvent);
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener("touchend", () => {
    const mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  });
}

function makeElementInteractable(el, slide) {
  if (!el) return;

  // Determine suffix based on context
  const isPres = document.getElementById("fullscreenOverlay").style.display !== "none";
  const suffix = isPres ? "_pres" : "_edit";

  const handle = el.querySelector(".wb-resize-handle");
  let clickTime = 0;

  // ড্র্যাগিং ইভেন্ট লিসেনার
  el.addEventListener("mousedown", (e) => {
    if (wbActiveTool !== 'select') return;
    if (e.target === handle) return;
    if (e.target.closest(".wb-delete-btn")) return;
    if (document.activeElement === el) return; // Allow caret editing when focused

    clickTime = Date.now();
    wbActiveElement = el;
    wbLastActiveElement = el;
    wbIsDragging = true;
    wbDragStartX = e.clientX;
    wbDragStartY = e.clientY;

    const area = document.getElementById("wb_canvas_area" + suffix);
    const areaRect = area.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    wbElementStartX = ((elRect.left - areaRect.left) / areaRect.width) * 100;
    wbElementStartY = ((elRect.top - areaRect.top) / areaRect.height) * 100;

    document.querySelectorAll(".wb-element").forEach(item => item.classList.remove("selected"));
    el.classList.add("selected");

    // Sync color picker to this elements current color
    const currentColor = el.style.color || el.style.borderColor || '#ef4444';
    document.querySelectorAll(".wb-color-dot").forEach(d => {
      d.classList.remove("active");
      const rgbColor = d.style.backgroundColor;
      if (rgbColor === currentColor) d.classList.add("active");
    });

    e.stopPropagation();
    e.preventDefault();
  });

  // mouseup for focusing contenteditable text box on short clicks
  el.addEventListener("mouseup", (e) => {
    if (wbActiveTool !== 'select') return;
    if (document.activeElement === el) return;

    const dragDuration = Date.now() - clickTime;
    if (dragDuration < 250 && el.contentEditable === "true") {
      el.focus();
      if (el.innerText === 'নতুন টেক্সট') {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  });

  // ডাবল ক্লিক করলে টেক্সট ফোকাস হবে
  el.addEventListener("dblclick", (e) => {
    if (el.contentEditable === "true") {
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      e.stopPropagation();
    }
  });

  // সাইজ পরিবর্তন ইভেন্ট লিসেনার
  if (handle) {
    handle.addEventListener("mousedown", (e) => {
      wbActiveElement = el;
      wbLastActiveElement = el;
      wbIsResizing = true;
      wbDragStartX = e.clientX;
      wbDragStartY = e.clientY;

      const area = document.getElementById("wb_canvas_area" + suffix);
      const areaRect = area.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      wbElementStartWidth = (elRect.width / areaRect.width) * 100;
      wbElementStartHeight = (elRect.height / areaRect.height) * 100;

      e.stopPropagation();
      e.preventDefault();
    });
  }

  // গ্লোবাল ড্র্যাগ লিসেনার
  if (!window.wbListenersAttached) {
    window.wbListenersAttached = true;
    
    document.addEventListener("mousemove", (e) => {
      if (!wbActiveElement) return;

      const isPresActive = document.getElementById("fullscreenOverlay").style.display !== "none";
      const activeSuffix = isPresActive ? "_pres" : "_edit";

      const area = document.getElementById("wb_canvas_area" + activeSuffix);
      if (!area) return;
      const areaRect = area.getBoundingClientRect();

      if (wbIsDragging) {
        const dx = ((e.clientX - wbDragStartX) / areaRect.width) * 100;
        const dy = ((e.clientY - wbDragStartY) / areaRect.height) * 100;

        let newX = wbElementStartX + dx;
        let newY = wbElementStartY + dy;

        newX = Math.max(0, Math.min(95, newX));
        newY = Math.max(0, Math.min(95, newY));

        wbActiveElement.style.left = `${newX}%`;
        wbActiveElement.style.top = `${newY}%`;
      } else if (wbIsResizing) {
        const dx = ((e.clientX - wbDragStartX) / areaRect.width) * 100;
        const dy = ((e.clientY - wbDragStartY) / areaRect.height) * 100;

        const newW = Math.max(5, wbElementStartWidth + dx);
        const newH = Math.max(5, wbElementStartHeight + dy);

        wbActiveElement.style.width = `${newW}%`;
        if (!wbActiveElement.classList.contains("wb-image-container")) {
          wbActiveElement.style.height = `${newH}%`;
        }
      }
    });

    document.addEventListener("mouseup", () => {
      if (wbActiveElement) {
        const currentSlide = slides[activeSlideIndex];
        saveWhiteboardState(currentSlide);
        wbActiveElement = null;
        wbIsDragging = false;
        wbIsResizing = false;
      }
    });
  }
}

function startDrawing(e, canvas) {
  if (wbActiveTool !== 'pen' && wbActiveTool !== 'eraser') return;
  wbIsDrawing = true;
  const rect = canvas.getBoundingClientRect();
  wbLastX = e.clientX - rect.left;
  wbLastY = e.clientY - rect.top;
}

function draw(e, canvas, slide) {
  if (!wbIsDrawing || (wbActiveTool !== 'pen' && wbActiveTool !== 'eraser')) return;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.beginPath();
  ctx.moveTo(wbLastX, wbLastY);
  ctx.lineTo(x, y);

  if (wbActiveTool === 'pen') {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = wbActiveColor;
    ctx.lineWidth = wbBrushSize;
  } else if (wbActiveTool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = wbBrushSize * 5;
  }

  ctx.stroke();
  wbLastX = x;
  wbLastY = y;
}

function stopDrawing(slide) {
  if (wbIsDrawing) {
    wbIsDrawing = false;
    saveWhiteboardState(slide);
  }
}

function saveWhiteboardState(slide) {
  if (!slide) return;

  const isPres = document.getElementById("fullscreenOverlay").style.display !== "none";
  const suffix = isPres ? "_pres" : "_edit";

  const canvas = document.getElementById("wb_canvas" + suffix);
  const wrapper = document.getElementById("wb_image_container" + suffix);
  const annotLayer = document.getElementById("wb_annotations_layer" + suffix);

  // ক্যানভাস ড্রয়িং সংরক্ষণ
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    if (canvas.toDataURL() === blank.toDataURL()) {
      delete slide.canvasDrawing;
    } else {
      slide.canvasDrawing = canvas.toDataURL();
    }
  }

  // কাস্টম ইমেজ সাইজ ও পজিশন সংরক্ষণ
  if (wrapper) {
    slide.imageX = parseFloat(wrapper.style.left) || 20;
    slide.imageY = parseFloat(wrapper.style.top) || 10;
    slide.imageWidth = parseFloat(wrapper.style.width) || 60;
  }

  // কাস্টম টেক্সট ও শেপসমূহ সংরক্ষণ
  if (annotLayer) {
    const annList = [];
    const elements = annotLayer.querySelectorAll(".wb-element");
    elements.forEach((el, index) => {
      const type = el.classList.contains("wb-text-box") ? "text" : 
                   el.classList.contains("wb-shape-rect") ? "rect" :
                   el.classList.contains("wb-shape-circle") ? "circle" : "arrow";

      const annObj = {
        id: el.dataset.id || `ann_${index}_${Date.now()}`,
        type: type,
        x: parseFloat(el.style.left) || 40,
        y: parseFloat(el.style.top) || 40,
        width: parseFloat(el.style.width) || 15,
        height: parseFloat(el.style.height) || 10,
        color: el.style.color || el.style.borderColor || '#ef4444',
      };

      if (type === "text") {
        annObj.text = el.innerText;
        annObj.fontSize = parseInt(el.style.fontSize) || 18;
        annObj.fontWeight = el.style.fontWeight || 'bold';
      }
      annList.push(annObj);
    });

    slide.annotations = annList;
  }

  slide.isCustomized = true;

  // স্লাইডার সিনক্রোনাইজেশন
  const sizeSlider = document.querySelector(".wb-img-size-slider");
  if (sizeSlider && wrapper) {
    sizeSlider.value = parseFloat(wrapper.style.width);
  }
}

function setWbTool(btn, tool) {
  wbActiveTool = tool;
  document.querySelectorAll(".wb-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  
  const isPres = document.getElementById("fullscreenOverlay").style.display !== "none";
  updateWbPointerEvents(isPres);
}

function updateWbPointerEvents(isPresenter) {
  const suffix = isPresenter ? "_pres" : "_edit";
  const canvas = document.getElementById("wb_canvas" + suffix);
  if (!canvas) return;

  if (wbActiveTool === 'pen' || wbActiveTool === 'eraser') {
    canvas.style.pointerEvents = 'auto';
    canvas.style.cursor = wbActiveTool === 'eraser' ? 'crosshair' : 'pencil';
  } else {
    canvas.style.pointerEvents = 'none';
    canvas.style.cursor = 'default';
  }
}

function setWbColor(dot, color) {
  wbActiveColor = color;
  document.querySelectorAll(".wb-color-dot").forEach(d => d.classList.remove("active"));
  if (dot) dot.classList.add("active");

  const selectedEl = document.querySelector(".wb-element.selected") || wbLastActiveElement;
  if (selectedEl && !selectedEl.classList.contains("wb-image-container")) {
    selectedEl.style.color = color;
    selectedEl.style.borderColor = color;
    const slide = slides[activeSlideIndex];
    saveWhiteboardState(slide);
  }
}

function changeWbTextSize(amount) {
  const selectedEl = document.querySelector(".wb-element.selected") || wbLastActiveElement;
  if (selectedEl && selectedEl.classList.contains("wb-text-box")) {
    let currentSize = parseInt(selectedEl.style.fontSize) || 18;
    let newSize = Math.max(10, Math.min(60, currentSize + amount));
    selectedEl.style.fontSize = `${newSize}px`;
    const slide = slides[activeSlideIndex];
    saveWhiteboardState(slide);
  }
}

function toggleWbTextBold() {
  const selectedEl = document.querySelector(".wb-element.selected") || wbLastActiveElement;
  if (selectedEl && selectedEl.classList.contains("wb-text-box")) {
    let currentWeight = selectedEl.style.fontWeight;
    let isBold = currentWeight === 'bold' || currentWeight === '700';
    selectedEl.style.fontWeight = isBold ? 'normal' : 'bold';
    const slide = slides[activeSlideIndex];
    saveWhiteboardState(slide);
  }
}

function addWbText() {
  const slide = slides[activeSlideIndex];
  if (!slide) return;

  if (!slide.annotations) slide.annotations = [];
  slide.annotations.push({
    id: `ann_txt_${Date.now()}`,
    type: 'text',
    x: 40,
    y: 40,
    width: 20,
    height: 8,
    color: wbActiveColor,
    fontSize: 18,
    fontWeight: 'bold',
    text: 'নতুন টেক্সট'
  });
  
  renderActiveCanvas();
}

function addWbShape(type) {
  const slide = slides[activeSlideIndex];
  if (!slide) return;

  if (!slide.annotations) slide.annotations = [];
  slide.annotations.push({
    id: `ann_shp_${Date.now()}`,
    type: type,
    x: 45,
    y: 45,
    width: type === 'arrow' ? 8 : 15,
    height: type === 'arrow' ? 8 : 12,
    color: wbActiveColor
  });

  renderActiveCanvas();
}

function updateWbImageSize(val) {
  const isPres = document.getElementById("fullscreenOverlay").style.display !== "none";
  const suffix = isPres ? "_pres" : "_edit";
  const wrapper = document.getElementById("wb_image_container" + suffix);
  if (wrapper) {
    wrapper.style.width = `${val}%`;
    const slide = slides[activeSlideIndex];
    saveWhiteboardState(slide);
  }
}

function clearWbDrawing() {
  if (confirm("আপনি কি নিশ্চিতভাবে এই স্লাইডের সব ক্যানভাস অঙ্কন ও অবজেক্ট মুছে ফেলতে চান?")) {
    const slide = slides[activeSlideIndex];
    if (slide) {
      delete slide.canvasDrawing;
      slide.annotations = [];
      slide.imageX = 20;
      slide.imageY = 10;
      slide.imageWidth = 60;
      wbLastActiveElement = null;
      renderActiveCanvas();
    }
  }
}


// [৭] স্লাইড যোগ, ডুপ্লিকেট, ডিলিট ও রি-অর্ডার
function addNewSlide() {
  const newSlide = {
    id: "slide_new_" + Date.now(),
    title: "",
    type: "Content",
    layout: "single",
    bullets: [""],
    notes: "",
    icon: "fa-lightbulb",
    isCustomized: true
  };
  
  if (slides.length === 0) {
    slides.push(newSlide);
    activeSlideIndex = 0;
  } else {
    slides.splice(activeSlideIndex + 1, 0, newSlide);
    activeSlideIndex++;
  }
  renderStudio();
}

function duplicateCurrentSlide() {
  if (slides.length === 0) return;
  const current = slides[activeSlideIndex];
  const copy = JSON.parse(JSON.stringify(current));
  copy.id = "slide_dup_" + Date.now();
  copy.title = copy.title + (currentLang === "bn" ? " (কপি)" : " (Copy)");
  slides.splice(activeSlideIndex + 1, 0, copy);
  activeSlideIndex++;
  renderStudio();
}

function deleteCurrentSlide() {
  if (slides.length <= 1) {
    alert(currentLang === "bn" ? "কমপক্ষে একটি স্লাইড থাকা আবশ্যক!" : "At least one slide is required!");
    return;
  }
  if (confirm(currentLang === "bn" ? "আপনি কি নিশ্চিতভাবে এই স্লাইডটি মুছে ফেলতে চান?" : "Are you sure you want to delete this slide?")) {
    slides.splice(activeSlideIndex, 1);
    if (activeSlideIndex >= slides.length) activeSlideIndex = slides.length - 1;
    renderStudio();
  }
}

function moveSlide(direction) {
  const targetIdx = activeSlideIndex + direction;
  if (targetIdx < 0 || targetIdx >= slides.length) return;
  const temp = slides[activeSlideIndex];
  slides[activeSlideIndex] = slides[targetIdx];
  slides[targetIdx] = temp;
  activeSlideIndex = targetIdx;
  renderStudio();
}

// নেভিগেশন
function prevSlide() {
  if (activeSlideIndex > 0) {
    activeSlideIndex--;
    renderStudio();
    if (document.getElementById("fullscreenOverlay").style.display !== "none") renderPresenterSlide();
  }
}

function nextSlide() {
  if (activeSlideIndex < slides.length - 1) {
    activeSlideIndex++;
    renderStudio();
    if (document.getElementById("fullscreenOverlay").style.display !== "none") renderPresenterSlide();
  }
}

// [৮] প্রেজেন্টেশন মোড (Fullscreen Presenter Mode)
function startPresentationMode() {
  if (slides.length === 0) {
    alert("প্রেজেন্টেশন করার জন্য কোনো স্লাইড নেই!");
    return;
  }
  const overlay = document.getElementById("fullscreenOverlay");
  if (!overlay) return;

  overlay.style.display = "flex";
  activeSlideIndex = 0;
  timerSeconds = 0;

  renderPresenterSlide();
  startTimer();

  // ফুলস্ক্রিন রিকোয়েস্ট ব্রাউজারের অনুমতি সাপেক্ষে সেফলি হ্যান্ডেল করা
  const wantFullscreen = document.getElementById("chkFullscreenOpt")?.checked ?? true;
  if (wantFullscreen) {
    let elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => console.log("Fullscreen blocked:", err));
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }
}

function exitPresentationMode() {
  const overlay = document.getElementById("fullscreenOverlay");
  if (overlay) overlay.style.display = "none";
  if (presenterTimer) clearInterval(presenterTimer);
  stopAutoplay();
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
}

function renderPresenterSlide() {
  const frame = document.getElementById("presenterSlideFrame");
  const content = document.getElementById("presenterSlideContent");
  const counter = document.getElementById("presenterCounter");

  if (!frame || !content) return;

  const slide = slides[activeSlideIndex];
  const bgClass = slide.bg && slide.bg !== "default" ? slide.bg : "";
  frame.className = `presenter-slide-frame ${activeTheme} ${bgClass}`;

  if (counter) counter.innerText = `${currentLang === "bn" ? "স্লাইড" : "Slide"} ${activeSlideIndex + 1} / ${slides.length}`;

  // Get animations from slide object
  const titleAnimClass = slide.titleAnimation && slide.titleAnimation !== "none" ? `anim-${slide.titleAnimation}` : "";
  const contentAnimClass = slide.contentAnimation && slide.contentAnimation !== "none" ? `anim-${slide.contentAnimation}` : "";
  const imgAnimClass = slide.imageAnimation && slide.imageAnimation !== "none" ? `anim-${slide.imageAnimation}` : "";

  const bulletsHtml = slide.bullets
    .map((b) => `<div class="slide-bullet-item ${contentAnimClass}" style="font-size: 20px; padding: 10px 16px;"><i class="fa-solid fa-chevron-right" style="font-size: 14px; opacity:0.8;"></i> <span>${b}</span></div>`)
    .join("");

  let visualComponentHtml = "";
  const selectedVisuals = Array.from(document.querySelectorAll(".vis-check:checked")).map((cb) => cb.value);

  // Custom Image rendering with Whiteboard Editor in Fullscreen slideshow mode
  if (slide.image && slide.showImage !== false) {
    visualComponentHtml = `
      <div class="whiteboard-wrapper ${imgAnimClass}" id="wb_wrapper_${slide.id}">
        <!-- Whiteboard Toolbar (Fullscreen layout) -->
        <div class="whiteboard-toolbar">
          <div class="wb-tools-group">
            <button class="wb-btn active" onclick="setWbTool(this, 'select')" title="মুভ অবজেক্ট"><i class="fa-solid fa-arrows-up-down-left-right"></i> মুভ</button>
            <button class="wb-btn" onclick="setWbTool(this, 'pen')" title="পেন"><i class="fa-solid fa-pen"></i> পেন</button>
            <button class="wb-btn" onclick="setWbTool(this, 'eraser')" title="ইরেজার"><i class="fa-solid fa-eraser"></i> ইরেজার</button>
            <button class="wb-btn" onclick="addWbText()" title="টেক্সট"><i class="fa-solid fa-font"></i> টেক্সট</button>
            <button class="wb-btn" onclick="addWbShape('rect')" title="আয়তক্ষেত্র"><i class="fa-regular fa-square"></i> আয়ত</button>
            <button class="wb-btn" onclick="addWbShape('circle')" title="বৃত্ত"><i class="fa-regular fa-circle"></i> বৃত্ত</button>
            <button class="wb-btn" onclick="addWbShape('arrow')" title="তীর"><i class="fa-solid fa-arrow-right"></i> তীর</button>
          </div>
          <!-- Text formatting tools -->
          <div class="wb-tools-group" style="border-left: 1px solid rgba(0,0,0,0.1); padding-left: 6px;">
            <button class="wb-btn" onclick="changeWbTextSize(2)" title="লেখা বড় করুন"><i class="fa-solid fa-magnifying-glass-plus"></i> বড়</button>
            <button class="wb-btn" onclick="changeWbTextSize(-2)" title="লেখা ছোট করুন"><i class="fa-solid fa-magnifying-glass-minus"></i> ছোট</button>
            <button class="wb-btn" onclick="toggleWbTextBold()" title="বোল্ড / রেগুলার"><i class="fa-solid fa-bold"></i> বোল্ড</button>
          </div>
          <div class="wb-tools-group" style="gap: 8px;">
            <div style="display: flex; align-items: center; gap: 4px; font-size: 11.5px;">
              <span>সাইজ:</span>
              <input type="range" class="wb-img-size-slider" min="20" max="150" value="${slide.imageWidth || 60}" style="width: 40px; height:4px; cursor:pointer;" oninput="updateWbImageSize(this.value)">
            </div>
            <div class="wb-color-picker">
              <span class="wb-color-dot active" style="background:#ef4444;" onclick="setWbColor(this, '#ef4444')"></span>
              <span class="wb-color-dot" style="background:#3b82f6;" onclick="setWbColor(this, '#3b82f6')"></span>
              <span class="wb-color-dot" style="background:#10b981;" onclick="setWbColor(this, '#10b981')"></span>
              <span class="wb-color-dot" style="background:#f59e0b;" onclick="setWbColor(this, '#f59e0b')"></span>
              <span class="wb-color-dot" style="background:#0f172a;" onclick="setWbColor(this, '#0f172a')"></span>
              <span class="wb-color-dot" style="background:#ffffff;" onclick="setWbColor(this, '#ffffff')"></span>
            </div>
            <button class="wb-btn" onclick="clearWbDrawing()" style="color: var(--danger); font-weight:bold; padding: 2px 6px;"><i class="fa-solid fa-trash-can"></i> রিসেট</button>
          </div>
        </div>

        <!-- Canvas and Element Area -->
        <div class="whiteboard-canvas-area" id="wb_canvas_area_pres">
          <!-- Image Element (Draggable/Resizable) -->
          <div class="wb-element wb-image-container" id="wb_image_container_pres" style="left: ${slide.imageX || 20}%; top: ${slide.imageY || 10}%; width: ${slide.imageWidth || 60}%;">
            <img src="${slide.image}" class="wb-image-el" style="width: 100%; display: block;" alt="Slide Image">
            <div class="wb-resize-handle"></div>
          </div>

          <!-- Drawing Canvas Overlay -->
          <canvas class="wb-canvas" id="wb_canvas_pres"></canvas>

          <!-- Annotations container for shapes and text boxes -->
          <div class="wb-annotations-layer" id="wb_annotations_layer_pres" style="position: absolute; top:0; left:0; width:100%; height:100%; pointer-events: none; z-index:9;">
            <!-- Saved annotations loaded here -->
          </div>
        </div>
      </div>
    `;
  } else {
    let visualInner = "";
    if (slide.type === "Quiz" || slide.layout === "quiz") {
      visualInner = `
        <div class="quiz-options-grid" style="margin-top: 20px;">
          <div class="quiz-opt-card" style="font-size: 18px; padding: 15px 20px;" onclick="toggleQuizAnswer(this)"><span>ক)</span> প্রথম বিকল্প</div>
          <div class="quiz-opt-card" style="font-size: 18px; padding: 15px 20px;" onclick="toggleQuizAnswer(this)"><span>খ)</span> দ্বিতীয় উত্তর (সঠিক)</div>
          <div class="quiz-opt-card" style="font-size: 18px; padding: 15px 20px;" onclick="toggleQuizAnswer(this)"><span>গ)</span> তৃতীয় বিকল্প</div>
          <div class="quiz-opt-card" style="font-size: 18px; padding: 15px 20px;" onclick="toggleQuizAnswer(this)"><span>ঘ)</span> চতুর্থ বিকল্প</div>
        </div>
      `;
    } else if (slide.type === "Table" && selectedVisuals.includes("table")) {
      const vGoodRolls = document.getElementById("roll-vgood")?.value || "১, ২, ৩";
      const avgRolls = document.getElementById("roll-avg")?.value || "৪, ৫, ৬";
      const lowRolls = document.getElementById("roll-low")?.value || "৭, ৮, ৯";
      visualInner = `
        <strong style="font-size:15px; display:block; margin-bottom:10px;"><i class="fa-solid fa-users-gear"></i> スマート শিক্ষার্থী গ্রুপিং:</strong>
        <table class="slide-data-table" style="font-size: 15px;">
          <thead>
            <tr><th>গ্রুপ</th><th>রোল নম্বর</th><th>কার্যক্রম</th></tr>
          </thead>
          <tbody>
            <tr style="border-left: 4px solid #10b981;"><td><strong>গ্রুপ এ (উন্নত)</strong></td><td>${vGoodRolls}</td><td>বিশ্লেষণমূলক সমাধান ও বাস্তব প্রয়োগ</td></tr>
            <tr style="border-left: 4px solid #f59e0b;"><td><strong>গ্রুপ বি (মাঝারি)</strong></td><td>${avgRolls}</td><td>পাঠ্যবইয়ের অনুশীলন ও গ্রুপ ওয়ার্ক</td></tr>
            <tr style="border-left: 4px solid #ef4444;"><td><strong>গ্রুপ সি (বিশেষ যত্ন)</strong></td><td>${lowRolls}</td><td>শিক্ষকের সহায়তায় বেসিক পুনরাবৃত্তি</td></tr>
          </tbody>
        </table>
      `;
    } else if (selectedVisuals.includes("chart")) {
      visualInner = `
        <strong style="font-size:14px; display:block; margin-bottom:10px;"><i class="fa-solid fa-chart-simple"></i> তথ্য চিত্র ও প্রজেক্ট অগ্রগতি:</strong>
        <div class="chart-bars-wrap" style="height: 140px;">
          <div class="chart-bar-col"><div class="chart-bar-fill" style="height: 35%;"></div><span class="chart-bar-label" style="font-size:12px;">পরিকল্পনা (৩৫%)</span></div>
          <div class="chart-bar-col"><div class="chart-bar-fill" style="height: 70%;"></div><span class="chart-bar-label" style="font-size:12px;">পরীক্ষণ (৭০%)</span></div>
          <div class="chart-bar-col"><div class="chart-bar-fill" style="height: 90%;"></div><span class="chart-bar-label" style="font-size:12px;">বিশ্লেষণ (৯০%)</span></div>
          <div class="chart-bar-col"><div class="chart-bar-fill" style="height: 50%;"></div><span class="chart-bar-label" style="font-size:12px;">উপস্থাপন (৫০%)</span></div>
        </div>
      `;
    } else if (selectedVisuals.includes("table")) {
      visualInner = `
        <strong style="font-size:14px; display:block; margin-bottom:8px;"><i class="fa-solid fa-table"></i> বিষয় সারণি:</strong>
        <table class="slide-data-table" style="font-size: 15px;">
          <thead>
            <tr><th>পর্ব</th><th>বিষয়বস্তু</th><th>সময়</th></tr>
          </thead>
          <tbody>
            <tr><td>১ম পর্ব</td><td>ধারণা স্পষ্টকরণ</td><td>১৫ মিনিট</td></tr>
            <tr><td>২য় পর্ব</td><td>দলগত কাজ ও উপস্থাপনা</td><td>২০ মিনিট</td></tr>
          </tbody>
        </table>
      `;
    } else if (selectedVisuals.includes("info")) {
      visualInner = `
        <strong style="font-size:14px; display:block; margin-bottom:12px;"><i class="fa-solid fa-lightbulb"></i> শিখন ধাপসমূহ:</strong>
        <div class="infographic-steps-wrap">
          <div class="info-step-card" style="padding: 15px;"><div class="step-num" style="width:28px; height:28px; font-size:14px;">১</div><div class="step-txt" style="font-size:13px; margin-top:5px;">ধারণা গ্রহণ</div></div>
          <div class="info-step-card" style="padding: 15px;"><div class="step-num" style="width:28px; height:28px; font-size:14px;">২</div><div class="step-txt" style="font-size:13px; margin-top:5px;">শ্রেণি অনুশীলন</div></div>
          <div class="info-step-card" style="padding: 15px;"><div class="step-num" style="width:28px; height:28px; font-size:14px;">৩</div><div class="step-txt" style="font-size:13px; margin-top:5px;">মূল্যায়ন ও কুইজ</div></div>
        </div>
      `;
    } else if (selectedVisuals.includes("vid")) {
      visualInner = `
        <div class="mock-video-player" style="height: 150px;">
          <i class="fa-solid fa-play play-icon" style="font-size: 42px;"></i>
          <span class="video-duration" style="font-size:12px;">03:45</span>
        </div>
        <span class="video-title" style="font-size: 13px; margin-top: 8px;"><i class="fa-solid fa-video"></i> ${slide.title} সম্পর্কিত মাল্টিমিডিয়া কন্টেন্ট</span>
      `;
    } else if (selectedVisuals.includes("img") || selectedVisuals.includes("geo")) {
      visualInner = `
        <div class="diagram-graphic-box" style="padding: 20px; gap: 20px;">
          <div class="diagram-node" style="font-size: 16px; padding: 12px 24px;">সংজ্ঞা ও সূচনা</div>
          <i class="fa-solid fa-arrow-right" style="font-size:18px;"></i>
          <div class="diagram-node" style="background:#10b981; font-size: 16px; padding: 12px 24px;">বিশ্লেষণ ও প্রয়োগ</div>
          <i class="fa-solid fa-arrow-right" style="font-size:18px;"></i>
          <div class="diagram-node" style="background:#f59e0b; font-size: 16px; padding: 12px 24px;">সিদ্ধান্ত গ্রহণ</div>
        </div>
      `;
    }

    if (visualInner) {
      visualComponentHtml = `
        <div class="visual-component-box ${imgAnimClass}">
          ${visualInner}
        </div>
      `;
    }
  }

  let bodyContentHtml = "";
  if (slide.layout === "split") {
    bodyContentHtml = `
      <div class="slide-body-grid layout-split">
        <div class="slide-bullets-wrapper">
          ${bulletsHtml}
        </div>
        <div class="slide-visual-wrapper">
          ${visualComponentHtml}
        </div>
      </div>
    `;
  } else if (slide.layout === "card") {
    bodyContentHtml = `
      <div class="slide-body-grid layout-card">
        <div class="card-layout-wrapper" style="gap: 15px;">
          ${slide.bullets.map((b) => `
            <div class="slide-bullet-card ${contentAnimClass}" style="padding: 16px 20px; border-radius: 12px;">
              <i class="fa-solid ${slide.icon || 'fa-star'}" style="color:var(--primary); font-size:18px; margin-top: 4px;"></i>
              <div class="bullet-card-text" style="font-size:16px;">${b}</div>
            </div>
          `).join("")}
        </div>
        ${visualComponentHtml ? `<div class="slide-visual-wrapper">${visualComponentHtml}</div>` : ""}
      </div>
    `;
  } else if (slide.layout === "quiz") {
    bodyContentHtml = `
      <div class="slide-body-grid layout-quiz">
        <div class="quiz-question-area">
          <div class="slide-bullets-wrapper">
            ${bulletsHtml}
          </div>
        </div>
        <div class="quiz-options-area">
          ${visualComponentHtml}
        </div>
      </div>
    `;
  } else {
    bodyContentHtml = `
      <div class="slide-body-grid layout-single">
        <div class="slide-bullets-wrapper">
          ${bulletsHtml}
        </div>
        ${visualComponentHtml ? `<div class="slide-visual-wrapper">${visualComponentHtml}</div>` : ""}
      </div>
    `;
  }

  content.className = `slide-inner-content`;
  content.innerHTML = `
    <div class="slide-header-box" style="margin-bottom: 20px;">
      <span class="slide-tag" style="font-size: 14px; padding: 6px 18px;">${getSlideTypeName(slide.type)}</span>
      <i class="fa-solid ${slide.icon || "fa-graduation-cap"}" style="font-size: 42px;"></i>
    </div>
    <h1 class="${titleAnimClass}" style="font-size: 36px; font-weight: 700; margin: 15px 0 25px 0;">${slide.title}</h1>
    ${bodyContentHtml}
  `;

  // Init whiteboard interactive in presentation mode too! (use suffix _pres)
  if (slide.image && slide.showImage !== false) {
    initWhiteboard(slide, true); // true indicates presenter mode
  }
}


function startTimer() {
  if (presenterTimer) clearInterval(presenterTimer);
  presenterTimer = setInterval(() => {
    timerSeconds++;
    const mins = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
    const secs = String(timerSeconds % 60).padStart(2, "0");
    const timerEl = document.getElementById("presTimer");
    if (timerEl) timerEl.innerText = `${mins}:${secs}`;
  }, 1000);
}

// [৯] মোডাল ও ইম্পোর্ট ফিচারসমূহ (আপডেটেড)
function openImportModal() {
  const modal = document.getElementById("importModal");
  const list = document.getElementById("importLessonsList");
  if (!modal || !list) return;

  // লেসন প্ল্যান ড্যাশবোর্ডের বিভিন্ন সম্ভাব্য লোকাল স্টোরেজ কি চেক করা
  let savedLessonsStr = localStorage.getItem("sashiba_lessons") || localStorage.getItem("lesson_plans") || localStorage.getItem("sashiba_lesson_plans");
  let savedLessons = [];
  try {
    savedLessons = savedLessonsStr ? JSON.parse(savedLessonsStr) : [];
  } catch (e) {
    savedLessons = [];
  }

  if (savedLessons.length === 0) {
    list.innerHTML = "<p style='padding:20px; text-align:center; color:#666;'>লাইব্রেরিতে কোনো সংরক্ষিত লেসন প্ল্যান পাওয়া যায়নি। অনুগ্রহ করে আগে লেসন প্ল্যান ড্যাশবোর্ড থেকে লেসন সেভ করুন।</p>";
  } else {
    list.innerHTML = savedLessons
      .map(
        (l, i) => `
        <div class="import-lesson-card">
          <div class="import-info">
            <h4>${l.subject || l.subjectName || "বিষয়"} (${l.class || l.className || "শ্রেণি"})</h4>
            <p>অধ্যায়: ${l.chapter || l.chapterName || "অধ্যায়"} | তারিখ: ${l.date || l.savedAt || "সাম্প্রতিক"}</p>
          </div>
          <button class="btn btn-primary" style="padding:6px 12px; font-size:12px;" onclick="importSelectedLesson(${i})">
            <i class="fa-solid fa-download"></i> লোড করুন
          </button>
        </div>
      `
      )
      .join("");
  }

  modal.style.display = "flex";
}

function closeImportModal() {
  const modal = document.getElementById("importModal");
  if (modal) modal.style.display = "none";
}

function importSelectedLesson(index) {
  let savedLessonsStr = localStorage.getItem("sashiba_lessons") || localStorage.getItem("lesson_plans") || localStorage.getItem("sashiba_lesson_plans");
  if (!savedLessonsStr) return;
  try {
    const savedLessons = JSON.parse(savedLessonsStr);
    const plan = savedLessons[index];
    if (plan) {
      // লোকাল স্টোরেজে active transfer lesson হিসেবে সেভ করা যাতে অটো রিলোডেও ধরে
      localStorage.setItem("sashiba_active_transfer_lesson", JSON.stringify(plan));
      applyImportedLessonPlan(plan);
      closeImportModal();
      alert("লেসন প্ল্যান থেকে তথ্য সফলভাবে ইম্পোর্ট করা হয়েছে!");
    }
  } catch (e) {
    console.error(e);
  }
}

// [১০] সেভ ও এক্সপোর্ট ফিচার
function savePresentationDraft() {
  const presObj = {
    id: "pres_" + Date.now(),
    title: document.getElementById("subject")?.value + " - " + document.getElementById("class")?.value,
    className: document.getElementById("class")?.value,
    subject: document.getElementById("subject")?.value,
    slides: slides,
    savedAt: new Date().toLocaleDateString("bn-BD")
  };

  let savedDeck = [];
  try {
    savedDeck = JSON.parse(localStorage.getItem("sashiba_saved_presentations") || "[]");
  } catch (e) {}
  savedDeck.unshift(presObj);
  localStorage.setItem("sashiba_saved_presentations", JSON.stringify(savedDeck));

  alert("প্রেজেন্টেশন ড্রাফট সফলভাবে সেভ করা হয়েছে!");
  toggleExportMenu();
}

function exportToHTMLPresentation() {
  const htmlContent = `
<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<title>${document.getElementById("subject")?.value} প্রেজেন্টেশন</title>
<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
  body { font-family: 'Hind Siliguri', sans-serif; background: #0f172a; color: white; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }
  .slide { width:85%; max-width:950px; aspect-ratio:16/9; background:#1e293b; border-radius:16px; padding:40px; box-shadow:0 10px 40px rgba(0,0,0,0.5); display:flex; flex-direction:column; justify-content:space-between; }
  .tag { background:#3b82f6; padding:4px 12px; border-radius:12px; font-size:14px; font-weight:700; display:inline-block; }
  h1 { font-size:32px; color:#38bdf8; }
  .point { background:rgba(255,255,255,0.1); margin:10px 0; padding:12px 18px; border-radius:8px; font-size:18px; }
</style>
</head>
<body>
  <div class="slide">
    <div>
      <span class="tag">স্মার্ট ক্লাসরুম স্লাইড</span>
      <h1>${document.getElementById("subject")?.value} - ${document.getElementById("class")?.value} শ্রেণি</h1>
      ${slides.map((s) => `<h2>${s.title}</h2>${s.bullets.map((b) => `<div class="point">${b}</div>`).join("")}`).join("")}
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Presentation_${document.getElementById("subject")?.value || "Slide"}.html`;
  a.click();
  toggleExportMenu();
}

function printPresentationSlides() {
  window.print();
  toggleExportMenu();
}

// [১১] সেকশন নেভিগেশন ও লাইব্রেরি
function showSection(section) {
  const builder = document.getElementById("mainBuilder");
  const library = document.getElementById("librarySection");
  const sbEditor = document.getElementById("sb-dashboard");
  const sbLibrary = document.getElementById("sb-library");

  if (section === "builder") {
    builder.style.display = "flex";
    library.style.display = "none";
    sbEditor.classList.add("active");
    sbLibrary.classList.remove("active");
  } else {
    builder.style.display = "none";
    library.style.display = "flex";
    sbEditor.classList.remove("active");
    sbLibrary.classList.add("active");
    loadLibraryItems();
  }
}

function loadLibraryItems() {
  const grid = document.getElementById("presentationLibraryGrid");
  if (!grid) return;

  let savedDecks = [];
  try {
    savedDecks = JSON.parse(localStorage.getItem("sashiba_saved_presentations") || "[]");
  } catch (e) {}

  if (savedDecks.length === 0) {
    grid.innerHTML = "<p style='color:#666;'>লাইব্রেরিতে কোনো সেভ করা প্রেজেন্টেশন স্লাইড সেট পাওয়া যায়নি।</p>";
    return;
  }

  grid.innerHTML = savedDecks
    .map(
      (deck, i) => `
      <div class="saved-pres-card">
        <div>
          <h3>${deck.title || "প্রেজেন্টেশন"}</h3>
          <p>স্লাইড সংখ্যা: ${deck.slides.length} টি | তারিখ: ${deck.savedAt}</p>
        </div>
        <div class="saved-card-actions">
          <button class="btn btn-primary" onclick="loadSavedDeck(${i})">লোড করুন</button>
        </div>
      </div>
    `
    )
    .join("");
}

function loadSavedDeck(index) {
  let savedDecks = JSON.parse(localStorage.getItem("sashiba_saved_presentations") || "[]");
  if (savedDecks[index]) {
    slides = savedDecks[index].slides;
    activeSlideIndex = 0;
    showSection("builder");
    renderStudio();
  }
}

function resetPresentationBuilder() {
  // Clear imported state
  importedPlan = null;
  localStorage.removeItem("sashiba_transfer_lesson");
  isManualMode = true;

  // Remove the "autoImport=true" param from URL without reloading the page
  const url = new URL(window.location);
  url.searchParams.delete("autoImport");
  window.history.replaceState({}, document.title, url.toString());

  // Reset basic text fields to blank (empty string)
  if (document.getElementById("schName")) document.getElementById("schName").value = "";
  if (document.getElementById("duration")) document.getElementById("duration").value = "";
  if (document.getElementById("lessonObjective")) {
    document.getElementById("lessonObjective").value = "";
  }

  // Reset student roll numbers to blank (empty string)
  if (document.getElementById("roll-vgood")) document.getElementById("roll-vgood").value = "";
  if (document.getElementById("roll-avg")) document.getElementById("roll-avg").value = "";
  if (document.getElementById("roll-low")) document.getElementById("roll-low").value = "";

  // Reset Source Badge
  const sourceBadge = document.getElementById("sourceBadge");
  if (sourceBadge) {
    sourceBadge.innerHTML = `<i class="fa-solid fa-file-circle-plus"></i> কাস্টম স্লাইড মোড (ম্যানুয়াল)`;
    sourceBadge.style.background = "#e0e7ff";
    sourceBadge.style.color = "#4f46e5";
  }

  // Reset class & subject selects to empty / default placeholders
  const clsSel = document.getElementById("class");
  if (clsSel) clsSel.value = "";
  
  const subSel = document.getElementById("subject");
  if (subSel) {
    subSel.innerHTML = `<option value="">${currentLang === "bn" ? "-- বিষয় নির্বাচন করুন --" : "-- Select Subject --"}</option>`;
  }

  // Clear chapters and topics
  const chBox = document.getElementById("chapter-list");
  if (chBox) {
    chBox.innerHTML = `<p class="text-muted" style="font-size:12px; padding:8px;">${currentLang === "bn" ? "প্রথমে বিষয় নির্বাচন করুন" : "Please select subject first"}</p>`;
  }
  const topicBox = document.getElementById("topic-list");
  if (topicBox) {
    topicBox.innerHTML = `<p class="text-muted" style="font-size:12px; padding:8px;">${currentLang === "bn" ? "প্রথমে অধ্যায় নির্বাচন করুন" : "Please select chapter first"}</p>`;
  }

  // Uncheck all dynamic checklists in UI
  document.querySelectorAll(".vis-check").forEach(cb => cb.checked = false);
  document.querySelectorAll(".seq-check").forEach(cb => cb.checked = false);
  document.querySelectorAll(".bloom-check").forEach(cb => cb.checked = false);
  document.querySelectorAll(".meth-check").forEach(cb => cb.checked = false);

  // Uncheck all ready templates radio buttons
  document.querySelectorAll('input[name="tmpl"]').forEach(rb => rb.checked = false);

  // Reset slides array to completely blank and add one blank slide
  slides = [];
  addNewSlide();
  activeSlideIndex = 0;

  // Render the empty state studio layout
  showSection("builder");
}

function getSlideTypeName(type) {
  const types = {
    Cover: currentLang === "bn" ? "কভার স্লাইড" : "Cover Slide",
    Outcomes: currentLang === "bn" ? "শিখনফল" : "Learning Outcomes",
    Content: currentLang === "bn" ? "পাঠ আলোচনা" : "Lesson Content",
    Table: currentLang === "bn" ? "সময়তালিকা" : "Time Table",
    Quiz: currentLang === "bn" ? "কুইজ ও মূল্যায়ন" : "Quiz & Q/A",
    Homework: currentLang === "bn" ? "বাড়ির কাজ" : "Homework",
    "Q&A": currentLang === "bn" ? "প্রশ্নোত্তর" : "Q & A"
  };
  return types[type] || (currentLang === "bn" ? "সাধারণ স্লাইড" : "General Slide");
}

function toggleExportMenu() {
  const menu = document.getElementById("exportMenu");
  if (menu) menu.classList.toggle("show");
}

// i18n Dictionary and Translation Switcher
const i18nDict = {
  bn: {
    hdrTitle: "প্রেজেন্টেশন আর্কিটেক্ট",
    btnImport: "লেসন প্ল্যান ইম্পোর্ট",
    btnPresent: "স্লাইডশো (প্রেজেন্ট)",
    btnLang: "English",
    btnExport: "সেভ ও এক্সপোর্ট",
    btnGenerate: "অটো স্লাইড জেনারেট করুন",
    btnNew: "নতুন স্লাইড",
    btnDup: "ডুপ্লিকেট",
    btnDel: "মুছে ফেলুন",
    btnUp: "উপরে",
    btnDown: "নিচে",
    navPrev: "পূর্ববর্তী",
    navNext: "পরবর্তী",
    thumbHdr: "স্লাইড তালিকা",
    editorTitle: "স্লাইড পরিবর্তন ও সম্পাদনা",
    editTitleLbl: "স্লাইড টাইটেল (শিরোনাম):",
    editTypeLbl: "স্লাইডের ধরন / সাবটাইটেল:",
    editLayoutLbl: "লেআউট / গ্রিড স্টাইল:",
    editBulletsLbl: "স্লাইড কন্টেন্ট / পয়েন্টসমূহ (প্রতি লাইনে একটি):",
    editNotesLbl: "শিক্ষক নির্দেশনাবলী / লেকচার নোট:",
    editIconLbl: "স্লাইড আইকন:",
    editBgLbl: "স্লাইড ব্যাকগ্রাউন্ড:"
  },
  en: {
    hdrTitle: "Presentation Architect",
    btnImport: "Import Lesson Plan",
    btnPresent: "Slideshow (Present)",
    btnLang: "বাংলা",
    btnExport: "Save & Export",
    btnGenerate: "Auto Generate Slides",
    btnNew: "New Slide",
    btnDup: "Duplicate",
    btnDel: "Delete",
    btnUp: "Move Up",
    btnDown: "Move Down",
    navPrev: "Previous",
    navNext: "Next",
    thumbHdr: "Slide List",
    editorTitle: "Edit & Customize Slide",
    editTitleLbl: "Slide Title:",
    editTypeLbl: "Slide Category:",
    editLayoutLbl: "Layout Style:",
    editBulletsLbl: "Slide Content Points:",
    editNotesLbl: "Teacher Notes / Tips:",
    editIconLbl: "Slide Icon:",
    editBgLbl: "Slide Background:"
  }
};

function toggleLanguage() {
  currentLang = currentLang === "bn" ? "en" : "bn";
  const dict = i18nDict[currentLang];

  const elHdr = document.getElementById("hdr-title"); if (elHdr) elHdr.innerText = dict.hdrTitle;
  const elLang = document.getElementById("langToggleBtn"); if (elLang) elLang.innerHTML = `<i class="fa-solid fa-globe"></i> <span>${dict.btnLang}</span>`;
  const elBtnNew = document.getElementById("lbl-btn-new"); if (elBtnNew) elBtnNew.innerText = dict.btnNew;
  const elBtnDup = document.getElementById("lbl-btn-dup"); if (elBtnDup) elBtnDup.innerText = dict.btnDup;
  const elBtnDel = document.getElementById("lbl-btn-del"); if (elBtnDel) elBtnDel.innerText = dict.btnDel;
  const elBtnUp = document.getElementById("lbl-btn-up"); if (elBtnUp) elBtnUp.innerText = dict.btnUp;
  const elBtnDown = document.getElementById("lbl-btn-down"); if (elBtnDown) elBtnDown.innerText = dict.btnDown;
  const elNavPrev = document.getElementById("lbl-nav-prev"); if (elNavPrev) elNavPrev.innerText = dict.navPrev;
  const elNavNext = document.getElementById("lbl-nav-next"); if (elNavNext) elNavNext.innerText = dict.navNext;
  const elThumbHdr = document.getElementById("lbl-thumb-hdr"); if (elThumbHdr) elThumbHdr.innerText = dict.thumbHdr;
  const elEdTitle = document.getElementById("lbl-editor-title"); if (elEdTitle) elEdTitle.innerText = dict.editorTitle;
  const elEdTLbl = document.getElementById("lbl-edit-title"); if (elEdTLbl) elEdTLbl.innerText = dict.editTitleLbl;
  const elEdTyLbl = document.getElementById("lbl-edit-type"); if (elEdTyLbl) elEdTyLbl.innerText = dict.editTypeLbl;
  const elEdLayLbl = document.getElementById("lbl-edit-layout"); if (elEdLayLbl) elEdLayLbl.innerText = dict.editLayoutLbl;
  const elEdBulLbl = document.getElementById("lbl-edit-bullets"); if (elEdBulLbl) elEdBulLbl.innerText = dict.editBulletsLbl;
  const elEdNoteLbl = document.getElementById("lbl-edit-notes"); if (elEdNoteLbl) elEdNoteLbl.innerText = dict.editNotesLbl;
  const elEdIcoLbl = document.getElementById("lbl-edit-icon"); if (elEdIcoLbl) elEdIcoLbl.innerText = dict.editIconLbl;
  const elEdBgLbl = document.getElementById("lbl-edit-bg"); if (elEdBgLbl) elEdBgLbl.innerText = dict.editBgLbl;

  populateClasses();
  renderStudio();
}

function toggleSidebar() {
  const workspace = document.querySelector(".workspace");
  if (workspace) {
    workspace.classList.toggle("sidebar-collapsed");
  }
}

async function downloadAsPowerPointPPTX() {
  if (typeof PptxGenJS === 'undefined') {
    return alert("라이브러리 পাওয়া যায়নি! ইন্টারনেটে সংযুক্ত হয়ে পেজটি রিফ্রেশ দিন।");
  }

  try {
    const pptx = new PptxGenJS();
    // স্লাইড সাইজ এবং প্রপার্টিজ
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Sashiba Smart Education';
    
    // ১. ড্যাশবোর্ড কালার প্যালেট (আপনার CSS থেকে হুবহু নেওয়া)
    const UI_COLORS = {
      primary: '4F46E5',   // Indigo
      success: '10B981',   // Emerald
      warning: 'F59E0B',   // Amber
      danger: 'EF4444',    // Red
      dark: '1E293B',      // Slate 800
      light: 'F8FAFC',     // Slate 50
      white: 'FFFFFF'
    };

    // ২. আইকন ম্যাপার (FontAwesome থেকে PowerPoint উপযোগী ইমোজি)
    const iconMap = {
      "fa-graduation-cap": "🎓", "fa-book-open": "📖", "fa-lightbulb": "💡",
      "fa-bullseye": "🎯", "fa-list-check": "📋", "fa-users": "👥",
      "fa-circle-question": "❓", "fa-house-laptop": "🏠", "fa-atom": "⚛️", "fa-calculator": "🧮"
    };

    // ৩. টেক্সট ফিক্সার (ক্লিয়ার বাংলা ফন্ট নিশ্চিত করা)
    const clean = (t) => t ? t.toString().replace(/[^\x00-\x7F\u0980-\u09FF\s]/g, "").trim() : "";

    slides.forEach((slideObj, index) => {
      let slide = pptx.addSlide();
      
      // স্লাইড থিম নির্ধারণ (ড্যাশবোর্ড অনুযায়ী)
      let isDark = slideObj.bg === "bg-dark" || slideObj.bg === "bg-emerald" || slideObj.bg === "bg-amber" || slideObj.bg === "bg-purple" || slideObj.bg === "bg-cosmic" || slideObj.bg === "bg-sunset" || slideObj.bg === "bg-ocean" || slideObj.bg === "bg-neon" || slideObj.bg === "bg-matte" || slideObj.type === "Cover";
      let bgFill = isDark ? UI_COLORS.dark : UI_COLORS.white;
      
      if (slideObj.bg === "bg-blue") bgFill = '1E3A8A';
      else if (slideObj.bg === "bg-emerald") bgFill = '064E3B';
      else if (slideObj.bg === "bg-amber") bgFill = '78350F';
      else if (slideObj.bg === "bg-purple") bgFill = '581C87';
      else if (slideObj.bg === "bg-cosmic") bgFill = '1E1B4B';
      else if (slideObj.bg === "bg-sunset") bgFill = 'EC4899';
      else if (slideObj.bg === "bg-ocean") bgFill = '0F766E';
      else if (slideObj.bg === "bg-neon") bgFill = '09090B';
      else if (slideObj.bg === "bg-nordic") bgFill = 'E2E8F0';
      else if (slideObj.bg === "bg-matte") bgFill = '1C1917';
      else if (slideObj.bg === "bg-white") bgFill = 'FFFFFF';
      
      if (slideObj.type === "Cover") bgFill = '312E81'; // কভার স্লাইড সবসময় প্রফেশনাল ডার্ক ব্লু
      
      slide.background = { fill: bgFill };
      let textCol = isDark ? UI_COLORS.white : UI_COLORS.dark;

      // ==========================================
      // [ক] কভার স্লাইড ডিজাইন (ড্যাশবোর্ডের স্প্ল্যাশ স্টাইল)
      // ==========================================
      if (slideObj.type === "Cover") {
        // ডেকোরেティブ শেপ
        slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.15, fill: UI_COLORS.primary });
        
        slide.addText(iconMap[slideObj.icon] || "🎓", { 
            x: 0, y: 1.5, w: '100%', fontSize: 60, align: 'center' 
        });

        slide.addText(clean(slideObj.title), {
          x: 0.5, y: 2.8, w: 9.0, fontSize: 44, bold: true, color: UI_COLORS.white, align: 'center', fontFace: 'Arial'
        });

        slide.addShape(pptx.ShapeType.line, { x: '30%', y: '48%', w: '40%', h: 0, line: { color: UI_COLORS.warning, width: 3 } });

        let info = Array.isArray(slideObj.bullets) ? slideObj.bullets.join("  |  ") : "";
        slide.addText(clean(info), {
          x: 0.5, y: 5.5, w: 9.0, fontSize: 18, color: 'CBD5E1', align: 'center', fontFace: 'Arial'
        });
      } 
      
      // ==========================================
      // [খ] কন্টেন্ট স্লাইড ডিজাইন (ড্যাশবোর্ড স্টুডিও স্টাইল)
      // ==========================================
      else {
        // ১. টপ বার (স্মার্ট হেডার)
        slide.addShape(pptx.ShapeType.rect, { 
            x: 0, y: 0, w: '100%', h: 0.8, fill: UI_COLORS.primary 
        });
        
        // ২. স্লাইড আইকন ও টাইটেল
        let slideIcon = iconMap[slideObj.icon] || "📄";
        slide.addText(`${slideIcon}  ${clean(slideObj.title)}`, {
          x: 0.4, y: 0.15, w: 9.2, fontSize: 24, bold: true, color: UI_COLORS.white, fontFace: 'Arial'
        });

        let bullets = slideObj.bullets || [];
        let hasImg = (slideObj.image && slideObj.showImage !== false);

        // ৩. ডাইনামিক লেআউট ইঞ্জিন (ড্যাশবোর্ড ম্যাচার)
        
        // কেস ১: কার্ড লেআউট (তিনটি আলাদা বক্সে তথ্য)
        if (slideObj.layout === "card" && bullets.length > 0) {
            let cardX = 0.4;
            bullets.slice(0, 3).forEach((txt) => {
                slide.addShape(pptx.ShapeType.roundRect, {
                    x: cardX, y: 1.5, w: 2.9, h: 4.2, rectRadius: 0.1,
                    fill: isDark ? 'FFFFFF10' : 'F1F5F9',
                    line: { color: UI_COLORS.primary, width: 1.5 }
                });
                slide.addText(clean(txt), {
                    x: cardX + 0.15, y: 1.8, w: 2.6, h: 3.5, 
                    fontSize: 15, color: textCol, align: 'center', valign: 'top', fontFace: 'Arial'
                });
                cardX += 3.15;
            });
        } 
        
        // কেস ২: স্প্লিট লেআউট (ছবি ও লেখা পাশাপাশি - ড্যাশবোর্ডের মতো)
        else if (hasImg) {
            // লেখা (বামে)
            let bY = 1.3;
            bullets.slice(0, 7).forEach(txt => {
                slide.addText(clean(txt), {
                    x: 0.6, y: bY, w: 5.0, fontSize: 17, color: textCol, 
                    bullet: { type: 'bullet', color: UI_COLORS.primary }, lineSpacing: 28, fontFace: 'Arial'
                });
                bY += 0.8;
            });

            // ছবি (ডানে - শ্যাডো ও বর্ডার সহ)
            try {
                let imgData = slideObj.image.includes("base64,") ? slideObj.image.split("base64,")[1] : slideObj.image;
                slide.addImage({ 
                    data: imgData, x: 5.8, y: 1.3, w: 3.8, h: 3.8, 
                    sizing: { type: 'contain' },
                    shadow: { type: 'outer', blur: 12, color: '000000', opacity: 0.25 }
                });

                // ক্যানভাস ড্রয়িং overlay
                if (slideObj.canvasDrawing && slideObj.canvasDrawing.startsWith("data:")) {
                    slide.addImage({
                        data: slideObj.canvasDrawing.split(',')[1],
                        x: 5.8, y: 1.3, w: 3.8, h: 3.8,
                        sizing: { type: 'contain' }
                    });
                }
            } catch(e) {}
        } 
        
        // কেস ৩: স্ট্যান্ডার্ড সিঙ্গেল কলাম
        else {
            let bY = 1.4;
            bullets.forEach(txt => {
                slide.addText(clean(txt), {
                    x: 0.8, y: bY, w: 8.5, fontSize: 19, color: textCol, 
                    bullet: { type: 'bullet', color: UI_COLORS.primary }, lineSpacing: 32, fontFace: 'Arial'
                });
                bY += 1.0;
            });
        }

        // ৪. শিক্ষক নোট ব্যাজ (ফুটার এর ঠিক ওপরে)
        if (slideObj.notes) {
            slide.addShape(pptx.ShapeType.roundRect, { 
                x: 0.5, y: 6.7, w: 9.0, h: 0.45, rectRadius: 0.05, 
                fill: '00000020' 
            });
            slide.addText(`💡 শিক্ষক গাইড: ${clean(slideObj.notes)}`, {
                x: 0.7, y: 6.7, w: 8.6, h: 0.45, fontSize: 10, italic: true, color: '64748B', valign: 'middle', fontFace: 'Arial'
            });
        }
      }

      // ৫. ফুটার ও ব্র্যান্ডিং (সব স্লাইডে থাকবে)
      slide.addText(`স্লাইড ${index + 1}  |  সশিবা স্মার্ট শিক্ষা পোর্টাল  |  ${new Date().toLocaleDateString('bn-BD')}`, {
        x: 0.5, y: 7.25, w: 9, fontSize: 9, color: '94A3B8', align: 'left'
      });
    });

    // ৬. ফাইল জেনারেশন
    const fileName = `Sashiba_Expert_Slide_${Date.now()}.pptx`;
    await pptx.writeFile({ fileName: fileName });
    console.log("PPTX successfully matched with Dashboard UI.");

  } catch (err) {
    console.error("Critical Export Error:", err);
    alert("পাওয়ারপয়েন্ট জেনারেট করা যাচ্ছে না। আপনার স্লাইডের তথ্যে বা ছবিতে কোনো বড় ত্রুটি থাকতে পারে।");
  }
}



// =================== অটো প্লে লজিক ===================
let wbAutoplayInterval = null;
let wbAutoplayTime = 5000; // default 5s
let wbIsAutoplayActive = false;

function toggleAutoplay() {
  const btn = document.getElementById("btnAutoplay");
  if (!btn) return;
  
  if (wbIsAutoplayActive) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
}

function startAutoplay() {
  wbIsAutoplayActive = true;
  const btn = document.getElementById("btnAutoplay");
  if (btn) {
    btn.innerHTML = `<i class="fa-solid fa-pause"></i> থামুন`;
    btn.style.background = "#be123c"; // Red background for Pause
    btn.style.borderColor = "#9f1239";
  }
  
  const intervalSelect = document.getElementById("autoplayInterval");
  if (intervalSelect) {
    wbAutoplayTime = parseInt(intervalSelect.value) || 5000;
  }
  
  if (wbAutoplayInterval) clearInterval(wbAutoplayInterval);
  wbAutoplayInterval = setInterval(() => {
    if (activeSlideIndex < slides.length - 1) {
      nextSlide();
    } else {
      // Loop back to start
      activeSlideIndex = 0;
      renderPresenterSlide();
    }
  }, wbAutoplayTime);
}

function stopAutoplay() {
  wbIsAutoplayActive = false;
  const btn = document.getElementById("btnAutoplay");
  if (btn) {
    btn.innerHTML = `<i class="fa-solid fa-play"></i> অটো প্লে`;
    btn.style.background = "#0f766e"; // Teal background for Play
    btn.style.borderColor = "#115e59";
  }
  if (wbAutoplayInterval) {
    clearInterval(wbAutoplayInterval);
    wbAutoplayInterval = null;
  }
}

function updateAutoplayInterval() {
  if (wbIsAutoplayActive) {
    startAutoplay();
  }
}

function toggleEditorPanel() {
  const studio = document.querySelector(".studio-layout");
  const icon = document.getElementById("editorToggleIcon");
  if (studio) {
    const isCollapsed = studio.classList.toggle("editor-collapsed");
    if (icon) {
      if (isCollapsed) {
        icon.className = "fa-solid fa-chevron-left";
      } else {
        icon.className = "fa-solid fa-chevron-right";
      }
    }
  }
}
