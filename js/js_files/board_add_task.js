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
  // Ensure date picker cannot select past dates
  try {
    if (typeof setDateMinToday === 'function') setDateMinToday();
  } catch (e) {
    console.warn('setDateMinToday not available', e);
  }
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