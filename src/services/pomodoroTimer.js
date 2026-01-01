import { database } from "../services/firebase/firebaseConfig";
import { doc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

const getTimerRef = (userId) => doc(database, "users", userId, "state", "active");

export const syncTimerStart = async (userId, timeLeft, mode) => {
  const expiresAt = new Date(Date.now() + timeLeft * 1000);
  await setDoc(getTimerRef(userId), {
    isRunning: true,
    expiresAt,
    mode,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export const syncTimerPause = async (userId, timeLeft, mode) => {
  await setDoc(getTimerRef(userId), {
    isRunning: false,
    expiresAt: null, 
    timeLeftAtPause: timeLeft,
    mode,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export const listenToRemoteTimer = (userId, callback) => {
  return onSnapshot(getTimerRef(userId), (snapshot) => {
    if (snapshot.exists()) callback(snapshot.data());
  });
};