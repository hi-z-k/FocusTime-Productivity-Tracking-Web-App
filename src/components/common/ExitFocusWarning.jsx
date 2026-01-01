import '../../styles/exitWarning.css';

export default function ExitWarning({
  title = "Leave Focus Mode?",
  message = "Your current focus session will pause.",
  onCancel,
  onConfirm,
}) {
  return (
    <div className="exit-overlay">
      <div className="exit-card">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="exit-actions">
          <button className="secondary" onClick={onCancel}>
            Stay Focused
          </button>
          <button className="primary" onClick={onConfirm}>
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
