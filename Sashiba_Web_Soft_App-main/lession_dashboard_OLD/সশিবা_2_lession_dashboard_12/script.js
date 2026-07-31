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
    "৫ম": ["English", "গণিত", "প্রাথমিক বিজ্ঞান"],
    "৯ম": ["বাংলা", "গণিত", "উচ্চতর গণিত", "বিজ্ঞান"],
    "১০ম": ["পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "বিজ্ঞান"],
  },
  chapters: {
    বিজ্ঞান: ["অধ্যায় ৯: আলোর প্রতিসরণ"],
    "উচ্চতর গণিত": ["অধ্যায় ৫: সমীকরণ"],
    পদার্থবিজ্ঞান: ["অধ্যায় ১: ভৌত রাশি ও পরিমাপ"],
    English: ["Unit 1: Lessons 1-2"],
  },
  topics: {
    "অধ্যায় ৯: আলোর প্রতিসরণ": ["আলোর প্রতিসরণ", "প্রতিসরণের কারণ"],
    "অধ্যায় ৫: সমীকরণ": ["দ্বিঘাত সমীকরণ"],
    "অধ্যায় ১: ভৌত রাশি ও পরিমাপ": [
      "ভৌত রাশি ও পরিমাপ ১",
      "ভৌত রাশি ও পরিমাপ ২",
    ],
    "Unit 1: Lessons 1-2": ["Greetings", "Introduction"],
  },
  aiLogic: {
    "আলোর প্রতিসরণ": {
      obj: "• আলোর প্রতিসরণের ধারণা ব্যাখ্যা করা।\n• প্রতিসরণের কারণ আলোচনা করা।\n• বাস্তব উদাহরণ উপস্থাপন করা।",
      out: [
        "আলোর প্রতিসরণ সংজ্ঞায়িত করতে পারবে।",
        "চিত্র অঙ্কন করতে পারবে।",
        "বাস্তব উদাহরণ শনাক্ত করতে পারবে।",
      ],
      bloom: "Understand",
      bloomDesc:
        "বোধগম্যতা: শিক্ষার্থীরা আলোর আচরণের নিয়মাবলী ব্যাখ্যা করতে পারবে এবং পার্থক্য বুঝতে পারবে।",
    },
    "দ্বিঘাত সমীকরণ": {
      obj: "• দ্বিঘাত সমীকরণের ধারণা প্রদান করা।\n• সমাধান পদ্ধতি পরিচয় করিয়ে দেওয়া।\n• বাস্তব জীবনে ব্যবহার ব্যাখ্যা করা।",
      out: [
        "সমীকরণ শনাক্ত করতে পারবে।",
        "মূল নির্ণয় করতে পারবে।",
        "সমাধানের যথার্থতা যাচাই করতে পারবে।",
      ],
      bloom: "Apply",
      bloomDesc:
        "প্রয়োগ: শিক্ষার্থীরা গাণিতিক সমস্যা বা বাস্তব জীবনের জটিল সমীকরণ সমাধান করতে সক্ষম হবে।",
    },
    "ভৌত রাশি ও পরিমাপ ১": {
      obj: "• ভৌত রাশির প্রাথমিক ধারণা দেওয়া।\n• পরিমাপের প্রয়োজনীয়তা ব্যাখ্যা করা।",
      out: ["রাশি শনাক্ত করতে পারবে।", "একক বলতে পারবে।"],
      bloom: "Remember",
      bloomDesc:
        "জ্ঞান: শিক্ষার্থীরা তথ্য মনে রাখতে এবং পুনরায় বর্ণনা করতে পারবে।",
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
  const cls = document.getElementById("class").value.split(" ")[0];
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
  const chapters = db.chapters[sub] || ["অধ্যায় ১", "অধ্যায় ২"];
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
    const ts = db.topics[ch] || [`${ch} এর আলোচ্য বিষয় ১`];
    ts.forEach((t) => {
      topicList.innerHTML += `<label class="check-item"><input type="checkbox" class="topic-check" value="${t}" onchange="triggerAI()"> ${t}</label>`;
    });
  });
}

