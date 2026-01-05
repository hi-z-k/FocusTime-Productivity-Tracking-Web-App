import { database } from "../services/firebase/firebaseConfig";
import { 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { createNotification } from "./notificationService";

const recordSessionChunk = async (userId, data) => {
  if (!userId || data.duration < 10) return;
  
  const historyRef = collection(database, "users", userId, "sessions");
  await addDoc(historyRef, {
    ...data,
    timestamp: serverTimestamp(),
  });

  const mins = Math.floor(data.duration / 60);
  const message = `Great job! You just completed a ${mins} minute focus session. 🎯`;
  await createNotification(userId, message);
};

const updateLivePointer = async (userId, payload) => {
  if (!userId) return;
  const liveRef = doc(database, "users", userId, "state", "active");
  await setDoc(liveRef, { ...payload, updatedAt: serverTimestamp() }, { merge: true });
};

const listenToTimer = (userId, callback) => {
  if (!userId) return () => {};
  const liveRef = doc(database, "users", userId, "state", "active");
  return onSnapshot(liveRef, (snapshot) => {
    if (snapshot.exists()) callback(snapshot.data());
  });
};

export {
  recordSessionChunk,
  updateLivePointer,
  listenToTimer
};