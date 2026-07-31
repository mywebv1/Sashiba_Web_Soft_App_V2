// ==================== থিম সিনক্রোনাইজেশন লজিক (postMessage & localStorage) ====================
(function initSubAppThemeSync() {
  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else if (theme === "light") {
      document.body.classList.remove("dark-mode");
    }
  }

  try {
    const savedTheme = localStorage.getItem("sashiba_theme");
    if (savedTheme) applyTheme(savedTheme);
  } catch (e) {}

  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "THEME_CHANGE") {
      applyTheme(event.data.theme);
    }
  });
})();

// ১. নেভিগেশন ও প্রগ্রেস বার
function next(s) {
  document.querySelectorAll(".step").forEach((step) => {
    step.classList.remove("active");
    step.style.display = "none";
  });

  const target = document.getElementById("step" + s);
  if (target) {
    target.style.display = "block";
    setTimeout(() => {
      target.classList.add("active");
    }, 10);
  }

  // প্রগ্রেস বার ও ধাপ নির্দেশক আপডেট
  document.getElementById("p-bar").style.width =
    (s === 1 ? 33 : s === 2 ? 66 : 100) + "%";
  document.getElementById("current-step-num").innerText = s;
}

// ২. কন্ডিশনাল লজিক
function toggleInstFields() {
  const type = document.getElementById("acc_type").value;
  document
    .getElementById("inst-area")
    .classList.toggle("hidden", type !== "প্রতিষ্ঠান");
}

function toggleNctb() {
  const board = document.getElementById("board").value;
  document
    .getElementById("nctb-box")
    .classList.toggle("hidden", board !== "nctb");
}

// ৩. ক্যালকুলেশন ইঞ্জিন
function calc() {
  let subtotal = 0;
  document.querySelectorAll(".pkg-cb:checked").forEach((cb) => {
    subtotal += parseInt(cb.getAttribute("data-p")) || 0;
  });

  const duration = parseInt(document.getElementById("duration").value) || 1;
  let rawTotal = subtotal * duration;

  let discount = 0;
  if (duration === 6) discount = rawTotal * 0.1;
  else if (duration === 12) discount = rawTotal * 0.2;

  document.getElementById("s-total").innerText = rawTotal;
  document.getElementById("s-final").innerText = Math.round(
    rawTotal - discount,
  );
}

// প্যাকেজে ক্লিক ইভেন্ট লিসেনার
document.querySelectorAll(".pkg-cb").forEach((cb) => {
  cb.addEventListener("change", calc);
});

// ৪. সাবমিট ও ভাউচার জেনারেশন
const form = document.getElementById("smartRegForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const btn = document.getElementById("pay-btn");
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> প্রসেসিং...';
  btn.disabled = true;

  setTimeout(() => {
    const name = document.getElementById("full_name").value;
    const phone = document.getElementById("phone").value;
    const finalAmount = document.getElementById("s-final").innerText;
    const method = document.querySelector(
      'input[name="pay_method"]:checked',
    ).value;
    const duration = document.getElementById("duration").value;

    let pkgs = [];
    document
      .querySelectorAll(".pkg-cb:checked")
      .forEach((cb) => pkgs.push(cb.dataset.n));

    // মেয়াদ ও তারিখ
    const today = new Date();
    const expiry = new Date();
    expiry.setMonth(today.getMonth() + parseInt(duration));

    const content = `
      <div class="v-item"><span class="v-label">গ্রাহকের নাম:</span> <span class="v-val">${name}</span></div>
      <div class="v-item"><span class="v-label">মোবাইল নম্বর:</span> <span class="v-val font-num">${phone}</span></div>
      <div class="v-item"><span class="v-label">পেমেন্ট পদ্ধতি:</span> <span class="v-val">${method}</span></div>
      <div class="v-item"><span class="v-label">নির্বাচিত প্যাকেজ:</span> <span class="v-val" style="font-size:13px;">${pkgs.join(", ")}</span></div>
      <div class="v-item"><span class="v-label">সাবস্ক্রিপশন মেয়াদ:</span> <span class="v-val">${duration} মাস</span></div>
      
      <div class="v-total-box">
        <div class="v-item" style="border:none; padding:0;">
          <span class="v-label" style="color:var(--primary); font-weight:700;">সর্বমোট পরিশোধিত:</span> 
          <span class="v-val font-num" style="font-size:24px; color:var(--primary);">৳${finalAmount}</span>
        </div>
      </div>
      
      <div style="margin-top:20px; font-size:13px; color:var(--light-text);">
        <p>ইস্যু তারিখ: <span class="font-num">${today.toLocaleDateString("bn-BD")}</span></p>
        <p>মেয়াদ শেষ হবে: <span class="font-num" style="color:var(--primary); font-weight:bold;">${expiry.toLocaleDateString("bn-BD")}</span></p>
        <p>ট্রানজেকশন আইডি: <span class="font-num" style="text-transform:uppercase;">SMART${Date.now().toString().slice(-8)}</span></p>
      </div>
    `;

    document.getElementById("v-data-content").innerHTML = content;
    document.getElementById("voucher").classList.remove("hidden");

    btn.innerHTML = "সফল হয়েছে ✅";
    btn.disabled = false;
  }, 1500);
});
