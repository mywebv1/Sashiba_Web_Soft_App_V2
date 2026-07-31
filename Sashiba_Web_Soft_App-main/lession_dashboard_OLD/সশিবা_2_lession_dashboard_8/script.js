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
      "বিজ্ঞান",
      "বিএন্ডডব্লিউ",
      "ধর্ম শিক্ষা",
      "আইসিটি",
    ],
    7: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বিজ্ঞান",
      "বিএন্ডডব্লিউ",
      "ধর্ম শিক্ষা",
      "আইসিটি",
    ],
    8: [
      "বাংলা",
      "ইংরেজি",
      "গণিত",
      "বিজ্ঞান",
      "বিএন্ডডব্লিউ",
      "ধর্ম শিক্ষা",
      "আইসিটি",
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
      "হিসাববিজ্ঞান",
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
      "হিসাববিজ্ঞান",
    ],
  },
  books: {
    পদার্থবিজ্ঞান: ["পদার্থবিজ্ঞান (NCTB) ২০২৪"],
    গণিত: ["গণিত (NCTB) ২০২৪"],
    যুক্তিবিদ্যা: ["যুক্তিবিদ্যা ১ম পত্র", "যুক্তিবিদ্যা ২য় পত্র"],
  },
  chapters: {
    পদার্থবিজ্ঞান: ["অধ্যায় ১: ভৌত রাশি", "অধ্যায় ২: গতি", "অধ্যায় ৩: বল"],
    গণিত: ["অধ্যায় ১: বাস্তব সংখ্যা", "অধ্যায় ২: সেট ও ফাংশন"],
    যুক্তিবিদ্যা: [
      "অধ্যায় ১: যুক্তিবিদ্যা পরিচিতি",
      "অধ্যায় ২: যুক্তির উপাদান",
    ],
  },
  topics: {
    "অধ্যায় ২: গতি": ["সরণ ও দূরত্ব", "বেগ ও দ্রুতি", "ত্বরণ", "গতির সমীকরণ"],
    "অধ্যায় ২: যুক্তির উপাদান": [
      "পদের ধারণা",
      "শব্দ ও পদের পার্থক্য",
      "যুক্তিবাক্য",
    ],
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
      topicDiv.innerHTML += `<label class="list-item"><input type="checkbox" class="topic-check" value="${t}" onchange="updateMethods()"> <span>${t}</span></label>`;
    });
  });
  updatePreview();
}

function updateMethods() {
  const topics = Array.from(
    document.querySelectorAll(".topic-check:checked"),
  ).map((cb) => cb.value);
  const teacherDiv = document.getElementById("teacher-topics");
  const aiOutcomeDiv = document.getElementById("ai-outcomes-list");

  teacherDiv.innerHTML = "";
  aiOutcomeDiv.innerHTML = "";

  if (topics.length > 0) {
    topics.forEach((t) => {
      // শিক্ষক প্যানেল আপডেট
      teacherDiv.innerHTML += `<label class="list-item"><input type="checkbox" class="teacher-check" value="${t}" checked onchange="updatePreview()"> <span>${t}</span></label>`;

      // এআই শিখনফল জেনারেশন লজিক
      let outcomeData = db.outcomes[t] || [
        `${t} সম্পর্কে বিস্তারিত জ্ঞান অর্জন করবে।`,
        `${t} এর গুরুত্ব বিশ্লেষণ করতে পারবে।`,
      ];
      outcomeData.forEach((out) => {
        aiOutcomeDiv.innerHTML += `<div class="list-item"><i class="fa-solid fa-circle-check" style="color: var(--primary); margin-right: 8px;"></i> <span>${out}</span></div>`;
      });
    });
  } else {
    teacherDiv.innerHTML =
      '<span class="placeholder-text">আলোচ্য বিষয় নির্বাচন করলে এখানে আসবে</span>';
    aiOutcomeDiv.innerHTML =
      '<span class="placeholder-text">উদ্দেশ্য লিখলে এআই শিখনফল তৈরি করবে</span>';
  }
  updatePreview();
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

  // প্রিভিউতে শিখনফল আপডেট
  const outcomeArea = document.getElementById("view-outcomes");
  const aiItems = document.querySelectorAll("#ai-outcomes-list span");
  if (aiItems.length > 1) {
    outcomeArea.innerHTML = "";
    aiItems.forEach((item) => {
      if (!item.classList.contains("placeholder-text")) {
        outcomeArea.innerHTML += `<li>${item.innerText}</li>`;
      }
    });
  } else {
    outcomeArea.innerHTML = "<li>উদ্দেশ্য লিখলে এখানে শিখনফল দেখা যাবে...</li>";
  }
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
        <tr><td>${p2} মি.</td><td>${document.getElementById("view-teacher").innerText} বিষয়ের ওপর বিস্তারিত আলোচনা ও দলীয় কাজ।</td><td>সক্রিয় অংশগ্রহণ এবং নোট গ্রহণ।</td></tr>
        <tr><td>${p3} মি.</td><td>সারসংক্ষেপ আলোচনা এবং মূল্যায়ন কুইজ।</td><td> বাড়ির কাজ বুঝে নেবে।</td></tr>
    `;
  alert("এআই শিখনফল ও লেসন প্ল্যান জেনারেট হয়েছে!");
}

function resetForm() {
  if (confirm("সব তথ্য মুছে নতুন লেসন শুরু করবেন?")) location.reload();
}
function saveData() {
  alert("লেসন প্ল্যান সেভ করা হয়েছে!");
}
