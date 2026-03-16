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
async function loggingOutUser() {
    // const logInUserDb = await getData((path = "loggingInUser"));
    // const loggingInUser = JSON.parse(sessionStorage.getItem('loggingInUser'));
    // if (loggingInUser && logInUserDb) {
    //     const entries = Object.entries(logInUserDb);
    //     for (const [key, value] of entries) {
    //         const matchByName = value.name && loggingInUser.name && value.name === loggingInUser.name;
    //         const matchByEmail = (!loggingInUser.email) || (value.email && value.email === loggingInUser.email);
    //         if (matchByName && matchByEmail) {
    //             await deleteData(`loggingInUser/${key}`);
    //             break;
    //         }
    //     }
    //     sessionStorage.removeItem('loggingInUser');
    // }
    deleteData("loggingInUser");
    setTimeout(() => {
        window.location.href = "index.html?msg=You have been logged out!";
    }, 250);
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

// /**
//  * Handles auto-logout when page is closed or hidden
//  * Uses fetch with `keepalive` to ensure logout request completes during unload
//  * Attempts to delete remote `loggingInUser` entry on pagehide or beforeunload
//  */
// function _logoutOnCloseKeepalive() {
//     try {
//             deleteData("loggingInUser");
//     } catch (e) {}
// }

// window.addEventListener('pagehide', _logoutOnCloseKeepalive);
// window.addEventListener('beforeunload', _logoutOnCloseKeepalive);
