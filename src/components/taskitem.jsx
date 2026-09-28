function TaskItem({ task, onToggle }) {
  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />

      <div className="task-info">
        <p className={`task-title ${task.completed ? 'completed' : ''}`}>
          {task.title}
        </p>

        <p className="task-detail">
          {task.detail}
        </p>
      </div>

      <span className={`task-type ${task.type}`}>
        {task.type}
      </span>

      <span className="task-duration">
        {task.duration}
      </span>
    </div>
  )
}

export default TaskItem