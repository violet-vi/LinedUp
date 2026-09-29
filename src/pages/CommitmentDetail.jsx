import { useState } from 'react'

function formatDate(dateString) {
  if (!dateString) {
    return 'No deadline'
  }

  const date = new Date(`${dateString}T00:00:00`)

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(time) {
  if (!time) return ''

  const [hourString, minute] = time.split(':')
  const hour = Number(hourString)

  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour =
    hour % 12 === 0 ? 12 : hour % 12

  return `${displayHour}:${minute} ${period}`
}

function difficultyLabel(value) {
  const labels = {
    1: 'Very easy',
    2: 'Easy',
    3: 'Moderate',
    4: 'Hard',
    5: 'Very hard',
  }

  return labels[value] || 'Not set'
}

function CommitmentDetail({
  commitment,
  sessions = [],
  onBack,
  onUpdate,
  onDelete,
  onToggleComplete,
  onUpdateSession,
  onDeleteSession,
}) {
  
  const [aiEnabled, setAiEnabled] = useState(
    commitment?.aiEnabled ?? false
  )
  const [editing, setEditing] = useState(false)
  const [movingSession, setMovingSession] = useState(null)
  const [editForm, setEditForm] = useState({
    title: commitment?.title || '',
    deadline: commitment?.deadline || '',
    estimatedHours: commitment?.estimatedHours || '',
    personalDifficulty:
      commitment?.personalDifficulty || 3,
    preferredTime:
      commitment?.preferredTime || 'anytime',
    description: commitment?.description || '',
  })


  if (!commitment) {
    return (
      <div className="commitment-detail">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to today
        </button>

        <p>Commitment not found.</p>
      </div>
    )
  }

  const estimatedMinutes =
    Number(commitment.estimatedHours || 0) * 60

  const completedMinutes = sessions.reduce(
    (total, session) =>
      total + (session.completedMinutes || 0),
    0
  )

  const progress =
    estimatedMinutes > 0
      ? Math.min(
          100,
          Math.round(
            (completedMinutes / estimatedMinutes) * 100
          )
        )
      : commitment.progress || 0

  const remainingMinutes = Math.max(
    0,
    estimatedMinutes - completedMinutes
  )

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
            {commitment.deadline
              ? `Due ${formatDate(commitment.deadline)}`
              : 'No deadline'}
          </p>
        </div>
            
        <div className="commitment-actions">
            
          <button
            className="edit-button"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
            
          <button
            className={
              commitment.completed
                ? 'complete-button completed'
                : 'complete-button'
            }
            onClick={() =>
              onToggleComplete(commitment.id)
            }
          >
            {commitment.completed
              ? 'Completed ✓'
              : 'Mark complete'}
          </button>
            
        </div>
            
      </header>

      <div className="commitment-stats">

        <div>
          <span>Progress</span>
          <strong>
            {commitment.completed ? 100 : progress}%
          </strong>
        </div>

        <div>
          <span>Remaining</span>

          <strong>
            {commitment.completed
              ? 'Done'
              : estimatedMinutes
                ? `${remainingHours}h ${remainingMins}m`
                : 'Not estimated'}
          </strong>
        </div>

        <div>
          <span>Your difficulty</span>

          <strong>
            {difficultyLabel(
              commitment.personalDifficulty
            )}
          </strong>
        </div>

        <div>
          <span>AI complexity</span>

          <strong>
            {aiEnabled
              ? commitment.aiAnalysis?.complexity ||
                'Pending'
              : 'Off'}
          </strong>
        </div>

        <div>
          <span>Best time</span>

          <strong>
            {commitment.preferredTime || 'Anytime'}
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

              <h2>
                Broken down across your week
              </h2>
            </div>

            <span>
              {sessions.length}{' '}
              {sessions.length === 1
                ? 'session'
                : 'sessions'}
            </span>
          </div>

          <div className="session-list">

            {sessions.length === 0 && (
              <div className="analysis-off">
                <strong>
                  No sessions scheduled yet.
                </strong>

                <p>
                  Add an estimate and deadline so
                  LinedUp can build a work plan.
                </p>
              </div>
            )}

            {sessions.map((session) => {
              const sessionProgress =
                session.estimatedMinutes > 0
                  ? Math.round(
                      ((session.completedMinutes || 0) /
                        session.estimatedMinutes) *
                        100
                    )
                  : 0

              const sessionEndMinutes =
                session.durationMinutes || 0

              return (
                <div
                  className="session-item"
                  key={session.id}
                >

                  <div className="session-date">
                    <strong>
                      {formatDate(session.date)}
                    </strong>

                    <span>
                      {formatTime(session.start)}
                    </span>
                  </div>

                  <div className="session-main">
                    <strong>
                      {session.title}
                    </strong>

                    <div className="session-progress-track">
                      <div
                        className="session-progress-fill"
                        style={{
                          width: `${sessionProgress}%`,
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="session-move-button"
                      onClick={() =>
                        setMovingSession({
                          ...session,
                        })
                      }
                    >
                      Move
                    </button>

                    <span>
                      {session.completedMinutes || 0}
                      {' / '}
                      {session.estimatedMinutes ||
                        sessionEndMinutes}{' '}
                      min
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
              type="button"
              className={`toggle ${
                aiEnabled ? 'on' : ''
              }`}
              onClick={() =>
                setAiEnabled(!aiEnabled)
              }
              aria-pressed={aiEnabled}
            >
              <span />
            </button>
          </div>


          {aiEnabled ? (
            <>
              <div className="analysis-result">
                <span>AI complexity</span>

                <strong>
                  {commitment.aiAnalysis
                    ?.complexity || 'Pending'}
                </strong>
              </div>

              <div className="analysis-result">
                <span>Estimated effort</span>

                <strong>
                  {commitment.estimatedHours
                    ? `${commitment.estimatedHours} hours`
                    : 'Not estimated'}
                </strong>
              </div>

              <div className="analysis-result">
                <span>Deadline risk</span>

                <strong>
                  {commitment.aiAnalysis?.risk ||
                    'Calculating'}
                </strong>
              </div>

              <div className="analysis-copy">
                <p>
                  LinedUp is using your deadline,
                  difficulty, preferred work time and
                  availability to build this plan.
                </p>

                {commitment.description && (
                  <p>
                    {commitment.description}
                  </p>
                )}
              </div>

              <div className="analysis-suggestion">
                <span>SUGGESTION</span>

                <strong>
                  Keep your scheduled sessions up
                  to date.
                </strong>

                <p>
                  LinedUp will eventually rebalance
                  unfinished work around your
                  remaining availability.
                </p>
              </div>
            </>
          ) : (
            <div className="analysis-off">
              <strong>
                AI analysis is off.
              </strong>

              <p>
                LinedUp will use your own estimates,
                progress and availability for this
                commitment.
              </p>
            </div>
          )}

        </aside>

      </div>
      {movingSession && (
        <div className="modal-backdrop">
        
          <form
            className="add-modal"
            onSubmit={(event) => {
              event.preventDefault()
            
              onUpdateSession(
                movingSession.id,
                {
                  date: movingSession.date,
                  start: movingSession.start,
                }
              )
            
              setMovingSession(null)
            }}
          >
          
            <div className="modal-header">
              <div>
                <p className="section-label">
                  RESCHEDULE
                </p>
          
                <h2>{movingSession.title}</h2>
              </div>
          
              <button
                type="button"
                className="close-button"
                onClick={() =>
                  setMovingSession(null)
                }
              >
                ×
              </button>
            </div>
              
            <div className="form-group">
              <label>Date</label>
              
              <input
                type="date"
                value={movingSession.date}
                onChange={(event) =>
                  setMovingSession({
                    ...movingSession,
                    date: event.target.value,
                  })
                }
              />
            </div>
              
            <div className="form-group">
              <label>Start time</label>
              
              <input
                type="time"
                value={movingSession.start}
                onChange={(event) =>
                  setMovingSession({
                    ...movingSession,
                    start: event.target.value,
                  })
                }
              />
            </div>
              
            <p className="protected-note">
              LinedUp will warn about scheduling conflicts
              once this is connected to persistent scheduling.
            </p>
              
            <div className="modal-actions modal-actions-danger">
              
              <button
                type="button"
                className="delete-button"
                onClick={() => {
                  const confirmed = window.confirm(
                    'Remove this work session from your calendar?'
                  )
                
                  if (confirmed) {
                    onDeleteSession(movingSession.id)
                    setMovingSession(null)
                  }
                }}
              >
                Remove session
              </button>
              
              <div>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setMovingSession(null)
                  }
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="save-button"
                >
                  Move session
                </button>
              </div>
                
            </div>
                
          </form>
                
        </div>
      )}
      
      {editing && (
        <div className="modal-backdrop">
        
          <form
            className="add-modal"
            onSubmit={(event) => {
              event.preventDefault()
            
              onUpdate({
                ...commitment,
                ...editForm,
              
                detail: editForm.estimatedHours
                  ? `${editForm.estimatedHours}h estimated`
                  : 'Not scheduled yet',
              
                due: editForm.deadline
                  ? `Due ${editForm.deadline}`
                  : 'No deadline',
              })
            
              setEditing(false)
            }}
          >
          
            <div className="modal-header">
              <div>
                <p className="section-label">
                  EDIT COMMITMENT
                </p>
          
                <h2>{commitment.title}</h2>
              </div>
          
              <button
                type="button"
                className="close-button"
                onClick={() => setEditing(false)}
              >
                ×
              </button>
            </div>
          
            <div className="form-group">
              <label>Title</label>
          
              <input
                value={editForm.title}
                onChange={(event) =>
                  setEditForm({
                    ...editForm,
                    title: event.target.value,
                  })
                }
              />
            </div>
              
            <div className="form-row">
              
              <div className="form-group">
                <label>Deadline</label>
              
                <input
                  type="date"
                  value={editForm.deadline}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      deadline: event.target.value,
                    })
                  }
                />
              </div>
                
              <div className="form-group">
                <label>Estimated work</label>
                
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={editForm.estimatedHours}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      estimatedHours: event.target.value,
                    })
                  }
                />
              </div>
                
            </div>
                
            <div className="form-group">
              <label>Difficulty</label>
                
              <select
                value={editForm.personalDifficulty}
                onChange={(event) =>
                  setEditForm({
                    ...editForm,
                    personalDifficulty:
                      Number(event.target.value),
                  })
                }
              >
                <option value={1}>1 — Very easy</option>
                <option value={2}>2 — Easy</option>
                <option value={3}>3 — Moderate</option>
                <option value={4}>4 — Hard</option>
                <option value={5}>5 — Very hard</option>
              </select>
            </div>
              
            <div className="form-group">
              <label>Preferred time</label>
              
              <select
                value={editForm.preferredTime}
                onChange={(event) =>
                  setEditForm({
                    ...editForm,
                    preferredTime: event.target.value,
                  })
                }
              >
                <option value="anytime">Anytime</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
              
            <div className="form-group">
              <label>Description</label>
              
              <textarea
                rows="4"
                value={editForm.description}
                onChange={(event) =>
                  setEditForm({
                    ...editForm,
                    description: event.target.value,
                  })
                }
              />
            </div>
              
            <div className="modal-actions modal-actions-danger">
              
              <button
                type="button"
                className="delete-button"
                onClick={() => {
                  const confirmed = window.confirm(
                    `Delete "${commitment.title}"?\n\nIts scheduled work sessions will also be removed.`
                  )
                
                  if (confirmed) {
                    onDelete(commitment.id)
                  }
                }}
              >
                Delete
              </button>
              
              <div>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              
                <button
                  type="submit"
                  className="save-button"
                >
                  Save changes
                </button>
              </div>
              
            </div>
              
          </form>
              
        </div>
      )}
    </div>
  )
}

export default CommitmentDetail