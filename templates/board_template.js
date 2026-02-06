function getTasksTemplate(task, backgroundColor, index) {
  return `
  <article class="kb-card" data-due="${task.dueDate || ''}"
              data-subtasks='${JSON.stringify(task.subtasks || [])}'>
              <div class="kb-card-top">
                <span class="${backgroundColor} kb-chip">${task.category.name || 'Technical Task'}</span>
              </div>
              <h3 class="kb-card-title">${task.title}</h3>
              <p class="kb-card-desc">${task.description}</p>
              <div id="task-subtasks${index}" class="kb-progress-row"></div>
              <footer class="kb-card-foot">
                <div id="avatarsFoto${index}" class="kb-avatars" data-assignees="${task.assignees || ''}"></div>
                <div class="kb-prio kb-prio--${task.priority || 'urgent'}">
                  <span class="kb-prio__icon" aria-hidden="true"></span>
                </div>
              </footer>
            </article>
  `;
}


function getSubTemplate(task) {
  return `<div class="kb-progress">
                  <div class="kb-progress-bar" style="width:${task.progress || 0}%"></div>
                </div>
                <span class="kb-subtasks">${task.subtasksCompleted || 0}/${task.subtasksTotal || 0}</span>
              </div>
  </articele>`;
}