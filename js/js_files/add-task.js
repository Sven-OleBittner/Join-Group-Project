/**
 * Add Task - Core
 * Handles page initialization, status URL logic, task submission and success notification
 */

/**
 * Initializes the Add Task page
 * Sets default priority and loads contacts for the assignees dropdown
 * @async
 * @returns {Promise<void>}
 */
async function add_task_init() {
  enableCreateButton();
  standartselectPriority();
  await loadContactsForDropdown();
  // Prevent selecting past dates in native date picker
  if (typeof setDateMinToday === 'function') setDateMinToday();
  const editKey = new URLSearchParams(window.location.search).get("editKey");
  if (editKey) await prefillFormFromUrl(editKey);
}

/**
 * Prefills the form with task data from the URL editKey parameter
 * @async
 * @param {string} taskId - The Firebase key of the task to edit
 * @returns {Promise<void>}
 */
async function prefillFormFromUrl(taskId) {
  const task = await getData(`task/${taskId}`);
  if (!task) return;
  fillTaskForm(task, taskId);
}

/**
 * Fills the form fields with the provided task data
 * @param {Object} task - The task object containing the data to fill
 * @param {string} taskId - The Firebase key of the task being edited
 * @returns {void}
 */
async function fillTaskForm(task, taskId) {
  prefillSubtasks.push(task.subtasks || []);
  document.getElementById("title").value = task.title || "";
  document.getElementById("description").value = task.description || "";
  document.getElementById("date").value = task.dueDate || "";
  document.getElementById("category-selected").textContent = task.category || "";
  selectPriority(task.priority);
  prefillAssignees(task.assigned || []);
  preFillSubtasks(task.subtasks || []);
  enableCreateButton();
  Object.assign(document.getElementById("create-btn"), { innerHTML: "Edit ✓", onclick: () => saveEditTask(taskId) });
}

/**
 * Checks the assigned contacts in the dropdown and updates the display
 * @param {Array} assigned - Array of assigned contact objects
 * @returns {void}
 */
function prefillAssignees(assigned) {
  assigned.forEach((a) => {
    const c = currentData.find((c) => c.initials === a.initials);
    if (c) document.getElementById(`contact-${c.firebaseKey}`).checked = true;
  });
  updateSelectedContactsDisplay();
}

/**
 * Determines the task status based on the button ID from the URL.
 * On mobile redirect from the board page, the column button ID is passed.
 * @param {string} id - The button ID (e.g. 'addTaskBoardInProgress', 'addTaskBoardAwaitingFeedback')
 * @returns {string} The corresponding status
 */
function getStatusByButtonId(id) {
  switch (id) {
    case "addTaskBoardInProgress":
      return "inprogress";
    case "addTaskBoardAwaitingFeedback":
      return "feedback";
    default:
      return "todo";
  }
}

/**
 * Reads the button ID from the URL parameter and returns the corresponding status.
 * @returns {string} The status based on the ID or 'todo' as default
 */
function getStatusFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  return getStatusByButtonId(id);
}

/**
 * Returns the currently selected priority
 * @returns {string} The selected priority ('urgent', 'medium', or 'low')
 */
function getSelectedPriority() {
  if (document.getElementById("priority-urgent").classList.contains("selected"))
    return "urgent";
  if (document.getElementById("priority-medium").classList.contains("selected"))
    return "medium";
  if (document.getElementById("priority-low").classList.contains("selected"))
    return "low";
}

/**
 * Creates and posts a new task after validation
 * Shows success notification before redirecting to board
 * @async
 * @returns {Promise<void>}
 */
async function postNewTask(buttonId) {
  if (!validateForm()) return;
  const newTask = collectTaskFormData(
    "title",
    "description",
    "date",
    "category-selected",
    buttonId
  );
  try {
    await postData("task", newTask);
    clearForm();
    showTaskAddedNotification();
  } catch (error) {
    console.error(error);
  }
}

function chooseTaskNotification() {
  switch (site) {
    case "add_task.html":
      showTaskAddedNotification();
      break;
    case "board.html":
      showTaskEditNotification();
      break;
  }

}

/**
 * Displays the "Task added to board" success notification
 * Redirects to board page after animation completes (2 seconds)
 * @returns {void}
 */
function showTaskAddedNotification() {
  const body = document.querySelector("body");
  body.insertAdjacentHTML("beforeend", getTaskAddedNotificationHTML());
  setTimeout(() => {
    window.location.href = "board.html";
  }, 2000);
}

/**
 * Generates the HTML template for the task added success notification
 * @returns {string} HTML template string for the notification
 */
function getTaskAddedNotificationHTML() {
  return `
    <div class="task-added-notification">
      <span>Task added to board</span>
      <img src="./assets/img/addedToBoard.svg" alt="Board icon">
    </div>
  `;
}

/**
 * Collects all task form data by element IDs
 * @param {string} titleId
 * @param {string} descId
 * @param {string} dateId
 * @param {string} categoryId
 * @param {string} buttonId - Used to determine task status
 * @returns {Object} Task object
 */
function collectTaskFormData(titleId, descId, dateId, categoryId, buttonId) {
  const title = document.getElementById(titleId);
  const description = document.getElementById(descId);
  const dueDate = document.getElementById(dateId);
  const category = document.getElementById(categoryId);
  return {
    title: title.value,
    description: description.value,
    dueDate: dueDate.value,
    priority: getSelectedPriority(),
    assigned: getSelectedContacts(),
    category: category.textContent,
    subtasks: subtasks,
    status: getStatus(buttonId),
  };
}

/**
 * Determines the status for the new task based on the button ID or URL parameter
 * @param {string} buttonId - The ID of the button that triggered task creation
 * @returns {string} The status for the new task
 */
function getStatus(buttonId) {
  if (window.innerWidth > 945) {
    return getStatusByButtonId(buttonId);
  } else {
    return getStatusFromUrl();
  }
}

/**
 * Saves the edited task to Firebase and redirects to board
 * @async
 * @param {string} taskId - The Firebase key of the task to save
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
  task.subtasks = (typeof subtasks !== 'undefined' && Array.isArray(subtasks) && subtasks.length)
    ? subtasks
    : (task.subtasks || []);
  await putData(`task/${taskId}`, task);
  showTaskAddedNotification();
}
