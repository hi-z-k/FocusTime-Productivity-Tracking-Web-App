import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "./context/AuthContext";
import "./styles/index.css";

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

import { listenToNotifications, markAsRead } from "./services/notificationService";

export default function App() {
  const { user, loading } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState("login");
  const [streak, setStreak] = useState(10);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [focusMinutesToday, setFocusMinutesToday] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [activeNote, setActiveNote] = useState(null);

  const prevNotifsRef = useRef([]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (loading) return;

    if (user) {
      if (currentView === "login" || currentView === "register") {
        setCurrentView("home");
      }
    } else {
      if (currentView !== "login" && currentView !== "register") {
        setCurrentView("login");
      }
    }
  }, [user, loading, currentView]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenToNotifications(user.uid, (data) => {
      if (data.length > 0 && prevNotifsRef.current.length > 0) {
        const newestId = data[0].id;
        const exists = prevNotifsRef.current.find(n => n.id === newestId);
        
        if (!exists && !data[0].read) {
          setActiveNote(data[0]);
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 10000);
        }
      }
      prevNotifsRef.current = data;
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handlePopupRead = () => {
    if (user && activeNote) {
      markAsRead(user.uid, activeNote.id);
      setShowPopup(false);
    }
  };

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
    <div className={`app-container ${theme}`} data-theme={theme} style={styles.appContainer}>
      
      {showPopup && activeNote && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <div style={styles.popupText}>{activeNote.text}</div>
            <button style={styles.inlineReadBtn} onClick={handlePopupRead}>
              Mark as Read
            </button>
          </div>
          <button style={styles.closeBtn} onClick={() => setShowPopup(false)}>×</button>
        </div>
      )}

      <Sidebar
        onNavigate={setCurrentView}
        currentView={currentView}
        theme={theme}
        setTheme={setTheme}
      />

      <div style={styles.mainWrapper}>
        <Navbar
          title={currentView === "profile" ? "PERSONAL INFORMATION" : currentView.toUpperCase()}
          streak={streak}
        />

        <div className="content-container">
          {currentView === "home" && (
            <Home 
              onNavigate={setCurrentView} 
              notifications={notifications} 
              focusMinutes={focusMinutesToday}
              userId={user.uid} 
            />
          )}
          {currentView === "tasks" && <TaskBoard />}
          {currentView === "profile" && <Profile streak={streak} setStreak={setStreak} />}
          {currentView === "pomodoro" && (
            <Pomodoro onFocusComplete={(mins) => setFocusMinutesToday(p => p + mins)} />
          )}
          {currentView === "focuspad" && <FocusPad userId={user.uid} />}
          {currentView === "progress" && <ProgressChart />}
          {currentView === "mentora" && <Mentora userId={user.uid} />}
          {currentView === "youtube" && <YouTubeFocus />}
        </div>
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    minHeight: "100vh",
    position: "relative"
  },
  mainWrapper: {
    flex: 1,
    marginLeft: "240px",
    transition: "margin 0.3s ease",
    display: "flex",
    flexDirection: "column"
  },
  popup: {
    position: "fixed",
    top: "85px",
    right: "25px",
    width: "300px",
    backgroundColor: "#eff6ff",
    padding: "12px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    zIndex: 9999,
    display: "flex",
    justifyContent: "space-between",
    border: "1px solid #e5e7eb",
    borderLeft: "4px solid #3b82f6"
  },
  popupContent: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1
  },
  popupText: {
    fontSize: "0.85rem",
    color: "#1e293b",
    fontWeight: "500",
    lineHeight: "1.4"
  },
  inlineReadBtn: {
    alignSelf: "flex-start",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.7rem",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "white"
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: "18px",
    cursor: "pointer",
    padding: "0 0 0 10px",
    alignSelf: "flex-start"
  }
};