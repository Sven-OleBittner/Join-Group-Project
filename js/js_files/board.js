/**
 * Initializes the board page: sorts tasks into columns and sets up listeners
 * @returns {void}
 */
function initBoardSite() {
  sortTaskByStatus("toDoTaskList", "todo", "emptyToDo");
  sortTaskByStatus("inProgressTaskList", "inprogress", "emptyInProgress");
  sortTaskByStatus("awaitFeedbackTaskList", "feedback", "emptyAwaitFeedback");
  sortTaskByStatus("doneTaskList", "done", "emptyDone");
  setUpListeners();
}

/**
 * Attaches event listeners for board interactions (e.g., search enter key)
 * @returns {void}
 */
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

/**
 * Handles drag start for a task card
 * @param {string} taskId - The DOM id of the dragged task
 * @param {DragEvent} event - Drag event object
 * @returns {void}
 */
function dragStart(taskId, event) {
  currentDraggedTask = taskId;
  event.dataTransfer.setData("text/plain", taskId);
}

/**
 * Drag over handler to allow drop and visual feedback
 * @param {DragEvent} ev - Drag event
 * @returns {void}
 */
function dragoverHandler(ev) {
  ev.preventDefault();
  ev.currentTarget.classList.add("drag-over");
}

/**
 * Removes drag-over visual state when dragging leaves a column
 * @param {DragEvent} ev - Drag event
 * @returns {void}
 */
function dragLeaveHandler(ev) {
  ev.preventDefault();
  ev.currentTarget.classList.remove("drag-over");
}

/**
 * Moves the currently dragged task to a column determined by `columnId`
 * @param {string} columnId - ID of the target column container
 * @returns {Promise<void>}
 */
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

/**
 * Moves a specific task (by id) to a different column/status
 * @param {string} columnId - ID of the target column container
 * @param {string} taskId - Firebase key of the task
 * @returns {Promise<void>}
 */
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

/**
 * Maps a column container id to the task status string
 * @param {string} columnId - ID of the column container
 * @returns {string} Status value ('todo'|'inprogress'|'feedback'|'done')
 */
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

/**
 * Loads tasks and renders those matching a given status into the container
 * @param {string} id - DOM id of the target container
 * @param {string} status - Task status to filter by
 * @param {string} emptyColumnId - ID of empty placeholder element
 * @returns {Promise<void>}
 */
async function sortTaskByStatus(id, status, emptyColumnId) {
  const tasksData = await getData("task");
  if (!tasksData) return renderTask(id, [], emptyColumnId);
  const taskEntries = Object.entries(tasksData);
  const filteredTasks = taskEntries.filter(
    ([, task]) => task.status === status,
  );
  renderTask(id, filteredTasks, emptyColumnId);
}

/**
 * Renders the provided task entries into the DOM container
 * @param {string} id - DOM id of the container
 * @param {Array} filteredTasks - Array of [key, task] entries
 * @param {string} emptyColumnId - ID of the placeholder element
 * @returns {Promise<void>}
 */
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

/**
 * Ensures avatar area for a task is rendered correctly (clears if too many)
 * @param {string} id - Container id
 * @param {Object} task - Task object
 * @param {string} key - Task firebase key
 * @returns {void}
 */
function checkAssignedContacts(id, task, key) {
  const avatarsContainer = document.getElementById(`task-${key}-avatars-${id}`);
  if (!avatarsContainer) return;
  const assigned = task.assigned || [];
  if (assigned.length > 4) {
    avatarsContainer.innerHTML = "";
  }
}

/**
 * Returns a CSS color class depending on the category name
 * @param {string|Object} category - Category name or object with `name`
 * @returns {string} CSS color class name
 */
function getCategoryColor(category) {
  const name =
    category && typeof category === "object" ? category.name : category;
  if (name === "Technical Task") {
    return "color-turquoise";
  } else {
    return "color-blue";
  }
}

/**
 * Renders subtask progress for a given task
 * @param {string} id - Container id
 * @param {Object} task - Task object
 * @param {string} key - Task firebase key
 * @returns {void}
 */
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

/**
 * Renders the avatars for assigned contacts inside a task card
 * @param {Array} taskAssigned - Array of assignee objects
 * @param {string} key - Task firebase key
 * @param {string} id - Container id
 * @returns {Promise<void>}
 */
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

/**
 * Looks up a contact color by initials
 * @param {string} taskAssigned - Initials of the contact
 * @returns {Promise<string>} CSS color class for the contact
 */
async function getContactBg(taskAssigned) {
  const contactDb = await getData("contacts");
  const contactArray = Object.values(contactDb);
  let contact = contactArray.find(
    (contact) => contact.initials === taskAssigned,
  );
  return contact ? contact.color : "color-default";
}

/**
 * Maps task priority key to image filename or class
 * @param {string} taskPriority - Priority key
 * @returns {string} Priority image filename or default class
 */
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

/**
 * Opens the task detail modal for a specific task
 * @param {string} taskId - Firebase key of the task
 * @returns {Promise<void>}
 */
async function openTaskModal(taskId) {
  currentTaskId = taskId;
  const task = await getData(`task/${taskId}`);
  if (!task) return;
  fillModalHeader(task);
  await renderModalAvatars(task.assigned || []);
  renderModalSubtasks(task.subtasks ? Object.values(task.subtasks) : []);
  document.getElementById("td-modal").classList.add("is-open");
}

/**
 * Fills the modal header with task metadata (category, title, due date, priority)
 * @param {Object} task - Task object
 * @returns {void}
 */
