function getTasksTemplate(id, task, key, backgroundColor, priority) {
  return `
  <article id="task-${key}" onclick="openTaskModal('${key}')" ondragstart="dragStart('task-${key}')" draggable="true" class="kb-card" data-due="${task.dueDate || ''}"
              data-subtasks='${JSON.stringify(task.subtasks || [])}'>
              <div class="kb-card-top">
                <span class="${backgroundColor} kb-chip">${(task.category && task.category.name) || 'Technical Task'}</span>
              </div>
              <h3 class="kb-card-title">${task.title}</h3>
              <p class="kb-card-desc">${task.description}</p>
              <div id="task-${key}-subtasks-${id}" class="kb-progress-row"></div>
              <footer class="kb-card-foot">
                <div id="task-${key}-avatars-${id}" class="kb-avatars" data-assignees="${task.assigned || ''}"></div>
                <div class="kb-prio kb-prio--${task.priority || 'urgent'}">
                  <img src="./assets/img/${priority}" alt="${task.priority}-icon">
                </div>
              </footer>
            </article>
  `;
}


function getSubTemplate(task, percent, compleatedSubtasks) {
  return `<div class="kb-progress">
                  <div class="kb-progress-bar" style="width:${percent}%"></div>
                </div>
                <span class="kb-subtasks">${compleatedSubtasks || 0}/${task.subtasks.length || 0}</span>
              </div>
  </articele>`;
}