/* Cache DOM elements for reuse */
const els = {
  intro: document.getElementById("intro"),
  loginPage: document.getElementById("loginPage"),
  introLogo: document.getElementById("introLogo"),
  password: document.getElementById("password"),
  toggle: document.getElementById("toggle-password"),
  lock: document.getElementById("lock-password"),
  form: document.getElementById("login-form"),
  email: document.getElementById("email"),
  emailError: document.getElementById("email-error"),
  passwordError: document.getElementById("password-error")
};

/* Set initial logo src and background color based on screen size */
/**
 * Adjusts intro logo and background based on current viewport size
 * @returns {void}
 */
function setIntro() {
  if (!els.intro || !els.loginPage || !els.introLogo) return;
  const isMobile = window.innerWidth <= 480;
  els.introLogo.src = isMobile ? "./assets/img/Capa 2white.svg" : "./assets/img/Capa 2.svg";
  els.intro.style.backgroundColor = isMobile ? "#2A3647" : "transparent";
}

/* Prepare the login page (invisible) so the header occupies its position in DOM */
/**
 * Prepares the login page layout before the transition animation
 * @returns {void}
 */
function prepareLoginPage() {
  els.loginPage.style.opacity = "0";
  els.loginPage.style.visibility = "visible";
  void els.introLogo.offsetWidth;
}

/* Move intro logo directly to the exact position of the header logo */
/**
 * Positions the intro logo element to the coordinates of the header logo
 * @param {DOMRect} rect - Bounding rect of the header logo
 * @returns {void}
 */
function flyLogoToHeader(rect) {
  els.introLogo.style.top = rect.top + 'px';
  els.introLogo.style.left = rect.left + 'px';
  els.introLogo.style.width = rect.width + 'px';
  els.introLogo.style.height = rect.height + 'px';
  els.introLogo.style.transform = 'none';
}

/* Fade in the login page and clear the intro background */
/**
 * Reveals the login page and clears the intro background
 * @returns {void}
 */
function revealPage() {
  els.introLogo.src = "./assets/img/Capa 2.svg";
  els.intro.style.backgroundColor = "transparent";
  els.intro.style.pointerEvents = "none";
  setTimeout(() => { els.loginPage.style.opacity = "1"; }, 200);
}

/* Swap intro logo with header logo seamlessly after flight */
/**
 * Fades the header logo in and the intro logo out after animation
 * @param {HTMLElement} headerLogo - The header logo element
 * @returns {void}
 */
function swapLogo(headerLogo) {
  setTimeout(() => {
    headerLogo.style.opacity = "1";
    els.introLogo.style.opacity = "0";
  }, 700);
}

/* Orchestrate the full intro-to-login transition */
/**
 * Starts the intro-to-login animation sequence
 * @returns {void}
 */
function showLogin() {
  if (!els.intro || !els.loginPage || !els.introLogo) return;
  setTimeout(() => {
    const headerLogo = document.querySelector('.login-header .logo');
    if (!headerLogo) return;
    prepareLoginPage();
    flyLogoToHeader(headerLogo.getBoundingClientRect());
    revealPage();
    swapLogo(headerLogo);
  }, 100);
}

/* Toggle password field visibility and update icon */
/**
 * Adds click handler to toggle password visibility and icon swap
 * @returns {void}
 */
function togglePasswordVisibility() {
  if (!els.password || !els.toggle) return;
  els.toggle.addEventListener("click", () => {
    const isHidden = els.password.type === "password";
    els.password.type = isHidden ? "text" : "password";
    els.toggle.src = isHidden ? "./assets/img/visibility.svg" : "./assets/img/visibility_off.svg";
  });
}

/* Show eye icon when password has input, show lock icon when empty */
/**
 * Shows/hides password icons depending on whether the password input has content
 * @returns {void}
 */
function updatePasswordIcons() {
  if (!els.password || !els.toggle || !els.lock) return;
  els.password.addEventListener("input", () => {
    const hasValue = els.password.value.length > 0;
    els.toggle.style.display = hasValue ? "block" : "none";
    els.lock.style.display = hasValue ? "none" : "block";
  });
}

/* Validate email and password on form submit, show error messages */
/**
 * Attaches form submit validation and shows errors if input invalid
 * @returns {void}
 */
function validateForm() {
  if (!els.form) return;
  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailValid = els.email.value.includes("@");
    const passValid = els.password.value.length >= 6;
    els.email.classList.toggle("error", !emailValid);
    els.password.classList.toggle("error", !passValid);
  });
}

/* Initialize all page functionality */
/**
 * Initializes login page behaviors
 * @returns {void}
 */
function init() {
  setIntro();
  showLogin();
  togglePasswordVisibility();
  updatePasswordIcons();
  validateForm();
}

init();