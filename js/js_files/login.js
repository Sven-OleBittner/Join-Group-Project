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

