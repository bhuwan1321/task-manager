# Task Manager

A full-stack task management web app. Add tasks with a title, description, and optional due
date/time; view, edit, or delete them; mark them completed/pending; filter the list; and see a
small dashboard of completion stats — all backed by a real database through a REST API.

## Tech stack

**Frontend**
- React 19 + Vite
- Recharts — completion pie chart + 7-day completed-tasks bar chart
- Plain `fetch` for API calls (no extra HTTP library needed)
- Hand-written CSS (no UI framework)

**Backend**
- Node.js + Express — REST API
- PostgreSQL via `pg` (node-postgres) — connection pooling, parameterized queries
- `cors` for cross-origin requests from the frontend dev server
- `dotenv` for local environment configuration

## Project structure


task-manager/
├── backend/
│   ├── db.js              # PostgreSQL pool + schema init (tasks table, due_date column)
│   ├── server.js          # Express app entry point
│   ├── routes/
│   │   └── tasks.js       # REST API routes for tasks (CRUD + validation)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api.js                  # fetch wrapper for the backend API
    │   ├── App.jsx                 # top-level app state + layout
    │   ├── components/
    │   │   ├── TaskForm.jsx        # add/edit form (title, description, due date)
    │   │   ├── TaskList.jsx        # list wrapper (loading/empty states)
    │   │   ├── TaskItem.jsx        # single task row (shows due date, overdue flag)
    │   │   └── TaskStats.jsx       # stat cards + completion charts
    │   └── index.css               # styling
    ├── index.html
    └── package.json


## REST API

Base URL: `http://localhost:5000/api`

| Method | Endpoint             | Description                          |
|--------|-----------------------|---------------------------------------|
| GET    | `/tasks`               | List all tasks (`?status=completed\|pending` to filter) |
| GET    | `/tasks/:id`            | Get a single task                     |
| POST   | `/tasks`               | Create a task (`title` required; `description`, `due_date` optional) |
| PUT    | `/tasks/:id`            | Update a task's title/description/completed/due_date |
| PATCH  | `/tasks/:id/toggle`     | Flip a task between completed/pending |
| DELETE | `/tasks/:id`            | Delete a task                         |

`due_date` is an ISO 8601 datetime string (or `null`). All write endpoints validate input
(non-empty title, length limits, correct types, parseable due date) and return `400` with an
`errors` array on invalid input, and `404` for a missing task id.

## Running locally

You'll need Node.js 18+ and a running PostgreSQL server.

### 0. Install PostgreSQL (if you don't have it)

**macOS (Homebrew):**
\`\`\`bash
brew install postgresql@16
brew services start postgresql@16
\`\`\`
Homebrew creates a superuser role matching your Mac username (not `postgres`), with no password
needed for local connections — see step 2 below.

**Linux / other:** install via your package manager and make sure the service is running.

### 1. Create the database

\`\`\`bash
createdb taskmanager
# or, from psql:
# CREATE DATABASE taskmanager;
\`\`\`

### 2. Configure and start the backend

\`\`\`bash
cd backend
cp .env.example .env
\`\`\`

Edit `.env` to match your local Postgres setup:

- **Homebrew on macOS:** set `PGUSER` to your Mac username, delete/leave blank `PGPASSWORD`
  (no password needed locally), and comment out or remove the `DATABASE_URL` line (it takes
  priority over the individual fields if both are present).
- **Everything else:** the defaults (`postgres` / `postgres` / `5432`) usually work, or set a
  full `DATABASE_URL` instead — see the comments in `.env.example`.

\`\`\`bash
npm install
npm start
\`\`\`

This runs the API on **http://localhost:5000**. The `tasks` table (including the `due_date`
column) is created automatically on startup if it doesn't already exist — no manual schema setup
needed beyond creating the database itself.

If port 5000 is already taken on your machine (common on macOS, since AirPlay Receiver uses it),
either turn off AirPlay Receiver (System Settings → General → AirDrop & Handoff) or set a
different port in `.env` (`PORT=5001`) and update `VITE_API_URL` below to match.

### 3. Start the frontend

In a separate terminal:

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

This runs the app on **http://localhost:5173** (Vite's default port) and proxies API calls to
`http://localhost:5000/api` by default.

If your backend runs on a different URL, copy `frontend/.env.example` to `frontend/.env` and
set `VITE_API_URL` accordingly.

### 4. Open the app

Visit **http://localhost:5173** in your browser. Add a task with an optional due date, mark it
complete, edit it, filter by status, or delete it — every action is persisted to the PostgreSQL
database through the REST API, and the stats dashboard at the top updates live.

## Features

- **CRUD + status toggle** for tasks, each with title, description, and optional due date/time
- **Filtering** — All / Pending / Completed
- **Overdue detection** — pending tasks past their due date are flagged in red in the list and
  counted in the stats dashboard
- **Stats dashboard** — total/completed/pending/overdue counts, a completion-split donut chart,
  and a bar chart of tasks completed per day over the last 7 days (both via Recharts)

## Notes

- Input validation happens both client-side (form can't submit an empty title) and server-side
  (the API rejects bad payloads regardless of what sent them).
- Errors from the API (network issues, validation failures, 404s) surface as a dismissible
  banner in the UI rather than failing silently.
- The project structure separates concerns cleanly: `routes/` holds API logic, `db.js` isolates
  all database access, and the frontend's `components/` are small and single-purpose.