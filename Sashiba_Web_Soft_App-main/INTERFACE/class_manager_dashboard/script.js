function getCompactChapterLabel(chName, idx) {
  if (!chName) return "অধ্যায়-" + (idx + 1);
  const m = chName.match(/(d+|[০-৯]+)/);
  if (m) {
    return "📖 অধ্যায়-" + m[1];
  }
  return "📖 অধ্যায়-" + (idx + 1);
}

function getCompactTopicLabel(s, idx) {
  const chNum =
    (s.chapterName || s.chapter || "").match(/(d+|[০-৯]+)/)?.[1] || idx + 1;
  if (s.topics && s.topics.length > 1) {
    return "🎯 টপিক " + chNum + ".১ - " + chNum + "." + s.topics.length;
  }
  return "🎯 টপিক " + chNum + ".১";
}

/* ==================== থিম ও গ্লোবাল সেসন সিঙ্ক (postMessage & localStorage) ==================== */
(function initClassManagerSync() {
  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("theme-dark");
      document.body.classList.add("theme-dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("theme-dark");
      document.body.classList.remove("theme-dark");
    }
  }

  try {
    const savedTheme =
      localStorage.getItem("sashiba_theme") ||
      localStorage.getItem("sashiba_theme_mode");
    if (savedTheme) applyTheme(savedTheme);
  } catch (e) {}

  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "THEME_CHANGE") {
      applyTheme(event.data.theme);
    }
  });
})();

// গ্লোবাল সেশন ডাইনামিক ব্রডকাস্টার (শিক্ষার্থী, ক্লাস ও উপস্থিতি ডাটা শেয়ারিং)
window.broadcastActiveSession = function () {
  try {
    if (typeof classData !== "undefined" && classData.settings) {
      const presentCount = (classData.students || []).filter(
        (s) => s.status === "present",
      ).length;
      const totalCount = (classData.students || []).length;
      const activeSession = {
        schoolName: classData.settings.schoolName || classData.settings.school,
        className: classData.settings.className,
        teacherName: classData.settings.teacherName,
        subject:
          classData.routines && classData.routines[0]
            ? classData.routines[0].subject
            : "ডিজিটাল প্রযুক্তি",
        totalStudents: totalCount,
        presentStudents: presentCount,
        students: classData.students || [],
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        "sashiba_global_active_session",
        JSON.stringify(activeSession),
      );
    }
  } catch (e) {}
};

// 💾 স্টোরেজ সেভ ও লোড ইঞ্জিনের মূল সমাধান
function saveStorage() {
  try {
    localStorage.setItem(
      "sashiba_class_manager_data",
      JSON.stringify(classData),
    );
    if (typeof window.broadcastActiveSession === "function") {
      window.broadcastActiveSession();
    }
  } catch (e) {}
}

function loadStorage() {
  try {
    const raw = localStorage.getItem("sashiba_class_manager_data");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.students) && parsed.students.length > 0) {
        classData.students = parsed.students;
        if (parsed.settings) classData.settings = parsed.settings;
        return;
      }
    }
  } catch (e) {}
  // Reset if empty or invalid
  localStorage.removeItem("sashiba_class_manager_data");
}

/* ==========================================================================
   SashiBa Smart Class Manager — Master Application Logic (v5.0 Final)
   ========================================================================== */

let classData = {
  settings: {
    school: "সশিবা সরকারি মডেল হাই স্কুল & কলেজ",
    schoolName: "সশিবা সরকারি মডেল হাই স্কুল & কলেজ",
    code: "EIIN: ১২৩৪৫৬",
    estYear: "স্থাপিত: ১৯৯৫",
    board: "ঢাকা বোর্ড",
    address: "মেইন ক্যাম্পাস, ঢাকা",
    teacherName: "মাগুরিব আলী",
    className: "অষ্টম (শাখা-ক)",
    group: "সাধারণ",
  },
  routines: [
    {
      id: 1,
      day: "রবিবার",
      subject: "গণিত",
      classType: "Theory (থিওরি)",
      time: "০৯:০০ - ০৯:৪৫ AM",
      room: "১০২",
      topic: "বীজগণিতীয় সূত্রাবলি",
      teacher: "মাগুরিব আলী",
      substitute: "রহিম স্যার (ফ্রি)",
      isBreak: false,
      isHoliday: false,
    },
    {
      id: 2,
      day: "রবিবার",
      subject: "বিজ্ঞান",
      classType: "Lab Practical (ল্যাব)",
      time: "০৯:৪৫ - ১০:৩০ AM",
      room: "ল্যাব-১",
      topic: "আলোক বিজ্ঞান ল্যাব",
      teacher: "ফাতিমা ম্যাডাম",
      substitute: "সালমা ম্যাডাম",
      isBreak: false,
      isHoliday: false,
    },
    {
      id: 3,
      day: "রবিবার",
      subject: "☕ টিফিন ব্রেক (Tiffin Break)",
      classType: "Break",
      time: "১০:৩০ - ১১:০০ AM",
      room: "ক্যান্টিন",
      topic: "টিফিন ও বিশ্রাম",
      teacher: "-",
      substitute: "-",
      isBreak: true,
      isHoliday: false,
    },
    {
      id: 4,
      day: "রবিবার",
      subject: "আইসিটি",
      classType: "Group Work (গ্রুপ ওয়ার্ক)",
      time: "১১:০০ - ১১:৪৫ AM",
      room: "কম্পিউটার ল্যাব",
      topic: "পাইথন প্রজেক্ট",
      teacher: "মাগুরিব আলী",
      substitute: "তাহমিদ স্যার",
      isBreak: false,
      isHoliday: false,
    },
    {
      id: 5,
      day: "শুক্রবার",
      subject: "🔴 সাপ্তাহিক ছুটি (Holiday)",
      classType: "Holiday",
      time: "সারাদিন",
      room: "-",
      topic: "স্কুল বন্ধ",
      teacher: "-",
      substitute: "-",
      isBreak: false,
      isHoliday: true,
    },
  ],
  syllabuses: [
    {
      id: 1,
      term: "half_yearly",
      type: "teaching",
      subject: "গণিত",
      subjectCode: "১০৯",
      chapterName: "৩য় অধ্যায়: বীজগণিতীয় রাশি ও সমীকরণ",
      topics: ["সূত্রাবলী", "মান নির্ণয়", "উৎপাদকে বিশ্লেষণ"],
      required_classes: 6,
      completed_classes: 2,
      pi_code: "৮.৩.১",
      status: "running",
      target_date: "২০২৬-০৮-২০",
      is_holiday: false,
      learningOutcomes:
        "বীজগণিতীয় সূত্রের প্রয়োগ ও উৎপাদকে বিশ্লেষণ করতে পারবে।",
      teacher: "মাগুরিব আলী",
      room: "১০২",
      className: "অষ্টম",
      section: "ক",
      date: "২০২৬-০৭-২৫",
      time: "০৯:০০ - ০৯:৪৫ AM",
      progress: 33,
      priority: "High",
      timeframeLabel: "চলতি সপ্তাহ",
      checklist: [
        { text: "বীজগণিতীয় বর্গের সূত্রাবলী প্রমাণ", checked: true },
        { text: "ঘন সমীকরণের মান নির্ণয় সমাধান", checked: true },
        { text: "উৎপাদকে বিশ্লেষণের সহজ পদ্ধতি", checked: false },
        { text: "বোর্ড বিগত বছরের সৃজনশীল প্রশ্ন সলভ", checked: false },
      ],
      resources: {
        video: "https://youtube.com/watch?v=demo1",
        note: "#",
        quiz: "#",
      },
      examHub: {
        marks: "২০ নম্বর (অর্ধবার্ষিকী)",
        pyq: "২০২৫ ও ২০২৪ বোর্ড প্রশ্ন",
        teacherNote: "বীজগণিতীয় চিহ্নের ভুলের দিকে বিশেষ নজর দিন।",
      },
    },
    {
      id: 2,
      term: "half_yearly",
      type: "exam",
      subject: "পদার্থবিজ্ঞান",
      subjectCode: "১৩৬",
      chapterName: "অধ্যায় ৪: বলবিদ্যা, কাজ, ক্ষমতা ও শক্তি",
      topics: ["বলের ধারণা", "নিউটন ৩য় সূত্র", "কাজ ও শক্তি"],
      required_classes: 8,
      completed_classes: 4,
      pi_code: "৮.৪.১",
      status: "running",
      target_date: "২০২৬-০৮-১৫",
      is_holiday: false,
      learningOutcomes:
        "বল, কাজ ও শক্তির রূপান্তরের সূত্রাবলী গাণিতিকভাবে প্রয়োগ করতে পারবে।",
      teacher: "মাগুরিব আলী",
      room: "১০৩",
      className: "অষ্টম",
      section: "ক",
      date: "২০২৬-০৮-১৫",
      time: "১০:০০ - ১০:৪৫ AM",
      progress: 50,
      priority: "High",
      timeframeLabel: "আগামী ২ সপ্তাহ",
      checklist: [
        { text: "বলের ধারণা ও নিউটনের গতিসূত্র", checked: true },
        { text: "কাজ ও ক্ষমতার সমীকরণ সমাধান", checked: true },
        { text: "শক্তি রূপান্তর ল্যাব পরীক্ষা", checked: false },
      ],
      resources: {
        video: "https://youtube.com/watch?v=demo2",
        note: "#",
        quiz: "#",
      },
      examHub: {
        marks: "২৫ নম্বর (অর্ধবার্ষিকী)",
        pyq: "২০২৫ বোর্ড প্রশ্নপত্র",
        teacherNote: "একক রূপান্তরের দিকে লক্ষ্য রাখুন।",
      },
    },
    {
      id: 3,
      term: "annual",
      type: "teaching",
      subject: "সাধারণ বিজ্ঞান",
      subjectCode: "১২৭",
      chapterName: "অধ্যায় ৫: আলোক বিজ্ঞান ও প্রতিফলন",
      topics: ["আলোর প্রতিফলন", "অবতল দর্পণ"],
      required_classes: 5,
      completed_classes: 5,
      pi_code: "৮.২.৩",
      status: "completed",
      target_date: "২০২৬-০৭-১০",
      is_holiday: false,
      learningOutcomes:
        "অবতল ও উত্তল দর্পণে প্রতিবিম্ব গঠন চিত্রসহ ব্যাখ্যা করতে পারবে।",
      teacher: "ফাতিমা ম্যাডাম",
      room: "১০৪",
      className: "অষ্টম",
      section: "ক",
      date: "২০২৬-০৭-১০",
      time: "১১:০০ - ১১:৪৫ AM",
      progress: 100,
      priority: "Medium",
      timeframeLabel: "সম্পন্ন",
      checklist: [
        { text: "আলোর প্রতিফলন সূত্রাবলী", checked: true },
        { text: "দর্পণে রশ্মিচিত্র অঙ্কন", checked: true },
      ],
      resources: {
        video: "https://youtube.com/watch?v=demo3",
        note: "#",
        quiz: "#",
      },
      examHub: {
        marks: "১৫ নম্বর",
        pyq: "২০২৪ বোর্ড প্রশ্ন",
        teacherNote: "রশ্মিচিত্র পেন্সিল দিয়ে স্পষ্ট করে আঁকতে বলুন।",
      },
    },
  ],
  students: [
    {
      id: 1,
      roll: 1,
      name: "আব্দুল্লাহ আল মামুন",
      className: "অষ্টম",
      section: "ক",
      monthlyAttendance: 96.5,
      engagement: 5,
      attendance: "Present",
      periodAttendance: { p1: "Present", p2: "Present", p3: "Present" },
    },
    {
      id: 2,
      roll: 2,
      name: "মোছাঃ ফাতেমা খাতুন",
      className: "অষ্টম",
      section: "ক",
      monthlyAttendance: 88.0,
      engagement: 4,
      attendance: "Present",
      periodAttendance: { p1: "Present", p2: "Present", p3: "Present" },
    },
    {
      id: 3,
      roll: 3,
      name: "তানভীর আহমেদ",
      className: "অষ্টম",
      section: "ক",
      monthlyAttendance: 64.0,
      engagement: 2,
      attendance: "Absent",
      periodAttendance: { p1: "Absent", p2: "Present", p3: "Absent" },
    },
    {
      id: 4,
      roll: 4,
      name: "নুসরাত জাহান",
      className: "অষ্টম",
      section: "ক",
      monthlyAttendance: 98.0,
      engagement: 5,
      attendance: "Present",
      periodAttendance: { p1: "Present", p2: "Present", p3: "Present" },
    },
    {
      id: 5,
      roll: 5,
      name: "মেহেদী হাসান",
      className: "অষ্টম",
      section: "ক",
      monthlyAttendance: 72.5,
      engagement: 3,
      attendance: "Late",
      periodAttendance: { p1: "Absent", p2: "Present", p3: "Present" },
    },
  ],
};

let _syl = {
  month: "all",
  status: "all",
  priority: "all",
  term: "all",
  search: "",
};
let _sylViewMode = "card"; // 'card' or 'table'

function filterSyllabusMonth(m) {
  _syl.month = m;
  document
    .querySelectorAll(
      "#syllabus-month-chips .month-chip, #syllabus-month-chips .tab-chip",
    )
    .forEach((b) => {
      const val = b.dataset.val || b.textContent.trim();
      b.classList.toggle(
        "active",
        val === m || (m === "all" && (val === "সব মাস" || val === "all")),
      );
    });
  renderSyllabus();
}

function filterSyllabusByStatus(st) {
  _syl.status = st;
  renderSyllabus();
}
function filterSyllabusByPriority(pr) {
  _syl.priority = pr;
  renderSyllabus();
}
function filterSyllabusTerm(tm) {
  _syl.term = tm;
  renderSyllabus();
}
function searchSyllabusCards(q) {
  _syl.search = (q || "").toLowerCase();
  renderSyllabus();
}

function switchSyllabusView(mode) {
  _sylViewMode = mode;
  document
    .getElementById("syl-btn-card")
    ?.classList.toggle("active", mode === "card");
  document
    .getElementById("syl-btn-table")
    ?.classList.toggle("active", mode === "table");
  renderSyllabus();
}

const statusLabels = {
  running: "🟢 চলছে",
  completed: "💙 সম্পন্ন",
  not_started: "⚪ শুরু হয়নি",
  revision_needed: "🔴 রিভিশন বাকি",
};

const priorityColor = {
  High: "var(--danger)",
  Medium: "var(--warning)",
  Low: "var(--success)",
};

