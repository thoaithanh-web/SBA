import EntityPage from './EntityPage'
import StatusBadge from '../components/StatusBadge'
import { initials } from '../utils/format'

const config = {
  collection: 'users',
  title: 'Users & contributors',
  singular: 'User',
  countLabel: 'users',
  allLabel: 'All users',
  description: 'Meet the people behind your campus stories.',
  addLabel: 'New user',
  searchPlaceholder: 'Search usernames, names or email...',
  searchFields: ['username', 'name', 'email'],
  createDescription:
    'Add a contributor to your editorial workspace. Demo accounts are managed locally.',
  recordName: (record) => record.username,
  fields: () => [
    {
      name: 'name',
      label: 'Full name',
      required: true,
      maxLength: 80,
      fullWidth: true,
      placeholder: 'Enter a full name',
    },
    {
      name: 'username',
      label: 'Username',
      required: true,
      maxLength: 40,
      placeholder: 'e.g. thanh.lam',
    },
    {
      name: 'email',
      label: 'Email address',
      type: 'email',
      maxLength: 120,
      placeholder: 'name@example.edu',
    },
    {
      name: 'role',
      label: 'Role',
      defaultValue: 2,
      options: [
        { value: 1, label: 'Admin' },
        { value: 2, label: 'Staff' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      defaultValue: 1,
      options: [
        { value: 1, label: 'Active' },
        { value: 0, label: 'Inactive' },
      ],
    },
  ],
  columns: (data) => [
    {
      key: 'user',
      label: 'Contributor',
      render: (record) => (
        <div className="record-with-icon">
          <span className="avatar">{initials(record.name)}</span>
          <div>
            <span className="record-title">{record.name}</span>
            <span className="record-subtitle">{record.email || 'No email provided'}</span>
          </div>
        </div>
      ),
    },
    { key: 'username', label: 'Username', render: (record) => record.username },
    {
      key: 'role',
      label: 'Role',
      render: (record) => (
        <span className={`role-badge ${record.role === 1 ? 'admin' : ''}`}>
          {record.role === 1 ? 'Admin' : 'Staff'}
        </span>
      ),
    },
    {
      key: 'articles',
      label: 'Articles',
      render: (record) => data.news.filter((item) => item.createdBy === record.id).length,
    },
    { key: 'status', label: 'Status', render: (record) => <StatusBadge status={record.status} /> },
  ],
}

export default function UsersPage() {
  return <EntityPage config={config} />
}
