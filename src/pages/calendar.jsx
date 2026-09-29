import { useState } from 'react'



const times = [
  '5 AM',
  '6 AM',
  '7 AM',
  '8 AM',
  '9 AM',
  '10 AM',
  '11 AM',
  '12 PM',
  '1 PM',
  '2 PM',
  '3 PM',
  '4 PM',
  '5 PM',
  '6 PM',
  '7 PM',
  '8 PM',
  '9 PM',
  '10 PM',
  '11 PM',
]

function timeToDecimal(time) {
  const [hours, minutes] = time
    .split(':')
    .map(Number)

  return hours + minutes / 60
}

function formatTime(time) {
  const [hourString, minute] = time.split(':')

  const hour = Number(hourString)

  const period = hour >= 12 ? 'PM' : 'AM'

  const displayHour =
    hour % 12 === 0
      ? 12
      : hour % 12

  return `${displayHour}:${minute} ${period}`
}

function CalendarEvent({ event,onClick, }) {
  const firstHour = 5
  const hourHeight = 54

  const startHour = timeToDecimal(event.start)

  let endHour

  if (event.end) {
    endHour = timeToDecimal(event.end)
  } else {
    endHour =
      startHour +
      event.durationMinutes / 60
  }

  const top =
    (startHour - firstHour) * hourHeight

  const height =
    (endHour - startHour) * hourHeight

  const updateCommitment = (updatedCommitment) => {
    setCommitments((current) =>
      current.map((commitment) =>
        commitment.id === updatedCommitment.id
          ? updatedCommitment
          : commitment
      )
    )
  }

  const deleteCommitment = (commitmentId) => {
    setCommitments((current) =>
      current.filter(
        (commitment) => commitment.id !== commitmentId
      )
    )

    setScheduledSessions((current) =>
      current.filter(
        (session) =>
          session.commitmentId !== commitmentId
      )
    )

    setSelectedCommitment(null)
  }

  const toggleCommitmentComplete = (commitmentId) => {
    setCommitments((current) =>
      current.map((commitment) =>
        commitment.id === commitmentId
          ? {
              ...commitment,
              completed: !commitment.completed,
              progress: commitment.completed ? 0 : 100,
            }
          : commitment
      )
    )
  }

  const updateSession = (sessionId, changes) => {
    setScheduledSessions((current) =>
      current.map((session) =>
        session.id === sessionId
          ? { ...session, ...changes }
          : session
      )
    )
  }

  const deleteSession = (sessionId) => {
    setScheduledSessions((current) =>
      current.filter(
        (session) => session.id !== sessionId
      )
    )
  }

  const updateCalendarEvent = (eventId, changes) => {
    setCalendarEvents((current) =>
      current.map((event) =>
        event.id === eventId
          ? { ...event, ...changes }
          : event
      )
    )
  }

  const deleteCalendarEvent = (eventId) => {
    setCalendarEvents((current) =>
      current.filter(
        (event) => event.id !== eventId
      )
    )
  }

  return (
    <button
      className={`calendar-event ${event.kind}`}
      onClick={onClick}
      style={{
        top: `${top}px`,
        height: `${height}px`,
      }}
    >
      <strong>{event.title}</strong>

      <span>
        {formatTime(event.start)}
      </span>

      {event.kind === 'protected' && (
        <span>Protected 🔒</span>
      )}

      {event.kind === 'session' && (
        <span>Planned by LinedUp</span>
      )}
    </button>
  )
}

