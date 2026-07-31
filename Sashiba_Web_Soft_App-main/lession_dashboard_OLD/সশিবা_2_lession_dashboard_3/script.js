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

function updatePreview() {
  const sub = document.getElementById("subject").value;
  const les = document.getElementById("lesson").value;
  const cls = document.getElementById("class").value;
  const time = document.getElementById("duration").value;

  if (sub && les) {
    document.getElementById("v-title").innerText = sub + " - " + les;
    document.getElementById("v-meta").innerText =
      `শ্রেণি: ${cls} | সময়: ${time} মিনিট`;
  }
}

function validateForm() {
  const lesson = document.getElementById("lesson").value;
  const isReady = lesson !== "" && lesson !== "নির্বাচন করুন";
  document.getElementById("topGenBtn").disabled = !isReady;
  document.getElementById("stickyGenBtn").disabled = !isReady;
}

function addChip(val) {
  const note = document.getElementById("aiNote");
  note.value += (note.value ? ", " : "") + val;
}

function generateLesson() {
  const btn = document.getElementById("stickyGenBtn");
  btn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> জেনারেট হচ্ছে...';

  setTimeout(() => {
    document.getElementById("preview-guide").style.display = "none";
    document.getElementById("real-lesson").style.display = "block";
    document.getElementById("v-outcomes").innerHTML =
      "<h4>শিখনফল:</h4><ul><li>কোষের মৌলিক গঠন ব্যাখ্যা করতে পারবে।</li><li>নিউক্লিয়াসের কাজ বর্ণনা করতে পারবে।</li></ul>";
    btn.innerHTML =
      '<i class="fa-solid fa-wand-magic-sparkles"></i> জেনারেট লেসন প্ল্যান';
    alert("লেসন প্ল্যান তৈরি হয়েছে!");
  }, 2000);
}

// স্টেপ নেভিগেশন হাইলাইট
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
