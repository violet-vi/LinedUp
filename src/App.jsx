import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

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
  useEffect(() => {
    const loadData = async () => {
      const [
        commitmentsResult,
        eventsResult,
        sessionsResult,
      ] = await Promise.all([
        supabase
          .from('commitments')
          .select('*')
          .order('created_at'),

        supabase
          .from('calendar_events')
          .select('*')
          .order('created_at'),

        supabase
          .from('scheduled_sessions')
          .select('*')
          .order('session_date'),
      ])

      if (commitmentsResult.error) {
        console.error(
          'Commitments error:',
          commitmentsResult.error
        )
      }

      if (eventsResult.error) {
        console.error(
          'Events error:',
          eventsResult.error
        )
      }

      if (sessionsResult.error) {
        console.error(
          'Sessions error:',
          sessionsResult.error
        )
      }

      if (commitmentsResult.data) {
        const formattedCommitments =
          commitmentsResult.data.map((item) => ({
            id: item.id,
            title: item.title,
            type: item.type,
            deadline: item.deadline,

            personalDifficulty:
              item.personal_difficulty,

            estimatedHours:
              item.estimated_hours,

            preferredTime:
              item.preferred_time,

            description:
              item.description,

            aiEnabled:
              item.ai_enabled,

            aiAnalysis:
              item.ai_analysis,

            completed:
              item.completed,

            progress: 0,

            detail: item.estimated_hours
              ? `${item.estimated_hours}h estimated`
              : 'Not scheduled yet',

            due: item.deadline
              ? `Due ${item.deadline}`
              : 'No deadline',
          }))

        setCommitments(formattedCommitments)
      }

      if (eventsResult.data) {
        const formattedEvents =
          eventsResult.data.map((item) => ({
            id: item.id,
            title: item.title,
            kind: item.kind,
            recurrence: item.recurrence,
            date: item.event_date,
            start: item.start_time,
            end: item.end_time,
            days: item.days || [],
          }))

        setCalendarEvents(formattedEvents)
      }

      if (sessionsResult.data) {
        const formattedSessions =
          sessionsResult.data.map((item) => ({
            id: item.id,

            commitmentId:
              item.commitment_id,

            title: item.title,
            type: item.type,

            date:
              item.session_date,

            start:
              item.start_time,

            durationMinutes:
              item.duration_minutes,

            estimatedMinutes:
              item.estimated_minutes,

            completedMinutes:
              item.completed_minutes,

            flexible:
              item.flexible,

            kind: 'session',
          }))

        setScheduledSessions(
          formattedSessions
        )
      }
    }

    loadData()
  }, [])
    
  const [page, setPage] = useState('today')
  const [scheduledSessions, setScheduledSessions] = useState([])
  const [selectedCommitment, setSelectedCommitment] = useState(null)
  const [calendarEvents, setCalendarEvents] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [commitments, setCommitments] = useState([])
  const addCommitment =  async (form) => {
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
    
    const { error: commitmentError } =
      await supabase
        .from('commitments')
        .insert({
          id: newCommitment.id,
          title: newCommitment.title,
          type: newCommitment.type,
        
          deadline:
            newCommitment.deadline || null,
        
          personal_difficulty:
            newCommitment.personalDifficulty,
        
          estimated_hours:
            newCommitment.estimatedHours
              ? Number(newCommitment.estimatedHours)
              : null,
        
          preferred_time:
            newCommitment.preferredTime,
        
          description:
            newCommitment.description,
        
          ai_enabled:
            newCommitment.aiEnabled,
        
          completed: false,
        
          ai_analysis:
            newCommitment.aiAnalysis,
        })
      
    if (commitmentError) {
      console.error(
        'Could not save commitment:',
        commitmentError
      )
    
      return
    }
    if (sessions.length > 0) {
      const databaseSessions =
        sessions.map((session) => ({
          id: session.id,
        
          commitment_id:
            session.commitmentId,
        
          title: session.title,
          type: session.type,
        
          session_date:
            session.date,
        
          start_time:
            session.start,
        
          duration_minutes:
            session.durationMinutes,
        
          estimated_minutes:
            session.estimatedMinutes,
        
          completed_minutes:
            session.completedMinutes,
        
          flexible:
            session.flexible,
        }))
      
      const { error: sessionsError } =
        await supabase
          .from('scheduled_sessions')
          .insert(databaseSessions)
      
      if (sessionsError) {
        console.error(
          'Could not save sessions:',
          sessionsError
        )
      }
    }

    console.log('Generated sessions:', sessions)
    setScheduledSessions((current) => [
      ...current,
      ...sessions,
    ])

    setCommitments((current) =>[
      ...current,
      newCommitment,
    ])
    setShowAdd(false)    
  }

  const addCalendarEvent = async (event) => {
    const newEvent = {
      id: Date.now(),
      ...event,
    }
    
    const { error } = await supabase
      .from('calendar_events')
      .insert({
        id: newEvent.id,
      
        title: newEvent.title,
        kind: newEvent.kind,
      
        recurrence:
          newEvent.recurrence || 'weekly',
      
        event_date:
          newEvent.date || null,
      
        start_time:
          newEvent.start,
      
        end_time:
          newEvent.end,
      
        days:
          newEvent.days || [],
      })
    
    if (error) {
      console.error(
        'Could not save calendar event:',
        error
      )
    
      return
    }
    
    setCalendarEvents((current) => [
      ...current,
      newEvent,
    ])
    
    setShowAdd(false)
  }
    const updateCommitment = async (updatedCommitment) => {
  const { error } = await supabase
    .from('commitments')
    .update({
      title: updatedCommitment.title,
      type: updatedCommitment.type,
      deadline: updatedCommitment.deadline || null,
      personal_difficulty:
        updatedCommitment.personalDifficulty,
      estimated_hours:
        updatedCommitment.estimatedHours
          ? Number(updatedCommitment.estimatedHours)
          : null,
      preferred_time:
        updatedCommitment.preferredTime,
      description:
        updatedCommitment.description,
      ai_enabled:
        updatedCommitment.aiEnabled,
      completed:
        updatedCommitment.completed,
      ai_analysis:
        updatedCommitment.aiAnalysis,
    })
    .eq('id', updatedCommitment.id)

  if (error) {
    console.error('Update commitment failed:', error)
    return
  }

  setCommitments((current) =>
    current.map((commitment) =>
      commitment.id === updatedCommitment.id
        ? updatedCommitment
        : commitment
    )
  )
}