function getMonday(date) {
  const result = new Date(date)

  const day = result.getDay()

  const difference =
    day === 0
      ? -6
      : 1 - day

  result.setDate(result.getDate() + difference)

  return result
}
function getWeekDays(weekOffset) {
  const monday = getMonday(new Date())

  monday.setDate(
    monday.getDate() + weekOffset * 7
  )

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday)

    date.setDate(
      monday.getDate() + index
    )

    return date
  })
}

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function Calendar({ events = [], sessions = [], 
  onUpdateEvent,
  onDeleteEvent,
  onUpdateSession,
  onDeleteSession,}) {

  const [selectedBlock, setSelectedBlock] =
    useState(null)
  const [weekOffset, setWeekOffset] = useState(0)

  const days = getWeekDays(weekOffset)

  const firstDay = days[0]
  const lastDay = days[6]

  const weekLabel = `${firstDay.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} – ${lastDay.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`

  return (
    <div className="calendar-page">

      <div className="calendar-header">
        <div>
          <p className="section-label">YOUR WEEK</p>

          <h1>Calendar</h1>

          <p className="subtitle">
            Classes, commitments and protected time in one place.
          </p>
        </div>

        <div className="calendar-controls">
          <button
            onClick={() => setWeekOffset((current) => current - 1)}
            aria-label="Previous week"
          >
            ←
          </button>

          <strong>{weekLabel}</strong>

          <button
            className="today-button"
            onClick={() => setWeekOffset(0)}
          >
            Today
          </button>

          <button
            onClick={() => setWeekOffset((current) => current + 1)}
            aria-label="Next week"
          >
            →
          </button>
        </div>
      </div>

      <div className="week-calendar">

        <div className="calendar-top-row">
          <div />

          {days.map((day) => {
            const today = new Date()

            const isToday =
              day.toDateString() === today.toDateString()

            return (
              <div
                className={
                  isToday
                    ? 'calendar-day-heading today'
                    : 'calendar-day-heading'
                }
                key={day.toISOString()}
              >
                <span>
                  {day
                    .toLocaleDateString('en-US', {
                      weekday: 'short',
                    })
                    .toUpperCase()}
                </span>
                  
                <strong>
                  {day.getDate()}
                </strong>
              </div>
            )
          })}
        </div>

        <div className="calendar-grid">

          <div className="calendar-times">
            {times.map((time) => (
              <div
                className="calendar-time"
                key={time}
              >
                {time}
              </div>
            ))}
          </div>

          {days.map((day, dayIndex) => {
            const dateKey = formatDateKey(day)
                    
            const dayEvents = events.filter((event) => {
              if (event.recurrence === 'weekly') {
                return event.days.includes(dayIndex)
              }
            
              if (event.recurrence === 'once') {
                return event.date === dateKey
              }
            
              // Protected time currently repeats weekly
              if (event.kind === 'protected') {
                return event.days.includes(dayIndex)
              }
            
              return false
            })
          
            const daySessions = sessions.filter(
              (session) => session.date === dateKey
            )
          
            return (
              <div
                className="calendar-day-column"
                key={dateKey}
              >
              
                {times.map((time) => (
                  <div
                    className="calendar-slot"
                    key={`${dateKey}-${time}`}
                  />
                ))}
          
                <div className="calendar-events">
              
                  {dayEvents.map((event) => (
                    <CalendarEvent
                      key={`${event.id}-${dateKey}`}
                      event={event}
                      onClick={() =>
                        setSelectedBlock({
                          ...session,
                          blockType: 'session',
                        })
                      }
                    />
                  ))}
          
                  {daySessions.map((session) => (
                    <CalendarEvent
                      key={session.id}
                      event={session}
                      onClick={() =>
                        setSelectedBlock({
                          ...session,
                          blockType: 'session',
                        })
                      }
                    />
                  ))}
          
                </div>
                
              </div>
            )
          })}

        </div>

      </div>
      {selectedBlock && (
        <div className="modal-backdrop">
        
          <form
            className="add-modal"
            onSubmit={(event) => {
              event.preventDefault()
            
              if (
                selectedBlock.blockType === 'event'
              ) {
                onUpdateEvent(
                  selectedBlock.id,
                  {
                    title: selectedBlock.title,
                    start: selectedBlock.start,
                    end: selectedBlock.end,
                  }
                )
              } else {
                onUpdateSession(
                  selectedBlock.id,
                  {
                    date: selectedBlock.date,
                    start: selectedBlock.start,
                  }
                )
              }
            
              setSelectedBlock(null)
            }}
          >
          
            <div className="modal-header">
              <div>
                <p className="section-label">
                  {selectedBlock.kind === 'protected'
                    ? 'PROTECTED TIME'
                    : selectedBlock.kind === 'session'
                      ? 'WORK SESSION'
                      : 'EVENT'}
                </p>
                  
                <h2>{selectedBlock.title}</h2>
              </div>
                  
              <button
                type="button"
                className="close-button"
                onClick={() =>
                  setSelectedBlock(null)
                }
              >
                ×
              </button>
            </div>
              
            {selectedBlock.blockType === 'event' && (
              <div className="form-group">
                <label>Name</label>
            
                <input
                  value={selectedBlock.title}
                  onChange={(event) =>
                    setSelectedBlock({
                      ...selectedBlock,
                      title: event.target.value,
                    })
                  }
                />
              </div>
            )}
      
            {selectedBlock.blockType === 'session' && (
              <div className="form-group">
                <label>Date</label>
            
                <input
                  type="date"
                  value={selectedBlock.date}
                  onChange={(event) =>
                    setSelectedBlock({
                      ...selectedBlock,
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
                  value={selectedBlock.start}
                  onChange={(event) =>
                    setSelectedBlock({
                      ...selectedBlock,
                      start: event.target.value,
                    })
                  }
                />
              </div>
                
              {selectedBlock.blockType === 'event' && (
                <div className="form-group">
                  <label>End</label>
              
                  <input
                    type="time"
                    value={selectedBlock.end}
                    onChange={(event) =>
                      setSelectedBlock({
                        ...selectedBlock,
                        end: event.target.value,
                      })
                    }
                  />
                </div>
              )}
      
            </div>
            
            <div className="modal-actions modal-actions-danger">
            
              <button
                type="button"
                className="delete-button"
                onClick={() => {
                  const confirmed = window.confirm(
                    `Delete "${selectedBlock.title}"?`
                  )
                
                  if (!confirmed) return
                
                  if (
                    selectedBlock.blockType === 'event'
                  ) {
                    onDeleteEvent(selectedBlock.id)
                  } else {
                    onDeleteSession(selectedBlock.id)
                  }
                
                  setSelectedBlock(null)
                }}
              >
                Delete
              </button>
              
              <div>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setSelectedBlock(null)
                  }
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

export default Calendar