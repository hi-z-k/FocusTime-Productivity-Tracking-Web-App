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
import { listenToNotifications, markAsRead } from "./services/notificationService";

export default function App() {
  const { user, loading } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState("login");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
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
    if (user && user.emailVerified) {
      if (currentView === "login" || currentView === "register") setCurrentView("home");
    } else if (currentView !== "register") {
      setCurrentView("login");
    }
  }, [user, loading, currentView]);

  useEffect(() => {
    if (!user?.emailVerified) return;
    const unsubscribe = listenToNotifications(user.uid, (data) => {
      if (data.length > 0 && prevNotifsRef.current.length > 0) {
        if (!prevNotifsRef.current.find(n => n.id === data[0].id) && !data[0].read) {
          setActiveNote(data[0]);
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 10000);
        }
      }
      prevNotifsRef.current = data;
      setNotifications(data);
    });
    return () => unsubscribe();
  }, [user]);

  if (loading) return null;

  if (!user || !user.emailVerified) {
    return (
      <div className="auth-wrapper" data-theme={theme}>
        {currentView === "register" ? <Register onNavigate={setCurrentView} /> : <Login onNavigate={setCurrentView} />}
      </div>
    );
  }

  return (
    <div className={`app-container ${theme}`} data-theme={theme} style={{ display: "flex", minHeight: "100vh" }}>
      {showPopup && activeNote && (
        <div className="notification-popup">
          <p>{activeNote.text}</p>
          <button onClick={() => { markAsRead(user.uid, activeNote.id); setShowPopup(false); }}>Read</button>
        </div>
      )}
      <Sidebar onNavigate={setCurrentView} currentView={currentView} theme={theme} setTheme={setTheme} />
      <div style={{ flex: 1, marginLeft: "240px", display: "flex", flexDirection: "column" }}>
        <Navbar 
          title={currentView === "profile" ? "PROFILE" : currentView.toUpperCase()} 
          onNotificationClick={() => setCurrentView("home")}
          onProfileClick={() => setCurrentView("progress")}
        />
        <div className="content-container">
          {currentView === "home" && <Home onNavigate={setCurrentView} notifications={notifications} userId={user.uid} />}
          {currentView === "tasks" && <TaskBoard />}
          {currentView === "profile" && <Profile />}
          {currentView === "pomodoro" && <Pomodoro onFocusComplete={() => {}} />}
          {currentView === "progress" && <ProgressChart />}
        </div>
      </div>
    </div>
  );
}