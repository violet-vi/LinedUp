function IntelligencePanel() {
  return (
    <aside className="intelligence-panel">
      <div>
        <p className="section-label">WEEK AHEAD</p>
        <h2>Thursday looks heavy.</h2>
        <p className="panel-description">
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

      <div className="attention-section">
        <p className="section-label">NEEDS ATTENTION</p>

        <div className="attention-item">
          <span className="attention-dot study" />

          <div>
            <strong>Physics midterm</strong>
            <p>32% prepared · 3 days left</p>
          </div>
        </div>

        <div className="attention-item">
          <span className="attention-dot career" />

          <div>
            <strong>Microsoft Internship</strong>
            <p>Not started · 5 days left</p>
          </div>
        </div>
      </div>

      <div className="suggestion">
        <p className="section-label">LINEDUP SUGGESTS</p>

        <strong>Move 45m of Physics to Tuesday.</strong>

        <p>
          That keeps Thursday within your available capacity.
        </p>

        <button>Rebalance week</button>
      </div>
    </aside>
  )
}

export default IntelligencePanel