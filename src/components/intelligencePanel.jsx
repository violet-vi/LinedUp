function IntelligencePanel({
  commitments = [],
  sessions = [],
  events = [],
}) {
  const activeCommitments =
    commitments.filter(
      (commitment) => !commitment.completed
    )

  const attentionItems =
    activeCommitments
      .filter((commitment) => {
        if (!commitment.deadline) return false

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const deadline = new Date(
          `${commitment.deadline}T00:00:00`
        )

        const daysLeft = Math.ceil(
          (deadline - today) /
            (1000 * 60 * 60 * 24)
        )

        return (
          daysLeft <= 3 ||
          (commitment.progress || 0) < 30
        )
      })
      .slice(0, 3)

  return (
    <aside className="intelligence-panel">
      <div>
        <p className="section-label intelligence-label">
            WEEK AHEAD
          </p>
            
          <h2 className="intelligence-title">
            Thursday looks heavy.
          </h2>
            
          <p className="intelligence-description">
            You're currently planning more work than your available time.
          </p>
      </div>

      <div className="pressure-preview">
        <div>
          <span>M</span>
          <i className="pressure low" />
        </div>

        <div>
          <span>T</span>
          <i className="pressure medium" />
        </div>

        <div>
          <span>W</span>
          <i className="pressure medium" />
        </div>

        <div>
          <span>T</span>
          <i className="pressure high" />
        </div>

        <div>
          <span>F</span>
          <i className="pressure low" />
        </div>
      </div>

      <section className="attention-section">

        <p className="section-label">
          NEEDS ATTENTION
        </p>

        <div className="attention-list">
          {attentionItems.length === 0 ? (
            <p className="subtitle">
              Nothing urgent right now.
            </p>
          ) : (
            attentionItems.map((commitment) => (
              <div
                className="attention-item"
                key={commitment.id}
              >
                <strong>
                  {commitment.title}
                </strong>

                <span>
                  {commitment.progress || 0}% complete
                </span>
              </div>
            ))
          )}
        </div>

      </section>

    </aside>
  )
}

export default IntelligencePanel