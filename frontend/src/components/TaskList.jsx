import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggle, onEdit, onDelete, loading }) {
  if (loading) {
    return <p className="empty-state">Loading tasks...</p>;
  }

  if (tasks.length === 0) {
    return <p className="empty-state">No tasks here. Add one above to get started.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}