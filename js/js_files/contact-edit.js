/**
 * Contact Management - Edit Contact Functionality
 * This module handles editing and updating existing contacts
 */

/**
 * Opens the edit contact overlay for the currently selected contact
 */
function openEditContactOverlay() {
  if (!selectedContactKey) {
    return;
  }
  const selectedContact = findContactByKey(selectedContactKey);
  if (!selectedContact) {
    return;
  }
  const contactOverlay = document.getElementById("contact-overlay");
  contactOverlay.classList.remove("d-none");
  contactOverlay.innerHTML = editContactTemplate(selectedContact);
}

/**
 * Closes the edit contact overlay by clearing its content
 */
function closeEditContactOverlay() {
  let contactOverlay = document.getElementById("contact-overlay");
  contactOverlay.classList.add("d-none");
  contactOverlay.innerHTML = "";
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
  if (!validationEditContactInput()) return;
  if (!selectedContactKey) return;

  const { oldName, oldEmail, oldPhone, editName, editEmail, editPhone } =
    getValues();
  const selectedContact = findContactByKey(selectedContactKey);
  try {
    if (hasEditChanges(oldName, oldEmail, oldPhone, editName, editEmail, editPhone)) {
      const updatedContact = buildUpdatedContact(
        selectedContact,
        editName,
        editEmail,
        editPhone,
      );
      await persistUpdatedContact(selectedContactKey, updatedContact);
      updateUIAfterSave(updatedContact, selectedContactKey);
    }
    closeEditContactOverlay();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Returns true when any editable field was changed
 */
function hasEditChanges(oldName, oldEmail, oldPhone, editName, editEmail, editPhone) {
  return editName !== oldName || editEmail !== oldEmail || editPhone !== oldPhone;
}

/**
 * Builds the updated contact object preserving color/initials when appropriate
 */
function buildUpdatedContact(selectedContact, editName, editEmail, editPhone) {
  return {
    name: editName,
    email: editEmail,
    phone: editPhone,
    color: selectedContact.color,
    initials: editName !== document.getElementById('contact-display-name').textContent
      ? getInitials(editName)
      : selectedContact.initials,
  };
}

/**
 * Persists the updated contact to backend and reloads list
 */
async function persistUpdatedContact(firebaseKey, updatedContact) {
  await updateContactInDatabase(firebaseKey, updatedContact);
  await loadContactList();
}

/**
 * Updates UI after successful save (show details)
 */
function updateUIAfterSave(updatedContact, firebaseKey) {
  showContactDetails(
    updatedContact.name,
    updatedContact.email,
    updatedContact.phone,
    firebaseKey,
    updatedContact.color,
  );
}
