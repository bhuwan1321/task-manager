import { useState, useEffect, useMemo } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from './api';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [banner, setBanner] = useState(null); // { type: 'error' | 'success', message }

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setBanner({ type: 'error', message: err.message || 'Failed to load tasks.' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(() => setBanner(null), 3000);
    return () => clearTimeout(timer);
  }, [banner]);

  const visibleTasks = useMemo(() => {
    if (filter === 'completed') return tasks.filter((t) => t.completed);
    if (filter === 'pending') return tasks.filter((t) => !t.completed);
    return tasks;
  }, [tasks, filter]);

  const handleAddOrUpdate = async (values) => {
    if (editingTask) {
      const updated = await updateTask(editingTask.id, values);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditingTask(null);
      setBanner({ type: 'success', message: 'Task updated.' });
    } else {
      const created = await createTask(values);
      setTasks((prev) => [created, ...prev]);
      setBanner({ type: 'success', message: 'Task added.' });
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setBanner({ type: 'error', message: err.message || 'Failed to update task.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (editingTask?.id === id) setEditingTask(null);
      setBanner({ type: 'success', message: 'Task deleted.' });
    } catch (err) {
      setBanner({ type: 'error', message: err.message || 'Failed to delete task.' });
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p className="subtitle">Add, track, and organize your tasks.</p>
      </header>

      {banner && <div className={`banner banner-${banner.type}`}>{banner.message}</div>}

      <main className="app-main">
        <TaskStats tasks={tasks} />

        <TaskForm
          onSubmit={handleAddOrUpdate}
          editingTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        <section className="task-section">
          <div className="filter-bar">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`filter-btn ${filter === f.key ? 'active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <TaskList
            tasks={visibleTasks}
            loading={loading}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>Task Manager · React + Express + PostgreSQL</p>
      </footer>
    </div>
  );
}