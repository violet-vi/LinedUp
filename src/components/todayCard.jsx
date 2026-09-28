import TaskItem from './taskitem'

function TodayCard() {
  const tasks = [
    {
      id: 1,
      title: 'DSA Assignment',
      detail: 'Complete questions 3–4',
      type: 'assignment',
      duration: '1h',
      completed: false,
    },
    {
      id: 2,
      title: 'Physics',
      detail: 'Revise Unit 2',
      type: 'study',
      duration: '45m',
      completed: false,
    },
    {
      id: 3,
      title: 'Microsoft Internship',
      detail: 'Update project section of résumé',
      type: 'career',
      duration: '30m',
      completed: true,
    },
  ]

  return (
    <section className="today-card">
      <div className="card-heading">
        <div>
          <p className="section-label">TODAY</p>
          <h2>Your plan</h2>
        </div>

        <span className="total-time">2h 15m</span>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
          />
        ))}
      </div>
    </section>
  )
}

export default TodayCard