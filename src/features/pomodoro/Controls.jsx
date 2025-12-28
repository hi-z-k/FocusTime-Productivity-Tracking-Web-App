export default function Controls({ isRunning, onStart, onPause, onReset }) {
  return (
    <div className="controls">
      {!isRunning ? (
        <button className="primary" onClick={onStart}>
          Start
        </button>
      ) : (
        <button className="primary" onClick={onPause}>
          Pause
        </button>
      )}
      <button onClick={onReset}>Reset</button>
    </div>
  );
}
