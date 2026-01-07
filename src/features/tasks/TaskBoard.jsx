import React, { useState, useEffect } from "react";
import { useTaskBoard } from "../../hooks/useTaskBoard"; 
import TaskCard from "./TaskCard";

import "../../styles/global.css";
import "../../styles/buttons.css";
import "../../styles/forms.css";
import "../../styles/pages.css";
import "../../styles/taskboard.css";

export default function TaskBoard() {
  const {
    tasks,
    stages,
    loading,
    error: hookError,
    saving,
    addTask,
    editTask,
    deleteTask,
    moveTask,
    updateTaskStatus,
    addStage,
    removeStage,
  } = useTaskBoard();

  // Form states
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskType, setNewTaskType] = useState("general");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uiError, setUiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [newStageName, setNewStageName] = useState("");

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMsg || uiError || hookError) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
        setUiError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, uiError, hookError]);

  const mainTasks = tasks.filter((t) => t.type === "general");
  const assignmentTasks = tasks.filter((t) => t.type === "assignment");
  const examTasks = tasks.filter((t) => t.type === "exam");

  const handleToggleComplete = async (taskId, currentStatus) => {
    const isNowCompleted = !currentStatus;
    await editTask(taskId, { 
      completed: isNowCompleted,
      status: isNowCompleted ? "Done" : "To-Do" 
    });
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      setUiError("Task title is required!");
      return;
    }
    setIsSubmitting(true);
    try {
      await addTask({
        title: newTaskTitle,
        description: newTaskDesc,
        type: newTaskType,
        dueDate: newTaskDate,
      });
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskType("general");
      setNewTaskDate("");
    } catch (err) {
      setUiError("Failed to add task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    addStage(newStageName);
    setNewStageName("");
  };

  const handleDrop = (e, stageName) => {
    const taskId = e.dataTransfer.getData("taskId");
    moveTask(taskId, stageName);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updateData = {
      title: formData.get("title"),
      description: formData.get("description"),
      dueDate: formData.get("dueDate"),
    };
    editTask(editingTask.id, updateData);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <h2>Loading task board...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Feedback Banner */}
      {(successMsg || uiError || hookError) && (
        <div className={`fp-banner ${uiError || hookError ? "error" : "success"}`} style={{
          position: 'fixed', top: '20px', right: '20px', padding: '10px 20px',
          backgroundColor: (uiError || hookError) ? '#ffdddd' : '#ddffdd',
          color: (uiError || hookError) ? '#d8000c' : '#4f8a10',
          borderRadius: '4px', zIndex: 1000, boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          {uiError || hookError || successMsg}
        </div>
      )}

      <main className="taskboard-main">
        <section className="main-todo-card">
          <div className="page-container">
            <h2>Task Board</h2>

            {/* Task Form Creation */}
            <div className="task-form-container">
              <div className="task-form-row">
                <input
                  className="form-input flex-2"
                  placeholder="Task Title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  disabled={isSubmitting}
                />
                <select
                  className="form-select flex-1"
                  value={newTaskType}
                  onChange={(e) => setNewTaskType(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="general">General</option>
                  <option value="assignment">Assignment</option>
                  <option value="exam">Exam</option>
                </select>
              </div>
              <div className="task-form-row">
                <input
                  type="date"
                  className="form-input flex-1"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  disabled={isSubmitting}
                />
                <input
                  className="form-input flex-2"
                  placeholder="Description"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <button className="btn btn-primary" onClick={handleAddTask} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : `Create ${newTaskType.charAt(0).toUpperCase() + newTaskType.slice(1)}`}
              </button>
            </div>

            {/* Add New Stage Control */}
            <div className="add-stage-row" style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', gap: '10px' }}>
              <input
                className="form-input"
                placeholder="New Column Name..."
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                style={{ maxWidth: "250px" }}
              />
              <button className="btn btn-primary" onClick={handleAddStage}>+ Add Column</button>
            </div>

            {/* Kanban Columns (Fixed Size & Dynamic) */}
            <div className="task-board-container" style={{ 
              display: 'flex', 
              gap: '20px', 
              overflowX: 'auto', 
              paddingBottom: '20px',
              alignItems: 'flex-start' 
            }}>
              {stages.map((stageName) => (
                <div
                  key={stageName}
                  className="kanban-column"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, stageName)}
                  style={{ 
                    flex: '0 0 300px', // Standard Column Width
                    minWidth: '300px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '15px'
                  }}
                >
                  <div className="kanban-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0 }}>{stageName}</h3>
                    {!["To-Do", "In Progress", "Done"].includes(stageName) && (
                      <button
                        onClick={() => window.confirm(`Delete "${stageName}" column?`) && removeStage(stageName)}
                        className="delete-column-btn"
                        style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '1.2rem' }}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                  <div className="task-list" style={{ minHeight: '100px' }}>
                    {mainTasks
                      .filter((task) => task.status === stageName)
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={setEditingTask}
                          onDelete={deleteTask}
                          onMove={moveTask}
                          onStatusChange={updateTaskStatus}
                          isSaving={!!saving?.[task.id]}
                          stages={stages}
                          onToggleComplete={() => handleToggleComplete(task.id, task.completed)}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Assignments & Exams Grid */}
        <div className="bottom-sections-grid">
          <div className="side-card">
            <h3>📘 Assignments</h3>
            <div className="side-list">
              {assignmentTasks.map((t) => (
                <TaskCard key={t.id} task={t} onEdit={setEditingTask} onDelete={deleteTask} onMove={moveTask} onStatusChange={updateTaskStatus} isSaving={!!saving?.[t.id]} stages={stages} />
              ))}
            </div>
          </div>
          <div className="side-card">
            <h3>📝 Upcoming Exams</h3>
            <div className="side-list">
              {examTasks.map((t) => (
                <TaskCard key={t.id} task={t} onEdit={setEditingTask} onDelete={deleteTask} onMove={moveTask} onStatusChange={updateTaskStatus} isSaving={!!saving?.[t.id]} stages={stages} />
              ))}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editingTask && (
          <div className="modal-overlay" onClick={() => setEditingTask(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Edit Task</h3>
              <form onSubmit={handleSaveEdit}>
                <input name="title" className="form-input" defaultValue={editingTask.title} required />
                <input name="dueDate" type="date" className="form-input" defaultValue={editingTask.dueDate} />
                <textarea name="description" className="form-input" defaultValue={editingTask.description} rows="4" />
                <div className="modal-actions">
                  <button type="button" className="btn" onClick={() => setEditingTask(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}