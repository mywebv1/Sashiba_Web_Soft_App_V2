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
      "প্রাথমিক বিজ্ঞান",
      "ধর্ম ও নৈতিক শিক্ষা",
    ],
    চতুর্থ: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "প্রাথমিক বিজ্ঞান",
      "ধর্ম ও নৈতিক শিক্ষা",
    ],
    পঞ্চম: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "প্রাথমিক বিজ্ঞান",
      "ধর্ম ও নৈতিক শিক্ষা",
    ],
    ষষ্ঠ: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "বিজ্ঞান",
      "ধর্ম ও নৈতিক শিক্ষা",
      "তথ্য ও যোগাযোগ প্রযুক্তি",
      "কৃষি শিক্ষা/গার্হস্থ্য বিজ্ঞান",
    ],
    সপ্তম: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "বিজ্ঞান",
      "ধর্ম ও নৈতিক শিক্ষা",
      "তথ্য ও যোগাযোগ প্রযুক্তি",
      "কৃষি শিক্ষা/গার্হস্থ্য বিজ্ঞান",
    ],
    অষ্টম: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "বিজ্ঞান",
      "ধর্ম ও নৈতিক শিক্ষা",
      "তথ্য ও যোগাযোগ প্রযুক্তি",
      "কৃষি শিক্ষা/গার্হস্থ্য বিজ্ঞান",
    ],
    General: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "ধর্ম ও নৈতিক শিক্ষা",
      "ICT",
    ],
    Science: ["পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "উচ্চতর গণিত"],
    Arts: [
      "ভূগোল ও পরিবেশ",
      "পৌরনীতি ও নাগরিকতা",
      "অর্থনীতি",
      "ইতিহাস",
      "কৃষি শিক্ষা",
    ],
    Commerce: ["হিসাববিজ্ঞান", "ব্যবসায় উদ্যোগ", "ফিন্যান্স ও ব্যাংকিং"],
  },
  methods: [
    "আলোচনা",
    "প্রদর্শন",
    "দলীয় কাজ",
    "প্রশ্নোত্তর",
    "বক্তৃতা",
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

function loadSubjects() {
  const cls = document.getElementById("class").value;
  const group = document.getElementById("group").value;
  const subSel = document.getElementById("subject");
  const groupDiv = document.getElementById("group-div");

  groupDiv.style.display =
    cls === "নবম" || cls === "দশম" || cls === "একাদশ" || cls === "দ্বাদশ"
      ? "block"
      : "none";

  subSel.innerHTML = '<option value="">বিষয় নির্বাচন</option>';
  let list = db.subjects[cls] || [];
  if (groupDiv.style.display === "block") {
    list = db.subjects["General"].concat(db.subjects[group] || []);
  }
  list.forEach(
    (s) => (subSel.innerHTML += `<option value="${s}">${s}</option>`),
  );
  updatePreview();
}

function loadChapters() {
  const sub = document.getElementById("subject").value;
  document.getElementById("bookName").value = sub ? sub + " (NCTB)" : "";
  document.getElementById("chapter-list").innerHTML =
    `<label><input type="checkbox" class="chap" value="অধ্যায় ১" onchange="loadTopics()"> অধ্যায় ১: পরিচিতি</label><br><label><input type="checkbox" class="chap" value="অধ্যায় ২" onchange="loadTopics()"> অধ্যায় ২: মূল বিষয়</label>`;
  updatePreview();
}

function loadTopics() {
  document.getElementById("topic-list").innerHTML =
    `<label><input type="checkbox" class="topic" value="টপিক ১" onchange="updatePreview()"> টপিক ১: মূল আলোচনা</label><br><label><input type="checkbox" class="topic" value="টপিক ২" onchange="updatePreview()"> টপিক ২: বিশ্লেষণ</label>`;
}

function generateAI() {
  // ১. গ্রুপিং ৫ জন করে
  const good = document
    .getElementById("roll-good")
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
  const totalRolls = [...good, ...avg, ...low];

  let groupsHTML = "";
  if (totalRolls.length > 0) {
    groupsHTML =
      "<h4>👥 গ্রুপিং (প্রতি দলে ৫ জন):</h4><div class='group-grid-container'>";
    for (let i = 0; i < totalRolls.length; i += 5) {
      const groupMembers = totalRolls.slice(i, i + 5);
      groupsHTML += `<div class='group-item'><strong>দল ${Math.floor(i / 5) + 1}:</strong> ${groupMembers.join(", ")}</div>`;
    }
    groupsHTML += "</div>";
  }
  document.getElementById("v-group-area").innerHTML = groupsHTML;

  // ২. AI Outcomes (৩-৫টি)
  document.getElementById("v-outcomes").innerHTML =
    `<ul><li>পাঠ শেষে শিক্ষার্থীরা বিষয়টি স্পষ্টভাবে ব্যাখ্যা করতে পারবে।</li><li>বাস্তব জীবনের উদাহরণের মাধ্যমে প্রয়োগ দেখাতে পারবে।</li><li>সংশ্লিষ্ট বিষয়ের ওপর সৃজনশীল প্রশ্নের সমাধান করতে পারবে।</li></ul>`;

  // ৩. AI Bloom's Analysis
  document.getElementById("v-bloom").innerText =
    "অনুপ্রেরণা: আজকের পাঠ শিক্ষার্থীদের মাঝে কৌতূহল এবং সৃজনশীল চিন্তা জাগ্রত করবে, যা ভবিষ্যতে তাদের আত্মবিশ্বাসী করে তুলবে।";

  // ৪. AI Homework
  document.getElementById("v-homework-box").style.display = "block";
  document.getElementById("v-homework").innerText =
    "আজকের আলোচনার ওপর ভিত্তি করে একটি সংক্ষিপ্ত পোস্টার বা নোট তৈরি করে আনবে।";

  // ৫. Table Timeline
  const dur = document.getElementById("duration").value || 45;
  document.getElementById("v-table").innerHTML = `
        <tr><td>${Math.floor(dur * 0.2)} মি.</td><td>শুভেচ্ছা বিনিময় ও ভূমিকা</td><td>মনোযোগ প্রদান</td></tr>
        <tr><td>${Math.floor(dur * 0.6)} মি.</td><td>বিস্তারিত আলোচনা ও গ্রুপিং কাজ</td><td>সক্রিয় অংশগ্রহণ</td></tr>
        <tr><td>${Math.floor(dur * 0.2)} মি.</td><td>সারসংক্ষেপ ও মূল্যায়ন</td><td>বাড়ির কাজ বুঝে নেওয়া</td></tr>`;

  document.getElementById("v-date").innerText = new Date().toLocaleDateString(
    "bn-BD",
  );
  alert("লেসন প্ল্যান জেনারেট হয়েছে!");
}

function updatePreview() {
  document.getElementById("v-schName").innerText =
    document.getElementById("schName").value || "প্রতিষ্ঠানের নাম";
  document.getElementById("v-schAddr").innerText =
    document.getElementById("schAddr").value || "ঠিকানা";
  document.getElementById("v-schExtra").innerText =
    `কোড: ${document.getElementById("schCode").value || "-"} | প্রতিষ্ঠা: ${document.getElementById("schYear").value || "-"}`;
  document.getElementById("v-class").innerText =
    document.getElementById("class").value || "-";
  document.getElementById("v-sub").innerText =
    document.getElementById("subject").value || "-";
  document.getElementById("v-time").innerText =
    document.getElementById("duration").value + " মিনিট";

  const topics = Array.from(document.querySelectorAll(".topic:checked")).map(
    (t) => t.value,
  );
  document.getElementById("v-title").innerText = topics.join(", ") || "-";
}
