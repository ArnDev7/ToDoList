const mongoose = require("mongoose");

/* 
  FIRST ATTEMPT SCHEMA:
  Initially I just did a super basic layout without validations, but then I noticed
  empty tasks and single-letter titles (like "x") were saving to my database.
  
  const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean
  });
*/

// Updated schema for the database with validation checks
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      // Added validations after checking with Postman because empty/1-letter strings were saving
      minlength: [3, "Task title must be at least 3 characters"],
      maxlength: [100, "Task title must be less than 100 characters"],
      trim: true, // cleans up surrounding white space
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Mongo automatically handles createdAt and updatedAt, which is great for sorting
  }
);

module.exports = mongoose.model("Task", taskSchema);

