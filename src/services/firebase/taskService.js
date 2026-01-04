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