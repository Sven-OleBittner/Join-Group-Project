/**
 * Contact Management - Utility Functions
 */

/**
 * Gets initials from a name (first letter of first two words)
 * @param {string} name - The full name
 * @returns {string} The initials (max 2 characters)
 */
function getInitials(name) {
    const nameWords = name.split(' ');
    return nameWords.map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);
}

/**
 * Filters out invalid contacts (null, undefined, or empty names)
 * @param {Array} contacts - Array of contact objects to filter
 * @returns {Array} Array of valid contact objects
 */
function filterValidContacts(contacts) {
    return contacts.filter(contact => contact && contact.name && contact.name.trim() !== "");
}

/**
 * Sorts contacts alphabetically by name
 * @param {Array} contacts - Array of contact objects to sort
 * @returns {Array} Alphabetically sorted array of contacts
 */
function sortContactsAlphabetically(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Groups contacts by their first letter for alphabetical display
 * @param {Array} contacts - Array of contact objects to group
 * @returns {Object} Object with letters as keys and contact arrays as values
 */
function groupContactsByFirstLetter(contacts) {
    const groupedContacts = {};
    contacts.forEach(contact => {
        const firstLetter = getFirstLetterFromName(contact.name);
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }
        groupedContacts[firstLetter].push(contact);
    });
    return groupedContacts;
}

/**
 * Extracts and returns the first letter from a name in uppercase
 * @param {string} name - The name to extract the first letter from
 * @returns {string} First letter in uppercase
 */
function getFirstLetterFromName(name) {
    return name.charAt(0).toUpperCase();
}

/**
 * Finds a contact in currentData by its Firebase key
 * @param {string} firebaseKey - The Firebase key to search for
 * @returns {Object|undefined} The contact object or undefined if not found
 */
function findContactByKey(firebaseKey) {
    return currentData.find(contact => contact.firebaseKey === firebaseKey);
}

/**
 * Displays a success notification message when a contact is successfully created
 * Uses insertAdjacentHTML('beforeend') to add the notification HTML at the end of the body element
 * The CSS animation handles the display duration and automatic removal after 3 seconds
 */
function getSuccessfullyContactCreated() {
    let body = document.querySelector("body");
    body.insertAdjacentHTML('beforeend', getMessageSuccessfullyAdded());
}
