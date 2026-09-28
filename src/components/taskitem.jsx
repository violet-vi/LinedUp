function TaskItem({ task }) {
  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        readOnly
      />

      <div className="task-info">
        <p className="task-title">{task.title}</p>
        <p className="task-detail">{task.detail}</p>
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