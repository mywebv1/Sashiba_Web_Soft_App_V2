// Global App / State Variables
let currentLevel = "১ম শ্রেণি";
let currentSubject = "ইংরেজি";
let currentChapter = "১ম অধ্যায়";

// Real-time State Simulation for Words & MCQs (Progress Tracking)
let wordListData = [
  { word: "Apple", meaning: "আপেল", completed: true },
  { word: "Boy", meaning: "ছেলে", completed: true },
  { word: "Girl", meaning: "মেয়ে", completed: false },
  { word: "Book", meaning: "বই", completed: true },
  { word: "Teacher", meaning: "শিক্ষক", completed: false },
  { word: "School", meaning: "বিদ্যালয়", completed: true },
  { word: "Student", meaning: "ছাত্র", completed: false },
  { word: "Pen", meaning: "কলম", completed: true },
  { word: "Paper", meaning: "কাগজ", completed: false },
  { word: "Water", meaning: "পানি", completed: false },
];

let filteredWords = [...wordListData];
let wordCurrentPage = 1;
const wordsPerPage = 5;

// Mock Solved MCQs
let mcqData = [
  {
    id: 1,
    question: "Apple এর বাংলা কী?",
    options: ["আম", "আপেল", "কলা", "লিচু"],
    answer: 1,
    userAnswer: null,
  },
  {
    id: 2,
    question: "Boy অর্থ কী?",
    options: ["ছেলে", "মেয়ে", "বই", "কলম"],
    answer: 0,
    userAnswer: null,
  },
  {
    id: 3,
    question: "Book শব্দের সঠিক অর্থ কোনটি?",
    options: ["খাতা", "চক", "বই", "বিদ্যালয়"],
    answer: 2,
    userAnswer: null,
  },
];

// Navigation view controller
function showPage(pageId) {
  document.getElementById("hero-section").classList.add("hidden");
  document.getElementById("featured-projects").classList.add("hidden");
  document.getElementById("admin-panel").classList.add("hidden");
  document.getElementById("dynamic-page").classList.add("hidden");
  document.getElementById("course-details").classList.add("hidden");
  document.getElementById("learning-portal").classList.add("hidden");

  const target = document.getElementById(pageId);
  if (target) {
    target.classList.remove("hidden");
  }
}

