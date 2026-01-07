// const BASE_URL =
//     "https://join-1314-default-rtdb.europe-west1.firebasedatabase.app/";
let currentData = [];
let selectedContactKey = null;

// Available color classes from color.css
const colorClasses = [
    'color-orange',
    'color-pink',
    'color-purple',
    'color-violet',
    'color-cyan',
    'color-turquoise',
    'color-coral',
    'color-peach',
    'color-light-pink',
    'color-yellow',
    'color-blue',
    'color-lime-green',
    'color-light-yellow',
    'color-red',
    'color-goldenrod'
];

/**
 * Gets a random color class from the available color classes
 * @returns {string} A random color class name
 */
function getRandomColorClass() {
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
}

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

/**
 * Displays detailed contact information in the contact details section
 * @param {string} name - Contact's full name
 * @param {string} email - Contact's email address
 * @param {string} phone - Contact's phone number
 * @param {string} firebaseKey - Firebase database key for the contact
 * @param {string} randomColor - CSS color class for the contact initials circle
 */
function showContactDetails(name, email, phone, firebaseKey, randomColor) {
    selectedContactKey = firebaseKey;
    showContactDetailsSection();
    updateContactDisplayName(name);
    updateContactInitials(name, randomColor);
    updateContactEmail(email);
    updateContactPhone(phone);
}

/**
 * Shows the contact details section by removing hidden class from elements
 */
function showContactDetailsSection() {
    const contactDetailsSection = document.getElementById('contact-details-section');
    const contactInfoLabel = document.getElementById('contact-info-label');
    const contactEmailSection = document.getElementById('contact-email-section');
    const contactPhoneSection = document.getElementById('contact-phone-section');
    if (contactDetailsSection) contactDetailsSection.classList.remove('hidden');
    if (contactInfoLabel) contactInfoLabel.classList.remove('hidden');
    if (contactEmailSection) contactEmailSection.classList.remove('hidden');
    if (contactPhoneSection) contactPhoneSection.classList.remove('hidden');
}

/**
 * Updates the display name in the contact details section
 * @param {string} name - The contact's full name to display
 */
function updateContactDisplayName(name) {
    const nameElement = document.getElementById('contact-display-name');
    if (nameElement) {
        nameElement.textContent = name;
    }
}

/**
 * Updates the contact initials circle with the contact's initials
 * @param {string} name - The contact's full name to generate initials from
 * @param {string} randomColor - CSS color class to apply to the contact initials circle
 */
function updateContactInitials(name, randomColor) {
    const nameWords = name.split(' ');
    const initials = nameWords.map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);
    const circleElement = document.getElementById('contact-initials-circle');
    if (circleElement) {
        circleElement.textContent = initials;
        colorClasses.forEach(colorClass => {
            circleElement.classList.remove(colorClass);
        });
        circleElement.classList.add(randomColor);
    }
}

/**
 * Updates the email link in the contact details section
 * @param {string} email - The contact's email address
 */
function updateContactEmail(email) {
    const emailLink = document.getElementById('contact-email-link');
    if (emailLink) {
        emailLink.textContent = email;
        emailLink.href = `mailto:${email}`;
    }
}

/**
 * Updates the phone link in the contact details section
 * @param {string} phone - The contact's phone number
 */
function updateContactPhone(phone) {
    const phoneLink = document.getElementById('contact-phone-link');
    if (phoneLink) {
        phoneLink.textContent = phone;
        phoneLink.href = `tel:${phone}`;
    }
}

/**
 * Deletes the currently selected contact from the database and updates UI
 * @async
 * @returns {Promise<void>}
 */
async function deleteSelectedContact() {
    if (!selectedContactKey) {
        console.error("No contact selected for deletion.");
        return;
    }
    try {
        await deleteContactFromDatabase(selectedContactKey);
        closeEditContactOverlay();
        hideContactDetailsSection();
        selectedContactKey = null;
        await loadContactList();
    } catch (error) {
        console.error("Error deleting contact:", error);
    }
}

/**
 * Deletes a contact from Firebase database by its key
 * @async
 * @param {string} firebaseKey - The Firebase database key of the contact to delete
 * @returns {Promise<void>}
 */
