Act as a Principal Product Designer specializing in Enterprise SaaS Applications. Design a high-fidelity, ultra-modern, minimalist, and dynamic "Syllabus & Roll Call Attendance Tracker Dashboard" for educational institutions. The UI must feel as polished and interactive as Linear, Notion, and Stripe, keeping teacher workflows fast, error-free, and clean.

==================================================
PHASE 1: GLOBAL DESIGN SYSTEM & COMPACT TOP BARS
==================================================
1. GLOBAL THEME & VISUAL STYLE:
   - Color Palette:
     * Dark Mode: Background #0F172A, Surface #1E293B, Glass Cards rgba(30,41,59,0.7)
     * Light Mode: Background #F8FAFC, Surface #FFFFFF
     * Accents: Soft Teal (#0D9488), Indigo (#6366F1), Emerald (#10B981), Amber (#F59E0B), Coral (#F43F5E)
   - Typography: Inter or Poppins. Crisp visual hierarchy, high legibility.
   - Aesthetic: 12-16px rounded corners, subtle glassmorphism, soft border glows, zero visual clutter.

2. TOP NAVIGATION BAR:
   - Left: System Logo + "Sashiba Academic OS" title.
   - Right: Interactive Notification Bell (with alert dropdown), Editable Teacher Profile ("Mr. Rafiq Uddin"), Light/Dark Mode Toggle, and a prominent "Save Changes" button with status indicator (Saved/Saving...).

3. SCHOOL INFORMATION BANNER CARD:
   - Clean header card with an editable School Logo frame, School Name ("Ataullah High School & College"), Tagline, Address, Academic Session, Current Date, Active Class/Section badge, and a top-right "Edit Info" button.

==================================================
PHASE 2: STREAMLINED FILTERS, CHIPS & METRIC CARDS
==================================================
4. FILTER BAR & ACTIVE FILTER CHIPS:
   - Dynamic Filters: Academic Year, Class (Class 1 to 12), Group (Science/Commerce/Arts), Section (A-E), Shift (Morning/Day), and Date Picker.
   - Active Filter Chips (CRITICAL UX feature): Below the dropdowns, display interactive applied tags: 
     e.g., [ Academic Year: 2026 × ] [ Class IX × ] [ Section A × ] [ Morning Shift × ] [ Date: Today × ]
     * Clicking '×' removes that specific filter instantly. Include a "Clear All" link to reset all filters.
   - Quick Actions: Prominent Search bar (by Student Name/Roll/ID), "Add Student" modal button, "Import/Export Excel", "Add/Remove Subject", "All Present", "All Late", "All Leave".

5. CLICKABLE OVERVIEW CARDS:
   - Display cards for Total Students, Present Today, Late Today, Leave Today, Subject-Wise Absence Breakdown, and Overall Attendance % (Circular gauge with trend).
   - Clicking any summary card instantly filters the main data table below.

==================================================
PHASE 3: MAIN DATA TABLE & INTERACTIVE GRID
==================================================
6. MAIN ATTENDANCE DATA TABLE (DYNAMIC):
   - Features: Sticky Header, Fixed Roll/Student columns, smooth horizontal scroll, row hover states.
   - Dynamic Subject Rendering: Changing the Class filter dynamically updates subject columns (e.g., 3 subjects for Class 1, up to 12 for Class 10/12) without page refresh.
   - Columns Layout:
     1. Checkbox: For Bulk Operations.
     2. Roll No: Numeric only (STRICTLY NO '#' symbol).
     3. Student Info: Uploadable Avatar + Full Name + ID (Hovering opens a Quick Profile Card).
     4. Class/Sec: Dynamic pill badge (auto-updates, e.g., "IX-A").
     5. Dynamic Subject Status Grid: Compact interactive badges (P/A/L/Lv). Clicking cycles state (Green=P, Red=A, Orange=L, Blue=Lv).
     6. Today Status: Overall daily status badge (shows "1 Subject Absent" instead of marking fully absent if absent in only 1 subject).
     7. Attendance %: Auto-calculated percentage bar with monthly average.
     8. Evaluation & Comments: 5-Star rating + Editable comment chip.
     9. Actions: Icon set — [Send Message], [Edit Row Data], [Print Row], [Delete Student].

==================================================
PHASE 4: BULK ACTIONS, FOOTER & PRINT SYSTEM
==================================================
7. CONTEXTUAL BULK OPERATIONS TOOLBAR:
   - Hidden by default. Slides up automatically at the bottom ONLY when 1 or more row checkboxes are selected.
   - Options: Bulk Attendance Update, Bulk SMS, Bulk Delete, Bulk Print, Export Selected.

8. TABLE FOOTER & SIGNATURES:
   - Bottom-Left Stats: Live status pill (e.g., "Showing 1-10 of 40 | P:20 | A:8 | L:11 | Lv:1").
   - Bottom-Right Pagination: Page numbers (1, 2, 3, Next) with active page glow.
   - Printable Signatures: Bottom row for Class Teacher, Headmaster, and Parent signatures.

9. RESPONSIVE PRINT & PDF EXPORT LOGIC:
   - Direct Print (A4): Auto-converts to high-contrast B&W layout, preventing column clipping in both Portrait and Landscape.
   - Save as PDF: Retains full vibrant colors and branding.

==================================================
AI PRODUCTION INSTRUCTION
==================================================
Prioritize functional UX over purely decorative visuals. Every component must be fully interactive, editable, responsive, and production-ready. Avoid placeholder-only designs. Use reusable design tokens, consistent spacing, and modern SaaS interaction patterns.