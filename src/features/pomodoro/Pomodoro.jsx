import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { syncTimerStart, syncTimerPause, listenToRemoteTimer } from "../../services/pomodoroTimer.js";
import FlipClock from "./FlipClock";
import Controls from "./Controls";
import "./pomodoro.css";

const MODES = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };

export default function Pomodoro() {
  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(MODES.focus);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenToRemoteTimer(user.uid, (data) => {
      setMode(data.mode);
      setIsRunning(data.isRunning);
      
      if (data.isRunning && data.expiresAt) {
        const end = data.expiresAt.toMillis();
        const diff = Math.max(0, Math.floor((end - Date.now()) / 1000));
        setTimeLeft(diff);
      } else {
        setTimeLeft(data.timeLeftAtPause ?? MODES[data.mode]);
      }
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStart = () => syncTimerStart(user.uid, timeLeft, mode);
  const handlePause = () => syncTimerPause(user.uid, timeLeft, mode);
  
  const switchMode = (newMode) => {
    syncTimerPause(user.uid, MODES[newMode], newMode);
  };

  return (
    <div className="pomodoro-container">
      <h1>{mode === "focus" ? "Focus Time" : "Break Time"}</h1>
      <FlipClock time={timeLeft} />

      <Controls
        isRunning={isRunning}
        onStart={handleStart}
        onPause={handlePause}
        onReset={() => switchMode(mode)}
      />

      <div className="mode-buttons">
        {Object.keys(MODES).map((m) => (
          <button
            key={m}
            className={mode === m ? "selected" : undefined}
            onClick={() => switchMode(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}