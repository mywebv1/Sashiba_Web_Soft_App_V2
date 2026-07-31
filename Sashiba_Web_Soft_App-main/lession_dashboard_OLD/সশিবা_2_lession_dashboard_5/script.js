// ১. ড্রপডাউন চেইন আপডেট
function updateChain(type) {
  const cls = document.getElementById("class").value;
  const sub = document.getElementById("subject").value;
  const book = document.getElementById("book");

  if (type === "subject") {
    book.innerHTML = `<option>${sub} বই</option>`;
  }
  syncData();
}

// ২. লাইভ প্রিভিউ সিঙ্কিং
function syncData() {
  document.getElementById("out-class").innerText =
    document.getElementById("class").value || "৬ষ্ঠ";
  document.getElementById("out-subject").innerText =
    document.getElementById("subject").value || "গণিত";
  document.getElementById("out-time").innerText =
    document.getElementById("duration").value;

  const lesson = document.getElementById("lesson").value;
  const subject = document.getElementById("subject").value;
  document.getElementById("out-title").innerText =
    subject + " - " + (lesson || "পাঠের শিরোনাম");
}

// ৩. জেনারেট বাটন ক্লিক করলে কি হবে
function generateOutput() {
  const btn = document.querySelector(".btn-generate-best");
  btn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> জেনারেট হচ্ছে...';

  setTimeout(() => {
    // ডামি জেনারেটেড ডাটা
    document.getElementById("out-outcomes").innerHTML = `
            <li>শিক্ষার্থীরা পাঠের মূল বিষয়বস্তু ব্যাখ্যা করতে পারবে।</li>
            <li>NCTB কারিকুলাম অনুযায়ী সৃজনশীল প্রশ্নের সমাধান করতে পারবে।</li>
        `;

    document.getElementById("out-table-body").innerHTML = `
            <tr>
                <td>১০ মিনিট</td>
                <td>শিক্ষক পাঠের ভূমিকা আলোচনা করবেন।</td>
                <td>শিক্ষার্থীরা মনোযোগ দিয়ে শুনবে।</td>
            </tr>
            <tr>
                <td>২৫ মিনিট</td>
                <td>বই থেকে মূল অংশ পাঠ ও বিশ্লেষণ।</td>
                <td>জোড়ায় কাজ ও আলোচনা।</td>
            </tr>
            <tr>
                <td>১০ মিনিট</td>
                <td>মূল্যায়ন ও বাড়ির কাজ প্রদান।</td>
                <td>প্রশ্নোত্তর ও নোট গ্রহণ।</td>
            </tr>
        `;

    btn.innerHTML =
      '<i class="fa-solid fa-wand-magic-sparkles"></i> জেনারেট লেসন প্ল্যান করুন';
    alert("লেসন প্ল্যান সফলভাবে জেনারেট হয়েছে!");
  }, 1500);
}

// ৪. নতুন লেসন প্ল্যান (Reset)
function newLesson() {
  if (
    confirm("আপনি কি নতুন লেসন প্ল্যান শুরু করতে চান? বর্তমান ডাটা মুছে যাবে।")
  ) {
    location.reload(); // এটি পুরো ড্যাশবোর্ডকে নতুনের মতো রিসেট করে দিবে
  }
}

// ৫. ড্রপডাউন টগল
function toggleDropdown() {
  const drop = document.getElementById("exportDropdown");
  drop.style.display = drop.style.display === "block" ? "none" : "block";
}

// ৬. প্রিন্ট ফাংশন
function printLesson() {
  window.print();
}

// ৭. চিপস অ্যাড
function addChip(val) {
  document.getElementById("aiPrompt").value += val + ", ";
}

// বাইরে ক্লিক করলে ড্রপডাউন বন্ধ
window.onclick = function (event) {
  if (!event.target.matches(".btn-secondary")) {
    document.getElementById("exportDropdown").style.display = "none";
  }
};
