async function generateAddTaskModal() {
    let dialog = document.getElementById('addTaskDialog');
    dialog.innerHTML = getAddTaskTemplate();

    // Show the dialog
    dialog.showModal();
}