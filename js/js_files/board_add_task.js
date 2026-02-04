function generateAddTaskModal() {
  let dialog = document.getElementById("addTaskDialog");
  let dialogContent = document.getElementById("addTaskDialogContent");
  dialogContent.innerHTML = getAddTaskTemplate();

  // Show the dialog
  dialog.showModal();
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
