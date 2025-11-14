function getTaskData() {
    let title = document.getElementById("title");
    let description = document.getElementById("description");
    let date = document.getElementById("due-date");
    let priority = document.getElementById("prio");
    let contacts = document.getElementById("assignees");
    let category = document.getElementById("category");
    let subtask = document.getElementById("subtask-input");

    let taskData = {title, description, date, priority, contacts, category,subtask};
    console.log(taskData);
    
    return taskData;
}