const deleteCommitment = async (commitmentId) => {
  const { error } = await supabase
    .from('commitments')
    .delete()
    .eq('id', commitmentId)

  if (error) {
    console.error('Delete commitment failed:', error)
    return
  }

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

const toggleCommitmentComplete = async (commitmentId) => {
  const commitment = commitments.find(
    (item) => item.id === commitmentId
  )

  if (!commitment) return

  const newCompleted = !commitment.completed

  const { error } = await supabase
    .from('commitments')
    .update({
      completed: newCompleted,
    })
    .eq('id', commitmentId)

  if (error) {
    console.error('Completion update failed:', error)
    return
  }

  setCommitments((current) =>
    current.map((item) =>
      item.id === commitmentId
        ? {
            ...item,
            completed: newCompleted,
          }
        : item
    )
  )
}

const updateSession = async (sessionId, changes) => {
  const databaseChanges = {}

  if (changes.date !== undefined) {
    databaseChanges.session_date =
      changes.date
  }

  if (changes.start !== undefined) {
    databaseChanges.start_time =
      changes.start
  }

  if (changes.completedMinutes !== undefined) {
    databaseChanges.completed_minutes =
      changes.completedMinutes
  }

  const { error } = await supabase
    .from('scheduled_sessions')
    .update(databaseChanges)
    .eq('id', sessionId)

  if (error) {
    console.error('Session update failed:', error)
    return
  }

  setScheduledSessions((current) =>
    current.map((session) =>
      session.id === sessionId
        ? {
            ...session,
            ...changes,
          }
        : session
    )
  )
}

const deleteSession = async (sessionId) => {
  const { error } = await supabase
    .from('scheduled_sessions')
    .delete()
    .eq('id', sessionId)

  if (error) {
    console.error('Delete session failed:', error)
    return
  }

  setScheduledSessions((current) =>
    current.filter(
      (session) => session.id !== sessionId
    )
  )
}

const updateCalendarEvent = async (
  eventId,
  changes
) => {
  const databaseChanges = {}

  if (changes.title !== undefined) {
    databaseChanges.title = changes.title
  }

  if (changes.start !== undefined) {
    databaseChanges.start_time =
      changes.start
  }

  if (changes.end !== undefined) {
    databaseChanges.end_time =
      changes.end
  }

  if (changes.date !== undefined) {
    databaseChanges.event_date =
      changes.date || null
  }

  if (changes.days !== undefined) {
    databaseChanges.days = changes.days
  }

  const { error } = await supabase
    .from('calendar_events')
    .update(databaseChanges)
    .eq('id', eventId)

  if (error) {
    console.error('Event update failed:', error)
    return
  }

  setCalendarEvents((current) =>
    current.map((event) =>
      event.id === eventId
        ? {
            ...event,
            ...changes,
          }
        : event
    )
  )
}

const deleteCalendarEvent = async (eventId) => {
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', eventId)

  if (error) {
    console.error(
      'Delete event failed:',
      error
    )
    return
  }

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