function triggerAI() {
  const selectedTopics = Array.from(
    document.querySelectorAll(".topic-check:checked"),
  ).map((cb) => cb.value);
  const objField = document.getElementById("lessonObjective");
  const aiList = document.getElementById("ai-outcomes-list");
  const viewOut = document.getElementById("view-outcomes");
  const bloomDisplay = document.getElementById("bloom-level-display");

  const viewBloomText = document.getElementById("view-bloom-text");
  const viewBloomTag = document.getElementById("view-bloom-tag");
  const viewBloomAnalysis = document.getElementById("view-bloom-analysis-area");
  const viewBloomDesc = document.getElementById("view-bloom-desc");

  objField.value = "";
  aiList.innerHTML = "";
  viewOut.innerHTML = "";
  bloomDisplay.innerHTML =
    '<div class="bloom-placeholder">বিশ্লেষণ দেখাবে...</div>';
  viewBloomTag.style.display = "none";
  viewBloomAnalysis.style.display = "none";

  let detectedLevel = "";
  let detectedDesc = "";

  selectedTopics.forEach((topic) => {
    const data = db.aiLogic[topic] || {
      obj: `• ${topic} সম্পর্কে ধারণা প্রদান।`,
      out: [`${topic} ব্যাখ্যা করতে পারবে।`],
      bloom: "Remember",
      bloomDesc:
        "জ্ঞান: শিক্ষার্থীরা তথ্য মনে রাখতে এবং পুনরায় বর্ণনা করতে পারবে।",
    };
    objField.value += data.obj + "\n";
    detectedLevel = data.bloom;
    detectedDesc = data.bloomDesc;
    data.out.forEach((o) => {
      aiList.innerHTML += `<div class="list-item">✅ ${o}</div>`;
      viewOut.innerHTML += `<li>${o}</li>`;
    });
  });

  if (selectedTopics.length > 0) {
    bloomDisplay.innerHTML = `<div class="bloom-result"><strong>স্তর: ${detectedLevel}</strong><p>${detectedDesc}</p></div>`;
    viewBloomText.innerText = detectedLevel + " (Bloom's Level)";
    viewBloomTag.style.display = "block";
    viewBloomDesc.innerText = detectedDesc;
    viewBloomAnalysis.style.display = "block";
  }

  updatePreview();
}

function updatePreview() {
  const selectedTopics = Array.from(
    document.querySelectorAll(".topic-check:checked"),
  ).map((cb) => cb.value);
  const methods = Array.from(
    document.querySelectorAll(".method-check:checked"),
  ).map((cb) => cb.value);

  document.getElementById("view-school").innerText =
    document.getElementById("schoolName").value || "শিক্ষা প্রতিষ্ঠানের নাম";
  document.getElementById("view-address").innerText =
    document.getElementById("schoolAddress").value || "ঠিকানা";
  document.getElementById("view-class").innerText =
    document.getElementById("class").value || "-";
  document.getElementById("view-subject").innerText =
    document.getElementById("subject").value || "-";
  document.getElementById("view-time").innerText =
    document.getElementById("duration").value + " মিনিট";
  document.getElementById("view-method").innerText = methods.join(", ") || "-";

  document.getElementById("view-title").innerText =
    selectedTopics.join(", ") || "-";
  document.getElementById("view-objective").innerText =
    document.getElementById("lessonObjective").value ||
    "উদ্দেশ্য এখানে দেখাবে।";

  if (selectedTopics.length > 0) {
    document.getElementById("view-teacher").innerText =
      selectedTopics.join(", ") + " আলোচনা ও ব্যাখ্যা";
    document.getElementById("view-group").innerText =
      selectedTopics[0] + " এর ওপর দলগত কাজ";
    document.getElementById("view-home").innerText = "অনুশীলনী সমাধান";
  }
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
  const dur = document.getElementById("duration").value || 45;

  if (good.length > 0) {
    document.getElementById("view-groups-area").style.display = "block";
    let groupHTML = "";
    for (let i = 0; i < good.length; i++) {
      const avgPart = avg.slice(i * 2, i * 2 + 2);
      const lowPart = low.slice(i * 2, i * 2 + 2);
      groupHTML += `<div class="group-box"><strong>গ্রুপ ${i + 1}:</strong><br>লিডার: ${good[i]} (ভালো)<br>মেম্বার: ${avgPart.join(", ") || "X"}, ${lowPart.join(", ") || "X"}</div>`;
    }
    document.getElementById("view-groups").innerHTML = groupHTML;
  }

  const p1 = Math.floor(dur * 0.2);
  const p2 = Math.floor(dur * 0.6);
  const p3 = dur - p1 - p2;
  document.getElementById("view-table-body").innerHTML = `
    <tr><td>${p1} মি.</td><td>শিক্ষক শুভেচ্ছা বিনিময় ও ভূমিকা প্রদান করবেন।</td><td>মনোযোগ শেয়ার করবে।</td></tr>
    <tr><td>${p2} মি.</td><td>বিস্তারিত আলোচনা ও গ্রুপিং কাজ পরিচালনা।</td><td>সক্রিয় অংশগ্রহণ ও নোট গ্রহণ।</td></tr>
    <tr><td>${p3} মি.</td><td>সারসংক্ষেপ আলোচনা এবং মূল্যায়ন।</td><td>বাড়ির কাজ বুঝে নেবে।</td></tr>`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString("bn-BD", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  document.getElementById("view-footer-info").innerText =
    `Generated on: ১০ জুলাই ২০২৬ | সময়: ${timeStr} | Version 1.0`;

  alert("লেসন প্ল্যান সফলভাবে জেনারেট হয়েছে!");
}

function saveData() {
  alert("সেভ করা হয়েছে!");
}
