function toggleInstFields() {
  const type = document.getElementById("acc_type").value;
  const instArea = document.getElementById("inst-area");
  if (type === "প্রতিষ্ঠান") instArea.classList.remove("hidden");
  else instArea.classList.add("hidden");
}

function next(s) {
  document
    .querySelectorAll(".step")
    .forEach((step) => step.classList.remove("active"));
  document.getElementById("step" + s).classList.add("active");
  document.getElementById("p-bar").style.width =
    (s === 1 ? 33 : s === 2 ? 66 : 100) + "%";
  if (s === 2) calc();
}

function calc() {
  let sub = 0;
  document
    .querySelectorAll(".pkg-cb:checked")
    .forEach((cb) => (sub += parseInt(cb.dataset.p)));
  document.getElementById("s-final").innerText = "৳" + sub;
}

// সাবমিট লজিক
document.getElementById("smartRegForm").onsubmit = function (e) {
  e.preventDefault();

  const name = document.getElementById("full_name").value;
  const phone = document.getElementById("phone").value;
  const total = document.getElementById("s-final").innerText;

  let pkgs = [];
  document
    .querySelectorAll(".pkg-cb:checked")
    .forEach((cb) => pkgs.push(cb.dataset.n));

  const dataHTML = `
    <p>নাম: <strong>${name}</strong></p>
    <p>ফোন: <strong>${phone}</strong></p>
    <p>প্যাকেজসমূহ: <strong>${pkgs.join(", ") || "নাই"}</strong></p>
    <div style="border-top:1px dashed #ccc; margin:10px 0; padding-top:10px;">
        <p>পরিশোধিত মোট বিল: <strong style="color:#2563eb; font-size:18px">${total}</strong></p>
    </div>
    <p style="text-align:center; color:#10b981; font-weight:bold;">ধন্যবাদ! আপনার রেজিস্ট্রেশন সফল হয়েছে।</p>
  `;

  document.getElementById("v-data").innerHTML = dataHTML;
  document.getElementById("voucher").classList.remove("hidden");
};
