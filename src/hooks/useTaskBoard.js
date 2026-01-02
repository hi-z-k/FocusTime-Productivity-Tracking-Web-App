import { useState, useEffect } from "react";
// Import the Firebase functions from your service file
import { 
  addTask as fbAddTask, 
  syncTasks, 
  updateTask as fbUpdateTask, 
  deleteTask as fbDeleteTask 
} from "../services/firebase/taskService";

export function useTaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [stages] = useState(["To-Do", "In Progress", "Done"]);

  // 1. REAL-TIME SYNC: This pulls data from the cloud to your screen
  useEffect(() => {
    console.log("Hook: Starting Firebase real-time sync...");
    
    // This connects to Firestore and listens for any changes
    const unsubscribe = syncTasks((downloadedTasks) => {
      console.log("Hook: Received tasks from Firestore:", downloadedTasks);
      setTasks(downloadedTasks);
    });

    // Cleanup: Stop listening when the user leaves the page
    return () => unsubscribe();
  }, []);

  // 2. ADD TASK: Sends new data to the cloud
  const addTask = async (taskData) => {
    try {
      // We ensure it has a status so it's visible in the 'To-Do' column
      await fbAddTask({
        ...taskData,
        status: "To-Do" 
      });
    } catch (error) {
      console.error("Hook: Failed to add task:", error);
      alert("Error adding task. Check your console.");
    }
  };

  // 3. MOVE TASK (DRAG & DROP): Updates the status in the cloud
  const moveTask = async (taskId, newStage) => {
    try {
      await fbUpdateTask(taskId, { status: newStage });
    } catch (error) {
      console.error("Hook: Failed to move task:", error);
    }
  };

  // 4. DELETE TASK: Removes from cloud
  const deleteTask = async (taskId) => {
    try {
      await fbDeleteTask(taskId);
    } catch (error) {
      console.error("Hook: Failed to delete task:", error);
    }
  };

  // 5. EDIT TASK: Updates titles/descriptions in the cloud
  const editTask = async (taskId, updateData) => {
    try {
      await fbUpdateTask(taskId, updateData);
    } catch (error) {
      console.error("Hook: Failed to edit task:", error);
    }
  };

  // Placeholder functions for stages if you haven't moved them to Firebase yet
  const addStage = (name) => console.log("Add stage logic needed for Firebase");
  const removeStage = (name) => console.log("Remove stage logic needed for Firebase");

  return {
    tasks,
    stages,
    addTask,
    editTask,
    deleteTask,
    moveTask,
    addStage,
    removeStage,
  };
}