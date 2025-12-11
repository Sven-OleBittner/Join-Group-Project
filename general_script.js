async function loggingOutUser() {
  await deleteData((path = "loggingInUser"));
  window.location.href = "index.html?msg=You have been logged out!";
}

async function searchForLoginUser() {
  let loginUser = await getData((path = "loggingInUser"));
  if (!loginUser) {
    window.location.href = "index.html";
  }
}
