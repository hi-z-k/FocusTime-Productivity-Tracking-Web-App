import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  addTask as fbAddTask,
  syncTasks,
  updateTask as fbUpdateTask,
  deleteTask as fbDeleteTask,
  addStageToDb,
  syncStages,
  deleteStageFromDb,
} from "../services/firebase/taskService";

export function useTaskBoard() {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  // Initialize with core stages so they appear immediately
  const [stages, setStages] = useState(["To-Do", "In Progress", "Done"]);
  const [saving, setSaving] = useState({});
  const [loading, setLoading] = useState(true);

  /* ===================== TASK SYNC ===================== */
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = syncTasks(user.uid, (downloadedTasks) => {
      const sorted = [...(downloadedTasks || [])].sort((a, b) => {
        const ta = a?.createdAt?.toMillis?.() ?? 0;
        const tb = b?.createdAt?.toMillis?.() ?? 0;
        return tb - ta;
      });
      setTasks(sorted);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  /* ===================== STAGE SYNC (The Missing Link) ===================== */
  useEffect(() => {
    if (!user?.uid) return;

    // Listen for changes in the 'stages' collection in Firestore
    const unsubscribe = syncStages((downloadedStages) => {
      const coreStages = ["To-Do", "In Progress", "Done"];
      const customStages = downloadedStages.map((s) => s.name);
      
      // Combine core + custom and remove duplicates
      const finalStages = [...new Set([...coreStages, ...customStages])];
      
      setStages(finalStages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  /* ===================== TASK ACTIONS ===================== */
  const addTask = async (taskData) => {
    if (!user?.uid) return;
    try {
      await fbAddTask(user.uid, {
        ...taskData,
        status: "To-Do",
        completed: false,
      });
    } catch (error) {
      console.error("useTaskBoard: addTask failed", error);
      throw error;
    }
  };

  const editTask = async (taskId, updateData) => {
    if (!user?.uid || !taskId) return;
    try {
      await fbUpdateTask(user.uid, taskId, updateData);
    } catch (error) {
      console.error("useTaskBoard: editTask failed", error);
    }
  };

  const deleteTask = async (taskId) => {
    if (!user?.uid || !taskId) return;
    try {
      await fbDeleteTask(user.uid, taskId);
    } catch (error) {
      console.error("useTaskBoard: deleteTask failed", error);
    }
  };

  const moveTask = async (taskId, newStage) => {
    if (!user?.uid || !taskId) return;
    try {
      await fbUpdateTask(user.uid, taskId, { status: newStage });
    } catch (error) {
      console.error("useTaskBoard: moveTask failed", error);
    }
  };

  /* ===================== STAGE ACTIONS ===================== */
  const addStage = async (stageName) => {
    if (!stageName || stages.includes(stageName)) return;
    try {
      // Backend write
      await addStageToDb(stageName);
    } catch (error) {
      console.error("useTaskBoard: addStage failed", error);
    }
  };

  const removeStage = async (stageName) => {
    if (!stageName) return;
    try {
      // Backend delete
      await deleteStageFromDb(stageName);
    } catch (error) {
      console.error("useTaskBoard: removeStage failed", error);
    }
  };

  /* ===================== PUBLIC API ===================== */
  return {
    tasks,
    stages,
    saving,
    loading,
    addTask,
    editTask,
    deleteTask,
    moveTask,
    addStage,
    removeStage,
  };
}