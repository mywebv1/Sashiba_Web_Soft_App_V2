// Function to control overall page navigation views
function showPage(pageId) {
  // Hide landing sections
  document.getElementById("hero-section").classList.add("hidden");
  document.getElementById("featured-projects").classList.add("hidden");

  // Hide other sub-pages
  document.getElementById("admin-panel").classList.add("hidden");
  document.getElementById("dynamic-page").classList.add("hidden");
  document.getElementById("course-details").classList.add("hidden");
  document.getElementById("learning-portal").classList.add("hidden");

  // Display targeted section page
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.remove("hidden");
  }
}

// Resets back to Main Home view
function goHome() {
  document.getElementById("admin-panel").classList.add("hidden");
  document.getElementById("dynamic-page").classList.add("hidden");
  document.getElementById("course-details").classList.add("hidden");
  document.getElementById("learning-portal").classList.add("hidden");

  document.getElementById("hero-section").classList.remove("hidden");
  document.getElementById("featured-projects").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// ACCORDION TOGGLE LOGIC
// ==========================================
function toggleAccordion(id) {
  const container = document.getElementById(id);
  const arrow = document.getElementById("arrow-" + id);

  if (container.classList.contains("hidden")) {
    container.classList.remove("hidden");
    arrow.style.transform = "rotate(180deg)";
  } else {
    container.classList.add("hidden");
    arrow.style.transform = "rotate(0deg)";
  }
}

// Handles selecting specific chapters and updating UI state
function selectChapter(levelName, subjectName, chapterName, element) {
  // Highlight active chapter link
  document.querySelectorAll(".chapter-link").forEach((link) => {
    link.classList.remove("bg-sky-100", "text-sky-600", "border-sky-500");
  });
  element.classList.add("bg-sky-100", "text-sky-600", "border-sky-500");

  // Load dynamically mocked contents for specific chapters
  loadChapterContent(levelName, subjectName, chapterName);
}

// ==========================================
// DYNAMIC PAGE LOADERS
// ==========================================

// 1. School Curriculum Page Loader
function loadSchoolPage(className) {
  document.getElementById("dynamic-title").innerText = className + " কারিকুলাম";
  document.getElementById("dynamic-subtitle").innerText =
    "বাম পাশ থেকে আপনার পছন্দের বিষয় ও অধ্যায়টি নির্বাচন করুন";
  document.getElementById("dynamic-count").innerText = "২৫টি ক্লাস পাওয়া গেছে";

  // Render Sidebar as dynamic subjects and chapters Accordion
  const sidebar = document.getElementById("dynamic-sidebar");
  sidebar.innerHTML = `
    <div class="mb-4">
      <h3 class="font-extrabold text-lg text-slate-900">📚 বিষয় ও অধ্যায়</h3>
      <p class="text-slate-400 text-xs">অধ্যায় নির্বাচন করতে বিষয়ে ক্লিক করুন</p>
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
           onclick="selectChapter('${className}', '${subject}', '${chap}', this)" 
           class="chapter-link block py-2 px-4 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded-lg text-sm transition pl-6 border-l-2 border-transparent">
          📖 ${chap}
        </a>
      `;
    });

    sidebar.innerHTML += `
      <div class="border-b border-slate-100 py-3">
        <button onclick="toggleAccordion('${accId}')" class="flex items-center justify-between w-full font-bold text-sm text-slate-800 hover:text-sky-600 transition">
          <span>📙 ${subject}</span>
          <span id="arrow-${accId}" class="text-slate-400 text-xs transform transition-transform duration-200">▼</span>
        </button>
        <div id="${accId}" class="hidden mt-2 space-y-1">
          ${chapterLinks}
        </div>
      </div>
    `;
  });

  showPage("dynamic-page");

  // Default trigger first chapter content of the first subject
  setTimeout(() => {
    toggleAccordion("school-subject-0");
    const firstChapBtn = document.querySelector(".chapter-link");
    if (firstChapBtn) firstChapBtn.click();
  }, 50);
}

