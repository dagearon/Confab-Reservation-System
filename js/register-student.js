function showAlert(type, msg) {
  document.getElementById("err").style.display = "none";
  document.getElementById("suc").style.display = "none";
  const el = document.getElementById(type === "error" ? "err" : "suc");
  el.textContent = msg;
  el.style.display = "block";
}

function doRegister() {
  const fname = document.getElementById("fname").value.trim();
  const lname = document.getElementById("lname").value.trim();
  const sidRaw = document.getElementById("sid").value;
  const emailRaw = document.getElementById("email").value;
  const pw = document.getElementById("pw").value;
  const cpw = document.getElementById("cpw").value;
  const btn = document.getElementById("reg-btn");

  if (!fname || !lname) return showAlert("error", "Please enter your full name.");

  const sidCheck = validateStudentSchoolId(sidRaw);
  if (sidCheck.error) return showAlert("error", sidCheck.error);

  const emailCheck = validateStudentEmail(emailRaw);
  if (emailCheck.error) return showAlert("error", emailCheck.error);

  const pwErr = validatePasswordPolicy(pw);
  if (pwErr) return showAlert("error", pwErr);
  if (pw !== cpw) return showAlert("error", "Passwords do not match.");

  const email = emailCheck.normalized;
  const sid = sidCheck.normalized;

  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email))
    return showAlert("error", "An account with this email already exists.");
  if (users.some((u) => u.type === "student" && u.sid === sid))
    return showAlert("error", "An account with this School ID already exists.");

  btn.textContent = "Creating account…";
  btn.disabled = true;
  setTimeout(() => {
    users.push({
      fname,
      lname,
      sid,
      email,
      password: pw,
      type: "student",
      accountStatus: "active",
      staffPortalAccess: false,
      createdAt: new Date().toISOString(),
    });
    saveUsers(users);
    btn.textContent = "Create Account";
    btn.disabled = false;
    showAlert("success", "Account created! Redirecting to sign in…");
    setTimeout(() => {
      window.location.href = "LogIn.html";
    }, 1500);
  }, 900);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") doRegister();
});