function goHome() {
  document.getElementById("admin-panel").classList.add("hidden");
  document.getElementById("dynamic-page").classList.add("hidden");
  document.getElementById("course-details").classList.add("hidden");
  document.getElementById("learning-portal").classList.add("hidden");

  document.getElementById("hero-section").classList.remove("hidden");
  document.getElementById("featured-projects").classList.remove("hidden");
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

// Chapter selection handler
function selectChapter(levelName, subjectName, chapterName, element) {
  currentLevel = levelName;
  currentSubject = subjectName;
  currentChapter = chapterName;

  document.querySelectorAll(".chapter-link").forEach((link) => {
    link.classList.remove("bg-sky-100", "text-sky-600", "border-sky-500");
  });
  if (element) {
    element.classList.add("bg-sky-100", "text-sky-600", "border-sky-500");
  }

  loadChapterDashboard();
}

// Load dynamic School page
function loadSchoolPage(className) {
  document.getElementById("dynamic-title").innerText = className + " কারিকুলাম";
  document.getElementById("dynamic-subtitle").innerText =
    "বাম পাশ থেকে আপনার পছন্দের বিষয় ও অধ্যায়টি নির্বাচন করুন";
  document.getElementById("dynamic-count").innerText = "অধ্যায়ভিত্তিক কন্টেন্ট";

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
  setTimeout(() => {
    toggleAccordion("school-subject-1"); // English default open for simulation
    const links = document.querySelectorAll(".chapter-link");
    if (links.length > 5) {
      links[5].click(); // English Ch 1 default select
    } else if (links.length > 0) {
      links[0].click();
    }
  }, 50);
}

// College and University placeholder curriculum systems
function loadCollegePage(className) {
  loadSchoolPage(className);
}
function loadUniversityPage(deptName) {
  loadSchoolPage(deptName);
}
function loadProjectsPage() {
  loadSchoolPage("প্রজেক্টস");
}
function loadSkillsPage() {
  loadSchoolPage("স্কিলস");
}

// ==========================================
// RENDER INTERACTIVE DASHBOARD VIEW (NEW STYLISH UI)
// ==========================================
function loadChapterDashboard() {
  const grid = document.getElementById("dynamic-grid");
  grid.className = "grid grid-cols-1 md:grid-cols-3 gap-6 w-full col-span-full";
  grid.innerHTML = "";

  // Progress calculations
  const totalWords = wordListData.length;
  const completedWords = wordListData.filter((w) => w.completed).length;
  const remainingWords = totalWords - completedWords;

  const totalMCQs = mcqData.length;
  const solvedMCQs = mcqData.filter((m) => m.userAnswer !== null).length;
  const correctMCQs = mcqData.filter(
    (m) => m.userAnswer !== null && m.userAnswer === m.answer,
  ).length;
  const mcqScore =
    solvedMCQs > 0 ? Math.round((correctMCQs / solvedMCQs) * 100) : 0;

  // 1. Learning Box Card HTML
  const learningCard = `
    <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
      <div>
        <div class="flex items-center gap-2 mb-6">
          <span class="text-3xl">📚</span>
          <h3 class="text-xl font-extrabold text-slate-950">Learning</h3>
        </div>
        
        <div class="space-y-4">
          <!-- Word List Sub-button -->
          <div onclick="openWordListModal()" class="flex justify-between items-center bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-200 p-4 rounded-2xl cursor-pointer transition">
            <div class="flex items-center gap-3">
              <span class="text-lg">📖</span>
              <div>
                <h4 class="font-bold text-slate-800 text-sm">Word List</h4>
                <p class="text-[10px] text-slate-400 font-medium">Completed: ${completedWords} | Remaining: ${remainingWords}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs font-black text-sky-600 block">${totalWords} Words</span>
              <span class="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-bold">Practice</span>
            </div>
          </div>

          <!-- Spelling (Static mockup representation) -->
          <div class="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-3">
              <span class="text-lg">🔤</span>
              <h4 class="font-bold text-slate-700 text-sm">Spelling</h4>
            </div>
            <span class="text-xs font-bold text-slate-500">৮০টি</span>
          </div>

          <!-- Word Meaning -->
          <div class="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-3">
              <span class="text-lg">📚</span>
              <h4 class="font-bold text-slate-700 text-sm">Word Meaning</h4>
            </div>
            <span class="text-xs font-bold text-slate-500">১৫০টি</span>
          </div>

          <!-- Sentence -->
          <div class="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-3">
              <span class="text-lg">📝</span>
              <h4 class="font-bold text-slate-700 text-sm">Sentence</h4>
            </div>
            <span class="text-xs font-bold text-slate-500">৭৫টি</span>
          </div>

          <!-- Grammar -->
          <div class="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-3">
              <span class="text-lg">🧠</span>
              <h4 class="font-bold text-slate-700 text-sm">Grammar</h4>
            </div>
            <span class="text-xs font-bold text-slate-500">১২টি</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // 2. Practice Box Card HTML
  const practiceCard = `
    <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
      <div>
        <div class="flex items-center gap-2 mb-6">
          <span class="text-3xl">📝</span>
          <h3 class="text-xl font-extrabold text-slate-950">Practice</h3>
        </div>
        
        <div class="space-y-3.5">
          <!-- MCQ interactive selection -->
          <div onclick="openMCQModal()" class="flex justify-between items-center bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 p-4 rounded-2xl cursor-pointer transition">
            <div class="flex items-center gap-3">
              <span class="text-lg">☑</span>
              <div>
                <h4 class="font-bold text-slate-800 text-sm">MCQ Practice</h4>
                <p class="text-[10px] text-slate-400 font-medium">Solved: ${solvedMCQs}/${totalMCQs} | Score: ${mcqScore}%</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs font-black text-indigo-600 block">${totalMCQs} Items</span>
              <span class="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">Start ▶</span>
            </div>
          </div>

          <!-- Fill in the blank -->
          <div class="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-3">
              <span class="text-sm">✍</span>
              <h4 class="font-bold text-slate-700 text-sm">Fill in the Blank</h4>
            </div>
            <span class="text-xs font-bold text-slate-500">৩০টি</span>
          </div>

          <!-- Sentence Arrangement -->
          <div class="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-3">
              <span class="text-sm">🔀</span>
              <h4 class="font-bold text-slate-700 text-sm">Sentence Arrangement</h4>
            </div>
            <span class="text-xs font-bold text-slate-500">২০টি</span>
          </div>

          <!-- Written Question -->
          <div class="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-3">
              <span class="text-sm">❓</span>
              <h4 class="font-bold text-slate-700 text-sm">Written Question</h4>
            </div>
            <span class="text-xs font-bold text-slate-500">২৫টি</span>
          </div>

          <!-- CQ -->
          <div class="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-3">
              <span class="text-sm">📝</span>
              <h4 class="font-bold text-slate-700 text-sm">CQ</h4>
            </div>
            <span class="text-xs font-bold text-slate-500">১৫টি</span>
          </div>

          <!-- Quiz -->
          <div class="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-3">
              <span class="text-sm">🎯</span>
              <h4 class="font-bold text-slate-700 text-sm">Quiz</h4>
            </div>
            <span class="text-xs font-bold text-emerald-600 cursor-pointer hover:underline">Start ▶</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // 3. Teacher Tools Card HTML
  const teacherCard = `
    <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
      <div>
        <div class="flex items-center gap-2 mb-6">
          <span class="text-3xl">👨‍🏫</span>
          <h3 class="text-xl font-extrabold text-slate-950">Teacher Tools</h3>
        </div>
        
        <div class="space-y-4">
          <!-- Question Generator Button -->
          <div onclick="openQGenModal()" class="flex justify-between items-center bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 p-4 rounded-2xl cursor-pointer transition">
            <div class="flex items-center gap-3">
              <span class="text-lg">📄</span>
              <div>
                <h4 class="font-bold text-slate-800 text-sm">Question Generator</h4>
                <p class="text-[10px] text-slate-400 font-medium">Auto generating mock papers</p>
              </div>
            </div>
            <span class="text-xs font-bold text-emerald-600 hover:underline">Open ⚙️</span>
          </div>

          <!-- Print Paper -->
          <div onclick="triggerGeneratePaper()" class="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl border border-slate-100 cursor-pointer transition">
            <div class="flex items-center gap-3">
              <span class="text-lg">🖨️</span>
              <h4 class="font-bold text-slate-700 text-sm">Print Paper</h4>
            </div>
            <span class="text-xs font-bold text-slate-400">→</span>
          </div>

          <!-- Answer Sheet -->
          <div class="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-3">
              <span class="text-lg">✅</span>
              <h4 class="font-bold text-slate-700 text-sm">Answer Sheet</h4>
            </div>
            <span class="text-xs font-bold text-slate-400">Available</span>
          </div>

          <!-- Mark Distribution -->
          <div class="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div class="flex items-center gap-3">
              <span class="text-lg">📊</span>
              <h4 class="font-bold text-slate-700 text-sm">Mark Distribution</h4>
            </div>
            <span class="text-xs font-bold text-slate-400">Interactive</span>
          </div>
        </div>
      </div>
    </div>
  `;

  grid.innerHTML = learningCard + practiceCard + teacherCard;
}

// ==========================================
// MODAL CONTROLLERS & LOGICS
// ==========================================

// --- Word List Controller ---
function openWordListModal() {
  document.getElementById("word-search").value = "";
  filteredWords = [...wordListData];
  wordCurrentPage = 1;
  document.getElementById("wl-modal-subtitle").innerText =
    `${currentLevel} → ${currentSubject} → ${currentChapter}`;
  renderWordListTable();
  document.getElementById("word-list-modal").classList.remove("hidden");
}

function closeWordListModal() {
  document.getElementById("word-list-modal").classList.add("hidden");
  loadChapterDashboard(); // Refresh progress in dashboard view
}

function renderWordListTable() {
  const tableBody = document.getElementById("word-table-body");
  tableBody.innerHTML = "";

  const startIndex = (wordCurrentPage - 1) * wordsPerPage;
  const endIndex = startIndex + wordsPerPage;
  const pageWords = filteredWords.slice(startIndex, endIndex);

  if (pageWords.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-slate-400 text-sm">কোনো শব্দ খুঁজে পাওয়া যায়নি।</td></tr>`;
    document.getElementById("wl-pagination-text").innerText = "Page 0 of 0";
    document.getElementById("wl-prev-btn").disabled = true;
    document.getElementById("wl-next-btn").disabled = true;
    return;
  }

  pageWords.forEach((item, index) => {
    const globalIndex = startIndex + index;
    const isCompleted = item.completed;

    tableBody.innerHTML += `
      <tr class="hover:bg-slate-50 transition">
        <td class="p-3 font-bold text-slate-900">${item.word}</td>
        <td class="p-3 text-slate-600">${item.meaning}</td>
        <td class="p-3 text-right">
          <button 
            onclick="toggleWordComplete(${globalIndex})" 
            class="px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              isCompleted
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-sky-50 hover:text-sky-600"
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
  // Find reference word in master list to keep sync accurate
  const targetWord = filteredWords[index];
  const masterWord = wordListData.find((w) => w.word === targetWord.word);
  if (masterWord) {
    masterWord.completed = !masterWord.completed;
  }
  renderWordListTable();
}

function filterWordList() {
  const query = document
    .getElementById("word-search")
    .value.toLowerCase()
    .trim();
  filteredWords = wordListData.filter(
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

// --- MCQ Controller ---
function openMCQModal() {
  document.getElementById("mcq-modal-subtitle").innerText =
    `${currentLevel} → ${currentSubject} → ${currentChapter}`;
  renderMCQQuestions();
  document.getElementById("mcq-modal").classList.remove("hidden");
}

function closeMCQModal() {
  document.getElementById("mcq-modal").classList.add("hidden");
  loadChapterDashboard();
}

function renderMCQQuestions() {
  const container = document.getElementById("mcq-questions-container");
  container.innerHTML = "";

  let answeredCount = 0;
  let correctCount = 0;

  mcqData.forEach((q, qIndex) => {
    let optionsHTML = "";

    q.options.forEach((opt, optIndex) => {
      let optStyle = "border-slate-200 hover:border-slate-400 bg-slate-50";

      // Determine selection feedback styles
      if (q.userAnswer !== null) {
        if (optIndex === q.answer) {
          optStyle =
            "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold";
        } else if (optIndex === q.userAnswer) {
          optStyle = "border-red-500 bg-red-50 text-red-800 font-bold";
        } else {
          optStyle = "border-slate-100 bg-slate-50/50 opacity-60";
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
            class="text-indigo-600 border-slate-300"
            ${q.userAnswer === optIndex ? "checked" : ""} 
            ${q.userAnswer !== null ? "disabled" : ""} 
          />
          ${opt}
        </label>
      `;
    });

    if (q.userAnswer !== null) {
      answeredCount++;
      if (q.userAnswer === q.answer) {
        correctCount++;
      }
    }

    container.innerHTML += `
      <div class="bg-slate-50/50 p-5 rounded-2xl border border-slate-200">
        <h4 class="font-extrabold text-slate-900 mb-3 text-[15px]">${qIndex + 1}. ${q.question}</h4>
        <div class="grid grid-cols-2 gap-3 mt-4">
          ${optionsHTML}
        </div>
      </div>
    `;
  });

  document.getElementById("mcq-solved-count").innerText =
    `${correctCount}/${mcqData.length}`;
}

