const mongoose = require("mongoose");

/**
 * Task Schema Definition
 * Represents a single task item in the database, including properties for
 * tracking completion status, priorities, categories, and due dates.
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      minlength: [3, "Task title must be at least 3 characters"],
      maxlength: [100, "Task title must be less than 100 characters"],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be either low, medium, or high",
      },
      default: "medium",
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for optimized searching and filtering
taskSchema.index({ title: "text" });
taskSchema.index({ completed: 1, createdAt: -1 });

module.exports = mongoose.model("Task", taskSchema);
