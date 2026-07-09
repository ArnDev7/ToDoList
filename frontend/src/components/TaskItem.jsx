import { useState } from "react";

export default function TaskItem({ task, onDelete, onToggle, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleUpdate = () => {
    if (!editTitle.trim()) return;
    onUpdate(task._id, editTitle.trim());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="task-row">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />
        <button onClick={handleUpdate}>Save</button>
        <button onClick={() => { setIsEditing(false); setEditTitle(task.title); }}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="task-row">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task._id, !task.completed)}
      />
      <span className={task.completed ? "completed-task" : ""}>
        {task.title}
      </span>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={() => onDelete(task._id)}>Delete</button>
    </div>
  );
}
