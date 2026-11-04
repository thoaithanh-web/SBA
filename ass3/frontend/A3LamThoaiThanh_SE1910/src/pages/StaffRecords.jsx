// Author: Lam Thoai Thanh - CE190169
import { useState } from "react";
import { api, message, money } from "../api";
import { useData } from "../hooks";
import { DataState, ErrorNote, Field, Search } from "../components/Common";
import CustomerForm from "../components/CustomerForm";

function RoomForm({ record, onSave, onCancel }) {
  const types = useData("/public/room-types");
  const [form, setForm] = useState({
    number: record?.number || "", description: record?.description || "",
    capacity: record?.capacity ?? 2, typeId: record?.typeId ?? "",
    pricePerDay: record?.pricePerDay ?? "", active: record?.active ?? true,
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const bind = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) });
  async function save(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await onSave({ ...form, capacity: Number(form.capacity), typeId: Number(form.typeId), pricePerDay: Number(form.pricePerDay) });
    } catch (failure) {
      setError(message(failure));
    } finally {
      setPending(false);
    }
  }
  return <form className="form-panel" onSubmit={save}>
    <ErrorNote>{error}</ErrorNote>
    <fieldset disabled={pending}>
      <div className="form-grid">
        <Field label="Số phòng" required maxLength={50} {...bind("number")} />
        <Field label="Sức chứa" type="number" required min={1} max={100} {...bind("capacity")} />
        <DataState state={types}>{(options) => <Field label="Loại phòng"><select required {...bind("typeId")}>
          <option value="">Chọn loại phòng</option>
          {options.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
        </select></Field>}</DataState>
        <Field label="Giá mỗi đêm" type="number" required min={0.01} step="0.0001" {...bind("pricePerDay")} />
        <Field label="Mô tả"><textarea maxLength={220} {...bind("description")} /></Field>
        <label className="check"><input type="checkbox" checked={form.active}
          onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Đang hoạt động</label>
      </div>
      <div className="actions"><button disabled={!types.data}>Lưu phòng</button>
        <button className="secondary" type="button" onClick={onCancel}>Đóng</button></div>
    </fieldset>
  </form>;
}

export default function StaffRecords({ resource }) {
  const isRoom = resource === "rooms";
  const endpoint = "/staff/" + resource;
  const noun = isRoom ? "phòng" : "khách hàng";
  const [query, setQuery] = useState("");
  const list = useData(endpoint + "?" + new URLSearchParams({ q: query }));
  const [editor, setEditor] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const Editor = isRoom ? RoomForm : CustomerForm;
  async function save(input) {
    if (editor.id) await api.put(endpoint + "/" + editor.id, input);
    else await api.post(endpoint, input);
    setEditor(null);
    setNotice("Đã lưu " + noun + ".");
    list.reload();
  }
  async function remove() {
    setPending(true);
    setError("");
    try {
      await api.delete(endpoint + "/" + removing.id);
      setRemoving(null);
      setNotice("Đã xử lý yêu cầu xóa " + noun + ".");
      list.reload();
    } catch (failure) {
      setError(message(failure));
    } finally {
      setPending(false);
    }
  }
  return <section>
    <div className="section-heading"><h1>Quản lý {noun}</h1>
      <button onClick={() => { setEditor({}); setRemoving(null); }}>Thêm {noun}</button></div>
    <Search onSearch={setQuery} placeholder={isRoom ? "Tìm theo số phòng" : "Tìm theo tên hoặc email"} />
    {notice && <p role="status" className="notice">{notice}</p>}
    {editor && <section><h2>{editor.id ? "Sửa " : "Thêm "}{noun}</h2>
      <Editor key={editor.id || "new"} record={editor.id ? editor : null} staff onSave={save} onCancel={() => setEditor(null)} />
    </section>}
    {removing && <section className="form-panel">
      <h2>Xác nhận xóa {noun}</h2><p>{removing.number || removing.fullName}</p>
      <p>{isRoom ? "Phòng có chi tiết đặt sẽ chuyển sang ngừng hoạt động." : "Khách có lịch sử đặt sẽ chuyển sang ngừng hoạt động."}</p>
      <ErrorNote>{error}</ErrorNote>
      <div className="actions"><button className="danger" disabled={pending} onClick={remove}>Xác nhận xóa</button>
        <button className="secondary" disabled={pending} onClick={() => setRemoving(null)}>Hủy</button></div>
    </section>}
    <DataState state={list}>{(records) => records.length ? <div className="table-wrap"><table>
      <thead><tr>{(isRoom ? ["Số phòng", "Loại phòng", "Sức chứa", "Giá mỗi đêm"] : ["Họ tên", "Email", "Điện thoại", "Ngày sinh"])
        .map((label) => <th key={label}>{label}</th>)}<th>Trạng thái</th><th>Thao tác</th></tr></thead>
      <tbody>{records.map((row) => <tr key={row.id}>
        {(isRoom ? [row.number, row.typeName, row.capacity, money(row.pricePerDay)] :
          [row.fullName, row.email, row.telephone, row.birthday]).map((value, index) => <td key={index}>{value || "—"}</td>)}
        <td><span className={row.active ? "badge" : "badge muted"}>{row.active ? "Hoạt động" : "Ngừng hoạt động"}</span></td>
        <td className="row-actions"><button className="secondary" aria-label={"Sửa " + (row.number || row.fullName)}
          onClick={() => { setRemoving(null); setEditor(row); }}>Sửa</button>
          <button className="secondary" aria-label={"Xóa " + (row.number || row.fullName)}
            onClick={() => { setEditor(null); setRemoving(row); setError(""); }}>Xóa</button></td>
      </tr>)}</tbody>
    </table></div> : <p>Không có dữ liệu phù hợp.</p>}</DataState>
  </section>;
}