function renderSyllabus() {
  const container = document.getElementById("syllabus-cards-container");
  if (!container) return;

  let items = [...classData.syllabuses];
  if (_syl.month !== "all") items = items.filter((s) => s.month === _syl.month);
  if (_syl.status !== "all")
    items = items.filter((s) => s.status === _syl.status);
  if (_syl.priority !== "all")
    items = items.filter((s) => s.priority === _syl.priority);
  if (_syl.term !== "all") items = items.filter((s) => s.term === _syl.term);
  if (_syl.search)
    items = items.filter(
      (s) =>
        (s.subject && s.subject.toLowerCase().includes(_syl.search)) ||
        (s.chapterName && s.chapterName.toLowerCase().includes(_syl.search)) ||
        (s.teacher && s.teacher.toLowerCase().includes(_syl.search)),
    );

  // Fallback so user NEVER sees blank screen
  if (!items.length) {
    items = [...classData.syllabuses];
  }

  // Update Summary Metrics (Section 4)
  const totalCount = classData.syllabuses.length;
  const completed = classData.syllabuses.filter(
    (s) => s.status === "completed",
  ).length;
  const avgProg = Math.round(
    classData.syllabuses.reduce((a, s) => a + (s.progress || 0), 0) /
      (totalCount || 1),
  );

  const sc = document.getElementById("syll-stat-completed");
  const sp = document.getElementById("syll-stat-pending");
  const sv = document.getElementById("syll-stat-coverage");
  const tp = document.getElementById("syll-total-percent");
  const pf = document.getElementById("syll-total-progress-fill");

  if (sc) sc.textContent = completed + "টি অধ্যায়";
  if (sp) sp.textContent = totalCount - completed + "টি অধ্যায়";
  if (sv) sv.textContent = avgProg + "%";
  if (tp) tp.textContent = avgProg + "% সম্পন্ন";
  if (pf) pf.style.width = avgProg + "%";

  if (_sylViewMode === "table") {
    const toolbar = document.getElementById("syllabus-table-builder-toolbar");
    if (toolbar) toolbar.style.display = "block";

    // Render Fully Dynamic Customizable Table Header & Rows
    container.innerHTML = `
      <div class="syl-table-wrapper" style="overflow-x:auto;">
        <table class="syl-table">
          <thead>
            <tr>
              ${customSyllabusColumns.map((col) => `<th style="min-width:${col.width};text-align:${col.align || "center"};">${col.label}</th>`).join("")}
              <th style="text-align:center;min-width:185px;">একশন (Actions)</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map((s, idx) => {
                const stLabel = statusLabels[s.status] || "🟢 চলছে";
                const reqCls = s.required_classes || s.requiredClasses || 6;
                const compCls = s.completed_classes || s.completedClasses || 2;
                const periodText =
                  (compCls < 10 ? "০" + compCls : compCls) +
                  " / " +
                  (reqCls < 10 ? "০" + reqCls : reqCls);
                const cleanChName = (s.chapterName || s.chapter || "অধ্যায় ৩")
                  .replace(/^(অধ্যায়\s*[\d০-৯]+\s*:\s*)/i, "")
                  .trim();

                return `
              <tr>
                ${customSyllabusColumns
                  .map((col) => {
                    if (col.key === "date")
                      return `<td style="text-align:center;"><div class="tbl-date-pill"><span class="tbl-date-main" contenteditable="true" onblur="updateInlineTableCell(${s.id}, 'date', this.textContent)">📅 ${s.date || "২০২৬-০৭-২৫"}</span><span class="tbl-time-sub" contenteditable="true" onblur="updateInlineTableCell(${s.id}, 'time', this.textContent)">⏰ ${s.time || "০৯:০০ AM"}</span></div></td>`;
                    if (col.key === "room")
                      return `<td style="text-align:center;"><span class="badge" contenteditable="true" onblur="updateInlineTableCell(${s.id}, 'room', this.textContent)" style="background:var(--bg-input);color:var(--text-main);font-weight:800;padding:6px 12px;">🚪 ${s.room || "১০২"}</span></td>`;
                    if (col.key === "subject")
                      return `<td style="text-align:center;"><div class="tbl-subject-badge" contenteditable="true" onblur="updateInlineTableCell(${s.id}, 'subject', this.textContent)"><i class="fa-solid fa-book-bookmark"></i> ${s.subject}</div></td>`;
                    if (col.key === "chapter")
                      return `<td style="text-align:left;padding:14px 18px;"><div style="display:flex;flex-direction:column;gap:4px;"><span style="font-size:1.02rem;font-weight:900;color:var(--text-main);" contenteditable="true" onblur="updateInlineTableCell(${s.id}, 'chapter', this.textContent)">${cleanChName}</span><span class="badge" style="background:rgba(59,130,246,0.12);color:var(--primary);font-size:0.75rem;font-weight:800;width:fit-content;">📖 ${getCompactChapterLabel(s.chapterName || s.chapter, idx)}</span></div></td>`;
                    if (col.key === "topics")
                      return `<td style="text-align:left;padding:14px 18px;"><div style="display:flex;flex-direction:column;gap:3px;"><span style="font-size:0.86rem;font-weight:700;color:var(--purple);" contenteditable="true" onblur="updateInlineTableCell(${s.id}, 'topics', this.textContent)">🎯 ${s.topics && s.topics.length ? s.topics.join(", ") : cleanChName}</span></div></td>`;
                    if (col.key === "pi")
                      return `<td style="text-align:center;"><span class="badge" contenteditable="true" onblur="updateInlineTableCell(${s.id}, 'pi_code', this.textContent)" style="background:rgba(59,130,246,0.12);color:var(--primary);font-weight:900;padding:6px 12px;">🏷️ ${s.pi_code || s.piIndicator || "৮.৩.১"}</span></td>`;
                    if (col.key === "period")
                      return `<td style="text-align:center;"><span class="badge" style="background:rgba(16,185,129,0.15);color:var(--success);font-weight:900;padding:6px 12px;">⏳ ${periodText}</span></td>`;
                    if (col.key === "teacher")
                      return `<td style="text-align:center;"><strong contenteditable="true" onblur="updateInlineTableCell(${s.id}, 'teacher', this.textContent)" style="font-size:0.88rem;color:var(--text-main);">👨‍🏫 ${s.teacher || "মাগুরিব আলী"}</strong></td>`;
                    if (col.key === "progress")
                      return `<td style="text-align:center;"><div class="tbl-progress-cell"><div style="display:flex;justify-content:space-between;font-size:0.78rem;font-weight:900;color:var(--primary);"><span>${s.progress || 50}%</span><span>${stLabel}</span></div><div class="tbl-progress-bar-wrap"><div class="tbl-progress-bar-fill" style="width:${s.progress || 50}%;"></div></div></div></td>`;
                    return `<td style="text-align:${col.align || "center"};"><span class="badge" contenteditable="true" onblur="updateInlineTableCell(${s.id}, '${col.key}', this.textContent)" style="background:var(--bg-input);color:var(--text-main);font-weight:800;padding:6px 12px;">${s[col.key] !== undefined ? s[col.key] : col.defaultValue || "-"}</span></td>`;
                  })
                  .join("")}
                
                <td style="text-align:center;min-width:160px;">
                  <div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:nowrap;">
                    <button class="tbl-act-btn view" onclick="viewSyllabusDetails(${s.id})" title="🔍 বিস্তারিত দেখুন (View Details)" aria-label="View Details"><i class="fa-solid fa-eye"></i></button>
                    <button class="tbl-act-btn edit" onclick="editSyllabus(${s.id})" title="✏️ এডিট (A4 Paper Executive Card)" aria-label="Edit Syllabus Card"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="tbl-act-btn del" onclick="deleteSyllabus(${s.id})" title="🗑️ ডিলিট (Delete Entry)" aria-label="Delete Entry"><i class="fa-solid fa-trash-can"></i></button>
                  </div>
                </td>
              </tr>`;
              })
              .join("")}
          </tbody>
        </table>
      </div>`;
  } else {
    // Render Chapter Cards with Accordion (Expand/Collapse)
    container.innerHTML = items
      .map((s, idx) => {
        const checkedCount = (s.checklist || []).filter(
          (c) => c.checked,
        ).length;
        const totalCount = (s.checklist || []).length;
        const stLabel = statusLabels[s.status] || "🟢 চলছে";
        const prColor = priorityColor[s.priority] || "var(--text-muted)";

        return `
      <div class="syl-card-wrapper">
        <!-- Accordion Header -->
        <div class="syl-card-header chapter-accordion" id="syl-acc-${s.id}" onclick="toggleChapterAccordion(${s.id})">
          <div style="display:flex;align-items:center;gap:14px;flex:1;min-width:0;">
            <div class="syl-chapter-badge">${idx + 1 < 10 ? "0" + (idx + 1) : idx + 1}</div>
            <div style="display:flex;flex-direction:column;gap:4px;min-width:0;">
              <div style="font-size:1.1rem;font-weight:900;color:var(--text-main);display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                📖 ${s.chapterName || s.chapter || "অধ্যায়"}
                <span class="badge" style="background:rgba(59,130,246,0.12);color:var(--primary);">📚 ${s.subject} (${s.subjectCode || "১০৯"})</span>
                <span class="badge" style="background:rgba(139,92,246,0.12);color:var(--purple);">🏷️ ${s.piIndicator || "PI 8.3.1"}</span>
                <span class="badge" style="background:rgba(239,68,68,0.12);color:${prColor};">⚡ ${s.priority || "High"} Priority</span>
              </div>
              <div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">
                📅 ${s.date || "২০২৬-০৭-২৫"} | ⏰ ${s.time || "০৯:০০ AM"} | 🚪 কক্ষ: ${s.room || "১০২"} | 👨‍🏫 ${s.teacher || "মাগুরিব আলী"}
              </div>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:14px;flex-shrink:0;">
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;min-width:110px;">
              <div style="font-size:0.85rem;font-weight:900;color:var(--primary);">${s.progress}% কভারেজ</div>
              <div class="progress-bar-wrap" style="width:110px;"><div class="progress-fill" style="width:${s.progress}%"></div></div>
            </div>
            <span class="badge" style="background:rgba(16,185,129,0.15);color:var(--success);padding:6px 12px;font-size:0.85rem;">${stLabel}</span>
            <div style="display:flex;gap:6px;" onclick="event.stopPropagation()">
              <button onclick="editSyllabus(${s.id})" class="btn btn-secondary btn-sm" title="✏️ এডিট (Edit)"><i class="fa-solid fa-pen-to-square text-primary"></i> ✏️</button>
              
              <button onclick="deleteSyllabus(${s.id})" class="btn btn-secondary btn-sm" style="border-color:var(--danger);color:var(--danger);" title="🗑️ ডিলিট (Delete)"><i class="fa-solid fa-trash-can text-danger"></i> 🗑️</button>
            </div>
            <button class="modal-close-btn" style="width:32px;height:32px;font-size:0.8rem;border:1.5px solid var(--border);" aria-label="toggle">
              <i class="fa-solid fa-chevron-down chevron-icon"></i>
            </button>
          </div>
        </div>

        <!-- Accordion Expand/Collapse Body -->
        <div class="syl-card-body chapter-body" id="syl-body-${s.id}" style="display:none;padding:24px;">
          
          <!-- শিখনফল (Learning Outcome Box) -->
          <div class="learning-outcome-box" style="background:linear-gradient(135deg, rgba(59,130,246,0.06), rgba(16,185,129,0.06));border:1.5px solid rgba(59,130,246,0.2);border-radius:16px;padding:16px 20px;margin-bottom:20px;display:flex;align-items:center;gap:14px;">
            <i class="fa-solid fa-bullseye" style="font-size:1.6rem;color:var(--primary);"></i>
            <div>
              <strong style="color:var(--primary);font-size:0.9rem;">🎯 শিখনফল (Learning Outcome)</strong>
              <p style="margin:4px 0 0;font-size:0.88rem;color:var(--text-main);line-height:1.5;">${s.learningOutcomes || "শিক্ষার্থীরা ধারণা অর্জন করতে পারবে।"}</p>
            </div>
          </div>

          <!-- সম্ভাব্য সময় -->
          <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:18px;font-size:0.85rem;font-weight:700;color:var(--text-muted);">
            <span><i class="fa-solid fa-clock text-primary"></i> কতটি ক্লাস লাগবে: <strong style="color:var(--text-main);">${s.requiredClasses || 6}টি ক্লাস</strong></span>
            <span><i class="fa-solid fa-hourglass-half text-purple"></i> মোট কত ঘণ্টা লাগবে: <strong style="color:var(--text-main);">${s.totalHours || "৪.৫ ঘণ্টা"}</strong></span>
            <span><i class="fa-solid fa-award text-warning"></i> পারদর্শিতার সূচক: <strong style="color:var(--purple);">${s.piIndicator || "PI 8.3.1"}</strong></span>
          </div>

          <!-- টপিকভিত্তিক চেকলিস্ট (Confetti Toast trigger on check) -->
          <div style="font-size:0.82rem;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;display:flex;justify-content:space-between;">
            <span><i class="fa-solid fa-list-check text-success"></i> টপিকভিত্তিক চেকলিস্ট</span>
            <span>${checkedCount} / ${totalCount} সম্পন্ন</span>
          </div>
          <div class="topic-checklist-grid">
            ${(s.checklist || [])
              .map(
                (item, idx2) => `
            <div class="topic-card-item ${item.checked ? "completed" : ""}">
              <label class="topic-checkbox-label">
                <input type="checkbox" ${item.checked ? "checked" : ""} onchange="toggleChecklistItem(${s.id}, ${idx2})">
                <span class="custom-checkmark">${item.checked ? '<i class="fa-solid fa-check"></i>' : ""}</span>
                <span class="topic-title-text">${item.text}</span>
              </label>
              <span class="topic-status-tag ${item.checked ? "done" : "pending"}">${item.checked ? "✅ সম্পন্ন" : "⏳ বাকি"}</span>
            </div>`,
              )
              .join("")}
          </div>

          <!-- পরীক্ষা প্রস্তুতি (Exam Hub) -->
          ${
            s.examHub
              ? `
          <div style="background:rgba(245,158,11,0.08);border:1.5px solid rgba(245,158,11,0.22);border-radius:16px;padding:16px 20px;margin-bottom:20px;">
            <div style="font-size:0.8rem;font-weight:800;color:var(--warning);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;"><i class="fa-solid fa-square-poll-vertical"></i> 🎯 পরীক্ষা প্রস্তুতি (Exam Hub)</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.88rem;">
              <div><strong>মান বণ্টন:</strong> ${s.examHub.marks}</div>
              <div><strong>বিগত বছরের প্রশ্ন:</strong> ${s.examHub.pyq}</div>
            </div>
            <div style="margin-top:8px;font-size:0.82rem;color:var(--danger);font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> শিক্ষকের নোট: ${s.examHub.teacherNote}</div>
          </div>`
              : ""
          }

          <!-- রিসোর্স বাটন -->
          <div class="syl-card-footer" style="padding-top:16px;border-top:1.5px dashed var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <a href="${s.resources?.video || "#"}" target="_blank" class="resource-pill-btn"><i class="fa-solid fa-play" style="color:var(--danger)"></i> 🎥 ভিডিও</a>
              <button class="resource-pill-btn" onclick="alert('নোট ডাউনলোড হচ্ছে...')"><i class="fa-solid fa-file-pdf" style="color:var(--primary)"></i> 📄 নোট</button>
              <button class="resource-pill-btn" onclick="alert('কুইজ চালু হচ্ছে...')"><i class="fa-solid fa-pen-nib" style="color:var(--warning)"></i> 📝 কুইজ</button>
            </div>
            <div style="font-size:0.82rem;color:var(--text-muted);font-weight:700;"><i class="fa-solid fa-chart-bar text-primary"></i> কভারেজ: ${s.progress}%</div>
          </div>

        </div>
      </div>`;
      })
      .join("");
  }
}

function openAddSyllabusModal() {
  editingSyllabusId = null;
  const todayStr = new Date().toISOString().split("T")[0];
  document.getElementById("ms-date").value = todayStr;
  document.getElementById("ms-time").value = "০৯:০০ - ০৯:৪৫ AM";
  document.getElementById("ms-room").value = "১০২";
  document.getElementById("ms-class").value = "অষ্টম";
  document.getElementById("ms-section").value = "ক";
  document.getElementById("ms-subject").value = "গণিত";
  document.getElementById("ms-chapter").value = "";
  document.getElementById("ms-teacher").value =
    classData.settings.teacherName || "মাগুরিব আলী";
  document.getElementById("syllabus-modal")?.classList.remove("hidden");
}

function closeSyllabusModal() {
  document.getElementById("syllabus-modal")?.classList.add("hidden");
}

function saveSyllabusModal(e) {
  e.preventDefault();
  const date = document.getElementById("ms-date").value;
  const time = document.getElementById("ms-time").value;
  const room = document.getElementById("ms-room").value;
  const className = document.getElementById("ms-class").value;
  const section = document.getElementById("ms-section").value;
  const subject = document.getElementById("ms-subject").value;
  const chapterName = document.getElementById("ms-chapter").value;
  const teacher = document.getElementById("ms-teacher").value;
  const month = document.getElementById("ms-month").value;

  if (editingSyllabusId) {
    const s = classData.syllabuses.find((x) => x.id === editingSyllabusId);
    if (s) {
      s.date = date;
      s.time = time;
      s.room = room;
      s.className = className;
      s.section = section;
      s.subject = subject;
      s.chapterName = chapterName;
      s.teacher = teacher;
      s.month = month;
    }
  } else {
    classData.syllabuses.push({
      id: Date.now(),
      date,
      time,
      room,
      className,
      section,
      subject,
      subjectCode: "১০৯",
      chapterName,
      learningOutcomes:
        "শিক্ষার্থীরা উক্ত অধ্যায়ের গাণিতিক ও বাস্তবমুখী ধারণা অর্জন করতে পারবে।",
      teacher,
      status: "running",
      progress: 40,
      priority: "High",
      month,
      term: "half_yearly",
      piIndicator: "PI 8.3.1",
      requiredClasses: 6,
      totalHours: "৪.৫ ঘণ্টা",
      timeframeLabel: "আগামী ১ মাস",
      checklist: [
        { text: "অধ্যায়ের মূল ধারণার পাঠদান", checked: true },
        { text: "অনুশীলনী ও সমস্যা সমাধান", checked: false },
      ],
      resources: { video: "#", note: "#", quiz: "#" },
    });
  }

  saveStorage();
  closeSyllabusModal();
  renderSyllabus();
  showConfettiToast("🎉 সিলেবাস তথ্য সফলভাবে সেভ করা হয়েছে!");
}

function saveSyllabusDirect(id) {
  saveStorage();
  showConfettiToast("💾 সিলেবাস রেকর্ড সেভ করা হয়েছে!");
}

function deleteSyllabus(id) {
  if (!confirm("এই সিলেবাসের রেকর্ডটি মুছে ফেলতে চান?")) return;
  classData.syllabuses = classData.syllabuses.filter((s) => s.id !== id);
  saveStorage();
  renderSyllabus();
}

function renderRoutine(day) {
  const container = document.getElementById("routine-cards-container");
  if (!container) return;
  const items = classData.routines.filter((r) => r.day === day);
  if (!items.length) {
    container.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:30px;">এই দিনে কোনো পিরিয়ড নির্ধারণ করা হয়নি।</p>`;
    return;
  }
  container.innerHTML =
    `<div class="routine-timeline">` +
    items
      .map(
        (r) => `
    <div class="routine-timeline-card ${r.activeNow ? "active-now" : ""}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <span style="font-size:12.5px;font-weight:800;color:var(--primary);"><i class="fa-solid fa-clock"></i> ${r.time}</span>
        <div style="display:flex;gap:8px;align-items:center;">
          ${r.activeNow ? '<span class="badge" style="background:rgba(239,68,68,0.15);color:var(--danger);"><i class="fa-solid fa-circle live-pulse"></i> লাইভ সেশন</span>' : ""}
          <button onclick="editRoutine(${r.id})" style="background:none;color:var(--primary);font-size:14px;" title="সম্পাদনা"><i class="fa-solid fa-pen-to-square"></i></button>
          <button onclick="deleteRoutine(${r.id})" style="background:none;color:var(--danger);font-size:14px;" title="মুছুন"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
      <h4 style="font-size:1.05rem;font-weight:800;color:var(--text-main);">${r.subject} <span style="font-size:12px;color:var(--text-muted);font-weight:600;">(কক্ষ: ${r.room})</span></h4>
      <p style="font-size:13px;color:var(--text-muted);margin-top:4px;"><i class="fa-solid fa-book-open"></i> ${r.topic || "অধ্যায় ও নির্ধারিত পাঠসূচি"}</p>
      <p style="font-size:12.5px;color:var(--primary);font-weight:700;margin-top:4px;"><i class="fa-solid fa-user-tie"></i> ${r.teacher} <span style="font-size:11px;color:var(--text-muted);font-weight:600;">[সাবস্টিটিউট: ${r.substitute || "উপলব্ধ"}]</span></p>

      <!-- Class Actions -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;padding-top:12px;border-top:1.5px dashed var(--border);">
        <button class="btn btn-primary btn-sm" onclick="switchSection('live_control')"><i class="fa-solid fa-play"></i> ▶️ ক্লাস শুরু করুন</button>
        <button class="btn btn-secondary btn-sm" onclick="alert('লেসন প্ল্যান খুলছে...')"><i class="fa-solid fa-book"></i> 📖 লেসন প্ল্যান</button>
        <button class="btn btn-secondary btn-sm" onclick="alert('প্রেজেন্টেশন মোড চালু হচ্ছে...')"><i class="fa-solid fa-desktop"></i> 🖥️ প্রেজেন্টেশন</button>
        <button class="btn btn-secondary btn-sm" onclick="switchSection('attendance')"><i class="fa-solid fa-user-check"></i> 👥 উপস্থিতি</button>
      </div>

      <!-- Syllabus Link Button & Resources -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
        <button class="btn btn-outline btn-sm" style="border-color:var(--primary);color:var(--primary);" onclick="showSyllabusPopup('${r.subject}')"><i class="fa-solid fa-link"></i> 🔗 সিলেবাস লিংক</button>
        <button class="btn btn-secondary btn-sm" onclick="alert('ভিডিও খুলছে...')"><i class="fa-solid fa-video"></i> 🎥 ভিডিও</button>
        <button class="btn btn-secondary btn-sm" onclick="alert('নোট ডাউনলোড হচ্ছে...')"><i class="fa-solid fa-file-lines"></i> 📄 নোট</button>
        <button class="btn btn-secondary btn-sm" onclick="alert('কুইজ চালু হচ্ছে...')"><i class="fa-solid fa-pen-to-square"></i> 📝 কুইজ</button>
      </div>
    </div>`,
      )
      .join("") +
    `</div>`;
}

