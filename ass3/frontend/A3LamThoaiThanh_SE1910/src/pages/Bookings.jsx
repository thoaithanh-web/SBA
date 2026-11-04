// Author: Lam Thoai Thanh - CE190169
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api, message, money, today } from "../api";
import { useData } from "../hooks";
import { DataState, ErrorNote, Field, Search } from "../components/Common";

const statusNames = ["Đã hủy", "Đã xác nhận", "Hoàn tất"];

function BookingForm({ rooms, customers, record, roomId, onSave, onCancel }) {
  const [customerId, setCustomerId] = useState(record?.customerId || "");
  const [details, setDetails] = useState(() => record?.details || [
    { roomId: roomId || "", startDate: today(), endDate: "" },
  ]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  function change(index, key, value) {
    setDetails((rows) => rows.map((row, position) => position === index ? { ...row, [key]: value } : row));
  }
  async function save(event) {
    event.preventDefault();
    setError("");
    if (new Set(details.map((stay) => Number(stay.roomId))).size !== details.length) {
      setError("Mỗi phòng chỉ được chọn một lần.");
      return;
    }
    if (details.some((stay) => stay.endDate <= stay.startDate)) {
      setError("Ngày trả phải sau ngày nhận phòng.");
      return;
    }
    setPending(true);
    try {
      await onSave({
        customerId: customers ? Number(customerId) : null,
        details: details.map((stay) => ({
          roomId: Number(stay.roomId), startDate: stay.startDate, endDate: stay.endDate,
        })),
      });
    } catch (failure) {
      setError(message(failure));
    } finally {
      setPending(false);
    }
  }
  const estimate = details.reduce((sum, stay) => {
    const days = (Date.parse(stay.endDate) - Date.parse(stay.startDate)) / 86400000;
    const price = record?.details.find((item) => item.roomId === Number(stay.roomId))?.actualPrice ??
      rooms.find((room) => room.id === Number(stay.roomId))?.pricePerDay;
    return Number.isFinite(days) && days > 0 && price ? sum + days * price : sum;
  }, 0);
  return <form className="form-panel" onSubmit={save}>
    <ErrorNote>{error}</ErrorNote>
    <fieldset disabled={pending}>
      {customers && <Field label="Khách hàng"><select required value={customerId}
        onChange={(event) => setCustomerId(event.target.value)}>
        <option value="">Chọn khách hàng</option>
        {customers.filter((customer) => customer.active).map((customer) =>
          <option key={customer.id} value={customer.id}>{customer.fullName} · {customer.email}</option>)}
      </select></Field>}
      {details.map((stay, index) => <section className="stay" key={index}>
        <h3>Phòng {index + 1}</h3>
        <div className="form-grid">
          <Field label="Chọn phòng"><select required value={stay.roomId}
            onChange={(event) => change(index, "roomId", event.target.value)}>
            <option value="">Chọn số phòng</option>
            {rooms.filter((room) => room.active || record?.details.some((item) => item.roomId === room.id)).map((room) =>
              <option key={room.id} value={room.id}>{room.number} · {room.typeName} · {money(room.pricePerDay)}/đêm</option>)}
          </select></Field>
          <Field label="Ngày nhận phòng" type="date" required min={customers ? undefined : today()}
            value={stay.startDate} onChange={(event) => change(index, "startDate", event.target.value)} />
          <Field label="Ngày trả phòng" type="date" required value={stay.endDate}
            onChange={(event) => change(index, "endDate", event.target.value)} />
        </div>
        {details.length > 1 && <button type="button" className="secondary"
          onClick={() => setDetails((rows) => rows.filter((_, position) => position !== index))}>Bỏ phòng {index + 1}</button>}
      </section>)}
      <div className="actions"><button type="button" className="secondary" disabled={details.length >= 20}
        onClick={() => setDetails((rows) => [...rows, { roomId: "", startDate: today(), endDate: "" }])}>Thêm phòng vào đơn</button></div>
      <p className="estimate">Tạm tính <strong>{money(estimate)}</strong></p>
      <div className="actions"><button>{pending ? "Đang lưu…" : record ? "Lưu đơn" : "Xác nhận đặt phòng"}</button>
        {onCancel && <button type="button" className="secondary" onClick={onCancel}>Đóng</button>}</div>
    </fieldset>
  </form>;
}

export function BookRoom() {
  const [query] = useSearchParams();
  const rooms = useData("/public/rooms");
  const navigate = useNavigate();
  return <section><h1>Đặt phòng</h1><p>Bạn có thể chọn nhiều phòng trong cùng một đơn.</p>
    <DataState state={rooms}>{(list) => list.length ? <BookingForm rooms={list}
      roomId={list.some((room) => String(room.id) === query.get("room")) ? query.get("room") : ""}
      onSave={async (input) => {
        const { data } = await api.post("/customer/bookings", input);
        navigate("/history", { state: { created: data.id } });
      }} /> : <p>Hiện chưa có phòng hoạt động.</p>}</DataState>
  </section>;
}

function StaffBookingEditor({ record, onSave, onCancel }) {
  const rooms = useData("/staff/rooms");
  const customers = useData("/staff/customers");
  return <DataState state={rooms}>{(roomList) => <DataState state={customers}>{(customerList) =>
    <BookingForm rooms={roomList} customers={customerList} record={record.id ? record : null}
      onSave={onSave} onCancel={onCancel} />
  }</DataState>}</DataState>;
}

export function BookingList({ staff, created }) {
  const endpoint = staff ? "/staff/bookings" : "/customer/bookings";
  const [query, setQuery] = useState("");
  const list = useData(endpoint + "?" + new URLSearchParams({ q: query }));
  const [editor, setEditor] = useState(null);
  const [change, setChange] = useState(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState(created ? "Đã đặt phòng thành công. Mã đơn #" + created : "");
  async function save(input) {
    if (editor.id) await api.put(endpoint + "/" + editor.id, input);
    else await api.post(endpoint, input);
    setEditor(null);
    setNotice("Đã lưu đơn đặt phòng.");
    list.reload();
  }
  async function updateStatus() {
    setPending(true);
    setError("");
    try {
      const path = endpoint + "/" + change.id;
      if (change.status === 0) await api.delete(path);
      else await api.put(path + "/status", { status: change.status });
      setChange(null);
      setNotice("Đã cập nhật trạng thái đơn.");
      list.reload();
    } catch (failure) {
      setError(message(failure));
    } finally {
      setPending(false);
    }
  }
  return <section>
    <div className="section-heading"><h1>{staff ? "Quản lý đơn đặt phòng" : "Lịch sử đặt phòng"}</h1>
      {staff ? <button onClick={() => { setEditor({}); setChange(null); }}>Tạo đơn tại quầy</button> :
        <Link className="button" to="/booking">Đặt phòng</Link>}</div>
    <Search onSearch={setQuery} placeholder={staff ? "Tìm mã đơn hoặc tên khách" : "Tìm mã đơn"} />
    {notice && <p className="notice" role="status">{notice}</p>}
    {editor && <section><h2>{editor.id ? "Sửa đơn #" + editor.id : "Đặt phòng tại quầy"}</h2>
      <StaffBookingEditor key={editor.id || "new"} record={editor} onSave={save} onCancel={() => setEditor(null)} /></section>}
    {change && <section className="form-panel"><h2>{change.status === 0 ? "Xác nhận hủy đơn" : "Xác nhận hoàn tất đơn"} #{change.id}</h2>
      <ErrorNote>{error}</ErrorNote><div className="actions">
        <button disabled={pending} onClick={updateStatus}>Xác nhận</button>
        <button className="secondary" disabled={pending} onClick={() => setChange(null)}>Đóng</button>
      </div></section>}
    <DataState state={list}>{(bookings) => bookings.length ? <div className="booking-list">
      {bookings.map((booking) => <article className="booking-card" key={booking.id}>
        <div className="section-heading"><h2>Đơn #{booking.id}</h2>
          <span className={"badge " + (booking.status === 0 ? "muted" : "")}>{statusNames[booking.status]}</span></div>
        <p>{booking.customerName} · Ngày tạo {booking.bookingDate} · <strong>{money(booking.totalPrice)}</strong></p>
        <details><summary>Chi tiết {booking.details.length} phòng</summary>
          <ul>{booking.details.map((stay) => <li key={stay.roomId}>
            Phòng {stay.roomNumber} · {stay.startDate} → {stay.endDate} · {money(stay.actualPrice)}/đêm
          </li>)}</ul>
        </details>
        {staff && booking.status === 1 && <div className="actions">
          <button className="secondary" onClick={() => { setChange(null); setEditor(booking); }}>Sửa đơn</button>
          <button className="secondary" onClick={() => { setEditor(null); setError(""); setChange({ id: booking.id, status: 2 }); }}>Hoàn tất</button>
          <button className="secondary" onClick={() => { setEditor(null); setError(""); setChange({ id: booking.id, status: 0 }); }}>Hủy đơn</button>
        </div>}
      </article>)}
    </div> : <p>Không có đơn đặt phòng phù hợp.</p>}</DataState>
  </section>;
}
