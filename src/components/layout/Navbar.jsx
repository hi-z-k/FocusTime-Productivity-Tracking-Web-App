import React from "react";
import "../../styles/navbar.css";
import { useProgressAnalytics } from "../../hooks/useProgressAnalytics";
const Navbar = ({ title = "To-Do" }) => {
  const { data } = useProgressAnalytics();
  const streak = data?.streak || 0;
  return (
    <header className="top-navbar">
      <div className="navbar-content">
        <h2 className="page-title">{title}</h2>

        <div className="navbar-actions">
          <button className="icon-btn-small">🔔</button>
          <div className="user-profile-badge">
            <div className="user-text">
              <span className="user-name">User Name</span>
              <span className="user-streak">
                🔥 {data?.streak || 0} Days Streak
              </span>
            </div>
            <div className="user-avatar"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
