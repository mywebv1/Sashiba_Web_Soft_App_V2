// =========================================================================
//          সশিবা প্রশ্নপত্র আর্কিটেক্ট — অ্যাপ লজিক (app.js)
//          এই ফাইলটি script.js এর পরে লোড হয় এবং সব নতুন
//          ফিচার পরিচালনা করে।
// =========================================================================

// ==================== [১] বর্তমান ভাষা স্টেট শুরু ====================
let currentLang = "bn";
// ==================== [১] বর্তমান ভাষা স্টেট শেষ ====================


// ==================== [২] UI ট্রান্সলেশন ডিকশনারি শুরু ====================
const uiTranslations = {
  bn: {
    "brand-main":           "স্মার্ট শিক্ষা",
    "brand-sub":            "বাতায়ন",
    "nav-dashboard-txt":    "ড্যাশবোর্ড",
    "nav-new-txt":          "নতুন প্রশ্নপত্র",
    "nav-library-txt":      "পুরোনো প্রশ্নপত্র",
    "sb-role":              "প্রধান শিক্ষক",
    "hdr-title":            "প্রশ্নপত্র আর্কিটেক্ট",
    "exp-save":             "লাইব্রেরিতে সেভ",
    "exp-print":            "প্রিন্ট / PDF",
    "card-inst-title":      "১. প্রতিষ্ঠানের তথ্য",
    "lbl-instname":         "প্রতিষ্ঠানের নাম",
    "lbl-instaddr":         "প্রতিষ্ঠানের ঠিকানা",
    "lbl-regcode":          "রেজিস্ট্রেশন কোড",
    "lbl-estyear":          "প্রতিষ্ঠাকাল",
    "card-acad-title":      "২. একাডেমিক তথ্য",
    "lbl-board":            "শিক্ষা বোর্ড",
    "board-madrasha":       "মাদ্রাসা",
    "board-tech":           "কারিগরি",
    "lbl-class":            "শ্রেণি নির্বাচন",
    "lbl-subject":          "বিষয় নির্বাচন",
    "card-chapter-title":   "৩. অধ্যায় ও পাঠ",
    "lbl-select-chapter":   "অধ্যায় নির্বাচন করুন:",
    "lbl-examtime":         "পরীক্ষার সময় (মিনিট)",
    "card-qtype-title":     "৪. প্রশ্নের সংখ্যা ও মান",
    "qh-type":              "প্রশ্নের ধরন",
    "qh-count":             "সংখ্যা",
    "qh-mark":              "মান",
    "card-diff-title":      "৫. কঠিনতার স্তর",
    "diff-easy":            "সহজ",
    "diff-medium":          "মাঝারি",
    "diff-hard":            "কঠিন",
    "card-set-title":       "৬. আউটপুট সেট (সাফল)",
    "lbl-shuffle":          "সাফল অপশন:",
    "sh-mcq":               "নৈর্ব্যক্তিক",
    "sh-one":               "এক কথায় উত্তর",
    "sh-short":             "অতি সংক্ষিপ্ত",
    "sh-brief":             "সংক্ষিপ্ত",
    "card-ans-title":       "৭. উত্তর ও ব্যাখ্যা",
    "lbl-anssheet":         "উত্তরপত্র তৈরি করুন",
    "lbl-ansexpl":          "AI ব্যাখ্যাসহ (আবশ্যিক)",
    "btn-generate-txt":     "প্রশ্নপত্র জেনারেট করুন",
    "preview-label-txt":    "লাইভ প্রিভিউ",
    "vi-class":             "শ্রেণি:",
    "vi-sub":               "বিষয়:",
    "vi-time":              "সময়:",
    "vi-total":             "পূর্ণমান:",
    "ans-page-title":       "উত্তরপত্র ও AI ব্যাখ্যা",
    "lib-title":            "পুরোনো প্রশ্নপত্র",
    "lib-new-btn":          "নতুন প্রশ্নপত্র",
    "empty-msg-txt":        "তথ্য পূরণ করে জেনারেট বাটনে ক্লিক করুন...",
  },
  en: {
    "brand-main":           "Smart Education",
    "brand-sub":            "Portal",
    "nav-dashboard-txt":    "Dashboard",
    "nav-new-txt":          "New Question Paper",
    "nav-library-txt":      "Old Question Papers",
    "sb-role":              "Head Teacher",
    "hdr-title":            "Question Paper Architect",
    "exp-save":             "Save to Library",
    "exp-print":            "Print / PDF",
    "card-inst-title":      "1. Institution Info",
    "lbl-instname":         "Institution Name",
    "lbl-instaddr":         "Institution Address",
    "lbl-regcode":          "Registration Code",
    "lbl-estyear":          "Established Year",
    "card-acad-title":      "2. Academic Info",
    "lbl-board":            "Education Board",
    "board-madrasha":       "Madrasha",
    "board-tech":           "Technical",
    "lbl-class":            "Select Class",
    "lbl-subject":          "Select Subject",
    "card-chapter-title":   "3. Chapter & Lesson",
    "lbl-select-chapter":   "Select Chapter:",
    "lbl-examtime":         "Exam Duration (minutes)",
    "card-qtype-title":     "4. Question Count & Marks",
    "qh-type":              "Question Type",
    "qh-count":             "Count",
    "qh-mark":              "Mark",
    "card-diff-title":      "5. Difficulty Level",
    "diff-easy":            "Easy",
    "diff-medium":          "Medium",
    "diff-hard":            "Hard",
    "card-set-title":       "6. Output Set (Shuffle)",
    "lbl-shuffle":          "Shuffle Options:",
    "sh-mcq":               "MCQ",
    "sh-one":               "One-word Answer",
    "sh-short":             "Very Short",
    "sh-brief":             "Short",
    "card-ans-title":       "7. Answer & Explanation",
    "lbl-anssheet":         "Generate Answer Sheet",
    "lbl-ansexpl":          "With AI Explanation (required)",
    "btn-generate-txt":     "Generate Question Paper",
    "preview-label-txt":    "Live Preview",
    "vi-class":             "Class:",
    "vi-sub":               "Subject:",
    "vi-time":              "Time:",
    "vi-total":             "Full Marks:",
    "ans-page-title":       "Answer Sheet & AI Explanation",
    "lib-title":            "Old Question Papers",
    "lib-new-btn":          "New Question Paper",
    "empty-msg-txt":        "Fill in the form and click Generate...",
  },
};
// ==================== [২] UI ট্রান্সলেশন ডিকশনারি শেষ ====================


