import { useState } from 'react'

import createSchedule from './utils/scheduler'
import Pressure from './pages/pressure'
import Calendar from './pages/calendar'
import AddCommitment from './components/addCommitment'
import TopNav from './components/topNav'
import IntelligencePanel from './components/intelligencePanel'
import CommitmentDetail from './pages/CommitmentDetail'
import EnergyCheckIn from './components/energy'
import TodayCard from './components/todayCard'

import './App.css'

function App() {
  const [page, setPage] = useState('today')
  const [scheduledSessions, setScheduledSessions] = useState([])
  const [selectedCommitment, setSelectedCommitment] = useState(null)
  const [calendarEvents, setCalendarEvents] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [commitments, setCommitments] = useState([
   {
     id: 1,
     title: 'DSA Assignment',
     detail: 'Questions 3–4 · 1h scheduled today',
     type: 'assignment',
     progress: 68,
     due: 'Due Sep 30',
   },
   {
     id: 2,
     title: 'Physics Midterm',
     detail: 'Unit 2 · 45m scheduled today',
     type: 'study',
     progress: 32,
     due: '3 days left',
   },
   {
     id: 3,
     title: 'Microsoft Internship',
     detail: 'Résumé · 30m scheduled today',
     type: 'career',
     progress: 25,
     due: 'Due Oct 3',
   },
  ])
  const addCommitment = (form) => {
    const newCommitment = {
      
      id: Date.now(),

      title: form.title,
      type: form.type,

      deadline: form.deadline,
      personalDifficulty: form.personalDifficulty,
      estimatedHours: form.estimatedHours,
      preferredTime: form.preferredTime,
      description: form.description,
      aiEnabled: form.aiEnabled,

      progress: 0,
      completed: false,

      detail: form.estimatedHours
        ? `${form.estimatedHours}h estimated`
        : 'Not scheduled yet',

      due: form.deadline
        ? `Due ${form.deadline}`
        : 'No deadline',

      aiAnalysis: form.aiEnabled
        ? {
            status: 'pending',
          }
        : null,
    }
    console.log('New commitment:', newCommitment)
    const sessions = createSchedule(newCommitment,
      calendarEvents,
      scheduledSessions)

    console.log('Generated sessions:', sessions)
    setScheduledSessions((current) => [
      ...current,
      ...sessions,
    ])

    setCommitments([
      ...commitments,
      newCommitment,
    ])
    setShowAdd(false)    
  }

  const addCalendarEvent = (event) => {
    const newEvent = {
      id: Date.now(),
      ...event,
    }

    setCalendarEvents([
      ...calendarEvents,
      newEvent,
    ])

    setShowAdd(false)
    console.log('Calendar event:', newEvent)
  }
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
const commitmentsWithProgress = commitments.map(
  (commitment) => {
    const commitmentSessions =
      scheduledSessions.filter(
        (session) =>
          session.commitmentId === commitment.id
      )

    if (commitmentSessions.length === 0) {
      return commitment
    }

    const totalMinutes =
      commitmentSessions.reduce(
        (total, session) =>
          total + (session.estimatedMinutes || 0),
        0
      )

    const completedMinutes =
      commitmentSessions.reduce(
        (total, session) =>
          total + (session.completedMinutes || 0),
        0
      )

    const progress =
      totalMinutes > 0
        ? Math.round(
            (completedMinutes / totalMinutes) * 100
          )
        : 0

    return {
      ...commitment,
      progress: commitment.completed
        ? 100
        : progress,
    }
  }
)


  


  return (
    <div className="app">
      <TopNav
        currentPage={page}
        onNavigate={setPage}
        onAdd={() => setShowAdd(true)}
      />

      <main className="main-content">

      {selectedCommitment ? (
          <CommitmentDetail
            commitment={commitmentsWithProgress.find(
              (item) => item.id === selectedCommitment
            )}
            
            sessions={scheduledSessions.filter(
              (session) =>
                session.commitmentId === selectedCommitment
            )}
            onBack={() => setSelectedCommitment(null)}
            onUpdate={updateCommitment}
            onDelete={deleteCommitment}
            onToggleComplete={toggleCommitmentComplete}
            onUpdateSession={updateSession}
            onDeleteSession={deleteSession}
          />
        ) : (
        <>
          {page === 'today' && (
            <>
              <div className="dashboard-heading">
                <div>
                  <h1>Good afternoon.</h1>
          
                  <p className="subtitle">
                    {commitments.length} commitments · looking manageable.
                  </p>
                </div>
          
                <div className="dashboard-date">
                  <span>Tuesday</span>
                  <strong>September 29</strong>
                </div>
              </div>
          
              <div className="dashboard-layout">
                <div className="dashboard-primary">
                  <TodayCard
                    commitments={commitmentsWithProgress}
                    onOpenCommitment={setSelectedCommitment}
                  />

                  <EnergyCheckIn />
                </div>
          
                <IntelligencePanel />
              </div>
            </>
          )}

          {page === 'calendar' && (
            <Calendar
              events={calendarEvents}
              sessions={scheduledSessions}
              onUpdateEvent={updateCalendarEvent}
              onDeleteEvent={deleteCalendarEvent}
              onUpdateSession={updateSession}
              onDeleteSession={deleteSession}
            />
          )}
          {page === 'pressure' && (
            <Pressure commitments={commitmentsWithProgress} />
          )}
        </>
      )}

      </main>
      {showAdd && (
        <AddCommitment
          onClose={() => setShowAdd(false)}
          onSave={addCommitment}
          onSaveEvent={addCalendarEvent}

        />
      )}

    </div>
  )
}

export default App