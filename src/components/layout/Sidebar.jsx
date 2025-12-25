import React, { useState } from "react";
import "../../styles/layout.css";
import logo from "../../assets/logo.png";
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };
  return (
    <>
      {/*Hamburger Button*/}
      <button
        className={`hamburger ${isOpen ? "is-active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle Navigation"
      >
        <span className="hamburger-box">{isOpen ? "✕" : "☰"}</span>
      </button>

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="logo-section">
            <div className="logo-placeholder">
              <img src={logo} alt="FocusTime Logo" className="focustime-logo" />
            </div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>FocusTime</h2>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-item active" onClick={closeMenu}>
              <span className="nav-icon">✅/span>
              <span className="nav-text">Task Board</span>
            </div>
          </nav>
        </div>
        <div className="sidebar-bottom">
          <div className="theme-toggle">
            <span>Light Mode</span>
            <span>Dark Mode</span>
            <div className="toggle-switch-mock"></div>
          </div>
          <div className="nav-item logout">
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </div>
        </div>
      </aside>
      {/*Mobile Overlay: Closes the menu when clicking the dimmed background*/}
      {isOpen && <div className="sidebar-overlay" onClick={closeMenu}></div>}
    </>
  );
}
