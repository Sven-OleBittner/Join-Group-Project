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
    renderSubTask(task, index);
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


function renderSubTask(task, index) {
   const subTasksContainer = document.getElementById('task-subtasks' + index);
    if (task.subtask != null) {
      subTasksContainer.innerHTML += getSubTemplate(task);
    } else {
      subTasksContainer.innerHTML = '';
    }
}


function getAvatarBg(index) {
  const colors = [
    '#FF7A00', // orange
    '#FF5EB3', // pink
    '#6E52FF', // purple
    '#00BEE8', // cyan
    '#1FD7C1', // turquoise
    '#FF745E', // coral
    '#FFA35E', // peach
    '#0038FF', // blue
    '#C3FF2B', // lime-green
    '#FF4646', // red
    '#FFC701'  // yellow
  ];
  return colors[index % colors.length];
}

function renderAvatars(taskAssigned, index) {
  let avatarsContainer = document.getElementById('avatarsFoto' + index);
  avatarsContainer.innerHTML = '';

  for (let i = 0; i < taskAssigned.length; i++) {
    const backgroundColor = getAvatarBg(i);

    avatarsContainer.innerHTML += `
      <div class="kb-avatar" style="background:${backgroundColor}" title="${taskAssigned[i].initials}">
        ${taskAssigned[i].initials}
      </div>
    `;
  }
}