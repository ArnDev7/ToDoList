const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.log("Get tasks error:", err.message);
    res.status(500).json({ message: "Could not load tasks" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      completed: req.body.completed,
    });

    res.status(201).json(task);
  } catch (err) {
    // If Mongoose validation fails, I show that message so the form problem is clear.
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    console.log("Create task error:", err.message);
    res.status(500).json({ message: "Could not create task" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        completed: req.body.completed,
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    // I treat validation and bad ids as request problems because the client sent bad data.
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ message: "Please send a valid task id and title" });
    }

    console.log("Update task error:", err.message);
    res.status(500).json({ message: "Could not update task" });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    if (typeof req.body.completed !== "boolean") {
      return res.status(400).json({ message: "completed must be true or false" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Please send a valid task id" });
    }

    console.log("Update status error:", err.message);
    res.status(500).json({ message: "Could not update task status" });
  }
};

exports.searchTasks = async (req, res) => {
  try {
    const searchText = req.query.q;

    if (!searchText || !searchText.trim()) {
      return res.status(400).json({ message: "Please enter a search keyword" });
    }

    const tasks = await Task.find({
      title: { $regex: searchText.trim(), $options: "i" }
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.log("Search error:", err.message);
    res.status(500).json({ message: "Could not search tasks" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Please send a valid task id" });
    }

    console.log("Delete task error:", err.message);
    res.status(500).json({ message: "Could not delete task" });
  }
};
