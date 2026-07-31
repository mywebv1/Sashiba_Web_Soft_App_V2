// ১. ডাটাবেস (শ্রেণি, বিষয়, অধ্যায়, পাঠ এবং এআই শিখনফল)
const db = {
  subjects: {
    1: ["বাংলা", "ইংরেজি", "গণিত", "পরিবেশ পরিচিতি"],
    6: ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান", "তথ্য ও যোগাযোগ প্রযুক্তি"],
    9: ["পদার্থবিজ্ঞান", "রসায়ন", "উচ্চতর গণিত", "যুক্তিবিদ্যা", "জীববিজ্ঞান"],
    12: ["যুক্তিবিদ্যা", "পদার্থবিজ্ঞান", "রসায়ন", "হিসাববিজ্ঞান"],
  },
  books: {
    যুক্তিবিদ্যা: ["যুক্তিবিদ্যা ১ম পত্র", "যুক্তিবিদ্যা ২য় পত্র"],
    পদার্থবিজ্ঞান: ["পদার্থবিজ্ঞান (NCTB) ২০২৪"],
    গণিত: ["সাধারণ গণিত (NCTB)"],
  },
  chapters: {
    যুক্তিবিদ্যা: [
      "অধ্যায় ১: যুক্তিবিদ্যা পরিচিতি",
      "অধ্যায় ২: যুক্তির উপাদান",
      "অধ্যায় ৩: আরোহ অনুমান",
    ],
    পদার্থবিজ্ঞান: [
      "অধ্যায় ১: ভৌত রাশি ও পরিমাপ",
      "অধ্যায় ২: গতি",
      "অধ্যায় ৩: বল",
    ],
  },
  // বাস্তবসম্মত আলোচ্য বিষয়
  topics: {
    "অধ্যায় ২: গতি": [
      "সরণ ও দূরত্ব",
      "বেগ ও দ্রুতি",
      "ত্বরণ ও মন্দন",
      "গতির সমীকরণসমূহ",
    ],
    "অধ্যায় ৩: বল": [
      "জড়তা ও বলের ধারণা",
      "নিউটনের ১ম সূত্র",
      "ভরবেগ",
      "ঘর্ষণ বল",
    ],
    "অধ্যায় ২: যুক্তির উপাদান": [
      "পদের ধারণা ও সংজ্ঞা",
      "শব্দ ও পদের পার্থক্য",
      "যুক্তিবাক্যের শ্রেণিবিভাগ",
    ],
    "অধ্যায় ১: যুক্তিবিদ্যা পরিচিতি": [
      "যুক্তিবিদ্যার সংজ্ঞা",
      "যুক্তিবিদ্যার স্বরূপ ও পরিসর",
    ],
  },
  // এআই জেনারেটেড শিখনফল ডাটাবেস (Simulated AI)
  aiLogic: {
    "ত্বরণ ও মন্দন": {
      objective:
        "আজ আমি শিক্ষার্থীদের ত্বরণ ও মন্দনের গাণিতিক ও তাত্ত্বিক ধারণা সম্পর্কে আলোচনা করব।",
      outcomes: [
        "শিক্ষার্থীরা ত্বরণ ও মন্দনের সংজ্ঞা দিতে পারবে।",
        "বেগ বৃদ্ধির হার ও হ্রাসের হারের মধ্যে পার্থক্য করতে পারবে।",
        "বাস্তব জীবনে গতির পরিবর্তনে ত্বরণের প্রয়োগ ব্যাখ্যা করতে পারবে।",
      ],
    },
    "নিউটনের ১ম সূত্র": {
      objective:
        "আজ আমি নিউটনের গতির প্রথম সূত্র এবং জড়তার ধারণা নিয়ে বিস্তারিত আলোচনা করব।",
      outcomes: [
        "শিক্ষার্থীরা নিউটনের ১ম সূত্রের বিবৃতি প্রদান করতে পারবে।",
        "জড়তা ও বলের পারস্পরিক সম্পর্ক ব্যাখ্যা করতে পারবে।",
        "বস্তুর স্থির ও গতিশীল অবস্থার কারণ বিশ্লেষণ করতে পারবে।",
      ],
    },
    "যুক্তিবাক্যের শ্রেণিবিভাগ": {
      objective:
        "আজ আমি যুক্তিবিদ্যায় যুক্তিবাক্যের বিভিন্ন প্রকারভেদ এবং গঠন নিয়ে আলোচনা করব।",
      outcomes: [
        "শিক্ষার্থীরা যুক্তিবাক্যের প্রকারভেদ বর্ণনা করতে পারবে।",
        "বিভিন্ন যুক্তিবাক্যের মধ্যে যৌক্তিক পার্থক্য নির্ণয় করতে পারবে।",
        "যুক্তি গঠনে সঠিক বাক্যের প্রয়োগ জীবনে কাজে লাগাতে পারবে।",
      ],
    },
  },
};

