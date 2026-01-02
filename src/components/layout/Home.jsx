import React from "react";
import "../../styles/home.css";

export default function Home({ onNavigate, notifications, focusMinutes }) {
  return (
    <div className="home-container fade-in">
      <div className="home-grid">
        <div className="home-left">
          <h1 className="home-title">FocusTime</h1>
          <p className="home-tagline">
            Your Time. Your Focus. Your Growth.
          </p>

          <p className="focus-today">
            Today’s Focus: <strong>{focusMinutes} minutes</strong>
          </p>

          <div className="home-actions">
            <button
              className="primary-btn"
              onClick={() => onNavigate("pomodoro")}
            >
              Start Focus
            </button>

            <button
              className="secondary-btn"
              onClick={() => onNavigate("progress")}
            >
              View Progress
            </button>
          </div>

          <div className="card notifications-card">
            <h3>Notifications</h3>

            {notifications.length === 0 ? (
              <p className="empty-text">No notifications</p>
            ) : (
              notifications.map((note, index) => (
                <div key={index} className="notification-item">
                  {note}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="home-right">
          <div className="image-placeholder">Image</div>

          <div className="card about-card">
            <h3>About</h3>
            <p>
              FocusTime helps you build productive habits using focus sessions,
              task management, and progress tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
