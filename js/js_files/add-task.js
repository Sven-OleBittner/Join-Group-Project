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
