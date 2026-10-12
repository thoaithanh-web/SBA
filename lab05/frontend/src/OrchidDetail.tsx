import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrchid, requestError } from "./services/orchidApi";
import OrchidImage from "./components/OrchidImage";
import { isValidId } from "./types";
import type { Orchid } from "./types";

type DetailState =
  | { id: string; status: "loaded"; orchid: Orchid }
  | { id: string; status: "error"; error: string };

export default function OrchidDetail() {
  const { id } = useParams();
  const [state, setState] = useState<DetailState | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    if (isValidId(id)) {
      getOrchid(id, controller.signal)
        .then((response) => {
          if (!controller.signal.aborted)
            setState({ id, status: "loaded", orchid: response.data });
        })
        .catch((error) => {
          if (!controller.signal.aborted)
            setState({ id, status: "error", error: requestError(error) });
        });
    }
    return () => controller.abort();
  }, [id]);

  const current = state?.id === id ? state : null;
  const orchid = current?.status === "loaded" ? current.orchid : null;
  return (
    <main className="page-shell detail-page">
      <Link className="back-link" to="/">
        ← Quay lại bộ sưu tập
      </Link>
      {!isValidId(id) ? (
        <div className="message error-message" role="alert">
          Mã hoa lan không hợp lệ.
        </div>
      ) : !current ? (
        <div className="empty-state" role="status">
          Đang tải chi tiết hoa lan…
        </div>
      ) : current.status === "error" ? (
        <div className="message error-message" role="alert">
          {current.error}
        </div>
      ) : (
        orchid && (
          <article className="detail-card">
            <div className="detail-image">
              <OrchidImage url={orchid.orchidURL} name={orchid.orchidName} />
            </div>
            <div className="detail-content">
              <p className="eyebrow">CHI TIẾT HOA LAN · #{orchid.orchidId}</p>
              <h1>{orchid.orchidName}</h1>
              <p className="detail-category">
                {orchid.orchidCategory || "Chưa phân loại"}
              </p>
              <div className="detail-badges">
                <span
                  className={`orchid-badge ${orchid.natural ? "" : "badge-muted"}`}
                >
                  {orchid.natural ? "Tự nhiên" : "Nhân giống"}
                </span>
                <span
                  className={`orchid-badge ${orchid.attractive ? "badge-accent" : "badge-muted"}`}
                >
                  {orchid.attractive ? "✧ Nổi bật" : "Thông thường"}
                </span>
              </div>
              <div className="detail-description">
                <h2>Mô tả</h2>
                <p>
                  {orchid.orchidDescription || "Chưa có mô tả cho hoa lan này."}
                </p>
              </div>
              <div className="detail-actions">
                <Link
                  className="button-primary"
                  to={`/orchids/${orchid.orchidId}/edit`}
                >
                  Chỉnh sửa hoa lan ↗
                </Link>
                {orchid.orchidURL && /^https?:\/\//i.test(orchid.orchidURL) && (
                  <a
                    className="image-source"
                    href={orchid.orchidURL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Mở hình ảnh gốc ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        )
      )}
    </main>
  );
}
