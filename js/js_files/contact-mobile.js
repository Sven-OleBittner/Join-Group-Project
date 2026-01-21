/**
 * Contact Management - Mobile Functionality
 * This module handles mobile-specific UI behavior and interactions
 */

/**
 * Initializes mobile view handler for window resize
 */
function initializeMobileHandler() {
    // Only add listener once
    if (!window.mobileHandlerInitialized) {
        window.addEventListener('resize', handleWindowResize);
        window.mobileHandlerInitialized = true;
    }
}

/**
 * Handles window resize events for mobile view
 */
function handleWindowResize() {
    // If switching from mobile to desktop and details are shown
    if (window.innerWidth > 1250) {
        const mainContent = document.querySelector('.main-content');
        const backArrow = document.querySelector('.mobile-back-arrow');

        if (mainContent) {
            mainContent.classList.remove('mobile-showing-details');
        }
        if (backArrow) {
            backArrow.classList.add('hidden');
        }
        
        // Reset buttons when switching to desktop
        toggleMobileButtons(false);
    }
}

/**
 * Shows contact details in mobile view
 */
function showMobileContactDetails() {
    const mainContent = document.querySelector('.main-content');
    const showContactContainer = document.querySelector('.show-contact-container');

    if (mainContent && showContactContainer) {
        mainContent.classList.add('mobile-showing-details');

        // Add back arrow to contact details
        addMobileBackArrow();
        
        // Show edit button and hide add button in mobile
        toggleMobileButtons(true);
    }
}

/**
 * Adds a back arrow to mobile contact details view
 */
function addMobileBackArrow() {
    const backArrow = document.querySelector('.mobile-back-arrow');
    if (backArrow) {
        backArrow.classList.remove('hidden');
    }
}

/**
 * Hides contact details in mobile view and shows contact list
 */
function hideMobileContactDetails() {
    const mainContent = document.querySelector('.main-content');
    const backArrow = document.querySelector('.mobile-back-arrow');

    if (mainContent) {
        mainContent.classList.remove('mobile-showing-details');
    }

    if (backArrow) {
        backArrow.classList.add('hidden');
    }
    
    // Hide edit button and show add button
    toggleMobileButtons(false);
}

/**
 * Toggles between add and edit buttons in mobile view
 * @param {boolean} showEdit - If true, shows edit button and hides add button
 */
function toggleMobileButtons(showEdit) {
    const addButton = document.querySelector('.add-contact-mobile');
    const editButton = document.getElementById('edit-contact-mobile');
    
    if (showEdit) {
        if (addButton) addButton.classList.add('hidden');
        if (editButton) editButton.classList.remove('hidden');
    } else {
        if (addButton) addButton.classList.remove('hidden');
        if (editButton) editButton.classList.add('hidden');
    }
}

/**
 * Opens the mobile edit/delete menu
 */
function openMobileEditMenu() {
    const menuHTML = getMobileEditDeleteMenu();
    document.body.insertAdjacentHTML('beforeend', menuHTML);
}

/**
 * Closes the mobile edit/delete menu
 */
function closeMobileEditMenu() {
    const overlay = document.getElementById('mobile-menu-overlay');
    if (overlay) {
        overlay.remove();
    }
}
