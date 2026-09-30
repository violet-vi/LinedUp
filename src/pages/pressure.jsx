function getDaysLeft(deadline) {
  if (!deadline) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const due = new Date(
    `${deadline}T00:00:00`
  )

  return Math.ceil(
    (due - today) /
      (1000 * 60 * 60 * 24)
  )
}


function getRisk(commitment) {
  if (commitment.completed) {
    return 'done'
  }

  const daysLeft =
    getDaysLeft(commitment.deadline)

  if (daysLeft === null) {
    return 'normal'
  }

  if (daysLeft < 0) {
    return 'high'
  }

  if (
    daysLeft <= 1 &&
    commitment.progress < 80
  ) {
    return 'high'
  }

  if (
    daysLeft <= 3 &&
    commitment.progress < 50
  ) {
    return 'medium'
  }

  if (
    commitment.personalDifficulty >= 4 &&
    commitment.progress < 40
  ) {
    return 'medium'
  }

  return 'normal'
}


function Pressure({
  commitments = [],
}) {
  const active = commitments.filter(
    (commitment) => !commitment.completed
  )

  const withRisk = active.map(
    (commitment) => ({
      ...commitment,
      risk: getRisk(commitment),
    })
  )

  const needsAttention = withRisk.filter(
    (commitment) =>
      commitment.risk === 'high' ||
      commitment.risk === 'medium'
  )

  const highRiskCount = withRisk.filter(
    (commitment) =>
      commitment.risk === 'high'
  ).length


  return (
    <div className="pressure-page">

      <div className="pressure-heading">
        <p className="section-label">
          WORKLOAD
        </p>

        <h1>Pressure</h1>

        <p className="subtitle">
          See what's demanding your attention
          before it becomes a problem.
        </p>
      </div>


      <div className="pressure-summary">

        <div className="pressure-stat">
          <span>Active</span>
          <strong>{active.length}</strong>
        </div>

        <div className="pressure-stat">
          <span>Needs attention</span>
          <strong>
            {needsAttention.length}
          </strong>
        </div>

        <div className="pressure-stat">
          <span>Capacity</span>

          <strong>
            {highRiskCount >= 2
              ? 'Heavy'
              : needsAttention.length > 0
                ? 'Moderate'
                : 'Manageable'}
          </strong>
        </div>

      </div>


      <section className="pressure-list-card">

        <div className="pressure-card-heading">
          <p className="section-label">
            PRIORITIES
          </p>

          <h2>What needs attention</h2>
        </div>


        <div className="pressure-list">

          {withRisk.map((commitment) => {
            const daysLeft =
              getDaysLeft(commitment.deadline)

            return (
              <div
                className="pressure-item"
                key={commitment.id}
              >

                <div className="pressure-item-main">

                  <span
                    className={
                      `pressure-dot ${commitment.risk}`
                    }
                  />

                  <div>
                    <strong>
                      {commitment.title}
                    </strong>

                    <span>
                      {daysLeft === null
                        ? 'No deadline'
                        : daysLeft < 0
                          ? 'Overdue'
                          : daysLeft === 0
                            ? 'Due today'
                            : `${daysLeft} days left`}
                    </span>
                  </div>

                </div>


                <div className="pressure-progress">

                  <div>
                    <span>
                      {commitment.risk === 'high'
                        ? 'High pressure'
                        : commitment.risk === 'medium'
                          ? 'Needs attention'
                          : 'On track'}
                    </span>

                    <strong>
                      {commitment.progress || 0}%
                    </strong>
                  </div>

                  <div className="mini-progress">
                    <span
                      style={{
                        width:
                          `${commitment.progress || 0}%`,
                      }}
                    />
                  </div>

                </div>

              </div>
            )
          })}

        </div>

      </section>

    </div>
  )
}

export default Pressure