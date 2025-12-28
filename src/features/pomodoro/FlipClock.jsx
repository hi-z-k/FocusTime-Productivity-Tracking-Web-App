export default function FlipClock({ time }) {
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <div className="flip-clock">
      <FlipCard value={minutes} label="MIN" />
      <span className="colon">:</span>
      <FlipCard value={seconds} label="SEC" />
    </div>
  );
}

function FlipCard({ value, label }) {
  return (
    <div className="flip-card">
      <div key={value} className="flip-number">
        {value}
      </div>
      <span className="label">{label}</span>
    </div>
  );
}