async function deleteContactFromDatabase(firebaseKey) {
    await fetch(BASE_URL + "contacts/" + firebaseKey + ".json", {
        method: "DELETE"
    });
}

/**
 * Hides the contact details section by adding hidden class to elements
 */
function hideContactDetailsSection() {
    const contactDetailsSection = document.getElementById('contact-details-section');
    const contactInfoLabel = document.getElementById('contact-info-label');
    const contactEmailSection = document.getElementById('contact-email-section');
    const contactPhoneSection = document.getElementById('contact-phone-section');
    if (contactDetailsSection) contactDetailsSection.classList.add('hidden');
    if (contactInfoLabel) contactInfoLabel.classList.add('hidden');
    if (contactEmailSection) contactEmailSection.classList.add('hidden');
    if (contactPhoneSection) contactPhoneSection.classList.add('hidden');
}

/**
 * Opens the add contact overlay with the contact form template
 */
function openAddContactOverlay() {
    const contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = addContactTemplate();
}

/**
 * Closes the add contact overlay and reloads the contact list
 * @async
 * @returns {Promise<void>}
 */
async function closeAddContactOverlay() {
    const contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = "";
    await loadContactList();
}

/**
 * Posts data to Firebase database at specified path
 * @async
 * @param {string} path - The database path to post to (default: "")
 * @param {Object} data - The data object to post
 * @returns {Promise<void>}
 */
async function postData(path = "", data) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error(`POST request failed: ${response.status} ${response.statusText}`);
    }
}

/**
 * Fetches data from Firebase database at specified path
 * @async
 * @param {string} path - The database path to fetch from (default: "")
 * @returns {Promise<Object>} The fetched data object
 */
async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    if (!response.ok) {
        console.error(`GET request failed: ${response.status} ${response.statusText}`);
    }
    let responseData = await response.json();
    return responseData;
}

/**
 * Validates all input fields in the add contact form
 * @returns {boolean} True if all validations pass, false otherwise
 */
function validationAddContactInput() {
    const addName = document.getElementById("add-name");
    const addEmail = document.getElementById("add-email");
    const addPhone = document.getElementById("add-phone");
    const addNameValidation = document.getElementById("add-name-validation");
    const addEmailValidation = document.getElementById("add-email-validation");
    const addPhoneValidation = document.getElementById("add-phone-validation");
    const nameError = validateName(addName.value, true);
    const emailError = validateEmail(addEmail.value, true);
    const phoneError = validatePhone(addPhone.value, true);
    setValidationMessage(addNameValidation, nameError);
    setValidationMessage(addEmailValidation, emailError);
    setValidationMessage(addPhoneValidation, phoneError);
    return nameError === true && emailError === true && phoneError === true;
}

/**
 * Creates and posts a new contact to the database after validation
 * @async
 * @returns {Promise<void>}
 */
async function postNewContact() {
    if (!validationAddContactInput()) {
        console.error("Validation failed.");
        return;
    }
    const addName = document.getElementById("add-name");
    const addEmail = document.getElementById("add-email");
    const addPhone = document.getElementById("add-phone");
    const newContact = {
        name: addName.value,
        email: addEmail.value,
        phone: addPhone.value
    };
    try {
        await postData("contacts", newContact);
        showSuccesfullyContactCreated();
        closeAddContactOverlay();
    } catch (error) {
        console.error("Error posting new contact:", error);
    }
}

/**
 * Validates name input field and displays validation message
 * @param {HTMLInputElement} inputElement - The name input element to validate
 */
function validateNameInput(inputElement) {
    const error = validateName(inputElement.value);
    const validationElement = document.getElementById("add-name-validation");
    setValidationMessage(validationElement, error);
}

/**
 * Validates email input field and displays validation message
 * @param {HTMLInputElement} inputElement - The email input element to validate
 */
function validateEmailInput(inputElement) {
    const error = validateEmail(inputElement.value);
    const validationElement = document.getElementById("add-email-validation");
    setValidationMessage(validationElement, error);
}