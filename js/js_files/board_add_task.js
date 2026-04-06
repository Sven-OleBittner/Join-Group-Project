/**
 * Shows or hides the "empty column" placeholder depending on column content
 * @param {string} columnId - ID of the column container
 * @param {string} emptyColumnId - ID of the placeholder element
 * @returns {void}
 */
function checkColumns(columnId, emptyColumnId) {
  let column = document.getElementById(columnId);
  let emptyColumn = document.getElementById(emptyColumnId);
  if (column.innerHTML !== "") {
    emptyColumn.classList.add("d-none");
  } else {
    emptyColumn.classList.remove("d-none");
  }
}

/**
 * Chooses whether to open add-task modal or navigate to add_task page on mobile
 * @param {string} buttonId - ID of the trigger button
 * @returns {void}
 */
function chooseAddTaskSite(buttonId) {
  if (window.innerWidth > 945) {
    generateAddTaskModal(buttonId);
  } else {
    window.location.href = `add_task.html?id=${buttonId}`;
  }
}


/**
 * Renders and opens the add task modal dialog
 * @param {string} buttonId - ID passed to template for initial state
 * @returns {void}
 */
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

/**
 * Closes the add task modal dialog
 * @returns {void}
 */
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