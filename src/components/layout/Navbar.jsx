import React from "react";
import "../../styles/navbar.css";
import useProgressAnalytics from "../../hooks/useProgressAnalytics";
import { usePersonalInfo } from "../../hooks/usePersonalInfo"; // Added hook import

const Navbar = ({ title = "To-Do" }) => {
  const { data } = useProgressAnalytics();
  const { personalInfo } = usePersonalInfo(); // 1. Initialize the hook
  
  const streak = data?.streak || 0;

  return (
    <header className="top-navbar">
      <div className="navbar-content">
        <h2 className="page-title">{title}</h2>

        <div className="navbar-actions">
          <button className="icon-btn-small">🔔</button>
          <div className="user-profile-badge">
            <div className="user-text">
              {/* 2. Display Dynamic Name */}
              <span className="user-name">
                {personalInfo?.firstName || "User Name"}
              </span>
              <span className="user-streak">
                🔥 {streak} Days Streak
              </span>
            </div>
            
            {/* 3. Display Dynamic Avatar */}
            <div className="user-avatar">
              {personalInfo?.photoURL ? (
                <img 
                  src={personalInfo.photoURL} 
                  alt="Avatar" 
                  className="navbar-avatar-img" 
                />
              ) : (
                "👤"
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;