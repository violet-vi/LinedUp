function TopNav({ currentPage, onNavigate }) {
  return (
    <header className="top-nav">
      <div className="top-nav-inner">

        <button
          className="brand-button"
          onClick={() => onNavigate('today')}
        >
          linedup<span>.</span>
        </button>

        <nav className="nav-links">
          <button
            className={
              currentPage === 'today'
                ? 'nav-link active'
                : 'nav-link'
            }
            onClick={() => onNavigate('today')}
          >
            Today
          </button>

          <button
            className={
              currentPage === 'calendar'
                ? 'nav-link active'
                : 'nav-link'
            }
            onClick={() => onNavigate('calendar')}
          >
            Calendar
          </button>

          <button
            className={
              currentPage === 'pressure'
                ? 'nav-link active'
                : 'nav-link'
            }
            onClick={() => onNavigate('pressure')}
          >
            Pressure
          </button>

          <button className="add-nav-button">
            + Add
          </button>
        </nav>

      </div>
    </header>
  )
}

export default TopNav