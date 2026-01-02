// services/progressService.js
import { database } from ".firebase/firebaseConfig.js";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";

// Fetch real-time progress data for a specific user
export const syncUserProgress = (userId, callback) => {
  if (!userId) return;

  // Reference to the user's specific progress document
  const progressRef = doc(database, "progress", userId);

  return onSnapshot(progressRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() });
    } else {
      console.log("No progress data found for this user.");
      callback(null);
    }
  });
};