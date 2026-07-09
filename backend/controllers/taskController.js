const Task = require("../models/Task");

/**
 * Get all tasks, sorted by creation date (newest first).
 */
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve tasks", error: err.message });
  }
};

/**
 * Create a new task with optional priority, category, and due date.
 */
exports.createTask = async (req, res) => {
  try {
    const { title, completed, priority, category, dueDate } = req.body;
    
    const task = new Task({
      title,
      completed,
      priority,
      category,
      dueDate: dueDate || null,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Update an existing task's fields, validating constraints.
 */
exports.updateTask = async (req, res) => {
  try {
    const { title, completed, priority, category, dueDate } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        completed,
        priority,
        category,
        dueDate: dueDate || null,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Patch toggled status of a task.
 */
exports.updateTaskStatus = async (req, res) => {
  try {
    const { completed } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: "Failed to update status", error: err.message });
  }
};

/**
 * Search tasks dynamically by keyword (case-insensitive partial matching).
 */
exports.searchTasks = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const tasks = await Task.find({
      title: { $regex: query.trim(), $options: "i" },
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Search operation failed", error: err.message });
  }
};

/**
 * Delete a task.
 */
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", error: err.message });
  }
};
