/**
 * Contact Management - Contact List Display
 * This module handles the loading and display of the contact list
 */

/**
 * Loads and displays the complete contact list with alphabetical grouping
 * @async
 * @returns {Promise<void>}
 */
async function loadContactList() {
    const contacts = await fetchContactsFromDatabase();
    const validContacts = filterValidContacts(contacts);
    const sortedContacts = sortContactsAlphabetically(validContacts);
    const groupedByLetter = groupContactsByFirstLetter(sortedContacts);
    displayContactsGroupedByLetter(groupedByLetter);

    // Initialize mobile resize handler
    initializeMobileHandler();
}

/**
 * Displays contacts grouped by letter in the DOM
 * @param {Object} groupedContacts - Object with letters as keys and contact arrays as values
 */
function displayContactsGroupedByLetter(groupedContacts) {
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = "";
    const alphabeticalLetters = Object.keys(groupedContacts).sort();
    alphabeticalLetters.forEach(letter => {
        addLetterHeaderToDOM(contactList, letter);
        addContactsForLetterToDOM(contactList, groupedContacts[letter]);
    });
}

/**
 * Adds a letter header to the contact list container
 * @param {HTMLElement} container - The DOM container to add the header to
 * @param {string} letter - The letter to display as header
 */
function addLetterHeaderToDOM(container, letter) {
    container.innerHTML += getFirstLetter(letter);
}

/**
 * Adds contact cards for a specific letter to the DOM container
 * @param {HTMLElement} container - The DOM container to add contacts to
 * @param {Array} contacts - Array of contact objects to display
 */
function addContactsForLetterToDOM(container, contacts) {
    contacts.forEach(contact => {
        container.innerHTML += getContact(contact);
    });
}
