let currentType = "staff";

const typeConfig = {
  admin: {
    label: "Administrator",
    placeholder: "admin@xu.edu.ph",
    sub: "Sign in with your administrator account",
    iconPath:
      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  },
  staff: {
    label: "Library Staff",
    placeholder: "you@xu.edu.ph or you@my.xu.edu.ph",
    sub: "Staff accounts are created by an administrator",
    iconPath:
      '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  },
  student: {
    label: "Student",
    placeholder: "name@my.xu.edu.ph",
    sub: "Sign in with your registered student account",
    iconPath:
      '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  },
};

(function checkSession() {
  try {
    const sess = JSON.parse(sessionStorage.getItem("xu_session") || "null");
    if (!sess || !sess.email) return;
    const users = getUsers();
    const live = users.find((u) => u.email.toLowerCase() === sess.email.toLowerCase());
    if (!live || live.accountStatus !== "active") {
      sessionStorage.removeItem("xu_session");
      return;
    }
    if (live.type === "admin") {
      window.location.href = "AdminDashBoard.html";
      return;
    }
    if (live.type === "staff" || (live.type === "student" && live.staffPortalAccess)) {
      window.location.href = "StaffDashBoard.html";
      return;
    }
    window.location.href = "StudentDashBoard.html";
  } catch (e) {
    sessionStorage.removeItem("xu_session");
  }
})();

function selectType(type) {
  currentType = type;
  const cfg = typeConfig[type];
  document.getElementById("badge-label").textContent = cfg.label;
  document.getElementById("view-login").querySelector(".user-type-badge svg").innerHTML =
    cfg.iconPath;
  document.getElementById("login-sub").textContent = cfg.sub;
  document.getElementById("email").placeholder = cfg.placeholder;
  document.getElementById("error-msg").style.display = "none";
  document.getElementById("success-msg").style.display = "none";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("view-select").classList.remove("active");
  document.getElementById("view-login").classList.add("active");
}

function goBack() {
  document.getElementById("view-login").classList.remove("active");
  document.getElementById("view-select").classList.add("active");
  document.getElementById("error-msg").style.display = "none";
  document.getElementById("success-msg").style.display = "none";
}

function togglePw() {
  const pw = document.getElementById("password");
  const icon = document.getElementById("eye-icon");
  if (pw.type === "password") {
    pw.type = "text";
    icon.innerHTML =
      '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>';
  } else {
    pw.type = "password";
    icon.innerHTML =
      '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  }
}

function showMsg(type, text) {
  ["error-msg", "success-msg"].forEach((id) => {
    document.getElementById(id).style.display = "none";
  });
  const el = document.getElementById(type + "-msg");
  el.textContent = text;
  el.style.display = "block";
}

function redirectAfterLogin(user) {
  if (user.type === "admin") {
    window.location.href = "AdminDashBoard.html";
    return;
  }
  if (user.type === "staff") {
    window.location.href = "StaffDashBoard.html";
    return;
  }
  window.location.href = "StudentDashBoard.html";
}

function handleLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.getElementById("login-btn");

  if (!email) return showMsg("error", "Please enter your email address.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return showMsg("error", "Please enter a valid email address.");
  if (!password) return showMsg("error", "Please enter your password.");

  const emailNorm = email.toLowerCase();
  const users = getUsers();

  let user = null;
  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    if (!u.email) continue;
    if (u.email.toLowerCase() === emailNorm && u.password === password && u.type === currentType) {
      user = u;
      break;
    }
  }

  if (!user) {
    let sameLoginWrongType = null;
    for (let i = 0; i < users.length; i++) {
      const u = users[i];
      if (!u.email) continue;
      if (u.email.toLowerCase() === emailNorm && u.password === password) {
        sameLoginWrongType = u;
        break;
      }
    }
    if (sameLoginWrongType) {
      return showMsg(
        "error",
        "Press Back and pick the correct account type (Administrator, Library Staff, or Students)."
      );
    }

    if (currentType === "staff") {
      let row = null;
      for (let i = 0; i < users.length; i++) {
        const u = users[i];
        if (!u.email) continue;
        if (u.email.toLowerCase() === emailNorm) {
          row = u;
          break;
        }
      }
      if (!row) {
        return showMsg(
          "error",
          "This browser has no account with that email. Open the site the same way the admin did (same address, e.g. Live Server), or ask the admin to add the staff user again on this computer."
        );
      }
      if (row.type !== "staff") {
        return showMsg(
          "error",
          "That email is not a staff account here. Press Back and choose the right role, or use a different email."
        );
      }
      return showMsg(
        "error",
        "Wrong password. Use the exact temporary password the admin typed when creating this staff account."
      );
    }

    if (currentType === "admin") {
      return showMsg("error", "Wrong administrator email or password.");
    }
    return showMsg("error", "Wrong email or password, or you still need to register as a student.");
  }

  if (user.accountStatus === "inactive") {
    return showMsg(
      "error",
      "This account has been deactivated. Contact the administrator."
    );
  }

  btn.textContent = "Signing in…";
  btn.disabled = true;

  setTimeout(() => {
    const sessionData = {
      email: user.email.toLowerCase(),
      fname: user.fname,
      lname: user.lname,
      type: user.type,
      sid: user.sid || "",
      staffPortalAccess: !!user.staffPortalAccess,
    };
    sessionStorage.setItem("xu_session", JSON.stringify(sessionData));
    showMsg("success", "Login successful! Redirecting…");
    setTimeout(() => redirectAfterLogin(user), 900);
  }, 800);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && document.getElementById("view-login").classList.contains("active"))
    handleLogin();
});