// ২. শ্রেণি সিলেক্ট করলে বিষয় লোড
function loadSubjects() {
  const cls = document.getElementById("class").value;
  const subSel = document.getElementById("subject");
  subSel.innerHTML = '<option value="">বিষয় নির্বাচন করুন</option>';
  if (db.subjects[cls]) {
    db.subjects[cls].forEach(
      (s) => (subSel.innerHTML += `<option value="${s}">${s}</option>`),
    );
  }
  updatePreview();
}

// ৩. বিষয় সিলেক্ট করলে বই ও অধ্যায় লোড
function loadBooksAndChapters() {
  const sub = document.getElementById("subject").value;
  const bookSel = document.getElementById("bookName");
  const chapDiv = document.getElementById("chapter-list");

  bookSel.innerHTML = (db.books[sub] || [`${sub} পাঠ্যবই`])
    .map((b) => `<option value="${b}">${b}</option>`)
    .join("");

  const chapters = db.chapters[sub] || ["অধ্যায় ১", "অধ্যায় ২", "অধ্যায় ৩"];
  chapDiv.innerHTML = "";
  chapters.forEach((c) => {
    chapDiv.innerHTML += `<label class="list-item"><input type="checkbox" class="chap-check" value="${c}" onchange="loadTopics()"> <span>${c}</span></label>`;
  });
  updatePreview();
}

// ৪. অধ্যায় সিলেক্ট করলে আলোচ্য বিষয় লোড
function loadTopics() {
  const selectedChaps = Array.from(
    document.querySelectorAll(".chap-check:checked"),
  ).map((cb) => cb.value);
  const topicDiv = document.getElementById("topic-list");
  topicDiv.innerHTML = "";

  selectedChaps.forEach((ch) => {
    const topics = db.topics[ch] || [
      `${ch} এর আলোচ্য বিষয় ১`,
      `${ch} এর আলোচ্য বিষয় ২`,
    ];
    topics.forEach((t) => {
      topicDiv.innerHTML += `<label class="list-item"><input type="checkbox" class="topic-check" value="${t}" onchange="triggerAIOutcomes()"> <span>${t}</span></label>`;
    });
  });
  updatePreview();
}

// ৫. এআই শিখনফল ও উদ্দেশ্য জেনারেশন (আপনার প্রধান চাহিদা)
function triggerAIOutcomes() {
  const selectedTopics = Array.from(
    document.querySelectorAll(".topic-check:checked"),
  ).map((cb) => cb.value);
  const objectiveField = document.getElementById("lessonObjective");
  const aiOutcomeList = document.getElementById("ai-outcomes-list");
  const viewOutcomes = document.getElementById("view-outcomes");

  objectiveField.value = "";
  aiOutcomeList.innerHTML = "";
  viewOutcomes.innerHTML = "";

  if (selectedTopics.length > 0) {
    let allOutcomes = [];
    let combinedObjective = "আজ আমি ";

    selectedTopics.forEach((topic, index) => {
      const data = db.aiLogic[topic] || {
        objective: `আজ আমি ${topic} সম্পর্কে বিস্তারিত আলোচনা করব।`,
        outcomes: [
          `${topic} এর সংজ্ঞা বলতে পারবে।`,
          `${topic} এর গুরুত্ব ব্যাখ্যা করতে পারবে।`,
          `বাস্তব জীবনে ${topic} এর প্রয়োগ করতে পারবে।`,
        ],
      };

      // উদ্দেশ্য গঠন
      if (index === 0) combinedObjective = data.objective;

      // শিখনফল সংগ্রহ
      data.outcomes.forEach((out) => {
        if (!allOutcomes.includes(out)) allOutcomes.push(out);
      });
    });

    // ইনপুট ফিল্ড আপডেট
    objectiveField.value = combinedObjective;

    // এআই লিস্ট ও প্রিভিউ আপডেট
    allOutcomes.forEach((out) => {
      aiOutcomeList.innerHTML += `<div class="list-item"><i class="fa-solid fa-circle-check" style="color: var(--primary); margin-right: 8px;"></i> ${out}</div>`;
      viewOutcomes.innerHTML += `<li>${out}</li>`;
    });
  } else {
    aiOutcomeList.innerHTML =
      '<span class="placeholder-text">টপিক সিলেক্ট করলে এআই শিখনফল তৈরি করবে</span>';
    viewOutcomes.innerHTML =
      "<li>টপিক নির্বাচন করলে এখানে এআই শিখনফল দেখাবে।</li>";
  }

  updateMethods(); // পঠনপদ্ধতি আপডেট
  updatePreview();
}

