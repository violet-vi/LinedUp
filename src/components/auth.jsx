import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()

    setLoading(true)
    setMessage('')

    if (mode === 'signup') {
      const { error } =
        await supabase.auth.signUp({
          email,
          password,
        })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage(
          'Account created. Check your email if confirmation is required.'
        )
      }
    } else {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (error) {
        setMessage(error.message)
      }
    }

    setLoading(false)
  }

  return (
    <div className="auth-page">

      <form
        className="auth-card"
        onSubmit={submit}
      >
        <div className="auth-brand">
          linedup<span>.</span>
        </div>

        <h1>
          {mode === 'login'
            ? 'Welcome back.'
            : 'Create your account.'}
        </h1>

        <p className="subtitle">
          Your commitments, your schedule,
          your workspace.
        </p>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>Password</label>

          <input
            type="password"
            required
            minLength="6"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />
        </div>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <button
          className="save-button auth-submit"
          disabled={loading}
        >
          {loading
            ? 'Please wait...'
            : mode === 'login'
              ? 'Sign in'
              : 'Create account'}
        </button>

        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setMode(
              mode === 'login'
                ? 'signup'
                : 'login'
            )

            setMessage('')
          }}
        >
          {mode === 'login'
            ? 'New to LinedUp? Create an account'
            : 'Already have an account? Sign in'}
        </button>

      </form>

    </div>
  )
}

export default Auth