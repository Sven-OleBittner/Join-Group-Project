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
* Opens the edit contact overlay for the currently selected contact
*/
function openEditContactOverlay() {
  if (!selectedContactKey) {
      console.error("No contact selected for editing.");
      return;
  }
  const selectedContact = findContactByKey(selectedContactKey);
  if (!selectedContact) {
      console.error("Selected contact not found.");
      return;
  }
  const contactOverlay = document.getElementById("contact-overlay");
  contactOverlay.innerHTML = editContactTemplate(selectedContact);
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

/**
* Validates all input fields in the edit contact form
* @returns {boolean} True if all validations pass, false otherwise
*/
function validationEditContactInput() {
  const editName = document.getElementById("edit-name");
  const editEmail = document.getElementById("edit-email");
  const editPhone = document.getElementById("edit-phone");
  const editNameValidation = document.getElementById("edit-name-validation");
  const editEmailValidation = document.getElementById("edit-email-validation");
  const editPhoneValidation = document.getElementById("edit-phone-validation");
  const nameError = validateName(editName.value, true);
  const emailError = validateEmail(editEmail.value, true);
  const phoneError = validatePhone(editPhone.value, true);
  setValidationMessage(editNameValidation, nameError);
  setValidationMessage(editEmailValidation, emailError);
  setValidationMessage(editPhoneValidation, phoneError);
  return nameError === true && emailError === true && phoneError === true;
}

/**
* Gets the current values from display and edit form elements
* @returns {Object} Object containing old and new contact values
*/
function getValues() {
  const oldName = document.getElementById("contact-display-name").textContent;
  const oldEmail = document.getElementById("contact-email-link").textContent;
  const oldPhone = document.getElementById("contact-phone-link").textContent;
  const editName = document.getElementById("edit-name").value;
  const editEmail = document.getElementById("edit-email").value;
  const editPhone = document.getElementById("edit-phone").value;
  return { oldName, oldEmail, oldPhone, editName, editEmail, editPhone };
}

/**
* Saves the edited contact data to the database after validation
* @async
* @returns {Promise<void>}
*/
async function saveEditedContact() {
  if (!validationEditContactInput()) {
      console.error("Validation failed.");
      return;
  }
  if (!selectedContactKey) {
      console.error("No contact selected for editing.");
      return;
  }
  const { oldName, oldEmail, oldPhone, editName, editEmail, editPhone } = getValues();
  try {
      if (editName !== oldName || editEmail !== oldEmail || editPhone !== oldPhone) {
          const updatedContact = {
              name: editName,
              email: editEmail,
              phone: editPhone
          };
          await updateContactInDatabase(selectedContactKey, updatedContact);
          await loadContactList();
          const randomColor = getRandomColorClass();
          showContactDetails(updatedContact.name, updatedContact.email, updatedContact.phone, selectedContactKey, randomColor);
      }
      closeEditContactOverlay();
  } catch (error) {
      console.error("Error updating contact:", error);
  }
}

/**
* Updates a contact in Firebase database by its key
* @async
* @param {string} firebaseKey - The Firebase database key of the contact to update
* @param {Object} contactData - The updated contact data object
* @returns {Promise<void>}
*/
async function updateContactInDatabase(firebaseKey, contactData) {
  let response = await fetch(BASE_URL + "contacts/" + firebaseKey + ".json", {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(contactData)
  });

  if (!response.ok) {
      console.error(error);
  }
}

/**
* Closes the edit contact overlay by clearing its content
*/
function closeEditContactOverlay() {
  let contactOverlay = document.getElementById("contact-overlay");
  contactOverlay.innerHTML = "";
}
