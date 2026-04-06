/**
 * Add Task - Subtask Management
 * Handles adding, editing, deleting and rendering subtasks
 */

/**
 * Array to store subtasks
 * @type {Array<{text: string, completed: boolean}>}
 */
let subtasks = [];
let prefillSubtasks = [];

/**
 * Shows the confirm and cancel icons when typing in subtask input
 * @returns {void}
 */
function showSubtaskIcons() {
  document.getElementById("subtask-cancel-icon").classList.remove("d-none");
  document.getElementById("subtask-confirm-icon").classList.remove("d-none");
}

/**
 * Hides confirm and cancel icons
 * @returns {void}
 */
function hideSubtaskIcons() {
  document.getElementById("subtask-cancel-icon").classList.add("d-none");
  document.getElementById("subtask-confirm-icon").classList.add("d-none");
}

/**
 * Clears the subtask input and resets icons
 * @returns {void}
 */
function cancelSubtask() {
  document.getElementById("subtask-input").value = "";
  hideSubtaskIcons();
}

/**
 * Adds a new subtask to the list
 * @returns {void}
 */
function addSubtask() {
  const input = document.getElementById("subtask-input");
  const value = input.value.trim();
  if (prefillSubtasks.length > 0) {
    subtasks.push(...prefillSubtasks[0]);
    prefillSubtasks = [];
  }
  if (value) {
    subtasks.push({ text: value, completed: false });
    renderSubtasks();
    input.value = "";
    hideSubtaskIcons();
  }
}

/**
 * Renders all subtasks in the subtask list
 * @returns {void}
 */
function renderSubtasks() {
  const list = document.getElementById("subtask-list");
  list.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    list.innerHTML += getSubtaskHTML(subtask, index);
  });
}

/**
 * Switches a subtask to edit mode
 * @param {number} index - The index of the subtask to edit
 * @returns {void}
 */
function editSubtask(index) {
  const item = document.getElementById("subtask-" + index);
  const currentText = chooseSubtaskArray(index);
  item.outerHTML = getSubtaskEditHTML(currentText, index);
  document.getElementById("subtask-edit-input-" + index).focus();
}

/**
 * Chooses the correct subtask text from either prefillSubtasks or subtasks array
 * @param {number} index - The index of the subtask
 * @returns {string} The text of the subtask
 */
function chooseSubtaskArray(index) {
  switch (true) {
    case prefillSubtasks.length > 0:
      return prefillSubtasks[0][index].text;
    default:
      return subtasks[index].text;
  }
}

/**
 * Confirms the edit of a subtask
 * @param {number} index - The index of the subtask
 * @returns {void}
 */
function confirmEditSubtask(index) {
  const input = document.getElementById("subtask-edit-input-" + index);
  const value = input.value.trim();
  switch (true) {
    case prefillSubtasks.length > 0:
      subtasks.push(...prefillSubtasks[0]);
      prefillSubtasks = [];
      break;
    default:
      subtasks[index] = {
        text: subtasks[index].text,
        completed: subtasks[index].completed,
      };
  }
  if (value) {
    subtasks[index] = { text: value, completed: subtasks[index].completed };
  }
  renderSubtasks();
}

/**
 * Deletes a subtask from the list
 * @param {number} index - The index of the subtask to delete
 * @returns {void}
 */
function deleteSubtask(index) {
  switch (true) {
    case prefillSubtasks.length > 0:
      subtasks.push(...prefillSubtasks[0]);
      prefillSubtasks = [];
      break;
    default:
      subtasks[index] = {
        text: subtasks[index].text,
        completed: subtasks[index].completed,
      };
  }
  subtasks.splice(index, 1);
  renderSubtasks();
}
