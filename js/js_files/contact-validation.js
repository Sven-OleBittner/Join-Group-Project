/**
 * Contact Management - Validation Functions
 * This module contains all input validation logic for contact forms
 */

/**
 * Validates a name string according to business rules
 * @param {string} value - The name value to validate
 * @param {boolean} showRequired - Whether to show required message for empty values
 * @returns {boolean|string} True if valid, error message string if invalid
 */
function validateName(value, showRequired = false) {
    const nameRegex = /^[a-zA-ZäöüßÄÖÜ.'\- ]{5,}$/;
    const trimmedValue = value.trim();
    if (trimmedValue === "") {
        return showRequired ? "Name is required." : true;
    }
    if (!nameRegex.test(trimmedValue)) {
        return "Name can only contain letters, spaces, apostrophes, and hyphens.";
    }

    return true;
}

/**
 * Validates an email address using comprehensive regex pattern
 * @param {string} value - The email value to validate
 * @param {boolean} showRequired - Whether to show required message for empty values
 * @returns {boolean|string} True if valid, error message string if invalid
 */
function validateEmail(value, showRequired = false) {
    const trimmedValue = value.trim();
    if (trimmedValue === "") {
        return showRequired ? "Email is required." : true;
    }
    const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedValue)) {
        return "Please enter a valid email address";
    }
    return true;
}

/**
 * Validates a phone number using allowed characters and length rules
 * @param {string} value - The phone value to validate
 * @param {boolean} showRequired - Whether to show required message for empty values
 * @returns {boolean|string} True if valid, error message string if invalid
 */
function validatePhone(value, showRequired = false) {
    const trimmedValue = value.trim();
    const phoneRegex = /^[0-9+\-() ]{5,20}$/;
    if (trimmedValue === "") {
        return showRequired ? "Phone is required." : true;
    }
    if (!phoneRegex.test(trimmedValue)) {
        return "Phone number can only contain numbers, +, -, spaces, and parentheses.";
    }
    if (trimmedValue.length < 5) {
        return "Phone number must be at least 5 characters long.";
    }
    return true;
}

/**
 * Sets validation message on a DOM element
 * @param {HTMLElement} element - The element to display the message on
 * @param {boolean|string} message - True for valid (clears message), string for error message
 */
function setValidationMessage(element, message) {
    if (element) {
        if (message === true) {
            element.textContent = "";
        } else {
            element.textContent = message;
            if (message) {
                element.style.color = "var(--required-color)";
            }
        }
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

/**
 * Validates phone input field and displays validation message
 * @param {HTMLInputElement} inputElement - The phone input element to validate
 */
function validatePhoneInput(inputElement) {
    const error = validatePhone(inputElement.value);
    const validationElement = document.getElementById("add-phone-validation");
    setValidationMessage(validationElement, error);
}

/**
 * Validates name input field in edit form and displays validation message
 * @param {HTMLInputElement} inputElement - The name input element to validate
 */
function validateEditNameInput(inputElement) {
    const error = validateName(inputElement.value);
    const validationElement = document.getElementById("edit-name-validation");
    setValidationMessage(validationElement, error);
}

/**
 * Validates email input field in edit form and displays validation message
 * @param {HTMLInputElement} inputElement - The email input element to validate
 */
function validateEditEmailInput(inputElement) {
    const error = validateEmail(inputElement.value);
    const validationElement = document.getElementById("edit-email-validation");
    setValidationMessage(validationElement, error);
}

/**
 * Validates phone input field in edit form and displays validation message
 * @param {HTMLInputElement} inputElement - The phone input element to validate
 */
function validateEditPhoneInput(inputElement) {
    const error = validatePhone(inputElement.value);
    const validationElement = document.getElementById("edit-phone-validation");
    setValidationMessage(validationElement, error);
}
