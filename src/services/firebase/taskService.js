import { database } from "./firebaseConfig";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  where, 
  getDocs, 
  serverTimestamp 
} from "firebase/firestore";

// --- COLUMN (STAGE) BACKEND ---

export const addStageToDb = async (stageName) => {
  return await addDoc(collection(database, "stages"), {
    name: stageName,
    createdAt: serverTimestamp(),
    order: Date.now() 
  });
};

export const syncStages = (callback) => {
  const q = query(collection(database, "stages"), orderBy("order", "asc"));
  return onSnapshot(q, (snapshot) => {
    const stages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(stages);
  });
};

// New function to handle the deletion logic
export const deleteStageFromDb = async (stageName) => {
  const q = query(collection(database, "stages"), where("name", "==", stageName));
  const querySnapshot = await getDocs(q);
  
  // Delete the specific document found by name
  const deletePromises = querySnapshot.docs.map((document) => deleteDoc(document.ref));
  return await Promise.all(deletePromises);
};

// --- TASK BACKEND ---

export const addTask = async (taskData) => {
  return await addDoc(collection(database, "tasks"), {
    ...taskData,
    createdAt: serverTimestamp()
  });
};

export const syncTasks = (callback) => {
  const q = query(collection(database, "tasks"), orderBy("createdAt", "desc"));
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";

const tasksCollection = collection(database, "task");

export const addTask = async (userId, taskData) => {
  if (!userId) throw new Error("addTask: Missing userId");
  const payload = {
    ...taskData,
    userId,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(tasksCollection, payload);
  return ref;
};

export const syncTasks = (userId, callback) => {
  if (!userId) return () => {};
  const q = query(tasksCollection, where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(tasks);
  });
};

export const updateTask = async (userId, id, data) => {
  if (!id) throw new Error("updateTask: Missing id");
  const taskRef = doc(database, "task", id);
  return await updateDoc(taskRef, data);
};

export const deleteTask = async (userId, id) => {
  if (!id) throw new Error("deleteTask: Missing id");
  const taskRef = doc(database, "task", id);
  return await deleteDoc(taskRef);
};
