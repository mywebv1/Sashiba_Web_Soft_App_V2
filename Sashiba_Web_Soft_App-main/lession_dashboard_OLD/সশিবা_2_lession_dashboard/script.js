/**
 * Senior Frontend Architect Note:
 * এখানে আমি স্টেট ম্যানেজমেন্ট এবং রিয়েল-টাইম সিঙ্কিং লজিক ব্যবহার করেছি।
 * এটি শিক্ষক টাইপ করার সাথে সাথে প্রিভিউ আপডেট করবে।
 */

// ১. স্টেট ডাটা (ডিফল্ট ভ্যালু)
let lessonData = {
  board: "জাতীয় শিক্ষাক্রম (NCTB)",
  class: "৬ষ্ঠ",
  subject: "",
  chapter: "",
  time: "৪৫",
  level: "মাঝারি",
  outcomes: "",
  aiInstruction: "",
};

// ২. ইনপুট সিঙ্কিং লজিক (Real-time Sync)
// প্রতিটি ইনপুট ফিল্ডে oninput="syncData(this, 'key')" যোগ করতে হবে
function syncData(element, key) {
  const value = element.value;
  lessonData[key] = value;

  // প্রিভিউ সেকশন আপডেট করা
  if (key === "subject" || key === "chapter") {
    document.getElementById("v-title").innerText =
      (lessonData.subject || "বিষয়") + " - " + (lessonData.chapter || "অধ্যায়");
  }

  if (key === "class" || key === "time") {
    document.getElementById("v-meta").innerText =
      `শ্রেণি: ${lessonData.class} | সময়: ${lessonData.time} মিনিট`;
  }
}

// ৩. AI জেনারেশন লজিক (Mock AI Call)
function generateLesson() {
  const genBtn = document.querySelector(".btn-primary");
  const outcomeBox = document.getElementById("v-outcomes");

  // বাটন এনিমেশন
  genBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> AI ভাবছে...';
  genBtn.disabled = true;

  // স্কেলিটন লোডার দেখানো
  outcomeBox.innerHTML = `
        <div class="skeleton-text"></div>
        <div class="skeleton-text w-75"></div>
    `;

  // ২ সেকেন্ড পর AI থেকে ডাটা আসার সিমুলেশন
  setTimeout(() => {
    // AI থেকে প্রাপ্ত তথ্য (এটি ডাইনামিক হবে আপনার API থেকে)
    const generatedOutcomes = `
            <ul>
                <li>${lessonData.subject} এর মূল ধারণা ব্যাখ্যা করতে পারবে।</li>
                <li>বাস্তব জীবনের উদাহরণের মাধ্যমে ${lessonData.chapter} এর প্রয়োগ দেখাবে।</li>
                <li>NCTB কারিকুলাম অনুযায়ী সৃজনশীল চিন্তার বিকাশ ঘটাবে।</li>
            </ul>
        `;

    // প্রিভিউতে ডাটা বসানো
    outcomeBox.innerHTML = generatedOutcomes;

    // বাটন রিসেট
    genBtn.innerHTML =
      '<i class="fa-solid fa-wand-magic-sparkles"></i> জেনারেট করুন';
    genBtn.disabled = false;

    // সাকসেস মেসেজ
    showToast("সফলভাবে লেসন প্ল্যান তৈরি হয়েছে!");
  }, 2000);
}

// ৪. মাল্টি-স্টেপ ফর্ম নেভিগেশন (Stepper Logic)
let currentStep = 1;
function nextStep(step) {
  const steps = document.querySelectorAll(".step");
  steps.forEach((s) => s.classList.remove("active"));

  document.querySelector(`.step[data-step="${step}"]`).classList.add("active");
  currentStep = step;
  // এখানে ইনপুট প্যানেলের কন্টেন্ট হাইড/শো করার লজিক আসবে
}

// ৫. এক্সপোর্ট লজিক (PDF/Print)
function exportPDF() {
  window.print(); // ব্রাউজারের প্রিন্ট অপশন ট্রিগার করবে
}

// ৬. অটো-সেভ ড্রাফট সিমুলেশন
setInterval(() => {
  if (lessonData.subject !== "") {
    console.log("Draft Auto-saved at: " + new Date().toLocaleTimeString());
    // এখানে LocalStorage বা API তে ডাটা সেভ করার কোড বসবে
  }
}, 30000); // প্রতি ৩০ সেকেন্ড পর পর

// ইউটিলিটি: টোস্ট মেসেজ
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "ai-toast";
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
