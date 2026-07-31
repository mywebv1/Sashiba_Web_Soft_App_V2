// ১. ডাটা সেট (Dependency Data)
const dataStore = {
  "জাতীয় শিক্ষাক্রম (NCTB)": {
    "৬ষ্ঠ": {
      বিজ্ঞান: {
        "অনুসন্ধানী পাঠ": {
          "অধ্যায় ১": ["কোষ", "নিউক্লিয়াস"],
          "অধ্যায় ২": ["টিস্যু"],
        },
      },
      গণিত: { "গণিত বই": { "অধ্যায় ১": ["সংখ্যার গল্প"] } },
    },
  },
};

// ২. ড্রপডাউন চেইন লজিক
function handleDependency(type) {
  const board = document.getElementById("board").value;
  const cls = document.getElementById("class");
  const sub = document.getElementById("subject");
  const bk = document.getElementById("book");
  const ch = document.getElementById("chapter");
  const les = document.getElementById("lesson");

  if (type === "board") {
    cls.innerHTML = '<option value="">নির্বাচন করুন</option>';
    if (board) {
      Object.keys(dataStore[board]).forEach(
        (k) => (cls.innerHTML += `<option>${k}</option>`),
      );
      cls.disabled = false;
    }
  } else if (type === "class") {
    sub.innerHTML = '<option value="">নির্বাচন করুন</option>';
    Object.keys(dataStore[board][cls.value]).forEach(
      (k) => (sub.innerHTML += `<option>${k}</option>`),
    );
    sub.disabled = false;
  } else if (type === "subject") {
    bk.innerHTML = '<option value="">নির্বাচন করুন</option>';
    Object.keys(dataStore[board][cls.value][sub.value]).forEach(
      (k) => (bk.innerHTML += `<option>${k}</option>`),
    );
    bk.disabled = false;
  } else if (type === "book") {
    ch.innerHTML = '<option value="">নির্বাচন করুন</option>';
    Object.keys(dataStore[board][cls.value][sub.value][bk.value]).forEach(
      (k) => (ch.innerHTML += `<option>${k}</option>`),
    );
    ch.disabled = false;
  } else if (type === "chapter") {
    les.innerHTML = '<option value="">নির্বাচন করুন</option>';
    dataStore[board][cls.value][sub.value][bk.value][ch.value].forEach(
      (k) => (les.innerHTML += `<option>${k}</option>`),
    );
    les.disabled = false;
  }
  updatePreview();
  validate();
}

// ৩. লাইভ প্রিভিউ সিঙ্ক
function updatePreview() {
  document.getElementById("v-board").innerText =
    document.getElementById("board").value || "NCTB কারিকুলাম ২০২৩";
  document.getElementById("v-title").innerText =
    document.getElementById("lesson").value || "লেসন প্ল্যান শিরোনাম";
  document.getElementById("v-class").innerText =
    document.getElementById("class").value || "-";
  document.getElementById("v-subject").innerText =
    document.getElementById("subject").value || "-";
  document.getElementById("v-time").innerText =
    document.getElementById("duration").value + " মিনিট";
}

// ৪. ভ্যালিডেশন
function validate() {
  const les = document.getElementById("lesson").value;
  document.getElementById("genBtn").disabled =
    les === "" || les === "নির্বাচন করুন";
}

// ৫. প্রিন্ট ফাংশন
function printLesson() {
  window.print();
}

// ৬. ড্রপডাউন টগল
function toggleDropdown() {
  document.getElementById("exportDropdown").classList.toggle("show");
}

// ৭. AI জেনারেশন (Mock)
function generateLesson() {
  const btn = document.getElementById("genBtn");
  btn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> জেনারেট হচ্ছে...';

  setTimeout(() => {
    document.getElementById("preview-placeholder").style.display = "none";
    const content = document.getElementById("real-content");
    content.style.display = "block";

    content.innerHTML = `
            <section style="margin-bottom: 20px;">
                <h3 style="border-bottom: 1px solid #000; padding-bottom: 5px;">১. শিখনফল (Learning Outcomes)</h3>
                <ul style="padding-left: 20px; margin-top: 10px;">
                    <li>শিক্ষার্থীরা বিষয়টি গভীরভাবে ব্যাখ্যা করতে পারবে।</li>
                    <li>বাস্তব জীবনের উদাহরণের মাধ্যমে ধারণাটি বিশ্লেষণ করতে সক্ষম হবে।</li>
                </ul>
            </section>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr style="background: #f1f5f9;">
                    <th style="border: 1px solid #000; padding: 10px;">সময়</th>
                    <th style="border: 1px solid #000; padding: 10px;">শিক্ষকের কাজ</th>
                    <th style="border: 1px solid #000; padding: 10px;">শিক্ষার্থীর কাজ</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 10px; text-align: center;">১০ মিনিট</td>
                    <td style="border: 1px solid #000; padding: 10px;">পূর্বজ্ঞান যাচাই ও আলোচনা।</td>
                    <td style="border: 1px solid #000; padding: 10px;">প্রশ্নের উত্তর প্রদান।</td>
                </tr>
            </table>
        `;

    btn.innerHTML =
      '<i class="fa-solid fa-wand-magic-sparkles"></i> জেনারেট লেসন প্ল্যান করুন';
    alert("লেসন প্ল্যান সফলভাবে জেনারেট হয়েছে!");
  }, 2000);
}

// চিপস
function addChip(val) {
  const note = document.getElementById("aiNote");
  note.value += (note.value ? ", " : "") + val;
}
