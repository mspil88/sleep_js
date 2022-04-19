const draggables = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".wind-down-draggable");
const deleteBtns = document.querySelectorAll(".fa-trash-alt");
const wdTasks = document.querySelector(".wd-task");
const addTaskBtn = document.querySelector(".add-task-btn");
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

// add task
    //create task

const createTask = (taskName) => {
    taskElem = document.createElement("p");
    taskElem.className = "draggable";
    taskElem.draggable = true;
    
    taskElem.innerHTML = `${taskName} <i class="fas fa-trash-alt">`;
    console.log(taskElem);
    wdTasks.appendChild(taskElem);
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
    createTask(treatInput(taskInput.value));
    taskInput.value = '';
})

// save schedule

