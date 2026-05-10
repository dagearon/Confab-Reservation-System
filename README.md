# LibReserve — Confab Reservation System

Front-end library **Confab 1–6** room booking for Xavier University (Ateneo de Cagayan). Students submit requests; **staff** approve or reject; **admin** manages accounts. This is a **static site** with **no backend**: all data is stored in the browser via **`localStorage`**.

---

## Demo administrator (built-in)

For class demos, a demo admin is **re-injected** into storage when missing (see `js/auth-store.js`).

| Field    | Value              |
| -------- | ------------------ |
| Email    | `admin@xu.edu.ph`  |
| Password | `LibraryAdmin!24`  |

You can also **create staff accounts** from the admin dashboard (**+ Add staff account**). Staff may use **`@xu.edu.ph`** or **`@my.xu.edu.ph`** (e.g. student assistants). The **first** system administrator (one-time setup via `AdminInit.html`) still must use **`@xu.edu.ph`** only.

---

## What it is

- **Front-end only** — open `LogIn.html` via a local server (e.g. Live Server) so everyone testing shares the **same origin** and sees the same `localStorage`.
- **Roles:** student, staff, administrator.
- **Data:** `xu_users` (accounts), `xu_reservations` (requests), plus `sessionStorage` for the signed-in session.

---

## Roles and pages

| Role | Main files |
| ---- | ---------- |
| **Student** | `StudentDashBoard.html`, `js/student-dashboard.js` — room cards, booking modal, **My reservations**, **Track status**, weekly schedule modal |
| **Staff** | `StaffDashBoard.html`, `js/staff-dashboard.js` — queue, stats, search, **sort by submission** (oldest ↔ newest), approve/reject, detail modal |
| **Admin** | `AdminDashBoard.html`, `js/admin-dashboard.js` — create staff, **New password**, activate/deactivate users, student desk access |
| **Auth** | `LogIn.html`, `Register.html`, `js/login.js`, `js/register.js`, `js/auth-store.js` |

Other entry points: `AdminInit.html` (first admin, when no admin exists), `RegisterStaff.html` (informational; staff are created by admin).

---

## Rooms and rules

- **Six Confab rooms** with specs (capacity, floor, whiteboard, projector, network) in `js/student-dashboard.js`.
- **Library hours** (Mon–Fri 8:00–20:00, Sat 8:00–17:00, **Sun closed**) are enforced in **`js/reservation-rules.js`** for booking and staff approval.
- **Conflicts:** new student requests are blocked only by **approved** overlaps; **pending** does not block. When staff **approve** a request, overlapping **pending** rows are **auto-rejected** with a **`rejectReason`** students can see on **Track** and **My reservations**.

---

## Student features

- **Booking:** date/time, purpose, **group members** (numbered lines, hints, line parsing).
- **My reservations:** status badges, rejection messages, **Cancel** for **pending** or **approved** only if **at least 2 hours before start** → `status: cancelled`, `cancelledAt`, `cancelledBy: "student"`.
- **Track:** lookup by tracking code; shows **cancelled** and cancellation time when set.
- **Weekly schedule:** grid shows **approved** occupancy only; **privacy** — each block shows **time** and **“Occupied”** only (no names, purposes, or identifying tooltips).

---

## Staff features

- Table with filters: **All**, **Pending**, **Approved**, **Rejected**, **Cancelled**.
- **Submitted** sort: **Oldest → newest** or **Newest → oldest**.
- **Refresh list**; stats include **Cancelled** (student cancellations).
- Approve path runs **library hours**, **not-past**, and **approved** conflict checks; then **auto-rejects** overlapping pending requests.
- UI reminds that reservations are **per browser** — use the **same URL/origin** as students (e.g. same Live Server link).

---

## Admin / accounts

- **Demo admin** (`admin@xu.edu.ph`) is ensured by `ensureBuiltinDemoAdminPresent` in `js/auth-store.js` when loading users.
- **Add staff** from the admin panel: names, email (**`@xu.edu.ph`** or **`@my.xu.edu.ph`**), employee ID, password (policy in `js/register-validation.js`).
- **New password** for existing staff rows; email trimmed on create; clearer login errors for wrong role or password.

**Note:** One email cannot be two user rows. If a student already registered on `my.xu`, you cannot add a second **staff** row with the same email; use **Grant desk** on that student or a separate staff email.

---

## Branding and UI

- XU logo panel and **favicon** on white (`images/`).
- **CSS:** `css/variables.css`, `css/dashboard-common.css`, plus page styles (`student-dashboard.css`, `staff-dashboard.css`, etc.).
- HTML pages stay lean; shared layout patterns across dashboards.

---

## Main code files

| Area | Files |
| ---- | ----- |
| Hours, conflicts, auto-reject, student cancel window | `js/reservation-rules.js` |
| Student UI, schedule, booking, lists, cancel | `js/student-dashboard.js`, `StudentDashBoard.html`, `css/student-dashboard.css` |
| Desk queue, sort, approve/reject | `js/staff-dashboard.js`, `StaffDashBoard.html`, `css/staff-dashboard.css` |
| Users, demo admin | `js/auth-store.js` |
| Admin desk | `js/admin-dashboard.js`, `AdminDashBoard.html` |
| Email/password validation | `js/register-validation.js` |
| First admin bootstrap | `js/admin-init.js`, `AdminInit.html` |
| Shared badges / layout | `css/dashboard-common.css` |

---

## Running locally

1. Serve the folder over **HTTP** (e.g. VS Code **Live Server**), not only `file://`, so behavior is consistent.
2. Open **`LogIn.html`**.
3. Sign in as demo admin or create staff and test student registration on the **same origin**.

---

## Support / pitfalls

- **Staff sees no reservations:** different browser, different port, or `file://` vs `http://localhost` → different **`localStorage`**.
- **Login fails:** wrong **role tile** (Administrator vs Library Staff vs Student), wrong password, or inactive account — admin can set **New password** for staff.
- **Clearing site data** removes created staff and reservations; the **demo admin** is added again on next load if it was the only way admins existed (see `auth-store.js`).

---

## License / course use

Use and adapt as needed for coursework or demos; adjust credentials and copy for production if you ever move beyond a static demo.
