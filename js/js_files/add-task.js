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
    standartselectPriority();
    await loadContactsForDropdown();
}

/**
 * Determines the task status based on the button ID from the URL.
 * On mobile redirect from the board page, the column button ID is passed.
 * @param {string} id - The button ID (e.g. 'addTaskInProgress', 'addTaskAwaitingFeedback')
 * @returns {string} The corresponding status
 */
function getStatusByButtonId(id) {
    switch (id) {
        case "addTaskInProgress":
            return "inprogress";
        case "addTaskAwaitingFeedback":
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
    const id = params.get('id');
    return getStatusByButtonId(id);
}

/**
 * Returns the currently selected priority
 * @returns {string} The selected priority ('urgent', 'medium', or 'low')
 */
function getSelectedPriority() {
  if (document.getElementById('priority-urgent').classList.contains('selected')) return 'urgent';
  if (document.getElementById('priority-medium').classList.contains('selected')) return 'medium';
  if (document.getElementById('priority-low').classList.contains('selected')) return 'low';
}

/**
 * Creates and posts a new task after validation
 * Shows success notification before redirecting to board
 * @async
 * @returns {Promise<void>}
 */
async function postNewTask() {
  if (!validateForm()) return;
  const newTask = collectTaskFormData('title', 'description', 'date', 'category-selected');
  try {
    await postData('task', newTask);
    clearForm();
    showTaskAddedNotification();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Displays the "Task added to board" success notification
 * Redirects to board page after animation completes (2 seconds)
 * @returns {void}
 */
function showTaskAddedNotification() {
  const body = document.querySelector('body');
  body.insertAdjacentHTML('beforeend', getTaskAddedNotificationHTML());
  setTimeout(() => {
    window.location.href = 'board.html';
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
 * @returns {Object} Task object
 */
function collectTaskFormData(titleId, descId, dateId, categoryId) {
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
    category: category.value,
    subtasks: subtasks,
    status: getStatusFromUrl()
  };
}
