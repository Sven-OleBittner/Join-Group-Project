
function initSummary() {
  loadUserData();
}

async function loadUserData() {
  let user = await getData((path = "loggingInUser"));
  let logInUser = Object.values(user || {})[0];
  userFound(logInUser);
}

function userFound(logInUser) {
  let userInitials = document.getElementById("userInitials");
  const nameWords = logInUser.name.split(" ");
  const initials = nameWords
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2);
  userInitials.innerHTML = initials;
}
