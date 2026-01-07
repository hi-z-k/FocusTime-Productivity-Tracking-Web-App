import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip,
} from "recharts";
import { useTaskBoard } from "../../hooks/useTaskBoard";
import useProgressAnalytics from "../../hooks/useProgressAnalytics";
import { getPetMood, getPetEvolution } from "../../services/gamificationLogic";
import "../../styles/progress.css";

const COLORS = ["#8884d8", "#e0e0e0"];

export default function ProgressChart() {
  const { tasks, editTask } = useTaskBoard(); 
  const { data, loading, error } = useProgressAnalytics(); 

  
  const generalTasks = tasks.filter((t) => t.type !== "assignment");
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

  if (loading || !data) return <div className="loading-state">Syncing Dashboard...</div>;
  if (error) return <div className="error-state">Error loading progress</div>;

  const petBase = getPetEvolution(data.hoursSpent || 0); 
  const petMood = getPetMood(data.streak || 0); 

  return (
    <div className="progress-dashboard">
      <div className="bento-grid">
        {/* Focus Time Overview */}
        <div className="card time-spent">
          <p className="card-label">Focus XP</p>
          <h2 className="focus-hours">{(data.hoursSpent || 0).toFixed(1)}h</h2>
          <p className="tiny-label">Daily Goal: {data.dailyGoal || 4}h</p>
        </div>

        {/* Pet Companion */}
        <div className={`card pet-card ${petMood.class}`}>
          <p className="card-label">Companion</p>
          <div className="pet-visual-wrapper">
            <span className="pet-emoji">{petBase.emoji}</span>
          </div>
          <div className="pet-info">
            <span className="pet-mood-tag" style={{ backgroundColor: petMood.color }}>{petMood.mood}</span>
            <h4 className="pet-stage-name">{petBase.stage}</h4>
          </div>
        </div>

        {/* Milestones */}
        <div className="card achievements-card">
          <p className="card-label">Milestones</p>
          <div className="badge-row">
            {(data.achievements || []).map((ach) => (
              <div key={ach.id} className={`badge-item ${ach.unlocked ? "unlocked" : "locked"}`}>
                <span className="badge-icon" title={ach.title}>{ach.icon}</span>
              </div>
            ))}
          </div>
          <p className="streak-footer">🔥 {data.streak || 0} Day Streak</p>
        </div>

        {/* Real-time Task Progress Circle */}
        <div className="card task-completion">
          <p className="card-label">Task Progress</p>
          <ResponsiveContainer width="100%" height={80}>
            <PieChart>
              <Pie data={taskPieData} innerRadius={25} outerRadius={38} dataKey="value" stroke="none">
                {taskPieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <h3 className="percentage-text">{percentage}%</h3>
        </div>

        {/* Weekly Bar Chart */}
        <div className="card weekly-chart">
          <h3>Weekly Focus</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.weeklyData || []}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#999'}} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Assignments List */}
        <div className="card assignment-tracker">
          <h3>Assignments</h3>
          <div className="tracker-list">
            {realAssignments.map((item) => (
              <div key={item.id} className="tracker-item" onClick={() => handleToggle(item.id, item.completed)}>
                <div className={`checkbox-mock ${item.completed ? "checked" : ""}`}>
                  {item.completed && "✓"}
                </div>
                <span className={item.completed ? "strikethrough" : ""}>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}