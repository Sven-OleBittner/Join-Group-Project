function initSite() {
  renderTask();
}


async function renderTask() {
  const tasksData = await getData("task");
  const taskArray = Object.values(tasksData);
  const container = document.getElementById('tasks-container');
  container.innerHTML = '';
  for (let index = 0; index < taskArray.length; index++) {
    const task = taskArray[index];
    let backgroundColor = getCategoryColor(task.category);
    container.innerHTML += getTasksTemplate(task, backgroundColor, index);
    renderSubTask(task);
    renderAvatars(task.assigned, index);
  }
}


function getCategoryColor(category) {
  const name = category && typeof category === 'object' ? category.name : category;
  if (name === 'Technical Task') {
    return 'color-turquoise';
  } else{
    return 'color-blue';
  } 
}


function renderSubTask(task) {
   const subTasksContainer = document.getElementById('task-subtasks');
    if (task.subtask != null) {
      subTasksContainer.innerHTML += getSubTemplate(task);
    } else {
      subTasksContainer.innerHTML = '';
    }
}


function renderAvatars(taskAssigned, index) {
   let avatarsContainer = document.getElementById('avatarsFoto' + index);
    avatarsContainer.innerHTML = '';
    for (let i = 0; i < taskAssigned.length; i++) {
      avatarsContainer.innerHTML += `<div class="kb-avatar color-orange" title="${taskAssigned[i].initials}">${taskAssigned[i].initials}</div>`;
    }
    
  }