import { Layers3 } from 'lucide-react'
import EntityPage from './EntityPage'
import StatusBadge from '../components/StatusBadge'

const config = {
  collection: 'categories',
  title: 'Categories',
  singular: 'Category',
  countLabel: 'categories',
  allLabel: 'All categories',
  description: 'Give every story a place. Organize your newsroom content.',
  addLabel: 'New category',
  searchPlaceholder: 'Search categories...',
  searchFields: ['name'],
  createDescription: 'Create a category to organize your campus stories.',
  recordName: (record) => record.name,
  fields: () => [
    {
      name: 'name',
      label: 'Category name',
      required: true,
      maxLength: 80,
      fullWidth: true,
      placeholder: 'e.g. Campus life',
    },
    {
      name: 'description',
      label: 'Description',
      multiline: true,
      maxLength: 300,
      fullWidth: true,
      placeholder: 'What kind of stories belong here?',
    },
    {
      name: 'status',
      label: 'Status',
      defaultValue: 1,
      fullWidth: true,
      options: [
        { value: 1, label: 'Active' },
        { value: 0, label: 'Inactive' },
      ],
    },
  ],
  columns: (data) => [
    {
      key: 'name',
      label: 'Category',
      render: (record, index) => (
        <div className="record-with-icon">
          <span className={`article-tile tile-${index % 4}`}>
            <Layers3 size={18} strokeWidth={1.5} />
          </span>
          <div>
            <span className="record-title">{record.name}</span>
            <span className="record-subtitle">{record.description || 'No description'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'count',
      label: 'Articles',
      render: (record) => data.news.filter((item) => item.categoryId === record.id).length,
    },
    { key: 'status', label: 'Status', render: (record) => <StatusBadge status={record.status} /> },
  ],
}

export default function CategoryPage() {
  return <EntityPage config={config} />
}
