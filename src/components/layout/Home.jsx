import React from "react";
import "../../styles/HomePage.css";
import img from "../../assets/hero-img.png";
import NotificationList from "../ui/NotificationList";
import useProgressAnalytics from "../../hooks/useProgressAnalytics";

export default function Home({ onNavigate, notifications, userId }) {
  const { data, loading } = useProgressAnalytics();

  const getMinutesToday = () => {
    if (!data?.weeklyData) return 0;
    const dayIndex = (new Date().getDay() + 6) % 7; 
    return Math.round(data.weeklyData[dayIndex].value);
  };

  return (
    <div className="home-container fade-in">
      <div className="home-grid">
        <div className="home-left">
          <h1 className="home-title">FocusTime</h1>
          <p className="home-tagline">Your Time. Your Focus. Your Growth.</p>
          <p className="focus-today">
            Today’s Focus: <strong>{loading ? "..." : getMinutesToday()} minutes</strong>
          </p>
          <div className="home-actions">
            <button className="primary-btn" onClick={() => onNavigate("pomodoro")}>Start Focus</button>
            <button className="secondary-btn" onClick={() => onNavigate("progress")}>View Progress</button>
          </div>
          <NotificationList userId={userId} notifications={notifications} />
        </div>
        <div className="home-right">
          <img src={img} className="image-placeholder" alt="Hero" />
          <div className="card about-card">
            <h3>About</h3>
            <p>FocusTime helps you build productive habits using focus sessions and tracking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}