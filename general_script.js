function initSite() {
  searchForLoginUser();
}

/**
 * Checks if a user is logged in and redirects to login page if not.
 * Public pages (login, signup, privacy policy, legal notice) are excluded from this check.
 * @async
 * @returns {Promise<void>}
 */
async function searchForLoginUser() {
  let user = await getData("loggingInUser");
  let logInUser = Object.values(user || {})[0];
  const publicPages = [
    "index.html",
    "signup.html",
    "privacy_policy_before_logged_in.html",
    "legal_notice_before_logged_in.html",
  ];
  const currentPage = window.location.pathname.split("/").pop();
  if (publicPages.includes(currentPage)) {
    return;
  }
  if (!logInUser) {
    window.location.href = "index.html";
  }
  showUserInitials(logInUser);
}

function showUserInitials(logInUser) {
  let userInitials = document.getElementById("userInitials");
  const nameWords = logInUser.name.split(" ");
  const initials = nameWords
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2);
  userInitials.innerHTML = initials;
}

function removeMsgFromUrl() {
    const url = new URL(window.location);
    url.searchParams.delete("msg");
    const newUrl = url.pathname + (url.search ? url.search : "") + (url.hash ? url.hash : "");
    window.history.replaceState(null, document.title, newUrl);
}

