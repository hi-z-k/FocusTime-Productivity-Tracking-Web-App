import { database } from "./firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";

// Function to add a task to Firestore
export const addTask = async (taskData) => {
  return await addDoc(collection(database, "tasks"), {
    ...taskData,
    createdAt: new Date()
  });
};

// Function to sync tasks in real-time
export const syncTasks = (callback) => {
  const q = query(collection(database, "tasks"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(tasks);
  });
};

export const updateTask = async (id, data) => {
  const taskRef = doc(database, "tasks", id);
  return await updateDoc(taskRef, data);
};

export const deleteTask = async (id) => {
  const taskRef = doc(database, "tasks", id);
  return await deleteDoc(taskRef);
};