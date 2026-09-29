import { useState } from 'react'



const times = [
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

function CalendarEvent({ event }) {
  const firstHour = 8
  const hourHeight = 54

  const startHour = timeToDecimal(event.start)
  const endHour = timeToDecimal(event.end)

  const top =
    (startHour - firstHour) * hourHeight

  const height =
    (endHour - startHour) * hourHeight

  return (
    <button
      className={`calendar-event ${event.kind}`}
      style={{
        top: `${top}px`,
        height: `${height}px`,
      }}
    >
      <strong>{event.title}</strong>

      <span>
        {formatTime(event.start)}
        {' – '}
        {formatTime(event.end)}
      </span>

      {event.kind === 'protected' && (
        <span>Protected</span>
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

function Calendar({ events = [] }) {
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

          {days.map((day, dayIndex) => (
            <div
              className="calendar-day-column"
              key={day.toISOString()}
            >

              {times.map((time) => (
                <div
                  className="calendar-slot"
                  key={`${day.name}-${time}`}
                />
              ))}

              <div className="calendar-events">
                {events
                  .filter((event) =>
                    event.days.includes(dayIndex)
                  )
                  .map((event) => (
                    <CalendarEvent
                      key={`${event.id}-${dayIndex}`}
                      event={event}
                    />
                  ))}
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}

export default Calendar