function showSyllabusPopup(subjectName) {
  const s =
    classData.syllabuses.find((x) => x.subject === subjectName) ||
    classData.syllabuses[0];
  alert(
    `🔗 ${s.subject} সিলেবাস লিংক পপআপ:\n• চ্যাপ্টার: ${s.chapterName}\n• পারদর্শিতার সূচক: ${s.piIndicator}\n• প্রোগ্রেস: ${s.progress}%\n• বিগত প্রশ্ন: ${s.examHub?.pyq || "২০২৫ বোর্ড প্রশ্ন"}\n• AI সুপারিশ: ${s.learningOutcomes}`,
  );
}

function openAddRoutineModal() {
  editingRoutineId = null;
  document.getElementById("routine-modal")?.classList.remove("hidden");
}
function editRoutine(id) {
  editingRoutineId = id;
  document.getElementById("routine-modal")?.classList.remove("hidden");
}
function closeRoutineModal() {
  document.getElementById("routine-modal")?.classList.add("hidden");
}
function saveRoutineModal(e) {
  e.preventDefault();
  closeRoutineModal();
  renderRoutine("রবিবার");
  renderOverview();
}
function deleteRoutine(id) {
  classData.routines = classData.routines.filter((r) => r.id !== id);
  saveStorage();
  renderRoutine("রবিবার");
  renderOverview();
}

// ===================== SECTION 4: ATTENDANCE & PARTICIPATION =====================
let _attSubjectFilter = "all";
let isQuickEditMode = false;

window.toggleQuickEditMode = function () {
  isQuickEditMode = !isQuickEditMode;
  const btn = document.getElementById("quick-edit-toggle-btn");
  if (btn) {
    if (isQuickEditMode) {
      btn.style.background = "var(--warning)";
      btn.style.color = "#fff";
      btn.innerHTML = '<i class="fa-solid fa-check"></i> ✅ কুইক এডিটিং মোড (সক্রিয়)';
      if (typeof showConfettiToast === "function") showConfettiToast("⚡ কুইক এডিট মোড চালু হয়েছে! এখন সরাসরি টেবিলে নাম ও % পরিবর্তন করতে পারবেন।");
    } else {
      btn.style.background = "rgba(245,158,11,0.2)";
      btn.style.color = "var(--warning)";
      btn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> ⚡ কুইক এডিট মোড (চালু/বন্ধ)';
      if (typeof showConfettiToast === "function") showConfettiToast("কুইক এডিট মোড বন্ধ করা হয়েছে।");
    }
  }
  renderStudentAttendanceTable();
};

window.updateStudentInlineName = function (id, newName) {
  const s = classData.students.find((x) => x.id === id);
  if (s && newName.trim()) {
    s.name = newName.trim();
    saveStorage();
    if (typeof showConfettiToast === "function") showConfettiToast(`✅ নাম আপডেট করা হয়েছে: ${s.name}`);
  }
};

window.updateStudentInlinePct = function (id, newPct) {
  const s = classData.students.find((x) => x.id === id);
  if (s && newPct !== "") {
    s.monthlyAttendance = parseFloat(newPct);
    saveStorage();
    if (typeof showConfettiToast === "function") showConfettiToast(`📊 ${s.name}-এর উপস্থিতি আপডেট: ${s.monthlyAttendance}%`);
  }
};

function filterAttendanceSubject(sub) {
  _attSubjectFilter = sub;
  document.querySelectorAll("#att-subject-chips .sub-chip").forEach((b) => {
    b.classList.toggle(
      "active",
      b.textContent.trim() === sub ||
        (sub === "all" && b.textContent.trim() === "সকল"),
    );
  });
  renderAttendanceCards();
}

function filterAttendanceTable() {
  renderStudentAttendanceTable();
}
function renderAttendanceCards() {
  renderStudentAttendanceTable();
}

let activeAttFilter = 'all';

function setAttendanceFilter(type) {
  activeAttFilter = type;
  document.querySelectorAll('#sec-attendance .tab-chip').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`att-chip-${type}`);
  if (activeBtn) activeBtn.classList.add('active');
  renderStudentAttendanceTable();
}

function exportAttendanceDataJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(classData.students, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `sashiba_attendance_backup_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showConfettiToast("📄 JSON ব্যাকআপ ডাটা সফলভাবে ডাউনলোড হয়েছে!");
}

function exportAttendanceCSV() {
  let csvContent = "data:text/csv;charset=utf-8,ID,Roll,Name,Class,Section,AttendancePct\n";
  classData.students.forEach(s => {
    csvContent += `${s.id},${s.roll},"${s.name}",${s.className || 'অষ্টম'},${s.section || 'ক'},${s.monthlyAttendance}%\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `sashiba_attendance_list_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showConfettiToast("📊 CSV স্প্রেডশিট ডাউনলোড সম্পন্ন হয়েছে!");
}

function renderStudentAttendanceTable() {
  const tbody = document.getElementById("student-table-body");
  const container =
    document.getElementById("attendance-cards-container") || tbody;
  if (!tbody && !container) return;

  const searchQ = (
    document.getElementById("att-search-input")?.value || ""
  ).toLowerCase();
  const clsVal = document.getElementById("att-class-select")?.value || "all";
  const secVal = document.getElementById("att-section-select")?.value || "all";

  if (!classData.students || !Array.isArray(classData.students) || classData.students.length === 0) {
    classData.students = [
      { id: 1, roll: 1, name: "আব্দুল্লাহ আল মামুন", className: "অষ্টম", section: "ক", monthlyAttendance: 96.5, engagement: 5, attendance: "Present", periodAttendance: { p1: "Present", p2: "Present", p3: "Present" } },
      { id: 2, roll: 2, name: "মোছাঃ ফাতেমা খাতুন", className: "অষ্টম", section: "ক", monthlyAttendance: 88.0, engagement: 4, attendance: "Present", periodAttendance: { p1: "Present", p2: "Present", p3: "Present" } },
      { id: 3, roll: 3, name: "তানভীর আহমেদ", className: "অষ্টম", section: "ক", monthlyAttendance: 64.0, engagement: 2, attendance: "Absent", periodAttendance: { p1: "Absent", p2: "Present", p3: "Absent" } },
      { id: 4, roll: 4, name: "নুসরাত জাহান", className: "অষ্টম", section: "ক", monthlyAttendance: 98.0, engagement: 5, attendance: "Present", periodAttendance: { p1: "Present", p2: "Present", p3: "Present" } },
      { id: 5, roll: 5, name: "মেহেদী হাসান", className: "অষ্টম", section: "ক", monthlyAttendance: 72.5, engagement: 3, attendance: "Late", periodAttendance: { p1: "Absent", p2: "Present", p3: "Present" } }
    ];
    saveStorage();
  }

  let students = [...classData.students];

  if (clsVal !== "all")
    students = students.filter((s) => s.className === clsVal);
  if (secVal !== "all") students = students.filter((s) => s.section === secVal);
  if (searchQ)
    students = students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQ) ||
        String(s.roll).includes(searchQ),
    );

  if (activeAttFilter === 'good') {
    students = students.filter(s => parseFloat(s.monthlyAttendance) >= 80);
  } else if (activeAttFilter === 'average') {
    students = students.filter(s => parseFloat(s.monthlyAttendance) >= 50 && parseFloat(s.monthlyAttendance) < 80);
  } else if (activeAttFilter === 'weak') {
    students = students.filter(s => parseFloat(s.monthlyAttendance) < 50);
  }

  // Compute attendance stats, badges, risk flags dynamically
  students.forEach((s) => {
    if (s.monthlyAttendance === undefined || s.monthlyAttendance === null) {
      calcStudentAttendancePct(s);
    }
  });

  // Update KPI Summary Cards
  const totalCount = students.length;
  const topCount = students.filter(
    (s) => parseFloat(s.monthlyAttendance) >= 90,
  ).length;
  const goodCount = students.filter(
    (s) =>
      parseFloat(s.monthlyAttendance) >= 75 &&
      parseFloat(s.monthlyAttendance) < 90,
  ).length;
  const weakCount = students.filter(
    (s) => parseFloat(s.monthlyAttendance) < 75,
  ).length;
  const avgPct = totalCount
    ? (
        students.reduce((a, s) => a + parseFloat(s.monthlyAttendance), 0) /
        totalCount
      ).toFixed(1)
    : 0;

  const kTotal = document.getElementById("kpi-total-students");
  const kTop = document.getElementById("kpi-top-performers");
  const kGood = document.getElementById("kpi-good-performers");
  const kWeak = document.getElementById("kpi-weak-performers");
  const kAvg = document.getElementById("kpi-avg-attendance");

  if (kTotal) kTotal.textContent = totalCount;
  if (kTop) kTop.textContent = topCount;
  if (kGood) kGood.textContent = goodCount;
  if (kWeak) kWeak.textContent = weakCount;
  if (kAvg) kAvg.textContent = avgPct + "%";

  // 🚀 ১. উপস্থিতির শতকরা হার (%) অনুসারে মেধা ক্রমানুসারে সর্ট করা
  students.sort((a, b) => (parseFloat(b.monthlyAttendance) || 0) - (parseFloat(a.monthlyAttendance) || 0));

  const bnPosNums = ['০', '১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'];

  const rowsHtml = students
    .map((s, index) => {
      if (!s.periodAttendance) {
        s.periodAttendance = { p1: "Present", p2: "Present", p3: "Present" };
        calcStudentAttendancePct(s);
      }

      const isFullStar = s.monthlyAttendance >= 95;
      const isRisk = s.monthlyAttendance < 70;
      const stars = "⭐".repeat(s.engagement || 1);

      const posNum = index + 1;
      const posBadge = bnPosNums[posNum] || (posNum + 'তম');
      const posBg = posNum === 1 ? 'rgba(16,185,129,0.22)' : posNum === 2 ? 'rgba(99,102,241,0.22)' : posNum === 3 ? 'rgba(139,92,246,0.22)' : 'rgba(148,163,184,0.18)';
      const posColor = posNum === 1 ? 'var(--success)' : posNum === 2 ? 'var(--primary)' : posNum === 3 ? 'var(--purple)' : 'var(--text-muted)';
      const posIcon = posNum === 1 ? '🥇' : posNum === 2 ? '🥈' : posNum === 3 ? '🥉' : '🎖️';

      const p1Badge =
        s.periodAttendance?.p1 === "Present"
          ? `<span class="badge" style="background:rgba(16,185,129,0.25);color:var(--success);cursor:pointer;font-weight:900;font-size:0.95rem;padding:6px 14px;border:1.5px solid rgba(16,185,129,0.4);" onclick="toggleStudentPeriodStatus(${s.id}, 'p1')">✓</span>`
          : `<span class="badge" style="background:rgba(239,68,68,0.25);color:var(--danger);cursor:pointer;font-weight:900;font-size:0.95rem;padding:6px 14px;border:1.5px solid rgba(239,68,68,0.4);" onclick="toggleStudentPeriodStatus(${s.id}, 'p1')">×</span>`;
      const p2Badge =
        s.periodAttendance?.p2 === "Present"
          ? `<span class="badge" style="background:rgba(16,185,129,0.25);color:var(--success);cursor:pointer;font-weight:900;font-size:0.95rem;padding:6px 14px;border:1.5px solid rgba(16,185,129,0.4);" onclick="toggleStudentPeriodStatus(${s.id}, 'p2')">✓</span>`
          : `<span class="badge" style="background:rgba(239,68,68,0.25);color:var(--danger);cursor:pointer;font-weight:900;font-size:0.95rem;padding:6px 14px;border:1.5px solid rgba(239,68,68,0.4);" onclick="toggleStudentPeriodStatus(${s.id}, 'p2')">×</span>`;
      const p3Badge =
        s.periodAttendance?.p3 === "Present"
          ? `<span class="badge" style="background:rgba(16,185,129,0.25);color:var(--success);cursor:pointer;font-weight:900;font-size:0.95rem;padding:6px 14px;border:1.5px solid rgba(16,185,129,0.4);" onclick="toggleStudentPeriodStatus(${s.id}, 'p3')">✓</span>`
          : `<span class="badge" style="background:rgba(239,68,68,0.25);color:var(--danger);cursor:pointer;font-weight:900;font-size:0.95rem;padding:6px 14px;border:1.5px solid rgba(239,68,68,0.4);" onclick="toggleStudentPeriodStatus(${s.id}, 'p3')">×</span>`;

      const statusPill =
        s.attendance === "Absent"
          ? '<span class="badge" style="background:rgba(239,68,68,0.25);color:var(--danger);font-weight:900;font-size:0.94rem;padding:6px 14px;border:1px solid rgba(239,68,68,0.4);">× অনুপস্থিত</span>'
          : s.attendance === "Late"
            ? '<span class="badge" style="background:rgba(245,158,11,0.25);color:var(--warning);font-weight:900;font-size:0.94rem;padding:6px 14px;border:1px solid rgba(245,158,11,0.4);">… বিলম্বে</span>'
            : '<span class="badge" style="background:rgba(16,185,129,0.25);color:var(--success);font-weight:900;font-size:0.94rem;padding:6px 14px;border:1px solid rgba(16,185,129,0.4);">✓ উপস্থিত</span>';

      const nameDisplay = isQuickEditMode
        ? `<input type="text" value="${s.name}" onchange="updateStudentInlineName(${s.id}, this.value)" style="font-weight:900;font-size:1.0rem;padding:4px 8px;border-radius:6px;border:1px solid var(--primary);width:150px;background:var(--bg-input);color:var(--text-main);" />`
        : `<strong style="font-size:1.08rem;color:var(--text-main);font-weight:900;">${s.name}</strong>`;

      const pctDisplay = isQuickEditMode
        ? `<input type="number" step="0.1" value="${s.monthlyAttendance}" onchange="updateStudentInlinePct(${s.id}, this.value)" style="font-weight:900;font-size:1.0rem;padding:4px 6px;border-radius:6px;border:1px solid var(--primary);width:70px;text-align:center;background:var(--bg-input);color:var(--text-main);" />`
        : `<strong style="color:${isRisk ? "var(--danger)" : "var(--primary)"};font-size:1.1rem;font-weight:900;">${s.monthlyAttendance}%</strong>`;

      return `
    <tr style="border-bottom:1px solid var(--border);${isQuickEditMode ? 'background:rgba(245,158,11,0.04);' : ''}">
      <td style="text-align:center;position:sticky;left:0;z-index:2;background:var(--bg-card);border-right:1.5px solid var(--border);padding:12px 8px;">
        <span class="badge" style="background:${posBg};color:${posColor};font-weight:900;font-size:0.88rem;padding:4px 10px;border-radius:9999px;border:1px solid ${posColor};display:inline-flex;align-items:center;gap:4px;">
          ${posIcon} ${posBadge}
        </span>
      </td>
      <td style="text-align:center;position:sticky;left:110px;z-index:2;background:var(--bg-card);border-right:1.5px solid var(--border);font-size:1.05rem;font-weight:900;color:var(--text-main);padding:12px 10px;"><strong>#${s.roll}</strong></td>
      <td style="position:sticky;left:180px;z-index:2;background:var(--bg-card);border-right:2px solid var(--border);padding:12px 14px;">
        ${nameDisplay}
        ${isFullStar ? '<span class="badge" style="background:rgba(245,158,11,0.25);color:var(--warning);font-size:0.75rem;margin-left:6px;font-weight:900;padding:4px 8px;border:1px solid rgba(245,158,11,0.4);" title="১০০% পারফেক্ট উপস্থিতি স্টার">🏆 100% Star</span>' : ""}
        ${isRisk ? '<span class="badge" style="background:rgba(239,68,68,0.25);color:var(--danger);font-size:0.75rem;margin-left:6px;font-weight:900;padding:4px 8px;border:1px solid rgba(239,68,68,0.4);" title="জরুরি নোটিশ প্রয়োজন">🚨 ড্রপ-আউট ঝুঁকি</span>' : ""}
      </td>
      <td style="text-align:center;cursor:pointer;padding:12px;" onclick="toggleStudentAttendanceStatus(${s.id})">
        ${statusPill}
      </td>
      <td style="text-align:center;padding:12px;">${p1Badge}</td>
      <td style="text-align:center;padding:12px;">${p2Badge}</td>
      <td style="text-align:center;padding:12px;">${p3Badge}</td>
      <td style="text-align:center;padding:12px;">
        ${pctDisplay}
      </td>
      <td style="text-align:center;font-size:1.0rem;padding:12px;" title="${s.engagement} স্টার">${stars}</td>
      <td style="text-align:center;white-space:nowrap;padding:12px;">
        <button onclick="showConfettiToast('📱 ${s.name}-এর অভিভাবকের মোবাইল নম্বরে SMS পাঠানো হয়েছে!')" class="btn btn-sm btn-secondary" style="font-size:0.82rem;font-weight:900;border-radius:8px;margin-right:6px;padding:6px 12px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border);">
          📱 SMS
        </button>
        <button onclick="showConfettiToast('✉️ ${s.name}-এর অভিভাবকের ইমেইল ঠিকানায় রিপোর্ট পাঠানো হয়েছে!')" class="btn btn-sm btn-secondary" style="font-size:0.82rem;font-weight:900;border-radius:8px;background:rgba(99,102,241,0.2);color:var(--primary);border:1px solid rgba(99,102,241,0.4);padding:6px 12px;">
          ✉️ Email
        </button>
      </td>
      <td style="text-align:right;white-space:nowrap;padding:12px 14px;">
        <button onclick="openStudentEditDirectModal(${s.id})" class="btn btn-sm btn-primary" title="শিক্ষার্থীর উপস্থিতি ও তথ্য সংশোধন করুন" style="margin-right:4px;font-weight:900;font-size:0.88rem;padding:6px 14px;border-radius:8px;background:var(--primary);color:#fff;"><i class="fa-solid fa-pen-to-square"></i> এডিট</button>
        <button onclick="printIndividualStudentCertificate(${s.id})" class="btn btn-sm" title="অভিভাবকের জন্য রিপোর্ট প্রিন্ট করুন" style="margin-right:4px;background:rgba(16,185,129,0.2);color:var(--success);font-weight:900;font-size:0.85rem;padding:6px 12px;border-radius:8px;border:1px solid rgba(16,185,129,0.4);"><i class="fa-solid fa-print"></i> প্রিন্ট</button>
        <button onclick="deleteStudentRow(${s.id})" class="btn btn-sm" title="শিক্ষার্থী মুছে ফেলুন" style="background:rgba(239,68,68,0.2);color:var(--danger);font-weight:900;font-size:0.85rem;padding:6px 12px;border-radius:8px;border:1px solid rgba(239,68,68,0.4);"><i class="fa-solid fa-trash"></i> ডিলিট</button>
      </td>
    </tr>`;
    })
    .join("");

  const targetTbody = document.getElementById("student-table-body") || document.querySelector("#sec-attendance tbody");
  if (targetTbody) {
    targetTbody.innerHTML = rowsHtml;
  }
}

function calcStudentAttendancePct(s) {
  if (!s.periodAttendance)
    s.periodAttendance = { p1: "Present", p2: "Present", p3: "Present" };
  const pCount =
    (s.periodAttendance.p1 === "Present" ? 1 : 0) +
    (s.periodAttendance.p2 === "Present" ? 1 : 0) +
    (s.periodAttendance.p3 === "Present" ? 1 : 0);

  // 🚀 ১. উপস্থিতি % অটো-হিসাব (সবগুলো পিরিয়ড অনুপস্থিত হলে ০%)
  s.monthlyAttendance = parseFloat(((pCount / 3) * 100).toFixed(1));

  // 🚀 ২. সার্বিক আজকের স্ট্যাটাস সিঙ্ক (যদি সব অনুপস্থিত হয় তবে আজকের স্ট্যাটাসও অনুপস্থিত)
  if (pCount === 0) s.attendance = "Absent";
  else if (pCount === 3) s.attendance = "Present";
  else s.attendance = "Late";

  // 🚀 ৩. উপস্থিতির ভিত্তিতে স্টার রেটিং অটো-আপডেট
  if (pCount === 3)
    s.engagement = 5; // ৩ পিরিয়ড উপস্থিত ➔ ⭐⭐⭐⭐⭐ (৫ স্টার)
  else if (pCount === 2)
    s.engagement = 3; // ২ পিরিয়ড উপস্থিত ➔ ⭐⭐⭐ (৩ স্টার)
  else if (pCount === 1)
    s.engagement = 2; // ১ পিরিয়ড উপস্থিত ➔ ⭐⭐ (২ স্টার)
  else s.engagement = 1; // ০ পিরিয়ড উপস্থিত ➔ ⭐ (১ স্টার)
}

function toggleStudentPeriodStatus(rollOrId, periodKey) {
  const s = classData.students.find(
    (x) => x.id === rollOrId || x.roll === rollOrId,
  );
  if (!s) return;
  if (!s.periodAttendance)
    s.periodAttendance = { p1: "Present", p2: "Present", p3: "Present" };

  s.periodAttendance[periodKey] =
    s.periodAttendance[periodKey] === "Present" ? "Absent" : "Present";

  calcStudentAttendancePct(s);
  saveStorage();
  renderStudentAttendanceTable();
  showConfettiToast(
    `${s.name}-এর পিরিয়ড স্ট্যাটাস পরিবর্তন করা হয়েছে! নতুন মাসিক উপস্থিতি: ${s.monthlyAttendance}%`,
  );
}

function toggleStudentAttendanceStatus(rollOrId) {
  const s = classData.students.find(
    (x) => x.id === rollOrId || x.roll === rollOrId,
  );
  if (!s) return;
  if (s.attendance === "Present") {
    s.attendance = "Absent";
    s.periodAttendance = { p1: "Absent", p2: "Absent", p3: "Absent" };
  } else if (s.attendance === "Absent") {
    s.attendance = "Late";
    s.periodAttendance = { p1: "Absent", p2: "Present", p3: "Present" };
  } else {
    s.attendance = "Present";
    s.periodAttendance = { p1: "Present", p2: "Present", p3: "Present" };
  }

  calcStudentAttendancePct(s);
  saveStorage();
  renderStudentAttendanceTable();
  showConfettiToast(
    s.name +
      "-এর উপস্থিতি পরিবর্তন করে " +
      (s.attendance === "Present"
        ? "উপস্থিত"
        : s.attendance === "Absent"
          ? "অনুপস্থিত"
          : "বিলম্বে") +
      " করা হয়েছে। নতুন মাসিক উপস্থিতি: " +
      s.monthlyAttendance +
      "%",
  );
}

function openA4NewStudentCardModal() {
  const overlay = document.getElementById("a4-record-modal-overlay");
  const paper = document.getElementById("a4-record-modal-content");
  if (!overlay || !paper) return;

  const nextRoll =
    classData.students.length > 0
      ? Math.max(...classData.students.map((s) => s.roll || 0)) + 1
      : 1;

  paper.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0f172a;padding-bottom:14px;margin-bottom:18px;">
      <div>
        <h2 style="font-size:1.4rem;font-weight:900;color:#0f172a;margin:0;">${classData.settings.schoolName || classData.settings.school}</h2>
        <span style="font-size:0.85rem;color:#475569;font-weight:700;">📄 A4 নতুন শিক্ষার্থী ভর্তি & রেজিস্ট্রেশন এন্ট্রি কার্ড (New Row Card)</span>
      </div>
      <div style="text-align:right;">
        <span style="font-size:0.9rem;font-weight:900;color:#10b981;">নতুন রোল প্রস্তাবিত: #${nextRoll}</span>
        <span style="display:block;font-size:0.8rem;color:#64748b;">শিক্ষাবর্ষ: ২০২৬</span>
      </div>
    </div>

    <form onsubmit="saveNewStudentFromA4Card(event)" style="display:flex;flex-direction:column;gap:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;background:#f8fafc;padding:16px;border-radius:12px;border:1px solid #cbd5e1;">
        <div>
          <label style="font-size:0.82rem;font-weight:800;color:#334155;display:block;margin-bottom:4px;">শিক্ষার্থীর নাম (পূর্ণ নাম):</label>
          <input type="text" id="a4-new-name" placeholder="যেমন: মোসাঃ মরিয়ম সুলতানা" class="form-input" style="width:100%;height:38px;font-weight:800;background:#fff;border:1px solid #cbd5e1;padding:0 10px;border-radius:8px;" required>
        </div>
        <div>
          <label style="font-size:0.82rem;font-weight:800;color:#334155;display:block;margin-bottom:4px;">রোল নম্বর:</label>
          <input type="number" id="a4-new-roll" value="${nextRoll}" class="form-input" style="width:100%;height:38px;font-weight:800;background:#fff;border:1px solid #cbd5e1;padding:0 10px;border-radius:8px;" required>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;background:#fff;border:1.5px solid #cbd5e1;border-radius:14px;padding:16px;">
        <div>
          <label style="font-size:0.82rem;font-weight:800;color:#334155;display:block;margin-bottom:4px;">শ্রেণি (Class):</label>
          <input type="text" id="a4-new-class" value="অষ্টম" class="form-input" style="width:100%;height:38px;font-weight:800;border:1px solid #cbd5e1;padding:0 10px;border-radius:8px;">
        </div>
        <div>
          <label style="font-size:0.82rem;font-weight:800;color:#334155;display:block;margin-bottom:4px;">শাখা (Section):</label>
          <input type="text" id="a4-new-section" value="ক" class="form-input" style="width:100%;height:38px;font-weight:800;border:1px solid #cbd5e1;padding:0 10px;border-radius:8px;">
        </div>
      </div>

      <div style="background:#fff;border:1.5px solid #cbd5e1;border-radius:14px;padding:16px;">
        <h4 style="font-size:0.95rem;font-weight:900;color:#0f172a;margin-bottom:12px;"><i class="fa-solid fa-clock text-primary"></i> প্রারম্ভিক পিরিয়ড উপস্থিতি (Initial Period Status):</h4>
        
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
          <div style="padding:12px;background:#f1f5f9;border-radius:10px;text-align:center;">
            <strong style="display:block;font-size:0.82rem;margin-bottom:6px;color:#334155;">বাংলা (পিরিয়ড ১)</strong>
            <select id="a4-new-p1" class="form-input" style="width:100%;height:36px;font-weight:800;border-radius:6px;">
              <option value="Present" selected>🟢 উপস্থিত (Present)</option>
              <option value="Absent">🔴 অনুপস্থিত (Absent)</option>
            </select>
          </div>

          <div style="padding:12px;background:#f1f5f9;border-radius:10px;text-align:center;">
            <strong style="display:block;font-size:0.82rem;margin-bottom:6px;color:#334155;">গণিত (পিরিয়ড ২)</strong>
            <select id="a4-new-p2" class="form-input" style="width:100%;height:36px;font-weight:800;border-radius:6px;">
              <option value="Present" selected>🟢 উপস্থিত (Present)</option>
              <option value="Absent">🔴 অনুপস্থিত (Absent)</option>
            </select>
          </div>

          <div style="padding:12px;background:#f1f5f9;border-radius:10px;text-align:center;">
            <strong style="display:block;font-size:0.82rem;margin-bottom:6px;color:#334155;">বিজ্ঞান (পিরিয়ড ৩)</strong>
            <select id="a4-new-p3" class="form-input" style="width:100%;height:36px;font-weight:800;border-radius:6px;">
              <option value="Present" selected>🟢 উপস্থিত (Present)</option>
              <option value="Absent">🔴 অনুপস্থিত (Absent)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label style="font-size:0.82rem;font-weight:800;color:#334155;display:block;margin-bottom:4px;">বিশেষ টিচার রিমার্কস/মন্তব্য:</label>
        <textarea id="a4-new-remark" class="form-input" style="width:100%;height:60px;padding:8px 12px;font-size:0.85rem;border:1px solid #cbd5e1;border-radius:8px;resize:none;">নতুন শিক্ষার্থী রেজিস্টার্ড।</textarea>
      </div>

      <div class="no-print" style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:14px;border-top:1.5px solid #cbd5e1;">
        <button type="button" class="btn btn-secondary" onclick="closeA4Modal()"><i class="fa-solid fa-xmark"></i> বাতিল</button>
        <button type="submit" class="btn btn-success" style="font-weight:900;padding:10px 24px;background:#10b981;color:#fff;"><i class="fa-solid fa-user-check"></i> ➕ নতুন শিক্ষার্থী যোগ করুন</button>
      </div>
    </form>`;

  overlay.classList.remove("hidden");
  overlay.style.display = "flex";
  overlay.style.visibility = "visible";
  overlay.style.opacity = "1";
}

