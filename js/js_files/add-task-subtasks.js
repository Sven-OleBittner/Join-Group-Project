/**
 * Add Task - Subtask Management
 * Handles adding, editing, deleting and rendering subtasks
 */

/**
 * Array to store subtasks
 * @type {Array<{text: string, completed: boolean}>}
 */
let subtasks = [];

/**
 * Shows the confirm and cancel icons when typing in subtask input
 * @returns {void}
 */
function showSubtaskIcons() {
  document.getElementById('subtask-cancel-icon').classList.remove('d-none');
  document.getElementById('subtask-confirm-icon').classList.remove('d-none');
}

/**
 * Hides confirm and cancel icons
 * @returns {void}
 */
function hideSubtaskIcons() {
  document.getElementById('subtask-cancel-icon').classList.add('d-none');
  document.getElementById('subtask-confirm-icon').classList.add('d-none');
}

/**
 * Clears the subtask input and resets icons
 * @returns {void}
 */
function cancelSubtask() {
  document.getElementById('subtask-input').value = '';
  hideSubtaskIcons();
}

/**
 * Adds a new subtask to the list
 * @returns {void}
 */
function addSubtask() {
  const input = document.getElementById('subtask-input');
  const value = input.value.trim();
  if (value) {
    subtasks.push({ "text": value, "completed": false });
    renderSubtasks();
    input.value = '';
    hideSubtaskIcons();
  }
}

/**
 * Renders all subtasks in the subtask list
 * @returns {void}
 */
function renderSubtasks() {
  const list = document.getElementById('subtask-list');
  list.innerHTML = '';
  subtasks.forEach((subtask, index) => {
    list.innerHTML += getSubtaskHTML(subtask, index);
  });
}

/**
 * Generates HTML for a subtask item
 * @param {Object} subtask - The subtask object
 * @param {number} index - The index of the subtask
 * @returns {string} HTML string for the subtask item
 */
function getSubtaskHTML(subtask, index) {
  return `
    <div class="subtask-item" id="subtask-${index}">
      <span class="subtask-item-text">${subtask.text}</span>
      <div class="subtask-item-actions">
        <img src="./assets/img/contact_edit_pen.svg" alt="Edit" onclick="editSubtask(${index})">
        <span class="subtask-item-divider"></span>
        <img src="./assets/img/contact-main-delete.svg" alt="Delete" onclick="deleteSubtask(${index})">
      </div>
    </div>
  `;
}

/**
 * Switches a subtask to edit mode
 * @param {number} index - The index of the subtask to edit
 * @returns {void}
 */
function editSubtask(index) {
  const item = document.getElementById('subtask-' + index);
  const currentText = subtasks[index].text;
  item.outerHTML = getSubtaskEditHTML(currentText, index);
  document.getElementById('subtask-edit-input-' + index).focus();
}

/**
 * Generates HTML for a subtask in edit mode
 * @param {string} text - The current subtask text
 * @param {number} index - The index of the subtask
 * @returns {string} HTML string for the edit mode
 */
function getSubtaskEditHTML(text, index) {
  return `
    <div class="subtask-item-edit" id="subtask-${index}">
      <input type="text" id="subtask-edit-input-${index}" value="${text}">
      <div class="subtask-item-edit-actions">
        <img src="./assets/img/contact-main-delete.svg" alt="Delete" onclick="deleteSubtask(${index})">
        <span class="subtask-item-divider"></span>
        <img src="./assets/img/check.svg" alt="Confirm" onclick="confirmEditSubtask(${index})">
      </div>
    </div>
  `;
}

/**
 * Confirms the edit of a subtask
 * @param {number} index - The index of the subtask
 * @returns {void}
 */
function confirmEditSubtask(index) {
  const input = document.getElementById('subtask-edit-input-' + index);
  const value = input.value.trim();
  if (value) {
    subtasks[index] = { "text": value, "completed": subtasks[index].completed };
  }
  renderSubtasks();
}

/**
 * Deletes a subtask from the list
 * @param {number} index - The index of the subtask to delete
 * @returns {void}
 */
function deleteSubtask(index) {
  subtasks.splice(index, 1);
  renderSubtasks();
}
