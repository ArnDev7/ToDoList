import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onDelete, onToggle }) {
  if (tasks.length === 0) {
    return <p>No tasks found.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
