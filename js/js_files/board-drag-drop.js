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