// ==================== [৩] পেজ লোড হওয়ার পর শুরু (window.onload override) ====================
// এই onload, script.js এর পুরনো onload কে override করে
window.onload = function () {

  // শ্রেণি ড্রপডাউন পূরণ করো
  const clsSel = document.getElementById("classSelect");
  if (clsSel && db && db.classes) {
    db.classes.forEach(function (c) {
      clsSel.innerHTML += "<option>" + c + "</option>";
    });
  }

  // বিষয় ও অধ্যায় লোড করো
  loadSubjects();

  // প্রশ্নের ধরন তালিকা তৈরি করো
  const qList = document.getElementById("qConfigList");
  if (qList && db && db.qTypes) {
    db.qTypes.forEach(function (t) {
      qList.innerHTML +=
        '<div class="q-item-styled">' +
          '<label class="sq-check"><input type="checkbox" class="q-check" checked><span></span> ' + t.name + "</label>" +
          '<input type="number" class="q-count" value="' + t.count + '">' +
          '<input type="number" class="q-mark" value="' + t.mark + '">' +
        "</div>";
    });
  }

  // প্রিভিউ সিঙ্ক করো
  sync();

  // লাইব্রেরি রেন্ডার করো
  renderLibrary();

  // বাইরে ক্লিক করলে এক্সপোর্ট মেনু বন্ধ হবে
  document.addEventListener("click", function (e) {
    var wrapper = document.querySelector(".dropdown-wrapper");
    var menu = document.getElementById("exportMenu");
    if (menu && wrapper && !wrapper.contains(e.target)) {
      menu.style.display = "none";
    }
  });
};
// ==================== [৩] পেজ লোড শেষ ====================


// ==================== [৪] ড্রপডাউন লোড ফাংশন শুরু ====================
function loadSubjects() {
  var cls = document.getElementById("classSelect").value;
  var subSel = document.getElementById("subjectSelect");
  if (!subSel) return;
  subSel.innerHTML = "";
  var subs = (db.subjects && db.subjects[cls]) ? db.subjects[cls] : [];
  subs.forEach(function (s) {
    subSel.innerHTML += "<option>" + s + "</option>";
  });
  loadChapters();
  sync();
}

