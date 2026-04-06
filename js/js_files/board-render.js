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
