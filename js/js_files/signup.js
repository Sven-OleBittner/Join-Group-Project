/** Initialisiert die Zurück-Pfeil Navigation */
function initBackNavigation() {
  const backArrow = document.querySelector(".back-arrow");
  if (backArrow) {
    backArrow.addEventListener(
      "click",
      () => (window.location.href = "index.html"),
    );
  }
}

/** Togglet die Sichtbarkeit eines Passwort-Feldes */
function toggleVisibility(input, icon) {
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  icon.src = isHidden
    ? "./assets/img/visibility.svg"
    : "./assets/img/visibility_off.svg";
}

/** Richtet Icon-Toggle für ein Passwortfeld ein */
function setupPasswordFieldToggle(inputId, toggleIconId, lockIconId) {
  const input = document.getElementById(inputId);
  const toggleIcon = document.getElementById(toggleIconId);
  const lockIcon = document.getElementById(lockIconId);
  toggleIcon.addEventListener("click", () =>
    toggleVisibility(input, toggleIcon),
  );
  input.addEventListener("input", () => {
    const hasValue = input.value.length > 0;
    toggleIcon.style.display = hasValue ? "block" : "none";
    lockIcon.style.display = hasValue ? "none" : "block";
  });
}

/** Initialisiert die Passwort-Sichtbarkeits-Toggle-Funktionalität */
function initPasswordVisibilityToggle() {
  setupPasswordFieldToggle(
    "signup-password",
    "toggle-signup-password",
    "lock-signup-password",
  );
  setupPasswordFieldToggle(
    "confirm-password",
    "toggle-confirm-password",
    "lock-confirm-password",
  );
}

/** Validiert das Name-Feld */
function validateName() {
  const name = document.getElementById("signup-name");
  const nameError = document.getElementById("name-error");
  const icon = document.getElementById("name-pic");
  const isValid = name.value.trim() !== "";
  name.classList.toggle("error", !isValid);
  icon.classList.toggle("input-icon", isValid);
  icon.classList.toggle("input-icon-error", !isValid);
  nameError.style.display = isValid ? "none" : "block";
  return isValid;
}

/** Validiert das Email-Feld */
function validateSignupEmail() {
  const email = document.getElementById("signup-email");
  const emailError = document.getElementById("email-error");
  const icon = document.getElementById("email-pic");
  const isValid = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/i.test(email.value);
  email.classList.toggle("error", !isValid);
  icon.classList.toggle("input-icon", isValid);
  icon.classList.toggle("input-icon-error", !isValid);
  emailError.style.display = isValid ? "none" : "block";
  return isValid;
}

function validateSignupPassword() {
    const passwordInput = document.getElementById("signup-password");
    const passwordError = document.getElementById("password-error");
    const icon = document.getElementById("lock-signup-password");
    const toggleIcon = document.getElementById("toggle-signup-password");
    const isValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/m.test(passwordInput.value);
    passwordInput.classList.toggle("error", !isValid);
    icon.classList.toggle("input-icon", isValid);
    icon.classList.toggle("input-icon-error", !isValid);
    toggleIcon.classList.toggle("toggle-password-icon", isValid);
    toggleIcon.classList.toggle("toggle-password-icon-error", !isValid);
    passwordError.style.display = isValid ? "none" : "block";
    return isValid;
}

/** Validiert die Passwort-Übereinstimmung */
function validatePasswordMatch() {
  const passwordInput = document.getElementById("signup-password");
  const confirmInput = document.getElementById("confirm-password");
  const passwordConfirmError = document.getElementById("password-confirm-error");
  const icon = document.getElementById("toggle-signup-password");
  const toggleIcon = document.getElementById("toggle-confirm-password");
  const isValid = passwordInput.value === confirmInput.value;
  passwordInput.classList.toggle("error", !isValid);
  confirmInput.classList.toggle("error", !isValid);
  icon.classList.toggle("input-icon", isValid);
  icon.classList.toggle("input-icon-error", !isValid);
  toggleIcon.classList.toggle("toggle-password-icon", isValid);
  toggleIcon.classList.toggle("toggle-password-icon-error", !isValid);
  passwordConfirmError.style.display = isValid ? "none" : "block";
  return isValid;
}

/** Initialisiert die Formular-Validierung */
function signUp() {
  const userName = document.getElementById("signup-name");
  const email = document.getElementById("signup-email");
  const passwordInput = document.getElementById("signup-password");
  const confirmInput = document.getElementById("confirm-password");
  regDataToBackend(userName, email, passwordInput, confirmInput);
}


/** Initialisiert alle Signup-Funktionalitäten */
document.addEventListener("DOMContentLoaded", () => {
  initBackNavigation();
  initPasswordVisibilityToggle();
});

function regDataToBackend(userName, email, passwordInput, confirmInput) {
  if (passwordInput.value === confirmInput.value) {
    let user = {
      name: userName.value,
      email: email.value,
      password: passwordInput.value,
    };
    postData((path = "user"), user);
    setTimeout(() => {
      window.location = "index.html?msg=You Signed Up succesfully";
    }, 1000);
  }
}

function enableSignupBtn() {
  const checkbox = document.getElementById("privacy-policy-checkbox");
  const signupBtn = document.getElementById("signup-btn");
  signupBtn.disabled = !checkbox.checked;
  if (!signupBtn.disabled) {
    signupBtn.style.cursor = "pointer";
  } else {
    signupBtn.style.cursor = "not-allowed";
  }
}

function enablePolicyCheckbox() {
  const checkbox = document.getElementById("privacy-policy-checkbox");
  checkbox.disabled = !(validateSignupEmail() && validateSignupPassword() && validatePasswordMatch());
  if (!checkbox.disabled) {
    checkbox.style.cursor = "pointer";
  } else {
    checkbox.style.cursor = "not-allowed";
  }
}