function fillModalHeader(task) {
  const categoryName = task.category?.name || task.category;
  const chip = document.getElementById("td-chip");
  chip.textContent = categoryName;
  chip.className = "td-chip";
  chip.style.background = categoryName === "User Story" ? "#0038FF" : "#1FD7C1";
  chip.style.color = "#ffffff";
  document.getElementById("td-title").textContent = task.title;
  document.getElementById("td-desc").textContent = task.description;
  document.getElementById("td-due").textContent = dateFormatChange(task);
  document.getElementById("td-prio-text").textContent = capitalizeFirstLetter(
    task.priority,
  );
  document.getElementById("td-prio-icon").innerHTML =
    `<img src="./assets/img/${getPriority(task.priority)}">`;
}

/**
 * Normalizes various due date formats to `dd.mm.yyyy`
 * @param {Object} task - Task object containing `dueDate`
 * @returns {string} Formatted date string or original value
 */
function dateFormatChange(task) {
  let oldDate = task.dueDate;
  if (oldDate.includes("-")) {
    const [year, month, day] = oldDate.split("-");
    return `${day}.${month}.${year}`;
  } else if (oldDate.includes("/")) {
    const [day, month, year] = oldDate.split("/");
    return `${day}.${month}.${year}`;
  } else {
    return oldDate;
  }
}

/**
 * Renders full-size avatars inside the task detail modal
 * @param {Array} assigned - Array of assignee objects
 * @returns {Promise<void>}
 */
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

/**
 * Renders subtasks inside the task detail modal
 * @param {Array} subtasks - Array of subtask objects or strings
 * @returns {void}
 */
function renderModalSubtasks(subtasks) {
  document.getElementById("td-subtasks").hidden = !subtasks.length;
  const list = document.getElementById("td-subtasks-list");
  list.innerHTML = (subtasks || [])
    .map((sub, index) => getModalSubtaskTemplate(sub, index))
    .join("");
}

/**
 * Toggles the completed style for a subtask and persists the change
 * @param {number} index - Index of the subtask
 * @param {boolean} isChecked - New completion state
 * @returns {Promise<void>}
 */
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

/**
 * Closes the task detail modal
 * @returns {void}
 */
function closeTaskModal() {
  document.getElementById("td-modal").classList.remove("is-open");
}

/**
 * Deletes a task by id and refreshes the board
 * @param {string} taskId - Firebase key of the task
 * @returns {Promise<void>}
 */
async function deleteTask(taskId) {
  await deleteData(`task/${taskId}`);
  closeTaskModal();
  initBoardSite();
}

/**
 * Opens the add/edit task UI prefilled for editing a specific task
 * @param {string} taskId - Firebase key of the task
 * @returns {Promise<void>}
 */
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

/**
 * Prepares the add-task form for editing with provided task data
 * @param {Object} task - Task object to prefill
 * @param {string} taskId - Firebase key of the task
 * @returns {Promise<void>}
 */
async function prefillEditForm(task, taskId) {
  standartselectPriority();
  await loadContactsForDropdown();
  fillTaskForm(task, taskId);
}

/**
 * Capitalizes the first letter of a string
 * @param {string} string - Input string
 * @returns {string} String with first letter capitalized
 */
function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Toggles the display of the options menu for a task
 * @param {string} menuId - DOM id of the menu element
 * @returns {void}
 */
function toggleOptions(menuId) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

/**
 * Hides all responsive menus except the currently opened one
 * @param {string} currentMenuId - Menu id to keep open
 * @returns {void}
 */
function closeAllOtherOptions(currentMenuId) {
  const allMenus = document.querySelectorAll(".responsiveMoveTo");
  allMenus.forEach((menu) => {
    if (menu.id !== currentMenuId) {
      menu.style.display = "none";
    }
  });
}

/**
 * Closes all responsive menus (used on global click handlers)
 * @returns {void}
 */
function closeAllOptionsOnclick() {
  const allMenus = document.querySelectorAll(".responsiveMoveTo");
  allMenus.forEach((menu) => {
    menu.style.display = "none";
  });
}

/**
 * Saves edits of an existing task back to the database
 * @param {string} taskId - Firebase key of the task to save
 * @returns {Promise<void>}
 */
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

/**
 * Returns the current trimmed search query from the search input
 * @returns {string} Lowercased trimmed query
 */
function getSearchQuery() {
  return document.getElementById("searchInput").value.trim().toLowerCase();
}

/**
 * Shows all tasks (clears active filter)
 * @returns {void}
 */
function showAllTasks() {
  document.querySelectorAll(".kb-card").forEach((t) => (t.style.display = ""));
  updateEmptyPlaceholders();
}

/**
 * Filters task cards by the provided query string
 * @param {string} query - Lowercased query to filter titles and descriptions
 * @returns {void}
 */
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

/**
 * Reads the search input and applies the filter (or clears it)
 * @returns {Promise<void>}
 */
async function findTaskBy() {
  const q = getSearchQuery();
  if (!q) return showAllTasks();
  filterTasks(q);
}

/**
 * Checks whether an element is visible in the DOM
 * @param {HTMLElement} el - Element to check
 * @returns {boolean}
 */
function isVisible(el) {
  const cs = window.getComputedStyle(el);
  return (
    cs.display !== "none" &&
    cs.visibility !== "hidden" &&
    el.offsetWidth > 0 &&
    el.offsetHeight > 0
  );
}

/**
 * Shows or hides the empty column placeholders based on card visibility
 * @returns {void}
 */
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
