// ১. স্ট্যাট অবজেক্ট (Data Source)
const state = {
  u_name: "",
  phone: "",
  email: "",
  acc_type: "ব্যক্তিগত",
  inst_name: "",
  eiin: "",
  board: "",
  level: "",
  ref: "",
  pkgs: [],
  duration: 1,
  subTotal: 0,
  discount: 0,
  total: 0,
};

// ২. ইনপুট লিসেনার (জাভাস্ক্রিপ্ট দিয়ে সরাসরি ডাটা বাইন্ডিং)
document.getElementById("main-reg-form").addEventListener("input", (e) => {
  const { name, value, type, checked } = e.target;

  if (type === "checkbox") {
    const pkgName = e.target.dataset.name;
    const price = parseInt(value);
    if (checked) state.pkgs.push({ name: pkgName, price });
    else state.pkgs = state.pkgs.filter((p) => p.name !== pkgName);
  } else {
    state[name] = value;
  }

  if (name === "acc_type") toggleInstUI();
  calculatePrice();
  renderPreview();
});

// ৩. প্রতিষ্ঠান ফিল্ড টগল
function toggleInstUI() {
  const instFields = document.getElementById("inst-fields");
  const outInstBox = document.getElementById("out-inst-box");
  if (state.acc_type === "প্রতিষ্ঠান") {
    instFields.classList.remove("hidden");
    outInstBox.classList.remove("hidden");
  } else {
    instFields.classList.add("hidden");
    outInstBox.classList.add("hidden");
  }
}

// ৪. ক্যালকুলেশন ইঞ্জিন
function calculatePrice() {
  let pkgSum = state.pkgs.reduce((sum, p) => sum + p.price, 0);
  state.subTotal = pkgSum * parseInt(state.duration);

  state.discount = 0;
  if (state.duration == 6) state.discount = state.subTotal * 0.05;
  if (state.duration == 12) state.discount = state.subTotal * 0.2;

  state.total = state.subTotal - state.discount;
}

// ৫. লাইভ রেন্ডারিং (সব প্রিভিউ আপডেট করবে)
function renderPreview() {
  // টেক্সট ফিল্ডস
  document.getElementById("out-u-name").innerText = state.u_name || "---";
  document.getElementById("out-phone").innerText = state.phone || "---";
  document.getElementById("out-email").innerText = state.email || "---";
  document.getElementById("out-type").innerText = state.acc_type;
  document.getElementById("out-ref").innerText = state.ref || "---";
  document.getElementById("out-inst-name").innerText = state.inst_name || "---";
  document.getElementById("out-eiin").innerText = state.eiin || "---";
  document.getElementById("out-board").innerText = state.board || "---";
  document.getElementById("out-level").innerText = state.level || "---";

  // প্যাকেজ টেবিল রেন্ডার
  const tableBody = document.getElementById("out-items");
  if (state.pkgs.length > 0) {
    tableBody.innerHTML = state.pkgs
      .map(
        (p) =>
          `<tr><td>${p.name}</td><td class="text-right">৳${p.price}</td></tr>`,
      )
      .join("");
  } else {
    tableBody.innerHTML =
      '<tr><td colspan="2" class="empty">কোনো প্যাকেজ নেই</td></tr>';
  }

  // প্রাইস রেন্ডার
  document.getElementById("out-sub").innerText = "৳" + state.subTotal;
  document.getElementById("out-disc").innerText =
    "-৳" + Math.round(state.discount);
  document.getElementById("out-total").innerText =
    "৳" + Math.round(state.total);

  // ডেট ক্যালকুলেশন
  const now = new Date();
  document.getElementById("out-date").innerText =
    now.toLocaleDateString("bn-BD");
  now.setMonth(now.getMonth() + parseInt(state.duration));
  document.getElementById("out-expiry").innerText =
    now.toLocaleDateString("bn-BD");
}

// ৬. নেভিগেশন
function changeStep(s) {
  document
    .querySelectorAll(".form-view")
    .forEach((v) => v.classList.remove("active"));
  document.getElementById("view-" + s).classList.add("active");

  document.querySelectorAll(".step-node").forEach((node, idx) => {
    if (idx < s) node.classList.add("active");
    else node.classList.remove("active");
  });
}

// ৭. ফাইনাল সাবমিশন
document.getElementById("main-reg-form").onsubmit = (e) => {
  e.preventDefault();

  // ভিজ্যুয়াল চেঞ্জ
  document.getElementById("doc-status").innerText = "PAID";
  document.getElementById("doc-status").style.color = "#dcfce7";
  document.getElementById("v-status").innerText = "পরিশোধিত ভাউচার";
  document.getElementById("v-status").style.background = "#dcfce7";
  document.getElementById("v-status").style.color = "#15803d";

  document.getElementById("final-actions").classList.remove("hidden");
  document.querySelector(".control-panel").style.opacity = "0.4";
  document.querySelector(".control-panel").style.pointerEvents = "none";
};

// ৮. হাই-কোয়ালিটি PDF জেনারেটর
function generatePDF() {
  const element = document.getElementById("invoice-pdf");
  const opt = {
    margin: 5,
    filename: "Smart_Shikhya_Invoice.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 3 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(opt).from(element).save();
}
