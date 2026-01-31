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
  const publicPages = ['index.html', 'signup.html', 'privacy_policy_before_logged_in.html', 'legal_notice.html'];
  const currentPage = window.location.pathname.split('/').pop();
  if (publicPages.includes(currentPage)) {
    return;
  }
  let loginUser = await getData((path = "loggingInUser"));
  if (!loginUser) {
    window.location.href = "index.html";
  }
}
