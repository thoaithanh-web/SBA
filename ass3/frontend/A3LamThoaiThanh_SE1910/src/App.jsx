// Author: Lam Thoai Thanh - CE190169
import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { api } from "./api";
import { useData } from "./hooks";
import { DataState } from "./components/Common";
import CustomerForm from "./components/CustomerForm";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import { Rooms, RoomDetail } from "./pages/Rooms";
import StaffRecords from "./pages/StaffRecords";
import { BookRoom, BookingList } from "./pages/Bookings";

function Profile() {
  const profile = useData("/customer/profile");
  const [notice, setNotice] = useState("");
  return <section><h1>Hồ sơ của tôi</h1>
    {notice && <p className="notice" role="status">{notice}</p>}
    <DataState state={profile}>{(record) => <CustomerForm record={record} onSave={async (input) => {
      await api.put("/customer/profile", input);
      setNotice("Đã cập nhật hồ sơ.");
      profile.reload();
    }} />}</DataState>
  </section>;
}

function History() {
  const location = useLocation();
  return <BookingList created={location.state?.created} />;
}

function currentUser() {
  try {
    return sessionStorage.getItem("hotel-token") ? JSON.parse(sessionStorage.getItem("hotel-user")) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(currentUser);
  useEffect(() => {
    const clear = () => setUser(null);
    window.addEventListener("hotel-session-ended", clear);
    return () => window.removeEventListener("hotel-session-ended", clear);
  }, []);
  function login({ token, role, name }) {
    sessionStorage.setItem("hotel-token", token);
    sessionStorage.setItem("hotel-user", JSON.stringify({ role, name }));
    setUser({ role, name });
  }
  function logout() {
    sessionStorage.removeItem("hotel-token");
    sessionStorage.removeItem("hotel-user");
    setUser(null);
  }
  function protect(role, content) {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== role) return <Navigate to="/" replace />;
    return content;
  }
  return <>
    <header><div className="header-inner">
      <Link className="brand" to="/"><span>FU</span> Mini Hotel</Link>
      <nav aria-label="Điều hướng">
        <NavLink to="/" end>Phòng</NavLink>
        {user?.role === "STAFF" && <>
          <NavLink to="/staff/rooms">Quản lý phòng</NavLink>
          <NavLink to="/staff/customers">Khách hàng</NavLink>
          <NavLink to="/staff/bookings">Đơn đặt phòng</NavLink>
        </>}
        {user?.role === "CUSTOMER" && <>
          <NavLink to="/booking">Đặt phòng</NavLink>
          <NavLink to="/history">Lịch sử</NavLink>
          <NavLink to="/profile">Hồ sơ</NavLink>
        </>}
        {user ? <button className="secondary" onClick={logout}>Đăng xuất</button> :
          <NavLink to="/login">Đăng nhập</NavLink>}
      </nav>
    </div></header>
    <main>
      {user && <p className="identity">{user.name} · {user.role === "STAFF" ? "Nhân viên" : "Khách hàng"}</p>}
      <Routes>
        <Route path="/" element={<Rooms user={user} />} />
        <Route path="/rooms/:id" element={<RoomDetail user={user} />} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={login} />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
        <Route path="/booking" element={protect("CUSTOMER", <BookRoom />)} />
        <Route path="/history" element={protect("CUSTOMER", <History />)} />
        <Route path="/profile" element={protect("CUSTOMER", <Profile />)} />
        <Route path="/staff/rooms" element={protect("STAFF", <StaffRecords key="rooms" resource="rooms" />)} />
        <Route path="/staff/customers" element={protect("STAFF", <StaffRecords key="customers" resource="customers" />)} />
        <Route path="/staff/bookings" element={protect("STAFF", <BookingList staff />)} />
        <Route path="*" element={<><h1>Không tìm thấy trang</h1><Link to="/">Về trang chủ</Link></>} />
      </Routes>
    </main>
    <footer>FU Mini Hotel · SBA301 Assignment 03 · Lâm Thoại Thanh · CE190169</footer>
  </>;
}
