function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        linedup<span>.</span>
      </div>

      <nav className="nav">
        <button className="nav-item active">
          Today
        </button>

        <button className="nav-item">
          Calendar
        </button>

        <button className="nav-item">
          Pressure
        </button>

        <button className="nav-item">
          Commitments
        </button>
      </nav>

      <div className="sidebar-bottom">
        <button className="add-button">
          + Add commitment
        </button>
      </div>
    </aside>
  )
}

export default Sidebar