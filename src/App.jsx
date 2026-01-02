import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Home from "./components/layout/Home";

import TaskBoard from "./features/tasks/TaskBoard";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Profile from "./features/auth/Profile";
import Pomodoro from "./features/pomodoro/Pomodoro";
import ProgressChart from "./features/progress/ProgressChart";
import FocusPad from "./features/focuspad/FocusPad.jsx";
import Mentora from "./features/mentora/Mentora.jsx";
import YouTubeFocus from "./features/youtube/YouTubeFocus.jsx";

// ... imports remain the same

export default function App() {
  const { user, loading } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState("login");
  const [streak, setStreak] = useState(10);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [focusMinutesToday, setFocusMinutesToday] = useState(0);

  // 1. Removed isMentoraOpen state as it's no longer a popup

  const [notifications, setNotifications] = useState([
    "Welcome back! Stay focused 🎯",
  ]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (loading) return;
    if (user && (currentView === "login" || currentView === "register")) {
      setCurrentView("home");
    }
    if (!user && currentView !== "login" && currentView !== "register") {
      setCurrentView("login");
    }
  }, [user, loading, currentView]);

  if (loading) return null;

  if (!user) {
    return (
      <div className="auth-wrapper" data-theme={theme}>
        {currentView === "register" ? (
          <Register onNavigate={setCurrentView} />
        ) : (
          <Login onNavigate={setCurrentView} />
        )}
      </div>
    );
  }

  return (
    <div className={`app-container ${theme}`} data-theme={theme}>
      <Sidebar
        onNavigate={setCurrentView} // 2. Direct navigation
        currentView={currentView}
        theme={theme}
        setTheme={setTheme}
      />

      {/* 3. Removed dynamic marginRight and setIsMentoraOpen logic */}
      <div className="main-wrapper" style={{ 
        flex: 1, 
        marginLeft: "240px", 
        transition: "margin 0.3s ease" 
      }}>
        <Navbar
          title={currentView === "profile" ? "PERSONAL INFORMATION" : currentView.toUpperCase()}
          streak={streak}
        />

        <div className="content-container">
          {currentView === "home" && (
            <Home onNavigate={setCurrentView} notifications={notifications} focusMinutes={focusMinutesToday} />
          )}
          {currentView === "tasks" && <TaskBoard />}
          {currentView === "profile" && <Profile streak={streak} setStreak={setStreak} />}
          {currentView === "pomodoro" && (
            <Pomodoro
              onSessionComplete={(minutes) => {
                setFocusMinutesToday((prev) => prev + minutes);
                setNotifications((prev) => [`You completed a ${minutes} min focus session 🔥`, ...prev]);
              }}
            />
          )}
          {currentView === "focuspad" && <FocusPad userId={user.uid || user.id} />}
          {currentView === "progress" && <ProgressChart />}
          
          {/* 4. Mentora now sits in the main content area like a regular page */}
          {currentView === "mentora" && <Mentora userId={user.uid || user.id} />}
          {currentView === "youtube" && <YouTubeFocus />}
        </div>
      </div>
    </div>
  );
}