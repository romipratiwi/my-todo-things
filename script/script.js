const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const filters = document.querySelectorAll(".filters button");
const clearCompleted = document.getElementById("clear-completed");
const toggleAll = document.getElementById("toggle-all");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  list.innerHTML = "";
  let filtered = todos;
  if (filter === "active") filtered = todos.filter(t => !t.completed);
  if (filter === "completed") filtered = todos.filter(t => t.completed);

  filtered.forEach((todo, index) => {
    const li = document.createElement("li");
    if (todo.completed) li.classList.add("completed");

    li.innerHTML = `
      <label>
        <input type="checkbox" ${todo.completed ? "checked" : ""} data-index="${index}" />
        <span>${todo.text}</span>
      </label>
      <span class="delete" data-index="${index}">✖</span>
    `;

    list.appendChild(li);
  });

  itemsLeft.textContent = `${todos.filter(t => !t.completed).length} item lagi !`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    todos.push({ text, completed: false });
    saveTodos();
    renderTodos();
    input.value = "";
  }
});

function showConfirm(message, onConfirm) {
  const modal = document.getElementById("confirm-modal");
  const msg = document.getElementById("confirm-message");
  const yes = document.getElementById("confirm-yes");
  const no = document.getElementById("confirm-no");

  msg.textContent = message;
  modal.classList.add("show");

  const close = () => {
    modal.classList.remove("show");
    yes.onclick = null;
    no.onclick = null;
  };

  yes.onclick = () => {
    close();
    onConfirm();
  };

  no.onclick = close;
}


list.addEventListener("click", (e) => {
  const li = e.target.closest("li");

  if (e.target.matches("input[type='checkbox']")) {
    const idx = e.target.dataset.index;
    todos[idx].completed = e.target.checked;
    saveTodos();
    renderTodos();
    return;
  }

  if (e.target.classList.contains("delete")) {
  const idx = e.target.dataset.index;
  showConfirm("Yakin mau buang todo ini? Nanti nyesel loh!", () => {
    todos.splice(idx, 1);
    saveTodos();
    renderTodos();
  });
  return;
}


  if (li) {
    list.querySelectorAll("li").forEach(item => item.classList.remove("active"));
    li.classList.add("active");
  }
});

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    renderTodos();
  });
});

clearCompleted.addEventListener("click", () => {
  showConfirm("Todos yang sudah mau dibuang, siap?", () => {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
  });
});

toggleAll.addEventListener("click", () => {
  const allCompleted = todos.every(t => t.completed);
  todos.forEach(t => t.completed = !allCompleted);
  saveTodos();
  renderTodos();
});

renderTodos();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('script/sw.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('SW registration failed:', err));
  });
}