function loadChapters() {
  var selectedClass   = document.getElementById("classSelect").value;
  var selectedSubject = document.getElementById("subjectSelect").value;
  // শ্রেণি ও বিষয় দিয়ে key তৈরি
  var key     = selectedClass + "|" + selectedSubject;
  var chapBox = document.getElementById("chapterContainer");
  if (!chapBox) return;
  chapBox.innerHTML = "";

  var chapters = (db.chapters && db.chapters[key]) ? db.chapters[key] : [];
  chapters.forEach(function (ch) {
    // অধ্যায়ের নামে বিশেষ অক্ষর থাকলে ID নিরাপদ করো
    var safeId = ch.replace(/[^a-zA-Z0-9]/g, "_");
    chapBox.innerHTML +=
      '<label class="sq-check">' +
        '<input type="checkbox" onchange="loadTopics(this,\'' + safeId + '\',\'' + ch.replace(/'/g, "\\'") + '\')">' +
        "<span></span> " + ch +
      "</label>";
  });

  // বিষয় পরিবর্তন হলে আগের টপিক মুছে যাবে
  var topicBox = document.getElementById("topicContainer");
  if (topicBox) topicBox.innerHTML = "";
}

function loadTopics(checkbox, safeId, chapter) {
  var topicBox = document.getElementById("topicContainer");
  if (!topicBox) return;

  if (checkbox.checked) {
    var topics = (db.topics && db.topics[chapter]) ? db.topics[chapter] : [];
    var html = '<div id="tp-' + safeId + '" style="padding:10px;background:#fff;border-radius:8px;margin-top:6px;border:1px dashed #cbd5e1;">' +
               '<strong style="font-size:13px;">' + chapter + " \u098f\u09b0 \u099f\u09aa\u09bf\u0995:" + "</strong><br>";
    topics.forEach(function (tp) {
      html += '<label class="sq-check small"><input type="checkbox" checked><span></span> ' + tp + "</label>";
    });
    topicBox.innerHTML += html + "</div>";
  } else {
    var el = document.getElementById("tp-" + safeId);
    if (el) el.remove();
  }
}
// ==================== [৪] ড্রপডাউন লোড ফাংশন শেষ ====================


// ==================== [৫] রিয়েল-টাইম সিঙ্ক (প্রিভিউ আপডেট) শুরু ====================
function sync() {
  var instName = document.getElementById("instName");
  var instAddr = document.getElementById("instAddr");
  var classSel = document.getElementById("classSelect");
  var subSel   = document.getElementById("subjectSelect");
  var examTime = document.getElementById("examTime");
  var ansSheet = document.getElementById("ansSheet");
  var ansPage  = document.getElementById("ansPage");

  var noName = currentLang === "bn" ? "\u09aa\u09cd\u09b0\u09a4\u09bf\u09b7\u09cd\u09a0\u09be\u09a8\u09c7\u09b0 \u09a8\u09be\u09ae" : "Institution Name";
  var noAddr = currentLang === "bn" ? "\u09a0\u09bf\u0995\u09be\u09a8\u09be \u098f\u0996\u09be\u09a8\u09c7 \u0986\u09b8\u09ac\u09c7" : "Address will appear here";
  var minTxt = currentLang === "bn" ? " \u09ae\u09bf\u09a8\u09bf\u099f" : " min";

  if (document.getElementById("v-name"))  document.getElementById("v-name").innerText  = (instName && instName.value) ? instName.value : noName;
  if (document.getElementById("v-addr"))  document.getElementById("v-addr").innerText  = (instAddr && instAddr.value) ? instAddr.value : noAddr;
  if (document.getElementById("v-class")) document.getElementById("v-class").innerText = classSel ? classSel.value : "";
  if (document.getElementById("v-sub"))   document.getElementById("v-sub").innerText   = subSel   ? subSel.value   : "";
  if (document.getElementById("v-time"))  document.getElementById("v-time").innerText  = (examTime ? examTime.value : "40") + minTxt;

  if (ansSheet && ansPage) {
    ansPage.style.display = ansSheet.checked ? "block" : "none";
  }
}
// ==================== [৫] রিয়েল-টাইম সিঙ্ক শেষ ====================


// ==================== [৬] সেকশন নেভিগেশন শুরু ====================
function showSection(section) {
  var builder  = document.getElementById("mainBuilder");
  var library  = document.getElementById("mainLibrary");
  var navItems = document.querySelectorAll(".nav-item");

  // সব সেকশন লুকাও, সব active সরাও
  if (builder) builder.style.display = "none";
  if (library) library.style.display = "none";
  navItems.forEach(function (n) { n.classList.remove("active"); });

  if (section === "builder") {
    if (builder) builder.style.display = "flex";
    var dash = document.getElementById("sb-dashboard");
    if (dash) dash.classList.add("active");
  } else if (section === "library") {
    if (library) library.style.display = "flex";
    var lib = document.getElementById("sb-library");
    if (lib) lib.classList.add("active");
    renderLibrary();
  }
}

function newQuestion() {
  // ফর্ম পরিষ্কার করে নতুন শুরু
  showSection("builder");
  var sbNew  = document.getElementById("sb-new");
  var sbDash = document.getElementById("sb-dashboard");
  if (sbNew)  sbNew.classList.add("active");
  if (sbDash) sbDash.classList.remove("active");

  // ইনপুট মুছে দাও
  ["instName","instAddr","regCode","estYear"].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.value = "";
  });
  var examTime = document.getElementById("examTime");
  if (examTime) examTime.value = "40";

  // প্রিভিউ রিসেট করো
  var qContent = document.getElementById("qContent");
  var aContent = document.getElementById("aContent");
  var emptyTxt = currentLang === "bn"
    ? "\u09a4\u09a5\u09cd\u09af \u09aa\u09c2\u09b0\u09a3 \u0995\u09b0\u09c7 \u099c\u09c7\u09a8\u09be\u09b0\u09c7\u099f \u09ac\u09be\u099f\u09a8\u09c7 \u0995\u09cd\u09b2\u09bf\u0995 \u0995\u09b0\u09c1\u09a8..."
    : "Fill in the form and click Generate...";
  if (qContent) qContent.innerHTML = '<div class="empty-msg"><i class="fa-solid fa-arrow-left-long"></i><span>' + emptyTxt + "</span></div>";
  if (aContent) aContent.innerHTML = "";
  sync();
}
// ==================== [৬] সেকশন নেভিগেশন শেষ ====================


