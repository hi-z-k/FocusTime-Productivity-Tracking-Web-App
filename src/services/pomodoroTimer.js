import { database } from "../services/firebase/firebaseConfig";
import { 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  onSnapshot, 
  serverTimestamp, 
  increment 
} from "firebase/firestore";
import { createNotification } from "./notificationService";

/**
 * Records a completed session and ensures it is formatted for the streak logic.
 */
export const recordSessionChunk = async (userId, data) => {
  if (!userId || data.duration < 10) return;
  
  try {
    // 1. Save individual session log for analytics and streak
    const historyRef = collection(database, "users", userId, "sessions");
    await addDoc(historyRef, {
      mode: data.mode || "focus",
      status: data.status || "completed", // streak hook looks for 'completed'
      duration: data.duration,
      timestamp: serverTimestamp(),
    });

    // 2. Update Global Stats for XP and pet evolution
    if (data.mode === "focus" && data.status === "completed") {
      const statsRef = doc(database, "userStats", userId);
      const hoursEarned = data.duration / 3600;

      await setDoc(statsRef, {
        hoursSpent: increment(hoursEarned),
        lastActive: serverTimestamp(),
      }, { merge: true });
    }

    // 3. Local notification
    const mins = Math.floor(data.duration / 60);
    const message = data.mode === "focus" 
      ? `Great job! ${mins} mins added to your progress! 🔥`
      : `Break over! Time to focus.`;
    
    await createNotification(userId, message);

  } catch (error) {
    console.error("Error in recordSessionChunk:", error);
  }
};

export const updateLivePointer = async (userId, payload) => {
  if (!userId) return;
  try {
    const liveRef = doc(database, "users", userId, "state", "active");
    await setDoc(liveRef, { ...payload, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error("Error updating live pointer:", error);
  }
};

export const listenToTimer = (userId, callback) => {
  if (!userId) return () => {};
  const liveRef = doc(database, "users", userId, "state", "active");
  return onSnapshot(liveRef, (snapshot) => {
    if (snapshot.exists()) callback(snapshot.data());
  });
};