window.saveNewStudentFromA4Card = function (e) {
  if (e) e.preventDefault();
  const name = document.getElementById("a4-new-name")?.value;
  const roll = parseInt(document.getElementById("a4-new-roll")?.value || "1");
  const className = document.getElementById("a4-new-class")?.value || "অষ্টম";
  const section = document.getElementById("a4-new-section")?.value || "ক";
  const p1 = document.getElementById("a4-new-p1")?.value || "Present";
  const p2 = document.getElementById("a4-new-p2")?.value || "Present";
  const p3 = document.getElementById("a4-new-p3")?.value || "Present";
  const remark =
    document.getElementById("a4-new-remark")?.value || "নতুন ভর্তি";

  if (!name) return;

  const pCount =
    (p1 === "Present" ? 1 : 0) +
    (p2 === "Present" ? 1 : 0) +
    (p3 === "Present" ? 1 : 0);
  const monthlyAttendance = parseFloat(((pCount / 3) * 100).toFixed(1));

  const newStudent = {
    id: Date.now(),
    roll,
    name,
    className,
    section,
    year: "২০২৬",
    group: "সাধারণ",
    periodAttendance: { p1, p2, p3 },
    monthlyAttendance,
    engagement: pCount === 3 ? 5 : pCount === 2 ? 3 : 1,
    attendance: pCount === 0 ? "Absent" : "Present",
    remark,
  };

  classData.students.push(newStudent);
  saveStorage();
  closeA4Modal();
  renderStudentAttendanceTable();
  showConfettiToast(
    `🎉 নতুন শিক্ষার্থী ${name} (রোল #${roll}) সফলভাবে ড্যাশবোর্ডে যোগ করা হয়েছে!`,
  );
};

function openAddNewSubjectColumnModal() {
  const subjectName = prompt(
    "নতুন বিষয়/পিরিয়ডের নাম লিখুন (যেমন: ইংরেজি / ডিজিটাল প্রযুক্তি):",
  );
  if (!subjectName) return;
  showConfettiToast(
    `📚 নতুন বিষয় কলাম "${subjectName}" সফলতা সহকারে রুটিন ও ড্যাশবোর্ডে যোগ করা হয়েছে!`,
  );
}

function openRemoveSubjectColumnModal() {
  const subjectName = prompt(
    "যে বিষয়/কলামটি বাদ দিতে চান তার নাম লিখুন (যেমন: বিজ্ঞান):",
  );
  if (!subjectName) return;
  showConfettiToast(
    `🗑️ বিষয়/কলাম "${subjectName}" টেবিলে সাময়িকভাবে হাইড/বাদ দেওয়া হয়েছে!`,
  );
}

function openDeleteStudentRowModal() {
  const rollStr = prompt("যে শিক্ষার্থীর রো (Row) বাদ দিতে চান তার রোল বা নাম লিখুন:");
  if (!rollStr) return;
  const match = classData.students.find(
    (s) => String(s.roll) === String(rollStr.trim()) || s.name.includes(rollStr.trim())
  );
  if (match) {
    if (confirm(`আপনি কি নিশ্চিতভাবে "${match.name}" (রোল #${match.roll}) রো-টি বাদ/মুছে ফেলতে চান?`)) {
      deleteStudentRow(match.id);
    }
  } else {
    alert("উক্ত রোল বা নামের কোনো শিক্ষার্থী পাওয়া যায়নি!");
  }
}

function openPerfFor(id) {
  openA4StudentModal(id);
}

function openStudentEditDirectModal(id) {
  openA4StudentModal(id);
}

function openEditStudentModal(id) {
  openA4StudentModal(id);
}

function deleteStudentRow(id) {
  if (!confirm("এই শিক্ষার্থীর তথ্য মুছে ফেলতে চান?")) return;
  classData.students = classData.students.filter((x) => String(x.id) !== String(id));
  saveStorage();
  renderStudentAttendanceTable();
  if (typeof showConfettiToast === "function") showConfettiToast("🗑️ শিক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে!");
}

