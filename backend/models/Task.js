const mongoose = require("mongoose");

// simple task schema for the database
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      // added min and max length after testing with postman because blank or 1-letter titles were getting saved
      minlength: [3, "Task title must be at least 3 characters"],
      maxlength: [100, "Task title must be less than 100 characters"],
      trim: true, // removes extra spaces
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // stores when it was created and updated
  }
);

module.exports = mongoose.model("Task", taskSchema);
