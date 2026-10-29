// Author: Lam Thoai Thanh - CE190169
import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../api/client";
import Brand from "../components/Brand";
export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [visible, setVisible] = useState(false),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const home =
    user?.accountRole === 1 ? "/workspace/accounts" : "/workspace/news";
  const from = location.state?.from;
  const destination =
    typeof from === "string" &&
    from.startsWith("/workspace/") &&
    !from.startsWith("//")
      ? from
      : home;
  if (user) return <Navigate to={destination} replace />;
  async function submit(e) {
    e.preventDefault();
    if (pending) return;
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setPending(true);
    try {
      await login(email.trim(), password);
    } catch (ex) {
      setError(errorMessage(ex));
    } finally {
      setPending(false);
    }
  }
  return (
    <main className="login-shell">
      <section className="login-story">
        <Brand />
        <div>
          <p className="eyebrow">A PLACE FOR EVERY VOICE</p>
          <h1>
            Good stories
            <br />
            start with
            <br />
            <em>your campus.</em>
          </h1>
          <p>
            Connect people, share ideas, and make room
            <br />
            for the stories that matter.
          </p>
        </div>
        <span>SBA301 · LÂM THOẠI THANH · CE190169</span>
      </section>
      <section className="login-form">
        <Link className="back-link" to="/">
          ← Back to campus news
        </Link>
        <p className="eyebrow">YOUR EDITORIAL DESK</p>
        <h2>Welcome back.</h2>
        <p className="subtitle">Sign in with your university news account.</p>
        {error && (
          <Alert variant="danger" role="alert">
            {error}
          </Alert>
        )}
        <Form onSubmit={submit} noValidate>
          <Form.Group controlId="loginEmail" className="mb-4">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={70}
              disabled={pending}
            />
          </Form.Group>
          <Form.Group controlId="loginPassword" className="mb-4">
            <Form.Label>Password</Form.Label>
            <div className="password-field">
              <Form.Control
                type={visible ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={pending}
              />
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? "Hide" : "Show"}
              </button>
            </div>
          </Form.Group>
          <Button type="submit" disabled={pending} className="w-100">
            {pending ? "Signing in…" : "Sign in →"}
          </Button>
        </Form>
        <p className="login-note">
          Classroom demo accounts are listed in the project README.
          <br />
          Public news is always available without signing in.
        </p>
      </section>
    </main>
  );
}
