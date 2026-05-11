const XU_USERS_KEY = "xu_users";

/* Demo admin (class presentations): admin@xu.edu.ph / LibraryAdmin!24 — added again if storage is cleared */
const BUILTIN_DEMO_ADMIN = {
  fname: "Demo",
  lname: "Administrator",
  email: "admin@xu.edu.ph",
  password: "LibraryAdmin!24",
  type: "admin",
  sid: "ADMIN",
  accountStatus: "active",
  staffPortalAccess: false,
};

function normalizeUser(u) {
  const copy = { ...u };
  if (!copy.accountStatus) copy.accountStatus = "active";
  if (typeof copy.staffPortalAccess !== "boolean") copy.staffPortalAccess = false;
  if (typeof copy.type === "string") copy.type = copy.type.trim().toLowerCase();
  return copy;
}

function ensureBuiltinDemoAdminPresent(users) {
  const list = Array.isArray(users) ? users.map(normalizeUser) : [];
  const target = BUILTIN_DEMO_ADMIN.email.toLowerCase();
  if (list.some((u) => u.email && String(u.email).toLowerCase() === target)) {
    return list;
  }
  const merged = [
    ...list,
    normalizeUser({
      ...BUILTIN_DEMO_ADMIN,
      createdAt: new Date().toISOString(),
    }),
  ];
  localStorage.setItem(XU_USERS_KEY, JSON.stringify(merged));
  return merged;
}

function getUsers() {
  try {
    const raw = JSON.parse(localStorage.getItem(XU_USERS_KEY) || "[]");
    if (!Array.isArray(raw)) {
      return ensureBuiltinDemoAdminPresent([]);
    }
    let changed = false;
    const users = raw.map((u) => {
      const n = normalizeUser(u);
      if (JSON.stringify(n) !== JSON.stringify(u)) changed = true;
      return n;
    });
    if (changed) localStorage.setItem(XU_USERS_KEY, JSON.stringify(users));
    return ensureBuiltinDemoAdminPresent(users);
  } catch (e) {
    return ensureBuiltinDemoAdminPresent([]);
  }
}

function saveUsers(users) {
  localStorage.setItem(XU_USERS_KEY, JSON.stringify(users));
}

function hasActiveAdmin() {
  return getUsers().some((u) => u.type === "admin" && u.accountStatus === "active");
}

function countActiveAdmins(users) {
  return users.filter((u) => u.type === "admin" && u.accountStatus === "active").length;
}