// 2. College Curriculum Page Loader
function loadCollegePage(className) {
  document.getElementById("dynamic-title").innerText = className + " কারিকুলাম";
  document.getElementById("dynamic-subtitle").innerText =
    "কলেজ বিভাগের বিষয়ের অধ্যায়গুলো নিচে দেওয়া হলো";
  document.getElementById("dynamic-count").innerText = "১৮টি মডিউল পাওয়া গেছে";

  const sidebar = document.getElementById("dynamic-sidebar");
  sidebar.innerHTML = `
    <div class="mb-4">
      <h3 class="font-extrabold text-lg text-slate-900">🎓 কলেজ কারিকুলাম</h3>
    </div>
  `;

  const subjects = [
    "পদার্থবিজ্ঞান",
    "রসায়ন",
    "উচ্চতর গণিত",
    "জীববিজ্ঞান",
    "আইসিটি",
  ];
  const chapters = [
    "অধ্যায় ১: প্রাথমিক ধারণা",
    "অধ্যায় ২: মূল বিষয়সমূহ",
    "অধ্যায় ৩: সমাধান ও প্রজেক্ট",
  ];

  subjects.forEach((subject, subIndex) => {
    const accId = `college-subject-${subIndex}`;
    let chapterLinks = "";

    chapters.forEach((chap) => {
      chapterLinks += `
        <a href="javascript:void(0)" 
           onclick="selectChapter('${className}', '${subject}', '${chap}', this)" 
           class="chapter-link block py-2 px-4 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded-lg text-sm transition pl-6 border-l-2 border-transparent">
          ⚡ ${chap}
        </a>
      `;
    });

    sidebar.innerHTML += `
      <div class="border-b border-slate-100 py-3">
        <button onclick="toggleAccordion('${accId}')" class="flex items-center justify-between w-full font-bold text-sm text-slate-800 hover:text-sky-600 transition">
          <span>📘 ${subject}</span>
          <span id="arrow-${accId}" class="text-slate-400 text-xs transform transition-transform duration-200">▼</span>
        </button>
        <div id="${accId}" class="hidden mt-2 space-y-1">
          ${chapterLinks}
        </div>
      </div>
    `;
  });

  showPage("dynamic-page");
  setTimeout(() => {
    toggleAccordion("college-subject-0");
    const firstChapBtn = document.querySelector(".chapter-link");
    if (firstChapBtn) firstChapBtn.click();
  }, 50);
}

// 3. University Departments Page Loader
function loadUniversityPage(deptName) {
  document.getElementById("dynamic-title").innerText = deptName + " কারিকুলাম";
  document.getElementById("dynamic-subtitle").innerText =
    "ডিপার্টমেন্টের গুরুত্বপূর্ণ সেমিস্টার ভিত্তিক কোর্সসমূহ";
  document.getElementById("dynamic-count").innerText = "১২টি সেমিস্টার মডিউল";

  const sidebar = document.getElementById("dynamic-sidebar");
  sidebar.innerHTML = `
    <div class="mb-4">
      <h3 class="font-extrabold text-lg text-slate-900">🏛️ সেমিস্টার কোর্স</h3>
    </div>
  `;

  const courses = [
    "সেমিস্টার ১: বেসিক কোর্স",
    "সেমিস্টার ২: কোর থিওরি",
    "সেমিস্টার ৩: অ্যাডভান্সড ল্যাব",
  ];
  const topics = [
    "টপিক ০১: থিওরেটিক্যাল ক্লাস",
    "টপিক ০২: প্রজেক্ট গাইডলাইন",
    "টপিক ০৩: সমাধান সেশন",
  ];

  courses.forEach((course, subIndex) => {
    const accId = `uni-course-${subIndex}`;
    let topicLinks = "";

    topics.forEach((topic) => {
      topicLinks += `
        <a href="javascript:void(0)" 
           onclick="selectChapter('${deptName}', '${course}', '${topic}', this)" 
           class="chapter-link block py-2 px-4 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded-lg text-sm transition pl-6 border-l-2 border-transparent">
          🔧 ${topic}
        </a>
      `;
    });

    sidebar.innerHTML += `
      <div class="border-b border-slate-100 py-3">
        <button onclick="toggleAccordion('${accId}')" class="flex items-center justify-between w-full font-bold text-sm text-slate-800 hover:text-sky-600 transition">
          <span>⚙️ ${course}</span>
          <span id="arrow-${accId}" class="text-slate-400 text-xs transform transition-transform duration-200">▼</span>
        </button>
        <div id="${accId}" class="hidden mt-2 space-y-1">
          ${topicLinks}
        </div>
      </div>
    `;
  });

  showPage("dynamic-page");
  setTimeout(() => {
    toggleAccordion("uni-course-0");
    const firstChapBtn = document.querySelector(".chapter-link");
    if (firstChapBtn) firstChapBtn.click();
  }, 50);
}

