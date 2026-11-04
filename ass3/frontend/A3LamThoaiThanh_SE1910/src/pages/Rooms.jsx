// Author: Lam Thoai Thanh - CE190169
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { money } from "../api";
import { useData } from "../hooks";
import { DataState, Field } from "../components/Common";

export function Rooms({ user }) {
  const [form, setForm] = useState({ q: "", startDate: "", endDate: "" });
  const [query, setQuery] = useState("");
  const result = useData("/public/rooms" + query);
  function search(event) {
    event.preventDefault();
    const entries = Object.entries(form).filter(([, value]) => value.trim());
    setQuery("?" + new URLSearchParams(entries));
  }
  const bind = (key) => ({ value: form[key], onChange: (event) => setForm({ ...form, [key]: event.target.value }) });
  return <>
    <section className="hero">
      <p className="eyebrow">FU MINI HOTEL · ĐẶT PHÒNG</p>
      <h1>Tìm phòng cho kỳ nghỉ của bạn</h1>
      <p>Xem loại phòng, sức chứa và giá mỗi đêm. Chọn ngày để kiểm tra phòng còn trống.</p>
    </section>
    <form className="filters" onSubmit={search}>
      <Field label="Số phòng" placeholder="Ví dụ 201" {...bind("q")} />
      <Field label="Ngày nhận" type="date" required={!!form.endDate} {...bind("startDate")} />
      <Field label="Ngày trả" type="date" required={!!form.startDate} {...bind("endDate")} />
      <button>Tìm phòng</button>
    </form>
    <h2>Danh sách phòng</h2>
    <DataState state={result}>{(rooms) => rooms.length ? <div className="room-grid">
      {rooms.map((room) => <article className="room-card" key={room.id}>
        <div className="room-banner"><span>{room.typeName}</span><strong>{room.number}</strong></div>
        <div className="room-copy"><h3>Phòng {room.number}</h3><p>{room.description}</p>
          <p>{room.capacity} khách · <strong>{money(room.pricePerDay)}</strong> / đêm</p>
          <Link to={"/rooms/" + room.id}>Xem chi tiết</Link>
        </div>
      </article>)}
    </div> : <p>Không tìm thấy phòng phù hợp.</p>}</DataState>
    {user?.role === "CUSTOMER" && <p><Link className="button" to="/booking">Đặt nhiều phòng</Link></p>}
  </>;
}

export function RoomDetail({ user }) {
  const { id } = useParams();
  const result = useData("/public/rooms/" + encodeURIComponent(id));
  return <><Link to="/">← Danh sách phòng</Link>
    <DataState state={result}>{(room) => <section className="form-panel detail">
      <p className="eyebrow">{room.typeName}</p><h1>Phòng {room.number}</h1>
      <p>{room.description}</p><p>Sức chứa tối đa {room.capacity} khách</p>
      <p><strong>{money(room.pricePerDay)}</strong> mỗi đêm</p>
      {user?.role !== "STAFF" && <Link className="button" to={user ? "/booking?room=" + room.id : "/login"}>Đặt phòng</Link>}
    </section>}</DataState>
  </>;
}
