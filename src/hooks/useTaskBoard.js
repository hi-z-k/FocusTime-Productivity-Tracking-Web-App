import { useState, useEffect } from "react";
import { 
  addTask as fbAddTask, 
  syncTasks, 
  updateTask as fbUpdateTask, 
  deleteTask as fbDeleteTask,
  addStageToDb,
  syncStages,
  deleteStageFromDb 
} from "../services/firebase/taskService";

export function useTaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sync Tasks
    const unsubscribeTasks = syncTasks((downloadedTasks) => {
      setTasks(downloadedTasks);
    });

    // Sync Stages (Columns)
    const unsubscribeStages = syncStages((downloadedStages) => {
      if (downloadedStages.length === 0) {
        setStages(["To-Do", "In Progress", "Done"]);
      } else {
        setStages(downloadedStages.map(s => s.name));
      }
      setLoading(false);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeStages();
    };
  }, []);

  const addTask = async (taskData) => {
    try {
      const defaultStatus = stages[0] || "To-Do";
      await fbAddTask({
        ...taskData,
        status: defaultStatus 
      });
    } catch (error) {
      console.error("Hook: Failed to add task:", error);
    }
  };

  const addStage = async (name) => {
    if (stages.includes(name)) return;
    try {
      await addStageToDb(name);
    } catch (error) {
      console.error("Hook: Failed to add stage:", error);
    }
  };

  // UPDATED: This now triggers the backend deletion
  const removeStage = async (name) => {
    try {
      await deleteStageFromDb(name);
      console.log("Hook: Stage removed successfully");
    } catch (error) {
      console.error("Hook: Failed to remove stage:", error);
    }
  };

  const moveTask = async (taskId, newStage) => {
    try {
      await fbUpdateTask(taskId, { status: newStage });
    } catch (error) {
      console.error("Hook: Failed to move task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fbDeleteTask(taskId);
    } catch (error) {
      console.error("Hook: Failed to delete task:", error);
    }
  };

  const editTask = async (taskId, updateData) => {
    try {
      await fbUpdateTask(taskId, updateData);
    } catch (error) {
      console.error("Hook: Failed to edit task:", error);
    }
  };

  const unsubscribeStages = syncStages((downloadedStages) => {
  const defaultStages = ["To-Do", "In Progress", "Done"];
  
  // Extract custom names from Firestore
  const customStages = downloadedStages.map(s => s.name);
  
  // Combine them: Defaults first, then custom ones
  // Set allows us to avoid duplicates if "To-Do" is also in the DB
  const combinedStages = [...new Set([...defaultStages, ...customStages])];
  
  setStages(combinedStages);
  setLoading(false);
});

  return {
    tasks,
    stages,
    loading,
    addTask,
    editTask,
    deleteTask,
    moveTask,
    addStage,
    removeStage,
  };
}