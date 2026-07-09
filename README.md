# MERN Task App

This is my task manager app built using React, Express, Node.js, and MongoDB. You can use it to create tasks, view them, search by title, edit titles, check them off as complete, and delete them.

---

## Features

- Add new tasks
- View the task list
- Toggle task status (complete/incomplete)
- Edit a task title (inline edit form)
- Delete tasks
- Search tasks by title
- Mongoose validation on task title (minimum 3 characters, maximum 100 characters)

---

## Folder Structure

```text
A8_new/
  ├── package.json         # Root package file with scripts
  ├── backend/
  │     ├── controllers/   # Route handlers
  │     ├── models/        # Task schema
  │     ├── routes/        # Router configuration
  │     └── server.js      # Main Express server file
  └── frontend/
        ├── dist/          # Compiled frontend build
        ├── src/           # React frontend source files
        │     ├── components/
        │     ├── services/taskApi.js
        │     ├── App.jsx
        │     └── App.css
        └── package.json   # React/Vite package file
```

---

## Setup Instructions

### 1. Install Dependencies
Run this in the main folder to install all packages for frontend and backend:
```bash
npm run install-all
```

### 2. Add Environment Variables
Create a file named `.env` in the `backend/` folder and add:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
```

### 3. Run Locally
Start the server in the main folder:
```bash
npm start
```
This runs the backend on `http://localhost:5000`.

To run the frontend with hot reload:
1. Go into the frontend folder: `cd frontend`
2. Run: `npm run dev`
This runs the frontend on `http://localhost:5173`.

---

## Postman API Testing Log

Here is the log of my API testing using Postman. I tested all routes against `http://localhost:5000`.

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