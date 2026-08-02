const { useState, useEffect } = React;

const App = () => {
  const [view, setView] = useState("routine"); // routine, dashboard, settings
  const [theme, setTheme] = useState("dark");
  const [modal, setModal] = useState({ open: false, type: "", data: null });

  // পিডিএফ অনুযায়ী ডাইনামিক ডেটা
  const [data, setData] = useState([
    {
      id: 1,
      date: "2026-02-03",
      day: "Tuesday",
      class: "Class XI",
      code: "PHY-401",
      subject: "Physics",
      type: "Mid-Term",
      session: "2025-26",
      shift: "Morning",
      room: "Hall A-R101",
      teacher: "Dr. Rahul Sharma",
      start: "09:00",
      end: "11:00",
      note: "Lab practical Day 2",
      marks: "33/100",
      status: "eligible",
    },
    {
      id: 2,
      date: "2026-02-05",
      day: "Thursday",
      class: "Class XI",
      code: "CHM-402",
      subject: "Chemistry",
      type: "Mid-Term",
      session: "2025-26",
      shift: "Morning",
      room: "Hall A-R102",
      teacher: "Prof. Meena Joshi",
      start: "09:00",
      end: "11:00",
      note: "Titration included",
      marks: "33/100",
      status: "ineligible",
      reason: "Low Attendance",
    },
  ]);

  const openModal = (type, item) => setModal({ open: true, type, data: item });
  const closeModal = () => setModal({ open: false, type: "", data: null });

  return (
    <div className="flex h-screen overflow-hidden text-slate-200">
      {/* সাইডবার - পিডিএফ অনুযায়ী */}
      <aside className="w-64 glass m-4 rounded-2xl p-4 flex flex-col no-print">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20 text-white">
            AC
          </div>
          <div>
            <h1 className="font-black text-lg leading-tight tracking-tight">
              AcadPlan Pro
            </h1>
            <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">
              Academic Planner
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setView("dashboard")}
            className={`nav-btn w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === "dashboard" ? "active" : "hover:bg-white/5 text-slate-400"}`}
          >
            <i className="fa-solid fa-grid-2 w-5 text-sm"></i>{" "}
            <span className="font-semibold text-sm">Dashboard</span>
          </button>
          <button
            onClick={() => setView("routine")}
            className={`nav-btn w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === "routine" ? "active" : "hover:bg-white/5 text-slate-400"}`}
          >
            <i className="fa-solid fa-calendar-day w-5 text-sm"></i>{" "}
            <span className="font-semibold text-sm">Class Routine</span>
          </button>
          <button
            onClick={() => setView("settings")}
            className={`nav-btn w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === "settings" ? "active" : "hover:bg-white/5 text-slate-400"}`}
          >
            <i className="fa-solid fa-gears w-5 text-sm"></i>{" "}
            <span className="font-semibold text-sm">System Settings</span>
          </button>
        </nav>

        <button
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          className="p-3 glass rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-white/10 transition-all"
        >
          {theme === "dark" ? (
            <>
              <i className="fa-solid fa-sun text-yellow-400"></i> Light Mode
            </>
          ) : (
            <>
              <i className="fa-solid fa-moon text-indigo-400"></i> Dark Mode
            </>
          )}
        </button>
      </aside>

      {/* মেইন এরিয়া */}
      <main className="flex-1 flex flex-col p-4 pr-8 overflow-hidden">
        {/* টপবার ড্রপডাউন মেনুসমূহ */}
        <header className="flex justify-between items-center mb-6 no-print">
          <div className="flex gap-3">
            <Dropdown
              label="Class Schedule"
              items={["Daily", "Weekly", "Monthly", "Yearly"]}
            />
            <Dropdown label="Monthly Exam" items={["Final Exam", "Mid Term"]} />
            <Dropdown
              label="Both Shifts"
              items={["Morning Shift", "Evening Shift"]}
            />
            <Dropdown
              label="All Classes"
              items={["Class I", "Class X", "Class XII"]}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => openModal("form", null)}
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-full text-xs font-bold text-white shadow-xl shadow-indigo-500/20 transition-all"
            >
              Form Fill-Up
            </button>
            <button
              onClick={() => window.print()}
              className="glass px-5 py-2 rounded-full text-xs font-bold border-indigo-500/30 text-indigo-300"
            >
              Print A4
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scroll">
          {/* ৬টি KPI কার্ড - পিডিএফ অনুযায়ী */}
          <div className="grid grid-cols-6 gap-4 mb-8 no-print">
            <KPICard
              icon="fa-users"
              label="Total Students"
              val="15"
              color="indigo"
            />
            <KPICard icon="fa-user-xmark" label="Dropout" val="2" color="red" />
            <KPICard
              icon="fa-circle-check"
              label="Eligible"
              val="11"
              color="emerald"
            />
            <KPICard
              icon="fa-triangle-exclamation"
              label="Ineligible"
              val="4"
              color="orange"
            />
            <KPICard
              icon="fa-file-signature"
              label="Form Completed"
              val="6"
              color="purple"
            />
            <KPICard
              icon="fa-clock-rotate-left"
              label="Pending"
              val="5"
              color="cyan"
            />
          </div>

          {/* ১৪ কলামের রুটিন টেবিল */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5 flex justify-between items-center no-print">
              <h2 className="font-bold text-lg tracking-tight">
                Academic Schedule{" "}
                <span className="text-xs font-normal opacity-50 ml-2">
                  Session 2025-26
                </span>
              </h2>
              <button className="bg-white/5 border border-white/10 hover:bg-indigo-600 px-4 py-2 rounded-lg text-xs font-bold transition-all">
                + Add New Schedule
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="routine-table text-left px-4">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Class</th>
                    <th>Code</th>
                    <th>Subject</th>
                    <th>Exam</th>
                    <th>Session</th>
                    <th>Shift</th>
                    <th>Room</th>
                    <th>Teacher</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Note</th>
                    <th>Pass/Total</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-white/[0.02] transition-colors relative"
                    >
                      <td className="font-mono text-[11px] opacity-60 px-4">
                        {item.date}
                      </td>
                      <td className="font-semibold">{item.day}</td>
                      <td>
                        <span className="px-2 py-0.5 bg-slate-700 rounded text-[10px]">
                          {item.class}
                        </span>
                      </td>
                      <td
                        className="text-indigo-400 font-black cursor-pointer underline underline-offset-4"
                        onClick={() => openModal("syllabus", item)}
                      >
                        {item.code}
                      </td>
                      <td className="font-bold">{item.subject}</td>
                      <td className="text-[10px] font-black uppercase text-indigo-300">
                        {item.type}
                      </td>
                      <td className="opacity-60">{item.session}</td>
                      <td>
                        <span className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          {item.shift}
                        </span>
                      </td>
                      <td>{item.room}</td>
                      <td>{item.teacher}</td>
                      <td className="font-mono">{item.start}</td>
                      <td className="font-mono">{item.end}</td>
                      <td className="italic text-xs opacity-50 truncate max-w-[100px]">
                        {item.note}
                      </td>
                      <td className="font-bold text-emerald-400">
                        {item.marks}
                      </td>
                      <td className="text-right px-4">
                        <div className="flex gap-1 justify-end no-print">
                          <button
                            onClick={() => openModal("details", item)}
                            className="w-7 h-7 glass rounded flex items-center justify-center hover:text-indigo-400"
                          >
                            <i className="fa-solid fa-eye text-[10px]"></i>
                          </button>
                          <button
                            onClick={() => openModal("edit", item)}
                            className="w-7 h-7 glass rounded flex items-center justify-center hover:text-indigo-400"
                          >
                            <i className="fa-solid fa-pen text-[10px]"></i>
                          </button>
                          <button
                            onClick={() => openModal("print_single", item)}
                            className="w-7 h-7 glass rounded flex items-center justify-center hover:text-indigo-400"
                          >
                            <i className="fa-solid fa-print text-[10px]"></i>
                          </button>
                          <button
                            onClick={() => openModal("delete", item)}
                            className="w-7 h-7 glass rounded flex items-center justify-center hover:text-red-400"
                          >
                            <i className="fa-solid fa-trash text-[10px]"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* অ্যাকশনেবল পপ-আপ মডাল */}
      {modal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass w-full max-w-xl p-8 rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-slate-500 hover:text-white text-2xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              {modal.type === "details" && "📌 Schedule Details"}
              {modal.type === "edit" && "✏️ Edit Schedule"}
              {modal.type === "delete" && "⚠️ Danger Zone"}
              {modal.type === "syllabus" && "📚 Subject Syllabus"}
            </h2>

            <div className="space-y-4">
              {modal.type === "details" && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(modal.data).map(([k, v]) => (
                    <div
                      key={k}
                      className="p-3 bg-white/5 rounded-xl border border-white/5"
                    >
                      <p className="text-[9px] uppercase font-bold text-indigo-400 mb-1">
                        {k}
                      </p>
                      <p className="text-sm font-medium">{v}</p>
                    </div>
                  ))}
                </div>
              )}

              {modal.type === "edit" && (
                <div className="space-y-4">
                  <input
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
                    defaultValue={modal.data.subject}
                    placeholder="Subject Name"
                  />
                  <input
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
                    defaultValue={modal.data.teacher}
                    placeholder="Teacher Name"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 p-4 glass rounded-2xl font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 p-4 bg-indigo-600 rounded-2xl font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {modal.type === "delete" && (
                <div className="text-center">
                  <p className="text-lg mb-6">
                    Are you sure you want to delete <b>{modal.data.subject}</b>?
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 p-4 glass rounded-2xl font-bold"
                    >
                      Keep it
                    </button>
                    <button
                      onClick={() => {
                        setData(data.filter((i) => i.id !== modal.data.id));
                        closeModal();
                      }}
                      className="flex-1 p-4 bg-red-600 rounded-2xl font-bold"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// সাব-কম্পোনেন্টস
function Dropdown({ label, items }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:border-indigo-500/50 transition-all"
      >
        {label}{" "}
        <i
          className={`fa-solid fa-chevron-down text-[9px] opacity-40 transition-transform ${isOpen ? "rotate-180" : ""}`}
        ></i>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 glass rounded-xl shadow-2xl py-2 z-[90] animate-in fade-in slide-in-from-top-2">
          {items.map((i) => (
            <div
              key={i}
              className="px-4 py-2 hover:bg-indigo-600 text-xs cursor-pointer"
            >
              {i}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function KPICard({ icon, label, val, color }) {
  return (
    <div className="glass p-4 rounded-2xl border-t-2 border-t-transparent hover:border-t-indigo-500 transition-all group">
      <div
        className={`w-8 h-8 rounded-lg bg-${color}-500/10 text-${color}-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
      >
        <i className={`fa-solid ${icon} text-sm`}></i>
      </div>
      <div className="text-2xl font-black tracking-tighter">{val}</div>
      <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
        {label}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
