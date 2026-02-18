/**
 * Add Task - Contact Management
 * Handles loading, rendering, selecting and clearing contacts in the assignees dropdown
 */

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
    if (checkbox && checkbox.checked) {
      selectedContacts.push(contact);
    }
  });
  return selectedContacts;
}

/**
 * Clears all selected contacts and updates the display
 * @returns {void}
 */
function clearAssignedContacts() {
  currentData.forEach(contact => {
    const checkbox = document.getElementById('contact-' + contact.firebaseKey);
    if (checkbox) {
      checkbox.checked = false;
    }
  });
  document.getElementById('assigned-chips').innerHTML = '';
}
