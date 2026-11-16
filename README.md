<h1 align="center">Task Manager</h1>

<p align="center"><b>A full-stack task manager with due dates, overdue detection and a statistics dashboard.</b><br>
React front end, Express REST API and PostgreSQL storage.<br>
Runs locally. No accounts or cloud services required.</p>

<p align="center">
  <a href="#quick-start"><b>Quick start</b></a> ·
  <a href="#what-you-can-do"><b>What you can do</b></a> ·
  <a href="#rest-api"><b>REST API</b></a> ·
  <a href="#development"><b>Development</b></a>
</p>

Task Manager pairs a **React and Vite** front end with a small **Express** API. Tasks live in a real
**PostgreSQL** database, so they persist across restarts and browsers. The backend creates its own table on first
start, so there is no manual schema step.

## What you can do

| Use it for | What you get |
|---|---|
| **Managing tasks** | Create, edit, complete, toggle and delete tasks with a title and optional description |
| **Deadlines** | Optional due date and time; pending tasks past their deadline are marked overdue |
| **Filtering** | View All, Pending or Completed tasks |
| **Statistics** | Total, completed, pending and overdue counts, a completion donut chart and a 7-day completed-task chart |
| **Safe input** | Validation on both the form and the server, with errors shown in a dismissible banner |

## Quick start

You need **Node.js 18+**, **npm** and **PostgreSQL**. Docker is the quickest way to get a database.

### 1. Start PostgreSQL

With Docker:

```bash
docker run -d --name taskmanager-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=taskmanager -p 5432:5432 postgres:16-alpine
```

Or install PostgreSQL yourself and create the database:

```bash
createdb taskmanager
```

### 2. Start the API

```bash
git clone https://github.com/bhuwan1321/task-manager.git
cd task-manager/backend
cp .env.example .env
npm install
npm start
```

The default `.env.example` matches the Docker command above. If you use your own PostgreSQL, edit `.env`.
`DATABASE_URL` takes priority; otherwise the individual `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD` and
`PGDATABASE` values are used. The API listens on <http://localhost:5000>.

### 3. Start the front end

In a second terminal:

```bash
cd task-manager/frontend
cp .env.example .env
npm install
npm run dev
```

Open <http://localhost:5173>. The front end reads the API address from `VITE_API_URL`, which defaults to
`http://localhost:5000/api`.

## REST API

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Liveness check |
| `GET` | `/tasks` | List tasks; filter with `?status=completed` or `?status=pending` |
| `GET` | `/tasks/:id` | Get one task |
| `POST` | `/tasks` | Create a task |
| `PUT` | `/tasks/:id` | Update a task |
| `PATCH` | `/tasks/:id/toggle` | Toggle completed and pending |
| `DELETE` | `/tasks/:id` | Delete a task |

Create a task:

```json
{
  "title": "Complete project",
  "description": "Finish the task manager application",
  "due_date": "2026-09-15T18:00:00Z"
}
```

Only `title` is required. Invalid requests return `400` with an `errors` array. A task that does not exist returns `404`.

## Security and privacy

- Every query is parameterized, so user input is never concatenated into SQL.
- The server validates required fields, empty titles, input types, length limits, due-date format and task IDs.
- Tasks are stored only in your own PostgreSQL database. The app has no accounts, analytics or external calls.
- CORS is open so the front end can reach the API during local development. Restrict it before any public deployment.
- There is no authentication yet, so do not expose the API to the internet as it is.

## Project layout

```
backend/
  server.js            Express entry point and error handling
  db.js                PostgreSQL pool and automatic schema setup
  routes/tasks.js      REST routes and validation
frontend/
  src/App.jsx          State and layout
  src/api.js           Fetch wrapper for the API
  src/components/      TaskForm, TaskList, TaskItem, TaskStats
```

## Development

```bash
cd backend && npm run dev      # API with automatic restart (nodemon)
cd frontend && npm run lint    # oxlint
cd frontend && npm run build   # production build
```

Pending tasks past their due date are shown as overdue, and due dates are stored as ISO 8601 timestamps.
Do not commit `.env` files.
