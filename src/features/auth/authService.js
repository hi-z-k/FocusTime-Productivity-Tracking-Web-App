import { database as db } from "../../services/firebase/firebaseConfig";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

// This is the function that actually sends data to the cloud
export const updatePersonalInfo = async (userId, data) => {
  if (!userId) {
    console.error("AuthService: Cannot update profile without a User ID.");
    return;
  }
  
  // Creates or updates a document in 'users' collection with the UID as the name
  const docRef = doc(db, "users", userId);
  
  console.log("AuthService: Writing to Firestore for user:", userId);
  
  return await setDoc(docRef, {
    ...data,
    lastUpdated: new Date()
  }, { merge: true });
};

// This function listens for changes to show them on your screen
export const syncPersonalInfo = (userId, callback) => {
  if (!userId) return () => {};
  const docRef = doc(db, "users", userId);
  return onSnapshot(docRef, (doc) => {
    callback(doc.exists() ? doc.data() : null);
  });
};