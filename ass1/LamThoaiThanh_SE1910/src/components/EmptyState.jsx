import { SearchX } from 'lucide-react'

export default function EmptyState({
  title = 'No results found',
  message = 'Try another search or clear your filters.',
  children,
}) {
  return (
    <div className="empty-state">
      <SearchX size={32} strokeWidth={1.2} />
      <h2>{title}</h2>
      <p>{message}</p>
      {children}
    </div>
  )
}
