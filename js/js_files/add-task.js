/**
 * Initializes the Add Task page
 * Sets default priority and loads contacts for the assignees dropdown
 * @async
 * @returns {Promise<void>}
 */
async function add_task_init(){
    standartselectPriority();
    await loadContactsForDropdown();
}

/**
 * Loads contacts from Firebase and renders them in the assignees dropdown
 * @async
 * @returns {Promise<void>}
 */
async function loadContactsForDropdown() {
    const contacts = await fetchContactsFromDatabase();
    const container = document.getElementById('assignees-items');
    container.innerHTML = '';
    contacts.forEach(contact => {
        container.innerHTML += getContacts(contact);
    });
}

/**
 * Fetches all contacts from Firebase database and stores them in currentData
 * @async
 * @returns {Promise<Array>} Array of contact objects with Firebase keys
 */
async function fetchContactsFromDatabase() {
    const data = await getData("/contacts");
    currentData = [];
    if (data) {
        for (let firebaseKey in data) {
            const contact = data[firebaseKey];
            contact.firebaseKey = firebaseKey;
            currentData.push(contact);
        }
    }
    return currentData;
}

/**
 * Generates HTML for a contact item in the dropdown
 * @param {Object} contact - Contact object with name, initials, color, and firebaseKey
 * @returns {string} HTML string for the contact option
 */
function getContacts(contact) {
  return `
    <div class="contact-option" onclick="toggleContactSelection('${contact.firebaseKey}')">
      <div class="avatar ${contact.color}">${contact.initials}</div>
      <span class="name">${contact.name}</span>
      <input type="checkbox" id="contact-${contact.firebaseKey}" onclick="event.stopPropagation()">
    </div>
  `;
}

/**
 * Toggles the selection state of a contact and updates the display
 * @param {string} firebaseKey - The Firebase key of the contact to toggle
 * @returns {void}
 */
function toggleContactSelection(firebaseKey) {
  const checkbox = document.getElementById('contact-' + firebaseKey);
  checkbox.checked = !checkbox.checked;
  updateSelectedContactsDisplay();
}

/**
 * Updates the display of selected contacts as avatar chips below the dropdown
 * @returns {void}
 */
function updateSelectedContactsDisplay() {
  const selectedContacts = getSelectedContacts();
  const chipsContainer = document.getElementById('assigned-chips');
  chipsContainer.innerHTML = '';
  
  selectedContacts.forEach(contact => {
    chipsContainer.innerHTML += `
      <div class="avatar-chip ${contact.color}">${contact.initials}</div>
    `;
  });
}

/**
 * Gets all currently selected contacts
 * @returns {Array} Array of selected contact objects
 */
function getSelectedContacts() {
  const selectedContacts = [];
  currentData.forEach(contact => {
    const checkbox = document.getElementById('contact-' + contact.firebaseKey);
    if (checkbox.checked) {
      selectedContacts.push(contact);
    }
  });
  return selectedContacts;
}

/**
 * Toggles the visibility of a dropdown menu
 * @param {string} id - The ID of the dropdown to toggle
 * @returns {void}
 */
function toggleDropdown(id) {
  const items = document.getElementById(id + '-items');
  items.classList.toggle('select-hide');
}

/**
 * Selects a category option and closes the category dropdown
 * @param {string} value - The category value to select
 * @returns {void}
 */
function selectCategoryOption(value) {
  document.getElementById('category-selected').textContent = value;
  document.getElementById('category-items').classList.add('select-hide');
}

/**
 * Selects a priority level and updates the UI accordingly
 * @param {string} priority - The priority level to select ('urgent', 'medium', or 'low')
 * @returns {void}
 */
function selectPriority(priority) {
  document.getElementById('priority-urgent').classList.remove('selected');
  document.getElementById('priority-medium').classList.remove('selected');
  document.getElementById('priority-low').classList.remove('selected');
  document.getElementById('priority-' + priority).classList.add('selected');
}

/**
 * Sets the default priority selection to 'medium' on page load
 * @returns {void}
 */
function standartselectPriority() {
  document.getElementById('priority-medium').classList.add('selected');
}

/**
 * Array to store subtasks
 * @type {Array<string>}
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
    subtasks.push(value);
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
 * @param {string} subtask - The subtask text
 * @param {number} index - The index of the subtask
 * @returns {string} HTML string for the subtask item
 */
function getSubtaskHTML(subtask, index) {
  return `
    <div class="subtask-item" id="subtask-${index}">
      <span class="subtask-item-text">${subtask}</span>
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
  const currentText = subtasks[index];
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
    subtasks[index] = value;
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
