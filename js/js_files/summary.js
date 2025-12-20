function initSummary() {
  loadUserData();
}

async function loadUserData() {
  let user = await getData((path = "loggingInUser"));
  let logInUser = Object.values(user || {})[0];
  if (logInUser.name !== "Guest") {
    userFound(logInUser);
  } else {
    userInitials.innerHTML = "G";
    greetingText.innerHTML = "Good Morning !";
    greetingBox.innerHTML = "Good Morning !";
  }
}

function userFound(logInUser) {
  let userInitials = document.getElementById("userInitials");
  let greetingNameResp = document.getElementById("greetingNameResp");
  let greetingName = document.getElementById("greetingName");
  const nameWords = logInUser.name.split(" ");
  const initials = nameWords
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2);
  userInitials.innerHTML = initials;
  greetingNameResp.innerHTML = logInUser.name;
  greetingName.innerHTML = logInUser.name;
}
