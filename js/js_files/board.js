async function createTask() {
  // hole die Tasks aus Firebase
  const tasksData = await getData("tasks");
  
  // finde den Container
  const container = document.getElementById('tasks-container');
  container.innerHTML = '';
  
  // gehe durch alle Tasks
  for (let taskId in tasksData) {
    const task = tasksData[taskId];
    const taskHTML = getTasksTemplate(task);
    container.innerHTML += taskHTML;
  }
  
  console.log("Tasks geladen!");
}