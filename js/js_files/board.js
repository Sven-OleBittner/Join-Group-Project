function initBoardSite() {
  sortTaskByStatus("toDoTaskList", "todo", "emptyToDo");
  sortTaskByStatus("inProgressTaskList", "inprogress", "emptyInProgress");
  sortTaskByStatus("awaitFeedbackTaskList", "feedback", "emptyAwaitFeedback");
  sortTaskByStatus("doneTaskList", "done", "emptyDone");
  setUpListeners();
}

function setUpListeners() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput && !searchInput.dataset.enterListener) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        findTaskBy();
      }
    });
    searchInput.dataset.enterListener = "true";
  }
}

let currentDraggedTask;
let ghostImage;

function dragStart(taskId, event) {
  currentDraggedTask = taskId;
  event.dataTransfer.setData("text/plain", taskId);
}

function dragoverHandler(ev) {
  ev.preventDefault();
  ev.currentTarget.classList.add("drag-over");
}

function dragLeaveHandler(ev) {
  ev.preventDefault();
  ev.currentTarget.classList.remove("drag-over");
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
    initBoardSite();
  }
}

async function moveToResp(columnId, taskId) {
  const taskData = await getData("task");
  if (!taskData) return;
  const newStatus = setNewStatus(columnId);
  const existingTask = taskData[taskId];
  if (existingTask) {
    existingTask.status = newStatus;
    await putData(`task/${taskId}`, existingTask);
    initBoardSite();
  }
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

async function sortTaskByStatus(id, status, emptyColumnId) {
  const tasksData = await getData("task");
  if (!tasksData) return renderTask(id, [], emptyColumnId);
  const taskEntries = Object.entries(tasksData);
  const filteredTasks = taskEntries.filter(
    ([, task]) => task.status === status,
  );
  renderTask(id, filteredTasks, emptyColumnId);
}

async function renderTask(id, filteredTasks, emptyColumnId) {
  const container = document.getElementById(id);
  container.innerHTML = "";
  for (let i = 0; i < filteredTasks.length; i++) {
    const [key, task] = filteredTasks[i];
    let backgroundColor = getCategoryColor(task.category);
    let priority = getPriority(task.priority);
    container.innerHTML += getTasksTemplate(
      id,
      task,
      key,
      backgroundColor,
      priority,
    );
    renderSubTask(id, task, key);
    await renderAvatars(task.assigned || [], key, id);
  }
  checkColumns(id, emptyColumnId);
}

function checkAssignedContacts(id, task, key) {
  const avatarsContainer = document.getElementById(`task-${key}-avatars-${id}`);
  if (!avatarsContainer) return;
  const assigned = task.assigned || [];
  if (assigned.length > 4) {
    avatarsContainer.innerHTML = "";
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

function renderSubTask(id, task, key) {
  const subTasksContainer = document.getElementById(
    `task-${key}-subtasks-${id}`,
  );
  if (!task.subtasks) {
    subTasksContainer.innerHTML = "";
    return;
  }
  const subtasks = Object.values(task.subtasks);
  const completedSubtasks = subtasks.filter(
    (sub) => typeof sub === "object" && sub.completed,
  ).length;
  const percent = (completedSubtasks / subtasks.length) * 100;
  subTasksContainer.innerHTML = getSubTemplate(
    subtasks,
    percent,
    completedSubtasks,
  );
}

async function renderAvatars(taskAssigned, key, id) {
  let avatarsContainer = document.getElementById(`task-${key}-avatars-${id}`);
  if (!avatarsContainer) return;
  avatarsContainer.innerHTML = "";
  for (let i = 0; i < taskAssigned.length; i++) {
    const assignee = taskAssigned[i];
    const color = await getContactBg(assignee.initials);
    if (i >= 4) {
      avatarsContainer.innerHTML += `
        <div class="kb-avatar color-aquamarine">+${taskAssigned.length - 4}</div>
      `;
      break;
    } else {
      avatarsContainer.innerHTML += `
      <div class="kb-avatar ${assignee.color || color}" title="${assignee.initials}">
        ${assignee.initials}
      </div>
    `;
    }
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

let currentTaskId;

async function openTaskModal(taskId) {
  currentTaskId = taskId;
  const task = await getData(`task/${taskId}`);
  if (!task) return;
  fillModalHeader(task);
  await renderModalAvatars(task.assigned || []);
  renderModalSubtasks(task.subtasks ? Object.values(task.subtasks) : []);
  document.getElementById("td-modal").classList.add("is-open");
}

function fillModalHeader(task) {
  const categoryName = task.category?.name || task.category;
  const chip = document.getElementById("td-chip");
  chip.textContent = categoryName;
  chip.className = "td-chip";
  chip.style.background = categoryName === "User Story" ? "#0038FF" : "#1FD7C1";
  chip.style.color = "#ffffff";
  document.getElementById("td-title").textContent = task.title;
  document.getElementById("td-desc").textContent = task.description;
  document.getElementById("td-due").textContent = task.dueDate;
  document.getElementById("td-prio-text").textContent = capitalizeFirstLetter(
    task.priority,
  );
  document.getElementById("td-prio-icon").innerHTML =
    `<img src="./assets/img/${getPriority(task.priority)}">`;
}

async function renderModalAvatars(assigned) {
  const container = document.getElementById("td-assignees");
  container.innerHTML = "";
  for (const assignee of assigned) {
    const color = await getContactBg(assignee.initials);
    container.innerHTML += `
      <div class="td-person">
        <div class="kb-avatar ${assignee.color || color}">${assignee.initials}</div>
        <span class="td-person__name">${assignee.name}</span>
      </div>
    `;
  }
}

function renderModalSubtasks(subtasks) {
  document.getElementById("td-subtasks").hidden = !subtasks.length;
  document.getElementById("td-subtasks-list").innerHTML = subtasks
    .map((sub, index) => {
      const label = typeof sub === "string" ? sub : sub.text;
      const isChecked =
        typeof sub === "object" && sub.completed ? "checked" : "";
      return `
      <li class="td-task" id="td-task-item-${index}">
        <input type="checkbox" id="subtask-${index}" ${isChecked}
          onchange="toggleSubtaskStyle(${index}, this.checked)">
        <label for="subtask-${index}" class="td-task__label">${label}</label>
      </li>
    `;
    })
    .join("");
}

async function toggleSubtaskStyle(index, isChecked) {
  document
    .getElementById(`td-task-item-${index}`)
    .classList.toggle("is-done", isChecked);
  const task = await getData(`task/${currentTaskId}`);
  const key = Object.keys(task.subtasks)[index];
  task.subtasks[key] =
    typeof task.subtasks[key] === "string"
      ? { text: task.subtasks[key], completed: isChecked }
      : { ...task.subtasks[key], completed: isChecked };
  await putData(`task/${currentTaskId}`, task);
  initBoardSite();
}

function closeTaskModal() {
  document.getElementById("td-modal").classList.remove("is-open");
}

async function deleteTask(taskId) {
  await deleteData(`task/${taskId}`);
  closeTaskModal();
  initBoardSite();
}

async function editTask(taskId) {
  const task = await getData(`task/${taskId}`);
  closeTaskModal();
  if (window.innerWidth <= 945) {
    window.location.href = `add_task.html?editKey=${taskId}`;
    return;
  }
  generateAddTaskModal("addTaskBoard");
  await prefillEditForm(task, taskId);
}

async function prefillEditForm(task, taskId) {
  standartselectPriority();
  await loadContactsForDropdown();
  fillTaskForm(task, taskId);
}

function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function toggleOptions(menuId) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

function closeAllOtherOptions(currentMenuId) {
  const allMenus = document.querySelectorAll(".responsiveMoveTo");
  allMenus.forEach((menu) => {
    if (menu.id !== currentMenuId) {
      menu.style.display = "none";
    }
  });
}

function closeAllOptionsOnclick() {
  const allMenus = document.querySelectorAll(".responsiveMoveTo");
  allMenus.forEach((menu) => {
    menu.style.display = "none";
  });
}

async function saveEditTask(taskId) {
  if (!validateForm()) return;
  const task = await getData(`task/${taskId}`);
  task.title = document.getElementById("title").value;
  task.description = document.getElementById("description").value;
  task.dueDate = document.getElementById("date").value;
  task.priority = getSelectedPriority();
  task.category = document.getElementById("category-selected").textContent;
  task.assigned = getSelectedContacts();
  task.subtasks = subtasks;
  await putData(`task/${taskId}`, task);
  closeAddTaskModal();
  initBoardSite();
}

function getSearchQuery() {
  return document.getElementById("searchInput").value.trim().toLowerCase();
}

function showAllTasks() {
  document.querySelectorAll(".kb-card").forEach((t) => (t.style.display = ""));
  updateEmptyPlaceholders();
}

function filterTasks(query) {
  document.querySelectorAll(".kb-card").forEach((t) => {
    const title =
      t.querySelector(".kb-card-title")?.textContent.toLowerCase() || "";
    const desc =
      t.querySelector(".kb-card-desc")?.textContent.toLowerCase() || "";
    t.style.display =
      title.includes(query) || desc.includes(query) ? "" : "none";
  });
  updateEmptyPlaceholders();
}

async function findTaskBy() {
  const q = getSearchQuery();
  if (!q) return showAllTasks();
  filterTasks(q);
}

function isVisible(el) {
  const cs = window.getComputedStyle(el);
  return (
    cs.display !== "none" &&
    cs.visibility !== "hidden" &&
    el.offsetWidth > 0 &&
    el.offsetHeight > 0
  );
}

function updateEmptyPlaceholders() {
  const cols = [
    { id: "toDoTaskList", empty: "emptyToDo" },
    { id: "inProgressTaskList", empty: "emptyInProgress" },
    { id: "awaitFeedbackTaskList", empty: "emptyAwaitFeedback" },
    { id: "doneTaskList", empty: "emptyDone" },
  ];
  cols.forEach(({ id, empty }) => {
    const c = document.getElementById(id);
    const e = document.getElementById(empty);
    if (!c || !e) return;
    const any = Array.from(c.querySelectorAll(".kb-card")).some(isVisible);
    e.classList.toggle("d-none", any);
  });
}
