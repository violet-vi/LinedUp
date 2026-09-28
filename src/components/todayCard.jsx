import TaskItem from './taskitem'

function TodayCard({ onOpenCommitment }) {
  const commitments = [
    {
      id: 1,
      title: 'DSA Assignment',
      detail: 'Questions 3–4 · 1h scheduled today',
      type: 'assignment',
      progress: 68,
      due: 'Due Sep 30',
    },
    {
      id: 2,
      title: 'Physics Midterm',
      detail: 'Unit 2 · 45m scheduled today',
      type: 'study',
      progress: 32,
      due: '3 days left',
    },
    {
      id: 3,
      title: 'Microsoft Internship',
      detail: 'Résumé · 30m scheduled today',
      type: 'career',
      progress: 25,
      due: 'Due Oct 3',
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
        {commitments.map((commitment) => (
          <TaskItem
            key={commitment.id}
            task={commitment}
            onOpen={() => onOpenCommitment(commitment.id)}
          />
        ))}
      </div>
    </section>
  )
}

export default TodayCard