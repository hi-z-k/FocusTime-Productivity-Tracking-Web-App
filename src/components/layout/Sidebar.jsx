import React, { useState } from "react";
import "../../styles/sidebar.css";
import logo from "../../assets/logo.png";
import { logOut } from "../../services/authService";

/// ... (imports remain the same)

export default function Sidebar({ onNavigate, currentView, theme, setTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button className={`hamburger ${isOpen ? "is-active" : ""}`} onClick={toggleMenu}>
        <span className="hamburger-box">{isOpen ? "✕" : "☰"}</span>
      </button>

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* TOP SECTION */}
        <div className="sidebar-top">
          <div className="logo-section">
            <img src={logo} alt="FocusTime Logo" className="focustime-logo" />
            <h2 className="logo-text">FocusTime</h2>
          </div>

          <nav className="sidebar-nav">
            <NavItem id="home" icon="🏠" label="Home" active={currentView === "home"} onClick={onNavigate} />
            <NavItem id="pomodoro" icon="⏱️" label="Focus Session" active={currentView === "pomodoro"} onClick={onNavigate} />
            <NavItem id="tasks" icon="✅" label="Todo" active={currentView === "tasks"} onClick={onNavigate} />
            <NavItem id="focuspad" icon="📝" label="FocusPad" active={currentView === "focuspad"} onClick={onNavigate} />
            <NavItem id="youtube" icon="📺" label="YouTube" onClick={onNavigate} />
            <NavItem id="progress" icon="📊" label="Progress" active={currentView === "progress"} onClick={onNavigate} />
            <NavItem id="profile" icon="👤" label="Profile" active={currentView === "profile"} onClick={onNavigate} />
            <NavItem id="mentora" icon="🎓" label="Mentora" onClick={onNavigate} />
          </nav>
        </div>

        {/* BOTTOM SECTION */}
        <div className="sidebar-footer">
          <div className="theme-toggle-container" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            <span className="nav-icon">{theme === 'light' ? "🌙" : "☀️"}</span>
            <span className="nav-text">Theme</span>
          </div>
          
          <div className="nav-item logout" onClick={() => logOut()}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </div>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={closeMenu}></div>}
    </>
  );
}

function NavItem({ id, icon, label, active, onClick }) {
  return (
    <div className={`nav-item ${active ? "active" : ""}`} onClick={() => onClick(id)}>
      <span className="nav-icon">{icon}</span>
      <span className="nav-text">{label}</span>
    </div>
  );
}