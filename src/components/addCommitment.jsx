import { useState } from 'react'

function AddCommitment({ onClose, onSave, onSaveEvent, }) {
  const [addMode, setAddMode] = useState('commitment')
  const [eventForm, setEventForm] = useState({
      title: '',
      start: '',
      end: '',
      recurrence: 'once',
      date: '',
      days: [],
    })


    const [protectedForm, setProtectedForm] = useState({
      title: '',
      start: '',
      end: '',
      days: [],
    })
  const [form, setForm] = useState({
    title: '',
    type: 'assignment',
    deadline: '',
    personalDifficulty: 3,
    estimatedHours: '',
    preferredTime: 'anytime',
    description: '',
    aiEnabled: true,
  })
  const toggleDay = (day, form, setForm) => {
      const alreadySelected = form.days.includes(day)

      setForm({
        ...form,

        days: alreadySelected
          ? form.days.filter((selectedDay) => selectedDay !== day)
          : [...form.days, day],
      })
    }

  const updateField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    })
  }

    const handleSubmit = (event) => {
      event.preventDefault()

      if (addMode === 'commitment') {
        if (!form.title.trim()) {
          return
        }

        onSave(form)
        return
      }

      if (addMode === 'event') {
        if (
          !eventForm.title.trim() ||
          !eventForm.start ||
          !eventForm.end
        ) {
          return
        }
      
        if (
          eventForm.recurrence === 'once' &&
          !eventForm.date
        ) {
          return
        }
      
        if (
          eventForm.recurrence === 'weekly' &&
          eventForm.days.length === 0
        ) {
          return
        }
      
        onSaveEvent({
          ...eventForm,
          kind: 'fixed',
        })
      
        return
      }

      if (addMode === 'protected') {
        if (
          !protectedForm.title.trim() ||
          !protectedForm.start ||
          !protectedForm.end ||
          protectedForm.days.length === 0
        ) {
          return
        }

        onSaveEvent({
          ...protectedForm,
          kind: 'protected',
        })
      }
    }

        return (
          <div className="modal-backdrop">
        
            <form
              className="add-modal"
              onSubmit={handleSubmit}
            >
              <div className="modal-header">
                <div>
                  <p className="section-label">NEW COMMITMENT</p>
                  <h2>What's coming up?</h2>
                  <p>
                    Give LinedUp the basics. You can always change them later.
                  </p>
                </div>

                <button
                  type="button"
                  className="close-button"
                  onClick={onClose}
                >
                  ×
                </button>
              </div>
              <div className="add-mode-selector">
                <button
                  type="button"
                  className={addMode === 'commitment' ? 'selected' : ''}
                  onClick={() => setAddMode('commitment')}
                >
                  Commitment
                </button>

                <button
                  type="button"
                  className={addMode === 'event' ? 'selected' : ''}
                  onClick={() => setAddMode('event')}
                >
                  Event
                </button>

                <button
                  type="button"
                  className={addMode === 'protected' ? 'selected' : ''}
                  onClick={() => setAddMode('protected')}
                >
                  Protected time
                </button>
              </div>

              {addMode === 'commitment' && (
                <>

              <div className="type-selector">
                {[
                  ['assignment', 'Assignment'],
                  ['exam', 'Exam'],
                  ['career', 'Career'],
                  ['club', 'Club'],
                  ['personal', 'Personal'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={
                      form.type === value
                        ? `type-button selected ${value}`
                        : 'type-button'
                    }
                    onClick={() => updateField('type', value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            
              <div className="form-group">
                <label>Title</label>
            
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    updateField('title', event.target.value)
                  }
                  placeholder="e.g. DSA Assignment 4"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Deadline</label>
              
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(event) =>
                      updateField('deadline', event.target.value)
                    }
                  />
                </div>
                
                <div className="form-group">
                  <label>Estimated work</label>
                
                  <div className="hours-input">
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={form.estimatedHours}
                      onChange={(event) =>
                        updateField(
                          'estimatedHours',
                          event.target.value
                        )
                      }
                      placeholder="4"
                    />

                    <span>hours</span>
                  </div>
                </div>
              </div>
                  
              <div className="form-group">
                <label>
                  How difficult does this feel to you?
                </label>
                  
                <div className="difficulty-options">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={
                        form.personalDifficulty === level
                          ? 'difficulty-button selected'
                          : 'difficulty-button'
                      }
                      onClick={() =>
                        updateField('personalDifficulty', level)
                      }
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>When do you prefer working on this?</label>
              
                <select
                  value={form.preferredTime}
                  onChange={(event) =>
                    updateField('preferredTime', event.target.value)
                  }
                >
                  <option value="anytime">Anytime</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Description / requirements</label>
              
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(event) =>
                    updateField('description', event.target.value)
                  }
                  placeholder="Paste assignment instructions, syllabus, internship requirements..."
                />
              </div>
              
              <div className="ai-setting">
                <div>
                  <strong>LinedUp AI analysis</strong>
              
                  <p>
                    Estimate complexity and workload, suggest subtasks,
                    and help build a realistic schedule.
                  </p>
                </div>
              
                <button
                  type="button"
                  className={`toggle ${form.aiEnabled ? 'on' : ''}`}
                  onClick={() =>
                    updateField('aiEnabled', !form.aiEnabled)
                  }
                >
                  <span />
                </button>
              </div>
              
              {form.aiEnabled && (
                  <div className="ai-upload">
                    <div>
                      <strong>Have the actual brief?</strong>
                      <p>
                        PDF analysis is coming next. For now, paste its
                        contents above.
                      </p>
                    </div>

                    <button type="button" disabled>
                      Upload PDF
                    </button>
                  </div>
                )}

              </>
            )}


        
        
        {/* ++++++++ E V E N T +++++++ */}



        {addMode === 'event' && (
          <div className="event-form">
          
            <div className="form-group">
              <label>Event name</label>

              <input
                type="text"
                placeholder="e.g. Data Structures class"
                value={eventForm.title}
                onChange={(event) =>
                  setEventForm({
                    ...eventForm,
                    title: event.target.value,
                  })
                }
              />
            </div>
              
            <div className="form-group">
              <label>Schedule</label>
              
              <div className="recurrence-selector">
                <button
                  type="button"
                  className={
                    eventForm.recurrence === 'once'
                      ? 'selected'
                      : ''
                  }
                  onClick={() =>
                    setEventForm({
                      ...eventForm,
                      recurrence: 'once',
                    })
                  }
                >
                  One time
                </button>
                
                <button
                  type="button"
                  className={
                    eventForm.recurrence === 'weekly'
                      ? 'selected'
                      : ''
                  }
                  onClick={() =>
                    setEventForm({
                      ...eventForm,
                      recurrence: 'weekly',
                    })
                  }
                >
                  Repeats weekly
                </button>
              </div>
            </div>
                
            {eventForm.recurrence === 'once' && (
              <div className="form-group">
                <label>Date</label>
            
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(event) =>
                    setEventForm({
                      ...eventForm,
                      date: event.target.value,
                    })
                  }
                />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Start</label>
          
                <input
                  type="time"
                  value={eventForm.start}
                  onChange={(event) =>
                    setEventForm({
                      ...eventForm,
                      start: event.target.value,
                    })
                  }
                />
              </div>
                
              <div className="form-group">
                <label>End</label>
                
                <input
                  type="time"
                  value={eventForm.end}
                  onChange={(event) =>
                    setEventForm({
                      ...eventForm,
                      end: event.target.value,
                    })
                  }
                />
              </div>
            </div>
                
            {eventForm.recurrence === 'weekly' && (
              <div className="form-group">
                <label>Repeats on</label>
            
                <div className="weekday-selector">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(
                    (day, index) => (
                      <button
                        type="button"
                        key={index}
                        className={
                          eventForm.days.includes(index)
                            ? 'selected'
                            : ''
                        }
                        onClick={() =>
                          toggleDay(
                            index,
                            eventForm,
                            setEventForm
                          )
                        }
                      >
                        {day}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

          </div>
        )}
    
    

    {/* ++++++++   P R O T E C T E D     T I M E   +++++++ */}




    {addMode === 'protected' && (
      <div className="protected-form">
    
        <div className="form-group">
          <label>What are you protecting?</label>
    
          <input
            type="text"
            placeholder="e.g. Gym, lunch, me time"
            value={protectedForm.title}
            onChange={(event) =>
              setProtectedForm({
                ...protectedForm,
                title: event.target.value,
              })
            }
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Start</label>
        
            <input
              type="time"
              value={protectedForm.start}
              onChange={(event) =>
                setProtectedForm({
                  ...protectedForm,
                  start: event.target.value,
                })
              }
            />
          </div>
          
          <div className="form-group">
            <label>End</label>
          
            <input
              type="time"
              value={protectedForm.end}
              onChange={(event) =>
                setProtectedForm({
                  ...protectedForm,
                  end: event.target.value,
                })
              }
            />
          </div>
        </div>
          
        <div className="form-group">
          <label>Repeats on</label>
          
          <div className="weekday-selector">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(
              (day, index) => (
                <button
                  type="button"
                  key={index}
                  className={
                    protectedForm.days.includes(index)
                      ? 'selected'
                      : ''
                  }
                  onClick={() =>
                    toggleDay(
                      index,
                      protectedForm,
                      setProtectedForm
                    )
                  }
                >
                  {day}
                </button>
              )
            )}
          </div>
        </div>
        
        <p className="protected-note">
          LinedUp won't schedule work during protected time.
        </p>
        
      </div>
    )}  

    <div className="modal-actions">
      <button
        type="button"
        className="cancel-button"
        onClick={onClose}
      >
        Cancel
      </button>
    
      <button
        type="submit"
        className="save-button"
      >
        {addMode === 'commitment' && 'Add commitment →'}
        {addMode === 'event' && 'Add event →'}
        {addMode === 'protected' && 'Protect time →'}
      </button>
    </div>      

    </form>

  </div>
)
}
export default AddCommitment