function initSite() {
  searchForLoginUser();
}

async function loggingOutUser() {
  await deleteData((path = "loggingInUser"));
  setTimeout(() => {
    window.location.href = "index.html?msg=You have been logged out!";
  }, 500);
}

async function searchForLoginUser() {
  let loginUser = await getData((path = "loggingInUser"));
  if (!loginUser) {
    window.location.href = "index.html";
  }
}
