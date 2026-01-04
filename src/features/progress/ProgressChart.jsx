import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
// gamification logic for Pet evolution and outfits
import { getPetMood, getPetEvolution } from "../../services/gamificationLogic";
import { useProgressAnalytics } from "../../hooks/useProgressAnalytics";
import "../../styles/progress.css";

const COLORS = ["#8884d8", "#e0e0e0"];
export default function ProgressChart() {
  const { data, loading, error } = useProgressAnalytics();

  // shows loading state
  if (loading || !data) {
    return (
      <div className="progress-dashboard">
        <div className="bento-grid">
          <div
            className="card"
            style={{
              gridColumn: "span 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "120px",
            }}
          >
            <div style={{ textAlign: "center", color: "#999" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>⏳</div>
              <div>Loading analytics...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // shows error state
  if (error) {
    return (
      <div className="progress-dashboard">
        <div className="bento-grid">
          <div
            className="card"
            style={{
              gridColumn: "span 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "120px",
            }}
          >
            <div style={{ textAlign: "center", color: "#dc2626" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>⚠️</div>
              <div>Error loading data</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const petBase = getPetEvolution(data.hoursSpent || 0);
  const petMood = getPetMood(data.streak || 0);

  const timeData = [
    { value: (data.hoursSpent || 0) % 10 },
    { value: 10 - ((data.hoursSpent || 0) % 10) },
  ];

  const taskData = [
    { value: data.completedTasks || 0 },
    { value: (data.totalTasks || 0) - (data.completedTasks || 0) },
  ];

  return (
    <div className="progress-dashboard">
      <div className="bento-grid">
        {/* time spent card */}
        <div className="card time-spent">
          <div className="card-content">
            <p className="card-label">Focus XP</p>
            <div className="mini-chart">
              <ResponsiveContainer width="100%" height={70}>
                <PieChart>
                  <Pie
                    data={timeData}
                    innerRadius={18}
                    outerRadius={28}
                    dataKey="value"
                    stroke="none"
                  >
                    {timeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/*focus pet (with dynamic moods) */}
        <div className={`card pet-card ${petMood.class}`}>
          <p className="card-label">Focus Companion</p>
          <div className="pet-container">
            <div className="pet-visual-wrapper">
              <span className="pet-accessory">{petMood.accessory}</span>
              <span className="pet-emoji">{petBase.emoji}</span>
            </div>
            <div className="pet-info">
              <span
                className="pet-mood-tag"
                style={{ backgroundColor: petMood.color }}
              >
                {petMood.mood}
              </span>
              <h4 className="pet-stage-name">{petBase.stage}</h4>
            </div>
          </div>
        </div>

        {/* achievments gallery */}
        <div className="card achievements-card">
          <p className="card-label">Milestones</p>
          <div className="badge-row">
            {(data.achievements || []).map((ach) => (
              <div
                key={ach.id}
                className={`badge-item ${ach.unlocked ? "" : "locked"}`}
              >
                <span className="badge-icon" title={ach.title}>
                  {ach.icon}
                </span>
              </div>
            ))}
          </div>
          <p className="streak-footer">
            Current Streak: {data.streak || 0} Days
          </p>
        </div>

        {/* task completion mini-chart */}
        <div className="card task-completion">
          <ResponsiveContainer width="100%" height={90}>
            <PieChart>
              <Pie
                data={taskData}
                innerRadius={25}
                outerRadius={38}
                dataKey="value"
                stroke="none"
              >
                {taskData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="tiny-label">Tasks Done</p>
        </div>

        {/* weekly progress bar chart (spans 3 columns in CSS) */}
        <div className="card weekly-chart">
          <h3>Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.weeklyData || []}>
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

        {/* assignment tracker */}
        <div className="card assignment-tracker">
          <h3>Assignments ({(data.assignments || []).length})</h3>
          <div className="tracker-list">
            {(data.assignments || []).map((item, index) => (
              <div key={index} className="tracker-item">
                <div
                  className={`checkbox-mock ${item.completed ? "checked" : ""}`}
                >
                  {item.completed && "✓"}
                </div>
                <span className={item.completed ? "strikethrough" : ""}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
