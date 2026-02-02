import { auth } from "../services/auth.js";
import { api } from "../services/api.js";

let currentTasks = [];
let currentUsers = [];
let editTaskId = null;
let activeFilter = "all";

export async function renderAdminDashboard() {
  if (!auth.requireAdmin()) return;

  const session = auth.getSession();
  const app = document.getElementById("app");

  app.innerHTML = `
        <div class="app-container">
            <aside class="sidebar">
                <div class="sidebar-logo">
                    <img src="/assets/logo2.svg" alt="Task Manager Logo" class="logo-img">
                </div>
                <nav class="sidebar-nav">
                    <a class="nav-item active" onclick="navigateTo('/admin/dashboard')">
                        <i class="bi bi-grid"></i>
                        <span>Dashboard</span>
                    </a>
                    <a class="nav-item" onclick="navigateTo('/user/dashboard')">
                        <i class="bi bi-check2-square"></i>
                        <span>My Tasks</span>
                    </a>
                    <a class="nav-item" onclick="navigateTo('/admin/profile')">
                        <i class="bi bi-person"></i>
                        <span>Profile</span>
                    </a>
                </nav>
            </aside>

            <main class="main-content">
                <header class="page-header">
                    <div class="page-header-left">
                        <div class="breadcrumb">
                            <i class="bi bi-house-door"></i>
                            <span>›</span>
                            <span>Dashboard</span>
                        </div>
                        <h1 class="page-title">Task Manager</h1>
                        <p class="page-subtitle">Overview of your current academic performance tasks.</p>
                    </div>
                    <div class="page-header-right">
                        <button class="btn-icon">
                            <i class="bi bi-bell"></i>
                        </button>
                        <div class="user-profile" onclick="navigateTo('/admin/profile')">
                            <div class="user-avatar">${session.avatar}</div>
                            <div class="user-info">
                                <div class="user-name">${session.name}</div>
                                <div class="user-role">${session.jobTitle || "Admin"}</div>
                            </div>
                            <i class="bi bi-chevron-down"></i>
                            
                        </div>
                        <button class="btn-icon" onclick="window.logout()">
                            <i class="bi bi-box-arrow-right"></i>
                        </button>
                    </div>
                </header>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-title">Total Tasks</div>
                            <div class="stat-icon blue">
                                <i class="bi bi-layers"></i>
                            </div>
                        </div>
                        <div class="stat-value" id="totalTasks">0</div>
                        <div class="stat-label positive">
                            <i class="bi bi-arrow-up"></i>
                            <span>+12% from last week</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-title">Completed</div>
                            <div class="stat-icon green">
                                <i class="bi bi-check-circle"></i>
                            </div>
                        </div>
                        <div class="stat-value" id="completedTasks">0</div>
                        <div class="stat-label positive">
                            <i class="bi bi-check"></i>
                            <span>On track</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-title">Pending</div>
                            <div class="stat-icon orange">
                                <i class="bi bi-clock-history"></i>
                            </div>
                        </div>
                        <div class="stat-value" id="pendingTasks">0</div>
                        <div class="stat-label negative">
                            <i class="bi bi-exclamation-circle"></i>
                            <span id="highPriorityLabel">2 High Priority</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-title">Overall Progress</div>
                            <div class="stat-icon purple">
                                <i class="bi bi-pie-chart"></i>
                            </div>
                        </div>
                        <div class="stat-value" id="progressPercent">0%</div>
                        <div class="stat-label positive">
                            <i class="bi bi-graph-up-arrow"></i>
                            <span>Keep it up</span>
                        </div>
                    </div>
                </div>

                <div class="task-section">
                    <div class="task-section-header">
                        <div class="section-controls">
                            <div class="search-box">
                                <i class="bi bi-search"></i>
                                <input type="text" placeholder="Search tasks..." id="searchInput">
                            </div>
                            <div class="task-tabs">
                                <button class="task-tab active" data-filter="all" onclick="window.filterTasks('all')">All Tasks</button>
                                <button class="task-tab" data-filter="pending" onclick="window.filterTasks('pending')">Pending</button>
                                <button class="task-tab" data-filter="completed" onclick="window.filterTasks('completed')">Completed</button>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="window.openNewTaskModal()">
                            <i class="bi bi-plus-circle"></i>
                            New Task
                        </button>
                    </div>
                    
                    <div class="task-table-container">
                        <table class="task-table">
                            <thead>
                                <tr>
                                    <th>TASK NAME</th>
                                    <th>ASSIGNEE</th>
                                    <th>STATUS</th>
                                    <th>PRIORITY</th>
                                    <th>DUE DATE</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody id="taskTableBody">
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>

        <div class="modal" id="taskModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" id="modalTitle">New Task</h2>
                    <button class="modal-close" onclick="window.closeModal()">×</button>
                </div>
                <form id="taskForm">
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">Assignee *</label>
                            <select class="form-control" id="taskUserId" required></select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Task Title *</label>
                            <input type="text" class="form-control" id="taskTitle" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" id="taskDescription" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Status *</label>
                            <select class="form-control" id="taskStatus" required>
                                <option value="pending">Pending</option>
                                <option value="in progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Priority *</label>
                            <select class="form-control" id="taskPriority" required>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Due Date</label>
                            <input type="date" class="form-control" id="taskDueDate">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="window.closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Task</button>
                    </div>
                </form>
            </div>
        </div>
    `;

  await loadData();
  setupEventListeners();

  window.logout = () => auth.logout();
  window.filterTasks = filterTasks;
  window.openNewTaskModal = openNewTaskModal;
  window.editTask = editTask;
  window.deleteTask = deleteTask;
  window.closeModal = closeModal;
}

