/**
 * Returns the HTML template for a task card
 * @param {string} id - Container id
 * @param {Object} task - Task object
 * @param {string} key - Firebase key of the task
 * @param {string} backgroundColor - CSS class for category color
 * @param {string} priority - Priority image or key
 * @param {any} priorityOptions - Optional priority options
 * @returns {string} HTML string for the task card
 */
function getTasksTemplate(id, task, key, backgroundColor, priority, priorityOptions) {
  return `
  <article id="task-${key}" onclick="openTaskModal('${key}')" ondragstart="dragStart('task-${key}', event)" draggable="true" class="kb-card" data-due="${task.dueDate || ''}"
              data-subtasks='${JSON.stringify(task.subtasks || [])}'>
              <div class="kb-card-top">
                <span class="${backgroundColor} kb-chip">${(task.category)}</span>
                <div class="kb-card-options" onclick="event.stopPropagation()">
                  <button onclick="toggleOptions('moveToMenu-${key}'); closeAllOtherOptions('moveToMenu-${key}'); event.stopPropagation();" class="kb-icon-options-menu">
                    <span  class="dot">...</span>
                  </button>
                  <div id="moveToMenu-${key}" class="responsiveMoveTo" >
                    <button class="moveToBtn" onclick="moveToResp('toDoTaskList', '${key}')">Move to ToDo</button>
                    <button class="moveToBtn" onclick="moveToResp('inProgressTaskList', '${key}')">Move to In Progress</button>
                    <button class="moveToBtn" onclick="moveToResp('awaitFeedbackTaskList', '${key}')">Move to Awaiting Feedback</button>
                    <button class="moveToBtn" onclick="moveToResp('doneTaskList', '${key}')">Move to Done</button>
                  </div>
                </div>
              </div>
              <h3 class="kb-card-title">${task.title}</h3>
              <p class="kb-card-desc">${task.description}</p>
              <div id="task-${key}-subtasks-${id}" class="kb-progress-row"></div>
              <footer class="kb-card-foot">
                <div id="task-${key}-avatars-${id}" class="kb-avatars" data-assignees="${task.assigned || ""}"></div>
                <div class="kb-prio kb-prio--${task.priority || "urgent"}">
                  <img src="./assets/img/${priority}" alt="${task.priority}-icon">
                </div>
              </footer>
            </article>
  `;
}


/**
 * Returns the HTML for the subtask progress bar and counter
 * @param {Array} subtasks - Array of subtasks
 * @param {number} percent - Completion percentage
 * @param {number} completedSubtasks - Number of completed subtasks
 * @returns {string} HTML string for the subtask progress
 */
function getSubTemplate(subtasks, percent, completedSubtasks) {
  return `
    <div class="kb-progress">
      <div class="kb-progress-bar" style="width:${percent}%"></div>
    </div>
    <span class="kb-subtasks">${completedSubtasks}/${subtasks.length}</span>
  `;
}

/**
 * Renders a single avatar entry for the modal (non-overflow)
 * @param {HTMLElement} container - Container element where avatar will be placed
 * @param {Object} assignee - Assignee object with `initials` and `name`
 * @returns {string}
 */
function renderSingleModalAvatarTemplate(container, assignee) {
  return`
    <div class="td-person">
      <div class="kb-avatar ${assignee.color || color}">${assignee.initials}</div>
      <span class="td-person__name">${assignee.name}</span>
    </div>
  `;
}

/**
 * Renders an overflow avatar entry for the modal
 * @param {number} remaining - Number of remaining assignees not shown
 * @returns {string}
 */
function renderOverflowModalTemplate(remaining) {
  return `
    <div class="td-person">
      <div class="kb-avatar color-aquamarine">+${remaining}</div>
    </div>
  `;
}

/**
 * Returns HTML for a modal subtask list item
 * @param {Object|string} sub - Subtask object or string
 * @param {number} index - Index of the subtask
 * @returns {string}
 */
function getModalSubtaskTemplate(sub, index) {
  const label = typeof sub === "string" ? sub : sub.text;
  const isChecked = typeof sub === "object" && sub.completed ? "checked" : "";
  return `
    <li class="td-task" id="td-task-item-${index}">
      <input type="checkbox" id="subtask-${index}" ${isChecked}
        onchange="toggleSubtaskStyle(${index}, this.checked)">
      <label for="subtask-${index}" class="td-task__label">${label}</label>
    </li>
  `;
}