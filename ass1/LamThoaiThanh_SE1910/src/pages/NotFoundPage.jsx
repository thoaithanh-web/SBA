import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import EmptyState from '../components/EmptyState'

export default function NotFoundPage() {
  return <EmptyState title="This page is off the press" message="The page you are looking for could not be found."><Link to="/dashboard" className="btn btn-primary"><ArrowLeft size={15} />Back to dashboard</Link></EmptyState>
}
