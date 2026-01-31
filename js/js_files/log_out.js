/**
 * Toggles the logout menu display
 * Shows mobile or desktop version based on window width
 * Removes menu if already open, adds it if closed
 */
function showLogOutMenu() {
    const existingMenu = document.getElementById('logout-menu-overlay');
    const body = document.querySelector("body");
    if (existingMenu) {
        existingMenu.remove();
    } else {
        if (window.innerWidth <= 946) {
            body.insertAdjacentHTML('beforeend', getMobileLogOutMenuHTML());
        } else {
            body.insertAdjacentHTML('beforeend', getDesktopLogOutMenuHTML());
        }
    }
}

/**
 * Logs out the current user and redirects to login page
 * Shows logout message after redirect
 */
function loggingOutUser() {
    setTimeout(() => {
        window.location.href = "index.html?msg=You have been logged out!";
    }, 500);
}

/**
 * Generates HTML for desktop logout menu
 * @returns {string} HTML template for desktop logout menu
 */
function getDesktopLogOutMenuHTML() {
    return `
    <div id="logout-menu-overlay">
        <div class="logout-menu">
            <a href="./legal_notice.html" class="menu-item">Legal Notice</a>
            <a href="./privacy_policy.html" class="menu-item">Privacy Policy</a>
            <a onclick="loggingOutUser()" class="menu-item">Log out</a>
        </div>
    </div>
    `;
}

/**
 * Generates HTML for mobile logout menu
 * Includes additional Help link for mobile users
 * @returns {string} HTML template for mobile logout menu
 */
function getMobileLogOutMenuHTML() {
    return `
    <div id="logout-menu-overlay">
        <div class="logout-menu">
            <a href="./help.html" class="menu-item">Help</a>
            <a href="./legal_notice.html" class="menu-item">Legal Notice</a>
            <a href="./privacy_policy.html" class="menu-item">Privacy Policy</a>
            <a onclick="loggingOutUser()" class="menu-item">Log out</a>
        </div>
    </div>
    `;
}