import { useState } from 'react'

function AgentPanel({ onSend }) {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()

    if (!message.trim() || loading) return

    setLoading(true)

    const result = await onSend(message)

    setReply(
      result ||
      'I could not understand that request.'
    )

    setMessage('')
    setLoading(false)
  }

  return (
    <section className="agent-panel">

      <div>
        <p className="section-label">
          ASK LINEDUP
        </p>

        <h2>Plans changed?</h2>

        <p className="subtitle">
          Tell LinedUp what changed.
        </p>
      </div>

      {reply && (
        <div className="agent-reply">
          {reply}
        </div>
      )}

      <form
        className="agent-form"
        onSubmit={submit}
      >
        <input
          type="text"
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          placeholder="e.g. I'm unavailable tonight after 7"
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Thinking…' : '→'}
        </button>
      </form>

    </section>
  )
}

export default AgentPanel