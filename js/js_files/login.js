let users = [];

function init() {
    dataToUsers();
}

async function dataToUsers() {
    let user = await getData((path = "user"));
    users = Object.values(user || {});
}

function login() {
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let user = users.find(u => u.email == email.value && u.password == password.value);
    if (user) {
        console.log('user gefunden');
    } else {
        console.log('user nicht registriert');
    }
}