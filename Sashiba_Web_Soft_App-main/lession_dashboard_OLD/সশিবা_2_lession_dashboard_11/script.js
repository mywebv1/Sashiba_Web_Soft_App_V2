const db = {
  classes: [
    "১ম",
    "২য়",
    "৩য়",
    "৪র্থ",
    "৫ম",
    "৬ষ্ঠ",
    "৭ম",
    "৮ম",
    "৯ম",
    "১০ম",
    "১১শ",
    "১২শ",
  ],
  subjects: {
    "১ম": ["আমার বই", "English for Today"],
    "২য়": ["আমার বই", "English for Today"],
    "৩য়": ["বাংলা", "English", "গণিত", "প্রাথমিক বিজ্ঞান", "বিজিএস"],
    "৪র্থ": ["বাংলা", "English", "গণিত", "প্রাথমিক বিজ্ঞান", "বিজিএস"],
    "৫ম": ["বাংলা", "English", "গণিত", "প্রাথমিক বিজ্ঞান", "বিজিএস"],
    "৬ষ্ঠ": [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বিজ্ঞান",
      "ইতিহাস ও সামাজিক বিজ্ঞান",
      "ডিজিটাল প্রযুক্তি",
    ],
    "৭ম": [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বিজ্ঞান",
      "ইতিহাস ও সামাজিক বিজ্ঞান",
      "ডিজিটাল প্রযুক্তি",
    ],
    "৮ম": [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বিজ্ঞান",
      "ইতিহাস ও সামাজিক বিজ্ঞান",
      "ডিজিটাল প্রযুক্তি",
    ],
    "৯ম": ["বাংলা", "ইংরেজি", "গণিত", "উচ্চতর গণিত", "বিজ্ঞান", "ইতিহাস"],
    "১০ম": ["বাংলা", "গণিত", "বিজ্ঞান", "পদার্থবিজ্ঞান"],
    "১১শ": ["বাংলা", "ইংরেজি", "আইসিটি", "পদার্থবিজ্ঞান", "রসায়ন"],
    "১২শ": ["বাংলা", "ইংরেজি", "আইসিটি", "পদার্থবিজ্ঞান", "রসায়ন"],
  },
  chapters: {
    "উচ্চতর গণিত": ["অধ্যায় ৫: সমীকরণ"],
    বিজ্ঞান: ["অধ্যায় ৯: আলোর প্রতিসরণ"],
    পদার্থবিজ্ঞান: ["অধ্যায় ১: ভৌত রাশি ও পরিমাপ"],
    বাংলা: ["কবিতা: কাজলা দিদি"],
  },
  topics: {
    "অধ্যায় ৫: সমীকরণ": ["দ্বিঘাত সমীকরণ"],
    "অধ্যায় ৯: আলোর প্রতিসরণ": ["আলোর প্রতিসরণ"],
    "কবিতা: কাজলা দিদি": ["কাজলা দিদি"],
  },
  aiLogic: {
    "দ্বিঘাত সমীকরণ": {
      obj: "• শিক্ষার্থীদের দ্বিঘাত সমীকরণের ধারণা প্রদান করা।\n• দ্বিঘাত সমীকরণের বিভিন্ন সমাধান পদ্ধতি পরিচয় করিয়ে দেওয়া।\n• বাস্তব জীবনের সমস্যায় দ্বিঘাত সমীকরণের ব্যবহার ব্যাখ্যা করা।\n• সমস্যা সমাধানে শিক্ষার্থীদের যুক্তিভিত্তিক চিন্তায় উৎসাহিত করা।",
      out: [
        "দ্বিঘাত সমীকরণ সনাক্ত করতে পারবে।",
        "দ্বিঘাত সমীকরণের মূল নির্ণয় করতে পারবে।",
        "বাস্তব সমস্যাকে দ্বিঘাত সমীকরণে রূপান্তর করতে পারবে।",
        "সমাধানের যথার্থতা যাচাই করতে পারবে।",
      ],
    },
    "আলোর প্রতিসরণ": {
      obj: "• আলোর প্রতিসরণের ধারণা ব্যাখ্যা করা।\n• প্রতিসরণের কারণ আলোচনা করা।\n• প্রতিসরণের বাস্তব উদাহরণ উপস্থাপন করা।\n• প্রতিসরণের প্রয়োগ সম্পর্কে ধারণা দেওয়া।",
      out: [
        "আলোর প্রতিসরণ সংজ্ঞায়িত করতে পারবে।",
        "প্রতিসরণের কারণ ব্যাখ্যা করতে পারবে।",
        "প্রতিসরণের চিত্র অঙ্কন করতে পারবে।",
        "দৈনন্দিন জীবনে প্রতিসরণের উদাহরণ শনাক্ত করতে পারবে।",
      ],
    },
    "কাজলা দিদি": {
      obj: "• কবিতার মূলভাব পরিচয় করিয়ে দেওয়া।\n• কবিতার ভাষা ও শব্দচয়ন ব্যাখ্যা করা।\n• কবিতার মানবিক মূল্যবোধ তুলে ধরা।\n• আবৃত্তির প্রতি শিক্ষার্থীদের আগ্রহ সৃষ্টি করা।",
      out: [
        "কবিতার মূলভাব ব্যাখ্যা করতে পারবে।",
        "নতুন শব্দের অর্থ বলতে পারবে।",
        "কবিতাটি শুদ্ধ উচ্চারণে আবৃত্তি করতে পারবে।",
        "কবিতার বার্তা নিজের ভাষায় প্রকাশ করতে পারবে।",
      ],
    },
  },
};

