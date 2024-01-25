const toDoInput = document.querySelector(".todo-input");
const toDoBtn = document.querySelector(".todo-btn");
const toDoList = document.querySelector(".todo-list");
const standardTheme = document.querySelector(".standard-theme");
const lightTheme = document.querySelector(".light-theme");
const darkerTheme = document.querySelector(".darker-theme");
const rewardDisplay = document.querySelector(".gamify-reward");
const recommendedList = document.querySelector('.recommended-list');

const clickSound = document.getElementById('clickSound');
const delSound = document.getElementById('delSound');

const motivationalQuotes = [
  "Believe you can and you're halfway there. -Theodore Roosevelt",
  "The only way to do great work is to love what you do. -Steve Jobs",
  "Don't watch the clock; do what it does. Keep going. -Sam Levenson",
  "Your time is limited, don't waste it living someone else's life. -Steve Jobs",
  "The future belongs to those who believe in the beauty of their dreams. -Eleanor Roosevelt",
  "Power comes in response to a need not a desire. You have to create that need- Goku",
];

toDoBtn.addEventListener("click", addToDo);
toDoList.addEventListener("click", deleteCheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener("click", () => changeTheme("standard"));
lightTheme.addEventListener("click", () => changeTheme("light"));
darkerTheme.addEventListener("click", () => changeTheme("darker"));

let savedTheme = localStorage.getItem("savedTheme");
savedTheme === null ? changeTheme("standard") : changeTheme(localStorage.getItem("savedTheme"));

let totalPoints = 0;

function addToDo(event) {
  event.preventDefault();
  const prioritySelect = document.querySelector('.priority-select');
  const priority = prioritySelect.value;

  const toDoDiv = document.createElement('div');
  toDoDiv.classList.add('todo', `${savedTheme}-todo`, `${priority}-priority`);

  const newToDo = document.createElement('li');
  newToDo.innerText = toDoInput.value;
  newToDo.classList.add('todo-item');
  toDoDiv.appendChild(newToDo);

  // Capture notes input
  const notesInput = document.querySelector('.notes-input');
  const notes = notesInput.value;
  if (notes) {
    const notesElement = document.createElement('p');
    notesElement.innerText = notes;
    notesElement.classList.add('notes');
    toDoDiv.appendChild(notesElement);
  }

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.classList.add('delete-btn', `${savedTheme}-button`);
  toDoDiv.appendChild(deleteButton);

  const completedButton = document.createElement('button');
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add('check-btn', `${savedTheme}-button`);
  toDoDiv.appendChild(completedButton);

  const editButton = document.createElement('button');
  editButton.innerHTML = '<i class="fas fa-edit"></i>';
  editButton.classList.add('edit-btn', `${savedTheme}-button`);
  toDoDiv.appendChild(editButton);

  toDoList.appendChild(toDoDiv);

  toDoInput.value = '';
  notesInput.value = ''; // Clear notes input after adding todo
  prioritySelect.value = 'low';

  let points;

  switch (priority) {
    case 'low':
      points = 5;
      break;
    case 'medium':
      points = 10;
      break;
    case 'high':
      points = 20;
      break;
    default:
      points = 0;
  }

  updateProgressBar();
  updateRewards(points);

  clickSound.play();
}

// ... (rest of the code remains unchanged)



toDoList.addEventListener("click", deleteCheck);

function uncheckTask(todoDiv) {
  todoDiv.classList.remove('completed');
  updateProgressBar();
  updateRewards(-5);
}

function deleteCheck(event) {
  const item = event.target;

  if (item.classList.contains('delete-btn')) {
    const todoDiv = item.parentElement;
    todoDiv.classList.add('fall');
    removeLocalTodos(todoDiv);

    todoDiv.addEventListener('transitionend', function () {
      todoDiv.remove();
      updateProgressBar();
    });
  }

  if (item.classList.contains('check-btn')) {
    const todoDiv = item.parentElement;

    if (todoDiv.classList.contains('completed')) {
      uncheckTask(todoDiv);
    } else {
      todoDiv.classList.toggle('completed');
      updateProgressBar();
      updateRewards(5);
    }
  }

  delSound.play();
}

function updateProgressBar() {
  const completedTodos = document.querySelectorAll('.completed').length;
  const totalTodos = document.querySelectorAll('.todo').length;
  const progress = (completedTodos / totalTodos) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
}

function updateRewards(points) {
  totalPoints += points;
  rewardDisplay.innerText = `Total Points: ${totalPoints}`;
  if (points > 0) {
    showPointsPopup(`+${points}`);
  }
}

function showPointsPopup(message) {
  const pointsPopup = document.getElementById('pointsPopup');
  const popupText = document.getElementById('popupText');
  popupText.innerText = message;

  pointsPopup.style.display = 'block';
  setTimeout(() => {
    pointsPopup.style.display = 'none';
  }, 2000);
}

function saveLocal(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.forEach(function (todo) {
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todo", `${savedTheme}-todo`);

    const newToDo = document.createElement("li");
    newToDo.innerText = todo;
    newToDo.classList.add("todo-item");
    toDoDiv.appendChild(newToDo);

    const checked = document.createElement("button");
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add("check-btn", `${savedTheme}-button`);
    toDoDiv.appendChild(checked);

    const deleted = document.createElement("button");
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add("delete-btn", `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);

    toDoList.appendChild(toDoDiv);
  });

  const motivationalQuoteContainer = document.getElementById('quoteContainer');
  const motivationalQuote = document.createElement('p');
  motivationalQuote.id = 'motivationalQuote';
  motivationalQuoteContainer.appendChild(motivationalQuote);

  function changeMotivationalQuote() {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const selectedQuote = motivationalQuotes[randomIndex];

    motivationalQuote.style.opacity = 0;

    setTimeout(() => {
      motivationalQuote.innerText = selectedQuote;
      motivationalQuote.style.opacity = 1;
    }, 500);

    setTimeout(() => {
      motivationalQuote.style.opacity = 0;
    }, 6500);
  }

  changeMotivationalQuote();
  setInterval(changeMotivationalQuote, 7000);
}

function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  const todoIndex = todos.indexOf(todo.children[0].innerText);
  todos.splice(todoIndex, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function changeTheme(color) {
  localStorage.setItem("savedTheme", color);
  savedTheme = localStorage.getItem("savedTheme");

  document.body.className = color;

  color === "darker"
    ? document.getElementById("title").classList.add("darker-title")
    : document.getElementById("title").classList.remove("darker-title");

  document.querySelector("input").className = `${color}-input`;

  document.querySelectorAll(".todo").forEach((todo) => {
    Array.from(todo.classList).some((item) => item === "completed")
      ? (todo.className = `todo ${color}-todo completed`)
      : (todo.className = `todo ${color}-todo`);
  });

  document.querySelectorAll("button").forEach((button) => {
    Array.from(button.classList).some((item) => {
      if (item === "check-btn") {
        button.className = `check-btn ${color}-button`;
      } else if (item === "delete-btn") {
        button.className = `delete-btn ${color}-button`;
      } else if (item === "todo-btn") {
        button.className = `todo-btn ${color}-button`;
      }
    });
  });
}

const recommendation = [
  "Exercise for 10 minutes",
  "Read a chapter from a book",
  "Learn a new recipe and cook",
  "Take a short walk outside",
  "Practice mindfulness for 10 minutes",
  "Watch a documentary",
  "Try a new hobby or craft",
  "Do coding and learn something new!",
  "Make your day productive",
];


const iGotThisButton = document.getElementById("recommendTaskButton");
iGotThisButton.addEventListener("click", addToDoWithRecommendation);

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addToDoWithRecommendation();
  }
});

function getRecommendation() {
  const randomIndex = Math.floor(Math.random() * recommendation.length);
  return recommendation[randomIndex];
}

function displayRecommendedTasks() {
  const numberOfTasks = 3;
  for (let i = 0; i < numberOfTasks; i++) {
    const recommendedTask = getRecommendation();
    addRecommendedTask(recommendedTask);
  }
}

function addRecommendedTask(taskName) {
  const recommendedTask = document.createElement('li');
  recommendedTask.innerText = taskName;
  recommendedList.appendChild(recommendedTask);
}

function addToDoWithRecommendation() {
  const recommendedTask = getRecommendation();
  addToDoElement(recommendedTask, 'medium');
}

function addToDoElement(taskName, priority, subtasks) {
  const toDoDiv = document.createElement('div');
  toDoDiv.classList.add('todo', `${savedTheme}-todo`, `${priority}-priority`);

  const newToDo = document.createElement('li');
  newToDo.innerText = taskName;
  newToDo.classList.add('todo-item');
  toDoDiv.appendChild(newToDo);

  // Create subtasks
  if (subtasks && subtasks.length > 0) {
    const subtasksList = document.createElement('ul');
    subtasksList.classList.add('subtasks-list');
    
    subtasks.forEach(subtask => {
      const subtaskItem = document.createElement('li');
      subtaskItem.innerText = subtask;
      subtasksList.appendChild(subtaskItem);
    });

    toDoDiv.appendChild(subtasksList);
  }

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.classList.add('delete-btn', `${savedTheme}-button`);
  toDoDiv.appendChild(deleteButton);

  const completedButton = document.createElement('button');
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add('check-btn', `${savedTheme}-button`);
  toDoDiv.appendChild(completedButton);

  const editButton = document.createElement('button');
  editButton.innerHTML = '<i class="fas fa-edit"></i>';
  editButton.classList.add('edit-btn', `${savedTheme}-button`);
  toDoDiv.appendChild(editButton);

  toDoList.appendChild(toDoDiv);

  saveLocal(taskName);
  updateProgressBar();
  updateRewards(10);
  clickSound.play();
}

function recommendTask() {
  displayRecommendedTasks();
}
