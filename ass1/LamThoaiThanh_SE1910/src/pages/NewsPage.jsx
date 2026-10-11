import { Newspaper } from 'lucide-react'
import EntityPage from './EntityPage'
import StatusBadge from '../components/StatusBadge'
import { formatDate } from '../utils/format'

const config = {
  collection: 'news', title: 'News articles', singular: 'Article', countLabel: 'articles', allLabel: 'All articles',
  description: 'The stories that keep your campus connected.',
  addLabel: 'New article', searchPlaceholder: 'Search articles by title or content...', searchFields: ['title', 'content'],
  createDescription: 'Every good story starts here. Add your article details below.', recordName: record => record.title,
  fields: data => [
    { name: 'title', label: 'Article title', required: true, maxLength: 160, fullWidth: true, placeholder: 'Give your story a compelling title' },
    { name: 'categoryId', label: 'Category', required: true, placeholder: 'Select a category', options: data.categories.map(item => ({ value: item.id, label: `${item.name}${item.status === 0 ? ' (inactive)' : ''}` })) },
    { name: 'createdBy', label: 'Author', defaultValue: 'user-admin', required: true, options: data.users.map(item => ({ value: item.id, label: `${item.name}${item.status === 0 ? ' (inactive)' : ''}` })) },
    { name: 'content', label: 'Article content', required: true, multiline: true, rows: 7, maxLength: 20000, fullWidth: true, placeholder: 'Tell your story...' },
    { name: 'tags', label: 'Tags', maxLength: 246, placeholder: 'campus, community', help: 'Comma-separated. Up to 8 tags, 30 characters each.' },
    { name: 'status', label: 'Publication status', defaultValue: 0, options: [{ value: 0, label: 'Draft' }, { value: 1, label: 'Published' }] },
  ],
  columns: data => [
    { key: 'title', label: 'Article', render: (record, index) => <div className="record-with-icon"><span className={`article-tile tile-${index % 4}`}><Newspaper size={18} strokeWidth={1.5} /></span><div style={{ maxWidth: 290 }}><span className="record-title">{record.title}</span><span className="record-subtitle">By {data.users.find(item => item.id === record.createdBy)?.name}</span></div></div> },
    { key: 'category', label: 'Category', render: record => data.categories.find(item => item.id === record.categoryId)?.name },
    { key: 'date', label: 'Updated', render: record => <span style={{ whiteSpace: 'nowrap' }}>{formatDate(record.updatedAt)}</span> },
    { key: 'status', label: 'Status', render: record => <StatusBadge status={record.status} article /> },
  ],
}

export default function NewsPage() { return <EntityPage config={config} /> }
