import { useState } from 'react'

function EnergyCheckIn() {
  const [energy, setEnergy] = useState(3)

  const levels = [
    { value: 1, label: 'Barely here' },
    { value: 2, label: 'Low' },
    { value: 3, label: 'Okay' },
    { value: 4, label: 'Good' },
    { value: 5, label: "Let's cook" },
  ]

  return (
    <section className="energy-card">
      <p className="section-label">CHECK IN</p>

      <div className="energy-heading">
        <div>
          <h2>What's the battery looking like?</h2>
          <p>We'll keep today's plan realistic.</p>
        </div>

        <strong>{energy}/5</strong>
      </div>

      <div className="energy-options">
        {levels.map((level) => (
          <button
            key={level.value}
            className={
              energy === level.value
                ? 'energy-option selected'
                : 'energy-option'
            }
            onClick={() => setEnergy(level.value)}
          >
            <span>{level.value}</span>
            <small>{level.label}</small>
          </button>
        ))}
      </div>
    </section>
  )
}

export default EnergyCheckIn