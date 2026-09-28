import { useState } from 'react'

function AddCommitment({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    type: 'assignment',
    deadline: '',
    personalDifficulty: 3,
    estimatedHours: '',
    preferredTime: 'anytime',
    description: '',
    aiEnabled: true,
  })

  const updateField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.title.trim()) {
      return
    }

    onSave(form)
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form
        className="add-modal"
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="section-label">NEW COMMITMENT</p>
            <h2>What's coming up?</h2>
            <p>
              Give LinedUp the basics. You can always change them later.
            </p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="type-selector">
          {[
            ['assignment', 'Assignment'],
            ['exam', 'Exam'],
            ['career', 'Career'],
            ['club', 'Club'],
            ['personal', 'Personal'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={
                form.type === value
                  ? `type-button selected ${value}`
                  : 'type-button'
              }
              onClick={() => updateField('type', value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="form-group">
          <label>Title</label>

          <input
            type="text"
            value={form.title}
            onChange={(event) =>
              updateField('title', event.target.value)
            }
            placeholder="e.g. DSA Assignment 4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Deadline</label>

            <input
              type="date"
              value={form.deadline}
              onChange={(event) =>
                updateField('deadline', event.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Estimated work</label>

            <div className="hours-input">
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={form.estimatedHours}
                onChange={(event) =>
                  updateField(
                    'estimatedHours',
                    event.target.value
                  )
                }
                placeholder="4"
              />

              <span>hours</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>
            How difficult does this feel to you?
          </label>

          <div className="difficulty-options">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                type="button"
                className={
                  form.personalDifficulty === level
                    ? 'difficulty-button selected'
                    : 'difficulty-button'
                }
                onClick={() =>
                  updateField('personalDifficulty', level)
                }
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>When do you prefer working on this?</label>

          <select
            value={form.preferredTime}
            onChange={(event) =>
              updateField('preferredTime', event.target.value)
            }
          >
            <option value="anytime">Anytime</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description / requirements</label>

          <textarea
            rows="4"
            value={form.description}
            onChange={(event) =>
              updateField('description', event.target.value)
            }
            placeholder="Paste assignment instructions, syllabus, internship requirements..."
          />
        </div>

        <div className="ai-setting">
          <div>
            <strong>LinedUp AI analysis</strong>

            <p>
              Estimate complexity and workload, suggest subtasks,
              and help build a realistic schedule.
            </p>
          </div>

          <button
            type="button"
            className={`toggle ${form.aiEnabled ? 'on' : ''}`}
            onClick={() =>
              updateField('aiEnabled', !form.aiEnabled)
            }
          >
            <span />
          </button>
        </div>

        {form.aiEnabled && (
          <div className="ai-upload">
            <div>
              <strong>Have the actual brief?</strong>
              <p>
                PDF analysis is coming next. For now, paste its
                contents above.
              </p>
            </div>

            <button type="button" disabled>
              Upload PDF
            </button>
          </div>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button type="submit" className="save-button">
            Add commitment →
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCommitment