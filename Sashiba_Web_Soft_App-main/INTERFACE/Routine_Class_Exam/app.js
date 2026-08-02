/**
 * Routine C&E - Class & Exam Routine Dashboard (Version 14 Engine)
 * Fixed Exam Filter & Type Display Bug:
 * 1. Restored TYPE (EXAM, CLASS, PRACT) and SHIFT (Morning, Evening) columns in Data Table
 * 2. Balanced EXAM and CLASS generator distribution so clicking EXAM filters properly
 * 3. Exact screenshot styling maintained with Code Pills, Subject Colors, Teacher Avatars & SVG Action Icons
 */

// Full 30-Day Multi-Month Data Generator
function generateFullMonthData() {
  const dataset = [];
  const months = ["Aug", "Sep", "Oct", "Nov", "Dec"];
  const subjects = [
    { code: "MTH-901", name: "Mathematics", codeClass: "code-math", subjClass: "subj-math", room: "Hall A", teacher: "Sharma", initials: "AS", avatarClass: "avatar-sharma", dept: "Department of Mathematics" },
    { code: "PHY-1001", name: "Physics", codeClass: "code-phy", subjClass: "subj-phy", room: "Lab 201", teacher: "Uddin", initials: "KU", avatarClass: "avatar-uddin", dept: "Department of Physics" },
    { code: "CHM-1101", name: "Chemistry", codeClass: "code-chm", subjClass: "subj-chm", room: "Chem Lab", teacher: "Nair", initials: "PN", avatarClass: "avatar-nair", dept: "Department of Chemistry" },
    { code: "ENG-1201", name: "English", codeClass: "code-eng", subjClass: "subj-eng", room: "Hall A", teacher: "Hassan", initials: "RH", avatarClass: "avatar-hassan", dept: "Department of English" },
    { code: "BIO-901", name: "Biology", codeClass: "code-bio", subjClass: "subj-bio", room: "Room 102", teacher: "Roy", initials: "SR", avatarClass: "avatar-roy", dept: "Department of Biology" },
    { code: "HIS-1001", name: "History", codeClass: "code-his", subjClass: "subj-his", room: "Room 201", teacher: "Mondal", initials: "DM", avatarClass: "avatar-mondal", dept: "Department of History" },
    { code: "GEO-1101", name: "Geography", codeClass: "code-geo", subjClass: "subj-geo", room: "Room 301", teacher: "Begum", initials: "FB", avatarClass: "avatar-begum", dept: "Department of Geography" },
    { code: "CS-1201", name: "Computer Science", codeClass: "code-cs", subjClass: "subj-cs", room: "Computer Lab", teacher: "Patel", initials: "SP", avatarClass: "avatar-patel", dept: "Department of Computer Science" }
  ];

  const classGrades = ["Class IX", "Class X", "Class XI", "Class XII", "Class IX", "Class X", "Class XI", "Class XII"];

  let idCounter = 1;
  months.forEach(month => {
    for (let day = 1; day <= 30; day++) {
      const dayStr = String(day).padStart(2, "0");
      const subj = subjects[(day + idCounter) % subjects.length];
      const grade = classGrades[(day + idCounter) % classGrades.length];

      // Balanced type generation so EXAM, CLASS, and PRACT are all well represented
      const type = (day % 4 === 0) ? "PRACT" : ((day % 2 === 0) ? "EXAM" : "CLASS");
      const shift = day % 3 === 0 ? "Evening" : "Morning";

      dataset.push({
        id: `REC-${month}-${idCounter++}`,
        date: `2026-${getMonthIndex(month)}-${dayStr}`,
        day: dayStr,
        month: month,
        year: "2026",
        weekday: getWeekday(day),
        className: grade,
        code: subj.code,
        codeClass: subj.codeClass,
        subject: subj.name,
        subjClass: subj.subjClass,
        type: type,
        shift: shift,
        room: subj.room,
        teacherInitials: subj.initials,
        teacherName: subj.teacher,
        teacherAvatarClass: subj.avatarClass,
        teacherDept: subj.dept,
        startTime: "08:00",
        endTime: "08:45",
        duration: "45 min",
        capacity: day % 2 === 0 ? "33 100" : "14 30",
        status: day % 7 === 0 ? "Conflict" : (day % 2 === 0 ? "Completed" : "Upcoming")
      });
    }
  });

  return dataset;
}