// 4. Projects Page Loader (Matches School same-to-same but themed with custom filters)
function loadProjectsPage() {
  document.getElementById("dynamic-title").innerText = "🚀 প্রজেক্টস গ্যালারি";
  document.getElementById("dynamic-subtitle").innerText =
    "আপনার বাস্তব অভিজ্ঞতা অর্জনের জন্য ফিল্টার সিলেক্ট করুন";
  document.getElementById("dynamic-count").innerText =
    "১৫টি প্রজেক্টস পাওয়া গেছে";

  const sidebar = document.getElementById("dynamic-sidebar");
  sidebar.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-lg text-slate-900">Filter Projects</h3>
      <button class="text-xs text-sky-600 font-semibold hover:underline">Reset</button>
    </div>
    <!-- Project Category Accordion -->
    <div class="border-t border-slate-100 py-3">
      <button onclick="toggleAccordion('p-cat')" class="flex items-center justify-between w-full font-bold text-sm text-slate-800">
        <span>📂 Category</span>
        <span id="arrow-p-cat" class="text-slate-400 text-xs">▼</span>
      </button>
      <div id="p-cat" class="mt-2 space-y-2">
        <label class="flex items-center gap-3 text-sm text-slate-600"><input type="checkbox" checked /> Artificial Intelligence</label>
        <label class="flex items-center gap-3 text-sm text-slate-600"><input type="checkbox" /> Web Development</label>
        <label class="flex items-center gap-3 text-sm text-slate-600"><input type="checkbox" /> App Design</label>
      </div>
    </div>
  `;

  // Pre-load dynamic list of Project cards
  const grid = document.getElementById("dynamic-grid");
  grid.innerHTML = "";
  const projectsList = [
    {
      title: "AI চ্যাটবট তৈরি",
      desc: "পাইথন দিয়ে নিজের জন্য একটি পার্সোনাল AI অ্যাসিস্ট্যান্ট বানান।",
      price: "৳৯৯৯",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    },
    {
      title: "মডার্ন ড্যাশবোর্ড ডিজাইন",
      desc: "ফিগুমা দিয়ে প্রিমিয়াম UI/UX ডিজাইন প্রজেক্ট।",
      price: "৳১৪৯৯",
      img: "https://images.unsplash.com/photo-1581291518655-9523bb99d9f6",
    },
    {
      title: "ডিজিটাল স্টার্টআপ প্ল্যান",
      desc: "একটি সম্পূর্ণ বিজনেস মডেল তৈরির হাতে কলমে শিক্ষা।",
      price: "ফ্রি",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    },
  ];

  projectsList.forEach((proj) => {
    grid.innerHTML += generateCardHTML(
      proj.title,
      proj.desc,
      proj.price,
      proj.img,
      "প্রজেক্ট",
    );
  });

  showPage("dynamic-page");
}

// 5. Skills Page Loader (Matches same layout)
function loadSkillsPage() {
  document.getElementById("dynamic-title").innerText = "🛠️ স্কিলস ডেভেলপমেন্ট";
  document.getElementById("dynamic-subtitle").innerText =
    "ক্যারিয়ার বুস্ট করার জন্য প্রয়োজনীয় টেকনিক্যাল স্কিলসমূহ";
  document.getElementById("dynamic-count").innerText = "১২টি স্কিলস মডিউল";

  const sidebar = document.getElementById("dynamic-sidebar");
  sidebar.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-lg text-slate-900">Skills Filter</h3>
      <button class="text-xs text-sky-600 font-semibold hover:underline">Reset</button>
    </div>
    <!-- Skills Level Accordion -->
    <div class="border-t border-slate-100 py-3">
      <button onclick="toggleAccordion('s-lev')" class="flex items-center justify-between w-full font-bold text-sm text-slate-800">
        <span>📊 Difficulty Level</span>
        <span id="arrow-s-lev" class="text-slate-400 text-xs">▼</span>
      </button>
      <div id="s-lev" class="mt-2 space-y-2">
        <label class="flex items-center gap-3 text-sm text-slate-600"><input type="checkbox" checked /> Beginner</label>
        <label class="flex items-center gap-3 text-sm text-slate-600"><input type="checkbox" /> Intermediate</label>
        <label class="flex items-center gap-3 text-sm text-slate-600"><input type="checkbox" /> Advanced</label>
      </div>
    </div>
  `;

  // Pre-load Skill Cards
  const grid = document.getElementById("dynamic-grid");
  grid.innerHTML = "";
  const skillsList = [
    {
      title: "ChatGPT AI Design Masterclass",
      desc: "AI Design & Brand Building-এর নতুন যুগ: শুধু প্রম্পট নয়, ডিজাইন শিখুন।",
      price: "৳৪৯৯",
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Claude AI Masterclass",
      desc: "ক্লড এর ৯০% সুপারপাওয়ার আনলক করুন একটি কোর্সে!",
      price: "৳৯৯৯",
      img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
    },
  ];

  skillsList.forEach((skill) => {
    grid.innerHTML += generateCardHTML(
      skill.title,
      skill.desc,
      skill.price,
      skill.img,
      "স্কিল ক্লাস",
    );
  });

  showPage("dynamic-page");
}

