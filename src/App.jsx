import { useState } from 'react'

import AddCommitment from './components/addCommitment'
import TopNav from './components/topNav'
import IntelligencePanel from './components/intelligencePanel'
import CommitmentDetail from './pages/CommitmentDetail'
import EnergyCheckIn from './components/energy'
import TodayCard from './components/todayCard'

import './App.css'

function App() {
  const [selectedCommitment, setSelectedCommitment] = useState(null)
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

    setCommitments([
      ...commitments,
      newCommitment,
    ])

    setShowAdd(false)
  }


  return (
    <div className="app">
      <TopNav onAdd={() => setShowAdd(true)} />

      <main className="main-content">

        {selectedCommitment ? (

          <CommitmentDetail
            onBack={() => setSelectedCommitment(null)}
          />

        ) : (

          <>
            <div className="dashboard-heading">
              <div>
                <h1>Good afternoon.</h1>

                <p className="subtitle">
                  3 tasks · 2h 15m planned · looking manageable.
                </p>
              </div>

              <div className="dashboard-date">
                <span>Sunday</span>
                <strong>September 28</strong>
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

      </main>

      {showAdd && (
        <AddCommitment
          onClose={() => setShowAdd(false)}
          onSave={addCommitment}
        />
      )}

    </div>
  )
}

export default App