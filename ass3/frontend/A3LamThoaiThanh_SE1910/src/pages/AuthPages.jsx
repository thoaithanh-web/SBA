// Author: Lam Thoai Thanh - CE190169
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, message } from "../api";
import { ErrorNote, Field } from "../components/Common";
import CustomerForm from "../components/CustomerForm";

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  async function login(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email: email.trim(), password });
      onLogin(data);
      navigate(data.role === "STAFF" ? "/staff/bookings" : "/booking", { replace: true });
    } catch (failure) {
      setError(message(failure));
    } finally {
      setPending(false);
    }
  }
  return <section className="auth-page">
    <h1>Đăng nhập</h1><p>Dùng tài khoản khách hàng hoặc nhân viên.</p>
    <form className="form-panel" onSubmit={login}>
      <ErrorNote>{error}</ErrorNote>
      <Field label="Email" type="email" required maxLength={50} autoComplete="username"
        value={email} onChange={(event) => setEmail(event.target.value)} />
      <Field label="Mật khẩu" type="password" required autoComplete="current-password"
        value={password} onChange={(event) => setPassword(event.target.value)} />
      <button disabled={pending}>{pending ? "Đang đăng nhập…" : "Đăng nhập"}</button>
    </form>
    <p>Chưa có tài khoản? <Link to="/register">Đăng ký khách hàng</Link></p>
  </section>;
}

export function RegisterPage() {
  const navigate = useNavigate();
  return <section><h1>Đăng ký khách hàng</h1>
    <CustomerForm submit="Tạo tài khoản" onSave={async (form) => {
      await api.post("/auth/register", form);
      navigate("/login", { replace: true });
    }} />
  </section>;
}
