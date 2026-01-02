import { useEffect, useState } from "react";
// Import the actual service functions we created
import { updatePersonalInfo, syncPersonalInfo } from "../features/auth/authService";
import { useAuth } from "./useAuth"; 

export const usePersonalInfo = () => {
  const { user } = useAuth(); 
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bestStudyTime: "Morning"
  });
  const [loading, setLoading] = useState(true);

  // 🔁 Real-time sync: Connects to the 'users' collection using the UID
  useEffect(() => {
    // If no user is logged in, we can't fetch data
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    console.log("Personal Info Hook: Establishing link for UID:", user.uid);

    // Start the listener
    const unsub = syncPersonalInfo(user.uid, (data) => {
      if (data) {
        console.log("Personal Info Hook: Data loaded from Firestore", data);
        setPersonalInfo(data);
      } else {
        console.log("Personal Info Hook: No profile found, using defaults.");
      }
      setLoading(false);
    });

    // Cleanup connection when user leaves the profile page
    return () => unsub();
  }, [user?.uid]);

  // ✏️ Update: Saves data to Firestore
  const updateInfo = async (newData) => {
    if (!user?.uid) {
      console.error("Personal Info Hook: Cannot save, user not authenticated.");
      return;
    }

    try {
      await updatePersonalInfo(user.uid, newData);
      console.log("Personal Info Hook: Cloud update successful!");
    } catch (error) {
      console.error("Personal Info Hook: Cloud update failed:", error);
      throw error; 
    }
  };

  return {
    personalInfo,
    setPersonalInfo, // Useful for controlled form inputs
    loading,
    updateInfo,
  };
};