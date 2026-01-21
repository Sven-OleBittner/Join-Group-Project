/**
 * Contact Management - Database Operations
 * This module handles all Firebase database interactions for contacts
 * Uses base functions from db.js
 */

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
 * Deletes a contact from Firebase database by its key
 * @async
 * @param {string} firebaseKey - The Firebase database key of the contact to delete
 * @returns {Promise<void>}
 */
async function deleteContactFromDatabase(firebaseKey) {
    await deleteData("/contacts/" + firebaseKey);
}

/**
 * Updates a contact in Firebase database by its key
 * @async
 * @param {string} firebaseKey - The Firebase database key of the contact to update
 * @param {Object} contactData - The updated contact data object
 * @returns {Promise<void>}
 */
async function updateContactInDatabase(firebaseKey, contactData) {
    await putData("/contacts/" + firebaseKey, contactData);
}
