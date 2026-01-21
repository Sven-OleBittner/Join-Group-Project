/**
 * Contact Management - Contact Details Display
 * This module handles displaying and managing detailed contact information
 */

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

    // Mobile: Show details view and hide contact list
    if (window.innerWidth <= 1250) {
        showMobileContactDetails();
    }
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

    // Mobile: Also hide mobile details view
    if (window.innerWidth <= 1250) {
        hideMobileContactDetails();
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