// ==================== [৭] প্রশ্নপত্র জেনারেট লজিক শুরু ====================
function generate() {
  sync();
  var checks = document.querySelectorAll(".q-check:checked");
  if (checks.length === 0) {
    alert(currentLang === "bn"
      ? "\u09a6\u09af\u09bc\u09be \u0995\u09b0\u09c7 \u0985\u09a8\u09cd\u09a4\u09a4 \u098f\u0995\u099f\u09bf \u09aa\u09cd\u09b0\u09b6\u09cd\u09a8\u09c7\u09b0 \u09a7\u09b0\u09a8 \u09b8\u09bf\u09b2\u09c7\u0995\u09cd\u099f \u0995\u09b0\u09c1\u09a8!"
      : "Please select at least one question type!");
    return;
  }

  // ansSheet ও ansExpl আলাদাভাবে পড়া
  var ansSheetEl = document.getElementById("ansSheet");
  var ansExplEl  = document.getElementById("ansExpl");
  var showAns    = ansSheetEl && ansSheetEl.checked;
  var showExpl   = ansExplEl  && ansExplEl.checked;

  var qHtml = "";
  var aHtml = "";
  var total = 0;

  checks.forEach(function (c, idx) {
    var row   = c.closest(".q-item-styled");
    var count = parseInt(row.querySelector(".q-count").value, 10);
    var mark  = parseInt(row.querySelector(".q-mark").value,  10);
    var type  = c.parentElement.innerText.trim();

    total += count * mark;
    var markLabel = currentLang === "bn" ? "\u09ae\u09be\u09a8: " + mark : "Mark: " + mark;

    // প্রশ্নের অংশ
    qHtml += "<div style='margin-top:20px;'><strong>" + (idx + 1) + ". " + type + " (" + markLabel + ")</strong><ol style='margin-left:30px;margin-top:10px;'>";

    for (var i = 1; i <= count; i++) {
      // নমুনা প্রশ্ন
      var qLabel = currentLang === "bn"
        ? "\u098f\u0996\u09be\u09a8\u09c7 " + type + "-\u098f\u09b0 " + i + " \u09a8\u0982 \u09a8\u09ae\u09c1\u09a8\u09be \u09aa\u09cd\u09b0\u09b6\u09cd\u09a8\u099f\u09bf \u09aa\u09cd\u09b0\u09a6\u09b0\u09cd\u09b6\u09bf\u09a4 \u09b9\u09ac\u09c7\u0964"
        : "Sample question " + i + " for " + type + " will appear here.";
      qHtml += "<li style='margin-bottom:8px;'>" + qLabel + "</li>";

      // উত্তরপত্রের অংশ — ansSheet চেক থাকলেই তৈরি হবে
      if (showAns) {
        var ansLabel = currentLang === "bn"
          ? "\u09a8\u09ae\u09c1\u09a8\u09be \u0989\u09a4\u09cd\u09a4\u09b0: " + type + "-\u098f\u09b0 " + i + " \u09a8\u0982 \u09aa\u09cd\u09b0\u09b6\u09cd\u09a8\u09c7\u09b0 \u09b8\u09a0\u09bf\u0995 \u0989\u09a4\u09cd\u09a4\u09b0 \u098f\u0996\u09be\u09a8\u09c7 \u09a5\u09be\u0995\u09ac\u09c7\u0964"
          : "Sample Answer: The correct answer for " + type + " Q" + i + " will be here.";

        // AI ব্যাখ্যা — ansExpl চেক থাকলেই যোগ হবে
        var aiPart = "";
        if (showExpl) {
          var aiLabel = currentLang === "bn"
            ? "AI \u09ac\u09cd\u09af\u09be\u0996\u09cd\u09af\u09be: \u098f\u0987 \u0989\u09a4\u09cd\u09a4\u09b0\u099f\u09bf \u09b8\u09a0\u09bf\u0995 \u0995\u09be\u09b0\u09a3 \u098f\u099f\u09bf \u09aa\u09be\u09a0\u09cd\u09af\u09ac\u0987\u09af\u09bc\u09c7\u09b0 \u09ae\u09c2\u09b2 \u09a7\u09be\u09b0\u09a3\u09be\u09b0 \u09b8\u09be\u09a5\u09c7 \u09b8\u09ae\u09cd\u09aa\u09c2\u09b0\u09cd\u09a3 \u09b8\u09be\u09ae\u099e\u09cd\u099c\u09b8\u09cd\u09af\u09aa\u09c2\u09b0\u09cd\u09a3\u0964"
            : "AI Explanation: This answer is correct as it aligns with the core concept from the textbook.";
          aiPart = "<div style='margin-top:6px;padding:8px 12px;background:#f0fdf4;border-radius:6px;border-left:3px solid #22c55e;'>" +
                   "<small style='color:#15803d;font-weight:600;'>\u2728 " + aiLabel + "</small>" +
                   "</div>";
        }

        aHtml += "<div style='margin-bottom:16px;border-left:4px solid var(--primary);padding-left:15px;padding-top:4px;'>" +
                 "<b>" + type + " " + i + ":</b> " + ansLabel +
                 aiPart +
                 "</div>";
      }
    }
    qHtml += "</ol></div>";
  });

  var qContent = document.getElementById("qContent");
  var aContent = document.getElementById("aContent");
  var vTotal   = document.getElementById("v-total");
  if (qContent) qContent.innerHTML = qHtml;
  if (aContent) aContent.innerHTML = aHtml;
  if (vTotal)   vTotal.innerText   = total;

  // উত্তরপত্র পেজ দেখানো বা লুকানো
  var ansPage = document.getElementById("ansPage");
  if (ansPage) ansPage.style.display = showAns ? "block" : "none";
}
// ==================== [৮] এক্সপোর্ট ড্রপডাউন শুরু ====================
function toggleExportMenu() {
  var menu = document.getElementById("exportMenu");
  if (!menu) return;
  menu.style.display = (menu.style.display === "none" || menu.style.display === "") ? "block" : "none";
}
// ==================== [৮] এক্সপোর্ট ড্রপডাউন শেষ ====================