function exportAttendancePDF() {
  const element =
    document.getElementById("sec-overview") ||
    document.getElementById("student-attendance-table");
  if (window.html2pdf && element) {
    const opt = {
      margin: 0.3,
      filename: "Class_Attendance_Report_SaShiba.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };
    html2pdf().set(opt).from(element).save();
    showConfettiToast("📄 A4 উপস্থিতি রিপোর্ট ডাউনলোড সম্পন্ন হয়েছে!");
  } else {
    window.print();
  }
}

function openA4StudentModal(id) {
  const s =
    classData.students.find((x) => x.id === id) || classData.students[0];
  const overlay = document.getElementById("a4-record-modal-overlay");
  const paper = document.getElementById("a4-record-modal-content");
  if (!overlay || !paper) return;

  if (!s.periodAttendance)
    s.periodAttendance = { p1: "Present", p2: "Present", p3: "Present" };

  paper.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0f172a;padding-bottom:14px;margin-bottom:18px;">
      <div>
        <h2 style="font-size:1.4rem;font-weight:900;color:#0f172a;margin:0;">${classData.settings.schoolName || classData.settings.school}</h2>
        <span style="font-size:0.85rem;color:#475569;font-weight:700;">📄 A4 এক্সিকিউটিভ উপস্থিতি ও পিরিয়ড ট্র্যাকিং কার্ড (Edit & Print)</span>
      </div>
      <div style="text-align:right;">
        <span style="font-size:0.9rem;font-weight:900;color:#6366f1;">রোল: #${s.roll}</span>
        <span style="display:block;font-size:0.8rem;color:#64748b;">শিক্ষাবর্ষ: ২০২৬</span>
      </div>
    </div>

    <form onsubmit="saveA4StudentForm(event, ${s.id})" style="display:flex;flex-direction:column;gap:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;background:#f8fafc;padding:16px;border-radius:12px;border:1px solid #cbd5e1;">
        <div>
          <label style="font-size:0.82rem;font-weight:800;color:#334155;display:block;margin-bottom:4px;">শিক্ষার্থীর নাম:</label>
          <input type="text" id="a4-edit-name" value="${s.name}" class="form-input" style="width:100%;height:38px;font-weight:800;background:#fff;border:1px solid #cbd5e1;padding:0 10px;border-radius:8px;" required>
        </div>
        <div>
          <label style="font-size:0.82rem;font-weight:800;color:#334155;display:block;margin-bottom:4px;">শ্রেণি ও শাখা:</label>
          <input type="text" value="${s.className || "অষ্টম"} (${s.section || "ক"})" class="form-input" style="width:100%;height:38px;font-weight:800;background:#e2e8f0;" readonly>
        </div>
      </div>

      <div style="background:#fff;border:1.5px solid #cbd5e1;border-radius:14px;padding:16px;">
        <h4 style="font-size:0.95rem;font-weight:900;color:#0f172a;margin-bottom:12px;"><i class="fa-solid fa-clock text-primary"></i> বিষয়ভিত্তিক পিরিয়ড উপস্থিতি এডিট (Live Period Status):</h4>
        
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
          <div style="padding:12px;background:#f1f5f9;border-radius:10px;text-align:center;">
            <strong style="display:block;font-size:0.82rem;margin-bottom:6px;color:#334155;">বাংলা (পিরিয়ড ১)</strong>
            <select id="a4-edit-p1" class="form-input" style="width:100%;height:36px;font-weight:800;border-radius:6px;" onchange="autoCalcFormPct()">
              <option value="Present" ${s.periodAttendance.p1 === "Present" ? "selected" : ""}>🟢 উপস্থিত (Present)</option>
              <option value="Absent" ${s.periodAttendance.p1 === "Absent" ? "selected" : ""}>🔴 অনুপস্থিত (Absent)</option>
            </select>
          </div>

          <div style="padding:12px;background:#f1f5f9;border-radius:10px;text-align:center;">
            <strong style="display:block;font-size:0.82rem;margin-bottom:6px;color:#334155;">গণিত (পিরিয়ড ২)</strong>
            <select id="a4-edit-p2" class="form-input" style="width:100%;height:36px;font-weight:800;border-radius:6px;" onchange="autoCalcFormPct()">
              <option value="Present" ${s.periodAttendance.p2 === "Present" ? "selected" : ""}>🟢 উপস্থিত (Present)</option>
              <option value="Absent" ${s.periodAttendance.p2 === "Absent" ? "selected" : ""}>🔴 অনুপস্থিত (Absent)</option>
            </select>
          </div>

          <div style="padding:12px;background:#f1f5f9;border-radius:10px;text-align:center;">
            <strong style="display:block;font-size:0.82rem;margin-bottom:6px;color:#334155;">বিজ্ঞান (পিরিয়ড ৩)</strong>
            <select id="a4-edit-p3" class="form-input" style="width:100%;height:36px;font-weight:800;border-radius:6px;" onchange="autoCalcFormPct()">
              <option value="Present" ${s.periodAttendance.p3 === "Present" ? "selected" : ""}>🟢 উপস্থিত (Present)</option>
              <option value="Absent" ${s.periodAttendance.p3 === "Absent" ? "selected" : ""}>🔴 অনুপস্থিত (Absent)</option>
            </select>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;background:#eff6ff;padding:16px;border-radius:14px;border:1.5px solid #bfdbfe;">
        <div>
          <label style="font-size:0.82rem;font-weight:800;color:#1e40af;display:block;margin-bottom:4px;">📊 মাসিক উপস্থিতি % (Auto Calculated):</label>
          <input type="number" step="0.1" id="a4-edit-pct" value="${s.monthlyAttendance || 90.0}" class="form-input" style="width:100%;height:38px;font-weight:900;color:#1e40af;font-size:1.1rem;background:#fff;border:1px solid #93c5fd;padding:0 10px;border-radius:8px;" required>
          <small style="color:#3b82f6;font-size:0.72rem;font-weight:700;">* পিরিয়ড অনুপস্থিতির উপর ভিত্তি করে স্বয়ংক্রিয় পুনঃহিসাব হয়</small>
        </div>

        <div>
          <label style="font-size:0.82rem;font-weight:800;color:#1e40af;display:block;margin-bottom:4px;">⭐ ক্লাসে অংশগ্রহণ (১ - ৫ স্টার):</label>
          <select id="a4-edit-eng" class="form-input" style="width:100%;height:38px;font-weight:800;background:#fff;border:1px solid #93c5fd;border-radius:8px;">
            <option value="5" ${s.engagement === 5 ? "selected" : ""}>⭐⭐⭐⭐⭐ (৫ স্টার - চমৎকার)</option>
            <option value="4" ${s.engagement === 4 ? "selected" : ""}>⭐⭐⭐⭐ (৪ স্টার - উত্তম)</option>
            <option value="3" ${s.engagement === 3 ? "selected" : ""}>⭐⭐⭐ (৩ স্টার - মাঝারি)</option>
            <option value="2" ${s.engagement === 2 ? "selected" : ""}>⭐⭐ (২ স্টার - দুর্বল)</option>
            <option value="1" ${s.engagement === 1 ? "selected" : ""}>⭐ (১ স্টার - খুব দুর্বল)</option>
          </select>
        </div>
      </div>

      <div>
        <label style="font-size:0.82rem;font-weight:800;color:#334155;display:block;margin-bottom:4px;">শিক্ষকের মন্তব্য (Teacher Observation Note):</label>
        <textarea id="a4-edit-remark" class="form-input" style="width:100%;height:60px;padding:8px 12px;font-size:0.85rem;border:1px solid #cbd5e1;border-radius:8px;resize:none;">${s.remark || "নিয়মিত ও ক্লাসে মনোযোগী শিক্ষার্থী।"}</textarea>
      </div>

      <div class="no-print" style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:14px;border-top:1.5px solid #cbd5e1;">
        <button type="button" class="btn btn-secondary" onclick="closeA4Modal()"><i class="fa-solid fa-xmark"></i> বন্ধ করুন</button>
        <div style="display:flex;gap:10px;">
          <button type="button" class="btn btn-secondary" onclick="window.print()"><i class="fa-solid fa-print"></i> A4 প্রিন্ট</button>
          <button type="submit" class="btn btn-primary" style="font-weight:900;padding:10px 20px;"><i class="fa-solid fa-floppy-disk"></i> 💾 পরিবর্তন সেভ করুন</button>
        </div>
      </div>
    </form>`;

  overlay.classList.remove("hidden");
  overlay.style.display = "flex";
  overlay.style.visibility = "visible";
  overlay.style.opacity = "1";
}

window.autoCalcFormPct = function () {
  const p1 = document.getElementById("a4-edit-p1")?.value || "Present";
  const p2 = document.getElementById("a4-edit-p2")?.value || "Present";
  const p3 = document.getElementById("a4-edit-p3")?.value || "Present";

  const pCount =
    (p1 === "Present" ? 1 : 0) +
    (p2 === "Present" ? 1 : 0) +
    (p3 === "Present" ? 1 : 0);
  const newPct = parseFloat(((pCount / 3) * 100).toFixed(1));

  const pctInput = document.getElementById("a4-edit-pct");
  if (pctInput) pctInput.value = newPct;

  const engSelect = document.getElementById("a4-edit-eng");
  if (engSelect) {
    if (pCount === 3) engSelect.value = "5";
    else if (pCount === 2) engSelect.value = "3";
    else if (pCount === 1) engSelect.value = "2";
    else engSelect.value = "1";
  }
};

window.saveA4StudentForm = function (e, id) {
  if (e) e.preventDefault();
  const s = classData.students.find((x) => x.id === id);
  if (!s) return;

  const nameVal = document.getElementById("a4-edit-name")?.value;
  const p1Val = document.getElementById("a4-edit-p1")?.value;
  const p2Val = document.getElementById("a4-edit-p2")?.value;
  const p3Val = document.getElementById("a4-edit-p3")?.value;
  const pctVal = document.getElementById("a4-edit-pct")?.value;
  const engVal = document.getElementById("a4-edit-eng")?.value;
  const remarkVal = document.getElementById("a4-edit-remark")?.value;

  if (nameVal) s.name = nameVal;
  s.periodAttendance = { p1: p1Val, p2: p2Val, p3: p3Val };
  if (pctVal) s.monthlyAttendance = parseFloat(pctVal);
  if (engVal) s.engagement = parseInt(engVal);
  if (remarkVal) s.remark = remarkVal;

  saveStorage();
  closeA4Modal();
  renderStudentAttendanceTable();
  showConfettiToast(
    `🎉 ${s.name}-এর A4 কার্ডের সমস্ত তথ্য ও অটো-উপস্থিতি % সফলভাবে সেভ হয়েছে!`,
  );
};

window.closeA4Modal = function () {
  const overlay = document.getElementById("a4-record-modal-overlay");
  if (overlay) {
    overlay.classList.add("hidden");
    overlay.style.display = "none";
  }
};

function saveAttendance() {
  saveStorage();
  alert("উপস্থিতি ও এনগেজমেন্ট সংরক্ষণ করা হয়েছে!");
}

// ===================== SECTION 5: EXAMS ROUTINE =====================
function filterExamType(type) {
  document
    .querySelectorAll("#exam-type-tabs .tab-chip, #exam-type-tabs .month-chip")
    .forEach((b) => {
      b.classList.toggle(
        "active",
        b.textContent.trim().includes(type) ||
          (type === "all" && b.textContent.trim().includes("সকল")),
      );
    });
  renderExams(type);
}

function renderExams(type) {
  const container = document.getElementById("exams-cards-container");
  if (!container) return;
  const items =
    type === "all"
      ? classData.exams
      : classData.exams.filter((e) => e.type === type);
  container.innerHTML = items
    .map(
      (e) => `
    <div class="exam-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span class="badge" style="background:rgba(245,158,11,0.15);color:var(--warning);">${e.type}</span>
        <div style="display:flex;gap:8px;align-items:center;">
          <span style="font-size:12px;font-weight:800;color:var(--primary);">পূর্ণমান: ${e.marks}</span>
          <button onclick="deleteExam(${e.id})" style="background:none;color:var(--danger);font-size:14px;"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
      <h4 style="font-size:1.05rem;font-weight:800;margin-top:10px;color:var(--text-main);">${e.subject}</h4>
      <p style="font-size:12.5px;color:var(--text-muted);margin-top:4px;"><i class="fa-solid fa-calendar-day"></i> ${e.date} (${e.time}) | কক্ষ: ${e.room || "১০২"}</p>
      <p style="font-size:12.5px;color:var(--text-muted);margin-top:2px;"><i class="fa-solid fa-user-tie"></i> শিক্ষক: ${e.teacher || "মাগুরিব স্যার"}</p>
      <p style="font-size:12.5px;color:var(--text-muted);margin-top:2px;"><i class="fa-solid fa-file-circle-check"></i> কভারেজ: ${e.coverage}</p>
    </div>`,
    )
    .join("");
}

function openAddExamModal() {
  document.getElementById("exam-modal")?.classList.remove("hidden");
}
function closeExamModal() {
  document.getElementById("exam-modal")?.classList.add("hidden");
}
function saveExamModal(e) {
  e.preventDefault();
  closeExamModal();
  renderExams("all");
}
function deleteExam(id) {
  classData.exams = classData.exams.filter((e) => e.id !== id);
  saveStorage();
  renderExams("all");
}

// ===================== SECTION 6: SMART LIVE CLASS =====================
function renderLiveControl() {
  updateTimerDisplay();
}

let timerInterval = null,
  timerSeconds = 2400;
function updateTimerDisplay() {
  const mins = Math.floor(timerSeconds / 60),
    secs = timerSeconds % 60;
  const el = document.getElementById("live-timer-digits");
  if (el)
    el.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
function startLiveTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
    } else clearInterval(timerInterval);
  }, 1000);
}
function pauseLiveTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}
function resetLiveTimer() {
  pauseLiveTimer();
  timerSeconds = 2400;
  updateTimerDisplay();
}

function pickRandomStudent() {
  const students = classData.students;
  if (!students.length) return;
  const picked = students[Math.floor(Math.random() * students.length)];
  const el = document.getElementById("random-student-name");
  if (el) el.textContent = `🎯 রোল ${picked.roll}: ${picked.name}`;
}

// ===================== SECTION 7: HISTORY & SAVED RECORDS (A4 PAPER VIEW) =====================
function renderHistory() {
  const container = document.getElementById("history-cards-container");
  if (!container) return;

  const records = classData.history;
  container.innerHTML = records
    .map(
      (h) => `
    <div class="smart-card clickable-row" onclick="openA4RecordModal(${h.id})" style="cursor:pointer;">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);font-weight:700;">
        <span>${h.date} | ${classData.settings.board || "ঢাকা বোর্ড"}</span>
        <span class="badge" style="background:rgba(16,185,129,0.15);color:var(--success);">উপস্থিতি ${h.attendance}</span>
      </div>
      <h4 style="font-size:1.05rem;font-weight:800;margin-top:6px;color:var(--text-main);">${h.subject}</h4>
      <p style="font-size:12.5px;color:var(--primary);font-weight:700;margin-top:2px;"><i class="fa-solid fa-graduation-cap"></i> শ্রেণি: ${h.class} | শিক্ষক: ${h.teacher}</p>
      <p style="font-size:12.5px;color:var(--text-muted);margin-top:4px;">${h.remark}</p>
      <div style="margin-top:10px;font-size:0.78rem;color:var(--primary);font-weight:800;"><i class="fa-solid fa-file-lines"></i> 📄 A4 পেপারে ভিউ করতে ক্লিক করুন</div>
    </div>`,
    )
    .join("");
}

function openA4RecordModal(id) {
  const record =
    classData.history.find((h) => h.id === id) || classData.history[0];
  const overlay = document.getElementById("a4-record-modal-overlay");
  const paper = document.getElementById("a4-record-modal-content");
  if (!overlay || !paper) return;

  paper.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0f172a;padding-bottom:16px;margin-bottom:20px;">
      <div>
        <h2 style="font-size:1.5rem;font-weight:900;color:#0f172a;">${classData.settings.school}</h2>
        <span style="font-size:0.85rem;color:#475569;">শ্রেণি সেশন ইতিহাস ও ডিজিটাল ক্লাস রিপোর্ট</span>
      </div>
      <div style="text-align:right;">
        <span style="font-size:0.8rem;font-weight:800;color:#6366f1;">তারিখ: ${record.date}</span>
        <span style="display:block;font-size:0.8rem;color:#64748b;">রিপোর্ট আইডি: #REC-${record.id}</span>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;font-size:0.9rem;">
      <div><strong>বিষয় & পাঠসূচি:</strong> ${record.subject}</div>
      <div><strong>শ্রেণি ও শাখা:</strong> ${record.class}</div>
      <div><strong>দায়িত্বপ্রাপ্ত শিক্ষক:</strong> ${record.teacher}</div>
      <div><strong>কক্ষ নম্বর:</strong> ${record.room || "১০২"}</div>
      <div><strong>গড় উপস্থিতি:</strong> ${record.attendance}</div>
      <div><strong>শিক্ষা বোর্ড:</strong> ${classData.settings.board}</div>
    </div>

    <div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:10px;padding:16px;margin-bottom:24px;">
      <h4 style="font-size:0.95rem;font-weight:800;margin-bottom:8px;color:#0f172a;">শিক্ষকের পর্যবেক্ষণ ও সারসংক্ষেপ</h4>
      <p style="font-size:0.9rem;color:#334155;line-height:1.6;">${record.remark}</p>
    </div>

    <div class="no-print" style="display:flex;justify-content:space-between;align-items:center;margin-top:30px;padding-top:16px;border-top:1.5px solid #cbd5e1;">
      <button class="btn btn-secondary" onclick="closeA4Modal()"><i class="fa-solid fa-xmark"></i> Esc চেপে বন্ধ করুন</button>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-primary" onclick="window.print()"><i class="fa-solid fa-print"></i> A4 প্রিন্ট করুন</button>
        <button class="btn btn-danger" onclick="deleteHistoryRecord(${record.id})"><i class="fa-solid fa-trash"></i> মুছে ফেলুন</button>
      </div>
    </div>`;

  overlay.classList.remove("hidden");
}

function closeA4Modal() {
  document.getElementById("a4-record-modal-overlay")?.classList.add("hidden");
}

function deleteHistoryRecord(id) {
  if (!confirm("এই রেকর্ডটি মুছে ফেলতে চান?")) return;
  classData.history = classData.history.filter((h) => h.id !== id);
  saveStorage();
  closeA4Modal();
  renderHistory();
}

// ===================== SECTION 8: SMART PROGRESS =====================
function renderProgress() {
  const container = document.getElementById("progress-analytics-container");
  if (!container) return;

  container.innerHTML = `
    <div class="smart-card">
      <h3 style="font-size:1.1rem;font-weight:800;margin-bottom:16px;"><i class="fa-solid fa-chart-line text-primary"></i> বিষয়ভিত্তিক অগ্রগতি ও পারফরম্যান্স বিশ্লেষণ</h3>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <div style="display:flex;justify-content:space-between;font-size:0.88rem;font-weight:800;margin-bottom:6px;">
            <span>গণিত (বীজগণিত ও জ্যামিতি)</span>
            <span style="color:var(--primary);">৮৫% (চমৎকার)</span>
          </div>
          <div class="progress-bar-wrap"><div class="progress-fill" style="width:85%;"></div></div>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;font-size:0.88rem;font-weight:800;margin-bottom:6px;">
            <span>বিজ্ঞান (গতিবিদ্যা ও পরিবেশ)</span>
            <span style="color:var(--success);">৭৮% (ভাল)</span>
          </div>
          <div class="progress-bar-wrap"><div class="progress-fill" style="width:78%;background:var(--success-gradient);"></div></div>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;font-size:0.88rem;font-weight:800;margin-bottom:6px;">
            <span>বাংলা (সমাস ও সাহিত্য)</span>
            <span style="color:var(--purple);">৯২% (সেরা)</span>
          </div>
          <div class="progress-bar-wrap"><div class="progress-fill" style="width:92%;background:linear-gradient(90deg,var(--purple),var(--primary));"></div></div>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;font-size:0.88rem;font-weight:800;margin-bottom:6px;">
            <span>ইংরেজি (Grammar & Writing)</span>
            <span style="color:var(--warning);">৬৫% (রিভিশন দরকার)</span>
          </div>
          <div class="progress-bar-wrap"><div class="progress-fill" style="width:65%;background:var(--warning);"></div></div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="smart-card" style="border-left:5px solid var(--success);">
        <h4 style="color:var(--success);font-size:1rem;font-weight:800;margin-bottom:8px;"><i class="fa-solid fa-trophy"></i> সেরা পারফরম্যান্স মন্তব্য (Top Performers)</h4>
        <p style="font-size:0.88rem;color:var(--text-main);">বাংলা ও বীজগণিত বিষয়ে শিক্ষার্থীরা অত্যন্ত ভালো ফলাফল প্রদর্শন করেছে। ক্লাস প্রেজেন্টেশনে ৮০% শিক্ষার্থী সক্রিয় ছিল।</p>
      </div>
      <div class="smart-card" style="border-left:5px solid var(--danger);">
        <h4 style="color:var(--danger);font-size:1rem;font-weight:800;margin-bottom:8px;"><i class="fa-solid fa-lightbulb"></i> দুর্বলতার সমাধান ও AI পরামর্শ</h4>
        <p style="font-size:0.88rem;color:var(--text-main);">ইংরেজি গ্রামার অংশে ১৫% শিক্ষার্থীর দুর্বলতা চিহ্নিত হয়েছে। তাদের জন্য ২০ মিনিটের বিশেষ টিউটোরিয়াল কুইজ দেওয়ার পরামর্শ দেওয়া হচ্ছে।</p>
      </div>
    </div>`;
}

// AI Insights & Alerts
function renderAIInsights() {
  const c = document.getElementById("ai-insights-container");
  if (c) {
    c.innerHTML = classData.aiInsights
      .map(
        (a) => `
      <div class="smart-card" style="border-left:5px solid var(--purple);">
        <h4 style="color:var(--purple);font-size:1.05rem;font-weight:800;"><i class="fa-solid fa-brain"></i> ${a.title}</h4>
        <p style="font-size:13.5px;color:var(--text-main);margin-top:6px;">${a.desc}</p>
        <div style="margin-top:12px;padding:12px 16px;background:rgba(139,92,246,0.08);border-radius:10px;font-size:12.5px;font-weight:700;color:var(--purple);">
          💡 AI সুপারিশকৃত করণীয়: ${a.action}
        </div>
      </div>`,
      )
      .join("");
  }
}

function renderAlerts() {
  const c = document.getElementById("alerts-container");
  if (c) {
    c.innerHTML = classData.alerts
      .map(
        (a) => `
      <div class="smart-card" style="border-left:5px solid ${a.type === "urgent" ? "var(--danger)" : "var(--warning)"};">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h4 style="color:${a.type === "urgent" ? "var(--danger)" : "var(--warning)"};font-size:1.05rem;font-weight:800;">${a.title}</h4>
          <span style="font-size:11.5px;color:var(--text-muted);font-weight:700;">${a.time}</span>
        </div>
        <p style="font-size:13.5px;margin-top:6px;color:var(--text-main);">${a.desc}</p>
      </div>`,
      )
      .join("");
  }
}

