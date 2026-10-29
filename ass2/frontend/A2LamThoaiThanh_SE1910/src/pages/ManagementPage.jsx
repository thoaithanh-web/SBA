// Author: Lam Thoai Thanh - CE190169
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Button, Modal } from "react-bootstrap";
import { listRecords, getRecord, deleteRecord } from "../api/newsApi";
import { errorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import PaginationBar from "../components/PaginationBar";
import RecordDialog from "../components/RecordDialog";
import ArticleDialog from "../components/ArticleDialog";
const config = {
  accounts: {
    title: "Accounts",
    eyebrow: "THE PEOPLE BEHIND THE STORIES",
    description: "Manage the people who keep your newsroom moving.",
    singular: "account",
  },
  categories: {
    title: "Categories",
    eyebrow: "CONTENT ORGANIZATION",
    description: "Give every story a place to belong.",
    singular: "category",
  },
  news: {
    title: "News articles",
    eyebrow: "YOUR NEWSROOM",
    description: "Create, refine, and share your campus stories.",
    singular: "article",
  },
  "news/history": {
    title: "My news history",
    eyebrow: "YOUR CONTRIBUTIONS",
    description:
      "Every story you have created, published or still in progress.",
    singular: "article",
  },
};
const blankPage = { content: [], totalPages: 0, totalElements: 0 };
export default function ManagementPage({ resource, history = false }) {
  const c = config[resource];
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const keyword = params.get("q") || "";
  const raw = Number(params.get("page") || 0);
  const page = Number.isInteger(raw) && raw >= 0 ? raw : 0;
  const [search, setSearch] = useState(keyword),
    [data, setData] = useState(blankPage),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [revision, setRevision] = useState(0),
    [editor, setEditor] = useState(null),
    [deleting, setDeleting] = useState(null),
    [deleteError, setDeleteError] = useState(""),
    [pending, setPending] = useState(false),
    [opening, setOpening] = useState(false),
    [preview, setPreview] = useState(null);
  useEffect(() => {
    setSearch(keyword);
  }, [keyword]);
  useEffect(() => {
    setEditor(null);
    setDeleting(null);
    setPreview(null);
    setNotice("");
  }, [resource]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    listRecords(resource, { keyword, page, signal: controller.signal })
      .then((r) => {
        if (controller.signal.aborted) return;
        if (page > 0 && page >= r.data.totalPages) {
          setParams(
            { q: keyword, page: String(Math.max(0, r.data.totalPages - 1)) },
            { replace: true },
          );
          return;
        }
        setData(r.data);
        setLoading(false);
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setError(errorMessage(e));
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [resource, keyword, page, revision, setParams]);
  const idOf = (r) => r.accountId ?? r.categoryId ?? r.newsArticleId;
  const nameOf = (r) => r.accountName ?? r.categoryName ?? r.newsTitle;
  async function openEdit(r, view = false) {
    if (opening) return;
    setOpening(true);
    setError("");
    try {
      const response = await getRecord(
        resource === "news/history" ? "news" : resource,
        idOf(r),
      );
      if (view) setPreview(response.data);
      else setEditor({ record: response.data });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setOpening(false);
    }
  }
  async function remove() {
    if (pending || !deleting) return;
    setPending(true);
    setDeleteError("");
    try {
      await deleteRecord(resource, idOf(deleting));
      setNotice("Record deleted successfully.");
      setDeleting(null);
      setRevision((v) => v + 1);
    } catch (e) {
      setDeleteError(errorMessage(e));
    } finally {
      setPending(false);
    }
  }
  return (
    <main className="content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{c.eyebrow}</p>
          <h1>
            {c.title}
            <span className="title-dot">.</span>
          </h1>
          <p className="subtitle">{c.description}</p>
        </div>
        {!history && (
          <Button onClick={() => setEditor({ record: null })}>
            ＋ New {c.singular}
          </Button>
        )}
      </div>
      <div className="context-strip">
        <div>
          <span className="context-icon">
            {resource === "accounts" ? "○" : "▦"}
          </span>
          <span>
            <strong>
              {history
                ? "A record of your editorial journey."
                : "Thoughtful structure. Clearer stories."}
            </strong>
            <small>
              {history
                ? "History is filtered by your authenticated account on the server."
                : "Changes are saved through the REST API to SQL Server."}
            </small>
          </span>
        </div>
        <span className="connected-badge">
          {user.accountRole === 1 ? "ADMIN" : "STAFF"} WORKSPACE
        </span>
      </div>
      {notice && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setNotice("")}
          role="status"
        >
          {notice}
        </Alert>
      )}
      <section className="panel" aria-label={c.title}>
        <div className="panel-toolbar">
          <div>
            <h2>
              {history ? "Your articles" : "All " + c.title.toLowerCase()}{" "}
              <span className="count">{data.totalElements}</span>
            </h2>
            <p>Live data from your campus newsroom.</p>
          </div>
          <form
            className="search-form"
            onSubmit={(e) => {
              e.preventDefault();
              setParams({ q: search.trim(), page: "0" });
            }}
          >
            <input
              className="form-control"
              aria-label="Search records"
              placeholder={"Search " + c.title.toLowerCase() + "…"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-secondary">Search</button>
            {keyword && (
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setParams({})}
              >
                Clear
              </button>
            )}
          </form>
        </div>
        {loading ? (
          <div className="empty-state" role="status">
            Loading records…
          </div>
        ) : error ? (
          <div className="empty-state">
            <Alert variant="danger" role="alert">
              {error}
            </Alert>
            <Button
              variant="outline-secondary"
              onClick={() => setRevision((v) => v + 1)}
            >
              Try again
            </Button>
          </div>
        ) : data.content.length === 0 ? (
          <div className="empty-state">
            <h3>No records found</h3>
            <p>
              {keyword
                ? "Try a different search or clear the filter."
                : "Your next story starts here."}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table category-table">
              <thead>
                <tr>
                  <th>
                    {resource === "accounts"
                      ? "ACCOUNT"
                      : resource === "categories"
                        ? "CATEGORY"
                        : "ARTICLE"}
                  </th>
                  <th>
                    {resource === "accounts"
                      ? "EMAIL"
                      : resource === "categories"
                        ? "DESCRIPTION"
                        : "CATEGORY / AUTHOR"}
                  </th>
                  <th>{resource === "accounts" ? "ROLE" : "STATUS"}</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((r) => (
                  <tr key={idOf(r)} data-testid={"record-" + idOf(r)}>
                    <td>
                      <div className="category-identity">
                        <span className="category-avatar">
                          {(nameOf(r) || "?")[0]}
                        </span>
                        <div>
                          <strong>{nameOf(r)}</strong>
                          <small>
                            {resource === "news" || history
                              ? new Date(r.createdDate).toLocaleDateString(
                                  "en-GB",
                                )
                              : "ID / " + idOf(r)}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="description-cell">
                      {resource === "accounts" ? (
                        r.accountEmail
                      ) : resource === "categories" ? (
                        r.categoryDescription
                      ) : (
                        <>
                          {r.categoryName}
                          <small className="author-line">
                            By {r.authorName}
                          </small>
                        </>
                      )}
                    </td>
                    <td>
                      <span
                        className={
                          "status-badge " +
                          ((r.active ?? r.newsStatus ?? true)
                            ? "active"
                            : "inactive")
                        }
                      >
                        {resource === "accounts"
                          ? r.accountRole === 1
                            ? "Admin"
                            : "Staff"
                          : resource === "categories"
                            ? r.active
                              ? "Active"
                              : "Inactive"
                            : r.newsStatus
                              ? "Published"
                              : "Draft"}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        {(resource === "news" || history) && (
                          <button
                            className="edit-action"
                            disabled={opening}
                            aria-label={"Read " + nameOf(r)}
                            onClick={() => openEdit(r, true)}
                          >
                            Read
                          </button>
                        )}
                        {!history && (
                          <>
                            <button
                              className="edit-action"
                              disabled={opening}
                              aria-label={"Edit " + nameOf(r)}
                              onClick={() => openEdit(r)}
                            >
                              Edit ↗
                            </button>
                            <button
                              disabled={
                                resource === "accounts" &&
                                r.accountId === user.accountId
                              }
                              aria-label={"Delete " + nameOf(r)}
                              onClick={() => {
                                setDeleting(r);
                                setDeleteError("");
                              }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <PaginationBar
          data={data}
          page={page}
          disabled={loading}
          onPage={(next) => setParams({ q: keyword, page: String(next) })}
        />
      </section>
      {resource === "categories" && (
        <p className="page-note">
          Categories used by articles or child categories are protected from
          deletion.
        </p>
      )}
      {resource === "accounts" && (
        <p className="page-note">
          Accounts that have created news articles cannot be deleted. Passwords
          are never returned by the API.
        </p>
      )}
      {editor && (
        <RecordDialog
          resource={resource}
          record={editor.record}
          onClose={() => setEditor(null)}
          onSaved={() => {
            const created = !editor.record;
            setEditor(null);
            setNotice("Saved successfully.");
            if (created) setParams({});
            setRevision((v) => v + 1);
          }}
        />
      )}
      {preview && (
        <ArticleDialog article={preview} onClose={() => setPreview(null)} />
      )}
      <Modal
        show={!!deleting}
        centered
        onHide={() => {
          if (!pending) setDeleting(null);
        }}
        aria-labelledby="delete-record-title"
      >
        <Modal.Header closeButton={!pending}>
          <Modal.Title id="delete-record-title">
            Delete {c.singular}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Delete <strong>{deleting && nameOf(deleting)}</strong>? This action
            cannot be undone.
          </p>
          {deleteError && (
            <Alert variant="danger" role="alert">
              {deleteError}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light"
            disabled={pending}
            onClick={() => setDeleting(null)}
          >
            Cancel
          </Button>
          <Button variant="danger" disabled={pending} onClick={remove}>
            {pending ? "Deleting…" : "Delete " + c.singular}
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
