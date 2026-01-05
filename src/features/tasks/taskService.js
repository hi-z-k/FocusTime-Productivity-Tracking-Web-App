const STORAGE_KEY = "my_task_board_data";
const STAGES_KEY = "my_task_board_stages";

// ------------------ Helpers ------------------

const readFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error("Error reading localStorage:", error);
    return fallback;
  }
};

const writeToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};

// ------------------ TASKS ------------------

export async function getTasks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(readFromStorage(STORAGE_KEY, []));
    }, 300);
  });
}

export async function addTask(task) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tasks = readFromStorage(STORAGE_KEY, []);
      const updated = [...tasks, task];
      writeToStorage(STORAGE_KEY, updated);
      resolve(task);
    }, 300);
  });
}

export async function updateTask(taskId, updateData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tasks = readFromStorage(STORAGE_KEY, []);
      const index = tasks.findIndex((t) => t.id === taskId);

      if (index === -1) {
        reject(new Error("Task not found"));
        return;
      }

      tasks[index] = { ...tasks[index], ...updateData };
      writeToStorage(STORAGE_KEY, tasks);
      resolve(tasks[index]);
    }, 300);
  });
}

export async function deleteTask(taskId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tasks = readFromStorage(STORAGE_KEY, []);
      const exists = tasks.some((t) => t.id === taskId);

      if (!exists) {
        reject(new Error("Task not found"));
        return;
      }

      const updated = tasks.filter((task) => task.id !== taskId);
      writeToStorage(STORAGE_KEY, updated);
      resolve();
    }, 300);
  });
}

// ------------------ STAGES ------------------

export async function getStages() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const defaultStages = ["To-Do", "In Progress", "Done"];
      resolve(readFromStorage(STAGES_KEY, defaultStages));
    }, 200);
  });
}

export async function saveStages(stages) {
  return new Promise((resolve) => {
    setTimeout(() => {
      writeToStorage(STAGES_KEY, stages);
      resolve(stages);
    }, 200);
  });
}
