import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// Import the Firebase functions from your service file
import {
  addTask as fbAddTask,
  syncTasks,
  updateTask as fbUpdateTask,
  deleteTask as fbDeleteTask,
} from "../services/firebase/taskService";

export function useTaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [stages] = useState(["To-Do", "In Progress", "Done"]);
  const [saving, setSaving] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = syncTasks(user.uid, (downloadedTasks) => {
      const sorted = [...(downloadedTasks || [])].sort((a, b) => {
        const ta = a?.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const tb = b?.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return tb - ta;
      });
      setTasks(sorted);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const addTask = async (taskData) => {
    try {
      console.log("Hook: addTask called with", taskData, "userId:", user?.uid);
      await fbAddTask(user?.uid, {
        ...taskData,
        status: "todo",
        completed: false,
      });
      console.log("Hook: addTask success");
      // NO local state update here. We rely on syncTasks to update "tasks" state.
    } catch (error) {
      console.error("Hook: Failed to add task:", error);
      alert("Error adding task. Check your console.");
      throw error; // Let the UI know it failed
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
      console.log(`Hook: moveTask called for ${taskId} to ${newStage}`);
      await fbUpdateTask(user?.uid, taskId, { status: newStage });
      console.log("Hook: moveTask success");
    } catch (error) {
      console.error("Hook: Failed to move task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      console.log(`Hook: deleteTask called for ${taskId}`);
      await fbDeleteTask(user?.uid, taskId);
      console.log("Hook: deleteTask success");
    } catch (error) {
      console.error("Hook: Failed to delete task:", error);
    }
  };

  const editTask = async (taskId, updateData) => {
    try {
      console.log(`Hook: editTask called for ${taskId}`, updateData);
      await fbUpdateTask(user?.uid, taskId, updateData);
      console.log("Hook: editTask success");
    } catch (error) {
      console.error("Hook: Failed to edit task:", error);
    }
  };

  // Checkbox handler: optimistic status update for snappy UI
  const updateTaskStatus = async (taskId, newStatus) => {
    const prev = tasks.find((t) => t.id === taskId)?.status;
    setSaving((s) => ({ ...s, [taskId]: true }));
    setTasks((ts) =>
      ts.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    try {
      console.log(`Hook: updateTaskStatus ${taskId} -> ${newStatus}`);
      await fbUpdateTask(user?.uid, taskId, { status: newStatus });
      console.log("Hook: updateTaskStatus success");
    } catch (error) {
      console.error("Hook: Failed to update task status:", error);
      setTasks((ts) =>
        ts.map((t) => (t.id === taskId ? { ...t, status: prev } : t))
      );
    } finally {
      setSaving((s) => {
        const next = { ...s };
        delete next[taskId];
        return next;
      });
    }
  };

  // Placeholder functions for stages if you haven't moved them to Firebase yet
  const addStage = (name) => console.log("Add stage logic needed for Firebase");
  const removeStage = (name) =>
    console.log("Remove stage logic needed for Firebase");

  return {
    tasks,
    stages,
    saving,
    addTask,
    editTask,
    deleteTask,
    moveTask,
    addStage,
    removeStage,
    updateTaskStatus,
  };
}