async function loadData() {
  [currentTasks, currentUsers] = await Promise.all([
    api.getTasks(),
    api.getUsers(),
  ]);

  populateUserSelect();
  updateStats();
  renderTasks();
}

function populateUserSelect() {
  const select = document.getElementById("taskUserId");
  select.innerHTML = currentUsers
    .filter((u) => u.role === "user")
    .map((u) => `<option value="${u.id}">${u.name} (${u.email})</option>`)
    .join("");
}

function updateStats() {
  const total = currentTasks.length;
  const completed = currentTasks.filter((t) => t.status === "completed").length;
  const pending = currentTasks.filter((t) => t.status === "pending").length;
  const highPriority = currentTasks.filter(
    (t) => t.priority === "high" && t.status !== "completed",
  ).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  document.getElementById("totalTasks").textContent = total;
  document.getElementById("completedTasks").textContent = completed;
  document.getElementById("pendingTasks").textContent = pending;
  document.getElementById("progressPercent").textContent = progress + "%";
  document.getElementById("highPriorityLabel").textContent =
    `${highPriority} High Priority`;
}

function renderTasks() {
  const tbody = document.getElementById("taskTableBody");

  let tasksToShow = currentTasks;
  if (activeFilter !== "all") {
    tasksToShow = currentTasks.filter((t) => t.status === activeFilter);
  }

  if (tasksToShow.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 60px 20px;">
                    <div class="empty-state">
                        <i class="bi bi-inbox"></i>
                        <h3>No tasks found</h3>
                        <p>Create your first task to get started</p>
                    </div>
                </td>
            </tr>
        `;
    return;
  }

  tbody.innerHTML = tasksToShow
    .map((task) => {
      const user = currentUsers.find((u) => u.id === task.userId);
      const avatar = user ? user.avatar : "U";
      const assignee = task.assignee || (user ? user.name : "Unknown");

      return `
        <tr>
            <td class="task-name">${task.title}</td>
            <td>
                <div class="task-assignee">
                    <div class="assignee-avatar">${avatar}</div>
                    <span class="assignee-name">${assignee}</span>
                </div>
            </td>
            <td>
                <span class="status-badge ${task.status.replace(" ", "-")}">${capitalizeStatus(task.status)}</span>
            </td>
            <td>
                <div class="priority-indicator">
                    <span class="priority-dot ${task.priority}"></span>
                    <span>${capitalize(task.priority)}</span>
                </div>
            </td>
            <td>${task.dueDate ? formatDate(task.dueDate) : "-"}</td>
            <td>
                <div class="task-actions">
                    <button class="btn-icon" onclick="window.editTask(${task.id})" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-icon" onclick="window.deleteTask(${task.id})" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                    ${
                      task.status !== "completed"
                        ? `
                        <button class="btn-icon" onclick="window.viewTask(${task.id})" title="View">
                            <i class="bi bi-eye"></i>
                        </button>
                    `
                        : ""
                    }
                </div>
            </td>
        </tr>
    `;
    })
    .join("");
}

function setupEventListeners() {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = currentTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description &&
          task.description.toLowerCase().includes(searchTerm)) ||
        (task.assignee && task.assignee.toLowerCase().includes(searchTerm)),
    );
    renderFilteredTasks(filtered);
  });

  document
    .getElementById("taskForm")
    .addEventListener("submit", handleTaskSubmit);
}

function renderFilteredTasks(tasks) {
  const tbody = document.getElementById("taskTableBody");

  if (tasks.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <p style="color: var(--text-secondary);">No tasks match your search</p>
                </td>
            </tr>
        `;
    return;
  }

  tbody.innerHTML = tasks
    .map((task) => {
      const user = currentUsers.find((u) => u.id === task.userId);
      const avatar = user ? user.avatar : "U";
      const assignee = task.assignee || (user ? user.name : "Unknown");

      return `
        <tr>
            <td class="task-name">${task.title}</td>
            <td>
                <div class="task-assignee">
                    <div class="assignee-avatar">${avatar}</div>
                    <span class="assignee-name">${assignee}</span>
                </div>
            </td>
            <td>
                <span class="status-badge ${task.status.replace(" ", "-")}">${capitalizeStatus(task.status)}</span>
            </td>
            <td>
                <div class="priority-indicator">
                    <span class="priority-dot ${task.priority}"></span>
                    <span>${capitalize(task.priority)}</span>
                </div>
            </td>
            <td>${task.dueDate ? formatDate(task.dueDate) : "-"}</td>
            <td>
                <div class="task-actions">
                    <button class="btn-icon" onclick="window.editTask(${task.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-icon" onclick="window.deleteTask(${task.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
    })
    .join("");
}

function filterTasks(filter) {
  activeFilter = filter;
  document.querySelectorAll(".task-tab").forEach((tab) => {
    tab.classList.remove("active");
    if (tab.dataset.filter === filter) {
      tab.classList.add("active");
    }
  });
  renderTasks();
}

function openNewTaskModal() {
  editTaskId = null;
  document.getElementById("modalTitle").textContent = "New Task";
  document.getElementById("taskForm").reset();
  document.getElementById("taskModal").classList.add("active");
}

function editTask(id) {
  editTaskId = id;
  const task = currentTasks.find((t) => t.id === id);

  document.getElementById("modalTitle").textContent = "Edit Task";
  document.getElementById("taskUserId").value = task.userId;
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDescription").value = task.description || "";
  document.getElementById("taskStatus").value = task.status;
  document.getElementById("taskPriority").value = task.priority;
  document.getElementById("taskDueDate").value = task.dueDate || "";

  document.getElementById("taskModal").classList.add("active");
}

async function handleTaskSubmit(e) {
  e.preventDefault();

  const userId = parseInt(document.getElementById("taskUserId").value);
  const user = currentUsers.find((u) => u.id === userId);

  const taskData = {
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    status: document.getElementById("taskStatus").value,
    priority: document.getElementById("taskPriority").value,
    dueDate: document.getElementById("taskDueDate").value,
    userId: userId,
    assignee: user ? user.name : "",
  };

  try {
    if (editTaskId) {
      await api.updateTask(editTaskId, taskData);
    } else {
      await api.createTask(taskData);
    }

    closeModal();
    await loadData();
  } catch (error) {
    alert("Error saving task");
  }
}

async function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  try {
    await api.deleteTask(id);
    await loadData();
  } catch (error) {
    alert("Error deleting task");
  }
}

function closeModal() {
  document.getElementById("taskModal").classList.remove("active");
  editTaskId = null;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeStatus(status) {
  return status
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

window.viewTask = (id) => {
  const task = currentTasks.find((t) => t.id === id);
  if (task) {
    alert(
      `Task: ${task.title}\nDescription: ${task.description || "No description"}\nStatus: ${task.status}\nPriority: ${task.priority}`,
    );
  }
};
