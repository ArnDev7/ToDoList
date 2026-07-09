# MERN Task App

This is my task manager app built using React, Express, Node.js, and MongoDB. You can use it to create tasks, view them, search by title, edit titles, check them off as complete, and delete them.

This application is configured as a monorepo and is fully optimized for single-service deployment on Vercel.

---

## Features

- **Create Tasks:** Easily add new tasks from the input form.
- **View Tasks:** View all tasks sorted by creation date (newest first).
- **Inline Editing:** Edit any task title directly inline with "Save" and "Cancel" actions.
- **Toggle Completion:** Checkbox to mark tasks as complete or incomplete.
- **Delete Tasks:** Remove tasks instantly.
- **Search:** Search tasks by title using case-insensitive partial matching.
- **Data Validation:** Strict title validation (3-100 characters) enforced directly via Mongoose model constraints.

---

## Folder Structure

```text
A8_new/
  ├── vercel.json          # Vercel single-project build and routing config
  ├── package.json         # Root package file with build scripts
  ├── backend/
  │     ├── controllers/   # Task controller logic
  │     ├── models/        # Task Mongoose schema
  │     ├── routes/        # Express API endpoints
  │     └── server.js      # Express application configuration
  └── frontend/
        ├── dist/          # Compiled static React frontend
        ├── src/           # React frontend source files
        │     ├── components/
        │     ├── services/taskApi.js
        │     ├── App.jsx
        │     └── App.css
        └── package.json   # React/Vite configurations
```

---

## My Learning Process & Debugging Log

During the development of this MERN application, I faced multiple errors and resolved them iteratively. Below is a log of my debugging steps:

### 1. Resolving CORS Errors
* **Problem:** In my initial setup, when my React frontend tried to send requests to the Express backend (localhost:5000), the browser blocked it with a CORS policy error.
* **Debugging:** I placed `console.log("Allowed CORS origin:", allowedOrigin)` in `backend/server.js` and saw that the origin was undefined.
* **Fix:** I installed the `cors` package in the backend, imported it, and allowed requests from `http://localhost:5173` (Vite's port) in my server configurations.

### 2. Validation Missing on Updates
* **Problem:** When I tested the `PUT /api/tasks/:id` endpoint in Postman, I noticed I was able to update a task to an empty string, even though my Mongoose schema had `required: true` and `minlength: 3` validators.
* **Debugging:** I checked the Mongoose documentation and learned that `findByIdAndUpdate` does not run schema validators by default.
* **Fix:** I updated the controller in `taskController.js` and added `{ runValidators: true }` to the update options. I also added `console.log("Error updating task:", err.message)` in the catch block to print validation failures to my terminal.

### 3. Deleting Tasks and UI State Sync
* **Problem:** When deleting a task, the task would successfully delete in MongoDB, but the item remained visible on the React screen until I manually refreshed the browser.
* **Debugging:** I added `console.log("Task deleted, reloading list...")` inside `App.jsx` and realized that after the API delete request resolved, I wasn't updating my local React `tasks` state.
* **Fix:** I added `await loadTasks()` inside the `handleDelete` method right after the `deleteTask(id)` API call so the frontend automatically syncs with the database.

### 4. Vercel Single-Origin Deployments
* **Problem:** When I imported this project into Vercel, the deploy button was greyed out because Vercel auto-detected multiple service folders and applied the "Services" monorepo preset, expecting a different `vercel.json` format.
* **Fix:** I clicked the **Application Preset** dropdown in the Vercel project import settings and changed it to **Other**. This allowed Vercel to read my root `vercel.json` and build the single-deployment structure.

---

## Local Development Setup

To run both backend and frontend applications locally:

### 1. Install Dependencies
Run the following command at the root of the project to install all dependencies for both `backend` and `frontend`:
```bash
npm run install-all
```

### 2. Configure Environment Variables
Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
```

### 3. Start the Application
Start the backend server locally:
```bash
npm start
```
By default, the backend will be available at `http://localhost:5000`.

To work on the frontend React app with hot-reloading:
1. Go into the frontend folder: `cd frontend`
2. Start the Vite dev server: `npm run dev`
The frontend will run at `http://localhost:5173`.

---

## Production Deployment (Vercel)

This repository is optimized to deploy both the frontend and backend to Vercel in a single project.

### 1. Set Up MongoDB Atlas
1. Create a free **M0 Cluster** on MongoDB Atlas.
2. In **Network Access**, add `0.0.0.0/0` to allow Vercel's serverless functions to connect.
3. In **Database Access**, create a user with read/write access.
4. Copy your connection string (e.g. `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?appName=Cluster0`).

### 2. Deploy to Vercel
1. Log in to Vercel using your GitHub account and import your repository.
2. Under **Project Settings**, change the **Application Preset** from *Services* to **Other**.
3. Under **Environment Variables**, add:
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
4. Click **Deploy**.

---

## Postman API Testing Log

All endpoints were tested locally against `http://localhost:5000` using Postman.

### 1. Health Check
- **Endpoint:** `GET http://localhost:5000/api/health`
- **Status Code:** `200 OK`
- **Response:**
```json
{
  "status": "ok",
  "db": "connected"
}
```

### 2. Create Task
- **Endpoint:** `POST http://localhost:5000/api/tasks`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "title": "Clean my room"
}
```
- **Status Code:** `201 Created`
- **Response:**
```json
{
  "_id": "64b0f90e5f1b2c3d4e5f6a7b",
  "title": "Clean my room",
  "completed": false,
  "createdAt": "2026-07-09T22:30:00.000Z",
  "updatedAt": "2026-07-09T22:30:00.000Z",
  "__v": 0
}
```

### 3. Get All Tasks
- **Endpoint:** `GET http://localhost:5000/api/tasks`
- **Status Code:** `200 OK`
- **Response:**
```json
[
  {
    "_id": "64b0f90e5f1b2c3d4e5f6a7b",
    "title": "Clean my room",
    "completed": false,
    "createdAt": "2026-07-09T22:30:00.000Z",
    "updatedAt": "2026-07-09T22:30:00.000Z",
    "__v": 0
  }
]
```

