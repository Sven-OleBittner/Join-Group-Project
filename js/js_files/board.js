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
    await renderAvatars(task.assigned, index);
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


async function renderAvatars(taskAssigned, index) {
  let avatarsContainer = document.getElementById('avatarsFoto' + index);
  avatarsContainer.innerHTML = '';

  for (let i = 0; i < taskAssigned.length; i++) {
    const color = await getContactBg(taskAssigned[i].initials);

    avatarsContainer.innerHTML += `
      <div class="kb-avatar ${color}" title="${taskAssigned[i].initials}">
        ${taskAssigned[i].initials}
      </div>
    `;
  }
}


async function getContactBg(taskAssigned) {
  const contactDb = await getData("contacts"); 
  const contactArray = Object.values(contactDb);
  let contact = contactArray.find(contact => contact.initials === taskAssigned);
  return contact ? contact.color : 'color-default';
}