// ==========================================
// CONTENT GENERATORS
// ==========================================

// Generates cards dynamically based on Subject and Chapter selection
function loadChapterContent(levelName, subjectName, chapterName) {
  const grid = document.getElementById("dynamic-grid");
  grid.innerHTML = ""; // Clear previous

  const dynamicData = [
    {
      title: `${subjectName} : ${chapterName} - অনলাইন লেকচার`,
      desc: `${levelName}-এর শিক্ষার্থীদের জন্য ${subjectName} বিষয়ের অত্যন্ত সহজ এবং বাস্তবমুখী ভিডিও লেকচার।`,
      price: "ফ্রি",
      img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
      badge: "ভিডিও ক্লাস",
    },
    {
      title: `${subjectName} : ${chapterName} - প্র্যাক্টিকাল প্রজেক্ট`,
      desc: `শুধুমাত্র মুখস্থ নয়, থিওরি শেষে বাস্তব প্রজেক্টের মাধ্যমে বিষয়টির মূল অংশ শিখে নিন।`,
      price: "৳২৯৯",
      img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80",
      badge: "প্রজেক্ট",
    },
    {
      title: `${subjectName} : ${chapterName} - পিডিএফ নোট ও সমাধান`,
      desc: `পরীক্ষার শেষ মুহূর্তের প্রস্তুতির জন্য গুরুত্বপূর্ণ প্রশ্ন, সমাধান এবং স্পেশাল হ্যান্ডনোট।`,
      price: "ফ্রি",
      img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
      badge: "নোটস",
    },
  ];

  dynamicData.forEach((item) => {
    grid.innerHTML += generateCardHTML(
      item.title,
      item.desc,
      item.price,
      item.img,
      item.badge,
    );
  });
}

// Utility function to output responsive Card HTML
function generateCardHTML(title, desc, price, img, badge) {
  return `
    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      <div class="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img src="${img}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="absolute top-3 left-3 bg-sky-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">${badge}</div>
      </div>
      <div class="p-5 flex flex-col flex-1">
        <h3 class="font-bold text-[16px] text-slate-900 leading-snug hover:text-sky-600 cursor-pointer transition" onclick="showCourseDetails('${title}', '${desc}', '${price}')">
          ${title}
        </h3>
        <p class="text-slate-500 text-xs mt-2 line-clamp-2">
          ${desc}
        </p>
        <div class="flex items-center justify-between mt-4 mb-2">
          <div class="flex items-baseline gap-1.5">
            <span class="text-lg font-extrabold text-[#f97316]">${price}</span>
          </div>
        </div>
        <div class="flex gap-2 mt-auto pt-4 border-t border-slate-100">
          <button class="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition">
            Add to Cart 🛒
          </button>
          <button onclick="showCourseDetails('${title}', '${desc}', '${price}')" class="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition">
            View Details 👁️
          </button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// COURSE DETAILS & UTILS
// ==========================================
function showCourseDetails(title, desc, price) {
  document.getElementById("detail-title").innerText = title;
  document.getElementById("detail-desc").innerText = desc;
  document.getElementById("detail-price").innerText = price;
  document.getElementById("course-details").classList.remove("hidden");
}

function hideCourseDetails() {
  document.getElementById("course-details").classList.add("hidden");
}

function startLearning() {
  document.getElementById("course-details").classList.add("hidden");
  document.getElementById("learning-portal").classList.remove("hidden");
}

function closePortal() {
  document.getElementById("learning-portal").classList.add("hidden");
}

function updateWebsiteContent() {
  const title = document.getElementById("admin-course-title").value;
  const price = document.getElementById("admin-course-price").value;
  if (title || price) {
    alert("কোর্সের তথ্য সফলভাবে আপডেট হয়েছে!");
  } else {
    alert("দয়া করে তথ্য পূরণ করুন।");
  }
}
