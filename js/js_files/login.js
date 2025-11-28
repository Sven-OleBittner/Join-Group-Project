let users = [];

function init() {
  dataToUsers();
  showMsg();
}

async function dataToUsers() {
  let user = await getData((path = "user"));
  users = Object.values(user || {});
}

function login() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let user = users.find(
    (u) => u.email == email.value && u.password == password.value
  );
  if (user) {
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
