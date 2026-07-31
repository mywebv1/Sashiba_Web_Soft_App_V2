// ১. কন্ডিশনাল লজিক: অ্যাকাউন্ট টাইপ ও বোর্ড
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

// ২. নেভিগেশন ও প্রগ্রেস বার
function next(s) {
  document
    .querySelectorAll(".step")
    .forEach((step) => step.classList.remove("active"));
  document.getElementById("step" + s).classList.add("active");
  document.getElementById("p-bar").style.width =
    (s === 1 ? 33 : s === 2 ? 66 : 100) + "%";
  if (s === 2) calc();
}

// ৩. অটো-ক্যালকুলেশন ইঞ্জিন (৫% ও ২০% ছাড়)
function calc() {
  let sub = 0;
  document
    .querySelectorAll(".pkg-cb:checked")
    .forEach((cb) => (sub += parseInt(cb.dataset.p)));

  let duration = parseInt(document.getElementById("duration").value);
  let rawTotal = sub * duration;
  let discount = 0;

  if (duration === 6) discount = rawTotal * 0.05;
  if (duration === 12) discount = rawTotal * 0.2;

  let final = rawTotal - discount;

  document.getElementById("s-total").innerText = "৳" + rawTotal;
  document.getElementById("s-disc").innerText = "৳" + Math.round(discount);
  document.getElementById("s-final").innerText = "৳" + Math.round(final);
}

// প্যাকেজ সিলেক্ট করলে ক্যালকুলেট হবে
document
  .querySelectorAll(".pkg-cb")
  .forEach((cb) => cb.addEventListener("change", calc));

// ৪. রেজিস্ট্রেশন সম্পন্ন ও ভাউচার জেনারেশন
document.getElementById("smartRegForm").onsubmit = function (e) {
  e.preventDefault();

  const name = document.getElementById("full_name").value;
  const phone = document.getElementById("phone").value;
  const amount = document.getElementById("s-final").innerText;
  const duration = document.getElementById("duration").value;

  let pkgs = [];
  document
    .querySelectorAll(".pkg-cb:checked")
    .forEach((cb) => pkgs.push(cb.dataset.n));

  // মেয়াদ ক্যালকুলেশন
  const today = new Date();
  today.setMonth(today.getMonth() + parseInt(duration));
  const expiry = today.toLocaleDateString("bn-BD");

  const vData = `
        <p>নাম: <strong>${name}</strong></p>
        <p>ফোন: <strong>${phone}</strong></p>
        <hr>
        <p>প্যাকেজ: <strong>${pkgs.join(", ")}</strong></p>
        <p>মেয়াদ: <strong>${duration} মাস</strong></p>
        <p>পরিশোধ: <strong>${amount}</strong></p>
        <p style="color:var(--primary)">মেয়াদ শেষ হবে: <strong>${expiry}</strong></p>
    `;

  document.getElementById("v-data").innerHTML = vData;
  document.getElementById("voucher").classList.remove("hidden");
};
