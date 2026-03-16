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
function setIntro() {
  if (!els.intro || !els.loginPage || !els.introLogo) return;
  const isMobile = window.innerWidth <= 480;
  els.introLogo.src = isMobile ? "./assets/img/Capa 2white.svg" : "./assets/img/Capa 2.svg";
  els.intro.style.backgroundColor = isMobile ? "#2A3647" : "transparent";
}

/* Prepare the login page (invisible) so the header occupies its position in DOM */
function prepareLoginPage() {
  els.loginPage.style.opacity = "0";
  els.loginPage.style.visibility = "visible";
  void els.introLogo.offsetWidth;
}

/* Move intro logo directly to the exact position of the header logo */
function flyLogoToHeader(rect) {
  els.introLogo.style.top = rect.top + 'px';
  els.introLogo.style.left = rect.left + 'px';
  els.introLogo.style.width = rect.width + 'px';
  els.introLogo.style.height = rect.height + 'px';
  els.introLogo.style.transform = 'none';
}

/* Fade in the login page and clear the intro background */
function revealPage() {
  els.introLogo.src = "./assets/img/Capa 2.svg";
  els.intro.style.backgroundColor = "transparent";
  els.intro.style.pointerEvents = "none";
  setTimeout(() => { els.loginPage.style.opacity = "1"; }, 200);
}

/* Swap intro logo with header logo seamlessly after flight */
function swapLogo(headerLogo) {
  setTimeout(() => {
    headerLogo.style.opacity = "1";
    els.introLogo.style.opacity = "0";
  }, 700);
}

/* Orchestrate the full intro-to-login transition */
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
function togglePasswordVisibility() {
  if (!els.password || !els.toggle) return;
  els.toggle.addEventListener("click", () => {
    const isHidden = els.password.type === "password";
    els.password.type = isHidden ? "text" : "password";
    els.toggle.src = isHidden ? "./assets/img/visibility.svg" : "./assets/img/visibility_off.svg";
  });
}

/* Show eye icon when password has input, show lock icon when empty */
function updatePasswordIcons() {
  if (!els.password || !els.toggle || !els.lock) return;
  els.password.addEventListener("input", () => {
    const hasValue = els.password.value.length > 0;
    els.toggle.style.display = hasValue ? "block" : "none";
    els.lock.style.display = hasValue ? "none" : "block";
  });
}

/* Validate email and password on form submit, show error messages */
function validateForm() {
  if (!els.form) return;
  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailValid = els.email.value.includes("@");
    const passValid = els.password.value.length >= 6;
    els.email.classList.toggle("error", !emailValid);
    els.password.classList.toggle("error", !passValid);
    els.passwordError.style.display = passValid ? "none" : "flex";
    if (emailValid && passValid) console.log("Log in successful!");
  });
}

/* Initialize all page functionality */
function init() {
  setIntro();
  showLogin();
  togglePasswordVisibility();
  updatePasswordIcons();
  validateForm();
}

init();