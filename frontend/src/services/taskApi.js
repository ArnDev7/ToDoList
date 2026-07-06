import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/tasks`
});

export const getTasks = () => API.get("/");
export const searchTasks = (keyword) => API.get(`/search?q=${encodeURIComponent(keyword)}`);
export const addTask = (task) => API.post("/", task);
export const updateTask = (id, data) => API.put(`/${id}`, data);
export const updateTaskStatus = (id, completed) => API.patch(`/${id}/status`, { completed });
export const deleteTask = (id) => API.delete(`/${id}`);
