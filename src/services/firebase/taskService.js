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
