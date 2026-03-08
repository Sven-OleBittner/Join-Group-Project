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


function getSubTemplate(subtasks, percent, completedSubtasks) {
  console.log("percent:", percent, "completed:", completedSubtasks, "total:", subtasks.length);
  return `
    <div class="kb-progress">
      <div class="kb-progress-bar" style="width:${percent}%"></div>
    </div>
    <span class="kb-subtasks">${completedSubtasks}/${subtasks.length}</span>
  `;
}
