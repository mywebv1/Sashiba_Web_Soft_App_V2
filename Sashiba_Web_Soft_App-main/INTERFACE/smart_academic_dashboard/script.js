/**
 * ============================================================
 * সশিবা স্মার্ট একাডেমিক ড্যাশবোর্ড (Smart Academic Dashboard) — Script.js
 * ============================================================
 */

// ১. পেজ ইনিশিয়ালাইজেশন ও লোড
document.addEventListener("DOMContentLoaded", () => {
  // localStorage থেকে থিম রিড করা
  const savedTheme = localStorage.getItem("sashiba_theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    updateDarkModeBtn(true);
  }

  // Keyboard Event: Esc কি চাপলে সব মডাল বন্ধ হবে
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });

  // পোস্টমেসেজ থিম লিসেনার
  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "THEME_CHANGE") {
      if (event.data.theme === "dark") {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
      updateDarkModeBtn(document.body.classList.contains("dark-mode"));
    }
  });
});

// ২. সেকশন ন্যাভিগেশন লজিক
function showSection(sectionId) {
  // সব কন্টেন্ট সেকশন হাইড করা
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((sec) => sec.classList.add("hidden"));

  // টার্গেট সেকশন আন-হাইড করা
  const targetSection = document.getElementById(`section-${sectionId}`);
  if (targetSection) {
    targetSection.classList.remove("hidden");
  }

  // সাইডবার অ্যাক্টিভ স্টেট আপডেট করা
  const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
  navItems.forEach((item) => item.classList.remove("active"));

  const activeNavItem = document.getElementById(`nav-${sectionId}`);
  if (activeNavItem) {
    activeNavItem.classList.add("active");
  }

  // টাইটেল আপডেট
  updatePageTitle(sectionId);
}

function updatePageTitle(sectionId) {
  const titles = {
    overview: { main: "স্মার্ট একাডেমিক ড্যাশবোর্ড", sub: "সশিবা কারিকুলাম ও শিডিউল লার্নিং ওভারভিউ" },
    syllabus: { main: "স্মার্ট সিলেবাস ম্যানেজার", sub: "অধ্যায়ভিত্তিক অগ্রগতির বার ও পারদর্শিতার সূচক" },
    routine: { main: "স্মার্ট অ্যাডাপ্টিভ রুটিন", sub: "ভার্টিক্যাল টাইমলাইন ও সরাসরি ক্লাস অ্যাকশন" },
    attendance: { main: "উপস্থিতি ও পার্টিসিপেশন ট্র্যাকার", sub: "দৈনিক উপস্থিতি রেজিস্টার ও মন্তব্য" },
    exam: { main: "পরীক্ষার রুটিন ও সময়সূচি সূচক", sub: "ক্লাস টেস্ট ও অর্ধবার্ষিকী পরীক্ষার তালিকা" },
    liveclass: { main: "স্মার্ট লাইভ ক্লাসরুম", sub: "সরাসরি ইন্টারেক্টিভ ক্লাস সেশন" },
    history: { main: "সংরক্ষিত তথ্য ও আর্কাইভস", sub: "A4 পেপারে রেকর্ড প্রিভিউ ও প্রিন্ট" },
    progress: { main: "স্মার্ট প্রোগ্রেস ও অ্যানালিটিক্স", sub: "গ্রাফিক্যাল পারফরম্যান্স ও AI শিক্ষক ফিডব্যাক" },
    settings: { main: "সিস্টেম সেটিংস", sub: "ড্যাশবোর্ড কনফিগারেশন ও পারমিশন" }
  };

  const info = titles[sectionId] || titles["overview"];
  document.getElementById("page-main-title").innerText = info.main;
  document.getElementById("page-sub-title").innerText = info.sub;
}

// ৩. সাইডবার কলাপস/এক্সপ্যান্ড টগল
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("collapsed");
  }
}

// ৪. ডার্ক/লাইট মোড টগল
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  updateDarkModeBtn(isDark);

  try {
    localStorage.setItem("sashiba_theme", isDark ? "dark" : "light");
  } catch (e) {}
}

function updateDarkModeBtn(isDark) {
  const btn = document.getElementById("dark-mode-btn");
  if (btn) {
    btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    btn.title = isDark ? "লাইট মোড" : "ডার্ক মোড";
  }
}

