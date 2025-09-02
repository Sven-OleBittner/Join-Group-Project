function addContactTemplate() {
    return `  
    <div class="overlay" onclick="closeAddContactOverlay()">
        <div class="add-contact-container d-flex-c" onclick="event.stopPropagation()">
        <!-- Add Container Left -->
        <div class="edit-add-contact-container d-flex-c-c-fs">
            <div class="add-contact-close-container-mobile">
            <img
                class="close-contact-img c-pointer"
                src="./assets/img/contact-close-white.svg"
                alt="Close"
                onclick="closeAddContactOverlay()"
            />
            </div>
            <img
            class="contact-logo"
            src="./assets/icons/Join_logo 2.svg"
            alt="Join Logo"
            />
            <span class="edit-headline">Add contact</span>
            <span class="add-contact-description"
            >Tasks are better with a team!</span
            >
            <div class="contact-progress-bar"></div>
        </div>

        <!-- Contact icon -->
        <div class="contact-circle-container d-flex-c">
            <div class="add-contact-person-container d-flex-c">
            <img
                class="add-contact-person-img"
                src="./assets/img/add-contact-person.svg"
                alt="Person"
            />
            </div>
        </div>

        <!-- Input Content -->
        <div class="input-add-contact-container">
            <!-- Close Button -->
            <div class="contact-close-container">
            <img
                class="close-contact-img c-pointer"
                src="./assets/img/contact-close.svg"
                alt="Close"
                onclick="closeAddContactOverlay()"
            />
            </div>

            <!-- Form for Adding Contact -->
            <div class="w100">
            <form action="">
                <div class="input-contact-container">
                <input id="add-name" type="text" placeholder="Name" oninput="validateNameInput(this)" required />
                <img
                    class="contact-input-icon"
                    src="./assets/img/contact-person.svg"
                    alt="Person"
                />
                </div>
                <div id="add-name-validation" class="error-message"></div>
                <div class="input-contact-container">
                <input id="add-email" type="email" placeholder="Email" oninput="validateEmailInput(this)" required />
                <img
                    class="contact-input-icon"
                    src="./assets/img/contact-mail.svg"
                    alt="Email"
                />
                </div>
                <div id="add-email-validation" class="error-message"></div>
                <div class="input-contact-container">
                <input id="add-phone" type="tel" placeholder="Phone" oninput="validatePhoneInput(this)" required />
                <img
                    class="contact-input-icon"
                    src="./assets/img/contact-call.svg"
                    alt="Phone"
                />
                </div>
                <div id="add-phone-validation" class="error-message"></div>
            </form>

            <!-- Button Container -->
            <div class="edit-contact-buttons">
                <button class="contact-delete add-contact-delete d-flex-c" onclick="closeAddContactOverlay()">
                Cancel
                <img
                    class="fill-hover"
                    src="./assets/img/contact-close.svg"
                    alt="Close"
                />
                </button>
                <button id="add-contact-save" onclick="postNewContact()" class="contact-save add-contact-save">
                Create contact
                <img
                    class="contact-save-icon"
                    src="./assets/img/add_task_check.svg"
                    alt="done"
                />
                </button>
            </div>
            </div>
        </div>
        </div>
    </div>
  `;
}

function editContactTemplate(data) {
    const nameWords = data.name.split(' ');
    const initials = nameWords.map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);

    return `
    <div class="overlay" onclick="closeEditContactOverlay()">
        <div class="add-contact-container d-flex-c" onclick="event.stopPropagation()">

            <!-- Edit Container Left -->
            <div class="edit-add-contact-container d-flex-c-c-fs">
                <div onclick="closeEditContactOverlay()" class="edit-contact-close-container-mobile">
                    <img class="close-contact-img c-pointer" src="./assets/img/contact-close-white.svg" alt="Close">
                </div>
                <img class="contact-logo" src="./assets/icons/Join_logo 2.svg" alt="Join Logo">
                <span class="edit-headline">Edit contact</span>
                <div class="contact-progress-bar"></div>
            </div>

            <!-- Contact Circle -->
            <div class="contact-circle-container d-flex-c">
                <div class="contact-circle d-flex-c">
                    <span class="contact-circle-text">${initials}</span>
                </div>
            </div>

            <!-- Input Content -->
            <div class="input-add-contact-container">
                <!-- Close Button -->
                <div onclick="closeEditContactOverlay()" class="contact-close-container">
                    <img class="close-contact-img c-pointer" src="./assets/img/contact-close.svg" alt="Close">
                </div>

                <!-- Form for Editing Contact -->
                <div class="w100">
                    <form action="">
                        <div class="input-contact-container">
                            <input id="edit-name" value="${data.name}" type="text" placeholder="Name" oninput="validateEditNameInput(this)" required />
                            <img class="contact-input-icon" src="./assets/img/contact-person.svg" alt="Person">
                        </div>
                        <div id="edit-name-validation" class="error-message"></div>
                        <div class="input-contact-container">
                            <input id="edit-email" value="${data.email}" type="email" placeholder="Email" oninput="validateEditEmailInput(this)" required />
                            <img class="contact-input-icon" src="./assets/img/contact-mail.svg" alt="Email">
                        </div>
                        <div id="edit-email-validation" class="error-message"></div>
                        <div class="input-contact-container">
                            <input id="edit-phone" value="${data.phone}" type="tel" placeholder="Phone" oninput="validateEditPhoneInput(this)" required />
                            <img class="contact-input-icon" src="./assets/img/contact-call.svg" alt="Phone">
                        </div>
                        <div id="edit-phone-validation" class="error-message"></div>
                    </form>
                
                    <!-- Button Container -->
                    <div class="edit-contact-buttons">
                        <button class="contact-delete" onclick="deleteSelectedContact()">Delete</button>
                        <button onclick="saveEditedContact()" class="contact-save d-flex-c">Save
                            <img class="contact-save-icon" src="./assets/img/add_task_check.svg" alt="done">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function getFirstLetter(letter) {
    return `
    <div class="first-letter-container">${letter}</div>
    `
}

function getContact(data) {
    const nameWords = data.name.split(' ');
    const initials = nameWords.map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);

    return `
        <div class="personal-ad" onclick="showContactDetails('${data.name}', '${data.email}', '${data.phone}', '${data.firebaseKey}')">
            <div class="person-circle d-flex-c">
              ${initials}
            </div>
            <div class="personal-data">
              <span>${data.name}</span>
              <a href="mailto:${data.email}" onclick="event.stopPropagation()">${data.email}</a>
            </div>
        </div>
    `
}