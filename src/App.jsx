import Sidebar from './components/sidebar'
import TodayCard from './components/todayCard'
import './App.css'

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <p className="eyebrow">SUNDAY, SEPTEMBER 28</p>

        <h1>Good afternoon.</h1>

        <p className="subtitle">
          Here's what your day looks like.
        </p>

        <div className="dashboard-grid">
          <TodayCard />
        </div>
      </main>
    </div>
  )
}

export default App