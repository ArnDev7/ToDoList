import React, { useEffect, useState } from "react";
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
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [tabFilter, setTabFilter] = useState("all"); // "all" | "active" | "completed"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setErrorMessage = (err, defaultMessage) => {
    const backendMessage =
      err.response && err.response.data && err.response.data.message;
    setError(backendMessage || defaultMessage);
  };

  // Load all tasks from DB
  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      setErrorMessage(err, "Tasks could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Filter tasks based on selected tab filter
  useEffect(() => {
    if (tabFilter === "all") {
      setFilteredTasks(tasks);
    } else if (tabFilter === "active") {
      setFilteredTasks(tasks.filter((t) => !t.completed));
    } else if (tabFilter === "completed") {
      setFilteredTasks(tasks.filter((t) => t.completed));
    }
  }, [tasks, tabFilter]);

  // Handle adding task
  const handleAdd = async (taskData) => {
    setError("");
    try {
      await addTask(taskData);
      setSearchText("");
      await loadTasks();
    } catch (err) {
      setErrorMessage(err, "Failed to create task");
    }
  };

  // Handle deleting task
  const handleDelete = async (id) => {
    setError("");
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      setErrorMessage(err, "Failed to delete task");
    }
  };

  // Handle status toggle
  const handleToggle = async (id, completed) => {
    setError("");
    try {
      await updateTaskStatus(id, completed);
      await loadTasks();
    } catch (err) {
      setErrorMessage(err, "Failed to toggle task completion status");
    }
  };

  // Handle task updating details
  const handleUpdate = async (id, taskData) => {
    setError("");
    try {
      await updateTask(id, taskData);
      await loadTasks();
    } catch (err) {
      setErrorMessage(err, "Failed to save task modifications");
    }
  };

  // Handle keyword searching
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
      setErrorMessage(err, "Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Clear search field
  const clearSearch = () => {
    setSearchText("");
    loadTasks();
  };

  return (
    <div className="app">
      <Header tasks={tasks} />

      <TaskInput onAdd={handleAdd} />

      <div className="dashboard-actions-panel">
        <div className="filter-tabs">
          <button
            className={`tab-btn ${tabFilter === "all" ? "active" : ""}`}
            onClick={() => setTabFilter("all")}
          >
            All
          </button>
          <button
            className={`tab-btn ${tabFilter === "active" ? "active" : ""}`}
            onClick={() => setTabFilter("active")}
          >
            Active
          </button>
          <button
            className={`tab-btn ${tabFilter === "completed" ? "active" : ""}`}
            onClick={() => setTabFilter("completed")}
          >
            Completed
          </button>
        </div>

        <form className="search-box-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search task title..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button type="submit" className="search-btn">
            Search
          </button>
          {searchText && (
            <button type="button" className="search-btn" onClick={clearSearch}>
              Clear
            </button>
          )}
        </form>
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            &times;
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-message">Fetching database entries...</div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onDelete={handleDelete}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default App;
