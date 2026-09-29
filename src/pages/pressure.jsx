function Pressure({ commitments = [] }) {
  const active = commitments.filter(
    (commitment) => !commitment.completed
  )

  const highPressure = active.filter(
    (commitment) =>
      commitment.personalDifficulty >= 4 ||
      commitment.progress < 30
  )

  return (
    <div className="pressure-page">

      <div className="pressure-heading">
        <div>
          <p className="section-label">WORKLOAD</p>
          <h1>Pressure</h1>
          <p className="subtitle">
            See what's demanding your attention before it becomes a problem.
          </p>
        </div>
      </div>

      <div className="pressure-summary">

        <div className="pressure-stat">
          <span>Active</span>
          <strong>{active.length}</strong>
        </div>

        <div className="pressure-stat">
          <span>Needs attention</span>
          <strong>{highPressure.length}</strong>
        </div>

        <div className="pressure-stat">
          <span>Capacity</span>
          <strong>
            {highPressure.length >= 3
              ? 'Heavy'
              : highPressure.length >= 1
                ? 'Moderate'
                : 'Manageable'}
          </strong>
        </div>

      </div>

      <section className="pressure-list-card">
        <div className="pressure-card-heading">
          <div>
            <p className="section-label">
              PRIORITIES
            </p>

            <h2>What needs attention</h2>
          </div>
        </div>

        <div className="pressure-list">

          {active.map((commitment) => (
            <div
              className="pressure-item"
              key={commitment.id}
            >
              <div className="pressure-item-main">

                <span
                  className={`pressure-dot ${
                    commitment.personalDifficulty >= 4
                      ? 'high'
                      : 'normal'
                  }`}
                />

                <div>
                  <strong>
                    {commitment.title}
                  </strong>

                  <span>
                    {commitment.due}
                  </span>
                </div>

              </div>

              <div className="pressure-progress">
                <div>
                  <span>Progress</span>
                  <strong>
                    {commitment.progress || 0}%
                  </strong>
                </div>

                <div className="mini-progress">
                  <span
                    style={{
                      width: `${commitment.progress || 0}%`,
                    }}
                  />
                </div>
              </div>

            </div>
          ))}

        </div>
      </section>

    </div>
  )
}

export default Pressure