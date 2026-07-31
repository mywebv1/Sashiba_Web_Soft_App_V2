// ........... প্রতিষ্ঠানের তথ্য ও বোর্ড লজিক শুরু ...........
function toggleInstFields() {
  const type = document.getElementById("acc_type").value;
  const instArea = document.getElementById("inst-area");
  if (type === "প্রতিষ্ঠান") instArea.classList.remove("hidden");
  else instArea.classList.add("hidden");
}

function toggleNctb() {
  const board = document.getElementById("board").value;
  const nctbBox = document.getElementById("nctb-box");
  if (board === "nctb") nctbBox.classList.remove("hidden");
  else nctbBox.classList.add("hidden");
}
// ........... প্রতিষ্ঠানের তথ্য ও বোর্ড লজিক শেষ ...........

// ........... নেভিগেশন ও প্রগ্রেস বার শুরু ...........
function next(s) {
  document
    .querySelectorAll(".step")
    .forEach((step) => step.classList.remove("active"));
  document.getElementById("step" + s).classList.add("active");
  document.getElementById("p-bar").style.width =
    (s === 1 ? 33 : s === 2 ? 66 : 100) + "%";
  if (s === 2) calc();
}
// ........... নেভিগেশন ও প্রগ্রেস বার শেষ ...........

// ........... অটো-ক্যালকুলেশন ইঞ্জিন শুরু ...........
function calc() {
  let subtotal = 0;
  // সব চেক করা প্যাকেজের দাম যোগ করা
  document.querySelectorAll(".pkg-cb:checked").forEach((cb) => {
    subtotal += parseInt(cb.dataset.p);
  });

  let duration = parseInt(document.getElementById("duration").value);
  let rawTotal = subtotal * duration;
  let discount = 0;

  // ছাড়ের লজিক: ৬ মাসে ১০%, ১ বছরে ২০%
  if (duration === 6) {
    discount = rawTotal * 0.1;
  } else if (duration === 12) {
    discount = rawTotal * 0.2;
  }

  let final = rawTotal - discount;

  // ডিসপ্লে আপডেট
  document.getElementById("s-total").innerText = "৳" + rawTotal;
  document.getElementById("s-disc").innerText = "৳" + Math.round(discount);
  document.getElementById("s-final").innerText = "৳" + Math.round(final);
}

// চেকবক্স পরিবর্তনের সাথে সাথে ক্যালকুলেশন
document.querySelectorAll(".pkg-cb").forEach((cb) => {
  cb.addEventListener("change", calc);
});
// ........... অটো-ক্যালকুলেশন ইঞ্জিন শেষ ...........

// ........... রেজিস্ট্রেশন সম্পন্ন ও পেমেন্ট সিমুলেশন শুরু ...........
document.getElementById("smartRegForm").onsubmit = function (e) {
  e.preventDefault();

  const payBtn = document.getElementById("pay-btn");
  const method = document.querySelector(
    'input[name="pay_method"]:checked',
  ).value;
  const amount = document.getElementById("s-final").innerText;

  // পেমেন্ট প্রসেসিং লোডিং
  payBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> পেমেন্ট প্রসেসিং...`;
  payBtn.disabled = true;

  setTimeout(() => {
    const name = document.getElementById("full_name").value;
    const phone = document.getElementById("phone").value;
    const duration = document.getElementById("duration").value;

    let pkgs = [];
    document
      .querySelectorAll(".pkg-cb:checked")
      .forEach((cb) => pkgs.push(cb.dataset.n));

    // মেয়াদ শেষ হওয়ার তারিখ হিসাব
    const today = new Date();
    today.setMonth(today.getMonth() + parseInt(duration));
    const expiry = today.toLocaleDateString("bn-BD");

    const vData = `
        <p>নাম: <strong>${name}</strong></p>
        <p>ফোন: <strong>${phone}</strong></p>
        <p>পেমেন্ট মেথড: <strong style="text-transform:uppercase; color:var(--primary)">${method}</strong></p>
        <hr>
        <p>প্যাকেজ: <strong>${pkgs.join(", ")}</strong></p>
        <p>মেয়াদ: <strong>${duration} মাস</strong></p>
        <p>পরিশোধিত: <strong style="color:green">${amount} (সফল)</strong></p>
        <p style="color:var(--primary)">মেয়াদ শেষ হবে: <strong>${expiry}</strong></p>
        <div style="text-align:center; margin-top:10px;">
            <small>ট্রানজেকশন আইডি: TRX${Math.floor(Math.random() * 10000000)}</small>
        </div>
    `;

    document.getElementById("v-data").innerHTML = vData;
    document.getElementById("voucher").classList.remove("hidden");

    payBtn.innerHTML = `সফল হয়েছে <i class="fas fa-check-double"></i>`;
    payBtn.disabled = false;
  }, 2000);
};
// ........... পেমেন্ট সিমুলেশন শেষ ...........
