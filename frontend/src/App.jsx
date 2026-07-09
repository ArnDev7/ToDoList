import { useEffect, useState } from "react";
import {
  getTasks,
  searchTasks,
  addTask,
  updateTaskStatus,
  deleteTask,
  updateTask,
} from "./services/taskApi";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setErrorMessage = (err, defaultMessage) => {
    const backendMessage = err.response && err.response.data && err.response.data.message;
    setError(backendMessage || defaultMessage);
  };

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      setErrorMessage(err, "Tasks could not be loaded");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAdd = async (task) => {
    setError("");
    try {
      await addTask(task);
      setSearchText("");
      await loadTasks();
    } catch (err) {
      setErrorMessage(err, "Task could not be added");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      setErrorMessage(err, "Task could not be deleted");
    }
  };

  const handleToggle = async (id, completed) => {
    setError("");
    try {
      await updateTaskStatus(id, completed);
      await loadTasks();
    } catch (err) {
      setErrorMessage(err, "Task status could not be changed");
    }
  };

  const handleUpdate = async (id, title) => {
    setError("");
    const taskToUpdate = tasks.find((t) => t._id === id);
    try {
      await updateTask(id, {
        title,
        completed: taskToUpdate ? taskToUpdate.completed : false,
      });
      await loadTasks();
    } catch (err) {
      setErrorMessage(err, "Task could not be updated");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchText.trim()) {
      loadTasks();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await searchTasks(searchText);
      setTasks(res.data);
    } catch (err) {
      setErrorMessage(err, "Search did not work");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    loadTasks();
  };

  return (
    <div className="app">
      <Header />

      <TaskInput onAdd={handleAdd} />

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search task title"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={clearSearch}>
          Clear
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading-message">Loading...</p>}

      {!loading && (
        <TaskList
          tasks={tasks}
          onDelete={handleDelete}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default App;
