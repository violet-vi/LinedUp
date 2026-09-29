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


function getPreferredStart(preferredTime) {
  if (preferredTime === 'morning') {
    return '09:00'
  }

  if (preferredTime === 'afternoon') {
    return '14:00'
  }

  if (preferredTime === 'evening') {
    return '18:00'
  }

  return '16:00'
}


function createSchedule(commitment) {
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

  const sessions = []

  const maxSessionMinutes = 90

  const currentDate = new Date(today)

  while (
    remainingMinutes > 0 &&
    currentDate <= deadline
  ) {
    const sessionMinutes = Math.min(
      maxSessionMinutes,
      remainingMinutes
    )

    sessions.push({
      id: `${commitment.id}-${formatDateKey(currentDate)}`,

      commitmentId: commitment.id,

      title: commitment.title,
      type: commitment.type,

      date: formatDateKey(currentDate),

      start: getPreferredStart(
        commitment.preferredTime
      ),

      durationMinutes: sessionMinutes,

      estimatedMinutes: sessionMinutes,
      completedMinutes: 0,

      kind: 'session',
      flexible: true,
    })

    remainingMinutes -= sessionMinutes

    currentDate.setDate(
      currentDate.getDate() + 1
    )
  }

  return sessions
}

export default createSchedule