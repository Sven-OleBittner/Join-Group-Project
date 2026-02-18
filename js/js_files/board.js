function initBoardSite() {
  sortTaskByStatus("toDoTaskList", "todo");
  sortTaskByStatus("inProgressTaskList", "inprogress");
  sortTaskByStatus("awaitFeedbackTaskList", "feedback");
  sortTaskByStatus("doneTaskList", "done");
  checkColumns("toDoTaskList", "emptyToDo");
  checkColumns("inProgressTaskList", "emptyInProgress");
  checkColumns("awaitFeedbackTaskList", "emptyAwaitFeedback");
  checkColumns("doneTaskList", "emptyDone");
}

async function sortTaskByStatus(id, status) {
  const tasksData = await getData("task");
  const taskArray = Object.values(tasksData);
  const filteredTasks = taskArray.filter((task) => task.status === status);
  renderTask(id, filteredTasks);
}

async function renderTask(id, filteredTasks) {
  const container = document.getElementById(id);
  container.innerHTML = "";
  for (let index = 0; index < filteredTasks.length; index++) {
    const task = filteredTasks[index];
    let backgroundColor = getCategoryColor(task.category);
    let priority = getPriority(task.priority);
    container.innerHTML += getTasksTemplate(
      task,
      backgroundColor,
      index,
      priority,
    );
    renderSubTask(task, index);
    await renderAvatars(task.assigned, index);
  }
}

function getCategoryColor(category) {
  const name =
    category && typeof category === "object" ? category.name : category;
  if (name === "Technical Task") {
    return "color-turquoise";
  } else {
    return "color-blue";
  }
}

function renderSubTask(task, index) {
  const subTasksContainer = document.getElementById("task-subtasks" + index);
  if (task.subtask != null) {
    subTasksContainer.innerHTML += getSubTemplate(task);
  } else {
    subTasksContainer.innerHTML = "";
  }
}

async function renderAvatars(taskAssigned, index) {
  let avatarsContainer = document.getElementById("avatarsFoto" + index);
  avatarsContainer.innerHTML = "";

  for (let i = 0; i < taskAssigned.length; i++) {
    const color = await getContactBg(taskAssigned[i].initials);

    avatarsContainer.innerHTML += `
      <div class="kb-avatar ${taskAssigned[i].color}" title="${taskAssigned[i].initials}">
        ${taskAssigned[i].initials}
      </div>
    `;
  }
}

async function getContactBg(taskAssigned) {
  const contactDb = await getData("contacts");
  const contactArray = Object.values(contactDb);
  let contact = contactArray.find(
    (contact) => contact.initials === taskAssigned,
  );
  return contact ? contact.color : "color-default";
}

function getPriority(taskPriority) {
  if (taskPriority === "urgent") {
    return "red_high_urgent.svg";
  } else if (taskPriority === "medium") {
    return "Prio%20media.svg";
  } else if (taskPriority === "low") {
    return "green_low_urgent.svg";
  } else {
    return "kb-prio--default";
  }
}
