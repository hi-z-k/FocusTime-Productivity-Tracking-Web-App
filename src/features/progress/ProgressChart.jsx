import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { syncUserProgress } from "../../services/progressService";
import "../../styles/progress.css";

export default function ProgressChart({ userId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Listen to real-time updates from Firebase
    const unsubscribe = syncUserProgress(userId, (data) => {
      setStats(data);
    });
    return () => unsubscribe && unsubscribe();
  }, [userId]);

  if (!stats) return <div className="loading">Loading stats...</div>;

  // Data for "Time Spent" (Hours Spent vs Remaining)
  const timeSpentData = [
    { name: "Spent", value: stats.hoursSpent || 0 },
    { name: "Remaining", value: Math.max(0, (stats.dailyGoal || 8) - (stats.hoursSpent || 0)) }
  ];

  // Data for "Task Completion"
  const taskData = [
    { name: "Done", value: stats.completedTasks || 0 },
    { name: "Pending", value: stats.totalTasks - stats.completedTasks || 0 }
  ];

  return (
    <div className="progress-dashboard">
      <div className="bento-grid">
        
        {/* Time Spent Tile */}
        <div className="card time-spent">
          <div className="card-header">
            <p>Time Spent</p>
            <ResponsiveContainer width="100%" height={80}>
              <PieChart>
                <Pie data={timeSpentData} innerRadius={20} outerRadius={30} dataKey="value">
                  <Cell fill="#333" />
                  <Cell fill="#f0f0f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Streak Tile */}
        <div className="card streak-mini">
           <p>Streak</p>
           <span className="streak-val">{stats.streak || 0} 🔥</span>
        </div>

        {/* Weekly Progress (Bar Chart) */}
        <div className="card weekly-chart">
          <h3>Weekly Progress Chart</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.weeklyData || []}>
              <Bar dataKey="value" fill="#000" radius={[4, 4, 0, 0]} barSize={15} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Assignment Tracker */}
        <div className="card assignment-tracker">
          <h3>Assignment Tracker ({stats.assignments?.length || 0})</h3>
          <div className="tracker-list">
            {stats.assignments?.map((item, index) => (
              <div key={index} className="tracker-item">
                <div className={`checkbox-mock ${item.completed ? 'checked' : ''}`}></div>
                <span className={item.completed ? 'strikethrough' : ''}>{item.title}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}