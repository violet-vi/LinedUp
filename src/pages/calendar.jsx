const days = [
  { name: 'MON', date: 28 },
  { name: 'TUE', date: 29 },
  { name: 'WED', date: 30 },
  { name: 'THU', date: 1 },
  { name: 'FRI', date: 2 },
]

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

const events = [
  {
    id: 1,
    title: 'Physics',
    subtitle: 'Class',
    day: 0,
    startHour: 9,
    duration: 1,
    type: 'fixed',
  },
  {
    id: 2,
    title: 'Programming',
    subtitle: 'Class',
    day: 1,
    startHour: 11,
    duration: 1,
    type: 'fixed',
  },
  {
    id: 3,
    title: 'DSA Assignment',
    subtitle: 'Questions 3–4',
    day: 0,
    startHour: 16,
    duration: 1,
    type: 'assignment',
  },
  {
    id: 4,
    title: 'Physics Revision',
    subtitle: 'Unit 2',
    day: 1,
    startHour: 18,
    duration: 1,
    type: 'study',
  },
  {
    id: 5,
    title: 'Internship',
    subtitle: 'Résumé',
    day: 2,
    startHour: 15,
    duration: 1,
    type: 'career',
  },
  {
    id: 6,
    title: 'Me Time',
    subtitle: 'Protected',
    day: 3,
    startHour: 17,
    duration: 2,
    type: 'protected',
  },
]

function CalendarEvent({ event }) {
  const firstHour = 8
  const hourHeight = 54

  const top =
    (event.startHour - firstHour) * hourHeight

  const height =
    event.duration * hourHeight

  return (
    <button
      className={`calendar-event ${event.type}`}
      style={{
        top: `${top}px`,
        height: `${height}px`,
      }}
    >
      <strong>{event.title}</strong>
      <span>{event.subtitle}</span>
    </button>
  )
}

function Calendar() {
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
          <button>←</button>
          <strong>Sep 28 – Oct 2</strong>
          <button>→</button>
        </div>
      </div>

      <div className="week-calendar">

        <div className="calendar-top-row">
          <div />

                {days.map((day) => (
                  <div
                    className="calendar-day-heading"
                    key={day.name}
                  >
                    <span>{day.name}</span>
                    <strong>{day.date}</strong>
                  </div>
                ))}
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
          key={day.name}
        >
          {times.map((time) => (
            <div
              className="calendar-slot"
              key={`${day.name}-${time}`}
            />
          ))}
      
          <div className="calendar-events">
            {events
              .filter((event) => event.day === dayIndex)
              .map((event) => (
                <CalendarEvent
                  key={event.id}
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