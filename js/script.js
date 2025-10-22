const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoDate = document.getElementById("todo-date");
const todoTable = document.querySelector("#todo-table tbody");
const filterInput = document.getElementById("filter-input");
const statusFilter = document.getElementById("status-filter");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

document.addEventListener("DOMContentLoaded", loadTodos);
form.addEventListener("submit", addTodo);
todoTable.addEventListener("click", handleTableClick);
filterInput.addEventListener("keyup", applyFilters);
statusFilter.addEventListener("change", applyFilters);

function addTodo(e) {
  e.preventDefault();
  const task = todoInput.value.trim();
  const date = todoDate.value;

  if (task === "" || date === "") {
    alert("Please fill in both fields!");
    return;
  }

  const todo = { task, date, completed: false };
  todos.push(todo);
  saveTodos();
  renderTable();

  todoInput.value = "";
  todoDate.value = "";
}

function renderTable(filtered = todos) {
  todoTable.innerHTML = "";
  filtered.forEach((todo, index) => {
    const row = document.createElement("tr");
    if (todo.completed) row.classList.add("completed");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${todo.task}</td>
      <td>${todo.date}</td>
      <td>
        <input type="checkbox" class="complete-checkbox" data-index="${index}" ${todo.completed ? "checked" : ""}>
      </td>
      <td><button class="delete-btn" data-index="${index}">Delete</button></td>
    `;
    todoTable.appendChild(row);
  });
}

function handleTableClick(e) {
  const index = e.target.getAttribute("data-index");
  
  if (e.target.classList.contains("delete-btn")) {
    todos.splice(index, 1);
    saveTodos();
    renderTable(getFilteredTodos());
  }

  if (e.target.classList.contains("complete-checkbox")) {
    todos[index].completed = e.target.checked;
    saveTodos();
    renderTable(getFilteredTodos());
  }
}

function applyFilters() {
  const filtered = getFilteredTodos();
  renderTable(filtered);
}

function getFilteredTodos() {
  const text = filterInput.value.toLowerCase();
  const status = statusFilter.value;

  return todos.filter(todo => {
    const matchesText = todo.task.toLowerCase().includes(text);
    const matchesStatus =
      status === "all" ||
      (status === "completed" && todo.completed) ||
      (status === "pending" && !todo.completed);

    return matchesText && matchesStatus;
  });
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  renderTable();
}