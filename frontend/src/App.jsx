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
  // initial hardcoded list to test UI layout before setting up API connection:
  // const [tasks, setTasks] = useState([
  //   { _id: "1", title: "Test task 1", completed: false },
  //   { _id: "2", title: "Test task 2", completed: true }
  // ]);
  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setErrorMessage = (err, defaultMessage) => {
    const backendMessage = err.response && err.response.data && err.response.data.message;
    setError(backendMessage || defaultMessage);
  };

  // load all tasks from backend
  const loadTasks = async () => {
    console.log("loadTasks() triggered");
    setLoading(true);
    setError("");
    try {
      const res = await getTasks();
      console.log("Data loaded from API:", res.data);
      setTasks(res.data);
    } catch (err) {
      console.log("Error loading tasks:", err);
      setErrorMessage(err, "Tasks could not be loaded");
    } finally {
      setLoading(false);
    }
  };

  // call loadTasks once when page loads
  useEffect(() => {
    console.log("App mounted, fetching tasks...");
    loadTasks();
  }, []);

  // add task
  const handleAdd = async (task) => {
    console.log("handleAdd called with:", task);
    setError("");
    try {
      await addTask(task);
      console.log("Task added, reloading list...");
      setSearchText(""); // reset search input
      await loadTasks();
    } catch (err) {
      console.log("Error adding task:", err);
      setErrorMessage(err, "Task could not be added");
    }
  };

  // delete task
  const handleDelete = async (id) => {
    console.log("handleDelete called for ID:", id);
    setError("");
    try {
      await deleteTask(id);
      console.log("Task deleted, reloading list...");
      await loadTasks();
    } catch (err) {
      console.log("Error deleting task:", err);
      setErrorMessage(err, "Task could not be deleted");
    }
  };

  // toggle completed status
  const handleToggle = async (id, completed) => {
    console.log(`handleToggle called for ID: ${id}, completed: ${completed}`);
    setError("");
    try {
      await updateTaskStatus(id, completed);
      console.log("Status updated, reloading list...");
      await loadTasks();
    } catch (err) {
      console.log("Error updating task status:", err);
      setErrorMessage(err, "Task status could not be changed");
    }
  };

  // edit task title
  const handleUpdate = async (id, title) => {
    console.log(`handleUpdate called for ID: ${id}, new title: ${title}`);
    setError("");
    const taskToUpdate = tasks.find((t) => t._id === id);
    try {
      // send title change along with current completed status
      await updateTask(id, {
        title,
        completed: taskToUpdate ? taskToUpdate.completed : false,
      });
      console.log("Title updated, reloading list...");
      await loadTasks();
    } catch (err) {
      console.log("Error updating task title:", err);
      setErrorMessage(err, "Task could not be updated");
    }
  };

  // search form submit handler
  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("Search submitted, query:", searchText);
    if (!searchText.trim()) {
      console.log("Blank search text, reloading all tasks");
      loadTasks();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await searchTasks(searchText);
      console.log("Search results received:", res.data);
      setTasks(res.data);
    } catch (err) {
      console.log("Search error:", err);
      setErrorMessage(err, "Search did not work");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    console.log("Clearing search and loading all tasks");
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
