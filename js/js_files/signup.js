
/**
 * Initializes the back-arrow navigation and binds the click handler.
 * @returns {void}
 */
function initBackNavigation() {
  const backArrow = document.querySelector(".back-arrow");
  if (backArrow) {
    backArrow.addEventListener(
      "click",
      () => (window.location.href = "index.html"),
    );
  }
}

/**
 * Toggles the visibility of a password field and swaps the icon.
 * @param {HTMLInputElement} input - The password input element.
 * @param {HTMLImageElement} icon - The icon element to switch.
 * @returns {void}
 */
function toggleVisibility(input, icon) {
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  icon.src = isHidden
    ? "./assets/img/visibility.svg"
    : "./assets/img/visibility_off.svg";
}

/**
 * Sets up UI handlers for a password field (toggle icon and lock icon).
 * @param {string} inputId - The id of the password input element.
 * @param {string} toggleIconId - The id of the visibility toggle icon.
 * @param {string} lockIconId - The id of the lock icon shown when empty.
 * @returns {void}
 */
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

/**
 * Initializes password visibility logic for all relevant fields.
 * @returns {void}
 */
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

/**
 * Validates the name field of the signup form.
 * @returns {boolean} True if a non-empty name was provided.
 */
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

/**
 * Validates the email address in the signup form.
 * @returns {boolean} True if the email field has a valid format.
 */
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

/**
 * Validates the entered password (requirements: min 6 chars, at least one letter and one number).
 * @returns {boolean} True if the password satisfies the required pattern.
 */
function validateSignupPassword() {
  const { input, errorEl, lockIcon, toggleIcon } = getPasswordElements();
  const isValid = isPasswordPatternValid(input.value);
  updatePasswordClasses(isValid, input, lockIcon, toggleIcon);
  showPasswordError(isValid, errorEl);
  return isValid;
}

/**
 * Retrieves password-related DOM elements.
 * @returns {{input:HTMLInputElement,errorEl:HTMLElement,lockIcon:HTMLElement,toggleIcon:HTMLElement}}
 */
function getPasswordElements() {
  return {
    input: document.getElementById("signup-password"),
    errorEl: document.getElementById("password-error"),
    lockIcon: document.getElementById("lock-signup-password"),
    toggleIcon: document.getElementById("toggle-signup-password"),
  };
}

/**
 * Tests the password string against the required pattern.
 * @param {string} value
 * @returns {boolean}
 */
function isPasswordPatternValid(value) {
  return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/m.test(value);
}

/**
 * Updates input/icon classes according to validity.
 * @param {boolean} isValid
 * @param {HTMLInputElement} input
 * @param {HTMLElement} lockIcon
 * @param {HTMLElement} toggleIcon
 * @returns {void}
 */
function updatePasswordClasses(isValid, input, lockIcon, toggleIcon) {
  input.classList.toggle("error", !isValid);
  lockIcon.classList.toggle("input-icon", isValid);
  lockIcon.classList.toggle("input-icon-error", !isValid);
  toggleIcon.classList.toggle("toggle-password-icon", isValid);
  toggleIcon.classList.toggle("toggle-password-icon-error", !isValid);
}

/**
 * Shows or hides the password error element.
 * @param {boolean} isValid
 * @param {HTMLElement} errorEl
 * @returns {void}
 */
function showPasswordError(isValid, errorEl) {
  errorEl.style.display = isValid ? "none" : "block";
}

/**
 * Checks whether password and confirmation match.
 * @returns {boolean} True if both fields are identical.
 */
function validatePasswordMatch() {
  const { passwordInput, confirmInput, errorEl, icon, toggleIcon } = getPasswordMatchElements();
  const isValid = comparePasswords(passwordInput.value, confirmInput.value);
  updatePasswordMatchClasses(isValid, passwordInput, confirmInput, icon, toggleIcon);
  showPasswordMatchError(isValid, errorEl);
  return isValid;
}

/**
 * Retrieves DOM elements needed for password match validation.
 * @returns {{passwordInput:HTMLInputElement,confirmInput:HTMLInputElement,errorEl:HTMLElement,icon:HTMLElement,toggleIcon:HTMLElement}}
 */