function submitMCQ(qIndex, optIndex) {
  if (mcqData[qIndex].userAnswer !== null) return; // Prevent resubmission
  mcqData[qIndex].userAnswer = optIndex;
  renderMCQQuestions();
}

// --- Question Generator Controller ---
function openQGenModal() {
  document.getElementById("qgen-lbl-class").innerText = currentLevel;
  document.getElementById("qgen-lbl-subject").innerText = currentSubject;
  document.getElementById("qgen-lbl-chapter").innerText = currentChapter;
  document.getElementById("qgen-modal").classList.remove("hidden");
}

function closeQGenModal() {
  document.getElementById("qgen-modal").classList.add("hidden");
}

function triggerGeneratePaper() {
  closeQGenModal();

  // Populate Printable Paper meta values
  document.getElementById("p-class").innerText = currentLevel;
  document.getElementById("p-subject").innerText = currentSubject;

  // Find selected Marks
  const marksRadios = document.getElementsByName("marks");
  let selectedMark = "৫০";
  for (const radio of marksRadios) {
    if (radio.checked) {
      selectedMark = radio.value;
      break;
    }
  }
  document.getElementById("p-marks").innerText = selectedMark;

  // Render printable questions list
  const container = document.getElementById("printed-questions-area");
  container.innerHTML = "";

  // Simulate multiple question blocks
  container.innerHTML += `
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

    <div class="pt-6 border-t border-slate-200">
      <h3 class="font-black text-slate-950 text-md mb-3">২. শূন্যস্থান পূরণ করো (Fill in the blanks):</h3>
      <div class="space-y-3 pl-4 text-sm font-semibold text-slate-800">
        <p>ক) This is __________ apple.</p>
        <p>খ) He is a good __________ .</p>
      </div>
    </div>

    <div class="pt-6 border-t border-slate-200">
      <h3 class="font-black text-slate-950 text-md mb-3">৩. সংক্ষিপ্ত প্রশ্নের উত্তর দাও (Short Questions):</h3>
      <div class="space-y-3 pl-4 text-sm font-semibold text-slate-800">
        <p>ক) শিক্ষক এর ইংরেজি প্রতিশব্দ কী?</p>
        <p>খ) তোমার স্কুলের নাম ইংরেজিতে লিখো।</p>
      </div>
    </div>
  `;

  // Display printable paper overlay modal
  document.getElementById("print-paper-modal").classList.remove("hidden");
}

function closePrintModal() {
  document.getElementById("print-paper-modal").classList.add("hidden");
}

// Course details and placeholder learning functions
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
