/** Initialisiert die Zurück-Pfeil Navigation */
function initBackNavigation() {
  const backArrow = document.querySelector(".back-arrow");
  if (backArrow) {
    backArrow.addEventListener("click", () => window.location.href = "index.html");
  }
}

/** Togglet die Sichtbarkeit eines Passwort-Feldes */
function toggleVisibility(input, icon) {
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  icon.src = isHidden ? "./assets/img/visibility.svg" : "./assets/img/visibility_off.svg";
}

/** Richtet Icon-Toggle für ein Passwortfeld ein */
function setupPasswordFieldToggle(inputId, toggleIconId, lockIconId) {
  const input = document.getElementById(inputId);
  const toggleIcon = document.getElementById(toggleIconId);
  const lockIcon = document.getElementById(lockIconId);
  toggleIcon.addEventListener("click", () => toggleVisibility(input, toggleIcon));
  input.addEventListener("input", () => {
    const hasValue = input.value.length > 0;
    toggleIcon.style.display = hasValue ? "block" : "none";
    lockIcon.style.display = hasValue ? "none" : "block";
  });
}

/** Initialisiert die Passwort-Sichtbarkeits-Toggle-Funktionalität */
function initPasswordVisibilityToggle() {
  setupPasswordFieldToggle("signup-password", "toggle-signup-password", "lock-signup-password");
  setupPasswordFieldToggle("confirm-password", "toggle-confirm-password", "lock-confirm-password");
}

/** Validiert das Email-Feld */
function validateEmail(email, emailError) {
  const isValid = email.value.includes("@");
  email.classList.toggle("error", !isValid);
  emailError.style.display = isValid ? "none" : "block";
  return isValid;
}

/** Validiert die Passwort-Übereinstimmung */
function validatePasswordMatch(passwordInput, confirmInput, passwordError) {
  const isValid = passwordInput.value === confirmInput.value;
  passwordInput.classList.toggle("error", !isValid);
  confirmInput.classList.toggle("error", !isValid);
  passwordError.style.display = isValid ? "none" : "block";
  return isValid;
}

/** Initialisiert die Formular-Validierung */
function initFormValidation() {
  const userName = document.getElementById("signup-name");
  const form = document.getElementById("signup-form");
  const email = document.getElementById("signup-email");
  const emailError = document.getElementById("email-error");
  const passwordInput = document.getElementById("signup-password");
  const confirmInput = document.getElementById("confirm-password");
  const passwordError = document.getElementById("password-error");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email, emailError);
    const isPasswordValid = validatePasswordMatch(passwordInput, confirmInput, passwordError);
    if (isEmailValid && isPasswordValid) {
      console.log("Signup successful!");
      regDataToBackend(userName, email, passwordInput, confirmInput);
    }
  });
}

/** Initialisiert alle Signup-Funktionalitäten */
document.addEventListener("DOMContentLoaded", () => {
  initBackNavigation();
  initPasswordVisibilityToggle();
  initFormValidation();
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
