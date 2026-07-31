const db = {
  classes: [
    "প্রথম",
    "দ্বিতীয়",
    "তৃতীয়",
    "চতুর্থ",
    "পঞ্চম",
    "ষষ্ঠ",
    "সপ্তম",
    "অষ্টম",
    "নবম",
    "দশম",
    "একাদশ",
    "দ্বাদশ",
  ],
  subjects: {
    প্রথম: ["বাংলা", "গণিত", "ইংরেজি"],
    দ্বিতীয়: ["বাংলা", "গণিত", "ইংরেজি", "পরিবেশ পরিচিতি"],
    তৃতীয়: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "বিজ্ঞান",
      "ধর্ম",
    ],
    ষষ্ঠ: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বিজ্ঞান",
      "তথ্য ও যোগাযোগ প্রযুক্তি",
      "কৃষি/গার্হস্থ্য",
    ],
    Science: [
      "পদার্থবিজ্ঞান",
      "রসায়ন",
      "জীববিজ্ঞান",
      "উচ্চতর গণিত",
      "কম্পিউটার বিজ্ঞান",
    ],
    Arts: ["ভূগোল", "অর্থনীতি", "ইতিহাস", "যুক্তিবিদ্যা", "পৌরনীতি"],
    Commerce: ["হিসাববিজ্ঞান", "ব্যবসায় উদ্যোগ", "ফিন্যান্স"],
    Compulsory: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "ICT",
      "ধর্ম",
    ],
  },
  methods: [
    "আলোচনা",
    "প্রদর্শন",
    "দলীয় কাজ",
    "প্রশ্নোত্তর",
    "ভিডিও প্রদর্শন",
    "জোড়ায় কাজ",
    "অনুশীলন",
    "ফিল্ড ট্রিপ",
    "মডেল তৈরি",
  ],
};

window.onload = () => {
  const clsSel = document.getElementById("class");
  db.classes.forEach(
    (c) => (clsSel.innerHTML += `<option value="${c}">${c} শ্রেণি</option>`),
  );
  const mList = document.getElementById("methods-list");
  db.methods.forEach(
    (m) =>
      (mList.innerHTML += `<label><input type="checkbox" class="meth-check" value="${m}" onchange="updatePreview()"> ${m}</label>`),
  );
};

// শ্রেণি পরিবর্তনের পর বিষয় ও গ্রুপ নিয়ন্ত্রণ
function handleClassChange() {
  const cls = document.getElementById("class").value;
  const groupDiv = document.getElementById("group-wrapper");
  const subSel = document.getElementById("subject");

  // ৯-১২ শ্রেণির জন্য গ্রুপ দেখাবে
  if (["নবম", "দশম", "একাদশ", "দ্বাদশ"].includes(cls)) {
    groupDiv.style.display = "block";
    const group = document.getElementById("group").value;
    let list = [...db.subjects["Compulsory"]];
    if (group !== "General") list = list.concat(db.subjects[group] || []);
    populateSubjects(list);
  } else {
    groupDiv.style.display = "none";
    populateSubjects(db.subjects[cls] || db.subjects["প্রথম"]);
  }
  updatePreview();
}

function populateSubjects(list) {
  const subSel = document.getElementById("subject");
  subSel.innerHTML = '<option value="">বিষয় নির্বাচন</option>';
  list.forEach(
    (s) => (subSel.innerHTML += `<option value="${s}">${s}</option>`),
  );
}

function loadChapters() {
  const sub = document.getElementById("subject").value;
  document.getElementById("bookName").value = sub ? sub + " (NCTB)" : "";
  document.getElementById("chapter-list").innerHTML =
    `<label><input type="checkbox" class="chap" value="অধ্যায় ১" onchange="loadTopics()"> অধ্যায় ১: পরিচিতি</label><br><label><input type="checkbox" class="chap" value="অধ্যায় ২" onchange="loadTopics()"> অধ্যায় ২: বিস্তারিত</label>`;
  updatePreview();
}

function loadTopics() {
  document.getElementById("topic-list").innerHTML =
    `<label><input type="checkbox" class="topic" value="টপিক ১" onchange="updatePreview()"> টপিক ১: মূল আলোচনা</label><br><label><input type="checkbox" class="topic" value="টপিক ২" onchange="updatePreview()"> টপিক ২: গাণিতিক বিশ্লেষণ</label>`;
}

