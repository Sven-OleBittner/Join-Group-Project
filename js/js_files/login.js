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
    console.log("user gefunden");
  } else {
    console.log("user nicht registriert");
  }
}

function showMsg() {
  // Source - https://stackoverflow.com/a
  // Posted by Artem Barger, modified by community. See post 'Timeline' for change history
  // Retrieved 2025-11-23, License - CC BY-SA 4.0
    let msgBox = document.getElementById("msgBox");
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get("msg");
  if (msg) {
    msgBox.innerHTML = msg;
  } else {
    msgBox.style.display = 'none';
  }
}
