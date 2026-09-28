import { useState } from 'react'
import TaskItem from './taskitem'

function TodayCard() {
  const [tasks, setTasks] = useState([
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
  ])

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }
  const completedCount = tasks.filter((task) => task.completed).length

  const progress = Math.round(
    (completedCount / tasks.length) * 100
  )

  return (
    <section className="today-card">
      <div className="card-heading">
        <div>
          <p className="section-label">TODAY</p>
          <h2>Your plan</h2>
        </div>

        <span className="total-time">2h 15m</span>
      </div>
      <div className="today-progress">

      <div className="progress-info">
          <span>Daily progress</span>
          <strong>{progress}%</strong>
        </div>    
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
          />
        ))}
      </div>
    </section>
  )
}

export default TodayCard