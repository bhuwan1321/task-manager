function formatDueDate(isoString) {
  if (!isoString) return null;
  const d = new Date(isoString);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const dueLabel = formatDueDate(task.due_date);
  const isOverdue = task.due_date && !task.completed && new Date(task.due_date) < new Date();

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" as ${task.completed ? 'pending' : 'completed'}`}
        />
        <div className="task-text">
          <p className="task-title">{task.title}</p>
          {task.description && <p className="task-description">{task.description}</p>}
          {dueLabel && (
            <p className={`task-due ${isOverdue ? 'task-due-overdue' : ''}`}>
              {isOverdue ? 'Overdue — was due' : 'Due'} {dueLabel}
            </p>
          )}
        </div>
      </div>
      <div className="task-actions">
        <span className={`status-badge ${task.completed ? 'status-completed' : 'status-pending'}`}>
          {task.completed ? 'Completed' : 'Pending'}
        </span>
        <button className="btn btn-small" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn-small btn-danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}