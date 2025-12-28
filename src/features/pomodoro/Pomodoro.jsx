import { useEffect, useState } from "react";
import FlipClock from "./FlipClock";
import Controls from "./Controls";
import "./pomodoro.css";

const FOCUS = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

export default function Pomodoro() {
  const [mode, setMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(FOCUS);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  function switchMode(newMode) {
    setIsRunning(false);
    setMode(newMode);

    if (newMode === "focus") setTimeLeft(FOCUS);
    if (newMode === "short") setTimeLeft(SHORT_BREAK);
    if (newMode === "long") setTimeLeft(LONG_BREAK);
  }

  return (
    <div className="pomodoro-container">
      <h1>{mode === "focus" ? "Focus Time" : "Break Time"}</h1>

      <FlipClock time={timeLeft} />

      <Controls
        isRunning={isRunning}
        onStart={() => setIsRunning(true)}
        onPause={() => setIsRunning(false)}
        onReset={() => switchMode(mode)}
      />

      <div className="mode-buttons">
        <button
          className={mode === "focus" ? "selected" : undefined}
          onClick={() => switchMode("focus")}
        >
          Focus
        </button>
        <button
          className={mode === "short" ? "selected" : undefined}
          onClick={() => switchMode("short")}
        >
          Short Break
        </button>
        <button
          className={mode === "long" ? "selected" : undefined}
          onClick={() => switchMode("long")}
        >
          Long Break
        </button>
      </div>
    </div>
  );
}
