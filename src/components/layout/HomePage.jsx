// src/components/Homepage.jsx
import React from "react";
import "../styles/homepage.css";

export default function Homepage() {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <img src="/logo.png" alt="FocusTime Logo" className="logo" />
        <h1>Welcome to FocusTime</h1>
        <p>Boost your focus, manage your tasks, and track your productivity!</p>
      </header>

      <main className="homepage-main">
        <blockquote className="motivation-quote">
          "The secret of getting ahead is getting started."
        </blockquote>

        <div className="action-buttons">
          <a href="/login" className="btn primary-btn">Login</a>
          <a href="/register" className="btn secondary-btn">Register</a>
        </div>
      </main>

      <footer className="homepage-footer">
        <p>&copy; 2026 FocusTime. All rights reserved.</p>
      </footer>
    </div>
  );
}
