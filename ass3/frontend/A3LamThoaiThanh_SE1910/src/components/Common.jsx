// Author: Lam Thoai Thanh - CE190169
import { cloneElement, useId, useState } from "react";

export function ErrorNote({ children }) {
  return children ? <p className="error" role="alert">{children}</p> : null;
}

export function DataState({ state, children }) {
  if (state.error) return <><ErrorNote>{state.error}</ErrorNote><button onClick={state.reload}>Thử lại</button></>;
  if (state.data === null) return <p role="status">Đang tải dữ liệu…</p>;
  return children(state.data);
}

export function Search({ onSearch, placeholder }) {
  const [value, setValue] = useState("");
  return <form className="search" onSubmit={(event) => { event.preventDefault(); onSearch(value.trim()); }}>
    <input aria-label="Từ khóa tìm kiếm" placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} />
    <button>Tìm kiếm</button>
    <button type="button" className="secondary" onClick={() => { setValue(""); onSearch(""); }}>Xóa lọc</button>
  </form>;
}

export function Field({ label, children, ...props }) {
  const id = useId();
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    {children ? cloneElement(children, { id }) : <input id={id} {...props} />}
  </div>;
}
