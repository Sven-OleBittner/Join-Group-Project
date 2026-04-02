function checkColumns(columnId, emptyColumnId) {
  let column = document.getElementById(columnId);
  let emptyColumn = document.getElementById(emptyColumnId);
  if (column.innerHTML !== "") {
    emptyColumn.classList.add("d-none");
  } else {
    emptyColumn.classList.remove("d-none");
  }
}

function chooseAddTaskSite(buttonId) {
  if (window.innerWidth > 945) {
    generateAddTaskModal(buttonId);
  } else {
    window.location.href = `add_task.html?id=${buttonId}`;
  }
}

function generateAddTaskModal(buttonId) {
  let dialog = document.getElementById("addTaskDialog");
  let dialogContent = document.getElementById("addTaskDialogContent");
  dialogContent.innerHTML = getAddTaskTemplate(buttonId);

  // Show the dialog
  dialog.showModal();
}

function closeAddTaskModal() {
  let dialog = document.getElementById("addTaskDialog");
  dialog.close();
}

/**
 * Renders all subtasks in the subtask list
 * @returns {void}
 */
function preFillSubtasks(subtasks) {
  const list = document.getElementById("subtask-list");
  list.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    list.innerHTML += getSubtaskHTML(subtask, index);
  });
}

// /**
//  * Chooses the correct subtask text from either prefillSubtasks or subtasks array
//  * @param {number} index - The index of the subtask
//  * @returns {string} The text of the subtask
//  */
// function chooseSubtaskArray(index) {
//   let subtask = prefillSubtasks[0][index];
//   if (subtask.text) {
//     subtasks.push(subtask);
//     return subtask.text;
//   } else {
//     return subtasks[index].text;
//   }
// }
