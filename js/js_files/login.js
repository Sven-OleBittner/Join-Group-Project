let users = [];
let loginUser;

/**
 * Initializes the login page: sets up listeners and loads users
 * @returns {void}
 */
function init() {
  initEventListeners();
  dataToUsers();
  showMsg();
}

/**
 * Loads user records from the backend into `users` array
 * @returns {Promise<void>}
 */
async function dataToUsers() {
  let user = await getData((path = "user"));
  users = Object.values(user || {});
}

/**
 * Attempts to authenticate the user by email and password
 * @returns {Promise<void>}
 */
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

/**
 * Shows a message passed via `msg` query parameter if present
 * @returns {void}
 */
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

/**
 * Shows an inline error when login failed
 * @returns {void}
 */
function userNotFound() {
  let passwordError = document.getElementById("password-error");
  let toggleIcon = document.getElementById("toggle-password");
  let lockIcon = document.getElementById("lock-password");
  passwordError.innerHTML =
    "Check your email and your password. Please try again.";
  passwordError.style.display = "block";
  lockIcon.classList.toggle("toggle-password-icon");
  toggleIcon.classList.toggle("toggle-password-icon-error");
}

/**
 * Persists the logged-in user state
 * @param {Object} user - User object to store
 * @returns {Promise<void>}
 */
async function loggingInUser(user) {
  sessionStorage.setItem("loggingInUser", JSON.stringify(user));
  await postData((path = "loggingInUser"), user);
}

/**
 * Performs a guest login and redirects to summary
 * @returns {Promise<void>}
 */
async function loginGuest() {
  let guestUser = {
    name: "Guest",
  };
  await loggingInUser(guestUser);
  sessionStorage.setItem("justLoggedIn", "true");
  window.location.href = "summary.html";
}

/**
 * Validates an input by id using corresponding regex and shows an error
 * @param {string} inputId - Element id to validate
 * @returns {boolean} True if valid
 */
function validateInput(inputId) {
  let input = document.getElementById(inputId);
  let errorBox = document.getElementById(`${inputId}-error`);
  let regEx = chooseInput(inputId);
  let isValid = regEx.test(input.value);
  errorBox.innerHTML = chooseErrorInput(inputId);
  input.classList.toggle("error", !isValid);
  errorBox.style.display = isValid ? "none" : "block";
  return isValid;
}

/**
 * Returns validation regex for a given input id
 * @param {string} inputId
 * @returns {RegExp}
 */
function chooseInput(inputId) {
  switch (inputId) {
    case "email":
      return /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/i;
    case "password":
      return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/m;
  }
}

/**
 * Returns the appropriate error message for an input id
 * @param {string} inputId
 * @returns {string}
 */
function chooseErrorInput(inputId) {
  switch (inputId) {
    case "email":
      return "Please enter a valid email.";
    case "password":
      return "Please enter a valid password.";
  }
}

/**
 * Updates login button enabled state based on validation
 * @returns {void}
 */
function updateLoginState() {
  const loginBtn = document.getElementById("login-btn");
  const ok = validateInput("email") && validateInput("password");
  loginBtn.disabled = !ok;
  loginBtn.classList.toggle("disabled", !ok);
}

/**
 * Sets up page event listeners
 * @returns {void}
 */
function initEventListeners() {
  const password = document.getElementById("password");
  password.addEventListener("input", updateLoginState);
}
