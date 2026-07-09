const Task = require("../models/Task");

// Get all tasks from database
exports.getTasks = async (req, res) => {
  console.log("GET /api/tasks request received");
  try {
    // Sort newest first - this makes sure new tasks show up at the top of the list!
    const tasks = await Task.find().sort({ createdAt: -1 });
    
    // Uncomment when tracing db output
    // console.log("DB Raw tasks list:", tasks);
    
    console.log(`Fetched ${tasks.length} tasks successfully`);
    res.json(tasks);
  } catch (err) {
    console.log("Error in getTasks:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  console.log("POST /api/tasks request, body contents:", req.body);
  try {
    /* 
      FIRST TRIAL MANUAL CHECK:
      Initially I wrote validation checks manually like this before letting the Schema handle it:
      if (!req.body.title || req.body.title.trim().length === 0) {
        return res.status(400).json({ message: "You must enter a task title!" });
      }
    */
    
    const task = new Task({
      title: req.body.title,
      completed: req.body.completed, // usually false by default
    });
    
    // debug check to see what mongoose created before saving
    console.log("Drafting mongoose document:", task);
    
    const savedTask = await task.save();
    console.log("Success! Task saved to Mongo:", savedTask);
    res.status(201).json(savedTask);
  } catch (err) {
    console.log("Error inside createTask caught:", err.message);
    // this returns the validation error message from model schema back to the frontend
    res.status(400).json({ message: err.message });
  }
};

// Edit task title or status
exports.updateTask = async (req, res) => {
  console.log(`PUT /api/tasks/${req.params.id} request, body:`, req.body);
  try {
    // BUG FIX LOG: 
    // I originally did findByIdAndUpdate(..., req.body) and it saved blank strings on edit!
    // I was super confused why Schema validations didn't block it. 
    // Turns out Mongoose does NOT run validations on updates by default - only when creating. 
    // Had to search online and pass `runValidators: true` options to fix it.
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        completed: req.body.completed,
      },
      { new: true, runValidators: true } // new returns the edited version, runValidators checks string length
    );
    
    if (!updatedTask) {
      console.log(`Task to update not found, ID: ${req.params.id}`);
      return res.status(404).json({ message: "Task not found" });
    }
    
    console.log("Db update successful, returned task:", updatedTask);
    res.json(updatedTask);
  } catch (err) {
    console.log("Error inside updateTask caught:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Toggle completed status only
exports.updateTaskStatus = async (req, res) => {
  console.log(`PATCH /api/tasks/${req.params.id}/status request received. completed value:`, req.body.completed);
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true } // don't need runValidators since title doesn't change
    );
    
    if (!updatedTask) {
      console.log(`Task for status change not found, ID: ${req.params.id}`);
      return res.status(404).json({ message: "Task not found" });
    }
    
    console.log("Toggled status successfully. Document now:", updatedTask);
    res.json(updatedTask);
  } catch (err) {
    console.log("Error toggling status:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Search tasks by keyword
exports.searchTasks = async (req, res) => {
  const query = req.query.q;
  console.log(`GET /api/tasks/search query: "${query}"`);
  try {
    if (!query || !query.trim()) {
      console.log("Search query was blank spaces or undefined");
      return res.status(400).json({ message: "Search term is required" });
    }
    
    // FIRST TRIAL FOR SEARCH:
    // I tried `Task.find({ title: query })` but it only matched exact full strings.
    // So if I searched "milk" and the task was "buy milk", it returned nothing.
    // Looked at mongoose regex and found `regex` option 'i' (case-insensitive) works perfectly.
    const tasks = await Task.find({
      title: { $regex: query.trim(), $options: "i" },
    }).sort({ createdAt: -1 });
    
    console.log(`Search result count: ${tasks.length} tasks`);
    res.json(tasks);
  } catch (err) {
    console.log("Error searching tasks:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  console.log(`DELETE /api/tasks/${req.params.id} triggered`);
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    
    if (!deletedTask) {
      console.log(`Delete target not found, ID: ${req.params.id}`);
      return res.status(404).json({ message: "Task not found" });
    }
    
    console.log("Deleted document from DB:", deletedTask);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.log("Error in deleteTask API handler:", err.message);
    res.status(500).json({ message: err.message });
  }
};

