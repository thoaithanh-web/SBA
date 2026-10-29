// Author: Lam Thoai Thanh - CE190169
import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../api/client";
import Brand from "../components/Brand";
export default function EditorialLayout() {
  const { user, logout } = useAuth();
  const [error, setError] = useState("");
  const links =
    user.accountRole === 1
      ? [["accounts", "Accounts", "▦"]]
      : [
          ["news", "News articles", "▤"],
          ["categories", "Categories", "▦"],
          ["history", "My news history", "◷"],
          ["profile", "My profile", "○"],
        ];
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <p className="nav-caption">
          EDITORIAL DESK · {user.accountRole === 1 ? "ADMIN" : "STAFF"}
        </p>
        <nav aria-label="Workspace navigation">
          {links.map(([path, label, icon]) => (
            <NavLink key={path} to={"/workspace/" + path}>
              <span aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-note">
          <strong>{user.accountName}</strong>
          <p>{user.accountEmail}</p>
          <Link to="/">↗ Read campus news</Link>
          <button
            className="signout"
            onClick={async () => {
              try {
                await logout();
              } catch (e) {
                setError(errorMessage(e));
              }
            }}
          >
            Sign out
          </button>
          {error && <p role="alert">{error}</p>}
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span>FUNewsManagementSystem / Editorial workspace</span>
          <span className="course-label">ASSIGNMENT 02 · SE1910</span>
        </header>
        <Outlet />
        <footer>
          Lâm Thoại Thanh · CE190169
          <span>Spring Boot REST API · SQL Server</span>
        </footer>
      </div>
    </div>
  );
}