// ৫. Confetti Celebration Effect
function triggerConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  } else {
    // Fallback toast if confetti library not loaded
    showToast("🎉 চমৎকার! টপিক সম্পন্ন হয়েছে!");
  }
}

// ৬. টপিক চেকলিস্ট টগল
function toggleTopicCheck(checkbox) {
  const parentItem = checkbox.closest(".check-item");
  if (checkbox.checked) {
    parentItem.classList.add("checked");
    triggerConfetti();
  } else {
    parentItem.classList.remove("checked");
  }
}

// ৭. সিলেবাস সার্চ ও ফিল্টারিং
function filterChapters() {
  const searchVal = document.getElementById("syllSearchInput").value.toLowerCase();
  const statusVal = document.getElementById("syllStatusFilter").value;

  const cards = document.querySelectorAll("#chapterCardsContainer .chapter-card");
  cards.forEach((card) => {
    const title = card.querySelector("h3").innerText.toLowerCase();
    const status = card.dataset.status;

    const matchesSearch = title.includes(searchVal);
    const matchesStatus = statusVal === "all" || status === statusVal;

    if (matchesSearch && matchesStatus) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

function filterMonth(month, btn) {
  document.querySelectorAll(".month-chip").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  filterChapters();
}

function setTerm(term, btn) {
  document.querySelectorAll(".term-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  showToast(`টার্ম পরিবর্তন করা হয়েছে: ${term === 'half' ? 'অর্ধবার্ষিক' : 'বার্ষিক'}`);
}

function sortChapters() {
  const sortBy = document.getElementById("syllSortFilter").value;
  showToast(`অধ্যায় সাজানো হয়েছে: ${sortBy}`);
}

// ৮. Exam Hub Accordion Toggle
function toggleExamHub(btn) {
  const card = btn.closest(".chapter-card");
  const panel = card.querySelector(".exam-hub-panel");
  const icon = btn.querySelector(".fa-chevron-down, .fa-chevron-up");

  if (panel.classList.contains("hidden")) {
    panel.classList.remove("hidden");
    if (icon) icon.className = "fa-solid fa-chevron-up";
  } else {
    panel.classList.add("hidden");
    if (icon) icon.className = "fa-solid fa-chevron-down";
  }
}

// ৯. Modals Handler
function openResourceModal(type, title) {
  const modal = document.getElementById("resourceModal");
  const modalTitle = document.getElementById("resModalTitle");
  const modalBody = document.getElementById("resModalBody");

  const icons = {
    video: "fa-video",
    note: "fa-file-lines",
    quiz: "fa-circle-question",
    pyq: "fa-chart-pie"
  };

  modalTitle.innerHTML = `<i class="fa-solid ${icons[type] || 'fa-folder'}"></i> ${title} — ${type.toUpperCase()} রিসোর্স`;

  modalBody.innerHTML = `
    <div class="res-modal-items">
      <div class="res-item glass-card" style="padding:12px; margin-bottom:10px;">
        <strong>১. ${title} মূল লেকচার (${type.toUpperCase()})</strong>
        <p>নতুন কারিকুলাম ভিত্তিক স্মার্ট ডিজিটাল রিসোর্স।</p>
        <button class="btn-primary btn-sm" onclick="alert('রিসোর্স ফাইল ওপেন হচ্ছে...')"><i class="fa-solid fa-download"></i> ওপেন / ডাউনলোড</button>
      </div>
      <div class="res-item glass-card" style="padding:12px;">
        <strong>২. অনুশীলনমূলক কুইজ ও ওয়ার্কশীট</strong>
        <p>বিগত বছরের বোর্ড প্রশ্নসহ সমাধান।</p>
        <button class="btn-green btn-sm" onclick="alert('সশিবা অনলাইন কুইজ পোর্টাল খুলছে...')"><i class="fa-solid fa-play"></i> শুরু করুন</button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
}

function closeResourceModal() {
  document.getElementById("resourceModal").classList.add("hidden");
}

function openSyllabusLinkModal(title) {
  document.getElementById("syllLinkTitle").innerHTML = `<i class="fa-solid fa-link"></i> ${title} — বিস্তারিত তথ্য`;
  document.getElementById("syllLinkModal").classList.remove("hidden");
}

function closeSyllabusLinkModal() {
  document.getElementById("syllLinkModal").classList.add("hidden");
}

// A4 Paper History Modal
function openA4HistoryModal(title, date, subject, className, teacher) {
  document.getElementById("a4DocTitle").innerText = title;
  document.getElementById("a4DocDate").innerText = date;
  document.getElementById("a4DocSubject").innerText = subject;
  document.getElementById("a4DocClass").innerText = className;
  document.getElementById("a4DocTeacher").innerText = teacher;

  document.getElementById("a4HistoryModal").classList.remove("hidden");
}

function closeA4HistoryModal() {
  document.getElementById("a4HistoryModal").classList.add("hidden");
}

function toggleNotifModal() {
  document.getElementById("notifModal").classList.toggle("hidden");
}

function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach((m) => m.classList.add("hidden"));
}

// ১০. রোল সুইচার
function changeRole(role) {
  const roleLabels = {
    teacher: "প্রধান শিক্ষক",
    student: "শিক্ষার্থী",
    admin: "সিস্টেম অ্যাডমিন",
    parent: "অভিভাবক"
  };

  const label = roleLabels[role] || "শিক্ষক";
  document.getElementById("user-role-label").innerText = label;
  showToast(`রোল পরিবর্তন করা হয়েছে: ${label}`);
}

// ১১. গাণিতিক বিষয়ভিত্তিক উপস্থিতি ক্যালকুলেশন ইঞ্জিন ও কলাম/রো কন্ট্রোলার
let currentEditingRow = null;

// রিয়েল-টাইম অটোমেটিক % ক্যালকুলেশন, পার্টিসিপেশন মার্ক (১-১০) ও স্টার রেটিং (১-৫) জেনারেটর
function recalculateStudentRow(tr) {
  const subChips = tr.querySelectorAll(".sub-chip");
  if (!subChips || subChips.length === 0) return;

  const totalSubjects = subChips.length;
  let totalScorePoints = 0;

  subChips.forEach(chip => {
    if (chip.classList.contains("present")) totalScorePoints += 1.0;
    else if (chip.classList.contains("late")) totalScorePoints += 0.5;
    else if (chip.classList.contains("leave")) totalScorePoints += 1.0; // excused
    else totalScorePoints += 0.0; // absent
  });

  const percentage = Math.round((totalScorePoints / totalSubjects) * 100);
  const partScore = Math.round(percentage / 10);

  // Star Rating Calculation
  let starsHtml = "";
  if (percentage >= 100) starsHtml = '<span class="att-level high">⭐⭐⭐⭐⭐ (৫ স্টার)</span>';
  else if (percentage >= 80) starsHtml = '<span class="att-level high">⭐⭐⭐⭐ (৪ স্টার)</span>';
  else if (percentage >= 60) starsHtml = '<span class="att-level medium">⭐⭐⭐ (৩ স্টার)</span>';
  else if (percentage >= 40) starsHtml = '<span class="att-level medium">⭐⭐ (২ স্টার)</span>';
  else starsHtml = '<span class="att-level low">⭐ (১ স্টার ⚠️)</span>';

  const cells = tr.cells;
  const percentCellIndex = cells.length - 5;
  const partCellIndex = cells.length - 4;
  const starCellIndex = cells.length - 3;

  // Status Pill Class & Icon
  let pillClass = "present";
  let pillIcon = '<i class="fa-solid fa-circle-check"></i>';
  if (percentage < 60) { pillClass = "absent"; pillIcon = '<i class="fa-solid fa-circle-xmark"></i>'; }
  else if (percentage < 85) { pillClass = "late"; pillIcon = '<i class="fa-solid fa-clock"></i>'; }

  if (cells[percentCellIndex]) cells[percentCellIndex].innerHTML = `<span class="status-pill ${pillClass}">${pillIcon} ${percentage}%</span>`;
  if (cells[partCellIndex]) cells[partCellIndex].innerHTML = `<span class="score-badge ${partScore === 0 ? 'zero' : ''}">${partScore} / ১০</span>`;
  if (cells[starCellIndex]) cells[starCellIndex].innerHTML = starsHtml;
}

function recalculateAllRows() {
  const bodyRows = document.querySelectorAll("#attendanceTable tbody tr");
  bodyRows.forEach(tr => recalculateStudentRow(tr));
}

function filterAttendanceTable() {
  const dept = document.getElementById("attDeptFilter").value;
  const cls = document.getElementById("attClassFilter").value;
  const sec = document.getElementById("attSectionFilter").value;
  showToast(`উপস্থিতি ফিল্টার: ${dept !== 'all' ? dept : 'সব বিভাগ'} | শ্রেণি ${cls} | শাখা ${sec}`);
}

// স্কুল লোগো আপলোড হ্যান্ডলার (FileReader)
function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const logoImg = document.getElementById("schoolReportLogo");
      if (logoImg) {
        logoImg.src = e.target.result;
        showToast("স্কুল লোগো সফলভাবে আপলোড করা হয়েছে! ✅");
      }
    };
    reader.readAsDataURL(file);
  }
}

// ডাইনামিক নতুন বিষয় কলাম যোগ করার মডাল ও লজিক
function openAddSubjectModal() {
  document.getElementById("addSubjectModal").classList.remove("hidden");
}

function closeAddSubjectModal() {
  document.getElementById("addSubjectModal").classList.add("hidden");
}

function addNewSubjectColumn(event) {
  event.preventDefault();
  const subjectTitle = document.getElementById("newSubjectTitleInput").value.trim();
  if (!subjectTitle) return;

  const table = document.getElementById("attendanceTable");
  const headerRow = table.querySelector("thead tr");
  
  const totalPercentTh = Array.from(headerRow.children).find(th => th.innerText.includes("মোট %"));
  const targetIndex = totalPercentTh ? totalPercentTh.cellIndex : headerRow.children.length - 5;

  // Create new <th> header cell with Delete Button
  const newTh = document.createElement("th");
  newTh.className = "subj-col animated-pop";
  newTh.innerHTML = `
    <span>${subjectTitle}</span>
    <span class="col-del-btn no-print" onclick="deleteSubjectColumn(this)" title="কলাম বাদ দিন">✕</span>
  `;
  headerRow.insertBefore(newTh, headerRow.children[targetIndex]);

  // Append new <td> to all student rows in tbody
  const bodyRows = table.querySelectorAll("tbody tr");
  bodyRows.forEach(tr => {
    const newTd = document.createElement("td");
    newTd.className = "text-center";
    newTd.innerHTML = `<span class="sub-chip present animated-pop" onclick="toggleSubChip(this)"><i class="fa-solid fa-check"></i> উপস্থিত</span>`;
    tr.insertBefore(newTd, tr.children[targetIndex]);
  });

  closeAddSubjectModal();
  document.getElementById("newSubjectTitleInput").value = "";
  recalculateAllRows();
  triggerConfetti();
  showToast(`নতুন বিষয় কলাম: "${subjectTitle}" যুক্ত করা হয়েছে! সকল শতকরা অটো হিসাব সম্পন্ন। 🎉`);
}

// ডাইনামিক বিষয় কলাম ডিলিট (বাদ দেওয়া)
function openDeleteSubjectModal() {
  const table = document.getElementById("attendanceTable");
  const subjThs = table.querySelectorAll("thead tr th.subj-col");
  const select = document.getElementById("deleteSubjectSelect");
  select.innerHTML = "";

  if (subjThs.length === 0) {
    showToast("টেবিলে বাদ দেওয়ার মতো কোনো বিষয় কলাম অবশিষ্ট নেই!");
    return;
  }

  subjThs.forEach(th => {
    const title = th.querySelector("span") ? th.querySelector("span").innerText.trim() : th.innerText.trim();
    const opt = document.createElement("option");
    opt.value = th.cellIndex;
    opt.innerText = title;
    select.appendChild(opt);
  });

  document.getElementById("deleteSubjectModal").classList.remove("hidden");
}

function closeDeleteSubjectModal() {
  document.getElementById("deleteSubjectModal").classList.add("hidden");
}

function confirmDeleteSubjectFromModal(event) {
  event.preventDefault();
  const select = document.getElementById("deleteSubjectSelect");
  const colIndex = parseInt(select.value);
  const subjName = select.options[select.selectedIndex].text;

  const table = document.getElementById("attendanceTable");
  const headerRow = table.querySelector("thead tr");
  
  if (headerRow.children[colIndex]) {
    headerRow.children[colIndex].remove();

    const bodyRows = table.querySelectorAll("tbody tr");
    bodyRows.forEach(tr => {
      if (tr.children[colIndex]) tr.children[colIndex].remove();
    });

    recalculateAllRows();
    closeDeleteSubjectModal();
    showToast(`"${subjName}" বিষয় কলামটি সফলভাবে বাদ দেওয়া হয়েছে!`);
  }
}

function deleteSubjectColumn(btn) {
  const th = btn.closest("th");
  const colIndex = th.cellIndex;
  const subjName = th.querySelector("span") ? th.querySelector("span").innerText : "বিষয়";

  if (confirm(`আপনি কি "${subjName}" বিষয় কলামটি টেবিল থেকে মুছে ফেলতে চান?`)) {
    const table = document.getElementById("attendanceTable");
    th.remove();

    const bodyRows = table.querySelectorAll("tbody tr");
    bodyRows.forEach(tr => {
      if (tr.children[colIndex]) tr.children[colIndex].remove();
    });

    recalculateAllRows();
    showToast(`"${subjName}" বিষয় কলামটি বাদ দেওয়া হয়েছে। উপস্থিতি শতকরা পুনর্হিসাব সম্পন্ন!`);
  }
}

// ✅ ❌ 🕒 📄 কলামের বিষয়ভিত্তিক সাব-চিপ ইন্টারেক্টিভ ক্লিক টগল
function toggleSubChip(chip) {
  if (chip.classList.contains("present")) {
    chip.className = "sub-chip absent animated-pop";
    chip.innerHTML = '<i class="fa-solid fa-xmark"></i> অনুপস্থিত';
    showToast("বিষয় স্ট্যাটাস: ❌ অনুপস্থিত");
  } else if (chip.classList.contains("absent")) {
    chip.className = "sub-chip late animated-pop";
    chip.innerHTML = '<i class="fa-solid fa-clock"></i> বিলম্ব';
    showToast("বিষয় স্ট্যাটাস: 🕒 বিলম্ব");
  } else if (chip.classList.contains("late")) {
    chip.className = "sub-chip leave animated-pop";
    chip.innerHTML = '<i class="fa-solid fa-file-signature"></i> ছুটি';
    showToast("বিষয় স্ট্যাটাস: 📄 ছুটি");
  } else {
    chip.className = "sub-chip present animated-pop";
    chip.innerHTML = '<i class="fa-solid fa-check"></i> উপস্থিত';
    showToast("বিষয় স্ট্যাটাস: ✅ উপস্থিত");
  }

  const tr = chip.closest("tr");
  if (tr) recalculateStudentRow(tr);
}

function toggleModalSubChip(chip) {
  toggleSubChip(chip);
}

// এক ক্লিকে সবাইকে উপস্থিত মার্ক করা
function markAllPresent() {
  const subChips = document.querySelectorAll("#attendanceTable tbody .sub-chip");
  subChips.forEach(chip => {
    chip.className = "sub-chip present animated-pop";
    chip.innerHTML = '<i class="fa-solid fa-check"></i> উপস্থিত';
  });

  recalculateAllRows();
  triggerConfetti();
  showToast("সকল বিষয়ের শিক্ষার্থীদের ✅ উপস্থিত হিসেবে চিহ্নিত ও ১০০% হিসাব করা হয়েছে!");
}

// মডালের মাধ্যমে বিস্তারিত সম্পাদনা
function openEditAttendanceModal(btn) {
  currentEditingRow = btn.closest("tr");
  const cells = currentEditingRow.cells;

  const rollText = cells[0].innerText.trim();
  const nameText = cells[1].querySelector("span") ? cells[1].querySelector("span").innerText : cells[1].innerText.trim();
  const avatarText = cells[1].querySelector(".stu-img-avatar") ? cells[1].querySelector(".stu-img-avatar").innerText : nameText.substring(0, 2).toUpperCase();

  document.getElementById("editModalHeaderTitle").innerText = `${nameText} (রোল ${rollText}) — সম্পাদনা`;
  document.getElementById("editAttAvatarPreview").innerText = avatarText;

  document.getElementById("editAttRoll").value = rollText;
  document.getElementById("editAttName").value = nameText;
  document.getElementById("editAttClass").value = cells[2].innerText.trim();

  // Score & Attention
  const scoreCellIndex = cells.length - 4;
  const scoreText = cells[scoreCellIndex].innerText.replace(/[^0-9]/g, '');
  document.getElementById("editAttScore").value = scoreText || 8;

  const attCellIndex = cells.length - 3;
  const attText = cells[attCellIndex].innerText;
  if (attText.includes("উচ্চ")) document.getElementById("editAttAttention").value = "high";
  else if (attText.includes("মাঝারি")) document.getElementById("editAttAttention").value = "medium";
  else document.getElementById("editAttAttention").value = "low";

  const commentCellIndex = cells.length - 2;
  document.getElementById("editAttComment").value = cells[commentCellIndex].innerText.trim();

  document.getElementById("editAttendanceModal").classList.remove("hidden");
}

function closeEditAttendanceModal() {
  document.getElementById("editAttendanceModal").classList.add("hidden");
  currentEditingRow = null;
}

function saveAttendanceEdit(event) {
  event.preventDefault();
  if (!currentEditingRow) return;

  const roll = document.getElementById("editAttRoll").value;
  const name = document.getElementById("editAttName").value;
  const clsSec = document.getElementById("editAttClass").value;
  const score = document.getElementById("editAttScore").value;
  const attention = document.getElementById("editAttAttention").value;
  const comment = document.getElementById("editAttComment").value;

  const initials = name.substring(0, 2).toUpperCase();
  const cells = currentEditingRow.cells;

  cells[0].innerHTML = `<strong>${roll}</strong>`;
  cells[1].innerHTML = `
    <div class="student-avatar-cell">
      <div class="stu-img-avatar">${initials}</div>
      <span>${name}</span>
    </div>
  `;
  cells[2].innerText = clsSec;

  const scoreCellIndex = cells.length - 4;
  cells[scoreCellIndex].innerHTML = `<span class="score-badge ${score == 0 ? 'zero' : ''}">${score} / ১০</span>`;

  const attMap = {
    high: '<span class="att-level high">উচ্চ ⭐</span>',
    medium: '<span class="att-level medium">মাঝারি</span>',
    low: '<span class="att-level low">কম ⚠️</span>'
  };
  const attCellIndex = cells.length - 3;
  cells[attCellIndex].innerHTML = attMap[attention] || attMap.high;

  const commentCellIndex = cells.length - 2;
  cells[commentCellIndex].innerText = comment || "কোনো মন্তব্য নেই";

  closeEditAttendanceModal();
  showToast(`শিক্ষার্থী ${name}-এর তথ্যাবলী সংসংরক্ষিত করা হয়েছে!`);
}

function deleteAttendanceRow(btn) {
  const tr = btn.closest("tr");
  const name = tr.cells[1].innerText.trim();
  if (confirm(`আপনি কি শিক্ষার্থী ${name}-এর সম্পূর্ণ উপস্থিতি রো মুছে ফেলতে চান?`)) {
    tr.remove();
    showToast(`শিক্ষার্থী ${name} রো তালিকা থেকে মুছে ফেলা হয়েছে।`);
  }
}

function openAddStudentModal() {
  document.getElementById("addStudentModal").classList.remove("hidden");
}

function closeAddStudentModal() {
  document.getElementById("addStudentModal").classList.add("hidden");
}

function saveNewStudentRow(event) {
  event.preventDefault();
  const roll = document.getElementById("newStuRoll").value.trim();
  const name = document.getElementById("newStuName").value.trim();
  const clsSec = document.getElementById("newStuClass").value.trim();

  if (!roll || !name) return;

  const initials = name.substring(0, 2).toUpperCase();
  const table = document.getElementById("attendanceTable");
  const headerThs = table.querySelectorAll("thead tr th");
  const totalCols = headerThs.length;

  const tr = document.createElement("tr");
  let html = `
    <td><strong>${roll}</strong></td>
    <td>
      <div class="student-avatar-cell">
        <div class="stu-img-avatar bg-purple">${initials}</div>
        <span>${name}</span>
      </div>
    </td>
    <td>${clsSec || 'নবম (ক)'}</td>
  `;

  // Count active subject columns between col-3 and (totalCols - 5)
  const subjectColsCount = totalCols - 8;
  for (let i = 0; i < Math.max(4, subjectColsCount); i++) {
    html += `<td class="text-center"><span class="sub-chip present animated-pop" onclick="toggleSubChip(this)"><i class="fa-solid fa-check"></i> উপস্থিত</span></td>`;
  }

  html += `
    <td><span class="status-pill present"><i class="fa-solid fa-circle-check"></i> ১০০%</span></td>
    <td><span class="score-badge">১০ / ১০</span></td>
    <td><span class="att-level high">⭐⭐⭐⭐⭐ (৫ স্টার)</span></td>
    <td>নতুন অন্তর্ভূক্ত শিক্ষার্থী</td>
    <td class="no-print">
      <div class="action-btn-group">
        <button class="btn-icon btn-sm" onclick="openEditAttendanceModal(this)" title="সম্পাদনা করুন"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn-icon btn-sm text-danger" onclick="deleteAttendanceRow(this)" title="মুছে ফেলুন"><i class="fa-solid fa-trash"></i></button>
      </div>
    </td>
  `;

  tr.innerHTML = html;
  table.querySelector("tbody").appendChild(tr);

  closeAddStudentModal();
  document.getElementById("newStuRoll").value = "";
  document.getElementById("newStuName").value = "";

  recalculateStudentRow(tr);
  triggerConfetti();
  showToast(`নতুন শিক্ষার্থী: ${name} (রোল ${roll}) সফলভাবে যোগ করা হয়েছে! 🎉`);
}

// ১২. পরীক্ষার রুটিন অ্যাকশন
function openAddExamModal() {
  const subject = prompt("পরীক্ষার বিষয়ের নাম লিখুন:");
  if (subject) {
    const date = prompt("পরীক্ষার তারিখ (e.g. ২২ মে ২০২৬):");
    const tbody = document.querySelector("#examTable tbody");
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${date || '২৪ মে ২০২৬'}</strong></td>
      <td><span class="badge-exam weekly">সাপ্তাহিক</span></td>
      <td>${subject}</td>
      <td>নবম (ক)</td>
      <td>সকাল ১০:০০ - ১১:৩০</td>
      <td>রুম ৩০৫</td>
      <td>মাগুরিব আলী</td>
      <td>৫০</td>
      <td class="no-print">
        <button class="btn-icon btn-sm" onclick="editExamRow(this)"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-icon btn-sm text-danger" onclick="deleteExamRow(this)"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
    showToast(`পরীক্ষা ${subject} যোগ করা হয়েছে!`);
  }
}

function editExamRow(btn) {
  alert("পরীক্ষার তথ্য সম্পাদনা করুন");
}

function deleteExamRow(btn) {
  if (confirm("আপনি কি এই পরীক্ষার সময়সূচি মুছে ফেলতে চান?")) {
    btn.closest("tr").remove();
    showToast("পরীক্ষা মুছে ফেলা হয়েছে");
  }
}

// ১৩. লাইভ ক্লাস অ্যাকশন
function startClassLive(classId) {
  showSection("liveclass");
  triggerConfetti();
  showToast(`স্মার্ট লাইভ ক্লাস সেশন (${classId}) শুরু হয়েছে!`);
}

function allowStudentAnswer(name) {
  alert(`${name}-কে উত্তর দেওয়ার জন্য মাইক অনুমতি প্রদান করা হলো।`);
}

// ১৪. ইতিহাস ফিল্টার
function filterHistoryGrid() {
  const val = document.getElementById("histSearch").value.toLowerCase();
  const cards = document.querySelectorAll("#historyGridContainer .history-card");

  cards.forEach((card) => {
    const text = card.innerText.toLowerCase();
    if (text.includes(val)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// ১৫. প্রোগ্রেস সেকশন ট্যাব
function switchProgressTab(tab, btn) {
  document.querySelectorAll("#section-progress .term-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  showToast(`প্রোগ্রেস অ্যানালিটিক্স: ${tab.toUpperCase()} ভিউ`);
}

// ১৬. PDF Export Simulation
function exportPDF(filename) {
  alert(`${filename}_Report.pdf ফাইল ডাউনলোড করা হচ্ছে...`);
  window.print();
}

// Toast Notification Helper
function showToast(message) {
  let toast = document.getElementById("custom-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "custom-toast";
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0067b7;
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 13.5px;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      z-index: 99999;
      transition: all 0.3s ease;
    `;
    document.body.appendChild(toast);
  }

  toast.innerText = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, 3000);
}

// Initial recalculation on load
window.addEventListener('DOMContentLoaded', () => {
  recalculateAllRows();
});
