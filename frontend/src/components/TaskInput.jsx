import React, { useState } from "react";

export default function TaskInput({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title");
      return;
    }

    if (title.trim().length < 3) {
      setError("Task title must be at least 3 characters");
      return;
    }

    onAdd({
      title: title.trim(),
      priority,
      category,
      dueDate: dueDate || null,
    });

    setTitle("");
    setPriority("medium");
    setCategory("General");
    setDueDate("");
    setError("");
  };

  return (
    <div className="task-creator-card">
      <div className="form-title">Create New Task</div>
      <form onSubmit={submit}>
        <div className="main-input-row">
          <input
            id="task-input-field"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            autoComplete="off"
          />
          <button type="submit" className="btn-primary">
            Add Task
          </button>
        </div>

        <div className="metadata-input-row">
          <div className="metadata-field">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="metadata-field">
            <label htmlFor="task-category">Category</label>
            <select
              id="task-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
            </select>
          </div>

          <div className="metadata-field">
            <label htmlFor="task-due-date">Due Date</label>
            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              style={{
                background: "transparent",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                padding: 0,
                alignItems: "center",
                display: "inline-flex",
              }}
            >
              &times;
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
