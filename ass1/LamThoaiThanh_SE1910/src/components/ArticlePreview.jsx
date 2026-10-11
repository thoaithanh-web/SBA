import { Button, Modal } from 'react-bootstrap'
import { useNews } from '../context/NewsContext'
import StatusBadge from './StatusBadge'
import { formatDate } from '../utils/format'

export default function ArticlePreview({ article, onClose }) {
  const { data } = useNews()
  return <Modal show onHide={onClose} centered size="lg" aria-labelledby="article-preview-title"><Modal.Header closeButton><Modal.Title id="article-preview-title">Article preview</Modal.Title></Modal.Header><Modal.Body className="article-detail"><StatusBadge status={article.status} article /><h2>{article.title}</h2><p className="detail-meta">{data.categories.find(item => item.id === article.categoryId)?.name} · By {data.users.find(item => item.id === article.createdBy)?.name} · {formatDate(article.updatedAt)}</p><div className="article-content">{article.content}</div>{article.tags.length > 0 && <div className="tags">{article.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}</div>}</Modal.Body><Modal.Footer><Button variant="light" onClick={onClose}>Close preview</Button></Modal.Footer></Modal>
}
