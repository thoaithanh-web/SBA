export default function StatusBadge({ status, article = false }) {
  return <span className={`status-badge ${status === 1 ? '' : 'inactive'}`}>{article ? status === 1 ? 'Published' : 'Draft' : status === 1 ? 'Active' : 'Inactive'}</span>
}
