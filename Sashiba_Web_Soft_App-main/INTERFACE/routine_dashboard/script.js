/* Routine Dashboard Standalone JavaScript Logic */

let routineData = [
  { id: "r1", type: "class", timeView: "daily", classVal: "Class 10", section: "A", shift: "Morning Shift", day: "Saturday", period: "1st Period (09:00 - 09:45 AM)", subject: "Physics", subjectCode: "PHY", teacher: "Tanvir Ahmed", room: "Room 302", examName: "", date: "2026-08-01" },
  { id: "r2", type: "class", timeView: "daily", classVal: "Class 10", section: "A", shift: "Morning Shift", day: "Saturday", period: "2nd Period (09:45 - 10:30 AM)", subject: "Higher Math", subjectCode: "H.MATH", teacher: "Arif Hossain", room: "Room 302", examName: "", date: "2026-08-01" },
  { id: "r3", type: "exam", timeView: "daily", classVal: "Class 10", section: "A", shift: "Morning Shift", day: "Saturday", period: "Exam Slot (11:00 - 01:00 PM)", subject: "Chemistry", subjectCode: "CHE", teacher: "Fatema Khanam (Invigilator)", room: "Exam Hall 1", examName: "Mid-Term Examination 2026", date: "2026-08-01" },
  { id: "r4", type: "class", timeView: "weekly", classVal: "Class 10", section: "A", shift: "Morning Shift", day: "Sunday", period: "3rd Period (10:45 - 11:30 AM)", subject: "English", subjectCode: "ENG", teacher: "Sabiha Sultana", room: "Room 302", examName: "", date: "2026-08-02" },
  { id: "r5", type: "exam", timeView: "monthly", classVal: "Class 10", section: "A", shift: "Morning Shift", day: "Monday", period: "Morning Slot (10:00 - 01:00 PM)", subject: "ICT", subjectCode: "ICT", teacher: "Imran Hasan", room: "Auditorium", examName: "Pre-Test Model Exam", date: "2026-08-10" },
  { id: "r6", type: "exam", timeView: "quarterly", classVal: "Class 10", section: "A", shift: "Morning Shift", day: "Tuesday", period: "Term Slot (10:00 - 12:00 PM)", subject: "Biology", subjectCode: "BIO", teacher: "Nusrat Jahan", room: "Lab 2", examName: "1st Quarter Assessment", date: "2026-09-15" },
  { id: "r7", type: "exam", timeView: "halfyearly", classVal: "Class 10", section: "A", shift: "Morning Shift", day: "Wednesday", period: "Half-Yearly Slot (09:30 - 12:30 PM)", subject: "Mathematics", subjectCode: "MATH", teacher: "Omar Faruk", room: "Main Hall", examName: "Half-Yearly Master Exam", date: "2026-10-20" },
  { id: "r8", type: "exam", timeView: "annual", classVal: "Class 10", section: "A", shift: "Morning Shift", day: "Thursday", period: "Annual Slot (09:30 - 12:30 PM)", subject: "Bangla", subjectCode: "BAN", teacher: "Sumaiya Akter", room: "Main Hall", examName: "Annual Master Examination 2026", date: "2026-12-05" }
];

let activeTabVal = "daily";

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `px-4 py-3 rounded-xl text-xs font-bold text-white shadow-xl pointer-events-auto transition transform translate-y-0 ${
    type === "success" ? "bg-emerald-600" : type === "error" ? "bg-rose-600" : "bg-slate-800"
  }`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3500);
}

