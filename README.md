# 📝 Task Manager

A full-stack task management web application built with **React, Node.js, Express, and PostgreSQL**.

Create, edit, complete, filter, and delete tasks while keeping everything persisted in a real PostgreSQL database. The app also includes due dates, overdue detection, and a statistics dashboard with completion charts.

---

## ✨ Features

* ✅ Create, edit, and delete tasks
* 📝 Add task titles and descriptions
* 📅 Set optional due dates and times
* 🔄 Toggle tasks between pending and completed
* 🔍 Filter tasks by **All / Pending / Completed**
* 🚨 Automatically detect overdue tasks
* 📊 View task completion statistics
* 📈 Completion donut chart
* 📅 7-day completed-task activity chart
* 🗄️ PostgreSQL database persistence
* 🔐 Server-side and client-side input validation
* ⚠️ User-friendly error handling
* 🌐 RESTful API architecture

---

## 🛠️ Tech Stack

### Frontend

* **React 19** — UI development
* **Vite** — development server and build tool
* **Recharts** — completion and activity charts
* **Fetch API** — backend communication
* **CSS** — custom application styling

### Backend

* **Node.js** — JavaScript runtime
* **Express.js** — REST API server
* **PostgreSQL** — relational database
* **pg (node-postgres)** — PostgreSQL connection pooling and queries
* **cors** — cross-origin request handling
* **dotenv** — environment configuration

---

## 📁 Project Structure

```text
task-manager/
│
├── 📂 backend/
│   ├── 📄 db.js
│   │   └── PostgreSQL connection pool & database schema initialization
│   │
│   ├── 📄 server.js
│   │   └── Express application entry point
│   │
│   ├── 📂 routes/
│   │   └── 📄 tasks.js
│   │       └── Task REST API routes, CRUD operations & validation
│   │
│   └── 📄 package.json
│       └── Backend dependencies & scripts
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📄 api.js
│   │   │   └── Fetch wrapper for backend API requests
│   │   │
│   │   ├── 📄 App.jsx
│   │   │   └── Main application state & layout
│   │   │
│   │   ├── 📂 components/
│   │   │   ├── 📄 TaskForm.jsx
│   │   │   │   └── Add/edit task form
│   │   │   │
│   │   │   ├── 📄 TaskList.jsx
│   │   │   │   └── Task list, loading & empty states
│   │   │   │
│   │   │   ├── 📄 TaskItem.jsx
│   │   │   │   └── Individual task & overdue status
│   │   │   │
│   │   │   └── 📄 TaskStats.jsx
│   │   │       └── Statistics cards & completion charts
│   │   │
│   │   └── 📄 index.css
│   │       └── Application styling
│   │
│   ├── 📄 index.html
│   │   └── Frontend HTML entry point
│   │
│   └── 📄 package.json
│       └── Frontend dependencies & scripts
│
└── 📄 README.md
    └── Project documentation
```

### 🏗️ Application Architecture

```text
┌──────────────────────────┐
│        React UI          │
│      React + Vite        │
└────────────┬─────────────┘
             │
             │ REST API
             ▼
┌──────────────────────────┐
│       Express API        │
│    Node.js + Express     │
└────────────┬─────────────┘
             │
             │ SQL / pg
             ▼
┌──────────────────────────┐
│       PostgreSQL         │
│       Task Database      │
└──────────────────────────┘
```

---

## 🌐 REST API

**Base URL**

```text
http://localhost:5000/api
```

| Method   | Endpoint            | Description              |
| -------- | ------------------- | ------------------------ |
| `GET`    | `/tasks`            | Get all tasks            |
| `GET`    | `/tasks/:id`        | Get a single task        |
| `POST`   | `/tasks`            | Create a new task        |
| `PUT`    | `/tasks/:id`        | Update an existing task  |
| `PATCH`  | `/tasks/:id/toggle` | Toggle completed/pending |
| `DELETE` | `/tasks/:id`        | Delete a task            |

### Filtering

Tasks can be filtered using the `status` query parameter:

```text
GET /tasks?status=completed
GET /tasks?status=pending
```

### Create a Task

```json
{
  "title": "Complete project",
  "description": "Finish the task manager application",
  "due_date": "2026-09-15T18:00:00Z"
}
```

The `title` field is required.

`description` and `due_date` are optional.

### Validation

All write endpoints validate incoming data.

Invalid requests return:

```text
400 Bad Request
```

with an `errors` array.

