import { Spinner } from 'react-bootstrap'
export default function LoadingSpinner() {
  return (
    <div className="status-panel" role="status">
      <Spinner animation="border" size="sm" />
      <p className="mt-3">Gathering the collection…</p>
    </div>
  )
}
