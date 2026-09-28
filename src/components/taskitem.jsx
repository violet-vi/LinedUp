function TaskItem({ task, onOpen }) {
  return (
    <button
      className="task-item commitment-row"
      onClick={onOpen}
    >
      <div className="task-info">
        <p className="task-title">
          {task.title}
        </p>

        <p className="task-detail">
          {task.detail}
        </p>
      </div>

      <span className={`task-type ${task.type}`}>
        {task.type}
      </span>

      <div className="task-progress">
        <strong>{task.progress}%</strong>
        <span>{task.due}</span>
      </div>

      <span className="row-arrow">→</span>
    </button>
  )
}

export default TaskItem