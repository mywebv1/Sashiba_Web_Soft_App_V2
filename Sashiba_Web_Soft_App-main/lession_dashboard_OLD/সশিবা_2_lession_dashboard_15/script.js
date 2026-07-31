const db = {
  classes: [
    "প্রথম",
    "দ্বিতীয়",
    "তৃতীয়",
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
    তৃতীয়: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "প্রাথমিক বিজ্ঞান",
      "ধর্ম",
    ],
    ষষ্ঠ: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বিজ্ঞান",
      "তথ্য ও যোগাযোগ প্রযুক্তি",
      "কৃষি/গার্হস্থ্য",
      "ধর্ম",
    ],
    Science: ["পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "উচ্চতর গণিত"],
    Arts: ["ভূগোল", "অর্থনীতি", "ইতিহাস", "যুক্তিবিদ্যা"],
    Commerce: ["হিসাববিজ্ঞান", "ব্যবসায় উদ্যোগ", "ফিন্যান্স"],
    Compulsory: ["বাংলা", "ইংরেজি", "গণিত", "ICT", "বাংলাদেশ ও বিশ্বপরিচয়"],
  },
  methods: [
    "আলোচনা",
    "প্রদর্শন",
    "দলীয় কাজ",
    "প্রশ্নোত্তর",
    "জোড়ায় কাজ",
    "অনুশীলন",
    "কুইজ টেস্ট",
    "বুদ্ধি যাচাই",
  ],
  blooms: ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"],
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
  const bList = document.getElementById("bloom-options");
  db.blooms.forEach(
    (b) =>
      (bList.innerHTML += `<label><input type="checkbox" class="bloom-check" value="${b}"> ${b}</label>`),
  );
};

function handleClassChange() {
  const cls = document.getElementById("class").value;
  const groupDiv = document.getElementById("group-wrapper");
  if (["নবম", "দশম", "একাদশ", "দ্বাদশ"].includes(cls)) {
    groupDiv.style.display = "block";
    const group = document.getElementById("group").value;
    let list = [...db.subjects["Compulsory"]];
    if (group !== "General") list = list.concat(db.subjects[group] || []);
    populateSubjects(list);
  } else {
    groupDiv.style.display = "none";
    populateSubjects(db.subjects[cls] || db.subjects["ষষ্ঠ"]);
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
  document.getElementById("chapter-list").innerHTML = `
    <label><input type="checkbox" class="chap" value="অধ্যায় ১" onchange="loadTopics()"> অধ্যায় ১: প্রাথমিক ধারণা</label><br>
    <label><input type="checkbox" class="chap" value="অধ্যায় ২" onchange="loadTopics()"> অধ্যায় ২: গাণিতিক সমস্যা</label>
    <label><input type="checkbox" class="chap" value="অধ্যায় ১" onchange="loadTopics()"> অধ্যায় ১: গণনা</label><br>
    <label><input type="checkbox" class="chap" value="অধ্যায় ১" onchange="loadTopics()"> অধ্যায় ১: অংক ও সংখ্যা</label><br>`;
  updatePreview();
}

function loadTopics() {
  document.getElementById("topic-list").innerHTML = `
    <label><input type="checkbox" class="topic" value="টপিক ১" onchange="updatePreview()"> টপিক ১: সূত্র ও ব্যাখ্যা</label><br>
    <label><input type="checkbox" class="topic" value="টপিক ২" onchange="updatePreview()"> টপিক ২: বাস্তব উদাহরণ</label>`;
}

function generateAI() {
  const vGood = document
    .getElementById("roll-vgood")
    .value.split(",")
    .filter((x) => x.trim());
  const avg = document
    .getElementById("roll-avg")
    .value.split(",")
    .filter((x) => x.trim());
  const low = document
    .getElementById("roll-low")
    .value.split(",")
    .filter((x) => x.trim());

  if (vGood.length === 0 && avg.length === 0 && low.length === 0)
    return alert("রোল নম্বর ইনপুট দিন");

  let allStudents = [];
  vGood.forEach((r) => allStudents.push({ r, type: "ভ" }));
  avg.forEach((r) => allStudents.push({ r, type: "ম" }));
  low.forEach((r) => allStudents.push({ r, type: "ন" }));

  let groupCount = Math.ceil(allStudents.length / 5);
  let groups = Array.from({ length: groupCount }, () => []);

  allStudents.forEach((student, index) => {
    groups[index % groupCount].push(`${student.r} (${student.type})`);
  });

  let gHtml =
    "<h4>👥 শিক্ষার্থী গ্রুপিং (সংমিশ্রণ):</h4><div class='group-grid'>";
  groups.forEach(
    (g, i) =>
      (gHtml += `<div class='group-card'><strong>দল ${i + 1}:</strong> ${g.join(", ")}</div>`),
  );
  document.getElementById("v-group-section").innerHTML = gHtml + "</div>";

  const obj = document.getElementById("lessonObjective").value;
  document.getElementById("v-outcomes").innerHTML = obj
    ? `<li>শিক্ষার্থীরা ${obj} সম্পর্কে বিস্তারিত জানতে পারবে।</li><li>পাঠের মূল পয়েন্টগুলো ব্যাখ্যা করতে সক্ষম হবে।</li><li>বাস্তব জীবনের ক্ষেত্রে এর প্রয়োগ শিখবে।</li>`
    : `<li>শিখনফল জেনারেট করার জন্য উদ্দেশ্য লিখুন...</li>`;

  const selectedBlooms = Array.from(
    document.querySelectorAll(".bloom-check:checked"),
  ).map((cb) => cb.value);
  const badgeRow = document.getElementById("v-bloom-badges");
  badgeRow.innerHTML = "";
  selectedBlooms.forEach(
    (b) => (badgeRow.innerHTML += `<span class="bloom-badge">${b}</span>`),
  );
  document.getElementById("v-bloom-desc").innerText =
    "বিশ্লেষণ: শিক্ষার্থীরা এই পাঠের মাধ্যমে তাত্ত্বিক বিষয়ের গাণিতিক প্রয়োগ শিখবে।";

  const dur = document.getElementById("duration").value || 45;
  document.getElementById("v-table").innerHTML = `
    <tr><td>${Math.floor(dur * 0.2)} মি.</td><td>শুভেচ্ছা বিনিময় ও পাঠ ঘোষণা</td><td>মনোযোগ প্রদান</td></tr>
    <tr><td>${Math.floor(dur * 0.6)} মি.</td><td>মূল আলোচনা ও দলীয় কার্যক্রম</td><td>সক্রিয় অংশগ্রহণ</td></tr>
    <tr><td>${Math.floor(dur * 0.2)} মি.</td><td>সারসংক্ষেপ ও মূল্যায়ন</td><td>বাড়ির কাজ নেওয়া</td></tr>`;

  document.getElementById("v-homework").innerText =
    "আজকের আলোচনার ওপর ভিত্তি করে ৫টি প্রশ্ন উত্তরসহ লিখে আনবে।";
  alert("সফলভাবে জেনারেট হয়েছে!");
}

function updatePreview() {
  document.getElementById("v-schName").innerText =
    document.getElementById("schName").value || "প্রতিষ্ঠানের নাম";
  document.getElementById("v-schAddr").innerText =
    document.getElementById("schAddr").value || "ঠিকানা";
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
