import React, { useState } from "react";
import { useTaskBoard } from "./useTaskBoard";
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
    addTask,
    editTask,
    deleteTask,
    moveTask,
    addStage,
    removeStage,
  } = useTaskBoard();

  // Form states
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskType, setNewTaskType] = useState("task");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  //New state for adding Stage
  const [newStageName, setNewStageName] = useState("");
  const [deletingStage, setDeletingStage] = useState(null);

  const mainTasks = tasks.filter((t) => t.type === "task");
  const assignmentTasks = tasks.filter((t) => t.type === "assignment");
  const examTasks = tasks.filter((t) => t.type === "exam");

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addTask({
      title: newTaskTitle,
      description: newTaskDesc,
      type: newTaskType,
      dueDate: newTaskDate,
    });
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskType("task");
    setNewTaskDate("");
  };

  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    if (addStage) {
      addStage(newStageName);
      setNewStageName("");
    } else {
      console.error("addStage function not found in useTaskBoard hook");
    }
  };

  const handleDrop = (e, stage) => {
    const taskId = e.dataTransfer.getData("taskId");
    moveTask(taskId, stage);
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

  return (
    <div className="dashboard-layout">
      <main className="taskboard-main">
        <section className="main-todo-card">
          <div className="page-container">
            <h2>Task Board</h2>

            {/*Task Form Creation*/}
            <div className="task-form-container">
              <div className="task-form-row">
                <input
                  className="form-input flex-2"
                  placeholder="Task Title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <select
                  className="form-select flex-1"
                  value={newTaskType}
                  onChange={(e) => setNewTaskType(e.target.value)}
                >
                  <option value="task">General Task</option>
                  <option value="assignment">Assignment</option>
                  <option value="exam">Exam</option>
                </select>
              </div>
              <div className="task-form-row">
                <input
                  type="date"
                  style={{ flex: 1 }}
                  className="form-input flex-1"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                />
                <input
                  className="form-input flex-2"
                  placeholder="Description"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" onClick={handleAddTask}>
                create{" "}
                {newTaskType.charAt(0).toUpperCase() + newTaskType.slice(1)}
              </button>
            </div>
            {/* Add New Stage Control */}
            <div className="add-stage-row">
              <input
                className="form-input"
                placeholder="New Column Name..."
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                style={{ maxWidth: "250px" }}
              />
              <button className="btn btn-primary" onClick={handleAddStage}>
                + Add Column
              </button>
            </div>
            {/*Kanban Columns*/}
            <div className="task-board-container">
              {stages.map((stage) => (
                <div
                  key={stage}
                  className="kanban-column"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, stage)}
                >
                  <div className="kanban-header">
                    <h3 style={{ margin: 0 }}>{stage}</h3>
                    {!["To-Do", "In Progress", "Done"].includes(stage) && (
                      <button
                        onClick={() => {
                          setDeletingStage(stage);
                        }}
                        className="delete-column-btn"
                        title="Delete Column"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                  {mainTasks
                    .filter((task) => task.status === stage)
                    .map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={setEditingTask}
                        onDelete={deleteTask}
                        onMove={moveTask}
                        stages={stages}
                      />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="bottom-sections-grid">
          <div className="side-card">
            <h3>📘 Assignments</h3>
            <div className="side-list">
              {assignmentTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onEdit={setEditingTask}
                  onDelete={deleteTask}
                  onMove={moveTask}
                  stages={stages}
                />
              ))}
            </div>
          </div>

          <div className="side-card">
            <h3>📝 Upcoming Exams</h3>
            <div className="side-list">
              {examTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onEdit={setEditingTask}
                  onDelete={deleteTask}
                  onMove={moveTask}
                  stages={stages}
                />
              ))}
            </div>
          </div>
        </div>

        {editingTask && (
          <div className="modal-overlay" onClick={() => setEditingTask(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Edit Task</h3>
              <form onSubmit={handleSaveEdit}>
                <div style={{ marginBottom: "15px" }}>
                  <label className="label-style">Title</label>
                  <input
                    name="title"
                    className="form-input"
                    defaultValue={editingTask.title}
                    required
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label className="label-style">Due Date</label>
                  <input
                    name="dueDate"
                    type="date"
                    className="form-input"
                    defaultValue={editingTask.dueDate}
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label className="label-style">Description</label>
                  <textarea
                    name="description"
                    className="form-input"
                    defaultValue={editingTask.description}
                    rows="4"
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setEditingTask(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Stage Confirmation Modal */}
        {deletingStage && (
          <div className="modal-overlay" onClick={() => setDeletingStage(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Column</h3>
              <p style={{ marginBottom: "20px", color: "#4b5563" }}>
                Are you sure you want to delete the{" "}
                <strong>{deletingStage}</strong> column? This action cannot be
                undone.
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setDeletingStage(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn danger"
                  onClick={() => {
                    removeStage(deletingStage);
                    setDeletingStage(null);
                  }}
                >
                  Delete Column
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
