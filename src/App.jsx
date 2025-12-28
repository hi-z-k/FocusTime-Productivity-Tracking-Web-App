import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import TaskBoard from "./features/tasks/TaskBoard";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Profile from "./features/auth/Profile";
import Pomodoro from "./features/pomodoro/Pomodoro";

export default function App() {
  const [currentView, setCurrentView] = useState("register");
  // Shared state for the streak
  const [streak, setStreak] = useState(10);

  return (
    <div
      className="app-container"
      style={{
        display: "flex",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {currentView !== "login" && currentView !== "register" && (
        <Sidebar onNavigate={setCurrentView} currentView={currentView} />
      )}

      <div
        className="main-wrapper"
        style={{
          flex: 1,
          marginLeft:
            currentView !== "login" && currentView !== "register"
              ? "260px"
              : "0",
        }}
      >
        {currentView !== "login" && currentView !== "register" && (
          <Navbar
            title={
              currentView === "profile"
                ? "PERSONAL INFORMATION"
                : currentView.toUpperCase()
            }
            streak={streak}
          />
        )}

        {currentView === "login" && <Login onNavigate={setCurrentView} />}
        {currentView === "register" && <Register onNavigate={setCurrentView} />}
        {currentView === "tasks" && <TaskBoard />}
        {currentView === "profile" && (
          <Profile streak={streak} setStreak={setStreak} />
        )}
        {currentView === "pomodoro" && <Pomodoro />}
      </div>
    </div>
  );
}
