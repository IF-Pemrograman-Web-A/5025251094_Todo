document.addEventListener("DOMContentLoaded", () => {
    // Initial default task objects (reset on refresh)
    let todos = [
        {
            id: 1,
            title: "Kerjain Pra-Praktikum Jaringan Komputer",
            desc: "Completing the initial network topology design and subnetting exercises before submission.",
            dueDate: "Today",
            completed: false
        },
        {
            id: 2,
            title: "Selesaikan Web To-do list",
            desc: "Implement dynamic DOM manipulation, dark mode, and state management.",
            dueDate: "Tomorrow",
            completed: false
        }
    ];

    let selectedTaskId = 1;
    let editingTaskId = null;

    // DOM Elements
    const themeToggleBtn = document.getElementById("modeToggle");
    const todoList = document.getElementById("todoList");
    const todoForm = document.getElementById("todoForm");
    const taskTitleInput = document.getElementById("taskTitle");
    const taskDescInput = document.getElementById("taskDesc");
    const taskDateInput = document.getElementById("taskDate");
    const submitBtn = document.getElementById("submitBtn");
    const cancelEditBtn = document.getElementById("cancelEditBtn");
    const formHeading = document.getElementById("formHeading");

    const detailTitle = document.getElementById("detailTitle");
    const detailDate = document.getElementById("detailDate");
    const detailStatus = document.getElementById("detailStatus");
    const detailDesc = document.getElementById("detailDesc");
    const editBtn = document.getElementById("editBtn");
    const deleteBtn = document.getElementById("deleteBtn");

    // 1. Dark Mode Toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
        });
    }

    // Render list items dynamically
    function startList() {
        todoList.innerHTML = "";

        todos.forEach((todo) => {
            const li = document.createElement("li");
            li.className = `todoItem ${todo.id === selectedTaskId ? "active" : ""} ${todo.completed ? "completed" : ""}`;
            li.dataset.id = todo.id;

            li.innerHTML = `
                <input type="checkbox" class="todoCheckbox" ${todo.completed ? "checked" : ""}>
                <div class="taskContent">
                    <h3>${todo.title}</h3>
                    <p>Due: ${todo.dueDate || "No date"}</p>
                </div>
            `;

            const checkbox = li.querySelector(".todoCheckbox");

            // Stop click propagation to prevent triggering <li> click
            checkbox.addEventListener("click", (e) => {
                e.stopPropagation();
            });

            // Handle checking/unchecking finished tasks
            checkbox.addEventListener("change", () => {
                todo.completed = checkbox.checked;
                startList();
                startDetail();
            });

            // Select task on card click (ignoring checkbox)
            li.addEventListener("click", (e) => {
                if (e.target !== checkbox) {
                    selectedTaskId = todo.id;
                    startList();
                    startDetail();
                }
            });

            todoList.appendChild(li);
        });
    }

    // Render detail panel view
    function startDetail() {
        const selectedTodo = todos.find((t) => t.id === selectedTaskId);

        if (!selectedTodo) {
            detailTitle.textContent = "No task selected";
            detailDate.textContent = "-";
            detailStatus.textContent = "-";
            detailDesc.textContent = "Select or create a task from the list.";
            editBtn.style.display = "none";
            deleteBtn.style.display = "none";
            return;
        }

        editBtn.style.display = "inline-block";
        deleteBtn.style.display = "inline-block";

        detailTitle.textContent = selectedTodo.title;
        detailDate.textContent = selectedTodo.dueDate || "No due date";
        detailStatus.textContent = selectedTodo.completed ? "Completed" : "Pending";
        detailDesc.textContent = selectedTodo.desc || "No description provided.";
    }

    // 2. Form Submit: Create or Edit Task Object
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = taskTitleInput.value.trim();
        const desc = taskDescInput.value.trim();
        const dueDate = taskDateInput.value;

        if (!title) return;

        if (editingTaskId !== null) {
            // Edit existing task object
            const taskToEdit = todos.find((t) => t.id === editingTaskId);
            if (taskToEdit) {
                taskToEdit.title = title;
                taskToEdit.desc = desc;
                taskToEdit.dueDate = dueDate;
            }
            resetFormState();
        } else {
            // Create new task object
            const newTask = {
                id: Date.now(),
                title,
                desc,
                dueDate,
                completed: false
            };
            todos.push(newTask);
            selectedTaskId = newTask.id;
            todoForm.reset();
        }

        startList();
        startDetail();
    });

    // 3. Edit Action
    editBtn.addEventListener("click", () => {
        const selectedTodo = todos.find((t) => t.id === selectedTaskId);
        if (!selectedTodo) return;

        editingTaskId = selectedTodo.id;
        taskTitleInput.value = selectedTodo.title;
        taskDescInput.value = selectedTodo.desc;
        taskDateInput.value = selectedTodo.dueDate === "Today" || selectedTodo.dueDate === "Tomorrow" ? "" : selectedTodo.dueDate;

        formHeading.textContent = "Edit Task";
        submitBtn.textContent = "Update Task";
        cancelEditBtn.style.display = "inline-block";
    });

    // Cancel Edit
    cancelEditBtn.addEventListener("click", resetFormState);

    function resetFormState() {
        editingTaskId = null;
        todoForm.reset();
        formHeading.textContent = "Create a New Task";
        submitBtn.textContent = "Add Task";
        cancelEditBtn.style.display = "none";
    }

    // 4. Delete Action
    deleteBtn.addEventListener("click", () => {
        if (selectedTaskId === null) return;

        todos = todos.filter((t) => t.id !== selectedTaskId);
        selectedTaskId = todos.length > 0 ? todos[0].id : null;

        if (editingTaskId) resetFormState();

        startList();
        startDetail();
    });

    // Initial render call
    startList();
    startDetail();
});