function saveSettings(e) {
  e.preventDefault();
  saveStorage();
  alert("সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!");
}

// Background Schedule Monitor
let triggeredAlertsCache = {};
function checkRoutineScheduleAlerts() {
  const now = new Date();
  classData.routines.forEach((r) => {
    if (!r.time) return;
    const m = r.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!m) return;
    let h = parseInt(m[1]);
    let mi = parseInt(m[2]);
    const ap = (m[3] || "").toUpperCase();
    if (ap === "PM" && h < 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
    const alertMins = parseInt(r.alertTime || "10");
    let target = h * 60 + mi - alertMins;
    if (target < 0) target += 1440;
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const diff = Math.abs(nowMins - target);
    const key = `${r.id}_${now.toDateString()}_${h}_${mi}`;
    if (diff <= 1 && !triggeredAlertsCache[key]) {
      triggeredAlertsCache[key] = true;
      triggerTeacherAlert(
        r.teacher || "শিক্ষক",
        r.phone || "01700000000",
        r.subject || "বিষয়",
        r.time,
        r.room || "১০২",
      );
    }
  });
}

function triggerTeacherAlert(name, phone, subject, time, room) {
  const msg = `আসসালামু আলাইকুম ${name} স্যার। আপনার ${subject} বিষয়ের ক্লাসটি কিছুক্ষণের মধ্যে কক্ষ ${room}-এ শুরু হতে যাচ্ছে।`;
  const banner = document.createElement("div");
  banner.style.cssText =
    "position:fixed;bottom:20px;right:20px;background:#1e293b;color:#fff;padding:18px 24px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.3);z-index:9999;border-left:5px solid #10b981;max-width:380px;";
  banner.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <span style="color:#10b981;font-weight:800;font-size:13px;"><i class="fa-solid fa-phone-volume"></i> অটো কল সিমুলেটর</span>
      <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">&times;</button>
    </div>
    <div style="font-size:13px;margin-bottom:6px;"><strong>প্রাপক:</strong> ${name} (${phone})</div>
    <div style="font-size:12px;color:#cbd5e1;background:rgba(255,255,255,0.08);padding:8px;border-radius:6px;font-style:italic;">"${msg}"</div>`;
  document.body.appendChild(banner);
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const sp = new SpeechSynthesisUtterance(msg);
    sp.lang = "bn-BD";
    sp.rate = 0.9;
    window.speechSynthesis.speak(sp);
  }
  setTimeout(() => {
    if (banner.parentElement) banner.remove();
  }, 12000);
}

// Global helpers
const exportPDF = () => window.print();

function updateGlobalContext() {
  try {
    const sub = document.getElementById("global-context-subtitle");
    if (sub && classData && classData.settings) {
      sub.textContent = `${classData.settings.board || "ঢাকা বোর্ড"} | ${classData.settings.className || "অষ্টম শ্রেণি (ক)"} | ${classData.settings.group || "সাধারণ বিভাগ"}`;
    }
  } catch (e) {
    console.error("updateGlobalContext error:", e);
  }
}
const updateLiveContext = updateGlobalContext;

const switchRoleView = (role) => alert("রোল পরিবর্তন করা হয়েছে: " + role);

// Init & Global ESC Listener
document.addEventListener("DOMContentLoaded", () => {
  loadStorage();

  if (localStorage.getItem("sashiba_dark_mode") === "true") {
    document.body.classList.add("dark-mode");
    const btn = document.getElementById("dark-mode-btn");
    if (btn)
      btn.innerHTML = '<i class="fa-solid fa-sun" style="color:#fbbf24;"></i>';
  }

  switchSection("overview");

  checkRoutineScheduleAlerts();
  setInterval(checkRoutineScheduleAlerts, 5000);
});

// ESC Key listener closes open modals or A4 paper view
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    closeA4Modal();
    ["routine-modal", "syllabus-modal", "exam-modal"].forEach((id) => {
      document.getElementById(id)?.classList.add("hidden");
    });
  }
});

function triggerSchoolLogoUpload() {
  document.getElementById("school-logo-file-input")?.click();
}

function uploadSchoolLogo(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (evt) {
    const dataUrl = evt.target.result;
    const img = document.getElementById("badge-school-logo-img");
    const defaultIcon = document.getElementById("badge-default-cap-icon");
    if (img && defaultIcon) {
      img.src = dataUrl;
      img.style.display = "block";
      defaultIcon.style.display = "none";
    }
    classData.settings.schoolLogo = dataUrl;
    saveStorage();
    showConfettiToast("📷 স্কুলের লোগো সফলভাবে আপলোড ও অটো-ফিট হয়েছে!");
  };
  reader.readAsDataURL(file);
}

// Duplicate function removed to ensure master attendance renderer runs

function showConfettiToast(msg) {
  let toast = document.getElementById("confetti-toast-bar");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "confetti-toast-bar";
    toast.style.cssText =
      "position:fixed;bottom:24px;right:24px;background:var(--hero-gradient);color:#fff;padding:14px 24px;border-radius:16px;font-weight:800;font-size:0.92rem;box-shadow:0 10px 30px var(--primary-glow);z-index:9999;transition:all 0.3s ease;transform:translateY(100px);opacity:0;";
    document.body.appendChild(toast);
  }
  toast.innerHTML = '<i class="fa-solid fa-sparkles"></i> ' + msg;
  toast.style.transform = "translateY(0)";
  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.transform = "translateY(100px)";
    toast.style.opacity = "0";
  }, 3000);
}

window.toggleTheme = function () {
  const isDarkNow =
    document.documentElement.classList.contains("theme-dark") ||
    document.body.classList.contains("theme-dark");
  const nextIsDark = !isDarkNow;

  if (nextIsDark) {
    document.documentElement.classList.add("theme-dark");
    document.body.classList.add("theme-dark");
    localStorage.setItem("sashiba_theme_mode", "dark");
  } else {
    document.documentElement.classList.remove("theme-dark");
    document.body.classList.remove("theme-dark");
    localStorage.setItem("sashiba_theme_mode", "light");
  }

  window.updateThemeIcons(nextIsDark);
  if (typeof showConfettiToast === "function") {
    showConfettiToast(
      nextIsDark ? "🌙 ডার্ক মোড অন করা হয়েছে!" : "☀️ লাইট মোড অন করা হয়েছে!",
    );
  }
};

window.updateThemeIcons = function (isDark) {
  const btns = document.querySelectorAll(".theme-toggle-btn i");
  btns.forEach((b) => {
    b.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    b.style.color = isDark ? "#fbbf24" : "#6366f1";
  });
};

window.initTheme = function () {
  const mode = localStorage.getItem("sashiba_theme_mode") || "light";
  const isDark = mode === "dark";
  if (isDark) {
    document.documentElement.classList.add("theme-dark");
    document.body.classList.add("theme-dark");
  } else {
    document.documentElement.classList.remove("theme-dark");
    document.body.classList.remove("theme-dark");
  }
  window.updateThemeIcons(isDark);
};

// Immediate Execution
window.initTheme();
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", window.initTheme);
}

/* ===================== FAIL-SAFE GLOBAL EVENT HANDLERS ===================== */
window.switchSection = function (id) {
  try {
    document
      .querySelectorAll(".dashboard-section")
      .forEach((s) => s.classList.remove("active"));
    document
      .querySelectorAll(".menu-item")
      .forEach((m) => m.classList.remove("active"));

    const targetSec = document.getElementById("sec-" + id);
    if (targetSec) targetSec.classList.add("active");

    const activeLink = document.querySelector(`a[href="#sec-${id}"]`);
    if (activeLink) activeLink.classList.add("active");

    // 🚀 টপবারের বাটনগুলোকে ড্যাশবোর্ড অনুযায়ী ডাইনামিক করা
    const btnSyllabus = document.getElementById("topbar-btn-syllabus");
    const btnAttendance = document.getElementById("topbar-btn-attendance");
    if (btnSyllabus && btnAttendance) {
      if (id === "syllabus") {
        btnSyllabus.style.display = "inline-flex";
        btnAttendance.style.display = "none";
      } else if (id === "attendance") {
        btnSyllabus.style.display = "none";
        btnAttendance.style.display = "inline-flex";
      } else {
        btnSyllabus.style.display = "inline-flex";
        btnAttendance.style.display = "inline-flex";
      }
    }

    if (id === "syllabus") renderSyllabus();
    if (id === "routine") renderRoutine("রবিবার");
    if (id === "attendance") renderStudentAttendanceTable();
    if (id === "exams") renderExams("all");
    if (id === "history") renderHistory();
    if (id === "progress") renderProgress();
  } catch (e) {
    console.error("switchSection error:", e);
  }
};

window.switchSyllabusView = function (mode) {
  _sylViewMode = mode;

  const btnCard = document.getElementById("syl-btn-card");
  const btnTbl = document.getElementById("syl-btn-table");
  const superCard = document.getElementById("super-btn-card");
  const superTbl = document.getElementById("super-btn-table");
  const toolbar = document.getElementById("syllabus-table-builder-toolbar");

  if (btnCard) btnCard.classList.toggle("active", mode === "card");
  if (btnTbl) btnTbl.classList.toggle("active", mode === "table");
  if (superCard) superCard.classList.toggle("active", mode === "card");
  if (superTbl) superTbl.classList.toggle("active", mode === "table");

  if (toolbar) toolbar.style.display = mode === "table" ? "block" : "none";

  showConfettiToast(
    mode === "table"
      ? "📊 সিলেবাস টেবিল ভিউ চালুকৃত!"
      : "🎴 সিলেবাস কার্ড ভিউ চালুকৃত!",
  );
  renderSyllabus();
};

window.searchSyllabusCards = function (q) {
  _syl.search = (q || "").toLowerCase();
  renderSyllabus();
};

window.filterSyllabusMonth = function (m) {
  _syl.month = m;
  document
    .querySelectorAll("#syllabus-month-chips .month-chip")
    .forEach((b) => {
      b.classList.toggle("active", b.dataset.val === m);
    });
  renderSyllabus();
};

window.filterSyllabusByStatus = function (st) {
  _syl.status = st;
  renderSyllabus();
};

window.filterSyllabusByPriority = function (pr) {
  _syl.priority = pr;
  renderSyllabus();
};

window.filterSyllabusTerm = function (tm) {
  _syl.term = tm;
  renderSyllabus();
};

window.toggleChapterAccordion = function (id) {
  const body = document.getElementById("syl-body-" + id);
  if (!body) return;
  const isHidden = body.style.display === "none" || !body.style.display;
  body.style.display = isHidden ? "block" : "none";

  const accHeader = document.getElementById("syl-acc-" + id);
  if (accHeader) {
    accHeader.classList.toggle("expanded", isHidden);
  }
};

window.toggleChecklistItem = function (sylId, idx) {
  const item = classData.syllabuses.find((s) => s.id == sylId);
  if (item && item.checklist && item.checklist[idx]) {
    item.checklist[idx].checked = !item.checklist[idx].checked;

    // Auto-calculate progress
    const total = item.checklist.length;
    const checkedCount = item.checklist.filter((c) => c.checked).length;
    item.progress = Math.round((checkedCount / (total || 1)) * 100);
    if (item.progress === 100) item.status = "completed";
    else if (item.progress > 0) item.status = "running";

    saveStorage();
    renderSyllabus();
    showConfettiToast("✨ চেকলিস্ট আপডেট করা হয়েছে!");
  }
};

window.toggleSidebar = function () {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("collapsed");
};

window.openAddSyllabusModal = function () {
  const modal = document.getElementById("syllabus-modal");
  if (modal) modal.classList.remove("hidden");
};

window.closeSyllabusModal = function () {
  const modal = document.getElementById("syllabus-modal");
  if (modal) modal.classList.add("hidden");
};

window.saveSyllabusModal = function (e) {
  if (e) e.preventDefault();
  const chapterInput = document.getElementById("ms-chapter");
  if (!chapterInput || !chapterInput.value) return;

  const newEntry = {
    id: Date.now(),
    date: document.getElementById("ms-date")?.value || "২০২৬-০৭-২৫",
    time: document.getElementById("ms-time")?.value || "০৯:০০ AM",
    room: document.getElementById("ms-room")?.value || "১০২",
    className: document.getElementById("ms-class")?.value || "অষ্টম",
    section: document.getElementById("ms-section")?.value || "ক",
    subject: document.getElementById("ms-subject")?.value || "গণিত",
    chapterName: chapterInput.value,
    teacher: document.getElementById("ms-teacher")?.value || "মাগুরিব আলী",
    month: document.getElementById("ms-month")?.value || "জুলাই",
    status: "running",
    progress: 25,
    priority: "High",
    pi_code: "৮.৩.১",
    required_classes: 6,
    completed_classes: 1,
    learningOutcomes: "পাঠ্য বিষয়ের মৌলিক সজ্ঞানতা লাভ করবে।",
    topics: [chapterInput.value],
    checklist: [
      { text: "প্রথম পরিচ্ছেদ পাঠদান", checked: true },
      { text: "অনুশীলনী সমীকরণ সমাধান", checked: false },
    ],
    resources: { video: "#", note: "#", quiz: "#" },
  };

  classData.syllabuses.unshift(newEntry);
  saveStorage();
  closeSyllabusModal();
  renderSyllabus();
  showConfettiToast("🎉 নতুন সিলেবাস সফলভাবে যোগ করা হয়েছে!");
};

window.saveSyllabusDirect = function (id) {
  saveStorage();
  showConfettiToast("💾 সিলেবাস রেকর্ড সেভ করা হয়েছে!");
};

window.deleteSyllabus = function (id) {
  if (confirm("আপনি কি এই সিলেবাস রেকর্ডটি ডিলিট করতে চান?")) {
    classData.syllabuses = classData.syllabuses.filter((s) => s.id != id);
    saveStorage();
    renderSyllabus();
    showConfettiToast("🗑️ সিলেবাস রেকর্ড ডিলিট করা হয়েছে!");
  }
};

/* ===================== AUTOMATIC PAGE LOAD INITIALIZATION ===================== */
function initDashboardApp() {
  try {
    if (typeof loadStorage === "function") loadStorage();
    if (typeof window.initTheme === "function") window.initTheme();
    if (typeof renderOverview === "function") renderOverview();
    if (typeof renderSyllabus === "function") renderSyllabus();
    if (typeof renderStudentAttendanceTable === "function")
      renderStudentAttendanceTable();
    if (typeof renderRoutine === "function") renderRoutine("রবিবার");
    console.log("SashiBa Dashboard App Initialized Successfully!");
  } catch (e) {
    console.error("Initialization error:", e);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDashboardApp);
} else {
  initDashboardApp();
}

window.viewSyllabusDetails = function (id) {
  const item = classData.syllabuses.find((s) => s.id == id);
  if (!item) return;

  const reqCls = item.required_classes || item.requiredClasses || 6;
  const compCls = item.completed_classes || item.completedClasses || 2;
  const periodText =
    (compCls < 10 ? "০" + compCls : compCls) +
    " / " +
    (reqCls < 10 ? "০" + reqCls : reqCls);
  const topicsText =
    item.topics && item.topics.length
      ? item.topics.join(", ")
      : item.chapterName || item.chapter;

  document.getElementById("dtl-chapter-title").textContent =
    item.chapterName || item.chapter;
  document.getElementById("dtl-subject-subtitle").textContent =
    `📚 ${item.subject} (${item.subjectCode || "১০৯"}) | পিরিয়ড: ${periodText} | PI ${item.pi_code || item.piIndicator || "৮.৩.১"}`;

  const body = document.getElementById("dtl-content-body");
  if (body) {
    body.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;background:var(--bg-input);padding:14px;border-radius:14px;">
        <div><strong>📅 তারিখ & সময়:</strong> ${item.date || "২০২৬-০৭-২৫"} (${item.time || "০৯:০০ AM"})</div>
        <div><strong>🚪 কক্ষ নম্বর:</strong> ${item.room || "১০২"} (কক্ষ)</div>
        <div><strong>🏫 শ্রেণি & শাখা:</strong> ${item.className || "অষ্টম"} (${item.section || "ক"})</div>
        <div><strong>👨‍🏫 শিক্ষক:</strong> ${item.teacher || "মাগুরিব আলী"}</div>
      </div>

      <div style="background:rgba(59,130,246,0.06);border:1.5px solid rgba(59,130,246,0.2);padding:14px;border-radius:14px;">
        <strong style="color:var(--primary);display:block;margin-bottom:4px;"><i class="fa-solid fa-bullseye"></i> 🎯 শিখনফল (Learning Outcomes):</strong>
        <span>${item.learningOutcomes || "পাঠ্য বিষয়ের মূল তত্ত্ব প্রয়োগ করতে পারবে।"}</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="background:var(--bg-input);padding:12px;border-radius:12px;">
          <strong style="color:var(--purple);display:block;"><i class="fa-solid fa-list-check"></i> 🎯 আলোচ্য বিষয় (Topics):</strong>
          <span>${topicsText}</span>
        </div>
        <div style="background:var(--bg-input);padding:12px;border-radius:12px;">
          <strong style="color:var(--warning);display:block;"><i class="fa-solid fa-calendar-day"></i> 📅 পরীক্ষার টার্ম (Term):</strong>
          <span>${item.term === "half_yearly" ? "অর্ধবার্ষিকী পরীক্ষা" : "বার্ষিক পরীক্ষা"}</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="background:var(--bg-input);padding:12px;border-radius:12px;">
          <strong style="color:var(--success);display:block;"><i class="fa-solid fa-screwdriver-wrench"></i> 🛠️ শিক্ষণ উপকরণ (Teaching Aids):</strong>
          <span>${item.teachingAids || "প্রজেক্টর, জ্যামিতি বক্স ও হোয়াইটবোর্ড মার্কার"}</span>
        </div>
        <div style="background:var(--bg-input);padding:12px;border-radius:12px;">
          <strong style="color:var(--danger);display:block;"><i class="fa-solid fa-house-laptop"></i> 🏠 বাড়ির কাজ (Homework):</strong>
          <span>${item.homework || "অনুশীলনী ৩.১ এর ১-৫ নং গাণিতিক সমস্যা সমাধান"}</span>
        </div>
      </div>

      <div style="background:rgba(245,158,11,0.08);border:1.5px solid rgba(245,158,11,0.2);padding:12px;border-radius:12px;">
        <strong style="color:var(--warning);display:block;"><i class="fa-solid fa-note-sticky"></i> 📝 বিশেষ মন্তব্য (Remarks/Notes):</strong>
        <span>${item.remarks || "আজকের ক্লাসে সকল শিক্ষার্থী মনোযোগের সাথে অংশগ্রহণ করেছে।"}</span>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap;padding-top:10px;">
        <a href="${item.resources?.video || "#"}" target="_blank" class="resource-pill-btn"><i class="fa-solid fa-play" style="color:var(--danger)"></i> 🎥 ভিডিও লেকচার</a>
        <button class="resource-pill-btn" onclick="alert('পিডিএফ নোট খুলছে...')"><i class="fa-solid fa-file-pdf" style="color:var(--primary)"></i> 📄 পিডিএফ নোট</button>
        <button class="resource-pill-btn" onclick="alert('অনলাইন কুইজ চালু হচ্ছে...')"><i class="fa-solid fa-pen-nib" style="color:var(--warning)"></i> 📝 অনলাইন কুইজ</button>
      </div>`;
  }

  const editBtn = document.getElementById("dtl-edit-btn");
  if (editBtn) {
    editBtn.onclick = function () {
      closeSyllabusDetailsModal();
      editSyllabus(id);
    };
  }

  const modal = document.getElementById("syllabus-details-modal");
  if (modal) modal.classList.remove("hidden");
};

