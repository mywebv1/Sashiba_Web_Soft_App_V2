import type { Student, Subject } from '../types';

function autoRating(monthlyAvg: number): number {
  if (monthlyAvg >= 96) return 5;
  if (monthlyAvg >= 86) return 4;
  if (monthlyAvg >= 76) return 3;
  if (monthlyAvg >= 66) return 2;
  return 1;
}

function statusText(s: string): string {
  return s === 'P' ? 'Present' : s === 'A' ? 'Absent' : s === 'L' ? 'Late' : 'Leave';
}

function statusColor(s: string): string {
  return s === 'P' ? '#166534;background:#dcfce7' :
         s === 'A' ? '#991b1b;background:#fee2e2' :
         s === 'L' ? '#92400e;background:#fef3c7' :
                    '#1e40af;background:#dbeafe';
}

const BASE_STYLES = `
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Segoe UI',system-ui,Arial,sans-serif;color:#0f172a;background:#fff;}
  @page{size:A4;margin:18mm 14mm;}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
`;

export function printStudentReport(
  student: Student,
  subjects: Subject[],
  teacherName: string,
) {
  const rating = student.manualRating ?? autoRating(student.monthlyAvg);
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const attendance = subjects.map(sub => ({
    name: sub.name, code: sub.code,
    status: student.attendance[sub.id] ?? 'P',
  }));
  const presentCount = attendance.filter(a => a.status === 'P').length;
  const absentCount = attendance.filter(a => a.status === 'A').length;
  const lateCount   = attendance.filter(a => a.status === 'L').length;
  const leaveCount  = attendance.filter(a => a.status === 'Lv').length;
  const todayDate   = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Attendance Report — ${student.name}</title>
<style>
${BASE_STYLES}
.page{padding:32px 36px;}
.report-header{display:flex;align-items:center;gap:20px;border-bottom:3px solid #0f172a;padding-bottom:20px;margin-bottom:24px;}
.avatar{width:64px;height:64px;border-radius:50%;background:${student.avatarColor};display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:800;flex-shrink:0;}
.report-header h1{font-size:22px;font-weight:800;letter-spacing:-.3px;line-height:1.2;}
.report-header .sub{font-size:11px;color:#64748b;margin-top:4px;}
.avg-badge{margin-left:auto;text-align:center;}
.avg-num{font-size:32px;font-weight:900;color:${student.monthlyAvg >= 90 ? '#166534' : student.monthlyAvg >= 75 ? '#92400e' : '#991b1b'};}
.avg-lbl{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;}
.meta-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;}
.meta-card{border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;}
.meta-label{font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;font-weight:700;margin-bottom:4px;}
.meta-val{font-size:13px;font-weight:600;}
.section-hd{font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:#64748b;font-weight:700;margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid #e2e8f0;}
.summary-row{display:flex;gap:10px;margin-bottom:18px;}
.sum-card{flex:1;padding:10px;border-radius:8px;text-align:center;}
.sum-num{font-size:22px;font-weight:800;}
.sum-lbl{font-size:9px;text-transform:uppercase;letter-spacing:.05em;margin-top:2px;}
.sum-P{background:#f0fdf4;color:#166534;}
.sum-A{background:#fef2f2;color:#991b1b;}
.sum-L{background:#fffbeb;color:#92400e;}
.sum-Lv{background:#eff6ff;color:#1e40af;}
table{width:100%;border-collapse:collapse;margin-bottom:22px;font-size:11.5px;}
thead th{text-align:left;padding:7px 10px;font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:#64748b;border-bottom:2px solid #e2e8f0;font-weight:700;}
tbody td{padding:8px 10px;border-bottom:1px solid #f1f5f9;vertical-align:middle;}
tr:nth-child(even) td{background:#f8fafc;}
.badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10.5px;font-weight:700;color:${statusColor('P').split(';')[0]};}
.eval-row{display:flex;align-items:center;gap:20px;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;margin-bottom:22px;}
.stars{font-size:22px;color:#f59e0b;letter-spacing:3px;}
.rating-sub{font-size:10px;color:#94a3b8;margin-top:3px;}
.comment-box{flex:1;font-size:12px;color:#475569;font-style:italic;padding:8px 12px;background:#f8fafc;border-radius:6px;}
.sigs{display:flex;justify-content:space-around;margin-top:48px;padding-top:16px;border-top:1px solid #cbd5e1;}
.sig{text-align:center;}
.sig-line{width:140px;height:1px;background:#0f172a;margin:0 auto 7px;}
.sig-name{font-size:11px;color:#64748b;}
.footer-note{font-size:10px;color:#94a3b8;margin-bottom:24px;}
</style>
</head>
<body>
<div class="page">
  <div class="report-header">
    <div class="avatar">${student.initials}</div>
    <div>
      <h1>${student.name}</h1>
      <div class="sub">Individual Attendance &amp; Performance Report &nbsp;·&nbsp; Class ${student.classSection}</div>
    </div>
    <div class="avg-badge">
      <div class="avg-num">${student.monthlyAvg}%</div>
      <div class="avg-lbl">Monthly Avg</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-card"><div class="meta-label">Roll Number</div><div class="meta-val">#${student.rollNo}</div></div>
    <div class="meta-card"><div class="meta-label">Guardian</div><div class="meta-val">${student.guardian.name}</div></div>
    <div class="meta-card"><div class="meta-label">Relation</div><div class="meta-val">${student.guardian.relation}</div></div>
    <div class="meta-card"><div class="meta-label">Contact</div><div class="meta-val" style="font-size:11px;">${student.guardian.phone}</div></div>
  </div>

  <div class="section-hd">Subject-wise Attendance</div>
  <div class="summary-row">
    <div class="sum-card sum-P"><div class="sum-num">${presentCount}</div><div class="sum-lbl">Present</div></div>
    <div class="sum-card sum-A"><div class="sum-num">${absentCount}</div><div class="sum-lbl">Absent</div></div>
    <div class="sum-card sum-L"><div class="sum-num">${lateCount}</div><div class="sum-lbl">Late</div></div>
    <div class="sum-card sum-Lv"><div class="sum-num">${leaveCount}</div><div class="sum-lbl">Leave</div></div>
  </div>

  <table>
    <thead>
      <tr><th>Subject</th><th>Code</th><th>Status</th></tr>
    </thead>
    <tbody>
      ${attendance.map(a => `
      <tr>
        <td>${a.name}</td>
        <td style="font-family:monospace">${a.code}</td>
        <td><span class="badge" style="color:${statusColor(a.status).split(';')[0]};background:${statusColor(a.status).split(';')[1].replace('background:','')}">${statusText(a.status)}</span></td>
      </tr>`).join('')}
    </tbody>
  </table>

  <div class="section-hd">Evaluation</div>
  <div class="eval-row">
    <div>
      <div class="stars">${stars}</div>
      <div class="rating-sub">Teacher Rating: ${rating}/5</div>
    </div>
    ${student.comment ? `<div class="comment-box">"${student.comment}"</div>` : ''}
  </div>

  <div class="section-hd">Report Details</div>
  <div class="footer-note">
    Prepared by: <strong>${teacherName}</strong> &nbsp;·&nbsp;
    Generated: <strong>${todayDate}</strong> &nbsp;·&nbsp;
    Last Updated: <strong>${student.lastUpdated}</strong>
  </div>

  <div class="sigs">
    <div class="sig"><div class="sig-line"></div><div class="sig-name">Class Teacher</div></div>
    <div class="sig"><div class="sig-line"></div><div class="sig-name">Headmaster / Principal</div></div>
    <div class="sig"><div class="sig-line"></div><div class="sig-name">Parent / Guardian</div></div>
  </div>
</div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=820,height=960,scrollbars=yes');
  if (!win) { alert('Please allow pop-ups to print the report.'); return; }
  win.document.write(html);
  win.document.close();
  win.addEventListener('load', () => setTimeout(() => win.print(), 300));
}

export function printClassRegister(
  students: Student[],
  subjects: Subject[],
  schoolName: string,
  classSection: string,
  date: string,
  teacherName: string,
) {
  const todayDate = new Date(date || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const subjectCols = subjects.map(s => `<th>${s.code}</th>`).join('');

  const studentRows = students.map((st, idx) => {
    const statusCells = subjects.map(sub => {
      const s = st.attendance[sub.id] ?? 'P';
      const bg = s === 'P' ? '#f0fdf4' : s === 'A' ? '#fef2f2' : s === 'L' ? '#fffbeb' : '#eff6ff';
      const col = s === 'P' ? '#166534' : s === 'A' ? '#991b1b' : s === 'L' ? '#92400e' : '#1e40af';
      return `<td style="text-align:center;background:${bg};color:${col};font-weight:700;font-size:9px;">${s}</td>`;
    }).join('');
    const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    const allPresent = subjects.every(sub => (st.attendance[sub.id] ?? 'P') === 'P');
    const hasAbsent  = subjects.some(sub => (st.attendance[sub.id] ?? 'P') === 'A');
    const statusBg   = allPresent ? '#f0fdf4' : hasAbsent ? '#fef2f2' : '#fffbeb';
    const statusCol  = allPresent ? '#166534' : hasAbsent ? '#991b1b' : '#92400e';
    const statusLbl  = allPresent ? 'Present' : hasAbsent ? 'Absent' : 'Late/Leave';
    return `<tr style="background:${rowBg};">
      <td style="text-align:center;font-family:monospace;font-weight:700;">${st.rollNo}</td>
      <td style="font-weight:600;">${st.name}</td>
      <td style="text-align:center;">${st.classSection}</td>
      ${statusCells}
      <td style="text-align:center;font-family:monospace;font-weight:700;color:${st.monthlyAvg >= 90 ? '#166534' : st.monthlyAvg >= 75 ? '#92400e' : '#991b1b'}">${st.monthlyAvg}%</td>
      <td style="text-align:center;background:${statusBg};color:${statusCol};font-size:9px;font-weight:700;">${statusLbl}</td>
    </tr>`;
  }).join('');

  const presentTotal  = students.filter(s => subjects.every(sub => (s.attendance[sub.id] ?? 'P') === 'P')).length;
  const absentTotal   = students.filter(s => subjects.some(sub => (s.attendance[sub.id] ?? 'P') === 'A')).length;
  const lateTotal     = students.length - presentTotal - absentTotal;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Attendance Register — ${classSection}</title>
<style>
${BASE_STYLES}
body{font-size:10px;}
.page{padding:20px 24px;}
.inst-header{text-align:center;border-bottom:3px double #0f172a;padding-bottom:14px;margin-bottom:16px;}
.inst-name{font-size:18px;font-weight:900;letter-spacing:-.3px;text-transform:uppercase;}
.inst-sub{font-size:10px;color:#475569;margin-top:3px;}
.register-meta{display:flex;justify-content:space-between;align-items:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:8px 14px;margin-bottom:14px;font-size:10px;}
.meta-item{display:flex;gap:6px;}
.meta-item strong{color:#0f172a;}
.summary-chips{display:flex;gap:8px;margin-bottom:14px;}
.chip{padding:5px 12px;border-radius:5px;font-size:10px;font-weight:700;}
.chip-P{background:#dcfce7;color:#166534;}
.chip-A{background:#fee2e2;color:#991b1b;}
.chip-L{background:#fef3c7;color:#92400e;}
table{width:100%;border-collapse:collapse;font-size:9.5px;}
thead th{padding:6px 7px;background:#0f172a;color:#fff;text-align:left;font-weight:700;font-size:9px;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;}
thead th:not(:first-child):not(:nth-child(2)):not(:nth-child(3)){text-align:center;}
tbody td{padding:5px 7px;border-bottom:1px solid #e2e8f0;vertical-align:middle;}
tfoot td{padding:6px 7px;background:#f1f5f9;font-weight:700;font-size:9px;border-top:2px solid #0f172a;}
.sigs{display:flex;justify-content:space-around;margin-top:40px;padding-top:14px;border-top:1px solid #cbd5e1;}
.sig{text-align:center;}
.sig-line{width:140px;height:1px;background:#0f172a;margin:0 auto 6px;}
.sig-name{font-size:9.5px;color:#64748b;}
.footer{text-align:center;font-size:8.5px;color:#94a3b8;margin-top:16px;}
@media print{.no-print{display:none;}}
</style>
</head>
<body>
<div class="page">
  <div class="inst-header">
    <div class="inst-name">${schoolName}</div>
    <div class="inst-sub">Official Attendance Register &nbsp;·&nbsp; ${todayDate}</div>
  </div>

  <div class="register-meta">
    <div class="meta-item">Class / Section: <strong>${classSection}</strong></div>
    <div class="meta-item">Total Students: <strong>${students.length}</strong></div>
    <div class="meta-item">Subjects: <strong>${subjects.length}</strong></div>
    <div class="meta-item">Class Teacher: <strong>${teacherName}</strong></div>
  </div>

  <div class="summary-chips">
    <div class="chip chip-P">✓ Present: ${presentTotal} students</div>
    <div class="chip chip-A">✗ Absent: ${absentTotal} students</div>
    <div class="chip chip-L">~ Late/Leave: ${lateTotal} students</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Roll</th>
        <th>Student Name</th>
        <th>Section</th>
        ${subjectCols}
        <th>Avg %</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${studentRows}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3">Total: ${students.length} students</td>
        ${subjects.map(sub => {
          const p = students.filter(s => (s.attendance[sub.id] ?? 'P') === 'P').length;
          return `<td style="text-align:center">P:${p}</td>`;
        }).join('')}
        <td></td>
        <td style="text-align:center">P:${presentTotal} A:${absentTotal}</td>
      </tr>
    </tfoot>
  </table>

  <div class="sigs">
    <div class="sig"><div class="sig-line"></div><div class="sig-name">Class Teacher</div></div>
    <div class="sig"><div class="sig-line"></div><div class="sig-name">Headmaster / Principal</div></div>
    <div class="sig"><div class="sig-line"></div><div class="sig-name">Academic In-Charge</div></div>
  </div>

  <div class="footer">
    Generated by Sashiba Academic OS &nbsp;·&nbsp; ${teacherName} &nbsp;·&nbsp; ${todayDate}
  </div>
</div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=1100,height=900,scrollbars=yes');
  if (!win) { alert('Please allow pop-ups to print the register.'); return; }
  win.document.write(html);
  win.document.close();
  win.addEventListener('load', () => setTimeout(() => win.print(), 400));
}
