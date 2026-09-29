const availability = [
  {
    day: 0,
    windows: [
      { start: 16, end: 20 },
    ],
  },
  {
    day: 1,
    windows: [
      { start: 15, end: 19 },
    ],
  },
  {
    day: 2,
    windows: [
      { start: 16, end: 21 },
    ],
  },
  {
    day: 3,
    windows: [
      { start: 17, end: 20 },
    ],
  },
  {
    day: 4,
    windows: [
      { start: 14, end: 19 },
    ],
  },
]

const blockedTimes = [
  {
    day: 2,
    start: 18,
    end: 20,
    reason: 'Me Time',
  },
]

function createSchedule(commitment) {
  let remainingMinutes =
    Number(commitment.estimatedHours) * 60

  if (!remainingMinutes || !commitment.deadline) {
    return []
  }

  const sessions = []

  const maxSessionMinutes = 90

  for (const dayAvailability of availability) {
    if (remainingMinutes <= 0) {
      break
    }

    for (const window of dayAvailability.windows) {
      if (remainingMinutes <= 0) {
        break
      }

      const availableMinutes =
        (window.end - window.start) * 60

      const sessionMinutes = Math.min(
        maxSessionMinutes,
        availableMinutes,
        remainingMinutes
      )

      sessions.push({
        id: `${commitment.id}-${dayAvailability.day}-${window.start}`,

        commitmentId: commitment.id,

        title: commitment.title,
        type: commitment.type,

        day: dayAvailability.day,

        startHour: window.start,

        duration: sessionMinutes / 60,

        estimatedMinutes: sessionMinutes,
        completedMinutes: 0,

        flexible: true,
      })

      remainingMinutes -= sessionMinutes
    }
  }

  return sessions
}

export default createSchedule
