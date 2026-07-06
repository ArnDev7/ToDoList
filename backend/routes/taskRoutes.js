const express = require("express");
const taskController = require("../controllers/taskController");

const router = express.Router();

function validateTaskTitle(req, res, next) {
  const taskTitle = req.body.title;

  if (!taskTitle || !taskTitle.trim()) {
    return res.status(400).json({ message: "Task title is required" });
  }

  const trimmedTitle = taskTitle.trim();

  if (trimmedTitle.length < 3) {
    return res.status(400).json({ message: "Task title must be at least 3 characters" });
  }

  if (trimmedTitle.length > 100) {
    return res.status(400).json({ message: "Task title must be less than 100 characters" });
  }

  req.body.title = trimmedTitle;
  next();
}

router.get("/search", taskController.searchTasks);
router.get("/", taskController.getTasks);
router.post("/", validateTaskTitle, taskController.createTask);
router.put("/:id", validateTaskTitle, taskController.updateTask);
router.patch("/:id/status", taskController.updateTaskStatus);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
