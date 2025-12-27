import React from "react";
import "../../styles/layout.css";

const Navbar = ({ title = "To-Do", streak }) => {
  return (
    <header className="top-navbar">
      <div className="navbar-content">
        <h2 className="page-title">{title}</h2>

        <div className="navbar-actions">
          <button className="icon-btn-small">🔔</button>
          <div className="user-profile-badge">
            <div className="user-text">
              <span className="user-name">User Name</span>
              <span className="user-streak">🔥 {streak} Days Streak</span>
            </div>
            <div className="user-avatar"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;