// ==================== [৯] লাইব্রেরি (LocalStorage) শুরু ====================
var STORAGE_KEY = "qpArchitectLibrary";

function saveToLibrary() {
  var name     = (document.getElementById("instName")      || {}).value || "";
  var cls      = (document.getElementById("classSelect")   || {}).value || "";
  var sub      = (document.getElementById("subjectSelect") || {}).value || "";
  var time     = (document.getElementById("examTime")      || {}).value || "40";
  var qContent = document.getElementById("qContent");
  var aContent = document.getElementById("aContent");
  var qHtml    = qContent ? qContent.innerHTML : "";
  var aHtml    = aContent ? aContent.innerHTML : "";

  // জেনারেট না হলে সেভ করা যাবে না
  if (!qHtml || qHtml.indexOf("empty-msg") !== -1) {
    alert(currentLang === "bn"
      ? "\u09aa\u09cd\u09b0\u09a5\u09ae\u09c7 \u09aa\u09cd\u09b0\u09b6\u09cd\u09a8\u09aa\u09a4\u09cd\u09b0 \u099c\u09c7\u09a8\u09be\u09b0\u09c7\u099f \u0995\u09b0\u09c1\u09a8!"
      : "Please generate a question paper first!");
    return;
  }

  var library = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  var entry = {
    id:       Date.now(),
    title:    cls + " - " + sub,
    inst:     name.trim() || (currentLang === "bn" ? "\u0985\u099c\u09be\u09a8\u09be \u09aa\u09cd\u09b0\u09a4\u09bf\u09b7\u09cd\u09a0\u09be\u09a8" : "Unknown Institution"),
    cls:      cls,
    sub:      sub,
    time:     time,
    date:     new Date().toLocaleDateString("bn-BD"),
    qContent: qHtml,
    aContent: aHtml,
  };

  library.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  alert(currentLang === "bn"
    ? "\u09aa\u09cd\u09b0\u09b6\u09cd\u09a8\u09aa\u09a4\u09cd\u09b0 \u09b2\u09be\u0987\u09ac\u09cd\u09b0\u09c7\u09b0\u09bf\u09a4\u09c7 \u09b8\u09c7\u09ad \u09b9\u09af\u09bc\u09c7\u099b\u09c7!"
    : "Question paper saved to library!");
  var menu = document.getElementById("exportMenu");
  if (menu) menu.style.display = "none";
}

