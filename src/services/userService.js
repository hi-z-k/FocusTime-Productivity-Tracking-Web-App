// src/services/userService.js
import { storage, database } from "./firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

export const uploadAvatar = async (userId, file) => {
  try {
    // 1. Create a reference to 'avatars/userId' in Storage
    const storageRef = ref(storage, `avatars/${userId}`);

    // 2. Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // 3. Get the public URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // 4. Update the user document in Firestore
    const userRef = doc(database, "users", userId);
    await updateDoc(userRef, {
      photoURL: downloadURL
    });

    return downloadURL;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};