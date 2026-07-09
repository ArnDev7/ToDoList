import React from "react";

export default function Header({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <header className="header">
      <div className="header-title-section">
        <h1>Task Space</h1>
        <p>Organize, prioritize, and capture daily goals</p>
      </div>

      <div className="stats-container">
        <div className="stats-info">
          <div className="performance-percentage">{percentage}%</div>
          <div className="performance-fraction">
            {completed} / {total} completed
          </div>
        </div>
        <div className="stats-bar-wrapper">
          <div
            className="stats-bar-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </header>
  );
}