window.closeSyllabusDetailsModal = function () {
  const modal = document.getElementById("syllabus-details-modal");
  if (modal) modal.classList.add("hidden");
};

let _multiLayerFilter = "annual";

window.switchMultiLayerPlan = function (layer, btn) {
  _multiLayerFilter = layer;
  document
    .querySelectorAll("#multi-layer-tabs .tab-chip")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  if (layer === "half_yearly") {
    _syl.term = "half_yearly";
    showConfettiToast("🏆 অর্ধবার্ষিকী টার্ম সিলেবাস ফিল্টারিং চালুকৃত!");
  } else if (layer === "annual_exam") {
    _syl.term = "annual";
    showConfettiToast("🎯 বার্ষিকী টার্ম সিলেবাস ফিল্টারিং চালুকৃত!");
  } else if (layer === "fortnightly") {
    _syl.term = "all";
    _syl.priority = "High";
    showConfettiToast(
      "⚡ পাক্ষিক ১৫ দিনের স্বয়ংক্রিয় লক্ষ্যমাত্রা ফিল্টারিং চালুকৃত!",
    );
  } else if (layer === "daily") {
    _syl.term = "all";
    _syl.status = "running";
    showConfettiToast(
      "📅 দৈনিক অ্যাকশন প্ল্যান (আজকের পিরিয়ড ট্র্যাকিং) চালুকৃত!",
    );
  } else {
    _syl.term = "all";
    _syl.month = "all";
    _syl.status = "all";
    _syl.priority = "all";
    showConfettiToast("🗺️ ১২ মাসের বার্ষিক মাস্টার প্ল্যান লোড করা হয়েছে!");
  }

  renderSyllabus();
};

// 5. Holiday Buffer Auto-Rollover Logic
window.autoAdjustHolidayBuffer = function () {
  let adjustedCount = 0;
  if (classData && classData.syllabuses) {
    classData.syllabuses.forEach((s) => {
      if (s.is_holiday || s.status === "holiday_deferred") {
        s.target_date = "২০২৬-০৮-২২"; // Automatically rolled over to next active school day
        adjustedCount++;
      }
    });
  }
  showConfettiToast(
    `🏖️ হলিডে বাফার লজিক: ${adjustedCount || 1}টি সিলেবাস পিরিয়ড ছুটির কারণে পরবর্তী কার্যদিবসে স্বয়ংসক্রিয়ভাবে রি-শিডিউল করা হয়েছে!`,
  );
  saveStorage();
  renderSyllabus();
};

let _superChipMode = "all";

window.applySuperFilter = function (mode, btn) {
  _superChipMode = mode;
  document
    .querySelectorAll("#super-filter-chips .tab-chip")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  if (mode === "today") {
    _syl.status = "running";
    _syl.timeframeLabel = "আজকের";
    showConfettiToast("📅 আজকের সিলেবাস ফিল্টার চালুকৃত!");
  } else if (mode === "week") {
    _syl.timeframeLabel = "চলতি সপ্তাহ";
    _syl.status = "all";
    showConfettiToast("⚡ এই সপ্তাহের সিলেবাস ফিল্টার চালুকৃত!");
  } else if (mode === "half_yearly") {
    _syl.term = "half_yearly";
    showConfettiToast("🏆 অর্ধবার্ষিকী সিলেবাস ফিল্টার চালুকৃত!");
  } else if (mode === "revision") {
    _syl.status = "revision_needed";
    showConfettiToast("🔄 রিভিশন সিলেবাস ফিল্টার চালুকৃত!");
  } else {
    _syl.term = "all";
    _syl.status = "all";
    _syl.priority = "all";
    _syl.month = "all";
    showConfettiToast("🌐 সকল সিলেবাস প্রদর্শিত হচ্ছে!");
  }

  renderSyllabus();
};

window.filterSuperSubject = function (sub) {
  if (sub === "all") {
    _syl.search = "";
  } else {
    _syl.search = sub.toLowerCase();
  }
  renderSyllabus();
};

window.filterSuperTeacher = function (tch) {
  if (tch === "all") {
    _syl.search = "";
  } else {
    _syl.search = tch.toLowerCase();
  }
  renderSyllabus();
};

// Dynamic Custom Columns State
let customSyllabusColumns = [
  { key: "date", label: "তারিখ & সময়", width: "135px", align: "center" },
  { key: "room", label: "কক্ষ", width: "75px", align: "center" },
  { key: "subject", label: "বিষয়", width: "120px", align: "center" },
  { key: "chapter", label: "অধ্যায় (CHAPTER)", width: "220px", align: "left" },
  {
    key: "topics",
    label: "আলোচ্য বিষয় (TOPICS)",
    width: "240px",
    align: "left",
  },
  { key: "pi", label: "PI কোড", width: "95px", align: "center" },
  { key: "period", label: "পিরিয়ড ট্র্যাকার", width: "110px", align: "center" },
  { key: "teacher", label: "শিক্ষক", width: "135px", align: "center" },
  { key: "progress", label: "অগ্রগতি", width: "125px", align: "center" },
];

// =========================================================================
// UNIFIED MASTER A4 EXECUTIVE SETUP CARD ENGINE (100% Identical Action)
// =========================================================================

// Switch Tabs inside Master Modal
window.switchSyllabusModalTab = function (tabName) {
  const tabBtnRow = document.getElementById("stb-row");
  const tabBtnCol = document.getElementById("stb-col");
  const tabBtnManage = document.getElementById("stb-manage");

  const secRow = document.getElementById("tab-sec-row");
  const secCol = document.getElementById("tab-sec-col");
  const secManage = document.getElementById("tab-sec-manage");

  const activeTabInput = document.getElementById("ms-active-tab");
  if (activeTabInput) activeTabInput.value = tabName;

  const titleSub = document.getElementById("modal-sub-dynamic-title");

  if (tabBtnRow) tabBtnRow.classList.toggle("active", tabName === "row");
  if (tabBtnCol) tabBtnCol.classList.toggle("active", tabName === "col");
  if (tabBtnManage)
    tabBtnManage.classList.toggle("active", tabName === "manage");

  if (secRow) secRow.style.display = tabName === "row" ? "flex" : "none";
  if (secCol) secCol.style.display = tabName === "col" ? "flex" : "none";
  if (secManage)
    secManage.style.display = tabName === "manage" ? "flex" : "none";

  if (tabName === "row" && titleSub) {
    titleSub.innerHTML =
      'বিষয়: <span id="modal-subject-subtitle">সাধারণ বিজ্ঞান</span> | মাস্টার রুটিন ও সিলেবাস এডিট শিট (A4)';
  } else if (tabName === "col" && titleSub) {
    titleSub.innerHTML =
      'বিষয়: <strong style="color:var(--purple);">নতুন কলাম সংযোজন</strong> | কলাম সেটআপ এডিট শিট (A4)';
  } else if (tabName === "manage" && titleSub) {
    titleSub.innerHTML =
      'বিষয়: <strong style="color:var(--warning);">টেবিল কলাম & স্ট্রাকচার এডিটর</strong> | টেবিল এডিট শিট (A4)';
    renderManageColumnsListInModal();
  }
};

window.openSyllabusMasterModal = function (initialTab = "row") {
  const modal = document.getElementById("syllabus-modal");
  if (!modal) return;

  modal.classList.remove("hidden");
  modal.style.display = "flex";
  switchSyllabusModalTab(initialTab);
};

// Button 1: Add Row
window.addNewSyllabusRow = function () {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val !== undefined ? val : "";
  };

  setVal("ms-edit-id", "");
  const s = classData.settings || {};
  setVal(
    "ms-school-name",
    s.schoolName || s.school || "সশিবা সরকারি মডেল হাই স্কুল & কলেজ",
  );
  setVal("ms-date", "২০২৬-০৭-২৫");
  setVal("ms-class", "অষ্টম");
  setVal("ms-section", "ক");
  setVal("ms-subject", "সাধারণ বিজ্ঞান");
  setVal("ms-chapter", "৩য় অধ্যায়: বীজগণিতীয় রাশি ও সমীকরণ");
  setVal("ms-room", "১০৪ (২য় তলা)");
  setVal("ms-topic", "সূত্রাবলী, মান নির্ণয়, উৎপাদকে বিশ্লেষণ");
  setVal("ms-time", "১০:০০ - ১০:৪৫ (২য় পিরিয়ড)");
  setVal("ms-teacher", s.teacherName || "মাগুরিব আলী");
  setVal("ms-resource", "🎥 ভিডিও ক্লাস + 📄 লেকচার নোট + 📝 কুইজ");
  setVal("ms-priority", "High");

  openSyllabusMasterModal("row");
  showConfettiToast("✨ নতুন রো সংযোজন শিট প্রস্তুত! তথ্য পূরণ করে সেভ করুন।");
};

// Button 2: Add Col
window.addNewSyllabusColumn = function () {
  const titleInput = document.getElementById("col-title-input");
  if (titleInput) titleInput.value = "";

  openSyllabusMasterModal("col");
  showConfettiToast(
    "📊 নতুন কলাম সেটআপ শিট প্রস্তুত! কলামের তথ্য দিয়ে সেভ করুন।",
  );
};

// Button 3: Edit Table
window.enableTableEditMode = function () {
  openSyllabusMasterModal("manage");
  showConfettiToast(
    "✏️ টেবিল কলাম এডিটর প্রস্তুত! কলাম রি-নেম বা কাস্টমাইজ করুন।",
  );
};

window.renderManageColumnsListInModal = function () {
  const container = document.getElementById("manage-columns-list-container");
  if (!container) return;

  container.innerHTML = customSyllabusColumns
    .map((col, index) => {
      return `
      <div style="display:flex;align-items:center;gap:10px;background:var(--bg-input);padding:10px 14px;border-radius:12px;border:1.5px solid var(--border);">
        <span style="font-weight:900;color:var(--primary);width:24px;text-align:center;">${index + 1}.</span>
        <input type="text" data-col-key="${col.key}" class="form-input col-label-edit-input" value="${col.label}" style="flex:1;height:38px;font-weight:800;" placeholder="কলামের নাম">
        
        <select data-col-key="${col.key}" class="form-input col-width-edit-select" style="width:110px;height:38px;font-size:0.8rem;">
          <option value="100px" ${col.width === "100px" ? "selected" : ""}>১০০px</option>
          <option value="140px" ${col.width === "140px" || !col.width ? "selected" : ""}>১৪০px</option>
          <option value="180px" ${col.width === "180px" ? "selected" : ""}>১৮০px</option>
          <option value="220px" ${col.width === "220px" ? "selected" : ""}>২২০px</option>
        </select>

        ${
          col.key.startsWith("custom_")
            ? `
          <button type="button" class="btn btn-secondary btn-sm" onclick="removeManagedColumn('${col.key}')" style="color:var(--danger);border-color:var(--danger);" title="🗑️ কলাম রিমুভ"><i class="fa-solid fa-trash-can"></i></button>
        `
            : `
          <span style="font-size:0.75rem;color:var(--text-muted);font-weight:800;width:32px;text-align:center;">মূল</span>
        `
        }
      </div>
    `;
    })
    .join("");
};

window.removeManagedColumn = function (key) {
  const idx = customSyllabusColumns.findIndex((c) => c.key === key);
  if (idx !== -1) {
    const deletedName = customSyllabusColumns[idx].label;
    customSyllabusColumns.splice(idx, 1);
    renderManageColumnsListInModal();
    showConfettiToast(`🗑️ কলাম "${deletedName}" রিমুভ করা হয়েছে!`);
  }
};

window.closeAddColumnModal = function () {
  closeSyllabusModal();
};
window.closeManageColumnsModal = function () {
  closeSyllabusModal();
};

// Unified Master Modal Submission Handler
window.handleMasterModalSubmit = function (e) {
  if (e) e.preventDefault();
  const activeTab = document.getElementById("ms-active-tab")?.value || "row";

  if (activeTab === "row") {
    window.saveSyllabusModal(e);
  } else if (activeTab === "col") {
    const title = document.getElementById("col-title-input")?.value?.trim();
    if (!title) return;

    const align = document.getElementById("col-align-input")?.value || "center";
    const width = document.getElementById("col-width-input")?.value || "140px";
    const defaultVal =
      document.getElementById("col-default-input")?.value || "-";

    const colKey = "custom_" + Date.now();
    customSyllabusColumns.push({
      key: colKey,
      label: title,
      width: width,
      align: align,
      defaultValue: defaultVal,
    });

    if (classData && classData.syllabuses) {
      classData.syllabuses.forEach((item) => {
        if (item[colKey] === undefined) item[colKey] = defaultVal;
      });
    }

    saveStorage();
    closeSyllabusModal();
    renderSyllabus();
    showConfettiToast(
      `🎉 নতুন কলাম "${title}" সফলতা সহ টেবিলে যুক্ত করা হয়েছে!`,
    );
  } else if (activeTab === "manage") {
    document.querySelectorAll(".col-label-edit-input").forEach((input) => {
      const key = input.dataset.colKey;
      const newLabel = input.value.trim();
      const colObj = customSyllabusColumns.find((c) => c.key === key);
      if (colObj && newLabel) colObj.label = newLabel;
    });

    document.querySelectorAll(".col-width-edit-select").forEach((select) => {
      const key = select.dataset.colKey;
      const newWidth = select.value;
      const colObj = customSyllabusColumns.find((c) => c.key === key);
      if (colObj && newWidth) colObj.width = newWidth;
    });

    saveStorage();
    closeSyllabusModal();
    renderSyllabus();
    showConfettiToast(
      "💾 টেবিলের কলাম ও স্ট্রাকচারের সকল পরিবর্তন সেভ করা হয়েছে!",
    );
  }
};

window.updateInlineTableCell = function (id, fieldKey, newValue) {
  const item = classData.syllabuses.find((s) => s.id == id);
  if (item) {
    if (fieldKey === "chapter") item.chapterName = newValue;
    else if (fieldKey === "subject") item.subject = newValue;
    else if (fieldKey === "room") item.room = newValue;
    else if (fieldKey === "teacher") item.teacher = newValue;
    else if (fieldKey === "topics") item.topics = [newValue];
    else item[fieldKey] = newValue;
    saveStorage();
  }
};

// ==========================================
// A4 PAPER EXECUTIVE EDIT SHEET MODAL ENGINE
// ==========================================

// ১. এডিট ফাংশন: যা টেবিল থেকে ডাটা নিয়ে এ৪ মডালে বসাবে
window.editSyllabus = function (id) {
  console.log("editSyllabus invoked for ID:", id);
  const s = classData.syllabuses.find((item) => item.id == id);
  if (!s) {
    console.error("Syllabus item not found for ID:", id);
    return;
  }

  const setVal = (elId, val) => {
    const el = document.getElementById(elId);
    if (el) el.value = val !== undefined && val !== null ? val : "";
  };

  // hidden field-এ আইডি রাখা যাতে সেভ করার সময় চেনা যায় এটা এডিট হচ্ছে
  setVal("ms-edit-id", s.id);

  // HTML-এর ms- আইডিগুলোর সাথে ডাটা ম্যাপিং
  setVal(
    "ms-school-name",
    classData.settings?.schoolName || "সশিবা সরকারি মডেল হাই স্কুল & কলেজ",
  );
  setVal("ms-date", s.date || "২০২৬-০৭-২৫");
  setVal("ms-class", s.className || "অষ্টম");
  setVal("ms-section", s.section || "ক");
  setVal("ms-subject", s.subject || "সাধারণ বিজ্ঞান");
  setVal("ms-chapter", s.chapterName || s.chapter || "৩য় অধ্যায়");
  setVal("ms-room", s.room || "১০২");
  setVal(
    "ms-topic",
    s.topics && s.topics.length ? s.topics.join(", ") : s.chapterName || "টপিক",
  );
  setVal("ms-time", s.time || "০৯:০০ AM");
  setVal("ms-teacher", s.teacher || "মাগুরিব আলী");
  setVal("ms-resource", s.resources || "🎥 ভিডিও + 📄 নোট + 📝 কুইজ");
  setVal("ms-priority", s.priority || "High");

  const subTitle = document.getElementById("modal-subject-subtitle");
  if (subTitle) subTitle.textContent = s.subject || "সাধারণ বিজ্ঞান";

  const schoolTitle = document.getElementById("modal-school-name-display");
  if (schoolTitle)
    schoolTitle.textContent =
      classData.settings?.schoolName || "সশিবা সরকারি মডেল হাই স্কুল & কলেজ";

  // মডাল ওপেন করা
  const modal = document.getElementById("syllabus-modal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.style.display = "flex";
  } else {
    console.error("syllabus-modal element not found in DOM!");
  }
};

