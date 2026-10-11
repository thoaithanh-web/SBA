import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Newspaper, Quote } from 'lucide-react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import Brand from '../components/Brand'

export default function LoginPage() {
  const { authenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')

  if (authenticated) return <Navigate to="/dashboard" replace />

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Enter both your username and password.')
      return
    }
    try {
      login(username, password)
      const destination = location.state?.from
      navigate(
        destination?.startsWith('/') && !destination.startsWith('//') ? destination : '/dashboard',
        { replace: true },
      )
    } catch (exception) {
      setError(exception.message)
    }
  }

  return (
    <div className="login-page">
      <section className="login-story" aria-label="Welcome to FU News">
        <Brand />
        <div className="story-copy">
          <span className="eyebrow light">
            <span className="live-dot" /> THE CAMPUS, CONNECTED
          </span>
          <h1>
            Every campus.
            <br />
            Every voice.
            <br />
            <em>One newsroom.</em>
          </h1>
          <p>
            A space for the stories, ideas and people
            <br className="d-none d-lg-block" /> that move our university forward.
          </p>
          <div className="story-illustration" aria-hidden="true">
            <div className="paper-back" />
            <div className="paper-front">
              <span>THE UNIVERSITY EDITION</span>
              <strong>
                Stories that
                <br />
                bring us together.
              </strong>
              <div className="paper-columns">
                <Newspaper size={54} strokeWidth={1} />
                <i />
                <i />
              </div>
              <div className="paper-lines" />
            </div>
            <div className="story-seal">
              FU
              <br />
              <span>NEWS</span>
            </div>
          </div>
        </div>
        <div className="story-footer">
          <Quote size={17} />
          <span>Good stories start with a curious mind.</span>
        </div>
      </section>
      <main className="login-main">
        <div className="login-topline">
          UNIVERSITY NEWS MANAGEMENT <span>EST. 2026</span>
        </div>
        <div className="login-form-wrap">
          <span className="eyebrow">YOUR EDITORIAL DESK</span>
          <h2>Welcome back.</h2>
          <p className="muted mb-4">Sign in to manage your campus stories.</p>
          {error && (
            <Alert variant="danger" role="alert">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="login-username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoFocus
                required
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="login-password">
              <Form.Label>Password</Form.Label>
              <div className="password-field">
                <Form.Control
                  type={visible ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={visible ? 'Hide password' : 'Show password'}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Form.Group>
            <Button type="submit" className="w-100 login-submit">
              Sign in <ArrowRight size={18} />
            </Button>
          </Form>
          <div className="demo-access">
            <span className="demo-icon">
              <Newspaper size={19} />
            </span>
            <div>
              <strong>Assignment demo access</strong>
              <p>
                Username <code>Admin</code>
                <span className="mx-2">/</span>Password <code>Admin</code>
              </p>
            </div>
          </div>
        </div>
        <footer className="login-footer">
          SBA301 · Assignment 01<span>Lâm Thoại Thanh · SE1910</span>
        </footer>
      </main>
    </div>
  )
}
