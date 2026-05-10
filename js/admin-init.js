(function () {
  if (hasActiveAdmin()) {
    window.location.replace("LogIn.html");
    return;
  }
})();

function showInitMsg(type, text) {
  const err = document.getElementById("init-err");
  const ok = document.getElementById("init-ok");
  err.style.display = "none";
  ok.style.display = "none";
  const el = type === "error" ? err : ok;
  el.textContent = text;
  el.style.display = "block";
}

function createFirstAdmin() {
  const fname = document.getElementById("fname").value.trim();
  const lname = document.getElementById("lname").value.trim();
  const emailRaw = document.getElementById("email").value.trim();
  const pw = document.getElementById("pw").value;
  const cpw = document.getElementById("cpw").value;
  const btn = document.getElementById("init-btn");

  if (!fname || !lname) return showInitMsg("error", "Please enter your full name.");
  const emailCheck = validateAdminInitEmail(emailRaw);
  if (emailCheck.error) return showInitMsg("error", emailCheck.error);
  const pwErr = validatePasswordPolicy(pw);
  if (pwErr) return showInitMsg("error", pwErr);
  if (pw !== cpw) return showInitMsg("error", "Passwords do not match.");

  const users = getUsers();
  if (users.some((u) => u.email === emailCheck.normalized)) {
    return showInitMsg("error", "That email is already registered. Sign in as administrator.");
  }

  btn.disabled = true;
  btn.textContent = "Creating…";
  users.push({
    fname,
    lname,
    email: emailCheck.normalized,
    password: pw,
    type: "admin",
    sid: "ADMIN",
    accountStatus: "active",
    staffPortalAccess: false,
    createdAt: new Date().toISOString(),
  });
  saveUsers(users);
  showInitMsg("success", "Administrator account created. Redirecting to sign in…");
  setTimeout(() => {
    window.location.href = "LogIn.html";
  }, 1200);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") createFirstAdmin();
});
