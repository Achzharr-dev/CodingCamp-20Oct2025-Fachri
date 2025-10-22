const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoDate = document.getElementById("todo-date");
const todoTable = document.querySelector("#todo-table tbody");
const filterInput = document.getElementById("filter-input");
const filterButton = document.getElementById("filter-button");
const filterMenu = document.getElementById("filter-menu");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  renderTable(todos);
});

// ===== Add Todo =====
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = todoInput.value.trim();
  const date = todoDate.value;

  if (task === "" || date === "") {
    alert("Please fill in both fields!");
    return;
  }

  const todo = { id: Date.now(), task, date, completed: false };
  todos.push(todo);
  saveTodos();
  renderTable(todos);

  todoInput.value = "";
  todoDate.value = "";
});

// ===== Event Delegation =====
todoTable.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  const checkbox = e.target.closest(".complete-checkbox");

  if (deleteBtn) {
    const id = Number(deleteBtn.dataset.id);
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderTable(getFilteredTodos());
  }

  if (checkbox) {
    const id = Number(checkbox.dataset.id);
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: checkbox.checked } : todo
    );
    saveTodos();
    renderTable(getFilteredTodos());
  }
});

// ===== Filter Search =====
filterInput.addEventListener("keyup", () => {
  renderTable(getFilteredTodos());
});

// ===== Dropdown Filter =====
filterButton.addEventListener("click", () => {
  filterMenu.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
  if (!filterButton.contains(e.target) && !filterMenu.contains(e.target)) {
    filterMenu.classList.add("hidden");
  }
});

filterMenu.querySelectorAll("li").forEach((item) => {
  item.addEventListener("click", () => {
    currentFilter = item.getAttribute("data-status");
    filterButton.textContent = `Filter: ${item.textContent} ▼`;
    filterMenu.classList.add("hidden");
    renderTable(getFilteredTodos());
  });
});

// ===== Render Table =====
function renderTable(data) {
  todoTable.innerHTML = "";
  data.forEach((todo, index) => {
    const row = document.createElement("tr");
    if (todo.completed) row.classList.add("completed");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${todo.task}</td>
      <td>${todo.date}</td>
      <td>
        <input type="checkbox" class="complete-checkbox" data-id="${todo.id}" ${todo.completed ? "checked" : ""}>
      </td>
      <td><button class="delete-btn" data-id="${todo.id}">Delete</button></td>
    `;
    todoTable.appendChild(row);
  });
}

// ===== Filter Logic =====
function getFilteredTodos() {
  const text = filterInput.value.toLowerCase();
  return todos.filter((todo) => {
    const matchesText = todo.task.toLowerCase().includes(text);
    const matchesStatus =
      currentFilter === "all" ||
      (currentFilter === "completed" && todo.completed) ||
      (currentFilter === "pending" && !todo.completed);
    return matchesText && matchesStatus;
  });
}

// ===== LocalStorage =====
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}