// ৬. পঠনপদ্ধতি আপডেট
function updateMethods() {
  const topics = Array.from(
    document.querySelectorAll(".topic-check:checked"),
  ).map((cb) => cb.value);
  const teacherDiv = document.getElementById("teacher-topics");
  teacherDiv.innerHTML = "";
  topics.forEach((t) => {
    teacherDiv.innerHTML += `<label class="list-item"><input type="checkbox" class="teacher-check" value="${t}" checked onchange="updatePreview()"> <span>${t}</span></label>`;
  });
}

// ৭. লাইভ প্রিভিউ সিঙ্কিং
function updatePreview() {
  document.getElementById("view-school").innerText =
    document.getElementById("schoolName").value || "শিক্ষা প্রতিষ্ঠানের নাম";
  document.getElementById("view-address").innerText =
    document.getElementById("schoolAddress").value || "ঠিকানা এখানে দেখাবে";
  const clsName =
    document.getElementById("class").options[
      document.getElementById("class").selectedIndex
    ]?.text || "-";
  document.getElementById("view-class").innerText = clsName;
  document.getElementById("view-subject").innerText =
    document.getElementById("subject").value || "-";
  document.getElementById("view-time").innerText =
    (document.getElementById("duration").value || "45") + " মিনিট";

  const allTopics = Array.from(
    document.querySelectorAll(".topic-check:checked"),
  ).map((cb) => cb.value);
  const teacherTopics = Array.from(
    document.querySelectorAll(".teacher-check:checked"),
  ).map((cb) => cb.value);
  const aiRemaining = allTopics.filter((t) => !teacherTopics.includes(t));

  document.getElementById("view-title").innerText = allTopics.join(", ") || "-";
  document.getElementById("view-teacher").innerText =
    teacherTopics.join(", ") || "-";
  document.getElementById("view-group").innerText = aiRemaining[0] || "-";
  document.getElementById("view-home").innerText =
    aiRemaining.slice(1).join(", ") || "-";
}

// ৮. জেনারেট লেসন প্ল্যান (টেবিল ও গ্রুপিং)
function generateAI() {
  const good = document.getElementById("roll-good").value.split(",");
  const avg = document.getElementById("roll-average").value.split(",");
  const low = document.getElementById("roll-low").value.split(",");

  let groupHtml = "";
  if (good[0] || avg[0] || low[0]) {
    document.getElementById("view-groups-section").style.display = "block";
    const groupCount = Math.max(good.length, avg.length, low.length);
    for (let i = 0; i < groupCount; i++) {
      if (good[i] || avg[i] || low[i]) {
        groupHtml += `<div class="group-card"><b>গ্রুপ ${i + 1}:</b><br>লিডার: ${good[i] || "N/A"}<br>মেম্বার: ${avg[i] || "X"}, ${low[i] || "X"}</div>`;
      }
    }
    document.getElementById("view-groups").innerHTML = groupHtml;
  }

  const duration = document.getElementById("duration").value || 45;
  const p1 = Math.floor(duration * 0.2);
  const p2 = Math.floor(duration * 0.6);
  const p3 = duration - p1 - p2;

  document.getElementById("view-table-body").innerHTML = `
        <tr><td>${p1} মি.</td><td>শিক্ষক পাঠের ভূমিকা এবং পূর্বজ্ঞান যাচাই করবেন।</td><td>মনোযোগ দিয়ে শুনবে।</td></tr>
        <tr><td>${p2} মি.</td><td>${document.getElementById("view-teacher").innerText} বিষয়ের ওপর বিস্তারিত আলোচনা ও গ্রুপিং কাজ।</td><td>সক্রিয় অংশগ্রহণ এবং নোট গ্রহণ।</td></tr>
        <tr><td>${p3} মি.</td><td>সারসংক্ষেপ আলোচনা এবং মূল্যায়ন কুইজ।</td><td> বাড়ির কাজ বুঝে নেবে।</td></tr>
    `;
  alert("লেসন প্ল্যান ও এআই গ্রুপিং সফলভাবে জেনারেট হয়েছে!");
}

function resetForm() {
  if (confirm("সব তথ্য মুছে নতুন লেসন শুরু করবেন?")) location.reload();
}
function saveData() {
  alert("লেসন প্ল্যান সেভ হয়েছে!");
}
