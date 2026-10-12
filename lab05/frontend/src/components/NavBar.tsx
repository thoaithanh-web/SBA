import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="page-shell topbar">
      <NavLink className="brand" to="/" aria-label="Orchid Studio — trang chủ">
        <span className="brand-mark" aria-hidden="true">
          ✳
        </span>{" "}
        ORCHID <span className="brand-slash">/</span> STUDIO
      </NavLink>
      <nav aria-label="Điều hướng chính">
        <NavLink to="/" end>
          Bộ sưu tập
        </NavLink>
        <NavLink to="/orchids/new">
          Thêm hoa lan <span aria-hidden="true">↗</span>
        </NavLink>
      </nav>
    </header>
  );
}