function getMonthIndex(m) {
  const map = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
  return map[m] || "08";
}

function getWeekday(day) {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[day % 7];
}

let routineData = generateFullMonthData();

const ALL_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Translation Dictionary
const i18nDict = {
  BN: {
    brand: "অ্যান্টিগ্র্যাভিটি পোর্টাল",
    nav_dashboard: "ড্যাশবোর্ড",
    nav_calendar: "ক্যালেন্ডার",
    nav_documents: "নথি-পত্র",
    nav_users: "ব্যবহারকারী",
    nav_institutes: "প্রতিষ্ঠান",
    nav_classes: "ক্লাসসমূহ",
    nav_messages: "বার্তা",
    nav_analytics: "অ্যানালিটিক্স",
    nav_search: "অনুসন্ধান",
    nav_location: "অবস্থান",
    status_saved: "সংরক্ষিত",
    status_live: "লাইভ",
    status_connected: "সংযুক্ত",
    conflict_badge: "⚡ ১ টি দ্বন্দ্ব",
    btn_fillup: "+ ফর্ম পূরণ",
    notif_head: "বিজ্ঞপ্তি (৩)",
    mark_read: "সব পঠিত চিহ্ন দিন",
    filter_all: "সকল",
    filter_class: "🏢 ক্লাস",
    filter_exam: "📝 পরীক্ষা",
    opt_all_classes: "🎓 সকল শ্রেণী ▾",
    opt_both_shifts: "⏱️ উভয় শিফট ▾",
    opt_morning: "সকাল",
    opt_evening: "বিকাল",
    btn_calendar: "🗓️ ক্যালেন্ডার",
    btn_daterange: "--- তারিখ পরিসীমা",
    lbl_month: "মাস",
    btn_all_months: "সব",
    btn_clear_months: "মুছুন",
    card_total_students: "মোট শিক্ষার্থী",
    card_dropped: "ড্রপআউট",
    card_eligible: "যোগ্য শিক্ষার্থী",
    card_ineligible: "অযোগ্য শিক্ষার্থী",
    card_todays_classes: "আজকের ক্লাস",
    card_todays_exams: "আজকের পরীক্ষা",
    card_busy_teachers: "ব্যস্ত শিক্ষক",
    card_available_rooms: "খালি রুম",
    card_pending_sms: "অপেক্ষমাণ এসএমএস",
    tbl_title: "রুটিন সূচী",
    btn_import: "📊 ইমপোর্ট",
    btn_export: "📥 এক্সপোর্ট",
    btn_sms: "💬 এসএমএস",
    btn_print: "🖨️ প্রিন্ট A4",
    btn_add_entry: "+ এন্ট্রি যুক্ত করুন",
    lbl_rows: "সারি:"
  },
  EN: {
    brand: "Antigravity Portal",
    nav_dashboard: "Dashboard",
    nav_calendar: "Calendar",
    nav_documents: "Documents",
    nav_users: "Users",
    nav_institutes: "Institutes",
    nav_classes: "Classes",
    nav_messages: "Messages",
    nav_analytics: "Analytics",
    nav_search: "Search",
    nav_location: "Location",
    status_saved: "Saved",
    status_live: "Live",
    status_connected: "Connected",
    conflict_badge: "⚡ 1 conflict",
    btn_fillup: "+ Form Fill-Up",
    notif_head: "Notifications (3)",
    mark_read: "Mark all read",
    filter_all: "All",
    filter_class: "🏢 Class",
    filter_exam: "📝 Exam",
    opt_all_classes: "🎓 All Classes ▾",
    opt_both_shifts: "⏱️ Both Shifts ▾",
    opt_morning: "Morning",
    opt_evening: "Evening",
    btn_calendar: "🗓️ Calendar",
    btn_daterange: "--- Date Range",
    lbl_month: "MONTH",
    btn_all_months: "All",
    btn_clear_months: "Clear",
    card_total_students: "Total Students",
    card_dropped: "Dropped",
    card_eligible: "Eligible",
    card_ineligible: "Ineligible",
    card_todays_classes: "Today's Classes",
    card_todays_exams: "Today's Exams",
    card_busy_teachers: "Busy Teachers",
    card_available_rooms: "Available Rooms",
    card_pending_sms: "Pending SMS",
    tbl_title: "Schedule Entries",
    btn_import: "📊 Import",
    btn_export: "📥 Export",
    btn_sms: "💬 SMS",
    btn_print: "🖨️ Print A4",
    btn_add_entry: "+ Add Entry",
    lbl_rows: "Rows:"
  }
};