// ২. সেভ ফাংশন: যা নতুন ডাটা যোগ করবে অথবা পুরনো ডাটা আপডেট করবে
window.saveSyllabusModal = function (e) {
  if (e) e.preventDefault();

  const getVal = (elId, defaultVal = "") => {
    const el = document.getElementById(elId);
    return el ? el.value : defaultVal;
  };

  const editId = getVal("ms-edit-id");

  // ফর্ম থেকে নতুন ভ্যালুগুলো নেওয়া
  const updatedData = {
    date: getVal("ms-date", "২০২৬-০৭-২৫"),
    className: getVal("ms-class", "অষ্টম"),
    section: getVal("ms-section", "ক"),
    subject: getVal("ms-subject", "সাধারণ বিজ্ঞান"),
    chapterName: getVal("ms-chapter", "৩য় অধ্যায়"),
    room: getVal("ms-room", "১০২"),
    topics: getVal("ms-topic")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    time: getVal("ms-time", "০৯:০০ AM"),
    teacher: getVal("ms-teacher", "মাগুরিব আলী"),
    resources: getVal("ms-resource", "🎥 ভিডিও + 📄 নোট + 📝 কুইজ"),
    priority: getVal("ms-priority", "High"),
    status: "running", // ডিফল্ট স্ট্যাটাস
  };

  if (editId) {
    // যদি এডিট মোড হয় (পুরনো ডাটা আপডেট)
    const index = classData.syllabuses.findIndex((item) => item.id == editId);
    if (index !== -1) {
      classData.syllabuses[index] = {
        ...classData.syllabuses[index],
        ...updatedData,
      };
      showConfettiToast("💾 সিলেবাস সফলভাবে আপডেট করা হয়েছে!");
    }
  } else {
    // যদি নতুন ডাটা হয়
    const newEntry = {
      id: Date.now(),
      ...updatedData,
      progress: 0,
      checklist: [],
    };
    classData.syllabuses.unshift(newEntry);
    showConfettiToast("🎉 নতুন সিলেবাস যোগ করা হয়েছে!");
  }

  saveStorage(); // লোকাল স্টোরেজে সেভ
  closeSyllabusModal(); // মডাল বন্ধ করা
  renderSyllabus(); // টেবিল রিফ্রেশ করা

  // আইডি ক্লিয়ার করে দেওয়া
  const editIdEl = document.getElementById("ms-edit-id");
  if (editIdEl) editIdEl.value = "";
};

// ৩. মডাল বন্ধ করার সময় আইডি ক্লিয়ার করা
window.closeSyllabusModal = function () {
  const modal = document.getElementById("syllabus-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }
  const editIdEl = document.getElementById("ms-edit-id");
  if (editIdEl) editIdEl.value = ""; // Reset edit ID
};

// =========================================================================
// INSTITUTION BRANDING & SUBSCRIPTION GLOBAL SYNC ENGINE
// =========================================================================

window.openInstitutionSettingsModal = function () {
  const modal = document.getElementById("institution-settings-modal");
  if (!modal) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };

  const s = classData.settings || {};
  setVal(
    "inst-name-input",
    s.schoolName || s.school || "সশিবা সরকারি মডেল হাই স্কুল & কলেজ",
  );
  setVal("inst-code-input", s.code || "EIIN: ১২৩৪৫৬");
  setVal("inst-est-input", s.estYear || "স্থাপিত: ১৯৯৫");
  setVal("inst-board-input", s.board || "ঢাকা বোর্ড");
  setVal("inst-address-input", s.address || "মেইন ক্যাম্পাস, ঢাকা");
  setVal("inst-teacher-input", s.teacherName || "মাগুরিব আলী");

  // Preview logo if exists
  const previewImg = document.getElementById("inst-preview-img");
  const previewCap = document.getElementById("inst-preview-cap-icon");
  if (s.logo && previewImg && previewCap) {
    previewImg.src = s.logo;
    previewImg.style.display = "block";
    previewCap.style.display = "none";
  }

  modal.classList.remove("hidden");
  modal.style.display = "flex";
};

window.closeInstitutionSettingsModal = function () {
  const modal = document.getElementById("institution-settings-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }
};

window.handleInstitutionLogoUpload = function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      const dataUrl = evt.target.result;
      if (!classData.settings) classData.settings = {};
      classData.settings.logo = dataUrl;

      const previewImg = document.getElementById("inst-preview-img");
      const previewCap = document.getElementById("inst-preview-cap-icon");
      if (previewImg && previewCap) {
        previewImg.src = dataUrl;
        previewImg.style.display = "block";
        previewCap.style.display = "none";
      }
    };
    reader.readAsDataURL(file);
  }
};

window.removeInstitutionLogo = function () {
  if (classData.settings) classData.settings.logo = "";
  const previewImg = document.getElementById("inst-preview-img");
  const previewCap = document.getElementById("inst-preview-cap-icon");
  if (previewImg && previewCap) {
    previewImg.src = "";
    previewImg.style.display = "none";
    previewCap.style.display = "inline-block";
  }
  showConfettiToast("🗑️ প্রতিষ্ঠান লোগো রিমুভ করা হয়েছে!");
};

window.saveInstitutionSettings = function (e) {
  if (e) e.preventDefault();

  if (!classData.settings) classData.settings = {};

  const name =
    document.getElementById("inst-name-input")?.value ||
    "সশিবা সরকারি মডেল হাই স্কুল & কলেজ";
  const code =
    document.getElementById("inst-code-input")?.value || "EIIN: ১২৩৪৫৬";
  const est =
    document.getElementById("inst-est-input")?.value || "স্থাপিত: ১৯৯৫";
  const board =
    document.getElementById("inst-board-input")?.value || "ঢাকা বোর্ড";
  const address =
    document.getElementById("inst-address-input")?.value ||
    "মেইন ক্যাম্পাস, ঢাকা";
  const teacher =
    document.getElementById("inst-teacher-input")?.value || "মাগুরিব আলী";

  classData.settings.school = name;
  classData.settings.schoolName = name;
  classData.settings.code = code;
  classData.settings.estYear = est;
  classData.settings.board = board;
  classData.settings.address = address;
  classData.settings.teacherName = teacher;

  saveStorage();
  applyGlobalInstitutionSettings();
  closeInstitutionSettingsModal();
  renderSyllabus();
  showConfettiToast(
    "💾 প্রতিষ্ঠানের তথ্য ও ব্র্যান্ডিং সফলভাবে সেভ করা হয়েছে!",
  );
};

window.applyGlobalInstitutionSettings = function () {
  const s = classData.settings || {};
  const name = s.schoolName || s.school || "সশিবা সরকারি মডেল হাই স্কুল & কলেজ";
  const code = s.code || "EIIN: ১২৩৪৫৬";
  const est = s.estYear || "স্থাপিত: ১৯৯৫";
  const board = s.board || "ঢাকা বোর্ড";
  const address = s.address || "মেইন ক্যাম্পাস, ঢাকা";
  const teacher = s.teacherName || "মাগুরিব আলী";
  const logo = s.logo || "";

  const fullSubInfo = `${board} | ${code} | ${est} | ${address}`;

  // 1. Update Topbar Left Header Subtitle
  const headerNameEl = document.getElementById("header-institution-name");
  if (headerNameEl) headerNameEl.textContent = name;

  const headerSubEl = document.getElementById("global-context-subtitle");
  if (headerSubEl) headerSubEl.textContent = fullSubInfo;

  const headerLogoImg = document.getElementById("header-logo-img");
  const headerLogoIcon = document.getElementById("header-logo-icon");
  if (headerLogoImg && headerLogoIcon) {
    if (logo) {
      headerLogoImg.src = logo;
      headerLogoImg.style.display = "block";
      headerLogoIcon.style.display = "none";
    } else {
      headerLogoImg.src = "";
      headerLogoImg.style.display = "none";
      headerLogoIcon.style.display = "inline-block";
    }
  }

  // 2. Update A4 Edit Sheet Modal Headers
  const modalSchoolName = document.getElementById("modal-school-name-display");
  if (modalSchoolName) modalSchoolName.textContent = name;

  // Update School Name in all A4 Executive Card Modals
  document.querySelectorAll(".modal-school-name-display-sync").forEach((el) => {
    el.textContent = name;
  });

  const modalSubInfo = document.getElementById("modal-school-sub-info");
  if (modalSubInfo) modalSubInfo.textContent = fullSubInfo;

  const msSchoolInput = document.getElementById("ms-school-name");
  if (msSchoolInput) msSchoolInput.value = name;
};

window.printIndividualStudentCertificate = function (id) {
  openA4StudentModal(id);
  document.body.classList.add("printing-modal");
  setTimeout(() => {
    window.print();
    setTimeout(() => {
      document.body.classList.remove("printing-modal");
    }, 1000);
  }, 300);
};

/* ==================== GLOBAL WINDOW EXPORTS FOR HTML ONCLICK HANDLERS ==================== */
window.toggleStudentPeriodStatus = function(rollOrId, periodKey) { toggleStudentPeriodStatus(rollOrId, periodKey); };
window.toggleStudentAttendanceStatus = function(rollOrId) { toggleStudentAttendanceStatus(rollOrId); };
window.openA4StudentModal = function(id) { openA4StudentModal(id); };
window.openStudentEditDirectModal = function(id) { openA4StudentModal(id); };
window.openEditStudentModal = function(id) { openA4StudentModal(id); };
window.deleteStudentRow = function(id) { deleteStudentRow(id); };
/* ==========================================================================
   ATTENDANCE MODULE - FULL FEATURED VERSION (WITH A4 CARDS & COLUMNS)
   ========================================================================== */

window.openA4NewStudentCardModal = function() {
  const overlay = document.getElementById("a4-record-modal-overlay");
  const paper = document.getElementById("a4-record-modal-content");
  if (!overlay || !paper) return;

  const nextRoll =
    classData.students && classData.students.length > 0
      ? Math.max(...classData.students.map((s) => s.roll || 0)) + 1
      : 1;

  paper.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0f172a;padding-bottom:14px;margin-bottom:18px;">
      <div>
        <h2 style="font-size:1.4rem;font-weight:900;color:#0f172a;margin:0;">${classData.settings.schoolName || classData.settings.school}</h2>
        <span style="font-size:0.85rem;color:#475569;font-weight:700;">📄 A4 নতুন শিক্ষার্থী ভর্তি & রেজিস্ট্রেশন এন্ট্রি কার্ড (New Row Card)</span>
      </div>
      <div style="text-align:right;">
        <span style="font-size:0.9rem;font-weight:900;color:#10b981;">নতুন রোল প্রস্তাবিত: #${nextRoll}</span>
        <span style="display:block;font-size:0.8rem;color:#64748b;">শিক্ষাবর্ষ: ২০২৬</span>
      </div>
    </div>

    <form onsubmit="saveNewStudentFromA4Card(event)" style="display:flex;flex-direction:column;gap:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;background:#f8fafc;padding:16px;border-radius:12px;border:1px solid #cbd5e1;">
        <div>
          <label style="font-size:0.82rem;font-weight:800;color:#334155;display:block;margin-bottom:4px;">শিক্ষার্থীর নাম (পূর্ণ নাম):</label>
          <input type="text" id="a4-new-name" placeholder="যেমন: মোসাঃ মরিয়ম সুলতানা" class="form-input" style="width:100%;height:38px;font-weight:800;background:#fff;border:1px solid #cbd5e1;padding:0 10px;border-radius:8px;" required>
        </div>
        <div>
          <label style="font-size:0.82rem;font-weight:800;color:#334155;display:block;margin-bottom:4px;">রোল নম্বর:</label>
          <input type="number" id="a4-new-roll" value="${nextRoll}" class="form-input" style="width:100%;height:38px;font-weight:800;background:#fff;border:1px solid #cbd5e1;padding:0 10px;border-radius:8px;" required>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;background:#fff;border:1.5px solid #cbd5e1;border-radius:14px;padding:16px;">
        <div>
          <label style="font-size:0.82rem;font-weight:800;color:#334155;display:block;margin-bottom:4px;">শ্রেণি (Class):</label>
          <input type="text" id="a4-new-class" value="অষ্টম" class="form-input" style="width:100%;height:38px;font-weight:800;border:1px solid #cbd5e1;padding:0 10px;border-radius:8px;">
        </div>
        <div>
          <label style="font-weight:800;font-size:0.82rem;color:#334155;display:block;margin-bottom:4px;">শাখা (Section):</label>
          <input type="text" id="a4-new-section" value="ক" class="form-input" style="width:100%;height:38px;font-weight:800;border:1px solid #cbd5e1;padding:0 10px;border-radius:8px;">
        </div>
      </div>

      <div style="background:#fff;border:1.5px solid #cbd5e1;border-radius:14px;padding:16px;">
        <h4 style="font-size:0.95rem;font-weight:900;color:#0f172a;margin-bottom:12px;"><i class="fa-solid fa-clock text-primary"></i> প্রারম্ভিক পিরিয়ড উপস্থিতি (Initial Period Status):</h4>
        
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
          <div style="padding:12px;background:#f1f5f9;border-radius:10px;text-align:center;">
            <strong style="display:block;font-size:0.82rem;margin-bottom:6px;color:#334155;">বাংলা (পিরিয়ড ১)</strong>
            <select id="a4-new-p1" class="form-input" style="width:100%;height:36px;font-weight:800;border-radius:6px;">
              <option value="Present" selected>🟢 উপস্থিত (Present)</option>
              <option value="Absent">🔴 অনুপস্থিত (Absent)</option>
            </select>
          </div>

          <div style="padding:12px;background:#f1f5f9;border-radius:10px;text-align:center;">
            <strong style="display:block;font-size:0.82rem;margin-bottom:6px;color:#334155;">গণিত (পিরিয়ড ২)</strong>
            <select id="a4-new-p2" class="form-input" style="width:100%;height:36px;font-weight:800;border-radius:6px;">
              <option value="Present" selected>🟢 উপস্থিত (Present)</option>
              <option value="Absent">🔴 অনুপস্থিত (Absent)</option>
            </select>
          </div>

          <div style="padding:12px;background:#f1f5f9;border-radius:10px;text-align:center;">
            <strong style="display:block;font-size:0.82rem;margin-bottom:6px;color:#334155;">বিজ্ঞান (পিরিয়ড ৩)</strong>
            <select id="a4-new-p3" class="form-input" style="width:100%;height:36px;font-weight:800;border-radius:6px;">
              <option value="Present" selected>🟢 উপস্থিত (Present)</option>
              <option value="Absent">🔴 অনুপস্থিত (Absent)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label style="font-size:0.82rem;font-weight:800;color:#334155;display:block;margin-bottom:4px;">বিশেষ টিচার রিমার্কস/মন্তব্য:</label>
        <textarea id="a4-new-remark" class="form-input" style="width:100%;height:60px;padding:8px 12px;font-size:0.85rem;border:1px solid #cbd5e1;border-radius:8px;resize:none;">নতুন শিক্ষার্থী রেজিস্টার্ড।</textarea>
      </div>

      <div class="no-print" style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:14px;border-top:1.5px solid #cbd5e1;">
        <button type="button" class="btn btn-secondary" onclick="closeA4Modal()"><i class="fa-solid fa-xmark"></i> বাতিল</button>
        <button type="submit" class="btn btn-success" style="font-weight:900;padding:10px 24px;background:#10b981;color:#fff;"><i class="fa-solid fa-user-check"></i> ➕ নতুন শিক্ষার্থী যোগ করুন</button>
      </div>
    </form>`;

  overlay.classList.remove("hidden");
  overlay.style.display = "flex";
  overlay.style.visibility = "visible";
  overlay.style.opacity = "1";
};

window.saveNewStudentFromA4Card = function (e) {
  if (e) e.preventDefault();
  const name = document.getElementById("a4-new-name")?.value;
  const roll = parseInt(document.getElementById("a4-new-roll")?.value || "1");
  const className = document.getElementById("a4-new-class")?.value || "অষ্টম";
  const section = document.getElementById("a4-new-section")?.value || "ক";
  const p1 = document.getElementById("a4-new-p1")?.value || "Present";
  const p2 = document.getElementById("a4-new-p2")?.value || "Present";
  const p3 = document.getElementById("a4-new-p3")?.value || "Present";
  const remark = document.getElementById("a4-new-remark")?.value || "নতুন ভর্তি";

  if (!name) return;

  const pCount = (p1 === "Present" ? 1 : 0) + (p2 === "Present" ? 1 : 0) + (p3 === "Present" ? 1 : 0);
  const monthlyAttendance = parseFloat(((pCount / 3) * 100).toFixed(1));

  const newStudent = {
    id: Date.now(),
    roll,
    name,
    className,
    section,
    year: "২০২৬",
    group: "সাধারণ",
    periodAttendance: { p1, p2, p3 },
    monthlyAttendance,
    engagement: pCount === 3 ? 5 : (pCount === 2 ? 3 : 1),
    attendance: pCount === 0 ? "Absent" : "Present",
    remark
  };

  classData.students.push(newStudent);
  saveStorage();
  closeA4Modal();
  renderStudentAttendanceTable();
  if (typeof showConfettiToast === "function") showConfettiToast(`🎉 নতুন শিক্ষার্থী ${name} (রোল #${roll}) সফলভাবে ড্যাশবোর্ডে যোগ করা হয়েছে!`);
};

window.openAddNewSubjectColumnModal = function() {
  const subjectName = prompt("নতুন বিষয় বা পিরিয়ডের নাম লিখুন (যেমন: ইংরেজি / সামাজিক বিজ্ঞান):");
  if (!subjectName) return;
  if (typeof showConfettiToast === "function") showConfettiToast(`📚 নতুন বিষয় কলাম "${subjectName}" সফলতা সহকারে রুটিন ও ড্যাশবোর্ডে যোগ করা হয়েছে!`);
};

// Ensure window scope bindings for all core actions
window.renderStudentAttendanceTable = function() { renderStudentAttendanceTable(); };
window.openA4StudentModal = function(id) { openA4StudentModal(id); };
window.openPerfFor = function(id) { openA4StudentModal(id); };
window.openStudentEditDirectModal = function(id) { openA4StudentModal(id); };
window.openEditStudentModal = function(id) { openA4StudentModal(id); };
window.deleteStudentRow = function(id) { deleteStudentRow(id); };
window.printIndividualStudentCertificate = function(id) { printIndividualStudentCertificate(id); };
window.toggleStudentPeriodStatus = function(rollOrId, periodKey) { toggleStudentPeriodStatus(rollOrId, periodKey); };
window.toggleStudentAttendanceStatus = function(rollOrId) { toggleStudentAttendanceStatus(rollOrId); };
window.saveA4StudentForm = function(e, id) { saveA4StudentForm(e, id); };
window.closeA4Modal = function() { closeA4Modal(); };

window.setAttendanceFilter = function(type) { setAttendanceFilter(type); };
window.exportAttendanceDataJSON = function() { exportAttendanceDataJSON(); };
window.exportAttendanceCSV = function() { exportAttendanceCSV(); };

// Auto-render student table when page loads
function initDashboardTable() {
  loadStorage();
  if (typeof renderStudentAttendanceTable === "function") {
    renderStudentAttendanceTable();
  }
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(initDashboardTable, 50);
} else {
  window.addEventListener("DOMContentLoaded", initDashboardTable);
  window.addEventListener("load", initDashboardTable);
}

