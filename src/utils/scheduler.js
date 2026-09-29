function formatDateKey(date) {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    date.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}


function timeToMinutes(time) {
  const [hours, minutes] = time
    .split(':')
    .map(Number)

  return hours * 60 + minutes
}


function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${String(hours).padStart(2, '0')}:${String(
    mins
  ).padStart(2, '0')}`
}


function getMondayIndex(date) {
  const jsDay = date.getDay()

  return jsDay === 0
    ? 6
    : jsDay - 1
}


function eventOccursOnDate(event, date) {
  const dateKey = formatDateKey(date)

  if (event.recurrence === 'once') {
    return event.date === dateKey
  }

  if (
    event.recurrence === 'weekly' ||
    event.kind === 'protected'
  ) {
    return event.days.includes(
      getMondayIndex(date)
    )
  }

  return false
}


function getBusyTimes(
  date,
  calendarEvents,
  scheduledSessions
) {
  const dateKey = formatDateKey(date)

  const busyTimes = []

  calendarEvents.forEach((event) => {
    if (!eventOccursOnDate(event, date)) {
      return
    }

    busyTimes.push({
      start: timeToMinutes(event.start),
      end: timeToMinutes(event.end),
    })
  })


  scheduledSessions.forEach((session) => {
    if (session.date !== dateKey) {
      return
    }

    const start =
      timeToMinutes(session.start)

    busyTimes.push({
      start,
      end:
        start +
        session.durationMinutes,
    })
  })


  return busyTimes
}


function overlaps(
  start,
  end,
  busyTimes
) {
  return busyTimes.some(
    (busy) =>
      start < busy.end &&
      end > busy.start
  )
}


function getPreferredRange(preferredTime) {
  switch (preferredTime) {
    case 'morning':
      return {
        start: 8 * 60,
        end: 12 * 60,
      }

    case 'afternoon':
      return {
        start: 12 * 60,
        end: 17 * 60,
      }

    case 'evening':
      return {
        start: 17 * 60,
        end: 22 * 60,
      }

    default:
      return {
        start: 8 * 60,
        end: 22 * 60,
      }
  }
}


function findFreeSlot(
  date,
  durationMinutes,
  preferredTime,
  calendarEvents,
  scheduledSessions
) {
  const busyTimes = getBusyTimes(
    date,
    calendarEvents,
    scheduledSessions
  )

  const range =
    getPreferredRange(preferredTime)

  // Search in 30-minute increments
  for (
    let start = range.start;
    start + durationMinutes <= range.end;
    start += 30
  ) {
    const end =
      start + durationMinutes

    if (
      !overlaps(
        start,
        end,
        busyTimes
      )
    ) {
      return start
    }
  }

  return null
}


function createSchedule(
  commitment,
  calendarEvents = [],
  existingSessions = []
) {
  let remainingMinutes =
    Number(commitment.estimatedHours) * 60

  if (
    !remainingMinutes ||
    !commitment.deadline
  ) {
    return []
  }


  const deadline = new Date(
    `${commitment.deadline}T23:59:59`
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (deadline < today) {
    return []
  }


  const newSessions = []

  const maxSessionMinutes = 90

  const currentDate =
    new Date(today)


  while (
    remainingMinutes > 0 &&
    currentDate <= deadline
  ) {
    const desiredDuration =
      Math.min(
        maxSessionMinutes,
        remainingMinutes
      )


    /*
      Existing sessions PLUS the sessions
      we've generated during THIS scheduling run.

      Otherwise two new sessions could accidentally
      occupy the same time.
    */
    const allSessions = [
      ...existingSessions,
      ...newSessions,
    ]


    let sessionDuration =
      desiredDuration

    let slot = null


    /*
      First try the desired duration.

      If 90 minutes won't fit, try 60.
      Then 30.
    */
    while (
      sessionDuration >= 30 &&
      slot === null
    ) {
      slot = findFreeSlot(
        currentDate,
        sessionDuration,
        commitment.preferredTime,
        calendarEvents,
        allSessions
      )

      if (slot === null) {
        sessionDuration -= 30
      }
    }


    if (slot !== null) {
      const dateKey =
        formatDateKey(currentDate)

      newSessions.push({
        id:
          `${commitment.id}-${dateKey}-${slot}`,

        commitmentId:
          commitment.id,

        title:
          commitment.title,

        type:
          commitment.type,

        date:
          dateKey,

        start:
          minutesToTime(slot),

        durationMinutes:
          sessionDuration,

        estimatedMinutes:
          sessionDuration,

        completedMinutes: 0,

        kind: 'session',

        flexible: true,
      })

      remainingMinutes -=
        sessionDuration
    }


    currentDate.setDate(
      currentDate.getDate() + 1
    )
  }


  return newSessions
}

export default createSchedule