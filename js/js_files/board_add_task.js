function checkColumns(columnId, emptyColumnId) {
  let column = document.getElementById(columnId);
  let emptyColumn = document.getElementById(emptyColumnId);
  if (column.innerHTML !== "") {
    emptyColumn.classList.add("d-none");
  } else {
    emptyColumn.classList.remove("d-none");
  }
}

function chooseAddTaskSite(id) {
  if (window.innerWidth > 945) {
    generateAddTaskModal();
  } else {
    window.location.href = `add_task.html`;
  }
}


function generateAddTaskModal() {
  let dialog = document.getElementById("addTaskDialog");
  let dialogContent = document.getElementById("addTaskDialogContent");
  dialogContent.innerHTML = getAddTaskTemplate();

  // Show the dialog
  dialog.showModal();
}

function closeAddTaskModal() {
  let dialog = document.getElementById("addTaskDialog");
  dialog.close();
}
