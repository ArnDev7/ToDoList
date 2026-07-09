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
  /*
  const [tasks, setTasks] = useState([
    { _id: "1", title: "Test task 1", completed: false },
    { _id: "2", title: "Test task 2", completed: true }
  ]);
  */
  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Quick helper to read error responses. 
  // Axios nests Express error json inside err.response.data. 
  // If connection is dead, we fallback to our generic message.
  const setErrorMessage = (err, defaultMessage) => {
    // console.log("Axios full error object:", err); // debug dump
    const backendMessage = err.response && err.response.data && err.response.data.message;
    setError(backendMessage || defaultMessage);
  };

  // Load all tasks from backend
  const loadTasks = async () => {
    console.log("----> loadTasks() triggered, state refresh");
    setLoading(true);
    setError("");
    try {
      const res = await getTasks();
      // console.log("Data loaded from API:", res.data);
      setTasks(res.data);
    } catch (err) {
      console.log("Error loading tasks from Express server:", err);
      setErrorMessage(err, "Tasks could not be loaded");
    } finally {
      setLoading(false);
    }
  };

  // Call loadTasks once when page loads
  useEffect(() => {
    console.log("App component mounted onto DOM - pulling tasks now...");
    loadTasks();
  }, []);

  // Add task
  const handleAdd = async (task) => {
    console.log("handleAdd function running. task title input:", task);
    setError("");
    try {
      const response = await addTask(task);
      console.log("API created task successfully:", response.data);
      setSearchText(""); // reset search input in case user was searching
      await loadTasks(); // reload the entire DB to get the new task and sync
    } catch (err) {
      console.log("Error adding task:", err);
      setErrorMessage(err, "Task could not be added");
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    console.log("handleDelete clicked for ID:", id);
    setError("");
    try {
      await deleteTask(id);
      
      /*
        DEVELOPER LOG:
        Initially, I tried delete tasks locally by doing:
        setTasks(tasks.filter(t => t._id !== id));
        It was fast, but if the database delete failed for some reason, the UI would be out of sync.
        Also, I ran into issues where the database status updates weren't updating.
        So I changed it to wait for the API call to complete, then reload the whole list from DB.
      */
      
      console.log("Task delete requested... Reloading now.");
      await loadTasks();
    } catch (err) {
      console.log("Error deleting task:", err);
      setErrorMessage(err, "Task could not be deleted");
    }
  };

  // Toggle completed status checkbox
  const handleToggle = async (id, completed) => {
    console.log(`handleToggle triggered: ID: ${id}, checking: ${completed}`);
    setError("");
    try {
      await updateTaskStatus(id, completed);
      // Wait for completed status to save in Mongo, then fetch everything again
      console.log("Checkbox state saved in DB. Reloading...");
      await loadTasks();
    } catch (err) {
      console.log("Error updating task status:", err);
      setErrorMessage(err, "Task status could not be changed");
    }
  };

  // Edit task title inline
  const handleUpdate = async (id, title) => {
    console.log(`handleUpdate triggered: ID: ${id}, new title input: ${title}`);
    setError("");
    const taskToUpdate = tasks.find((t) => t._id === id);
    try {
      // Send title change along with current completed status.
      // Need to find the task first to retain completed state.
      await updateTask(id, {
        title,
        completed: taskToUpdate ? taskToUpdate.completed : false,
      });
      console.log("Title updated. Reloading list...");
      await loadTasks();
    } catch (err) {
      console.log("Error updating task title:", err);
      // Express returns schema validator error, setErrorMessage displays it below
      setErrorMessage(err, "Task could not be updated");
    }
  };

  // Search form submit handler
  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("Searching for term:", searchText);
    if (!searchText.trim()) {
      console.log("Empty search box. Loading all tasks instead.");
      loadTasks();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await searchTasks(searchText);
      console.log("Search results from API:", res.data);
      setTasks(res.data);
    } catch (err) {
      console.log("Search error occurred:", err);
      setErrorMessage(err, "Search did not work");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    console.log("Clearing search term input field");
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
