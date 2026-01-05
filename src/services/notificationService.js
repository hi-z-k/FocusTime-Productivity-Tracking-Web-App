import { database } from "./firebase/firebaseConfig.js";
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  writeBatch, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from "firebase/firestore";

const createNotification = async (userId, message) => {
  if (!userId) return;
  try {
    const notesRef = collection(database, "users", userId, "notifications");
    await addDoc(notesRef, {
      text: message,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

const listenToNotifications = (userId, callback) => {
  if (!userId) return () => {};

  const notesRef = collection(database, "users", userId, "notifications");
  const q = query(notesRef, orderBy("createdAt", "desc"), limit(15));

  return onSnapshot(q, (snapshot) => {
    const notes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(notes);
  });
};

const markAsRead = async (userId, notificationId) => {
  if (!userId || !notificationId) return;
  const noteRef = doc(database, "users", userId, "notifications", notificationId);
  await updateDoc(noteRef, { read: true });
};

const clearAllNotifications = async (userId, notifications) => {
  if (!userId || notifications.length === 0) return;
  
  const batch = writeBatch(database);
  notifications.forEach((note) => {
    const noteRef = doc(database, "users", userId, "notifications", note.id);
    batch.delete(noteRef);
  });
  
  await batch.commit();
};

export { 
  createNotification, 
  listenToNotifications, 
  markAsRead, 
  clearAllNotifications 
};