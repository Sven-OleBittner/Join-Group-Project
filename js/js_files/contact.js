const BASE_URL = "https://join-f5b75-default-rtdb.europe-west1.firebasedatabase.app/";
let currentData = [];

async function loadContactList() {
    const contacts = await fetchContactsFromDatabase();
    const validContacts = filterValidContacts(contacts);
    const sortedContacts = sortContactsAlphabetically(validContacts);
    const groupedByLetter = groupContactsByFirstLetter(sortedContacts);
    console.log(groupedByLetter);

    displayContactsGroupedByLetter(groupedByLetter);
}

async function fetchContactsFromDatabase() {
    const data = await getData("/contacts");
    currentData = Object.values(data || {});
    return currentData;
}

function filterValidContacts(contacts) {
    return contacts.filter(contact => contact && contact.name && contact.name.trim() !== "");
}

function sortContactsAlphabetically(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

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

function getFirstLetterFromName(name) {
    return name.charAt(0).toUpperCase();
}

function displayContactsGroupedByLetter(groupedContacts) {
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = "";
    const alphabeticalLetters = Object.keys(groupedContacts).sort();
    alphabeticalLetters.forEach(letter => {
        addLetterHeaderToDOM(contactList, letter);
        addContactsForLetterToDOM(contactList, groupedContacts[letter]);
    });
}

function addLetterHeaderToDOM(container, letter) {
    container.innerHTML += getFirstLetter(letter);
}

function addContactsForLetterToDOM(container, contacts) {
    contacts.forEach(contact => {
        container.innerHTML += getContact(contact);
    });
}

function openAddContactOverlay() {
    const contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = addContactTemplate();
}

async function closeAddContactOverlay() {
    const contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = "";
    await loadContactList();
}

async function postData(path = "", data) {
    await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseData = await response.json();
    return responseData;
}

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
        console.log("New contact added successfully.");
        closeAddContactOverlay();
    } catch (error) {
        console.error("Error posting new contact:", error);
    }
}

function validateNameInput(inputElement) {
    const error = validateName(inputElement.value);
    const validationElement = document.getElementById("add-name-validation");
    setValidationMessage(validationElement, error);
}

function validateEmailInput(inputElement) {
    const error = validateEmail(inputElement.value);
    const validationElement = document.getElementById("add-email-validation");
    setValidationMessage(validationElement, error);
}

function validatePhoneInput(inputElement) {
    const error = validatePhone(inputElement.value);
    const validationElement = document.getElementById("add-phone-validation");
    setValidationMessage(validationElement, error);
}

function validateName(value, showRequired = false) {
    const trimmedValue = value.trim();
    if (trimmedValue === "") {
        return showRequired ? "Name is required." : true;
    }
    if (trimmedValue.length < 2) {
        return "Name must be at least 2 characters long.";
    }
    const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ \'-';
    for (let i = 0; i < trimmedValue.length; i++) {
        if (!allowedChars.includes(trimmedValue[i])) {
            return "Name can only contain letters, spaces, apostrophes, and hyphens.";
        }
    }
    return true;
}

function validateEmail(value, showRequired = false) {
    const trimmedValue = value.trim();
    if (trimmedValue === "") {
        return showRequired ? "Email is required." : true;
    }
    if (!trimmedValue.includes('@') || !trimmedValue.includes('.') ||
        trimmedValue.indexOf('@') === 0 || trimmedValue.indexOf('.') === trimmedValue.length - 1) {
        return "Please enter a valid email address";
    }
    return true;
}

function validatePhone(value, showRequired = false) {
    const trimmedValue = value.trim();
    const allowedChars = '0123456789+- ()';
    if (trimmedValue === "") {
        return showRequired ? "Phone is required." : true;
    }
    if (trimmedValue.length < 5) {
        return "Phone number must be at least 5 characters long.";
    }
    for (let i = 0; i < trimmedValue.length; i++) {
        const currentChar = trimmedValue[i];
        if (!allowedChars.includes(currentChar)) {
            return "Phone number can only contain numbers, +, -, spaces, and parentheses.";
        }
    }
    return true;
}

function setValidationMessage(element, message) {
    if (element) {
        if (message === true) {
            element.textContent = "";
        } else {
            element.textContent = message;
            if (message) {
                element.style.color = "#FF8190";
            }
        }
    }
}

function openEditContactOverlay() {
    const contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = editContactTemplate(data[0]);
}

function closeEditContactOverlay() {
    let contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = "";
}