### 4. Update Task (Edit Title)
- **Endpoint:** `PUT http://localhost:5000/api/tasks/64b0f90e5f1b2c3d4e5f6a7b`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "title": "Clean my room and study",
  "completed": false
}
```
- **Status Code:** `200 OK`
- **Response:**
```json
{
  "_id": "64b0f90e5f1b2c3d4e5f6a7b",
  "title": "Clean my room and study",
  "completed": false,
  "createdAt": "2026-07-09T22:30:00.000Z",
  "updatedAt": "2026-07-09T22:35:00.000Z",
  "__v": 0
}
```

### 5. Toggle Task Status
- **Endpoint:** `PATCH http://localhost:5000/api/tasks/64b0f90e5f1b2c3d4e5f6a7b/status`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "completed": true
}
```
- **Status Code:** `200 OK`
- **Response:**
```json
{
  "_id": "64b0f90e5f1b2c3d4e5f6a7b",
  "title": "Clean my room and study",
  "completed": true,
  "createdAt": "2026-07-09T22:30:00.000Z",
  "updatedAt": "2026-07-09T22:40:00.000Z",
  "__v": 0
}
```

### 6. Search Tasks
- **Endpoint:** `GET http://localhost:5000/api/tasks/search?q=clean`
- **Status Code:** `200 OK`
- **Response:**
```json
[
  {
    "_id": "64b0f90e5f1b2c3d4e5f6a7b",
    "title": "Clean my room and study",
    "completed": true,
    "createdAt": "2026-07-09T22:30:00.000Z",
    "updatedAt": "2026-07-09T22:40:00.000Z",
    "__v": 0
  }
]
```

### 7. Delete Task
- **Endpoint:** `DELETE http://localhost:5000/api/tasks/64b0f90e5f1b2c3d4e5f6a7b`
- **Status Code:** `200 OK`
- **Response:**
```json
{
  "message": "Task deleted"
}
```

### 8. Validation Testing (Error Case)
- **Endpoint:** `POST http://localhost:5000/api/tasks`
- **Body:**
```json
{
  "title": "Go"
}
```
- **Status Code:** `400 Bad Request`
- **Response:**
```json
{
  "message": "Task validation failed: title: Task title must be at least 3 characters"
}
```