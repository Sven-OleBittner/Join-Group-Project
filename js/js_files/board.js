function initBoardSite() {
  sortTaskByStatus("toDoTaskList", "todo", "emptyToDo");
  sortTaskByStatus("inProgressTaskList", "inprogress", "emptyInProgress");
  sortTaskByStatus("awaitFeedbackTaskList", "feedback", "emptyAwaitFeedback");
  sortTaskByStatus("doneTaskList", "done", "emptyDone");
}

let currentDraggedTask;

function dragStart(taskId) {
  currentDraggedTask = taskId;
}

function dragoverHandler(ev) {
  ev.preventDefault();
}

async function moveTo(columnId) {
  const taskData = await getData("task");
  if (!taskData) return;
  const taskId = currentDraggedTask.replace("task-", "");
  const newStatus = setNewStatus(columnId);
  const existingTask = taskData[taskId];
  if (existingTask) {
    existingTask.status = newStatus;
    await putData(`task/${taskId}`, existingTask);
initBoardSite();  }
}

function setNewStatus(columnId) {
  switch (columnId) {
    case "toDoTaskList":
      return "todo";
    case "inProgressTaskList":
      return "inprogress";
    case "awaitFeedbackTaskList":
      return "feedback";
    case "doneTaskList":
      return "done";
  }
}

function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function sortTaskByStatus(id, status, emptyColumnId) {
  const tasksData = await getData("task");
  if (!tasksData) return renderTask(id, [], emptyColumnId);
  const taskEntries = Object.entries(tasksData);
  const filteredTasks = taskEntries.filter(([, task]) => task.status === status);
  renderTask(id, filteredTasks, emptyColumnId);
}

async function renderTask(id, filteredTasks, emptyColumnId) {
  const container = document.getElementById(id);
  container.innerHTML = "";
  for (let i = 0; i < filteredTasks.length; i++) {
    const [key, task] = filteredTasks[i];
    let backgroundColor = getCategoryColor(task.category);
    let priority = getPriority(task.priority);
    container.innerHTML += getTasksTemplate(id, task, key, backgroundColor, priority);
    renderSubTask(id, task, key);
    await renderAvatars(task.assigned || [], key, id);
  }
  checkColumns(id, emptyColumnId);
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


function renderSubTask(id, task, key) {
  const subTasksContainer = document.getElementById(`task-${key}-subtasks-${id}`);
  if (task.subtasks != null && task.subtasks.length > 0) {
    const compleatedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length;
    let percent = (compleatedSubtasks / task.subtasks.length) * 100;
    subTasksContainer.innerHTML += getSubTemplate(task, percent, compleatedSubtasks);
  } else {
    subTasksContainer.innerHTML = "";
  }
}


async function renderAvatars(taskAssigned, key, id) {
  let avatarsContainer = document.getElementById(`task-${key}-avatars-${id}`);
  if (!avatarsContainer) return;
  avatarsContainer.innerHTML = "";

  for (let i = 0; i < taskAssigned.length; i++) {
    const assignee = taskAssigned[i];
    const color = await getContactBg(assignee.initials);
    avatarsContainer.innerHTML += `
      <div class="kb-avatar ${assignee.color || color}" title="${assignee.initials}">
        ${assignee.initials}
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
