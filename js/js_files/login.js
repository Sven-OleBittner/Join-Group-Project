let users = [];
let loginUser;

function init() {
  dataToUsers();
  showMsg();
}

async function dataToUsers() {
  let user = await getData((path = "user"));
  users = Object.values(user || {});
}

async function login() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let user = users.find(
    (u) => u.email == email.value && u.password == password.value,
  );
  if (user) {
    await loggingInUser(user);
    sessionStorage.setItem("justLoggedIn", "true");
    window.location.href = "summary.html";
  } else {
    userNotFound();
  }
}

function showMsg() {
  let msgBox = document.getElementById("msgBox");
  let msgBoxText = document.getElementById("msgBoxText");
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get("msg");
  if (msg) {
    msgBoxText.innerHTML = msg;
  } else {
    msgBoxText.style.display = "none";
    msgBox.style.display = "none";
  }
}

function userNotFound() {
  window.location = "index.html?msg=User not Found";
}

async function loggingInUser(user) {
  sessionStorage.setItem("loggingInUser", JSON.stringify(user));
  await postData((path = "loggingInUser"), user);
}

async function loginGuest() {
  let guestUser = {
    name: "Guest",
  };
  await loggingInUser(guestUser);
  sessionStorage.setItem("justLoggedIn", "true");
  window.location.href = "summary.html";
}

/** Validiert das Email-Feld */
function validateEmail() {
  const email = document.getElementById("email");
  const icon = document.getElementById("email-icon");
  const isValid = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/i.test(email.value);
  email.classList.toggle("error", !isValid);
  return isValid;
}

function validatePassword() {
    const passwordInput = document.getElementById("password");
    const passwordError = document.getElementById("password-error");
    const icon = document.getElementById("lock-password");
    const toggleIcon = document.getElementById("toggle-password");
    const isValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/m.test(passwordInput.value);
    passwordInput.classList.toggle("error", !isValid);
    icon.classList.toggle("input-icon", isValid);
    icon.classList.toggle("input-icon-error", !isValid);
    passwordError.style.display = isValid ? "none" : "block";
    return isValid;
}

