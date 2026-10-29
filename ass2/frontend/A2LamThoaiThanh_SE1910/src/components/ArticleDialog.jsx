// Author: Lam Thoai Thanh - CE190169
import { Modal, Button } from "react-bootstrap";
export default function ArticleDialog({ article, onClose }) {
  return (
    <Modal
      show
      centered
      size="lg"
      onHide={onClose}
      aria-labelledby="article-preview-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="article-preview-title">Article preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="eyebrow">
          {article.categoryName} · {article.newsStatus ? "PUBLISHED" : "DRAFT"}
        </p>
        <h2>{article.newsTitle}</h2>
        <p className="headline">{article.headline}</p>
        <p className="story-meta">
          By {article.authorName} ·{" "}
          {new Date(article.createdDate).toLocaleDateString("en-GB")}
        </p>
        <div className="story-content">{article.newsContent}</div>
        <div className="tag-list">
          {article.tags.map((t) => (
            <span key={t.tagId}>#{t.tagName}</span>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onClose}>
          Close preview
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