// সংমিশ্রণ গ্রুপিং লজিক (AI Mixed Grouping)
function generateAI() {
  const vGood = document
    .getElementById("roll-vgood")
    .value.split(",")
    .filter((r) => r.trim());
  const avg = document
    .getElementById("roll-avg")
    .value.split(",")
    .filter((r) => r.trim());
  const low = document
    .getElementById("roll-low")
    .value.split(",")
    .filter((r) => r.trim());

  let total = vGood.length + avg.length + low.length;
  if (total === 0) return alert("রোল নম্বর ইনপুট দিন");

  let groupCount = Math.ceil(total / 5);
  let groups = Array.from({ length: groupCount }, () => []);

  // সংমিশ্রণ বিতরণ (Round Robin)
  let combined = [
    ...vGood.map((r) => r + " (ভ)"),
    ...avg.map((r) => r + " (ম)"),
    ...low.map((r) => r + " (ন)"),
  ];

  combined.forEach((roll, index) => {
    groups[index % groupCount].push(roll);
  });

  let groupsHTML =
    "<h4>👥 শিক্ষার্থী গ্রুপিং (সংমিশ্রণ):</h4><div class='group-grid'>";
  groups.forEach((g, i) => {
    groupsHTML += `<div class='group-card'><strong>দল ${i + 1}:</strong> ${g.join(", ")}</div>`;
  });
  groupsHTML += "</div>";
  document.getElementById("v-group-section").innerHTML = groupsHTML;

  // AI Contents
  document.getElementById("v-outcomes").innerHTML =
    `<li>শিক্ষার্থীরা বিষয়ের মূল ধারণা স্পষ্টভাবে বর্ণনা করতে পারবে।</li><li>বাস্তব জীবনের উদাহরণের মাধ্যমে প্রয়োগ দেখাতে সক্ষম হবে।</li><li>সংশ্লিষ্ট বিষয়ের সৃজনশীল প্রশ্নের সমাধান করতে পারবে।</li>`;

  const selectedBlooms = Array.from(
    document.querySelectorAll(".bloom-check:checked"),
  ).map((cb) => cb.value);
  const badgeRow = document.getElementById("v-bloom-badges");
  badgeRow.innerHTML = "";
  selectedBlooms.forEach(
    (b) => (badgeRow.innerHTML += `<span class="bloom-badge">${b}</span>`),
  );
  document.getElementById("v-bloom-desc").innerText =
    "বিশ্লেষণ: শিক্ষার্থীরা এই পাঠের মাধ্যমে তাত্ত্বিক এবং ব্যবহারিক জ্ঞানের সংমিশ্রণ ঘটাতে পারবে।";
  document.getElementById("v-homework").innerText =
    "আজকের আলোচনার ওপর ভিত্তি করে ১০টি সংক্ষিপ্ত প্রশ্ন ও উত্তর লিখে আনবে।";

  const dur = document.getElementById("duration").value || 45;
  document.getElementById("v-table").innerHTML =
    `<tr><td>${Math.floor(dur * 0.2)} মি.</td><td>শুভেচ্ছা বিনিময় ও ভূমিকা</td><td>মনোযোগ প্রদান</td></tr><tr><td>${Math.floor(dur * 0.6)} মি.</td><td>বিস্তারিত আলোচনা ও দলীয় কাজ</td><td>সক্রিয় অংশগ্রহণ</td></tr><tr><td>${Math.floor(dur * 0.2)} মি.</td><td>সারসংক্ষেপ ও মূল্যায়ন</td><td>বাড়ির কাজ বুঝে নেওয়া</td></tr>`;

  document.getElementById("v-date").innerText = new Date().toLocaleString(
    "bn-BD",
  );

  saveLessonPlan(); // অটো সেভ লজিক
  alert("লেসন প্ল্যান সফলভাবে জেনারেট ও সেভ হয়েছে!");
}

function updatePreview() {
  document.getElementById("v-schName").innerText =
    document.getElementById("schName").value || "শিক্ষা প্রতিষ্ঠানের নাম";
  document.getElementById("v-schAddr").innerText =
    document.getElementById("schAddr").value || "মদিনা নগর, রাজশাহী";
  document.getElementById("v-schCode").innerText =
    document.getElementById("schCode").value || "-";
  document.getElementById("v-schYear").innerText =
    document.getElementById("schYear").value || "-";
  document.getElementById("v-class").innerText =
    document.getElementById("class").value || "-";
  document.getElementById("v-sub").innerText =
    document.getElementById("subject").value || "-";
  document.getElementById("v-time").innerText =
    (document.getElementById("duration").value || 45) + " মিনিট";
  const topics = Array.from(document.querySelectorAll(".topic:checked")).map(
    (t) => t.value,
  );
  document.getElementById("v-title").innerText = topics.join(", ") || "-";
}

// LocalStorage এ সেভ করা (লাইব্রেরি লজিক)
function saveLessonPlan() {
  let plans = JSON.parse(localStorage.getItem("ai_lessons") || "[]");
  let newPlan = {
    id: Date.now(),
    school: document.getElementById("schName").value,
    subject: document.getElementById("subject").value,
    class: document.getElementById("class").value,
    date: new Date().toLocaleDateString("bn-BD"),
    time: new Date().toLocaleTimeString("bn-BD"),
  };
  plans.push(newPlan);
  localStorage.setItem("ai_lessons", JSON.stringify(plans));
}

function showLibrary() {
  showSection("library");
  let plans = JSON.parse(localStorage.getItem("ai_lessons") || "[]");
  let grid = document.getElementById("libraryGrid");
  grid.innerHTML = plans.length ? "" : "<p>কোন লেসন প্ল্যান সেভ করা নেই।</p>";
  plans.reverse().forEach((p) => {
    grid.innerHTML += `<div class="lib-card">
            <strong>${p.subject}</strong><br><small>${p.school}</small><br>
            <span style="font-size:11px">${p.class} | ${p.date}</span><br>
            <button onclick="location.reload()" style="margin-top:10px; cursor:pointer">লোড করুন</button>
        </div>`;
  });
}

function showSection(id) {
  document.getElementById("mainBuilder").style.display =
    id === "builder" ? "flex" : "none";
  document.getElementById("librarySection").style.display =
    id === "library" ? "block" : "none";
}
