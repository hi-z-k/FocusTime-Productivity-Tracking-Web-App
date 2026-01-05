// Main TaskBoard logic and state management (Firebase-backed)

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import {
  addTask as fbAddTask,
  syncTasks,
  updateTask as fbUpdateTask,
  deleteTask as fbDeleteTask,
  addStageToDb,
  deleteStageFromDb,
} from "../services/firebase/taskService";

export function useTaskBoard() {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [stages] = useState(["To-Do", "In Progress", "Done"]);
  const [saving, setSaving] = useState({});

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

  /* ===================== TASK ACTIONS ===================== */

  const addTask = async (taskData) => {
    if (!user?.uid) return;

    try {
      await fbAddTask(user.uid, {
        ...taskData,
        status: "To-Do",
        completed: false,
      });
      // State updates come from syncTasks listener
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

  /* ===================== OPTIMISTIC STATUS UPDATE ===================== */

  const updateTaskStatus = async (taskId, newStatus) => {
    if (!user?.uid || !taskId) return;

    const previous = tasks.find((t) => t.id === taskId)?.status;

    setSaving((s) => ({ ...s, [taskId]: true }));
    setTasks((ts) =>
      ts.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await fbUpdateTask(user.uid, taskId, { status: newStatus });
    } catch (error) {
      console.error("useTaskBoard: updateTaskStatus failed", error);
      setTasks((ts) =>
        ts.map((t) => (t.id === taskId ? { ...t, status: previous } : t))
      );
    } finally {
      setSaving((s) => {
        const next = { ...s };
        delete next[taskId];
        return next;
      });
    }
  };

  /* ===================== STAGE ACTIONS ===================== */

  const addStage = async (stageName) => {
    if (!stageName) return;

    try {
      await addStageToDb(stageName);
    } catch (error) {
      console.error("useTaskBoard: addStage failed", error);
    }
  };

  const removeStage = async (stageName) => {
    if (!stageName) return;

    try {
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
    addTask,
    editTask,
    deleteTask,
    moveTask,
    updateTaskStatus,
    addStage,
    removeStage,
  };
}
