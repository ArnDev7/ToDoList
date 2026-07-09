import React, { useState } from "react";

export default function TaskItem({ task, onDelete, onToggle, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState(task.priority || "medium");
  const [editCategory, setEditCategory] = useState(task.category || "General");
  const [editDueDate, setEditDueDate] = useState(() => {
    if (!task.dueDate) return "";
    return new Date(task.dueDate).toISOString().split("T")[0];
  });

  const handleUpdate = () => {
    if (!editTitle.trim()) return;
    onUpdate(task._id, {
      title: editTitle.trim(),
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate || null,
      completed: task.completed,
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  if (isEditing) {
    return (
      <div className="task-card">
        <div className="task-edit-panel">
          <div className="edit-input-row">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Task Title"
            />
          </div>
          <div className="edit-meta-row">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
            </select>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <button
              className="btn-primary"
              style={{ padding: "6px 12px", fontSize: "12px" }}
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="search-btn"
              style={{ padding: "6px 12px", fontSize: "12px" }}
              onClick={() => {
                setIsEditing(false);
                setEditTitle(task.title);
                setEditPriority(task.priority || "medium");
                setEditCategory(task.category || "General");
                setEditDueDate(
                  task.dueDate
                    ? new Date(task.dueDate).toISOString().split("T")[0]
                    : ""
                );
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="task-card">
      <div className="task-left">
        <label className="custom-checkbox-wrapper">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task._id, !task.completed)}
          />
          <span className="checkmark"></span>
        </label>

        <div className="task-content">
          <span className={`task-title ${task.completed ? "completed" : ""}`}>
            {task.title}
          </span>
          <div className="task-badges">
            <span className={`badge p-${task.priority || "medium"}`}>
              {task.priority || "medium"}
            </span>
            <span className="badge category-tag">
              {task.category || "General"}
            </span>
            {task.dueDate && (
              <span className="badge due-date-tag">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button
          className="action-btn edit-btn"
          onClick={() => setIsEditing(true)}
          title="Edit Task"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button
          className="action-btn delete-btn"
          onClick={() => onDelete(task._id)}
          title="Delete Task"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
