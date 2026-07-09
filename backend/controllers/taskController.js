const Task = require("../models/Task");

// Get all tasks from database
exports.getTasks = async (req, res) => {
  console.log("GET /api/tasks request received");
  try {
    // sort newest first
    const tasks = await Task.find().sort({ createdAt: -1 });
    console.log(`Successfully fetched ${tasks.length} tasks`);
    res.json(tasks);
  } catch (err) {
    console.log("Error in getTasks:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  console.log("POST /api/tasks request, body:", req.body);
  try {
    const task = new Task({
      title: req.body.title,
      completed: req.body.completed,
    });
    
    // debug check to see what mongoose created before saving
    console.log("Mongoose document created:", task);
    
    const savedTask = await task.save();
    console.log("Task saved to MongoDB:", savedTask);
    res.status(201).json(savedTask);
  } catch (err) {
    console.log("Error creating task:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Edit task title or status
exports.updateTask = async (req, res) => {
  console.log(`PUT /api/tasks/${req.params.id} request, body:`, req.body);
  try {
    // initially I just did findByIdAndUpdate without runValidators, 
    // but empty titles were getting updated, so added runValidators: true
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        completed: req.body.completed,
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedTask) {
      console.log(`Task with ID ${req.params.id} not found for update`);
      return res.status(404).json({ message: "Task not found" });
    }
    
    console.log("Task updated successfully:", updatedTask);
    res.json(updatedTask);
  } catch (err) {
    console.log("Error updating task:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Toggle completed status only
exports.updateTaskStatus = async (req, res) => {
  console.log(`PATCH /api/tasks/${req.params.id}/status request, body:`, req.body);
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    
    if (!updatedTask) {
      console.log(`Task with ID ${req.params.id} not found for status change`);
      return res.status(404).json({ message: "Task not found" });
    }
    
    console.log("Task status updated successfully:", updatedTask);
    res.json(updatedTask);
  } catch (err) {
    console.log("Error updating task status:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Search tasks by keyword
exports.searchTasks = async (req, res) => {
  const query = req.query.q;
  console.log(`GET /api/tasks/search request, query: "${query}"`);
  try {
    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Search term is required" });
    }
    // simple regex search
    const tasks = await Task.find({
      title: { $regex: query.trim(), $options: "i" },
    }).sort({ createdAt: -1 });
    
    console.log(`Found ${tasks.length} tasks matching search`);
    res.json(tasks);
  } catch (err) {
    console.log("Error searching tasks:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  console.log(`DELETE /api/tasks/${req.params.id} request`);
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    
    if (!deletedTask) {
      console.log(`Task with ID ${req.params.id} not found for deletion`);
      return res.status(404).json({ message: "Task not found" });
    }
    
    console.log("Task deleted from MongoDB:", deletedTask);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.log("Error deleting task:", err.message);
    res.status(500).json({ message: err.message });
  }
};
