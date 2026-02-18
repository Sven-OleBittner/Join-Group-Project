function getTasksTemplate(id, task, backgroundColor, index, priority) {
  return `
  <article draggable="true" ondragstart="handleDragStart(event)" ondragend="handleDragEnd(event)" class="kb-card" data-due="${task.dueDate || ''}"
              data-subtasks='${JSON.stringify(task.subtasks || [])}'>
              <div class="kb-card-top">
                <span class="${backgroundColor} kb-chip">${task.category.name || 'Technical Task'}</span>
              </div>
              <h3 class="kb-card-title">${task.title}</h3>
              <p class="kb-card-desc">${task.description}</p>
              <div id="${index}task-subtasks${id}" class="kb-progress-row"></div>
              <footer class="kb-card-foot">
                <div id="${index}avatarsFoto${id}" class="kb-avatars" data-assignees="${task.assignees || ''}"></div>
                <div class="kb-prio kb-prio--${task.priority || 'urgent'}">
                  <img src="./assets/img/${priority}" alt="${task.priority}-icon">
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