window.onload = () => {
  const clsSel = document.getElementById("class");
  db.classes.forEach(
    (c) => (clsSel.innerHTML += `<option value="${c}">${c} শ্রেণি</option>`),
  );
};

function loadSubjects() {
  const cls = document.getElementById("class").value;
  const subSel = document.getElementById("subject");
  subSel.innerHTML = '<option value="">বিষয় নির্বাচন</option>';
  if (db.subjects[cls]) {
    db.subjects[cls].forEach(
      (s) => (subSel.innerHTML += `<option value="${s}">${s}</option>`),
    );
  }
  updatePreview();
}

function loadChapters() {
  const sub = document.getElementById("subject").value;
  const bookSel = document.getElementById("bookName");
  bookSel.innerHTML = `<option value="${sub}">${sub} (NCTB)</option>`;

  const chapList = document.getElementById("chapter-list");
  const chapters = db.chapters[sub] || ["অধ্যায় ১", "অধ্যায় ২", "অধ্যায় ৩"];
  chapList.innerHTML = chapters
    .map(
      (c) =>
        `<label class="check-item"><input type="checkbox" class="chap-check" value="${c}" onchange="loadTopics()"> ${c}</label>`,
    )
    .join("");
  updatePreview();
}

function loadTopics() {
  const chaps = Array.from(
    document.querySelectorAll(".chap-check:checked"),
  ).map((cb) => cb.value);
  const topicList = document.getElementById("topic-list");
  topicList.innerHTML = "";
  chaps.forEach((ch) => {
    const ts = db.topics[ch] || [
      `${ch} এর আলোচ্য বিষয় ১`,
      `${ch} এর আলোচ্য বিষয় ২`,
    ];
    ts.forEach((t) => {
      topicList.innerHTML += `<label class="check-item"><input type="checkbox" class="topic-check" value="${t}" onchange="triggerAI()"> ${t}</label>`;
    });
  });
}

function triggerAI() {
  const selected = Array.from(
    document.querySelectorAll(".topic-check:checked"),
  ).map((cb) => cb.value);
  const objField = document.getElementById("lessonObjective");
  const aiList = document.getElementById("ai-outcomes-list");
  const viewOut = document.getElementById("view-outcomes");

  objField.value = "";
  aiList.innerHTML = "";
  viewOut.innerHTML = "";

  selected.forEach((topic) => {
    const data = db.aiLogic[topic] || {
      obj: `• ${topic} সম্পর্কে ধারণা প্রদান।`,
      out: [`${topic} ব্যাখ্যা করতে পারবে।`],
    };
    objField.value += data.obj + "\n";
    data.out.forEach((o) => {
      aiList.innerHTML += `<div class="list-item">✅ ${o}</div>`;
      viewOut.innerHTML += `<li>${o}</li>`;
    });
  });
  updatePreview();
}

