// ১. ডাটা সেট (Dropdown Dependency)
const db = {
  NCTB: {
    "৬ষ্ঠ": {
      বিজ্ঞান: {
        "অনুসন্ধানী পাঠ": {
          "অধ্যায় ১": ["কোষ", "নিউক্লিয়াস"],
          "অধ্যায় ২": ["টিস্যু"],
        },
      },
      গণিত: { "গণিত বই": { "অধ্যায় ১": ["সংখ্যার গল্প"] } },
    },
    "৭ম": { বিজ্ঞান: { বই: { অধ্যায়: ["পাঠ"] } } },
  },
};

// ২. ড্রপডাউন হ্যান্ডলার
function handleDependency(type) {
  const board = document.getElementById("board").value;
  const cls = document.getElementById("class");
  const sub = document.getElementById("subject");
  const book = document.getElementById("book");
  const chap = document.getElementById("chapter");
  const lesson = document.getElementById("lesson");

  if (type === "board") {
    cls.innerHTML = '<option value="">নির্বাচন করুন</option>';
    if (board) {
      Object.keys(db[board]).forEach(
        (k) => (cls.innerHTML += `<option>${k}</option>`),
      );
      cls.disabled = false;
    }
  } else if (type === "class") {
    sub.innerHTML = '<option value="">নির্বাচন করুন</option>';
    Object.keys(db[board][cls.value]).forEach(
      (k) => (sub.innerHTML += `<option>${k}</option>`),
    );
    sub.disabled = false;
  } else if (type === "subject") {
    book.innerHTML = '<option value="">নির্বাচন করুন</option>';
    Object.keys(db[board][cls.value][sub.value]).forEach(
      (k) => (book.innerHTML += `<option>${k}</option>`),
    );
    book.disabled = false;
  } else if (type === "book") {
    chap.innerHTML = '<option value="">নির্বাচন করুন</option>';
    Object.keys(db[board][cls.value][sub.value][book.value]).forEach(
      (k) => (chap.innerHTML += `<option>${k}</option>`),
    );
    chap.disabled = false;
  } else if (type === "chapter") {
    lesson.innerHTML = '<option value="">নির্বাচন করুন</option>';
    db[board][cls.value][sub.value][book.value][chap.value].forEach(
      (k) => (lesson.innerHTML += `<option>${k}</option>`),
    );
    lesson.disabled = false;
  }
  updatePreview();
  validateForm();
}

// ৩. লাইভ প্রিভিউ সিঙ্ক
function updatePreview() {
  const s = document.getElementById("subject").value;
  const l = document.getElementById("lesson").value;
  const c = document.getElementById("class").value;
  const t = document.getElementById("duration").value;
  const b = document.getElementById("board").value;

  document.getElementById("v-board").innerText = b
    ? b + " কারিকুলাম ২০২৩"
    : "বোর্ড তথ্য";
  document.getElementById("v-title").innerText =
    s && l ? s + " - " + l : "পাঠের শিরোনাম";
  document.getElementById("v-meta").innerText =
    `শ্রেণি: ${c || "-"} | বিষয়: ${s || "-"} | সময়: ${t} মিনিট`;
}

// ৪. ভ্যালিডেশন (Generate Button Enable/Disable)
function validateForm() {
  const lesson = document.getElementById("lesson").value;
  const isReady = lesson !== "" && lesson !== "নির্বাচন করুন";
  document.getElementById("topGenBtn").disabled = !isReady;
  document.getElementById("stickyGenBtn").disabled = !isReady;
}

// ৫. চিপস লজিক
function addChip(val) {
  const note = document.getElementById("aiNote");
  note.value += (note.value ? ", " : "") + val;
}

// ৬. স্টেপার নেভিগেশন
document.querySelectorAll(".step").forEach((step) => {
  step.onclick = () => {
    const secId = step.getAttribute("data-sec");
    document
      .getElementById(secId)
      .scrollIntoView({ behavior: "smooth", block: "center" });
    document
      .querySelectorAll(".step")
      .forEach((s) => s.classList.remove("active"));
    step.classList.add("active");
  };
});

// ৭. জেনারেট সিমুলেশন
function generateLesson() {
  const btns = [
    document.getElementById("topGenBtn"),
    document.getElementById("stickyGenBtn"),
  ];
  btns.forEach(
    (b) =>
      (b.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> জেনারেট হচ্ছে...'),
  );

  setTimeout(() => {
    document.getElementById("v-outcomes").innerHTML =
      "<ul><li>পাঠ শেষে শিক্ষার্থীরা বিষয়টি ব্যাখ্যা করতে পারবে।</li><li>বাস্তব জীবনের উদাহরণের প্রয়োগ দেখাবে।</li></ul>";
    btns.forEach(
      (b) =>
        (b.innerHTML =
          '<i class="fa-solid fa-wand-magic-sparkles"></i> জেনারেট করুন'),
    );
    alert("লেসন প্ল্যান সফলভাবে তৈরি হয়েছে!");
  }, 2000);
}
