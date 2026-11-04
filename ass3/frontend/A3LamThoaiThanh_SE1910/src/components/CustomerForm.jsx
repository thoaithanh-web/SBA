// Author: Lam Thoai Thanh - CE190169
import { useState } from "react";
import { message, today } from "../api";
import { ErrorNote, Field } from "./Common";

export default function CustomerForm({ record, staff, onSave, onCancel, submit = "Lưu thông tin" }) {
  const [form, setForm] = useState({
    fullName: record?.fullName || "", email: record?.email || "",
    telephone: record?.telephone || "", birthday: record?.birthday || "",
    password: "", active: record?.active ?? true,
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const bind = (key) => ({ value: form[key], onChange: (event) => setForm({ ...form, [key]: event.target.value }) });
  async function save(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await onSave({ ...form, birthday: form.birthday || null });
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
        <Field label="Họ và tên" required maxLength={50} {...bind("fullName")} />
        <Field label="Email" type="email" required maxLength={50} {...bind("email")} />
        <Field label="Điện thoại" type="tel" maxLength={12} {...bind("telephone")} />
        <Field label="Ngày sinh" type="date" max={today()} {...bind("birthday")} />
        <Field label={record ? "Mật khẩu mới (tùy chọn)" : "Mật khẩu"} type="password"
          required={!record} minLength={8} maxLength={72} autoComplete="new-password" {...bind("password")} />
        {staff && <label className="check"><input type="checkbox" checked={form.active}
          onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Đang hoạt động</label>}
      </div>
      <div className="actions"><button>{pending ? "Đang lưu…" : submit}</button>
        {onCancel && <button type="button" className="secondary" onClick={onCancel}>Đóng</button>}</div>
    </fieldset>
  </form>;
}
