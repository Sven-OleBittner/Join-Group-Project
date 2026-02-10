function initBoardSite() {
  checkColumns("toDoTaskList", "emptyToDo")
  checkColumns("inProgressTaskList", "emptyInProgress")
  checkColumns("awaitFeedbackTaskList", "emptyAwaitFeedback")
  checkColumns("doneTaskList", "emptyDone")
}

function checkColumns(columnId, emptyColumnId) {
  let column = document.getElementById(columnId);
  let emptyColumn = document.getElementById(emptyColumnId);
  if (column.innerHTML != "") {
    emptyColumn.classList.add("d-none");
  }
}

function chooseAddTaskSite(id) {
  if (window.innerWidth > 945) {
    generateAddTaskModal();
  } else {
    window.location.href = `add_task.html`;
  }
}

// ?status=${getStatusByButtonId(id)}

function generateAddTaskModal() {
  let dialog = document.getElementById("addTaskDialog");
  let dialogContent = document.getElementById("addTaskDialogContent");
  dialogContent.innerHTML = getAddTaskTemplate();

  // Show the dialog
  dialog.showModal();
}

function closeAddTaskModal() {
  let dialog = document.getElementById("addTaskDialog");
  dialog.close();
}

// function getStatusByButtonId(id) {
//   switch (id) {
//     case "addTaskInProgress":
//       return "inProgress";
//     case "addTaskAwaitingFeedback":
//       return "awaitFeedback";
//     default:
//       return "toDo";
//   }
// }

// let taskObject = {
//   title: "",
//   description: "",
//   dueDate: "",
//   priority: "medium",
//   assignedTo: [],
//   status: getStatusByButtonId(id),
// };


function getContactBgColorClass(task) {
  let contactsDb = getData("contacts");
  let contactsArray = Object.values(contactsDb);
  let assignedArr = task.assigned;
  let contact = contactsArray.find(contact => contact.name === assignedArr);
  let colorClass = "";
  if (contact) {
    colorClass = contact.color;
  }

  return colorClass;
}