function getPasswordMatchElements() {
  return {
    passwordInput: document.getElementById("signup-password"),
    confirmInput: document.getElementById("confirm-password"),
    errorEl: document.getElementById("password-confirm-error"),
    icon: document.getElementById("toggle-signup-password"),
    toggleIcon: document.getElementById("toggle-confirm-password"),
  };
}

/**
 * Compares password and confirmation strings.
 * @param {string} pw
 * @param {string} confirm
 * @returns {boolean}
 */
function comparePasswords(pw, confirm) {
  return pw === confirm;
}

/**
 * Updates input and icon classes according to match validity.
 * @returns {void}
 */
function updatePasswordMatchClasses(isValid, passwordInput, confirmInput, icon, toggleIcon) {
  passwordInput.classList.toggle("error", !isValid);
  confirmInput.classList.toggle("error", !isValid);
  icon.classList.toggle("input-icon", isValid);
  icon.classList.toggle("input-icon-error", !isValid);
  toggleIcon.classList.toggle("toggle-password-icon", isValid);
  toggleIcon.classList.toggle("toggle-password-icon-error", !isValid);
}

/**
 * Shows or hides the password-confirmation error element.
 * @returns {void}
 */
function showPasswordMatchError(isValid, errorEl) {
  errorEl.style.display = isValid ? "none" : "block";
}

/**
 * Handles signup form submission: validation and registration call.
 * @param {SubmitEvent} event - The form submit event.
 * @async
 * @returns {Promise<void>}
 */
async function signUp(event) {
  event.preventDefault();
  const { userName, email, passwordInput } = getSignupElements();
  if (!ensurePasswordsMatch()) return;
  await performRegistration(userName, email, passwordInput);
  redirectAfterSuccess();
}

/**
 * Returns references to signup form elements.
 * @returns {{userName:HTMLInputElement,email:HTMLInputElement,passwordInput:HTMLInputElement}}
 */
function getSignupElements() {
  return {
    userName: document.getElementById("signup-name"),
    email: document.getElementById("signup-email"),
    passwordInput: document.getElementById("signup-password"),
  };
}

/**
 * Ensures password and confirmation match using existing validator.
 * @returns {boolean}
 */
function ensurePasswordsMatch() {
  return validatePasswordMatch();
}

/**
 * Performs registration by sending data to the backend.
 * @async
 * @returns {Promise<void>}
 */
async function performRegistration(userName, email, passwordInput) {
  await regDataToBackend(userName, email, passwordInput);
}

/**
 * Redirects to the index page after a short success delay.
 * @returns {void}
 */
function redirectAfterSuccess() {
  setTimeout(() => {
    window.location.href = "index.html?msg=Registration successful!";
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  initBackNavigation();
  initPasswordVisibilityToggle();
});



/**
 * Builds the user object and sends it to the backend.
 * @param {HTMLInputElement} userName - Name input element.
 * @param {HTMLInputElement} email - Email input element.
 * @param {HTMLInputElement} passwordInput - Password input element.
 * @async
 * @returns {Promise<void>}
 */
async function regDataToBackend(userName, email, passwordInput) {
  let user = {
    name: userName.value,
    email: email.value,
    password: passwordInput.value,
  };
  await postData("user", user);
}

/**
 * Enables or disables the signup button based on the privacy-policy checkbox.
 * @returns {void}
 */
function enableSignupBtn() {
  const checkbox = document.getElementById("privacy-policy-checkbox");
  const signupBtn = document.getElementById("signup-btn");
  signupBtn.disabled = !checkbox.checked;
}

/**
 * Enables or disables the policy checkbox depending on email, password and confirmation validity.
 * @returns {void}
 */
function enablePolicyCheckbox() {
  const checkbox = document.getElementById("privacy-policy-checkbox");
  checkbox.disabled = !(
    validateSignupEmail() &&
    validateSignupPassword() &&
    validatePasswordMatch()
  );
}