function updatePreview() {
  document.getElementById("view-school").innerText =
    document.getElementById("schoolName").value || "শিক্ষা প্রতিষ্ঠানের নাম";
  document.getElementById("view-address").innerText =
    document.getElementById("schoolAddress").value || "ঠিকানা এখানে দেখাবে";
  document.getElementById("view-class").innerText =
    document.getElementById("class").value || "-";
  document.getElementById("view-subject").innerText =
    document.getElementById("subject").value || "-";

  const methods = Array.from(
    document.querySelectorAll(".method-check:checked"),
  ).map((cb) => cb.value);
  document.getElementById("view-method").innerText = methods.join(", ") || "-";

  const topics = Array.from(
    document.querySelectorAll(".topic-check:checked"),
  ).map((cb) => cb.value);
  document.getElementById("view-title").innerText = topics.join(", ") || "-";
  document.getElementById("view-objective").innerText =
    document.getElementById("lessonObjective").value ||
    "উদ্দেশ্য এখানে দেখাবে।";
  document.getElementById("view-time").innerText =
    document.getElementById("duration").value + " মিনিট";

  document.getElementById("view-teacher").innerText = topics.length
    ? topics.join(", ") + " আলোচনা"
    : "-";
  document.getElementById("view-group").innerText = topics.length
    ? topics[0] + " এর ওপর কাজ"
    : "-";
  document.getElementById("view-home").innerText = "অনুশীলনী সমাধান";
}

function generateAI() {
  const good = document
    .getElementById("roll-good")
    .value.split(",")
    .filter((r) => r.trim());
  const avg = document
    .getElementById("roll-average")
    .value.split(",")
    .filter((r) => r.trim());
  const low = document
    .getElementById("roll-low")
    .value.split(",")
    .filter((r) => r.trim());

  if (good.length > 0) {
    document.getElementById("view-groups-area").style.display = "block";
    let groupHTML = "";
    for (let i = 0; i < good.length; i++) {
      const avgPart = avg.slice(i * 2, i * 2 + 2);
      const lowPart = low.slice(i * 2, i * 2 + 2);
      groupHTML += `<div class="group-box">
        <strong>গ্রুপ ${i + 1}:</strong><br>
        লিডার: ${good[i]} (ভালো)<br>
        মেম্বার: ${avgPart.join(", ") || "X"}, ${lowPart.join(", ") || "X"}
      </div>`;
    }
    document.getElementById("view-groups").innerHTML = groupHTML;
  }

  const dur = document.getElementById("duration").value || 45;
  const p1 = Math.floor(dur * 0.2);
  const p2 = Math.floor(dur * 0.6);
  const p3 = dur - p1 - p2;
  document.getElementById("view-table-body").innerHTML = `
    <tr><td>${p1} মি.</td><td>শিক্ষক শুভেচ্ছা বিনিময় ও পাঠের ভূমিকা প্রদান করবেন।</td><td>মনোযোগ শেয়ার করবে।</td></tr>
    <tr><td>${p2} মি.</td><td>${document.getElementById("view-method").innerText} পদ্ধতিতে বিস্তারিত আলোচনা ও গ্রুপিং কাজ।</td><td>সক্রিয় অংশগ্রহণ ও নোট গ্রহণ।</td></tr>
    <tr><td>${p3} মি.</td><td>সারসংক্ষেপ আলোচনা এবং মূল্যায়ন।</td><td>বাড়ির কাজ বুঝে নেবে।</td></tr>`;
  alert("লেসন প্ল্যান জেনারেট হয়েছে!");
}

function saveData() {
  alert("সেভ করা হয়েছে!");
}
