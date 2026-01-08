import React from "react";
import "../../styles/navbar.css";
import useProgressAnalytics from "../../hooks/useProgressAnalytics";
import { usePersonalInfo } from "../../hooks/usePersonalInfo";

const Navbar = ({ title = "Dashboard", onNotificationClick, onProfileClick }) => {
  const { data, loading } = useProgressAnalytics();
  const { personalInfo } = usePersonalInfo();
  
  const streak = !loading && data ? data.streak : 0;

  return (
    <header className="top-navbar">
      <div className="navbar-content">
        <h2 className="page-title">{title}</h2>

        <div className="navbar-actions">
          <button 
            className="icon-btn-small" 
            onClick={onNotificationClick}
            style={{ cursor: "pointer" }}
          >
            🔔
          </button>
          
          <div 
            className="user-profile-badge" 
            onClick={onProfileClick}
            style={{ cursor: "pointer" }}
          >
            <div className="user-text">
              <span className="user-name">
                {personalInfo?.firstName || "User"}
              </span>
              <span className="user-streak">
                {loading ? "..." : `🔥 ${streak} Days`}
              </span>
            </div>
            
            <div className="user-avatar">
              {personalInfo?.photoURL ? (
                <img 
                  src={personalInfo.photoURL} 
                  alt="User" 
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