# Task Space — Premium MERN Task Dashboard

Task Space is a production-ready, feature-rich task management dashboard built on the MERN stack (MongoDB, Express, React, Node.js). Featuring a modern glassmorphism dark mode aesthetic, it provides users with real-time statistics tracking, task priority categorizations, custom tags, and due date schedules.

Deploy Link: https://to-do-list-csrm.vercel.app/

---

## Features

- **Glassmorphism Dark UI:** Styled with a sleek fluid dark theme, custom glows, dynamic card scaling on hover, and smooth status transitions.
- **Completion Statistics Dashboard:** Interactive progress bar calculating completed metrics and percentages in real time.
- **Multi-triage Priority Levels:** Tag tasks instantly as `Low`, `Medium`, or `High` priority with automated color coding.
- **Category Classification:** Organize goals into tags like `General`, `Work`, `Personal`, `Shopping`, or `Health`.
- **Target Schedules (Due Dates):** Schedule calendar-bound milestones displayed as integrated UI badges.
- **Smart Filtering & Search:** Quick-toggle status tabs (`All`, `Active`, `Completed`) coupled with partial database-level keyword searching.
- **Data Integrity Constraints:** Strict backend-enforced string sanitization and schema validators maintaining title bounds between 3 and 100 characters.

---

## Folder Architecture

```text
A8_new/
  ├── vercel.json          # Root Vercel routing orchestration
  ├── package.json         # Workspace automation scripts
  ├── backend/
  │     ├── server.js      # Express application settings
  │     ├── models/        # Task.js (Mongoose Schema definition)
  │     ├── controllers/   # taskController.js (CRUD controllers)
  │     └── routes/        # Express API client routes
  └── frontend/
        ├── package.json   # React/Vite bundler configuration
        ├── src/
        │     ├── App.jsx  # Primary state management and layout
        │     ├── App.css  # Dark Glassmorphism CSS design system
        │     ├── components/
        │     │     ├── Header.jsx       # Analytics progress header
        │     │     ├── TaskInput.jsx    # Advanced metadata form controller
        │     │     ├── TaskItem.jsx     # Card item rendering/inline Editor
        │     │     └── TaskList.jsx     # Card catalog with empty status defaults
        │     └── services/
        │           └── taskApi.js       # Axios base client
```

---

## API Documentation

All resource requests are prefix-mapped to `/api/tasks`.

| Method | Endpoint | Description | Request Body Parameters |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Retrieves all tasks sorted newest first | None |
| **POST** | `/` | Inserts a new task | `{ title, completed, priority, category, dueDate }` |
| **PUT** | `/:id` | Replaces all fields of a specific task | `{ title, completed, priority, category, dueDate }` |
| **PATCH**| `/:id/status` | Toggles the completion status | `{ completed }` |
| **GET** | `/search?q=phrase` | Searches task titles using regex matching | None |
| **DELETE**| `/:id` | Purges task from database | None |

---

## Local Development Setup

To run both backend API services and frontend hot-reloads locally:

### 1. Install Workspace Dependencies
Execute the monorepo script inside the root directory:
```bash
npm run install-all
```

### 2. Configure Environment Configurations
Create a `.env` file within the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
```

### 3. Initiate Dev Servers
Start the backend Express daemon from the root folder:
```bash
npm start
```
Start the frontend Vite application:
```bash
cd frontend
npm run dev
```

---

## Vercel Deployment Configurations

The project includes an optimized monocore configuration (`vercel.json`) allowing for instant unified serverless builds on Vercel:
1. Link your repository in Vercel.
2. Override the default framework preset to **Other** to parse root builds.
3. Configure the `MONGO_URI` environment variable under Dashboard settings.
4. Deploy.