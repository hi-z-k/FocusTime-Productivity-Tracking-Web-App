import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { syncUserProgress } from "../services/progressService";
import { database } from "../services/firebase/firebaseConfig";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { getMilestones } from "../services/gamificationLogic";

const calculateWeeklyData = (sessions, currentTotalHours) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const weekData = days.map(day => ({ day, value: 0 }));
  const now = new Date();
  const todayIndex = now.getDay(); 
  const todayString = now.toDateString();

  sessions.forEach(session => {
    if (!session.timestamp) return;
    const sessionDate = session.timestamp.toDate();
    const dayIndex = sessionDate.getDay();
    if (sessionDate.toDateString() !== todayString) {
      weekData[dayIndex].value += (session.duration / 3600);
    }
  });

  weekData[todayIndex].value = currentTotalHours || 0;
  return [...weekData.slice(1), weekData[0]]; // Start week on Monday
};

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
        
        unsubscribeProgress = syncUserProgress(user.uid, async (progressData) => {
          if (!isMounted || !progressData) return;

          // Only fetch history once to save performance
          const historySnapshot = await getDocs(historyQuery);
          const sessions = historySnapshot.docs.map(doc => doc.data());

          const currentStreak = progressData.streak || 0;
          const currentHours = progressData.hoursSpent || 0;

          if (isMounted) {
            setData({
              ...progressData,
              achievements: getMilestones(currentStreak),
              weeklyData: calculateWeeklyData(sessions, currentHours),
            });
            setLoading(false);
          }
        });
      } catch (err) {
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