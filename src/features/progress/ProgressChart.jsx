import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis, // Added this import
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip, // Added for better UX
} from "recharts";
import { useTaskBoard } from "../../hooks/useTaskBoard";
import useProgressAnalytics from "../../hooks/useProgressAnalytics";
import { getPetMood, getPetEvolution } from "../../services/gamificationLogic";
import "../../styles/progress.css";

const COLORS = ["#8884d8", "#e0e0e0"];

export default function ProgressChart() {
  const { tasks, editTask } = useTaskBoard();
  const { data, loading, error } = useProgressAnalytics();

  // --- LOGIC FOR REAL-TIME SYNC ---
  const generalTasks = tasks.filter((t) => t.type === "task" || t.type === "general");
  const completedCount = generalTasks.filter((t) => t.completed).length;
  const totalCount = generalTasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const taskPieData = [
    { value: completedCount },
    { value: totalCount - completedCount || (totalCount === 0 ? 1 : 0) },
  ];

  const realAssignments = tasks.filter((t) => t.type === "assignment");

  const handleToggle = (id, currentStatus) => {
    editTask(id, { completed: !currentStatus });
  };

  if (loading || !data) return <div className="loading-state">Loading dashboard...</div>;
  if (error) return <div className="error-state">Error loading analytics</div>;

  const petBase = getPetEvolution(data.hoursSpent || 0);
  const petMood = getPetMood(data.streak || 0);

  const timeXPData = [
    { value: data.hoursSpent || 0 },
    { value: Math.max(0, (data.dailyGoal || 4.0) - (data.hoursSpent || 0)) },
  ];

  return (
    <div className="progress-dashboard">
      <div className="bento-grid">
        {/* 1. FOCUS XP CARD */}
        <div className="card time-spent">
          <div className="card-content">
            <p className="card-label">Focus XP</p>
            <div className="mini-chart">
              <ResponsiveContainer width="100%" height={70}>
                <PieChart>
                  <Pie
                    data={timeXPData}
                    innerRadius={18}
                    outerRadius={28}
                    dataKey="value"
                    stroke="none"
                  >
                    {timeXPData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 2. PET COMPANION CARD */}
        <div className={`card pet-card ${petMood.class}`}>
          <p className="card-label">Focus Companion</p>
          <div className="pet-container">
            <div className="pet-visual-wrapper">
              <span className="pet-accessory">{petMood.accessory}</span>
              <span className="pet-emoji">{petBase.emoji}</span>
            </div>
            <div className="pet-info">
              <span className="pet-mood-tag" style={{ backgroundColor: petMood.color }}>
                {petMood.mood}
              </span>
              <h4 className="pet-stage-name">{petBase.stage}</h4>
            </div>
          </div>
        </div>

        {/* 3. MILESTONES CARD */}
        <div className="card achievements-card">
          <p className="card-label">Milestones</p>
          <div className="badge-row">
            {(data.achievements || []).map((ach) => (
              <div key={ach.id} className={`badge-item ${ach.unlocked ? "" : "locked"}`}>
                <span className="badge-icon" title={ach.title}>{ach.icon}</span>
              </div>
            ))}
          </div>
          <p className="streak-footer">Streak: {data.streak || 0} Days</p>
        </div>

        {/* 4. TASK PROGRESS CIRCLE */}
        <div className="card task-completion">
          <p className="card-label">Task Progress</p>
          {totalCount > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={80}>
                <PieChart>
                  <Pie
                    data={taskPieData}
                    innerRadius={25}
                    outerRadius={38}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                    stroke="none"
                  >
                    {taskPieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <h3 style={{ color: "#8884d8", margin: "5px 0" }}>{percentage}%</h3>
              <p className="tiny-label">Tasks Done</p>
            </>
          ) : (
            <div className="empty-state">No tasks yet</div>
          )}
        </div>

        {/* 5. WEEKLY PROGRESS CHART */}
        <div className="card weekly-chart">
          <h3>Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.weeklyData || []}>
              {/* FIXED YAXIS: Correct placement and dynamic domain */}
              <YAxis 
                hide={true} 
                domain={[0, data?.dailyGoal || 4]} 
              />
              <Tooltip 
                formatter={(value) => [`${value.toFixed(2)} hrs`, "Focus Time"]}
                cursor={{ fill: 'transparent' }}
              />
              <Bar
                dataKey="value"
                fill="#8884d8"
                radius={[6, 6, 0, 0]}
                barSize={18}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#999", fontSize: 12 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 6. ASSIGNMENT TRACKER */}
        <div className="card assignment-tracker">
          <h3>Assignments ({realAssignments.length})</h3>
          <div className="tracker-list">
            {realAssignments.length > 0 ? (
              realAssignments.map((item) => (
                <div
                  key={item.id}
                  className="tracker-item"
                  onClick={() => handleToggle(item.id, item.completed)}
                >
                  <div className={`checkbox-mock ${item.completed ? "checked" : ""}`}>
                    {item.completed && "✓"}
                  </div>
                  <span className={item.completed ? "strikethrough" : ""}>{item.title}</span>
                </div>
              ))
            ) : (
              <p className="tiny-label">No assignments assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}