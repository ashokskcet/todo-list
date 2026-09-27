const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const addButton = document.getElementById("addButton");

const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

const searchInput = document.getElementById("searchInput");
const allButton = document.getElementById("allButton");
const activeButton = document.getElementById("activeButton");
const completedButton = document.getElementById("completedButton");
const themeToggle = document.getElementById("themeToggle");

let currentFilter = "all";


function updateTaskCount() {

    const tasks = taskList.querySelectorAll("li");

    const completed =
        taskList.querySelectorAll(
            'input[type="checkbox"]:checked'
        );

    const total = tasks.length;
    const completedCount = completed.length;
    const remaining = total - completedCount;

    totalTasks.textContent = total;
    completedTasks.textContent = completedCount;
    remainingTasks.textContent = remaining;

    taskCount.textContent =
        remaining + " tasks remaining";
}


function saveTasks() {

    const tasks = [];

    taskList.querySelectorAll("li").forEach(function (li) {

        const checkbox = li.querySelector('input[type="checkbox"]');
        const span = li.querySelector(".task-text");

        tasks.push({
            text: span.dataset.text,
            completed: checkbox.checked,
            dueDate: span.dataset.dueDate,
            priority: span.dataset.priority
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function createTask(
    taskText,
    completed = false,
    taskDueDate = "",
    taskPriority = "medium"
) {

    const li = document.createElement("li");


    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.checked = completed;


    const taskInfo = document.createElement("div");

    taskInfo.className = "task-info";


    const span = document.createElement("span");

    span.className = "task-text";

    span.textContent = taskText;

    span.dataset.text = taskText;
    span.dataset.dueDate = taskDueDate;
    span.dataset.priority = taskPriority;


    if (completed) {
        span.classList.add("completed");
    }


    taskInfo.appendChild(span);


    if (taskDueDate !== "") {

        const date = document.createElement("small");

        date.className = "task-date";

        date.textContent = "Due: " + taskDueDate;

        taskInfo.appendChild(date);
    }


    const priorityLabel = document.createElement("span");

    priorityLabel.className =
        "priority priority-" + taskPriority;

    priorityLabel.textContent =
        taskPriority.charAt(0).toUpperCase() +
        taskPriority.slice(1);


    const editButton = document.createElement("button");

    editButton.textContent = "Edit";


    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";


    checkbox.addEventListener("change", function () {

        span.classList.toggle(
            "completed",
            checkbox.checked
        );

        updateTaskCount();

        saveTasks();
    });


    editButton.addEventListener("click", function () {

        const newText = prompt(
            "Edit your task:",
            span.dataset.text
        );

        if (newText !== null && newText.trim() !== "") {

            span.textContent = newText.trim();

            span.dataset.text = newText.trim();

            saveTasks();

            filterTasks();
        }
    });


    deleteButton.addEventListener("click", function () {

        li.remove();

        updateTaskCount();

        saveTasks();
    });


    li.appendChild(checkbox);

    li.appendChild(taskInfo);

    li.appendChild(priorityLabel);

    li.appendChild(editButton);

    li.appendChild(deleteButton);


    taskList.appendChild(li);
}


addButton.addEventListener("click", function () {

    const taskText = taskInput.value.trim();

    if (taskText === "") {

        alert("Please enter a task!");

        return;
    }


    createTask(
        taskText,
        false,
        dueDate.value,
        priority.value
    );


    updateTaskCount();

    saveTasks();

    filterTasks();


    taskInput.value = "";

    dueDate.value = "";

    priority.value = "medium";
});


taskInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        addButton.click();
    }
});


function filterTasks() {

    const searchText =
        searchInput.value.toLowerCase();


    taskList.querySelectorAll("li").forEach(function (li) {

        const span = li.querySelector(".task-text");

        const checkbox =
            li.querySelector('input[type="checkbox"]');


        const taskText =
            span.dataset.text.toLowerCase();


        const matchesSearch =
            taskText.includes(searchText);


        let matchesFilter = true;


        if (currentFilter === "active") {

            matchesFilter = !checkbox.checked;
        }


        if (currentFilter === "completed") {

            matchesFilter = checkbox.checked;
        }


        if (matchesSearch && matchesFilter) {

            li.style.display = "flex";

        } else {

            li.style.display = "none";
        }
    });
}


searchInput.addEventListener("input", function () {

    filterTasks();
});


allButton.addEventListener("click", function () {

    currentFilter = "all";

    filterTasks();
});


activeButton.addEventListener("click", function () {

    currentFilter = "active";

    filterTasks();
});


completedButton.addEventListener("click", function () {

    currentFilter = "completed";

    filterTasks();
});


const savedTasks =
    JSON.parse(localStorage.getItem("tasks")) || [];


savedTasks.forEach(function (task) {

    createTask(
        task.text,
        task.completed,
        task.dueDate || "",
        task.priority || "medium"
    );
});


updateTaskCount();

filterTasks();

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
}

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        themeToggle.textContent = "☀️ Light Mode";

        localStorage.setItem("theme", "dark");

    } else {

        themeToggle.textContent = "🌙 Dark Mode";

        localStorage.setItem("theme", "light");
    }
});