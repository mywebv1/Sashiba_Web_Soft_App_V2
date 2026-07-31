// ১. নেভিগেশন ও প্রগ্রেস বার
function next(s) {
  document
    .querySelectorAll(".step")
    .forEach((step) => step.classList.remove("active"));
  document.getElementById("step" + s).classList.add("active");

  // প্রগ্রেস বার কন্ট্রোল
  const progress = s === 1 ? 33 : s === 2 ? 66 : 100;
  document.getElementById("p-bar").style.width = progress + "%";

  // লেবেল হাইলাইট
  const labels = document.querySelectorAll(".progress-labels span");
  labels.forEach((l, idx) => {
    if (idx < s) l.classList.add("active");
    else l.classList.remove("active");
  });
}

// ২. কন্ডিশনাল ফিল্ডস
function toggleInstFields() {
  const type = document.getElementById("acc_type").value;
  const instArea = document.getElementById("inst-area");
  const pvInstArea = document.getElementById("pv-inst-section");

  if (type === "প্রতিষ্ঠান") {
    instArea.classList.remove("hidden-step");
    pvInstArea.classList.remove("hidden");
  } else {
    instArea.classList.add("hidden-step");
    pvInstArea.classList.add("hidden");
  }
}

function toggleNctb() {
  const board = document.getElementById("board").value;
  const nctbBox = document.getElementById("nctb-box");
  if (board === "NCTB") nctbBox.classList.remove("hidden-step");
  else nctbBox.classList.add("hidden-step");
}

// ৩. লাইভ প্রিভিউ ইঞ্জিন (সব তথ্য আপডেট)
function updateLivePreview() {
  // ব্যক্তিগত তথ্য
  document.getElementById("pv-name").innerText =
    document.getElementById("full_name").value || "---";
  document.getElementById("pv-phone").innerText =
    document.getElementById("phone").value || "---";
  document.getElementById("pv-email").innerText =
    document.getElementById("email").value || "---";
  document.getElementById("pv-type").innerText =
    document.getElementById("acc_type").value;
  document.getElementById("pv-ref").innerText =
    document.getElementById("ref").value || "---";

  // প্রতিষ্ঠানের তথ্য
  document.getElementById("pv-inst-name").innerText =
    document.getElementById("inst_name").value || "---";
  document.getElementById("pv-inst-addr").innerText =
    document.getElementById("inst_addr").value || "---";
  document.getElementById("pv-inst-code").innerText =
    document.getElementById("inst_code").value || "---";
  document.getElementById("pv-inst-year").innerText =
    document.getElementById("est_year").value || "---";
  document.getElementById("pv-board").innerText =
    document.getElementById("board").value || "---";
  document.getElementById("pv-region").innerText =
    document.getElementById("nctb_region").value || "---";
  document.getElementById("pv-level").innerText =
    document.getElementById("level").value || "---";
  document.getElementById("pv-head").innerText =
    document.getElementById("head_name").value || "---";

  // তারিখ
  const now = new Date();
  document.getElementById("pv-date").innerText =
    now.toLocaleDateString("bn-BD");
}

// ৪. ক্যালকুলেশন ও প্যাকেজ আপডেট
function calc() {
  let subPrice = 0;
  let pkgs = [];

  document.querySelectorAll(".pkg-cb:checked").forEach((cb) => {
    subPrice += parseInt(cb.dataset.p);
    pkgs.push(cb.dataset.n);
  });

  // প্যাকেজ লিস্ট প্রিভিউ
  const pkgContainer = document.getElementById("pv-pkgs");
  if (pkgs.length > 0) {
    pkgContainer.innerHTML = pkgs
      .map(
        (p) =>
          `<li><i class="fas fa-check-circle" style="color:var(--success); margin-right:5px"></i> ${p}</li>`,
      )
      .join("");
  } else {
    pkgContainer.innerHTML =
      '<li class="empty-msg">কোনো প্যাকেজ বাছাই করা হয়নি</li>';
  }

  let duration = parseInt(document.getElementById("duration").value);
  let rawTotal = subPrice * duration;
  let discount = 0;

  if (duration === 6) discount = rawTotal * 0.05;
  if (duration === 12) discount = rawTotal * 0.2;

  let final = rawTotal - discount;

  // ইনভয়েস প্রাইস আপডেট
  document.getElementById("pv-sub").innerText = "৳" + rawTotal;
  document.getElementById("pv-disc").innerText = "-৳" + Math.round(discount);
  document.getElementById("pv-total").innerText = "৳" + Math.round(final);

  // মেয়াদ উত্তীর্ণের তারিখ
  const expDate = new Date();
  expDate.setMonth(expDate.getMonth() + duration);
  document.getElementById("pv-expiry").innerText =
    expDate.toLocaleDateString("bn-BD");

  updateLivePreview();
}

// ৫. ফাইনাল সাবমিশন
document.getElementById("smartRegForm").onsubmit = function (e) {
  e.preventDefault();

  // ১. বাম পাশের ফর্ম এরিয়া ফেড আউট করা
  document.querySelector(".form-wrapper").style.opacity = "0.3";
  document.querySelector(".form-wrapper").style.pointerEvents = "none";

  // ২. ইনভয়েস স্ট্যাটাস পরিবর্তন
  const tag = document.getElementById("status-tag");
  tag.innerText = "পরিশোধিত";
  tag.style.background = "var(--success)";
  tag.style.color = "#fff";

  // ৩. সাকসেস মেসেজ ও ডাউনলোড বাটন দেখানো
  document.getElementById("success-header").classList.remove("hidden");
  document.getElementById("action-area").classList.remove("hidden");

  // অটো স্ক্রল টু টপ (প্রিভিউ সেকশন)
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ৬. PDF এক্সপোর্ট
function exportPDF() {
  const element = document.getElementById("invoice-content");
  const opt = {
    margin: 10,
    filename: "Smart_Shikhya_Invoice.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(opt).from(element).save();
}

// শুরুতে প্রিভিউ ক্লিন করার জন্য একবার কল করা
updateLivePreview();
