import TopNav from './components/topNav'
import IntelligencePanel from './components/intelligencePanel'
import EnergyCheckIn from './components/energy'
import TodayCard from './components/todayCard'
import './App.css'

function App() {
  return (
    <div className="app">
      <TopNav />

      <main className="main-content">
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
          <TodayCard />
          <EnergyCheckIn />
        </div>

        <IntelligencePanel />

        </div>
      </main>
    </div>
  )
}

export default App