// State
let currentFilters = {
  searchQuery: "",
  typeFilter: "ALL",
  classFilter: "ALL",
  shiftFilter: "ALL",
  statusFilter: "ALL",
  selectedYear: "2024",
  selectedMonths: ["Aug"]
};

let pagination = {
  currentPage: 1,
  rowsPerPage: 10
};

let currentLang = "EN";
let editingRecordId = null;
let selectedRowIds = new Set();
let sortColumn = "date";
let sortAsc = true;

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  renderVersion14Dashboard();
});

function setupEventListeners() {
  // Collapsible Sidebar Hover & Click
  const sidebar = document.getElementById("sidebar");
  sidebar?.addEventListener("mouseenter", () => sidebar.classList.add("expanded"));
  sidebar?.addEventListener("mouseleave", () => sidebar.classList.remove("expanded"));

  document.getElementById("sidebarToggleBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("expanded");
  });

  document.querySelectorAll(".sidebar-nav .nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-nav .nav-item").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const view = btn.getAttribute("data-view");
      if (view === "calendar") openCalendarModal();
      else showToast(`Navigated to ${btn.querySelector(".nav-text")?.innerText || 'View'}`);
    });
  });

  // Admin Quick Settings
  document.getElementById("adminSquareBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("adminQuickPopover")?.classList.toggle("open");
  });

  // KPI Actions
  document.querySelectorAll("[data-kpi-action]").forEach(card => {
    card.addEventListener("click", () => {
      const action = card.getAttribute("data-kpi-action");
      if (action === "pending-sms") document.getElementById("smsModalOverlay")?.classList.add("open");
      else if (action === "available-rooms") document.getElementById("roomsModalOverlay")?.classList.add("open");
      else if (action === "busy-teachers") document.getElementById("teachersModalOverlay")?.classList.add("open");
      else if (action === "dropped") { currentFilters.statusFilter = "Completed"; renderVersion14Dashboard(); }
      else if (action === "eligible") { currentFilters.statusFilter = "Upcoming"; renderVersion14Dashboard(); }
      else if (action === "ineligible") { currentFilters.statusFilter = "Conflict"; renderVersion14Dashboard(); }
      else if (action === "todays-classes") { currentFilters.typeFilter = "CLASS"; renderVersion14Dashboard(); }
      else if (action === "todays-exams") { currentFilters.typeFilter = "EXAM"; renderVersion14Dashboard(); }
      else { currentFilters.statusFilter = "ALL"; currentFilters.typeFilter = "ALL"; renderVersion14Dashboard(); }

      // Sync active state on segment buttons
      updateTypeSegmentButtonsUI();
    });
  });

  // Import / Export
  document.getElementById("importCsvBtn")?.addEventListener("click", () => {
    document.getElementById("importModalOverlay")?.classList.add("open");
  });
  document.getElementById("submitImportCsvBtn")?.addEventListener("click", handleCsvImportSubmit);
  document.getElementById("exportCsvBtn")?.addEventListener("click", exportCSV);

  // SMS
  document.getElementById("smsTriggerBtn")?.addEventListener("click", () => {
    document.getElementById("smsModalOverlay")?.classList.add("open");
  });
  document.getElementById("sendSmsConfirmBtn")?.addEventListener("click", () => {
    document.getElementById("smsModalOverlay")?.classList.remove("open");
    showToast("💬 47 SMS notifications dispatched successfully!");
  });

  // Print
  document.getElementById("printBtn")?.addEventListener("click", () => window.print());

  // Rows Selector
  document.getElementById("rowsSelect")?.addEventListener("change", (e) => {
    pagination.rowsPerPage = parseInt(e.target.value, 10);
    pagination.currentPage = 1;
    renderVersion14Dashboard();
  });

  // Year Select
  document.getElementById("yearSelect")?.addEventListener("change", (e) => {
    currentFilters.selectedYear = e.target.value;
    renderVersion14Dashboard();
  });

  // Conflict Badge
  document.getElementById("headerConflictBadge")?.addEventListener("click", () => {
    currentFilters.statusFilter = currentFilters.statusFilter === "Conflict" ? "ALL" : "Conflict";
    renderVersion14Dashboard();
  });

  // Search Input
  document.getElementById("searchInput")?.addEventListener("input", (e) => {
    currentFilters.searchQuery = e.target.value.toLowerCase();
    pagination.currentPage = 1;
    renderVersion14Dashboard();
  });

  // Language Toggle
  document.getElementById("langToggleBtn")?.addEventListener("click", toggleLanguage);

  // Popover Global Click Close
  document.addEventListener("click", () => {
    document.getElementById("notifPopover")?.classList.remove("open");
    document.getElementById("userPopover")?.classList.remove("open");
    document.getElementById("adminQuickPopover")?.classList.remove("open");
  });

  // Segmented Type Filters ([All] [Class] [Exam])
  document.querySelectorAll("[data-type-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-type-filter]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilters.typeFilter = btn.getAttribute("data-type-filter");
      pagination.currentPage = 1;
      renderVersion14Dashboard();
      showToast(`Filter applied: ${currentFilters.typeFilter}`);
    });
  });

  // Class Select Filter
  document.getElementById("classSelect")?.addEventListener("change", (e) => {
    currentFilters.classFilter = e.target.value;
    pagination.currentPage = 1;
    renderVersion14Dashboard();
  });

  // Shift Select Filter
  document.getElementById("shiftSelect")?.addEventListener("change", (e) => {
    currentFilters.shiftFilter = e.target.value;
    pagination.currentPage = 1;
    renderVersion14Dashboard();
  });

  // Custom Month Pills Multi-Select
  document.querySelectorAll(".m-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      const month = btn.getAttribute("data-month");
      if (currentFilters.selectedMonths.includes(month)) {
        if (currentFilters.selectedMonths.length > 1) {
          currentFilters.selectedMonths = currentFilters.selectedMonths.filter(m => m !== month);
        }
      } else {
        currentFilters.selectedMonths.push(month);
      }
      updateMonthPillsUI();
      pagination.currentPage = 1;
      renderVersion14Dashboard();
    });
  });

  document.getElementById("selectAllMonthsBtn")?.addEventListener("click", () => {
    currentFilters.selectedMonths = [...ALL_MONTHS];
    updateMonthPillsUI();
    pagination.currentPage = 1;
    renderVersion14Dashboard();
  });

  document.getElementById("clearMonthsBtn")?.addEventListener("click", () => {
    currentFilters.selectedMonths = ["Aug"];
    updateMonthPillsUI();
    pagination.currentPage = 1;
    renderVersion14Dashboard();
  });

  // Theme Toggle
  document.getElementById("themeToggleBtn")?.addEventListener("click", () => {
    const curr = document.documentElement.getAttribute("data-theme");
    const next = curr === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    showToast(`Switched to ${next} mode`);
  });

  // Modal Handlers
  document.getElementById("addEntryBtn")?.addEventListener("click", openAddModal);
  document.getElementById("closeModalBtn")?.addEventListener("click", closeModal);
  document.getElementById("cancelModalBtn")?.addEventListener("click", closeModal);
  document.getElementById("routineForm")?.addEventListener("submit", handleFormSubmit);

  document.getElementById("formFillUpBtn")?.addEventListener("click", () => {
    document.getElementById("fillUpModalOverlay")?.classList.add("open");
  });

  document.getElementById("calendarViewBtn")?.addEventListener("click", openCalendarModal);
}

