import { useState, useEffect } from 'react';

const EMPTY = { title: '', description: '', due_date: '' };

// datetime-local inputs need "YYYY-MM-DDTHH:mm" in local time, not an ISO string.
function toDatetimeLocal(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setValues({
        title: editingTask.title,
        description: editingTask.description || '',
        due_date: toDatetimeLocal(editingTask.due_date),
      });
    } else {
      setValues(EMPTY);
    }
    setError('');
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!values.title.trim()) {
      setError('Title is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        due_date: values.due_date ? new Date(values.due_date).toISOString() : null,
      };
      await onSubmit(payload);
      if (!editingTask) setValues(EMPTY);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? 'Edit Task' : 'Add a Task'}</h2>

      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        placeholder="e.g. Finish assignment"
        value={values.title}
        onChange={handleChange}
        maxLength={150}
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        placeholder="Optional details..."
        value={values.description}
        onChange={handleChange}
        rows={3}
        maxLength={2000}
      />

      <label htmlFor="due_date">Due date &amp; time</label>
      <input
        id="due_date"
        name="due_date"
        type="datetime-local"
        value={values.due_date}
        onChange={handleChange}
      />

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : editingTask ? 'Save Changes' : 'Add Task'}
        </button>
        {editingTask && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}