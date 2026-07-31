// ........... ১. নেভিগেশন ও অ্যানিমেশন লজিক শুরু ...........
function next(s) {
  // সব ধাপ লুকানো
  const steps = document.querySelectorAll(".step");
  steps.forEach((step) => {
    step.classList.remove("active");
    step.style.display = "none";
  });

  // কাঙ্ক্ষিত ধাপটি দেখানো
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

// ........... ২. কন্ডিশনাল লজিক (প্রতিষ্ঠান ও বোর্ড) ...........
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

// ........... ৩. ক্যালকুলেশন ইঞ্জিন (টাকা হিসাব) ...........
function calc() {
  let subtotal = 0;
  // চেক করা প্যাকেজের দাম যোগ করা
  document.querySelectorAll(".pkg-cb:checked").forEach((cb) => {
    subtotal += parseInt(cb.getAttribute("data-p")) || 0;
  });

  let dur = parseInt(document.getElementById("duration").value) || 1;
  let rawTotal = subtotal * dur;

  // ছাড় লজিক (৬ মাস = ১০%, ১২ মাস = ২০%)
  let discount = 0;
  if (dur === 6) discount = rawTotal * 0.1;
  else if (dur === 12) discount = rawTotal * 0.2;

  let finalAmount = rawTotal - discount;

  // স্ক্রিনে আপডেট (সফটনেস বজায় রেখে)
  document.getElementById("s-total").innerText = "৳" + Math.round(rawTotal);
  document.getElementById("s-final").innerText = "৳" + Math.round(finalAmount);
}

// চেকবক্স চেঞ্জ হলে সাথে সাথে টাকা বদলাবে
document.querySelectorAll(".pkg-cb").forEach((cb) => {
  cb.addEventListener("change", calc);
});

// ........... ৪. সাবমিট ও ভাউচার স্লিপ জেনারেশন ...........
const form = document.getElementById("smartRegForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const btn = document.getElementById("pay-btn");
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> প্রসেসিং...';
  btn.disabled = true;

  // ২ সেকেন্ডের কৃত্রিম লোডিং (প্রিমিয়াম ফিলের জন্য)
  setTimeout(() => {
    const name = document.getElementById("full_name").value;
    const phone = document.getElementById("phone").value;
    const finalAmount = document.getElementById("s-final").innerText;
    const methodEl = document.querySelector('input[name="pay_method"]:checked');
    const method = methodEl ? methodEl.value : "বিকাশ";
    const duration = document.getElementById("duration").value;

    // আইটেম টেবিল ডাটা তৈরি
    let pkgRows = "";
    document.querySelectorAll(".pkg-cb:checked").forEach((cb) => {
      pkgRows += `<tr><td>${cb.dataset.n}</td><td>১টি</td><td>৳${cb.dataset.p}</td></tr>`;
    });

    const today = new Date().toLocaleDateString("bn-BD");
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + parseInt(duration));
    const formattedExpiry = expiry.toLocaleDateString("bn-BD");

    // ভাউচার ডাটা ইনজেকশন
    document.getElementById("v-data").innerHTML = `
      <div class="v-header-top">
        <h2>স্মার্ট শিক্ষা বাতায়ন</h2>
        <p>অফিসিয়াল ডিজিটাল মানি রিসিট</p>
      </div>
      <div class="v-body">
        <div class="v-info-grid">
          <div class="v-info-box">
            <h4>বিলিং তথ্য:</h4>
            <p>${name}</p>
            <p>${phone}</p>
          </div>
          <div class="v-info-box">
            <h4>পেমেন্ট বিবরণ:</h4>
            <p>তারিখ: ${today}</p>
            <p>পদ্ধতি: <span style="text-transform:uppercase">${method}</span></p>
          </div>
        </div>
        <table class="v-table">
          <thead><tr><th>বিবরণ</th><th>পরিমাণ</th><th>মূল্য</th></tr></thead>
          <tbody>${pkgRows}</tbody>
        </table>
        <div class="v-total-row">
          <div style="text-align:right">
            <span style="font-size:13px; color:#94a3b8; display:block">সর্বমোট পরিশোধিত (মেয়াদ ${duration} মাস)</span>
            <span class="v-total-amount">${finalAmount}</span>
          </div>
        </div>
        <div style="margin-top:20px; text-align:left;">
            <p style="margin:0; font-size:13px; color:#94a3b8">সাবস্ক্রিপশন মেয়াদ:</p>
            <p style="margin:5px 0; color:var(--primary); font-weight:800;">${formattedExpiry} তারিখ পর্যন্ত</p>
            <small style="opacity:0.4">TRX ID: SMART${Date.now()}</small>
        </div>
      </div>
    `;

    document.getElementById("voucher").classList.remove("hidden");
    btn.innerHTML = "সম্পন্ন হয়েছে ✅";
    btn.disabled = false;
  }, 2000);
});
