/**
 * Contact Management - Add Contact Functionality
 * This module handles creating and adding new contacts
 */

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
        return;
    }
    const addName = document.getElementById("add-name");
    const addEmail = document.getElementById("add-email");
    const addPhone = document.getElementById("add-phone");
    const initials = getInitials(addName.value);
    const color = getRandomColorClass();
    const newContact = {
        name: addName.value,
        email: addEmail.value,
        phone: addPhone.value,
        initials: initials,
        color: color
    };
    try {
        await postData("contacts", newContact);
        await closeAddContactOverlay();
        getSuccessfullyContactCreated();
    } catch (error) {
        console.error("Error posting new contact:", error);
    }
}
