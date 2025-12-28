import React, { useState } from "react";
import "../../styles/layout.css";
import logo from "../../assets/logo.png";

export default function Sidebar({ onNavigate, currentView }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleNav = (view) => {
    onNavigate(view);
    closeMenu();
  };

  return (
    <>
      <button
        className={`hamburger ${isOpen ? "is-active" : ""}`}
        onClick={toggleMenu}
      >
        <span className="hamburger-box">{isOpen ? "✕" : "☰"}</span>
      </button>

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-scroll-container">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-placeholder">
              <img src={logo} alt="FocusTime Logo" className="focustime-logo" />
            </div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>FocusTime</h2>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-item" style={{ cursor: "default" }}>
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Home</span>
            </div>

            <div
              className={`nav-item ${
                currentView === "pomodoro" ? "active" : ""
              }`}
              onClick={() => handleNav("pomodoro")}
            >
              <span className="nav-icon">⏱️</span>
              <span className="nav-text">Focus Session</span>
            </div>

            <div
              className={`nav-item ${currentView === "tasks" ? "active" : ""}`}
              onClick={() => handleNav("tasks")}
            >
              <span className="nav-icon">✅</span>
              <span className="nav-text">Todo</span>
            </div>

            <div className="nav-item" style={{ cursor: "default" }}>
              <span className="nav-icon">📝</span>
              <span className="nav-text">FocusPad</span>
            </div>

            <div className="nav-item" style={{ cursor: "default" }}>
              <span className="nav-icon">📺</span>
              <span className="nav-text">YouTube</span>
            </div>

            <div className="nav-item" style={{ cursor: "default" }}>
              <span className="nav-icon">📊</span>
              <span className="nav-text">Progress Chart</span>
            </div>

            <div
              className={`nav-item ${
                currentView === "profile" ? "active" : ""
              }`}
              onClick={() => handleNav("profile")}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile</span>
            </div>

            {/* Now Mentora and Logout are inside the same scrollable list */}
            <div
              className="nav-item"
              style={{ cursor: "default", marginTop: "20px" }}
            >
              <span className="nav-icon">🎓</span>
              <span className="nav-text">Mentora</span>
            </div>

            <div className="nav-item logout" onClick={() => handleNav("login")}>
              <span className="nav-icon">🚪</span>
              <span className="nav-text">Logout</span>
            </div>

            <div className="theme-toggle" style={{ padding: "20px 0" }}>
              <span style={{ marginRight: "10px" }}>Light</span>
              <span>Dark</span>
            </div>
          </nav>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={closeMenu}></div>}
    </>
  );
}
