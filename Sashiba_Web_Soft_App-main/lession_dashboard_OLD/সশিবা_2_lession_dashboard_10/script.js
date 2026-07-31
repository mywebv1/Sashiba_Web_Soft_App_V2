const db = {
  subjects: {
    1: ["বাংলা", "ইংরেজি", "গণিত", "পরিবেশ পরিচিতি"],
    2: ["বাংলা", "ইংরেজি", "গণিত", "পরিবেশ পরিচিতি"],
    3: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "প্রাথমিক বিজ্ঞান",
      "ধর্ম ও নৈতিক শিক্ষা",
    ],
    4: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "প্রাথমিক বিজ্ঞান",
      "ধর্ম ও নৈতিক শিক্ষা",
    ],
    5: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "প্রাথমিক বিজ্ঞান",
      "ধর্ম ও নৈতিক শিক্ষা",
    ],
    6: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "বিজ্ঞান",
      "ধর্ম ও নৈতিক শিক্ষা",
      "আইসিটি",
      "শারীরিক শিক্ষা",
      "কর্ম ও জীবনমুখী শিক্ষা",
    ],
    7: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "বিজ্ঞান",
      "ধর্ম ও নৈতিক শিক্ষা",
      "আইসিটি",
      "শারীরিক শিক্ষা",
      "কর্ম ও জীবনমুখী শিক্ষা",
    ],
    8: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বাংলাদেশ ও বিশ্বপরিচয়",
      "বিজ্ঞান",
      "ধর্ম ও নৈতিক শিক্ষা",
      "আইসিটি",
      "শারীরিক শিক্ষা",
      "কর্ম ও জীবনমুখী শিক্ষা",
    ],
    9: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বিজ্ঞান",
      "আইসিটি",
      "পদার্থবিজ্ঞান",
      "রসায়ন",
      "জীববিজ্ঞান",
      "উচ্চতর গণিত",
      "ভূগোল",
      "পৌরনীতি",
      "অর্থনীতি",
      "ইতিহাস",
      "হিসাববিজ্ঞান",
      "ব্যবসায় উদ্যোগ",
      "ফিন্যান্স",
    ],
    10: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বিজ্ঞান",
      "আইসিটি",
      "পদার্থবিজ্ঞান",
      "রসায়ন",
      "জীববিজ্ঞান",
      "উচ্চতর গণিত",
      "ভূগোল",
      "পৌরনীতি",
      "অর্থনীতি",
      "ইতিহাস",
      "হিসাববিজ্ঞান",
      "ব্যবসায় উদ্যোগ",
      "ফিন্যান্স",
    ],
    11: [
      "বাংলা",
      "ইংরেজি",
      "আইসিটি",
      "পদার্থবিজ্ঞান",
      "রসায়ন",
      "জীববিজ্ঞান",
      "উচ্চতর গণিত",
      "ইতিহাস",
      "সমাজবিজ্ঞান",
      "পৌরনীতি",
      "যুক্তিবিদ্যা",
      "অর্থনীতি",
      "ভূগোল",
      "ইসলামের ইতিহাস",
      "হিসাববিজ্ঞান",
      "ব্যবসায় সংগঠন",
    ],
    12: [
      "বাংলা",
      "ইংরেজি",
      "আইসিটি",
      "পদার্থবিজ্ঞান",
      "রসায়ন",
      "জীববিজ্ঞান",
      "উচ্চতর গণিত",
      "ইতিহাস",
      "সমাজবিজ্ঞান",
      "পৌরনীতি",
      "যুক্তিবিদ্যা",
      "অর্থনীতি",
      "ভূগোল",
      "ইসলামের ইতিহাস",
      "হিসাববিজ্ঞান",
      "ব্যবসায় সংগঠন",
    ],
  },
  books: {
    যুক্তিবিদ্যা: ["যুক্তিবিদ্যা ১ম পত্র", "যুক্তিবিদ্যা ২য় পত্র"],
    পদার্থবিজ্ঞান: ["পদার্থবিজ্ঞান (NCTB) ২০২৪"],
    গণিত: ["গণিত (NCTB) ২০২৪"],
    ইংরেজি: ["English For Today"],
  },
  chapters: {
    যুক্তিবিদ্যা: [
      "অধ্যায় ১: যুক্তিবিদ্যা পরিচিতি",
      "অধ্যায় ২: যুক্তির উপাদান",
      "অধ্যায় ৩: আরোহ অনুমান",
    ],
    পদার্থবিজ্ঞান: ["অধ্যায় ১: ভৌত রাশি", "অধ্যায় ২: গতি", "অধ্যায় ৩: বল"],
    ইংরেজি: ["Unit 1: Greetings", "Unit 2: My Family"],
  },
  topics: {
    "অধ্যায় ২: গতি": [
      "সরণ ও দূরত্ব",
      "বেগ ও দ্রুতি",
      "ত্বরণ ও মন্দন",
      "গতির সমীকরণসমূহ",
    ],
    "অধ্যায় ২: যুক্তির উপাদান": [
      "পদের ধারণা ও সংজ্ঞা",
      "শব্দ ও পদের পার্থক্য",
      "যুক্তিবাক্যের শ্রেণিবিভাগ",
    ],
    "Unit 1: Greetings": [
      "Formal Greetings",
      "Informal Greetings",
      "Dialogue Practice",
    ],
  },
  // এআই শিখনফল ডাটাবেস
  aiLogic: {
    "সরণ ও দূরত্ব": {
      obj: "আজ আমি সরণ ও দূরত্বের মধ্যে পার্থক্য এবং এদের গাণিতিক ব্যাখ্যা আলোচনা করব।",
      out: [
        "সরণ ও দূরত্বের সংজ্ঞা বলতে পারবে।",
        "স্কেলার ও ভেক্টর রাশির পার্থক্য করতে পারবে।",
        "বাস্তব জীবনে গতির হিসাব করতে পারবে।",
      ],
    },
    "যুক্তিবাক্যের শ্রেণিবিভাগ": {
      obj: "আজ আমি বিভিন্ন প্রকার যুক্তিবাক্য এবং তাদের গঠন প্রণালী নিয়ে আলোচনা করব।",
      out: [
        "যুক্তিবাক্যের প্রকারভেদ বর্ণনা করতে পারবে।",
        "যৌক্তিক বাক্য গঠন করতে পারবে।",
        "যুক্তিবিদ্যার সঠিক প্রয়োগ জীবনে করতে পারবে।",
      ],
    },
  },
};

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
    selectedTopics.forEach((topic) => {
      const data = db.aiLogic[topic] || {
        obj: `আজ আমি ${topic} সম্পর্কে বিস্তারিত আলোচনা করব।`,
        out: [
          `${topic} এর সংজ্ঞা বলতে পারবে।`,
          `${topic} এর প্রয়োগ ব্যাখ্যা করতে পারবে।`,
        ],
      };
      objectiveField.value = data.obj;
      data.out.forEach((out) => {
        if (!allOutcomes.includes(out)) allOutcomes.push(out);
      });
    });
    allOutcomes.forEach((out) => {
      aiOutcomeList.innerHTML += `<div class="list-item"><i class="fa-solid fa-circle-check" style="color: var(--primary);"></i> ${out}</div>`;
      viewOutcomes.innerHTML += `<li>${out}</li>`;
    });
  }
  updateMethods();
  updatePreview();
}

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

function generateAI() {
  const good = document.getElementById("roll-good").value.split(",");
  const avg = document.getElementById("roll-average").value.split(",");
  const low = document.getElementById("roll-low").value.split(",");

  let groupHtml = "";
  if (good[0] || avg[0] || low[0]) {
    document.getElementById("view-groups-section").style.display = "block";
    const groupCount = Math.max(good.length, avg.length, low.length);
    for (let i = 0; i < groupCount; i++) {
      groupHtml += `<div class="group-card"><b>গ্রুপ ${i + 1}:</b><br>লিডার: ${good[i] || "N/A"}<br>মেম্বার: ${avg[i] || "X"}, ${low[i] || "X"}</div>`;
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
  alert("লেসন প্ল্যান জেনারেট হয়েছে!");
}

function resetForm() {
  if (confirm("নতুন লেসন শুরু করবেন?")) location.reload();
}
function saveData() {
  alert("সেভ করা হয়েছে!");
}
