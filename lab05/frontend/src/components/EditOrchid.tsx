import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createOrchid,
  getOrchid,
  requestError,
  updateOrchid,
} from "../services/orchidApi";
import { isValidId } from "../types";
import type { OrchidDraft } from "../types";

const emptyForm: OrchidDraft = {
  orchidName: "",
  natural: false,
  orchidDescription: "",
  orchidCategory: "",
  attractive: false,
  orchidURL: "",
};

export default function EditOrchid({
  createMode = false,
}: {
  createMode?: boolean;
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<OrchidDraft>(emptyForm);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<{
    id: string;
    error: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    if (!createMode && isValidId(id)) {
      getOrchid(id, controller.signal)
        .then((response) => {
          if (!controller.signal.aborted) {
            const orchid = response.data;
            setForm({
              orchidName: orchid.orchidName,
              natural: orchid.natural,
              attractive: orchid.attractive,
              orchidDescription: orchid.orchidDescription ?? "",
              orchidCategory: orchid.orchidCategory ?? "",
              orchidURL: orchid.orchidURL ?? "",
            });
            setLoadedId(id);
          }
        })
        .catch((exception) => {
          if (!controller.signal.aborted)
            setLoadError({ id, error: requestError(exception) });
        });
    }
    return () => controller.abort();
  }, [createMode, id]);

  function change(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = event.target;
    const nextValue =
      type === "checkbox" && event.target instanceof HTMLInputElement
        ? event.target.checked
        : value;
    setForm((current) => ({ ...current, [name]: nextValue }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    if (!form.orchidName.trim()) {
      setError("Tên hoa lan không được để trống");
      return;
    }
    setBusy(true);
    const payload = {
      ...form,
      orchidName: form.orchidName.trim(),
      orchidCategory: form.orchidCategory.trim(),
      orchidDescription: form.orchidDescription.trim(),
      orchidURL: form.orchidURL.trim(),
    };
    try {
      if (createMode) await createOrchid(payload);
      else if (isValidId(id)) await updateOrchid(Number(id), payload);
      else throw new Error("Invalid ID");
      navigate("/");
    } catch (exception) {
      setError(requestError(exception));
    } finally {
      setBusy(false);
    }
  }

  const loading = !createMode && loadedId !== id;
  const failure =
    !createMode && !isValidId(id)
      ? "Mã hoa lan không hợp lệ."
      : loadError && loadError.id === id
        ? loadError.error
        : "";

  return (
    <main className="page-shell form-page">
      <Link className="back-link" to="/">
        ← Quay lại bộ sưu tập
      </Link>
      <div className="form-heading">
        <p className="eyebrow">CHĂM CHÚT TỪNG CHI TIẾT</p>
        <h1>{createMode ? "Một sắc hoa mới." : "Chỉnh sửa hoa lan."}</h1>
        <p className="muted">
          {createMode
            ? "Thêm một câu chuyện đẹp vào bộ sưu tập của bạn."
            : "Cập nhật thông tin để bộ sưu tập luôn trọn vẹn."}
        </p>
      </div>
      {failure ? (
        <div className="message error-message" role="alert">
          {failure}
        </div>
      ) : loading ? (
        <div className="empty-state" role="status">
          Đang tải thông tin hoa lan…
        </div>
      ) : (
        <form className="orchid-form" onSubmit={submit}>
          {error && (
            <div className="message error-message" role="alert">
              {error}
            </div>
          )}
          <fieldset disabled={busy}>
            <div className="form-grid">
              <label className="full-width">
                Tên hoa lan <span aria-hidden="true">*</span>
                <input
                  name="orchidName"
                  value={form.orchidName}
                  onChange={change}
                  required
                  maxLength={150}
                  autoFocus
                  placeholder="Ví dụ: Taichung Beauty"
                />
              </label>
              <label>
                Phân loại
                <input
                  name="orchidCategory"
                  value={form.orchidCategory}
                  onChange={change}
                  maxLength={100}
                  placeholder="Ví dụ: Cattleya"
                />
              </label>
              <label>
                URL hình ảnh
                <input
                  type="url"
                  name="orchidURL"
                  value={form.orchidURL}
                  onChange={change}
                  maxLength={1000}
                  pattern="https?://.*"
                  placeholder="https://…"
                />
                <small>Dùng đường dẫn ảnh công khai http hoặc https.</small>
              </label>
              <label className="full-width">
                Mô tả
                <textarea
                  name="orchidDescription"
                  value={form.orchidDescription}
                  onChange={change}
                  rows={5}
                  maxLength={1000}
                  placeholder="Điều gì làm hoa lan này đặc biệt?"
                />
              </label>
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  name="natural"
                  checked={form.natural}
                  onChange={change}
                />
                <span>
                  Hoa lan tự nhiên
                  <small>Bỏ chọn nếu là hoa lan nhân giống.</small>
                </span>
              </label>
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  name="attractive"
                  checked={form.attractive}
                  onChange={change}
                />
                <span>
                  Đánh dấu nổi bật<small>Một điểm nhấn trong bộ sưu tập.</small>
                </span>
              </label>
            </div>
          </fieldset>
          <div className="form-actions">
            <Link className="button-quiet" to="/">
              Hủy
            </Link>
            <button className="button-primary" type="submit" disabled={busy}>
              {busy ? "Đang lưu…" : "Lưu hoa lan"}{" "}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