window.switchTab = function(tabName) {
  activeTabVal = tabName;
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active", "bg-indigo-600", "text-white");
    btn.classList.add("text-slate-300");
  });
  const targetBtn = document.getElementById(`tab-${tabName}`);
  if (targetBtn) {
    targetBtn.classList.add("active", "bg-indigo-600", "text-white");
    targetBtn.classList.remove("text-slate-300");
  }

  const titles = {
    daily: "Daily Class & Exam Schedule (দৈনিক রুটিন)",
    weekly: "Weekly Master Timetable (সাপ্তাহিক রুটিন)",
    monthly: "Monthly Calendar & Test Schedule (মাসিক রুটিন)",
    quarterly: "3-Month Assessment Plan (৩ মাসের পরিকল্পনা)",
    halfyearly: "6-Month / Half-Yearly Schedule (৬ মাস / অর্ধবার্ষিক)",
    annual: "Annual Master Examination Schedule (১ বছর / বার্ষিক)"
  };

  const titleElem = document.getElementById("pageTitleText");
  if (titleElem) titleElem.textContent = titles[tabName] || "Master Timetable Schedule";
  
  const headerElem = document.getElementById("tableHeaderTitle");
  if (headerElem) headerElem.textContent = `${titles[tabName]} List`;

  renderRoutineTable();
};

