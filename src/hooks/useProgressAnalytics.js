import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { database } from "../services/firebase/firebaseConfig";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

export const useProgressAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const toDateKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  const calculateStreak = (sessions) => {
    if (!sessions || sessions.length === 0) return 0;
    const activeDays = new Set();
    sessions.forEach(s => {
      let date = null;
      if (s.timestamp?.toDate) date = s.timestamp.toDate();
      else if (s.timestamp?.seconds) date = new Date(s.timestamp.seconds * 1000);
      else if (s.timestamp) date = new Date(s.timestamp);
      if (date && (s.status === "completed" || s.mode === "focus")) {
        activeDays.add(toDateKey(date));
      }
    });
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const todayKey = toDateKey(today);
    const yesterdayKey = toDateKey(yesterday);
    if (!activeDays.has(todayKey) && !activeDays.has(yesterdayKey)) return 0;
    let checkDate = activeDays.has(todayKey) ? today : yesterday;
    let streak = 0;
    while (activeDays.has(toDateKey(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  };

  const calculateWeeklyData = (sessions) => {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const weekly = days.map(d => ({ day: d, value: 0 }));
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    startOfWeek.setHours(0, 0, 0, 0);

    sessions.forEach(s => {
      let d = s.timestamp?.toDate ? s.timestamp.toDate() : new Date(s.timestamp?.seconds * 1000);
      if (d >= startOfWeek) {
        const index = (d.getDay() + 6) % 7;
        weekly[index].value += (s.duration || 0) / 60;
      }
    });
    return weekly;
  };

  useEffect(() => {
    if (!user?.uid) return;
    const fetchData = async () => {
      try {
        const sessionsRef = collection(database, "users", user.uid, "sessions");
        const q = query(sessionsRef, orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const sessions = snapshot.docs.map(doc => doc.data());
        
        setData({
          hoursSpent: sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 3600,
          streak: calculateStreak(sessions),
          weeklyData: calculateWeeklyData(sessions)
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.uid]);

  return { data, loading };
};

export default useProgressAnalytics;