function updateTypeSegmentButtonsUI() {
  document.querySelectorAll("[data-type-filter]").forEach(btn => {
    if (btn.getAttribute("data-type-filter") === currentFilters.typeFilter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function toggleLanguage() {
  currentLang = currentLang === "EN" ? "BN" : "EN";
  document.getElementById("langFlag").innerText = currentLang === "BN" ? "BD" : "US";
  document.getElementById("langLabel").innerText = currentLang === "BN" ? "বাংলা" : "English";

  const dict = i18nDict[currentLang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.innerText = dict[key];
  });

  showToast(`Language switched to ${currentLang === "BN" ? "Bangla" : "English"}`);
}

function handleCsvImportSubmit() {
  const fileInput = document.getElementById("csvFileInput");
  const file = fileInput?.files[0];
  if (!file) {
    showToast("⚠️ Please select a CSV file to import.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.split("\n").filter(l => l.trim().length > 0);
    let count = 0;
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map(c => c.replace(/"/g, "").trim());
      if (cols.length >= 5) {
        routineData.unshift({
          id: `REC-IMP-${Date.now()}-${i}`,
          date: cols[0] || "2026-08-10",
          day: cols[0] ? cols[0].slice(8,10) : "10",
          month: "Aug",
          year: "2026",
          weekday: cols[1] || "MON",
          className: cols[2] || "Class 9",
          code: cols[3] || "GEN-100",
          codeClass: "code-math",
          subject: cols[4] || "General Studies",
          subjClass: "subj-math",
          type: cols[5] || "EXAM",
          shift: cols[6] || "Morning",
          room: cols[7] || "Room 101",
          teacherInitials: "IMP",
          teacherName: cols[8] || "Imported Staff",
          teacherAvatarClass: "avatar-sharma",
          teacherDept: "Faculty Staff",
          startTime: cols[9] || "10:00",
          endTime: cols[10] || "10:45",
          duration: "45 min",
          capacity: "30 100",
          status: cols[11] || "Upcoming"
        });
        count++;
      }
    }
    document.getElementById("importModalOverlay")?.classList.remove("open");
    renderVersion14Dashboard();
    showToast(`✅ Imported ${count} schedule records!`);
  };
  reader.readAsText(file);
}

function updateMonthPillsUI() {
  document.querySelectorAll(".m-pill").forEach(btn => {
    const month = btn.getAttribute("data-month");
    if (currentFilters.selectedMonths.includes(month)) {
      btn.className = "m-pill active";
    } else {
      btn.className = "m-pill";
    }
  });
  const counter = document.getElementById("selectedMonthCounter");
  if (counter) counter.innerText = `${currentFilters.selectedMonths.length} / 12 selected`;
}

function openCalendarModal() {
  document.getElementById("calendarModalOverlay")?.classList.add("open");
}

// MULTI-MONTH RENDERER WITH EXAM / CLASS TYPE BADGES IN TABLE
function renderVersion14Dashboard() {
  const container = document.getElementById("multiMonthTableContainer");
  if (!container) return;
  container.innerHTML = "";

  const filtered = routineData.filter(item => {
    const matchesSearch = 
      item.subject.toLowerCase().includes(currentFilters.searchQuery) ||
      item.teacherName.toLowerCase().includes(currentFilters.searchQuery) ||
      item.code.toLowerCase().includes(currentFilters.searchQuery) ||
      item.room.toLowerCase().includes(currentFilters.searchQuery) ||
      item.className.toLowerCase().includes(currentFilters.searchQuery);

    const matchesType = currentFilters.typeFilter === "ALL" || item.type === currentFilters.typeFilter;
    const matchesClass = currentFilters.classFilter === "ALL" || item.className === currentFilters.classFilter;
    const matchesShift = currentFilters.shiftFilter === "ALL" || item.shift === currentFilters.shiftFilter;
    const matchesStatus = currentFilters.statusFilter === "ALL" || item.status === currentFilters.statusFilter;

    return matchesSearch && matchesType && matchesClass && matchesShift && matchesStatus;
  });

  const activeMonths = ALL_MONTHS.filter(m => currentFilters.selectedMonths.includes(m));
  const monthFiltered = filtered.filter(d => activeMonths.includes(d.month));

  const totalBadge = document.getElementById("totalRecordsBadge");
  if (totalBadge) totalBadge.innerText = `${monthFiltered.length} records`;

  const totalRecords = monthFiltered.length;
  const totalPages = Math.ceil(totalRecords / pagination.rowsPerPage) || 1;

  if (pagination.currentPage > totalPages) pagination.currentPage = totalPages;

  const startIndex = (pagination.currentPage - 1) * pagination.rowsPerPage;
  const endIndex = startIndex + pagination.rowsPerPage;
  const pageRecords = monthFiltered.slice(startIndex, endIndex);

  activeMonths.forEach(month => {
    const recordsInThisMonthPage = pageRecords.filter(item => item.month === month);

    if (recordsInThisMonthPage.length > 0 || activeMonths.length === 1) {
      const block = document.createElement("div");
      block.className = "month-block-v14";

      const header = document.createElement("div");
      header.className = "month-header-bar-v14";
      header.innerText = `${monthFullTitle(month)} ${currentFilters.selectedYear} Schedule`;
      block.appendChild(header);

      const scrollWrap = document.createElement("div");
      scrollWrap.className = "table-responsive-v14";

      const table = document.createElement("table");
      table.className = "routine-table-v14";

      table.innerHTML = `
        <thead>
          <tr>
            <th style="width: 28px;"><input type="checkbox" onchange="toggleSelectAllMonth('${month}', this.checked)"></th>
            <th onclick="sortTable('date')">DATE ↑</th>
            <th onclick="sortTable('className')">CLASS ↑</th>
            <th onclick="sortTable('code')">CODE ↑</th>
            <th onclick="sortTable('subject')">SUBJECT ↑</th>
            <th onclick="sortTable('type')">TYPE ↑</th>
            <th onclick="sortTable('shift')">SHIFT ↑</th>
            <th onclick="sortTable('room')">ROOM ↑</th>
            <th>TEACHER</th>
            <th onclick="sortTable('startTime')">TIME ↑</th>
            <th>MARKS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
      `;

      const tbody = document.createElement("tbody");

      if (recordsInThisMonthPage.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="12" style="text-align: center; padding: 20px; color: var(--text-light);">
              No ${currentFilters.typeFilter !== 'ALL' ? currentFilters.typeFilter : ''} records for ${monthFullTitle(month)} on Page ${pagination.currentPage}.
            </td>
          </tr>
        `;
      } else {
        recordsInThisMonthPage.forEach((item) => {
          const tr = document.createElement("tr");
          const isChecked = selectedRowIds.has(item.id) ? "checked" : "";

          const classParts = item.className.split(" ");
          const classLbl = classParts[0] || "Class";
          const classGrade = classParts[1] || "IX";

          const typeClass = item.type === "CLASS" ? "t-class" : (item.type === "PRACT" ? "t-pract" : "t-exam");
          const shiftClass = item.shift === "Morning" ? "shift-morning" : "shift-evening";

          tr.innerHTML = `
            <td><input type="checkbox" ${isChecked} onchange="toggleSelectRow('${item.id}', this.checked)"></td>
            <td>
              <div class="date-cell-v14">
                <span class="date-day-num">${item.day}</span>
                <span class="date-month-name">${item.month}</span>
                <span class="date-wkday-tag">${item.weekday}</span>
              </div>
            </td>
            <td>
              <div class="class-cell-v14">
                <span class="class-lbl">${classLbl}</span>
                <span class="class-grade">${classGrade}</span>
              </div>
            </td>
            <td><span class="code-pill-v14 ${item.codeClass}">${item.code}</span></td>
            <td><div class="${item.subjClass}">${item.subject}</div></td>
            <td><span class="type-pill-v14 ${typeClass}">${item.type}</span></td>
            <td><span class="shift-pill-v14 ${shiftClass}">${item.shift}</span></td>
            <td><strong style="color: #0f1c2e;">${item.room}</strong></td>
            <td>
              <div class="teacher-info-container">
                <div class="teacher-avatar-v14 ${item.teacherAvatarClass}">${item.teacherInitials}</div>
                <span style="font-weight: 800; color: #0f1c2e;">${item.teacherName}</span>
                <div class="teacher-hover-card">
                  <div class="thc-name">${item.teacherName}</div>
                  <div class="thc-dept">${item.teacherDept || 'Senior Academic Faculty'}</div>
                  <div class="thc-info">
                    <span>📚 Active: ${item.code} - ${item.subject}</span>
                    <span>🏫 Venue: ${item.room} (${item.className})</span>
                    <span>📧 Contact: ${item.teacherInitials.toLowerCase()}@schoolportal.edu</span>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div>
                <div class="time-val-v14">${item.startTime} → ${item.endTime}</div>
                <div class="time-dur-v14">${item.duration}</div>
              </div>
            </td>
            <td><strong style="color: #0f1c2e; font-size: 0.82rem;">${item.capacity}</strong></td>
            <td>
              <div class="action-btns-v14">
                <button class="act-sq-btn btn-act-view" onclick="viewRecord('${item.id}')" title="View Details">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                <button class="act-sq-btn btn-act-edit" onclick="editRecord('${item.id}')" title="Edit Entry">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="act-sq-btn btn-act-copy" onclick="saveRecord('${item.id}')" title="Save Entry">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                </button>
                <button class="act-sq-btn btn-act-print" onclick="window.print()" title="Print Slip">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                </button>
                <button class="act-sq-btn btn-act-delete" onclick="deleteRecord('${item.id}')" title="Delete Entry">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </td>
          `;
          tbody.appendChild(tr);
        });
      }

      table.appendChild(tbody);
      scrollWrap.appendChild(table);
      block.appendChild(scrollWrap);
      container.appendChild(block);
    }
  });

  renderPaginationControls(totalRecords, totalPages);
}

function renderPaginationControls(totalRecords, totalPages) {
  const infoTxt = document.getElementById("paginationInfoTxt");
  const controlsWrap = document.getElementById("paginationControls");
  if (!infoTxt || !controlsWrap) return;

  const startRecord = totalRecords === 0 ? 0 : (pagination.currentPage - 1) * pagination.rowsPerPage + 1;
  const endRecord = Math.min(pagination.currentPage * pagination.rowsPerPage, totalRecords);
  infoTxt.innerText = `Showing ${startRecord} to ${endRecord} of ${totalRecords} records`;

  controlsWrap.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.className = "pagination-btn";
  prevBtn.innerText = "◀ Prev";
  prevBtn.disabled = pagination.currentPage === 1;
  prevBtn.onclick = () => { if (pagination.currentPage > 1) { pagination.currentPage--; renderVersion14Dashboard(); } };
  controlsWrap.appendChild(prevBtn);

  for (let p = 1; p <= totalPages; p++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = p === pagination.currentPage ? "pagination-btn active" : "pagination-btn";
    pageBtn.innerText = String(p);
    pageBtn.onclick = () => { pagination.currentPage = p; renderVersion14Dashboard(); };
    controlsWrap.appendChild(pageBtn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.className = "pagination-btn";
  nextBtn.innerText = "Next ▶";
  nextBtn.disabled = pagination.currentPage === totalPages || totalPages === 0;
  nextBtn.onclick = () => { if (pagination.currentPage < totalPages) { pagination.currentPage++; renderVersion14Dashboard(); } };
  controlsWrap.appendChild(nextBtn);
}

function toggleSelectRow(id, isChecked) {
  if (isChecked) selectedRowIds.add(id);
  else selectedRowIds.delete(id);
}

function toggleSelectAllMonth(month, isChecked) {
  routineData.filter(r => r.month === month).forEach(r => {
    if (isChecked) selectedRowIds.add(r.id);
    else selectedRowIds.delete(r.id);
  });
  renderVersion14Dashboard();
}

function sortTable(columnKey) {
  if (sortColumn === columnKey) { sortAsc = !sortAsc; }
  else { sortColumn = columnKey; sortAsc = true; }
  routineData.sort((a, b) => {
    let valA = a[columnKey] || "";
    let valB = b[columnKey] || "";
    return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });
  renderVersion14Dashboard();
  showToast(`Sorted by ${columnKey}`);
}

function monthFullTitle(shortMon) {
  const map = { Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June", Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December" };
  return map[shortMon] || shortMon;
}

function openAddModal() {
  editingRecordId = null;
  document.getElementById("modalTitle").innerText = "Add New Schedule Entry";
  document.getElementById("routineForm").reset();
  document.getElementById("modalOverlay").classList.add("open");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
}

function viewRecord(id) {
  const item = routineData.find(r => r.id === id);
  if (item) showToast(`📌 [${item.code}] ${item.subject} (${item.className}) - ${item.teacherName}`);
}

function editRecord(id) {
  const item = routineData.find(r => r.id === id);
  if (!item) return;
  editingRecordId = id;
  document.getElementById("modalTitle").innerText = "Edit Schedule Entry";
  document.getElementById("formDate").value = item.date;
  document.getElementById("formClass").value = item.className;
  document.getElementById("formCode").value = item.code;
  document.getElementById("formSubject").value = item.subject;
  document.getElementById("formType").value = item.type;
  document.getElementById("formShift").value = item.shift;
  document.getElementById("formRoom").value = item.room;
  document.getElementById("formTeacher").value = item.teacherName;
  document.getElementById("formStartTime").value = item.startTime;
  document.getElementById("formEndTime").value = item.endTime;
  document.getElementById("formStatus").value = item.status;
  document.getElementById("modalOverlay").classList.add("open");
}

function saveRecord(id) {
  const item = routineData.find(r => r.id === id);
  if (!item) return;
  showToast(`💾 Record ${item.code} committed & saved successfully!`);
}

function deleteRecord(id) {
  routineData = routineData.filter(r => r.id !== id);
  renderVersion14Dashboard();
  showToast("🗑️ Entry deleted");
}

function handleFormSubmit(e) {
  e.preventDefault();
  const rawDate = document.getElementById("formDate").value;
  const dateObj = new Date(rawDate);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const teacherName = document.getElementById("formTeacher").value;

  const payload = {
    id: editingRecordId || `REC-${Date.now().toString().slice(-4)}`,
    date: rawDate,
    day: String(dateObj.getDate()).padStart(2, "0"),
    month: months[dateObj.getMonth()],
    year: String(dateObj.getFullYear()),
    weekday: weekdays[dateObj.getDay()],
    className: document.getElementById("formClass").value,
    code: document.getElementById("formCode").value,
    codeClass: "code-math",
    subject: document.getElementById("formSubject").value,
    subjClass: "subj-math",
    type: document.getElementById("formType").value,
    shift: document.getElementById("formShift").value,
    room: document.getElementById("formRoom").value,
    teacherInitials: teacherName.slice(0,2).toUpperCase(),
    teacherName: teacherName,
    teacherAvatarClass: "avatar-sharma",
    teacherDept: "Faculty Staff",
    startTime: document.getElementById("formStartTime").value,
    endTime: document.getElementById("formEndTime").value,
    duration: "45 min",
    capacity: "33 100",
    status: document.getElementById("formStatus").value
  };

  if (editingRecordId) {
    const idx = routineData.findIndex(r => r.id === editingRecordId);
    if (idx !== -1) routineData[idx] = payload;
    showToast("Schedule entry updated");
  } else {
    routineData.unshift(payload);
    showToast("New entry added");
  }
  closeModal();
  renderVersion14Dashboard();
}

function exportCSV() {
  const headers = ["Date", "Day", "Class", "Code", "Subject", "Type", "Shift", "Room", "Teacher", "Start", "End", "Status"];
  const csvRows = [headers.join(",")];
  routineData.forEach(item => {
    csvRows.push([`"${item.date}"`, `"${item.weekday}"`, `"${item.className}"`, `"${item.code}"`, `"${item.subject}"`, `"${item.type}"`, `"${item.shift}"`, `"${item.room}"`, `"${item.teacherName}"`, `"${item.startTime}"`, `"${item.endTime}"`, `"${item.status}"`].join(","));
  });
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Routine_CE_v14_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  showToast("📥 CSV Exported successfully!");
}

function showToast(msg) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const el = document.createElement("div");
  el.className = "toast-msg";
  el.innerText = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}
