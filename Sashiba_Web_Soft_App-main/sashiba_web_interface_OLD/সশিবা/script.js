/**
 * Sashiba Project - JavaScript Logic
 * Controls: Theme Toggle, Navigation Highlighting, Dynamic Dashboard Content
 */

// ১. ডাইনামিক কন্টেন্ট ডাটাবেস (নমুনা তথ্য)
const dashboardContents = {
  teacher: {
    intro:
      "শিক্ষকদের পাঠদান সহজ এবং আধুনিক করার জন্য আমরা এখানে ডিজিটাল টুলস সরবরাহ করি।",
    features: [
      "অটোমেটেড লেসন প্ল্যান",
      "দ্রুত প্রশ্নপত্র জেনারেটর",
      "ডিজিটাল মূল্যায়ন সিট",
    ],
  },
  student: {
    intro:
      "শিক্ষার্থীদের জন্য মডার্ন লার্নিং ম্যাটেরিয়ালস, ভিডিও লেসন এবং প্র্যাকটিস টেস্ট এখানে পাওয়া যাবে।",
    features: ["ইন্টারেক্টিভ ভিডিও", "সহজ হ্যান্ডনোটস", "অনলাইন কুইজ"],
  },
  info: {
    intro:
      "নতুন কারিকুলাম অনুযায়ী বিষয়ের মূল ধারণা এবং বিস্তারিত তথ্য এখানে সহজভাবে উপস্থাপন করা হয়েছে।",
    features: ["নির্ভুল তথ্যমালা", "শিখনফল বিশ্লেষণ", "সহায়ক রিসোর্স ফাইল"],
  },
};

// ২. থিম (ডার্ক/লাইট মোড) টগল লজিক
function toggleMode() {
  const body = document.body;
  const btn = document.getElementById("mode-btn");

  body.classList.toggle("dark-mode");

  // বাটন আইকন পরিবর্তন (☀️ দিনের জন্য, 🌙 রাতের জন্য)
  if (body.classList.contains("dark-mode")) {
    btn.innerText = "☀️";
  } else {
    btn.innerText = "🌙";
  }
}

// ৩. হোম পেজে ফিরে আসার ফাংশন
function showHome() {
  document.getElementById("home-page").classList.remove("hidden");
  document.getElementById("dashboard-page").classList.add("hidden");
  resetNavHighlight();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ৪. নেভিগেশন হাইলাইট রিসেট করা
function resetNavHighlight() {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => link.classList.remove("active-nav"));
}

/**
 * ৫. ড্যাশবোর্ড ওপেন করার মেইন ফাংশন
 * @param {string} subName - সাব-মেনুর নাম (যেমন: বাংলা, লেসন প্ল্যান)
 * @param {string} category - মেইন ক্যাটাগরি (teacher, student, info)
 */
function openDashboard(subName, category) {
  // সেকশন পরিবর্তন
  document.getElementById("home-page").classList.add("hidden");
  document.getElementById("dashboard-page").classList.remove("hidden");

  // ড্যাশবোর্ড টাইটেল আপডেট
  document.getElementById("dash-title").innerText = subName;

  // মেইন মেনু হাইলাইট লজিক
  resetNavHighlight();
  if (category === "teacher")
    document.getElementById("nav-teacher").classList.add("active-nav");
  if (category === "student")
    document.getElementById("nav-student").classList.add("active-nav");
  if (category === "info")
    document.getElementById("nav-info").classList.add("active-nav");

  // সাইডবার চ্যাপ্টার লিস্ট তৈরি করা
  const sidebar = document.getElementById("sidebar-list");
  sidebar.innerHTML = `
        <div class="chapter-link chapter-active" onclick="loadContent('১ম অধ্যায়', '${category}')">
            <span class="clear-number">১ম</span> অধ্যায়: প্রারম্ভিক আলোচনা
        </div>
        <div class="chapter-link" onclick="loadContent('২য় অধ্যায়', '${category}')">
            <span class="clear-number">২য়</span> অধ্যায়: বিস্তারিত পাঠ
        </div>
        <div class="chapter-link" onclick="loadContent('৩য় অধ্যায়', '${category}')">
            <span class="clear-number">৩য়</span> অধ্যায়: সারাংশ ও মূল্যায়ন
        </div>
    `;

  // ডিফল্টভাবে ১ম অধ্যায়ের কন্টেন্ট লোড করা
  loadContent("১ম অধ্যায়", category);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * ৬. অধ্যায় অনুযায়ী বিস্তারিত কন্টেন্ট লোড করা
 * @param {string} ch - অধ্যায়ের নাম
 * @param {string} cat - ক্যাটাগরি
 */
function loadContent(ch, cat) {
  const data = dashboardContents[cat] || dashboardContents["info"];

  // বিস্তারিত বিবরণ আপডেট
  document.getElementById("dash-intro").innerText = `${ch} - ${data.intro}`;

  // ফিচার বক্স আপডেট
  const featureBox = document.getElementById("dash-features");
  featureBox.innerHTML = data.features
    .map(
      (f) => `
        <div class="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 transition hover:translate-x-1">
            <div class="text-3xl">💡</div>
            <div>
                <h4 class="text-xl font-bold">${f}</h4>
                <p class="text-sm opacity-60">এই মডিউলের বিস্তারিত তথ্য শীঘ্রই আপডেট করা হবে।</p>
            </div>
        </div>
    `,
    )
    .join("");

  // সাইডবার হাইলাইট আপডেট
  document.querySelectorAll(".chapter-link").forEach((el) => {
    el.classList.remove("chapter-active");
    if (el.innerText.includes(ch)) el.classList.add("chapter-active");
  });
}

// ৭. সার্চ ফাংশনালিটি
function triggerSearch() {
  const query = document.getElementById("main-search").value.trim();
  if (query) {
    // সার্চ দিলে ডিফল্টভাবে তথ্য বাতায়নের ড্যাশবোর্ড ওপেন হবে
    openDashboard(query, "info");
  } else {
    alert("দয়া করে কিছু লিখে সার্চ করুন!");
  }
}

// এন্টার কি চাপলে সার্চ হবে
document
  .getElementById("main-search")
  ?.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      triggerSearch();
    }
  });
