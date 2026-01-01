import { database } from "../services/firebase/firebaseConfig";
import { 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";

export const recordSessionChunk = async (userId, data) => {
  if (!userId || data.duration < 10) return;
  const historyRef = collection(database, "users", userId, "sessions");
  await addDoc(historyRef, {
    ...data,
    timestamp: serverTimestamp(),
  });
};

export const updateLivePointer = async (userId, payload) => {
  if (!userId) return;
  const liveRef = doc(database, "users", userId, "state", "active");
  await setDoc(liveRef, { ...payload, updatedAt: serverTimestamp() }, { merge: true });
};

export const listenToTimer = (userId, callback) => {
  const liveRef = doc(database, "users", userId, "state", "active");
  return onSnapshot(liveRef, (snapshot) => {
    if (snapshot.exists()) callback(snapshot.data());
  });
};