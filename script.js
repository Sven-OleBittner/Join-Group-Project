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

/* Set initial logo and background for intro */
function setIntro() {
  if (!els.intro || !els.loginPage || !els.introLogo) return;
  const isMobile = window.innerWidth <= 480;
  els.introLogo.src = isMobile ? "./assets/img/Capa 2white.svg" : "./assets/img/Capa 2.svg";
  els.intro.style.backgroundColor = isMobile ? "#2A3647" : "transparent";
}

/*
  Анімація — одна пряма фаза:
  Лого летить з центру одразу до хедера (розмір + позиція змінюються разом)
  Ніякого зменшення на місці — відразу в політ!
*/
function showLogin() {
  if (!els.intro || !els.loginPage || !els.introLogo) return;

  // Невелика затримка щоб сторінка завантажилась і хедер зайняв місце
  setTimeout(() => {
    const headerLogo = document.querySelector('.login-header .logo');
    if (!headerLogo) return;

    // Показуємо сторінку (прозору) щоб хедер вже був у DOM з правильною позицією
    els.loginPage.style.opacity = "0";
    els.loginPage.style.visibility = "visible";

    // Force reflow — щоб браузер прорахував позицію хедерного лого
    void els.introLogo.offsetWidth;

    const rect = headerLogo.getBoundingClientRect();

    // ВІДРАЗУ летимо від центру до хедера — один transition, без проміжних кроків
    els.introLogo.style.top       = rect.top + 'px';
    els.introLogo.style.left      = rect.left + 'px';
    els.introLogo.style.width     = rect.width + 'px';
    els.introLogo.style.height    = rect.height + 'px';
    els.introLogo.style.transform = 'none';

    // Фон зникає і сторінка з'являється поки лого летить
    els.introLogo.src = "./assets/img/Capa 2.svg";
    els.intro.style.backgroundColor = "transparent";
    els.intro.style.pointerEvents = "none";

    setTimeout(() => {
      els.loginPage.style.opacity = "1";
    }, 200);

    // Після польоту (0.7s) — seamless swap
    setTimeout(() => {
      headerLogo.style.opacity = "1";
      els.introLogo.style.opacity = "0";
    }, 700);

  }, 100); // мінімальна затримка — тільки щоб DOM завантажився
}

/* Toggle password field between text and password */
function togglePasswordVisibility() {
  if (!els.password || !els.toggle) return;
  els.toggle.addEventListener("click", () => {
    const isHidden = els.password.type === "password";
    els.password.type = isHidden ? "text" : "password";
    els.toggle.src = isHidden ? "./assets/img/visibility.svg" : "./assets/img/visibility_off.svg";
  });
}

/* Show/hide password icons based on input */
function updatePasswordIcons() {
  if (!els.password || !els.toggle || !els.lock) return;
  els.password.addEventListener("input", () => {
    const hasValue = els.password.value.length > 0;
    els.toggle.style.display = hasValue ? "block" : "none";
    els.lock.style.display = hasValue ? "none" : "block";
  });
}

/* Validate form on submit and show errors */
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