function renderLibrary() {
  var grid    = document.getElementById("libraryGrid");
  if (!grid) return;
  var library = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  var noSaved = currentLang === "bn"
    ? "\u0995\u09cb\u09a8\u09cb \u09b8\u09c7\u09ad \u0995\u09b0\u09be \u09aa\u09cd\u09b0\u09b6\u09cd\u09a8\u09aa\u09a4\u09cd\u09b0 \u09a8\u09c7\u0987"
    : "No saved question papers";
  var noSavedSub = currentLang === "bn"
    ? "\u09aa\u09cd\u09b0\u09b6\u09cd\u09a8\u09aa\u09a4\u09cd\u09b0 \u09a4\u09c8\u09b0\u09bf \u0995\u09b0\u09c1\u09a8 \u098f\u09ac\u0982 \u09b2\u09be\u0987\u09ac\u09cd\u09b0\u09c7\u09b0\u09bf\u09a4\u09c7 \u09b8\u09c7\u09ad \u0995\u09b0\u09c1\u09a8\u0964"
    : "Create a question paper and save it to your library.";

  if (library.length === 0) {
    grid.innerHTML =
      '<div class="empty-library">' +
        '<i class="fa-solid fa-folder-open"></i>' +
        "<h3>" + noSaved + "</h3>" +
        "<p>" + noSavedSub + "</p>" +
      "</div>";
    return;
  }

  var loadTxt   = currentLang === "bn" ? "\u09b2\u09cb\u09a1" : "Load";
  var printTxt  = currentLang === "bn" ? "\u09aa\u09cd\u09b0\u09bf\u09a8\u09cd\u099f" : "Print";
  var deleteTxt = currentLang === "bn" ? "\u09ae\u09c1\u099b\u09c1\u09a8" : "Delete";
  var minTxt    = currentLang === "bn" ? " \u09ae\u09bf\u09a8\u09bf\u099f" : " min";

  grid.innerHTML = library.map(function (item) {
    return (
      '<div class="lib-card">' +
        '<div class="lib-card-icon"><i class="fa-solid fa-file-lines"></i></div>' +
        "<h3>" + item.title + "</h3>" +
        "<p>" + item.inst + " &bull; " + item.date + "</p>" +
        '<div class="lib-card-meta">' +
          '<span class="lib-badge">' + item.cls + "</span>" +
          '<span class="lib-badge green">' + item.sub + "</span>" +
          '<span class="lib-badge">' + item.time + minTxt + "</span>" +
        "</div>" +
        '<div class="lib-card-actions">' +
          '<button class="lib-btn" onclick="loadFromLibrary(' + item.id + ')"><i class="fa-solid fa-rotate-left"></i> ' + loadTxt + "</button>" +
          '<button class="lib-btn" onclick="printFromLibrary(' + item.id + ')"><i class="fa-solid fa-print"></i> ' + printTxt + "</button>" +
          '<button class="lib-btn danger" onclick="deleteFromLibrary(' + item.id + ')"><i class="fa-solid fa-trash"></i> ' + deleteTxt + "</button>" +
        "</div>" +
      "</div>"
    );
  }).join("");
}

