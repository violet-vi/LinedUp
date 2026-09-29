import { useState } from 'react'

import createSchedule from './utils/scheduler'
import Calendar from './pages/calendar'
import AddCommitment from './components/addCommitment'
import TopNav from './components/topNav'
import IntelligencePanel from './components/intelligencePanel'
import CommitmentDetail from './pages/CommitmentDetail'
import EnergyCheckIn from './components/energy'
import TodayCard from './components/todayCard'

import './App.css'

function App() {
  const [scheduledSessions, setScheduledSessions] = useState([])
  const [selectedCommitment, setSelectedCommitment] = useState(null)
  const [calendarEvents, setCalendarEvents] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [page, setPage] = useState('today')
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
    const sessions = createSchedule(newCommitment)

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
  


  return (
    <div className="app">
      <TopNav 
        currentPage={page}
        onNavigate={setPage}
        onAdd={() => setShowAdd(true)} />

      <main className="main-content">

      {selectedCommitment ? (
        <CommitmentDetail
          onBack={() => setSelectedCommitment(null)}
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
                    commitments={commitments}
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
            />
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