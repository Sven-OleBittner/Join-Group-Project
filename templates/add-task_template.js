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