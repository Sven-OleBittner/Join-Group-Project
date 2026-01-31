function showLogOutMenu() {
    return
}

async function loggingOutUser() {
    await deleteData((path = "loggingInUser"));
    setTimeout(() => {
        window.location.href = "index.html?msg=You have been logged out!";
    }, 500);
}

function getDesktopLogOutMenuHTML() {
    return `
    <div class="logout-menu">
        <a href="./legal_notice.html" class="menu-item">Legal Notice</a>
        <a href="./privacy_policy.html" class="menu-item">Privacy Policy</a>
        <a onclick="loggingOutUser()" class="menu-item">Log out</a>
    </div>
    `;
}

function getMobileLogOutMenuHTML() {
    return `
    <div class="logout-menu">
        <a href="./help.html" class="menu-item">Help</a>
        <a href="./legal_notice.html" class="menu-item">Legal Notice</a>
        <a href="./privacy_policy.html" class="menu-item">Privacy Policy</a>
        <a onclick="loggingOutUser()" class="menu-item">Log out</a>
    </div>
    `;
}