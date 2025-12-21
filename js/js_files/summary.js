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
  showUrgent(tasksArray);
}

function sortTasks(tasksArray, status) {
  let statusTasks = tasksArray.filter((task) => task.status === status);
  return statusTasks;
}

function showTaskCount(tasksArray,toDoTasks,inProgressTasks,awaitFeedbackTasks,doneTasks) {
  document.getElementById("boardCount").innerHTML = tasksArray.length || "0";
  document.getElementById("todoCount").innerHTML = toDoTasks.length || "0";
  document.getElementById("progressCount").innerHTML =
    inProgressTasks.length || "0";
  document.getElementById("awaitingFeedbackCount").innerHTML =
    awaitFeedbackTasks.length || "0";
  document.getElementById("doneCount").innerHTML = doneTasks.length || "0";
}

function showUrgent(tasksArray) {
  let urgentTasks = tasksArray.filter((task) => task.priority === "urgent");
  document.getElementById("urgentCount").innerHTML = urgentTasks.length || "0";
  document.getElementById("urgentDate").innerHTML = getNextUrgentDate(urgentTasks);
}

function getNextUrgentDate(urgentTasks) {
  if (urgentTasks.length === 0) return "No date set";
  let sortedTasks = urgentTasks.sort((a, b) => parseDateValue(a.dueDate) - parseDateValue(b.dueDate));
  return sortedTasks[0].dueDate ? formatDate(parseDateValue(sortedTasks[0].dueDate)) : "No date set";
}

function parseDateValue(dateValue) {
  if (!dateValue) return new Date();
  if (typeof dateValue === 'string' && dateValue.includes('/')) {
    const [day, month, year] = dateValue.split('/');
    return new Date(year, month - 1, day);
  }
  if (typeof dateValue === 'object' && dateValue.year) {
    return new Date(dateValue.year, (dateValue.month - 1), dateValue.day);
  }
  return new Date(dateValue);
}

function formatDate(date) {
  if (!date || isNaN(date.getTime())) {
    return "No date set";
  }
  const months = ["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

function greetingBasedOnTime() {
  let currentHour = new Date().getHours();
  let greeting = currentHour < 12 ? "Good Morning, " :
                 currentHour < 18 ? "Good Afternoon, " : "Good Evening, ";
  document.getElementById("greetingResp").innerHTML = greeting;
  document.getElementById("greeting").innerHTML = greeting;
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
