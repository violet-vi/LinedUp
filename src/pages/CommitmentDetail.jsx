import { useState } from 'react'

function CommitmentDetail({ onBack }) {
  const [aiEnabled, setAiEnabled] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [selectedCommitment, setSelectedCommitment] =
  useState(null)


  const commitment = {
    title: 'Physics Midterm',
    type: 'Exam',

    deadline: 'October 1',
    studentDifficulty: 'Hard',
    aiDifficulty: 'Medium–High',

    estimatedMinutes: 390,
    completedMinutes: 125,

    preferredTime: 'Evening',

    sessions: [
      {
        id: 1,
        title: 'Unit 1 — Mechanics',
        date: 'Sep 26',
        time: '6:00–6:45 PM',
        estimatedMinutes: 45,
        completedMinutes: 45,
      },
      {
        id: 2,
        title: 'Unit 2 — Waves',
        date: 'Today',
        time: '6:30–7:30 PM',
        estimatedMinutes: 60,
        completedMinutes: 42,
      },
      {
        id: 3,
        title: 'Unit 3 — Optics',
        date: 'Sep 29',
        time: '7:00–8:15 PM',
        estimatedMinutes: 75,
        completedMinutes: 0,
      },
      {
        id: 4,
        title: 'Practice questions',
        date: 'Sep 30',
        time: '5:30–6:30 PM',
        estimatedMinutes: 60,
        completedMinutes: 0,
      },
      {
        id: 5,
        title: 'Final revision',
        date: 'Oct 1',
        time: '7:30–8:00 AM',
        estimatedMinutes: 30,
        completedMinutes: 0,
      },
    ],
  }

  const progress = Math.round(
    (commitment.completedMinutes /
      commitment.estimatedMinutes) *
      100
  )

  const remainingMinutes =
    commitment.estimatedMinutes -
    commitment.completedMinutes

  const remainingHours =
    Math.floor(remainingMinutes / 60)

  const remainingMins =
    remainingMinutes % 60

  return (
    <div className="commitment-detail">

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to today
      </button>

      <header className="commitment-header">
        <div>
          <span className="commitment-type">
            {commitment.type}
          </span>

          <h1>{commitment.title}</h1>

          <p>
            Due {commitment.deadline}
          </p>
        </div>

        <button
          className={
            completed
              ? 'complete-button completed'
              : 'complete-button'
          }
          onClick={() => setCompleted(!completed)}
        >
          {completed ? 'Completed ✓' : 'Mark complete'}
        </button>
      </header>

      <div className="commitment-stats">

        <div>
          <span>Progress</span>
          <strong>{completed ? 100 : progress}%</strong>
        </div>

        <div>
          <span>Remaining</span>
          <strong>
            {completed
              ? 'Done'
              : `${remainingHours}h ${remainingMins}m`}
          </strong>
        </div>

        <div>
          <span>Your difficulty</span>
          <strong>
            {commitment.studentDifficulty}
          </strong>
        </div>

        <div>
          <span>AI complexity</span>
          <strong>
            {aiEnabled
              ? commitment.aiDifficulty
              : 'Off'}
          </strong>
        </div>

        <div>
          <span>Best time</span>
          <strong>
            {commitment.preferredTime}
          </strong>
        </div>

      </div>

      <div className="detail-grid">

        <section className="work-plan">
          <div className="detail-section-heading">
            <div>
              <p className="section-label">
                WORK PLAN
              </p>

              <h2>Broken down across your week</h2>
            </div>

            <span>
              {commitment.sessions.length} sessions
            </span>
          </div>

          <div className="session-list">
            {commitment.sessions.map((session) => {
              const sessionProgress = Math.round(
                (session.completedMinutes /
                  session.estimatedMinutes) *
                  100
              )

              return (
                <div
                  className="session-item"
                  key={session.id}
                >
                  <div className="session-date">
                    <strong>{session.date}</strong>
                    <span>{session.time}</span>
                  </div>

                  <div className="session-main">
                    <strong>{session.title}</strong>

                    <div className="session-progress-track">
                      <div
                        className="session-progress-fill"
                        style={{
                          width: `${sessionProgress}%`,
                        }}
                      />
                    </div>

                    <span>
                      {session.completedMinutes}
                      {' / '}
                      {session.estimatedMinutes} min
                    </span>
                  </div>

                  <strong className="session-percent">
                    {sessionProgress}%
                  </strong>
                </div>
              )
            })}
          </div>
        </section>

        <aside className="analysis-card">

          <div className="analysis-heading">
            <div>
              <p className="section-label">
                LINEDUP ANALYSIS
              </p>

              <h2>Planning analysis</h2>
            </div>

            <button
              className={`toggle ${aiEnabled ? 'on' : ''}`}
              onClick={() => setAiEnabled(!aiEnabled)}
              aria-pressed={aiEnabled}
            >
              <span />
            </button>
          </div>

          {aiEnabled ? (
            <>
              <div className="analysis-result">
                <span>AI complexity</span>
                <strong>Medium–High</strong>
              </div>

              <div className="analysis-result">
                <span>Estimated effort</span>
                <strong>6–7 hours</strong>
              </div>

              <div className="analysis-result">
                <span>Deadline risk</span>
                <strong>Moderate</strong>
              </div>

              <div className="analysis-copy">
                <p>
                  You're slightly behind the
                  original plan.
                </p>

                <ul>
                  <li>
                    Unit 2 is taking longer than
                    estimated.
                  </li>

                  <li>
                    Tuesday has the highest
                    workload pressure.
                  </li>

                  <li>
                    Two uninterrupted evening
                    sessions remain available.
                  </li>
                </ul>
              </div>

              <div className="analysis-suggestion">
                <span>SUGGESTION</span>

                <strong>
                  Move 30m of Optics to tonight.
                </strong>

                <p>
                  This reduces tomorrow's workload
                  without affecting your protected
                  time.
                </p>

                <button>
                  Apply suggestion
                </button>
              </div>
            </>
          ) : (
            <div className="analysis-off">
              <strong>AI analysis is off.</strong>

              <p>
                LinedUp will use your own estimates,
                progress and availability for this
                commitment.
              </p>
            </div>
          )}

        </aside>

      </div>
    </div>
  )
}

export default CommitmentDetail