function loadFromLibrary(id) {
  var library = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  var item    = library.find(function (i) { return i.id === id; });
  if (!item) return;
  var instName = document.getElementById("instName");
  var examTime = document.getElementById("examTime");
  var qContent = document.getElementById("qContent");
  var aContent = document.getElementById("aContent");
  var ansPage  = document.getElementById("ansPage");
  if (instName) instName.value   = item.inst;
  if (examTime) examTime.value   = item.time;
  if (qContent) qContent.innerHTML = item.qContent;
  if (aContent) aContent.innerHTML = item.aContent;
  if (ansPage)  ansPage.style.display = item.aContent ? "block" : "none";
  showSection("builder");
}

function printFromLibrary(id) {
  loadFromLibrary(id);
  setTimeout(function () { window.print(); }, 400);
}

function deleteFromLibrary(id) {
  var msg = currentLang === "bn"
    ? "\u098f\u0987 \u09aa\u09cd\u09b0\u09b6\u09cd\u09a8\u09aa\u09a4\u09cd\u09b0\u099f\u09bf \u09ae\u09c1\u099b\u09c7 \u09a6\u09c7\u09ac\u09c7\u09a8?"
    : "Delete this question paper?";
  if (!confirm(msg)) return;
  var library = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  var updated = library.filter(function (i) { return i.id !== id; });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  renderLibrary();
}
// ==================== [৯] লাইব্রেরি শেষ ====================


// ==================== [১০] ভাষা টগল ফাংশন শুরু ====================
function translateUI() {
  var t = uiTranslations[currentLang];
  Object.keys(t).forEach(function (id) {
    if (t[id] === null) return;
    var el = document.getElementById(id);
    if (el) el.innerText = t[id];
  });

  // Placeholder আপডেট
  var placeholders = {
    instName: currentLang === "bn" ? "\u09a8\u09be\u09ae \u09b2\u09bf\u0996\u09c1\u09a8..." : "Enter name...",
    instAddr: currentLang === "bn" ? "\u09a0\u09bf\u0995\u09be\u09a8\u09be \u09b2\u09bf\u0996\u09c1\u09a8..." : "Enter address...",
    regCode:  currentLang === "bn" ? "\u0995\u09cb\u09a1 \u09b2\u09bf\u0996\u09c1\u09a8..." : "Enter code...",
    estYear:  currentLang === "bn" ? "\u09b8\u09be\u09b2 \u09b2\u09bf\u0996\u09c1\u09a8..." : "Enter year...",
  };
  Object.keys(placeholders).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.placeholder = placeholders[id];
  });

  // লাইব্রেরি পুনরায় রেন্ডার করো
  renderLibrary();
  sync();
}

function toggleLanguage() {
  currentLang = currentLang === "bn" ? "en" : "bn";
  var btn  = document.getElementById("langToggleBtn");
  var span = btn ? btn.querySelector("span") : null;
  if (span) span.innerText = currentLang === "bn" ? "English" : "\u09ac\u09be\u0982\u09b2\u09be";
  translateUI();
}
// ==================== [১০] ভাষা টগল শেষ ====================
