import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import TaskBoard from "./features/tasks/TaskBoard";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Profile from "./features/auth/Profile";
import Pomodoro from "./features/pomodoro/Pomodoro";

export default function App() {
const { user, loading } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState("login");
  const [streak, setStreak] = useState(10);

  useEffect(() => {
    if (user && (currentView === "login" || currentView === "register")) {
      setCurrentView("tasks");
    }
    if (!user && currentView !== "login" && currentView !== "register") {
      setCurrentView("login");
    }
  }, [user, currentView]);

  if (!user) {
    return (
      <div className="auth-wrapper">
        {currentView === "register" ? (
          <Register onNavigate={setCurrentView} />
        ) : (
          <Login onNavigate={setCurrentView} />
        )}
      </div>
    );
  }

  // 3) Authenticated users see the full app
  return (
    <div
      className="app-container"
      style={{ display: "flex", backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <Sidebar onNavigate={setCurrentView} currentView={currentView} />

      <div className="main-wrapper" style={{ flex: 1, marginLeft: "260px" }}>
        <Navbar
          title={
            currentView === "profile"
              ? "PERSONAL INFORMATION"
              : currentView.toUpperCase()
          }
          streak={streak}
        />

        {currentView === "tasks" && <TaskBoard />}
        {currentView === "profile" && (
          <Profile streak={streak} setStreak={setStreak} />
        )}
        {currentView === "pomodoro" && <Pomodoro />}
      </div>
    </div>
  );
}