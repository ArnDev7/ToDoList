import { useState } from "react";

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setMessage("Please enter a task title");
      return;
    }

    if (text.trim().length < 3) {
      setMessage("Task title must be at least 3 characters");
      return;
    }

    onAdd({ title: text.trim() });
    setText("");
    setMessage("");
  };

  return (
    <>
      <form onSubmit={submit} className="task-input">
        <input
          id="task-input-field"
          type="text"
          placeholder="Enter task title"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="btn-add">Add</button>
      </form>
      {message && <p className="error-message">{message}</p>}
    </>
  );
}