Requests for a task that does not exist return:

```text
404 Not Found
```

---

## 🚀 Running Locally

### Prerequisites

Make sure you have:

* **Node.js 18+**
* **npm**
* **PostgreSQL**
* **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/bhuwan1321/task-manager.git
cd task-manager
```

---

### 2. Install PostgreSQL

#### macOS — Homebrew

```bash
brew install postgresql@16
brew services start postgresql@16
```

Homebrew typically creates a PostgreSQL role matching your macOS username, allowing local connections without a password.

#### Linux / Other Platforms

Install PostgreSQL using your operating system's package manager and make sure the PostgreSQL service is running.

---

### 3. Create the Database

```bash
createdb taskmanager
```

Or using `psql`:

```sql
CREATE DATABASE taskmanager;
```

---

### 4. Configure the Backend

Navigate to the backend:

```bash
cd backend
```

Create your environment file:

```bash
cp .env.example .env
```

Update `.env` according to your PostgreSQL configuration.

For a typical local setup:

```env
PGUSER=your_username
PGHOST=localhost
PGPORT=5432
PGDATABASE=taskmanager
PGPASSWORD=
PORT=5000
```

> **Note:** If `DATABASE_URL` is present, it takes priority over the individual PostgreSQL configuration fields.

---

### 5. Install Backend Dependencies

```bash
npm install
```

Start the backend:

```bash
npm start
```

The API will run at:

```text
http://localhost:5000
```

The `tasks` table is created automatically when the server starts if it doesn't already exist.

No manual table creation is required.

---

### 6. Start the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will normally start the application at:

```text
http://localhost:5173
```

---

### 7. Open the Application

Open your browser and visit:

```text
http://localhost:5173
```

You can now:

* Create tasks
* Add descriptions
* Set due dates
* Edit tasks
* Mark tasks as completed
* Filter tasks
* Delete tasks
* View completion statistics
* Track overdue tasks

All changes are persisted through the REST API and PostgreSQL database.

---

## 📊 Dashboard

The statistics dashboard provides an overview of your tasks, including:

| Statistic   | Description                       |
| ----------- | --------------------------------- |
| 📋 Total    | Total number of tasks             |
| ✅ Completed | Number of completed tasks         |
| ⏳ Pending   | Number of pending tasks           |
| 🚨 Overdue  | Pending tasks past their due date |

The dashboard also includes:

* **Completion donut chart** — completed vs pending tasks
* **7-day activity chart** — tasks completed during the last seven days

Charts are powered by **Recharts**.

---

## 🔒 Validation & Error Handling

The application validates user input on both the frontend and backend.

### Client-side

The task form prevents invalid submissions such as an empty title.

### Server-side

The REST API validates:

* Required fields
* Empty titles
* Input types
* Field length limits
* Due-date formatting
* Task IDs
* Task existence

API errors are returned with appropriate HTTP status codes and displayed in the frontend through a dismissible error banner.

---

## 🧩 Design Principles

The project follows a simple separation-of-concerns architecture:

```text
Frontend
   │
   ├── UI Components
   ├── Application State
   └── API Communication
          │
          ▼
Backend
   │
   ├── Express Server
   ├── REST Routes
   └── Database Layer
          │
          ▼
PostgreSQL
```

Each part has a focused responsibility:

* `routes/tasks.js` → API endpoints and request validation
* `db.js` → PostgreSQL connection and database operations
* `App.jsx` → application state and layout
* `components/` → reusable UI components
* `api.js` → frontend/backend communication

---

## 📝 Notes

* Tasks are persisted in PostgreSQL rather than browser storage.
* Due dates are stored as ISO 8601 datetime values.
* Pending tasks past their due date are automatically marked as overdue.
* The database schema is initialized automatically by the backend.
* The frontend communicates with the backend exclusively through REST API endpoints.
* Environment variables are used for local configuration.
* `.env` files should not be committed to the repository.

---

## 👨‍💻 Author

**Bhuwan Rasala**

GitHub: [@bhuwan1321](https://github.com/bhuwan1321)

---

## ⭐ Future Improvements

Potential additions for future versions:

* 🔐 User authentication
* 👥 Multiple user accounts
* 🏷️ Task categories and tags
* 🔎 Search functionality
* 🔔 Due-date reminders
* 📱 Improved mobile experience
* 🌙 Dark mode
* ☁️ Cloud deployment
* 📊 More advanced analytics

---

⭐ If you find this project useful, consider giving it a star!
