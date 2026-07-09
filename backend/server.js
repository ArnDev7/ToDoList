const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocking: Origin not allowed"));
      }
    }
  })
);
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend/dist")));

mongoose
  .connect(process.env.MONGO_URI, { dbName: "taskflow" })
  .then(() => console.log("MongoDB connected to taskflow"))
  .catch((e) => console.error("MongoDB connection error:", e.message));

app.use("/api/tasks", require("./routes/taskRoutes"));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
