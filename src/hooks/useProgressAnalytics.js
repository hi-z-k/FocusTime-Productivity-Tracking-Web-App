import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { syncUserProgress } from "../services/progressService";
import { database } from "../services/firebase/firebaseConfig";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
// Import the gamification logic functions
import { getMilestones } from "../services/gamificationLogic";

// --- HELPERS ---

/**
 * Merges historical session documents with the live 'hoursSpent' for today's bar.
 */
const calculateWeeklyData = (sessions, currentTotalHours) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const weekData = days.map(day => ({ day, value: 0 }));

  const now = new Date();
  const todayIndex = now.getDay(); 
  const todayString = now.toDateString();

  // 1. Fill in historical data from the sessions sub-collection
  sessions.forEach(session => {
    if (!session.timestamp) return;
    
    const sessionDate = session.timestamp.toDate();
    const dayIndex = sessionDate.getDay();
    
    // Ignore sessions from 'today' to avoid double-counting with currentTotalHours
    if (sessionDate.toDateString() !== todayString) {
      weekData[dayIndex].value += (session.duration / 3600);
    }
  });

  // 2. Set TODAY'S bar directly to the live 'hoursSpent' field
  weekData[todayIndex].value = currentTotalHours || 0;

  // Reorder to start from Monday [M, T, W, T, F, S, S]
  return [...weekData.slice(1), weekData[0]];
};

const fetchTaskData = async (analyticsData) => {
  try {
    const q = query(collection(database, "tasks"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    analyticsData.totalTasks = tasks.length;
    analyticsData.completedTasks = tasks.filter(
      t => t.status === "Done" || t.completed === true
    ).length;

    return analyticsData;
  } catch (err) {
    console.error("Task Fetch Error:", err);
    return analyticsData;
  }
};

// --- THE HOOK ---

export const useProgressAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    let unsubscribeProgress = null;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const historyRef = collection(database, "users", user.uid, "sessions");
        const historyQuery = query(historyRef, orderBy("timestamp", "desc"));
        
        // Setup real-time listener for userStats (hoursSpent, dailyGoal, streak)
        unsubscribeProgress = syncUserProgress(user.uid, async (progressData) => {
          if (!isMounted) return;

          // Re-fetch historical sessions
          const historySnapshot = await getDocs(historyQuery);
          const sessions = historySnapshot.docs.map(doc => doc.data());

          const currentStreak = progressData.streak || 0;
          const currentHours = progressData.hoursSpent || 0;

          let updatedData = {
            hoursSpent: 0,
            dailyGoal: 4, 
            streak: 0,
            ...progressData,
            // Generate streak-based milestones from gamificationLogic.js
            achievements: getMilestones(currentStreak), 
            // Calculate chart based on manual hoursSpent field
            weeklyData: calculateWeeklyData(sessions, currentHours),
            assignments: [],
          };

          const finalData = await fetchTaskData(updatedData);
          
          if (isMounted) {
            setData(finalData);
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Analytics Hook Error:", err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
      if (unsubscribeProgress) unsubscribeProgress();
    };
  }, [user?.uid]);

  return { data, loading, error };
};

export default useProgressAnalytics;