// Author: Lam Thoai Thanh - CE190169
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import api, { errorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Brand from "../components/Brand";
import PaginationBar from "../components/PaginationBar";
export default function PublicNews({ detail = false }) {
  const { id } = useParams();
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const keyword = params.get("q") || "";
  const raw = Number(params.get("page") || 0);
  const page = Number.isInteger(raw) && raw >= 0 ? raw : 0;
  const [search, setSearch] = useState(keyword),
    [result, setResult] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    setSearch(keyword);
  }, [keyword]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    api
      .get(detail ? "/public/news/" + encodeURIComponent(id) : "/public/news", {
        params: detail ? undefined : { keyword, page, size: 6 },
        signal: controller.signal,
      })
      .then((r) => {
        if (!controller.signal.aborted) {
          setResult(r.data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setError(errorMessage(e));
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [detail, id, keyword, page, revision]);
  return (
    <div className="public-shell">
      <header className="public-nav">
        <Brand />
        <nav aria-label="Public navigation">
          <Link to="/">Campus news</Link>
          <Link
            to={
              user
                ? user.accountRole === 1
                  ? "/workspace/accounts"
                  : "/workspace/news"
                : "/login"
            }
          >
            {user ? "Editorial desk ↗" : "Staff sign in ↗"}
          </Link>
        </nav>
      </header>
      {!detail && (
        <section className="public-hero">
          <div>
            <p className="eyebrow">THE UNIVERSITY EDITION · EST. 2026</p>
            <h1>
              Every campus.
              <br />
              Every voice.
              <br />
              <em>One newsroom.</em>
            </h1>
            <p>Stories, ideas and people that move our community forward.</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span>FU</span>
            <div>
              THE CAMPUS,
              <br />
              CONNECTED.
            </div>
            <i>NEWS / IDEAS / COMMUNITY</i>
          </div>
        </section>
      )}
      <main>
        {detail && (
          <Link className="back-link" to="/">
            ← All campus stories
          </Link>
        )}
        {!detail && (
          <div className="section-heading">
            <div>
              <p className="eyebrow">FRESH FROM CAMPUS</p>
              <h2>The latest stories</h2>
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
                aria-label="Search public news"
                placeholder="Find a story…"
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
        )}
        {loading ? (
          <div className="empty-state" role="status">
            Loading stories…
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
        ) : detail ? (
          <article className="story-detail">
            <p className="eyebrow">{result.categoryName} · PUBLISHED</p>
            <h1>{result.newsTitle}</h1>
            <p className="headline">{result.headline}</p>
            <p className="story-meta">
              By {result.authorName} ·{" "}
              {new Date(result.createdDate).toLocaleDateString("en-GB")}
            </p>
            <div className="story-content">{result.newsContent}</div>
            <div className="tag-list">
              {result.tags.map((t) => (
                <span key={t.tagId}>#{t.tagName}</span>
              ))}
            </div>
            {result.newsSource && (
              <p className="story-meta">Source: {result.newsSource}</p>
            )}
          </article>
        ) : (
          <>
            <div className="story-grid">
              {result.content.map((article, index) => (
                <Link
                  className="story-card"
                  key={article.newsArticleId}
                  to={"/news/" + article.newsArticleId}
                >
                  <div className={"story-art art-" + (index % 3)}>
                    <span>{String(index + 1 + page * 6).padStart(2, "0")}</span>
                    <i>{article.categoryName}</i>
                  </div>
                  <div className="story-card-copy">
                    <p className="eyebrow">{article.categoryName}</p>
                    <h3>{article.newsTitle}</h3>
                    <p>{article.headline}</p>
                    <small>
                      {article.authorName} <span>Read story ↗</span>
                    </small>
                  </div>
                </Link>
              ))}
            </div>
            {!result.content.length && (
              <div className="empty-state">
                No published stories match your search.
              </div>
            )}
            <PaginationBar
              data={result}
              page={page}
              disabled={loading}
              onPage={(next) => setParams({ q: keyword, page: String(next) })}
            />
          </>
        )}
      </main>
      <footer>
        FU News · Stories from our community
        <span>Assignment02 · Lâm Thoại Thanh · CE190169</span>
      </footer>
    </div>
  );
}
