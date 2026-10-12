import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { deleteOrchid, getOrchids, requestError } from "./services/orchidApi";
import OrchidImage from "./components/OrchidImage";
import type { Orchid } from "./types";

type CollectionState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "loaded"; orchids: Orchid[] };

export default function App() {
  const [state, setState] = useState<CollectionState>({ status: "loading" });
  const [revision, setRevision] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [deleting, setDeleting] = useState<Orchid | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getOrchids(controller.signal)
      .then((response) => {
        if (!controller.signal.aborted)
          setState({ status: "loaded", orchids: response.data });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({ status: "error", error: requestError(error) });
      });
    return () => controller.abort();
  }, [revision]);

  function reload() {
    setState({ status: "loading" });
    setRevision((value) => value + 1);
  }

  async function confirmDelete() {
    if (!deleting || busy) return;
    setBusy(true);
    setDeleteError("");
    try {
      await deleteOrchid(deleting.orchidId);
      setDeleting(null);
      reload();
    } catch (error) {
      setDeleteError(requestError(error));
    } finally {
      setBusy(false);
    }
  }

  const orchids = state.status === "loaded" ? state.orchids : [];
  const query = keyword.trim().toLocaleLowerCase("vi");
  const filtered = orchids.filter((orchid) =>
    `${orchid.orchidName} ${orchid.orchidCategory || ""}`
      .toLocaleLowerCase("vi")
      .includes(query),
  );

  return (
    <main className="page-shell">
      <section className="collection-hero">
        <div>
          <p className="eyebrow">MỘT GÓC THIÊN NHIÊN, MỘT CHÚT CẢM HỨNG</p>
          <h1>
            Mỗi sắc hoa,
            <br />
            <em>một câu chuyện.</em>
          </h1>
          <p className="hero-description">
            Khám phá, lưu giữ và chăm chút bộ sưu tập hoa lan của bạn.
            <br className="desktop-break" /> Những điều đẹp đẽ bắt đầu từ một
            mầm xanh.
          </p>
          <Link className="button-primary" to="/orchids/new">
            Thêm vào bộ sưu tập <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="botanical-art" aria-hidden="true">
          <div className="art-ring" />
          <span className="art-flower">✳</span>
          <span className="art-caption">
            GROW WITH CARE
            <br />
            BLOOM WITH JOY
          </span>
          <span className="art-number">EST. 2026</span>
        </div>
      </section>
      <section
        className="collection-section"
        aria-labelledby="collection-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE COLLECTION</p>
            <h2 id="collection-title">
              Bộ sưu tập hoa lan{" "}
              <span className="count-pill">
                {state.status === "loaded" ? orchids.length : "—"}
              </span>
            </h2>
          </div>
          <div className="collection-tools">
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                aria-label="Tìm hoa lan"
                placeholder="Tìm tên hoặc phân loại…"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </label>
            <button
              className="button-quiet"
              onClick={reload}
              disabled={state.status === "loading"}
            >
              Làm mới ↻
            </button>
          </div>
        </div>
        {state.status === "loading" ? (
          <div className="empty-state" role="status">
            Đang tải bộ sưu tập…
          </div>
        ) : state.status === "error" ? (
          <div className="message error-message" role="alert">
            <p>{state.error}</p>
            <button className="button-quiet" onClick={reload}>
              Thử lại
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-flower" aria-hidden="true">
              ✳
            </span>
            <h3>
              {orchids.length === 0
                ? "Bộ sưu tập đang chờ sắc hoa đầu tiên"
                : "Không tìm thấy hoa lan"}
            </h3>
            <p>
              {orchids.length === 0
                ? "Thêm một hoa lan để bắt đầu câu chuyện của bạn."
                : "Thử tên khác hoặc xóa từ khóa tìm kiếm."}
            </p>
            {orchids.length === 0 ? (
              <Link className="button-primary" to="/orchids/new">
                Thêm hoa lan
              </Link>
            ) : (
              <button className="button-quiet" onClick={() => setKeyword("")}>
                Xóa tìm kiếm
              </button>
            )}
          </div>
        ) : (
          <div className="orchid-table-wrap">
            <table className="orchid-table">
              <thead>
                <tr>
                  <th scope="col">HOA LAN</th>
                  <th scope="col">PHÂN LOẠI</th>
                  <th scope="col">NGUỒN GỐC</th>
                  <th scope="col">ĐẶC ĐIỂM</th>
                  <th scope="col">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((orchid) => (
                  <tr
                    key={orchid.orchidId}
                    data-testid={`orchid-${orchid.orchidId}`}
                  >
                    <td>
                      <div className="orchid-cell">
                        <Link
                          className="thumbnail"
                          to={`/orchids/${orchid.orchidId}`}
                          aria-label={`Xem ảnh ${orchid.orchidName}`}
                        >
                          <OrchidImage
                            url={orchid.orchidURL}
                            name={orchid.orchidName}
                          />
                        </Link>
                        <div>
                          <Link
                            className="orchid-name"
                            to={`/orchids/${orchid.orchidId}`}
                          >
                            {orchid.orchidName}
                          </Link>
                          <span className="orchid-id">
                            ORCHID NO.{" "}
                            {String(orchid.orchidId).padStart(3, "0")}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{orchid.orchidCategory || "Chưa phân loại"}</td>
                    <td>
                      <span
                        className={`orchid-badge ${orchid.natural ? "" : "badge-muted"}`}
                      >
                        {orchid.natural ? "Tự nhiên" : "Nhân giống"}
                      </span>
                    </td>
                    <td>
                      {orchid.attractive ? (
                        <span className="attractive-label">✧ Nổi bật</span>
                      ) : (
                        <span className="muted">Thông thường</span>
                      )}
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link
                          to={`/orchids/${orchid.orchidId}/edit`}
                          aria-label={`Sửa ${orchid.orchidName}`}
                        >
                          Sửa ↗
                        </Link>
                        <button
                          aria-label={`Xóa ${orchid.orchidName}`}
                          onClick={() => {
                            setDeleteError("");
                            setDeleting(orchid);
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {state.status === "loaded" && (
          <div className="collection-caption">
            <span>
              Hiển thị {filtered.length} / {orchids.length} hoa lan
            </span>
            <span>Được lưu giữ bằng sự chăm chút.</span>
          </div>
        )}
      </section>
      <Modal
        show={!!deleting}
        onHide={() => {
          if (!busy) setDeleting(null);
        }}
        centered
        aria-labelledby="delete-title"
      >
        <Modal.Header closeButton={!busy}>
          <Modal.Title id="delete-title">Xóa hoa lan?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn muốn xóa <strong>{deleting?.orchidName}</strong> khỏi bộ sưu
            tập? Thao tác này không thể hoàn tác.
          </p>
          {deleteError && (
            <div className="message error-message" role="alert">
              {deleteError}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light"
            disabled={busy}
            onClick={() => setDeleting(null)}
          >
            Hủy
          </Button>
          <Button variant="danger" disabled={busy} onClick={confirmDelete}>
            {busy ? "Đang xóa…" : "Xóa hoa lan"}
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
