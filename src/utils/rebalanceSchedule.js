import createSchedule from './scheduler'


function deadlineScore(deadline) {
  if (!deadline) return 0

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const due = new Date(
    `${deadline}T00:00:00`
  )

  const daysLeft = Math.ceil(
    (due - now) /
      (1000 * 60 * 60 * 24)
  )

  if (daysLeft <= 1) return 100
  if (daysLeft <= 2) return 80
  if (daysLeft <= 4) return 60
  if (daysLeft <= 7) return 40

  return 20
}


function priorityScore(priority) {
  if (priority === 'high') return 40
  if (priority === 'medium') return 20

  return 0
}


function difficultyScore(difficulty) {
  return Number(difficulty || 0) * 5
}


function getCommitmentScore(commitment) {
  return (
    deadlineScore(commitment.deadline) +
    priorityScore(commitment.priority) +
    difficultyScore(
      commitment.personalDifficulty
    )
  )
}


function rebalanceSchedule({
  commitments,
  calendarEvents,
  existingSessions,
}) {

  /*
    COMPLETED sessions are history.

    They must NEVER be moved.
  */
  const completedSessions =
    existingSessions.filter(
      (session) =>
        (session.completedMinutes || 0) >=
        (session.estimatedMinutes || 0)
    )


  /*
    Active commitments only.
  */
  const activeCommitments =
    commitments
      .filter(
        (commitment) =>
          !commitment.completed &&
          commitment.deadline &&
          Number(commitment.estimatedHours) > 0
      )
      .sort(
        (a, b) =>
          getCommitmentScore(b) -
          getCommitmentScore(a)
      )


  let rebuiltSessions = [
    ...completedSessions,
  ]


  for (const commitment of activeCommitments) {

    const oldSessions =
      existingSessions.filter(
        (session) =>
          session.commitmentId ===
          commitment.id
      )


    const completedMinutes =
      oldSessions.reduce(
        (total, session) =>
          total +
          Math.min(
            session.completedMinutes || 0,
            session.estimatedMinutes || 0
          ),
        0
      )


    const totalMinutes =
      Number(commitment.estimatedHours) *
      60


    const remainingMinutes =
      Math.max(
        0,
        totalMinutes - completedMinutes
      )


    if (remainingMinutes === 0) {
      continue
    }


    /*
      createSchedule expects estimatedHours.

      Give it ONLY the remaining work.
    */
    const temporaryCommitment = {
      ...commitment,

      estimatedHours:
        remainingMinutes / 60,
    }


    const newSessions =
      createSchedule(
        temporaryCommitment,
        calendarEvents,
        rebuiltSessions
      )


    rebuiltSessions = [
      ...rebuiltSessions,
      ...newSessions,
    ]
  }


  return rebuiltSessions
}

export default rebalanceSchedule