export default function TaskItem({ task, onDelete, onToggle }) {
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
      <button onClick={() => onDelete(task._id)}>
        Delete
      </button>
    </div>
  );
}
