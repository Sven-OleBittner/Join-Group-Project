let users = [];
let loginUser;

function init() {
  initEventListeners()
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
  if (user != undefined && user != null) {
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
    msgBoxText.style.display = "";
    msgBox.style.display = "";
    removeMsgFromUrl();
  } else {
    msgBoxText.style.display = "none";
    msgBox.style.display = "none";
  }
}

function userNotFound() {
  let errorBox = document.getElementById("password-error");
  let toggleIcon = document.getElementById("toggle-password");
  let lockIcon = document.getElementById("lock-password");
  errorBox.style.display = "block";
  lockIcon.classList.toggle("toggle-password-icon");
  toggleIcon.classList.toggle("toggle-password-icon-error");
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

function validateInput(inputId) {
  let input = document.getElementById(inputId);
  let errorBox = document.getElementById(`${inputId}-error`);
  let regEx = chooseInput(inputId);
  let isValid = regEx.test(input.value);
  errorBox.innerHTML = chooseError(inputId);
  input.classList.toggle("error", !isValid);
  errorBox.style.display = isValid ? "none" : "block";
  return isValid;
}

function chooseInput(inputId) {
  switch (inputId) {
    case "email":
      return /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/i;
    case "password":
      return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/m;
  }
}

function chooseError(inputId) {
  switch (inputId) {
    case "email":
      return "Please enter a valid email.";
    case "password":
      return "Please enter a valid password.";
  }
}

function updateLoginState() {
  const loginBtn = document.getElementById("login-btn");
  const ok = validateInput("email") && validateInput("password");
  loginBtn.disabled = !ok;
  loginBtn.classList.toggle("disabled", !ok);
}

function initEventListeners() {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  email.addEventListener("input", updateLoginState);
  password.addEventListener("input", updateLoginState);
}
