function initSummary() {
  loadUserData();
  greetingBasedOnTime();
  loadTaskData();
}

async function loadUserData() {
  let user = await getData((path = "loggingInUser"));
  let logInUser = Object.values(user || {})[0];
  if (logInUser.name !== "Guest") {
    userFound(logInUser);
  } else {
    userInitials.innerHTML = "G";
    guestGreeting();
  }
}

function guestGreeting() {
  let greetingText = document.getElementById("greetingText");
  let greetingBox = document.getElementById("greetingBox");
  let currentHour = new Date().getHours();
  let greeting = "";
  if (currentHour < 12) {
    greeting = "Good Morning !";
  } else if (currentHour < 16) {
    greeting = "Good Day !";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon !";
  } else {
    greeting = "Good Evening !";
  }
  greetingText.innerHTML = greeting;
  greetingBox.innerHTML = greeting;
}

async function loadTaskData() {
  let tasks = await getData((path = "task"));
  let tasksArray = Object.values(tasks || {});
  let toDoTasks = sortTasks(tasksArray, "todo");
  let inProgressTasks = sortTasks(tasksArray, "inprogress");
  let awaitFeedbackTasks = sortTasks(tasksArray, "feedback");
  let doneTasks = sortTasks(tasksArray, "done");
  showTaskCount(
    tasksArray,
    toDoTasks,
    inProgressTasks,
    awaitFeedbackTasks,
    doneTasks
  );
}

function sortTasks(tasksArray, status) {
  let statusTasks = tasksArray.filter((task) => task.status === status);
  return statusTasks;
}

function showTaskCount(
  tasksArray,
  toDoTasks,
  inProgressTasks,
  awaitFeedbackTasks,
  doneTasks
) {
  document.getElementById("boardCount").innerHTML = tasksArray.length || "0";
  document.getElementById("todoCount").innerHTML = toDoTasks.length || "0";
  document.getElementById("progressCount").innerHTML =
    inProgressTasks.length || "0";
  document.getElementById("awaitingFeedbackCount").innerHTML =
    awaitFeedbackTasks.length || "0";
  document.getElementById("doneCount").innerHTML = doneTasks.length || "0";
}

function greetingBasedOnTime() {
  let greetingText = document.getElementById("greetingResp");
  let greetingBox = document.getElementById("greeting");
  let currentHour = new Date().getHours();
  let greeting = "";
  if (currentHour < 12) {
    greeting = "Good Morning, ";
  } else if (currentHour < 16) {
    greeting = "Good Day, ";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon, ";
  } else {
    greeting = "Good Evening, ";
  }
  greetingText.innerHTML = greeting;
  greetingBox.innerHTML = greeting;
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
