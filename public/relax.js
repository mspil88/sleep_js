const draggables = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".wind-down-draggable");
const deleteBtns = document.querySelectorAll(".fa-trash-alt");
const wdTasks = document.querySelector(".wd-task");
const wdSchedule = document.querySelector(".wd-schedule");
const addTaskBtn = document.querySelector(".add-task-btn");
const saveBtn = document.querySelector(".save-schedule-btn");
const taskInput = document.querySelector(".task-input");

let draggablesArray = Array.from(draggables)

const assignDraggableEvents = (draggablesArray) => {
    draggablesArray.forEach(draggable => {
    console.log("DRAGGABLE LIST")
    console.log(draggablesArray);
    draggable.addEventListener("dragstart", () => {
        console.log("dragstart")    
        draggable.classList.add("dragging")
    })

    draggable.addEventListener("dragend", () => {
        console.log("dragstart")
        draggable.classList.remove("dragging")
    })
    })
}

assignDraggableEvents(draggablesArray);

containers.forEach(container => {
  container.addEventListener("dragover", e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(container, e.clientY)
    console.log(afterElement);
    const draggable = document.querySelector(".dragging")
    console.log(draggable);
    if (afterElement == null) {
      container.appendChild(draggable)
    } else {
      container.insertBefore(draggable, afterElement)
    }
  })
})

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")]

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}

deleteBtns.forEach((btn)=> {
    btn.addEventListener("click", ()=> {
        console.log("delete me")
    })
})

const createTask = (taskName, containerElem) => {
    taskElem = document.createElement("p");
    taskElem.className = "draggable";
    taskElem.draggable = true;
    
    taskElem.innerHTML = `${taskName}<i class="fas fa-trash-alt">`;
    console.log(taskElem);
    containerElem.appendChild(taskElem);
    draggablesArray.push(taskElem);
    console.log(draggablesArray);
    assignDraggableEvents(draggablesArray);

}

const treatInput = (text) => {
    return text.trim();
} 

addTaskBtn.addEventListener("click", ()=> {
    console.log("add btn");
    console.log(taskInput.value);
    createTask(treatInput(taskInput.value), wdTasks);
    taskInput.value = '';
})

//get tasks
//get schedule

const createTasksObj = (myTasks, myScheduledTasks) => {
  return {tasks: myTasks,
        scheduledTasks: myScheduledTasks}
}

const getTasksFromContainers = (container) => {
  let tasks = [];
  for(let i of container.children) {
    if(i.tagName === "P") {
      tasks.push(i.textContent);
    }
  }
  return tasks.join(",")
}

saveBtn.addEventListener("click", ()=> {
  const myTasks = getTasksFromContainers(containers[0]);
  const myScheduledTasks = getTasksFromContainers(containers[1]);

  const taskData = createTasksObj(myTasks, myScheduledTasks);
  const checkLocal = JSON.parse(localStorage.getItem("tasks"));

  if(checkLocal) {
    try {
      patchTasksData(checkLocal._id, taskData);
    } catch(error) {
      console.log(error.response.data);
    }
  
    } else {
    postTasksData(taskData);
  }
})

const getTasksData = async() => {
  const config = {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}};
  let tasksData = await axios.get("/api/v1/tasks", config);
  return tasksData.data;
}

const postTasksData = async(tasksObj) => {
  const config = {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}};
  try {
      let result = await axios.post("api/v1/tasks", tasksObj, config);
  }
  catch (error) {
      console.error(error.response.data);
  }
}

const patchTasksData = async(taskId, taskObj) => {
  const config = {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}};
  console.log(`api/v1/tasks/${taskId}`);
  await axios.patch(`api/v1/tasks/${taskId}`, taskObj, config)
}

const renderTasks = (tasksData, containerElem) => {
  const tasksDataArray = tasksData.split(",")
  for(let i of tasksDataArray) {
    createTask(i, containerElem)
  }
}



window.onload = async() => {
  console.log("loading and getting tasks")
  let tasksData = await getTasksData();
  localStorage.setItem("tasks", JSON.stringify(tasksData.tasks[0]));
  const {tasks, scheduledTasks} = tasksData.tasks[0];
  renderTasks(tasks, wdTasks);
  renderTasks(scheduledTasks, wdSchedule);
}