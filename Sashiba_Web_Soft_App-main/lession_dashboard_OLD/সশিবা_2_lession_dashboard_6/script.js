// ১. সাবজেক্ট লিস্ট ডেটাবেস
const subjectData = {
  primary: ["বাংলা", "ইংরেজি", "গণিত", "পরিবেশ পরিচিতি"],
  upperPrimary: [
    "বাংলা",
    "ইংরেজি",
    "গণিত",
    "বাংলাদেশ ও বিশ্বপরিচয়",
    "প্রাথমিক বিজ্ঞান",
    "ধর্ম ও নৈতিক শিক্ষা",
  ],
  secondary: [
    "বাংলা",
    "ইংরেজি",
    "গণিত",
    "বাংলাদেশ ও বিশ্বপরিচয়",
    "বিজ্ঞান",
    "ধর্ম ও নৈতিক শিক্ষা",
    "তথ্য ও যোগাযোগ প্রযুক্তি",
    "শারীরিক শিক্ষা ও স্বাস্থ্য",
    "কর্ম ও জীবনমুখী শিক্ষা",
  ],
  secondaryGroup: {
    বিজ্ঞান: ["পদার্থবিজ্ঞান", "রসায়ন", "উচ্চতর গণিত", "জীববিজ্ঞান"],
    মানবিক: [
      "ভূগোল ও পরিবেশ",
      "পৌরনীতি ও নাগরিকতা",
      "অর্থনীতি",
      "ইতিহাস",
      "কৃষি শিক্ষা",
      "গার্হস্থ্য বিজ্ঞান",
    ],
    ব্যবসায়: ["হিসাববিজ্ঞান", "ব্যবসায় উদ্যোগ", "ফিন্যান্স ও ব্যাংকিং"],
  },
  higherSecondary: {
    আবশ্যিক: ["বাংলা", "ইংরেজি", "তথ্য ও যোগাযোগ প্রযুক্তি"],
    বিজ্ঞান: ["পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "উচ্চতর গণিত"],
    মানবিক: [
      "ইতিহাস",
      "সমাজবিজ্ঞান",
      "পৌরনীতি ও সুশাসন",
      "যুক্তিবিদ্যা",
      "অর্থনীতি",
      "ভূগোল",
      "মনোবিজ্ঞান",
      "ইসলামের ইতিহাস ও সংস্কৃতি",
    ],
    ব্যবসায়: [
      "হিসাববিজ্ঞান",
      "ব্যবসায় সংগঠন ও ব্যবস্থাপনা",
      "ফিন্যান্স ও ব্যাংকিং",
      "উৎপাদন ব্যবস্থাপনা ও বিপণন",
    ],
  },
};

// ২. শ্রেণি অনুযায়ী সাবজেক্ট লোড করা
function loadSubjects() {
  const classVal = document.getElementById("class").value;
  const subjectDropdown = document.getElementById("subject");
  subjectDropdown.innerHTML = '<option value="">বিষয় নির্বাচন করুন</option>';

  let subjects = [];

  if (classVal >= 1 && classVal <= 2) {
    subjects = subjectData.primary;
  } else if (classVal >= 3 && classVal <= 5) {
    subjects = subjectData.upperPrimary;
  } else if (classVal >= 6 && classVal <= 8) {
    subjects = subjectData.secondary;
  } else if (classVal >= 9 && classVal <= 10) {
    // ৯-১০ এর জন্য সব গ্রুপের বিষয় একসাথে দেখানো হচ্ছে সুবিধার জন্য
    subjects = [
      ...subjectData.secondary,
      ...subjectData.secondaryGroup.বিজ্ঞান,
      ...subjectData.secondaryGroup.মানবিক,
      ...subjectData.secondaryGroup.ব্যবসায়,
    ];
  } else if (classVal >= 11 && classVal <= 12) {
    subjects = [
      ...subjectData.higherSecondary.আবশ্যিক,
      ...subjectData.higherSecondary.বিজ্ঞান,
      ...subjectData.higherSecondary.মানবিক,
      ...subjectData.higherSecondary.ব্যবসায়,
    ];
  }

  subjects.forEach((sub) => {
    let opt = document.createElement("option");
    opt.value = sub;
    opt.innerHTML = sub;
    subjectDropdown.appendChild(opt);
  });

  syncData();
}

// ৩. লাইভ প্রিভিউ সিঙ্কিং
function syncData() {
  // স্কুল তথ্য
  const sName =
    document.getElementById("schoolName").value || "শিক্ষা প্রতিষ্ঠানের নাম";
  const sAddr =
    document.getElementById("schoolAddress").value || "প্রতিষ্ঠানের ঠিকানা";
  document.getElementById("out-school-name").innerText = sName;
  document.getElementById("out-school-address").innerText = sAddr;

  // একাডেমিক তথ্য
  const board = document.getElementById("board").value;
  const classVal =
    document.getElementById("class").options[
      document.getElementById("class").selectedIndex
    ].text;
  const subject = document.getElementById("subject").value || "-";
  const time = document.getElementById("duration").value;
  const lesson = document.getElementById("lesson").value || "পাঠের শিরোনাম";

  document.getElementById("out-board").innerText =
    "জাতীয় শিক্ষাক্রম (" + board + ")";
  document.getElementById("out-class").innerText =
    classVal !== "নির্বাচন করুন" ? classVal : "-";
  document.getElementById("out-subject").innerText = subject;
  document.getElementById("out-time").innerText = time;
  document.getElementById("out-title").innerText = subject + " - " + lesson;
}

// ৪. জেনারেট আউটপুট (Mock)
function generateOutput() {
  const btn = document.querySelector(".btn-generate-best");
  btn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> AI জেনারেট করছে...';

  setTimeout(() => {
    const sub = document.getElementById("subject").value;
    const lesson = document.getElementById("lesson").value;

    document.getElementById("out-outcomes").innerHTML = `
            <li>শিক্ষার্থীরা ${sub} বিষয়ের ${lesson} পাঠের মূল উদ্দেশ্য ব্যাখ্যা করতে পারবে।</li>
            <li>বাস্তব জীবনের উদাহরণের মাধ্যমে ধারণাটি বিশ্লেষণ করতে সক্ষম হবে।</li>
            <li>NCTB কারিকুলাম ২০২৩ অনুযায়ী সৃজনশীল চিন্তার বিকাশ ঘটাবে।</li>
        `;

    document.getElementById("out-table-body").innerHTML = `
            <tr>
                <td>১০ মিনিট</td>
                <td>শিক্ষক পাঠের ভূমিকা আলোচনা করবেন এবং পূর্বজ্ঞান যাচাই করবেন।</td>
                <td>শিক্ষার্থীরা মনোযোগ দিয়ে শুনবে এবং প্রশ্নের উত্তর দেবে।</td>
            </tr>
            <tr>
                <td>২৫ মিনিট</td>
                <td>মাল্টিমিডিয়া বা পোস্টারের মাধ্যমে মূল পাঠ বিশ্লেষণ।</td>
                <td>দলগত আলোচনা এবং খাতায় নোট গ্রহণ।</td>
            </tr>
            <tr>
                <td>১০ মিনিট</td>
                <td>সারসংক্ষেপ আলোচনা এবং মূল্যায়ন কুইজ।</td>
                <td>অর্জিত জ্ঞান যাচাই এবং বাড়ির কাজ বুঝে নেওয়া।</td>
            </tr>
        `;

    btn.innerHTML =
      '<i class="fa-solid fa-wand-magic-sparkles"></i> জেনারেট লেসন প্ল্যান করুন';
    alert("লেসন প্ল্যান সফলভাবে জেনারেট হয়েছে!");
  }, 1500);
}

// ৫. প্রিন্ট ফাংশন
function printLesson() {
  window.print();
}

// ৬. নতুন লেসন রিসেট
function newLesson() {
  if (confirm("নতুন লেসন প্ল্যান শুরু করবেন? বর্তমান তথ্য মুছে যাবে।")) {
    location.reload();
  }
}

// ৭. ড্রপডাউন টগল
function toggleDropdown() {
  const drop = document.getElementById("exportDropdown");
  drop.style.display = drop.style.display === "block" ? "none" : "block";
}

function addChip(val) {
  document.getElementById("aiPrompt").value += val + ", ";
}

window.onclick = function (event) {
  if (!event.target.matches(".btn-secondary")) {
    document.getElementById("exportDropdown").style.display = "none";
  }
};
