import TaskItem from './taskitem'

function TodayCard({
  commitments,
  onOpenCommitment,
}) {

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