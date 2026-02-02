// ======= DOM SELECTORS =======
function getElements() {
    return {
        form: document.querySelector("form"),
        input: document.querySelector("#input-text"),
        date: document.querySelector("#date"),
        time: document.querySelector("#time"),
        taskContainer: document.querySelector(".task-container"),
        filterButtons: document.querySelectorAll(".filter button"),
        modalOverlay: document.getElementById("modalOverlay"),
        modalTaskText: document.getElementById("modalTaskText"),
        modalTaskDate: document.getElementById("modalTaskDate"),
        modalTaskTime: document.getElementById("modalTaskTime"),
        closeModal: document.getElementById("closeModal")
    }
}

// ======= LOCAL STORAGE =======
function loadTasks(taskContainer) {
    taskContainer.innerHTML = localStorage.getItem("data") || ""
}

function saveTasks(taskContainer) {
    localStorage.setItem("data", taskContainer.innerHTML)
}

// ======= TIME FORMAT =======
function formatTime12H(time24) {
    if (!time24) return ""

    let [hours, minutes] = time24.split(":")
    hours = Number(hours)

    const period = hours >= 12 ? "PM" : "AM"
    hours = hours % 12 || 12

    return `${hours}:${minutes} ${period}`
}

// ======= CREATE TASK =======
function createTask(input, date, time) {
    const task = document.createElement("p")
    task.className = "task"

    task.innerHTML = `
        <span class="task-text" 
              data-date="${date.value}" 
              data-time="${formatTime12H(time.value)}">
            <i class="fa-regular fa-square"></i>
            ${input.value}
        </span>
        <i class="fa-regular fa-trash-can"></i>
    `

    return task
}

// ======= FORM SUBMIT =======
function handleFormSubmit(elements) {
    elements.form.addEventListener("submit", (e) => {
        e.preventDefault()

        const task = createTask(elements.input, elements.date, elements.time)
        elements.taskContainer.append(task)

        elements.input.value = ""
        elements.date.value = ""
        elements.time.value = ""

        saveTasks(elements.taskContainer)
    })
}

// ======= TASK ACTIONS =======
function toggleComplete(icon) {
    icon.classList.replace("fa-square", "fa-square-check")
    icon.parentElement.style.textDecoration = "line-through"
    icon.closest(".task").classList.add("completed")
}

function togglePending(icon) {
    icon.classList.replace("fa-square-check", "fa-square")
    icon.parentElement.style.textDecoration = "none"
    icon.closest(".task").classList.remove("completed")
}

function handleTaskClick(elements) {
    elements.taskContainer.addEventListener("click", (e) => {

        if (e.target.classList.contains("fa-square")) {
            toggleComplete(e.target)
        }

        else if (e.target.classList.contains("fa-square-check")) {
            togglePending(e.target)
        }

        else if (e.target.classList.contains("fa-trash-can")) {
            e.target.parentElement.remove()
        }

        saveTasks(elements.taskContainer)
    })
}

// ======= FILTER TASKS =======
function handleFilter(elements) {
    elements.filterButtons.forEach(button => {
        button.addEventListener("click", () => {

            elements.filterButtons.forEach(btn => btn.classList.remove("active"))
            button.classList.add("active")

            const filterType = button.dataset.filter
            const tasks = document.querySelectorAll(".task")

            tasks.forEach(task => {
                if (filterType === "all") {
                    task.style.display = "flex"
                }
                else if (filterType === "completed") {
                    task.style.display = task.classList.contains("completed") ? "flex" : "none"
                }
                else if (filterType === "pending") {
                    task.style.display = task.classList.contains("completed") ? "none" : "flex"
                }
            })
        })
    })
}

// ======= MODAL =======
function openModal(task, elements) {
    const textEl = task.querySelector(".task-text")

    elements.modalTaskText.textContent = textEl.textContent.trim()
    elements.modalTaskDate.textContent = textEl.dataset.date || "Not set"
    elements.modalTaskTime.textContent = textEl.dataset.time || "Not set"

    elements.modalOverlay.style.display = "flex"
}

function handleModal(elements) {
    elements.taskContainer.addEventListener("click", (e) => {
        if (e.target.closest("i")) return

        const task = e.target.closest(".task")
        if (!task) return

        openModal(task, elements)
    })

    elements.closeModal.addEventListener("click", () => {
        elements.modalOverlay.style.display = "none"
    })

    elements.modalOverlay.addEventListener("click", (e) => {
        if (e.target === elements.modalOverlay) {
            elements.modalOverlay.style.display = "none"
        }
    })
}

// ======= MAIN FUNCTION =======
function main() {
    const elements = getElements()

    loadTasks(elements.taskContainer)
    handleFormSubmit(elements)
    handleTaskClick(elements)
    handleFilter(elements)
    handleModal(elements)
}

// ======= INVOKE MAIN =======
main()
