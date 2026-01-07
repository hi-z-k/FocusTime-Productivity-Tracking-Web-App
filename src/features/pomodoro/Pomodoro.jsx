import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import ExitWarning from "../../components/common/ExitFocusWarning";
import {
  recordSessionChunk,
  updateLivePointer,
  listenToTimer,
} from "../../services/pomodoroTimer";
import { sendQuote } from "../../services/notificationService";
import FlipClock from "./FlipClock";
import Controls from "./Controls";
import "../../styles/pomodoro.css";

const MODES = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

export default function Pomodoro({ onFocusComplete }) {
  const { user } = useContext(AuthContext);

  const [mode, setMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(MODES.focus);
  const [isRunning, setIsRunning] = useState(false);

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

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

        const nextTime = prev - 1;
        
        if (mode === "focus") {
          const totalDuration = MODES.focus;
          const quoteInterval = Math.floor(totalDuration / 5); 
          const elapsed = totalDuration - nextTime;

          if (elapsed > 0 && elapsed % quoteInterval === 0 && elapsed < totalDuration) {
            sendQuote(user.uid);
          }
        }

        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, mode, user?.uid]);

  const enterFocusMode = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      setIsFocusMode(true);
    } catch (err) {
      console.error(err);
    }
  };

  const exitFocusMode = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } finally {
      setIsFocusMode(false);
      setShowExitWarning(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFocusMode(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleFinish = async () => {
    const duration = segmentStartRef.current;
    await recordSessionChunk(user.uid, {
      mode,
      duration,
      status: "completed",
    });
    if (mode === "focus" && onFocusComplete) {
      onFocusComplete(Math.floor(duration / 60));
    }
    await updateLivePointer(user.uid, {
      isRunning: false,
      expiresAt: null,
      timeLeftAtPause: MODES[mode],
      segmentStartValue: MODES[mode],
    });
  };

  const onStart = () => {
    const expiresAt = new Date(Date.now() + timeLeft * 1000);
    updateLivePointer(user.uid, {
      isRunning: true,
      expiresAt,
      mode,
      segmentStartValue: timeLeft,
      timeLeftAtPause: null,
    });
  };

  const onPause = async () => {
    const durationSpent = segmentStartRef.current - timeLeft;
    if (durationSpent >= 10) {
      await recordSessionChunk(user.uid, {
        mode,
        duration: durationSpent,
        status: "paused",
      });
    }
    await updateLivePointer(user.uid, {
      isRunning: false,
      expiresAt: null,
      timeLeftAtPause: timeLeft,
      segmentStartValue: timeLeft,
      mode,
    });
  };

  const switchMode = async (newMode) => {
    const durationSpent = segmentStartRef.current - timeLeft;
    if (durationSpent >= 10) {
      await recordSessionChunk(user.uid, {
        mode,
        duration: durationSpent,
        status: "switched",
      });
    }
    await updateLivePointer(user.uid, {
      isRunning: false,
      expiresAt: null,
      timeLeftAtPause: MODES[newMode],
      segmentStartValue: MODES[newMode],
      mode: newMode,
    });
  };

  return (
    <div className={`pomodoro-container ${isFocusMode ? "focus-mode-active" : ""}`}>
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
      {mode === "focus" &&
        (!isFocusMode ? (
          <button className="focus-btn" onClick={enterFocusMode}>
            Enter Focus Mode
          </button>
        ) : (
          <button
            className="focus-btn exit"
            onClick={() => setShowExitWarning(true)}
          >
            Exit Focus Mode
          </button>
        ))}
      {showExitWarning && (
        <ExitWarning
          title="Exit Focus Mode?"
          message="Your focus session will be interrupted."
          onCancel={() => setShowExitWarning(false)}
          onConfirm={exitFocusMode}
        />
      )}
    </div>
  );
}