function renderRoutineTable() {
  const tbody = document.getElementById("routineTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const searchQuery = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const selectedClass = document.getElementById("classFilter")?.value || "all";
  const selectedSec = document.getElementById("sectionFilter")?.value || "all";
  const selectedType = document.getElementById("typeFilter")?.value || "all";
  const selectedShift = document.getElementById("shiftFilter")?.value || "all";

  const filtered = routineData.filter(r => {
    if (activeTabVal !== "all" && r.timeView !== activeTabVal && activeTabVal !== "daily" && activeTabVal !== "weekly") {
      // allow flexible filtering
    }
    if (selectedType !== "all" && r.type !== selectedType) return false;
    if (selectedClass !== "all" && r.classVal !== selectedClass) return false;
    if (selectedSec !== "all" && r.section !== selectedSec) return false;
    if (selectedShift !== "all" && r.shift !== selectedShift) return false;
    if (searchQuery) {
      const match = r.subject.toLowerCase().includes(searchQuery) || r.teacher.toLowerCase().includes(searchQuery) || r.room.toLowerCase().includes(searchQuery) || r.period.toLowerCase().includes(searchQuery);
      if (!match) return false;
    }
    return true;
  });

  const badge = document.getElementById("recordCountBadge");
  if (badge) badge.textContent = `${filtered.length} Slots Listed`;

  // Update Stats
  document.getElementById("kpiTotalSlots").textContent = filtered.length;
  document.getElementById("kpiClassSlots").textContent = filtered.filter(r => r.type === "class").length;
  document.getElementById("kpiExamSlots").textContent = filtered.filter(r => r.type === "exam").length;
  document.getElementById("kpiTeachers").textContent = new Set(filtered.map(r => r.teacher)).size;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colSpan="9" class="p-8 text-center text-slate-400 font-bold">
          No matching routine slots found for selected filters.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(r => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-800/60 transition";
    tr.innerHTML = `
      <td class="p-3.5">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black ${r.type === 'exam' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}">
          ${r.type === 'exam' ? '📝 EXAM' : '📖 CLASS'}
        </span>
      </td>
      <td class="p-3.5 font-bold text-white">${r.day} <span class="text-[10px] text-slate-400 block">${r.date}</span></td>
      <td class="p-3.5 font-semibold text-indigo-400">${r.period}</td>
      <td class="p-3.5"><span class="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 font-bold text-[11px]">${r.classVal} (${r.section})</span></td>
      <td class="p-3.5 font-bold text-white">${r.subject} <span class="text-[10px] text-slate-400">(${r.subjectCode || 'GEN'})</span></td>
      <td class="p-3.5 font-medium">${r.teacher}</td>
      <td class="p-3.5"><span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[11px]">${r.room}</span></td>
      <td class="p-3.5 font-medium text-slate-300">${r.examName || '—'}</td>
      <td class="p-3.5 text-center">
        <button onclick="window.deleteSlot('${r.id}')" class="w-7 h-7 rounded-lg bg-rose-950 text-rose-400 hover:bg-rose-900 flex items-center justify-center font-bold" title="Delete Slot">
          ✕
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.deleteSlot = function(id) {
  routineData = routineData.filter(r => r.id !== id);
  showToast("Routine slot removed", "error");
  renderRoutineTable();
};

document.addEventListener("DOMContentLoaded", () => {
  renderRoutineTable();

  // Search & Filter Event Listeners
  document.getElementById("searchInput")?.addEventListener("input", renderRoutineTable);
  document.getElementById("classFilter")?.addEventListener("change", renderRoutineTable);
  document.getElementById("sectionFilter")?.addEventListener("change", renderRoutineTable);
  document.getElementById("typeFilter")?.addEventListener("change", renderRoutineTable);
  document.getElementById("shiftFilter")?.addEventListener("change", renderRoutineTable);

  // Modal Open/Close
  document.getElementById("openAddSlotBtn")?.addEventListener("click", () => {
    document.getElementById("addSlotModal")?.classList.remove("hidden");
  });
  document.getElementById("closeAddModal")?.addEventListener("click", () => {
    document.getElementById("addSlotModal")?.classList.add("hidden");
  });
  document.getElementById("cancelFormBtn")?.addEventListener("click", () => {
    document.getElementById("addSlotModal")?.classList.add("hidden");
  });

  document.getElementById("openPrintBtn")?.addEventListener("click", () => {
    const stamp = document.getElementById("printTimeStamp");
    if (stamp) stamp.textContent = new Date().toLocaleString();

    const tbody = document.getElementById("printTableBody");
    if (tbody) {
      tbody.innerHTML = "";
      routineData.forEach(r => {
        const tr = document.createElement("tr");
        tr.className = "border-b";
        tr.innerHTML = `
          <td class="p-2 font-bold">${r.type === 'exam' ? 'EXAM' : 'CLASS'}</td>
          <td class="p-2">${r.period}</td>
          <td class="p-2 font-bold">${r.subject}</td>
          <td class="p-2">${r.teacher}</td>
          <td class="p-2 font-mono">${r.room}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    document.getElementById("printModal")?.classList.remove("hidden");
  });

  document.getElementById("closePrintModal")?.addEventListener("click", () => {
    document.getElementById("printModal")?.classList.add("hidden");
  });
  document.getElementById("cancelPrintBtn")?.addEventListener("click", () => {
    document.getElementById("printModal")?.classList.add("hidden");
  });

  // Submit Add Slot Form
  document.getElementById("routineForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const type = document.getElementById("formType").value;
    const timeView = document.getElementById("formTimeView").value;
    const classVal = document.getElementById("formClass").value;
    const section = document.getElementById("formSection").value;
    const subject = document.getElementById("formSubject").value;
    const teacher = document.getElementById("formTeacher").value;
    const period = document.getElementById("formPeriod").value;
    const room = document.getElementById("formRoom").value;
    const examName = document.getElementById("formExamName").value;

    const newSlot = {
      id: `r-${Date.now()}`,
      type,
      timeView,
      classVal,
      section,
      shift: "Morning Shift",
      day: "Saturday",
      period,
      subject,
      subjectCode: subject.slice(0, 3).toUpperCase(),
      teacher,
      room,
      examName,
      date: new Date().toISOString().slice(0, 10)
    };

    routineData.push(newSlot);
    showToast("New routine slot added successfully!", "success");
    renderRoutineTable();
    document.getElementById("addSlotModal")?.classList.add("hidden");
  });

  // Dark/Light Theme Toggle
  document.getElementById("themeToggleBtn")?.addEventListener("click", () => {
    const html = document.documentElement;
    const icon = document.getElementById("themeIcon");

    if (html.getAttribute("data-theme") === "dark") {
      html.setAttribute("data-theme", "light");
      document.body.classList.remove("bg-slate-950", "text-slate-100");
      document.body.classList.add("bg-slate-50", "text-slate-900");
      icon.className = "fa-solid fa-sun text-amber-400";
    } else {
      html.setAttribute("data-theme", "dark");
      document.body.classList.remove("bg-slate-50", "text-slate-900");
      document.body.classList.add("bg-slate-950", "text-slate-100");
      icon.className = "fa-solid fa-moon";
    }
  });
});
