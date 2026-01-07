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
 * Records a completed or partial session and updates global user stats.
 */
const recordSessionChunk = async (userId, data) => {
  // safety check: don't record sessions shorter than 10 seconds
  if (!userId || data.duration < 10) return;
  
  try {
    // 1. Save the individual session log (used for the Weekly Bar Chart)
    const historyRef = collection(database, "users", userId, "sessions");
    await addDoc(historyRef, {
      ...data,
      timestamp: serverTimestamp(),
    });

    // 2. Update Global Stats (used for Focus XP circle and Pet Evolution)
    // Only 'focus' sessions that are 'completed' count toward XP
    if (data.mode === "focus" && data.status === "completed") {
      const statsRef = doc(database, "userStats", userId);
      
      // Convert seconds to hours for the XP calculation
      const hoursEarned = data.duration / 3600;

      await setDoc(statsRef, {
        hoursSpent: increment(hoursEarned),
        lastActive: serverTimestamp(),
        dailyGoal: 4.0 // default goal
      }, { merge: true });
    }

    // 3. Send a local notification
    const mins = Math.floor(data.duration / 60);
    const message = data.mode === "focus" 
      ? `Great job! You just earned focus XP for ${mins || 'a short'} session. 🎯`
      : `Break over! Ready to get back to work?`;
    
    await createNotification(userId, message);

  } catch (error) {
    console.error("Error in recordSessionChunk:", error);
  }
};

/**
 * Updates the 'live' state so other tabs/devices know the timer is running.
 */
const updateLivePointer = async (userId, payload) => {
  if (!userId) return;
  try {
    const liveRef = doc(database, "users", userId, "state", "active");
    await setDoc(liveRef, { 
      ...payload, 
      updatedAt: serverTimestamp() 
    }, { merge: true });
  } catch (error) {
    console.error("Error updating live pointer:", error);
  }
};

/**
 * Listens for timer changes from Firestore.
 */
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