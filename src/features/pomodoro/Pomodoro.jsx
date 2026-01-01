import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { 
  recordSessionChunk, 
  updateLivePointer, 
  listenToTimer 
} from "../../services/pomodoroTimer";
import FlipClock from "./FlipClock";
import Controls from "./Controls";
import "./pomodoro.css";

const MODES = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };

export default function Pomodoro() {
  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(MODES.focus);
  const [isRunning, setIsRunning] = useState(false);
  const segmentStartRef = useRef(MODES.focus);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenToTimer(user.uid, (data) => {
      setMode(data.mode);
      setIsRunning(data.isRunning);
      segmentStartRef.current = data.segmentStartValue ?? MODES[data.mode];

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
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleFinish = async () => {
    const duration = segmentStartRef.current;
    await recordSessionChunk(user.uid, { mode, duration, status: "completed" });
    await updateLivePointer(user.uid, {
      isRunning: false,
      expiresAt: null,
      timeLeftAtPause: MODES[mode],
      segmentStartValue: MODES[mode]
    });
  };

  const onStart = () => {
    const expiresAt = new Date(Date.now() + timeLeft * 1000);
    updateLivePointer(user.uid, {
      isRunning: true,
      expiresAt,
      mode,
      segmentStartValue: timeLeft,
      timeLeftAtPause: null
    });
  };

  const onPause = async () => {
    const durationSpent = segmentStartRef.current - timeLeft;
    
    if (durationSpent >= 10) {
      await recordSessionChunk(user.uid, { mode, duration: durationSpent, status: "paused" });
    }

    await updateLivePointer(user.uid, {
      isRunning: false,
      expiresAt: null,
      timeLeftAtPause: timeLeft,
      segmentStartValue: timeLeft,
      mode
    });
  };

  const switchMode = async (newMode) => {
    const durationSpent = segmentStartRef.current - timeLeft;
    
    if (durationSpent >= 10) {
      await recordSessionChunk(user.uid, { mode, duration: durationSpent, status: "switched" });
    }

    await updateLivePointer(user.uid, {
      isRunning: false,
      expiresAt: null,
      timeLeftAtPause: MODES[newMode],
      segmentStartValue: MODES[newMode],
      mode: newMode
    });
  };

  return (
    <div className="pomodoro-container">
      <h1>{mode === "focus" ? "Focus Time" : "Break Time"}</h1>
      <FlipClock time={timeLeft} />
      <Controls
        isRunning={isRunning}
        onStart={onStart}
        onPause={onPause}
        onReset={() => switchMode(mode)}
      />
      <div className="mode-buttons">
        {Object.keys(MODES).map((m) => (
          <button 
            key={m} 
            className={mode === m ? "selected" : ""} 
            onClick={() => switchMode(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}