# My MERN Stack Todo List Application (Assignment 8)

This is my task manager application built using React (Vite) on the frontend and Node/Express/MongoDB on the backend. This project is set up as a monorepo so I can run both parts easily and deploy them.

---

## Log of My Development Steps & Roadblocks (How I Learned & Debugged)

I decided to document my development process step-by-step to track the issues I faced and show how I solved them.

### Step 1: Connecting Mongoose and Designing the Model
* **What I did:** I created a folder called `models` and defined `Task.js` using Mongoose.
* **The Problem:** In my first version, I wrote a super simple schema (just `title: String` and `completed: Boolean`). But when I tested it by adding documents online, I noticed I could create Tasks with blank text or titles like "a". That was buggy.
* **How I fixed it:** I modified the schema to add Mongoose built-in validations. I restricted the length using `minlength: 3` and `maxlength: 100` and enabled `trim: true` to prevent users from typing only spaces.

### Step 2: The CORS Nightmare
* **What I did:** I started the express backend on port 5000 and created a blank React project on port 5173. I tried fetching tasks using Axios.
* **The Problem:** The request failed in the browser console with a red message saying: **"Access to XMLHttpRequest at 'http://localhost:5000/api/tasks' has been blocked by CORS policy..."**.
* **How I fixed it:** I didn't know what this meant, so I looked it up on stackoverflow. Since the frontend port (5173) is different from the server port (5000), the browser blocks it for safety. I installed the `cors` middleware npm package on my Express server, imported it, and set it up to accept connections from localhost:5173.
  ```javascript
  // backend/server.js
  const cors = require("cors");
  app.use(cors({ origin: "http://localhost:5173" }));
  ```

### Step 3: Mongoose Skipping Validations on Edits
* **What I did:** I wrote the `updateTask` function inside `taskController.js` and went into Postman to test `PUT /api/tasks/:id`.
* **The Problem:** When creating tasks, my titles were correctly blocked if they were shorter than 3 letters. However, inside `PUT` (edit task), if I sent `{"title": ""}` it completely allowed it! The database updated to a blank title.
* **How I fixed it:** I searched online for why findByIdAndUpdate ignores schema rules. It turns out Mongoose does **not** evaluate schema rules on updates by default to keep operations fast. I had to explicitly enable validation on update by passing `{ runValidators: true }` in the options block:
  ```javascript
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true } // Fixed here!
  );
  ```

### Step 4: Search Filter Matches
* **What I did:** I added a search route on `/api/tasks/search?q=XYZ` to filter task names.
* **The Problem:** When I tried `Task.find({ title: query })`, it returned results only if the search was an exact match. E.g. searching "milk" did not return "Buy cold milk". It was case-sensitive too.
* **How I fixed it:** I searched how to run partial matches in Mongo. I replaced the query with Mongoose regex helper and mapped the `i` (ignore case) flag.
  ```javascript
  const tasks = await Task.find({
    title: { $regex: query.trim(), $options: "i" }
  });
  ```

### Step 5: Synced UI States inside React
* **What I did:** In `App.jsx`, I loaded the tasks and added delete/toggle buttons.
* **The Problem:** Originally, to avoid calling the API repeatedly (to save bandwidth), I tried to edit the local React tasks array directly using client-side `.filter()` and `.map()`. So when a task was deleted, I just filtered it out of state. However, it got very buggy when I deleted multiple items, and the list sorting would fall out of sync with what was stored in Atlas.
* **How I fixed it:** I updated the handlers (`handleDelete`, `handleToggle`, etc.) so that they await the async Axios calls to complete first, and then run `await loadTasks()` to fetch the fresh, sorted list straight from MongoDB. It's much cleaner and guarantees the UI matches the DB state.

### Step 6: Axios Error Parsing
* **What I did:** I set up React to show errors in an alert/page alert if you typed a short title.
* **The Problem:** The error box kept printing `[object Object]` or `Request failed with 400` instead of the validation message ("Task title must be at least 3 characters").
* **How I fixed it:** I ran `console.log(err)` inside catch blocks and inspected the object. I found out Axios encapsulates backend JSON data inside `err.response.data.message`. So I wrote a helper function `setErrorMessage` to parse it safely.

---

## Folder Structure

Here is how the project files are organized:
```text
A8_new/
  ├── vercel.json          # Vercel setup
  ├── package.json         # Root scripts (install-all, starts both)
  ├── backend/
  │     ├── server.js      # Server launch script
  │     ├── controllers/   # taskController.js (CRUD controllers)
  │     ├── models/        # Task.js (Schemas with validations)
  │     └── routes/        # end points
  └── frontend/
        ├── src/
        │     ├── App.jsx  # Main App UI & state logic
        │     ├── components/
        │     └── services/taskApi.js  # Axios calls
```

---

## Running the Application Locally

### 1. Install all dependencies
I added a double install script to install dependencies for both root, frontend, and backend packages in one command. Run this at the root folder:
```bash
npm run install-all
```

### 2. Add dotenv variables
Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
```

### 3. Spin it up
Run root command to start backend:
```bash
npm start
```
Go to `frontend/` directory and run React:
```bash
cd frontend
npm run dev
```

---

## Deployment (Vercel)

I deployed the app to Vercel as a single app.
* **Vercel Settings:** When importing, Vercel attempted to set the project preset to "Services" because of the monorepo folder layout. I had to manually edit the **Application Preset** setting to **Other** so it can read `vercel.json` from root directory.
* **Env variable:** Added `MONGO_URI` to Vercel page dashboard settings.