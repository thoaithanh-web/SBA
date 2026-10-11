import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Form, Table } from 'react-bootstrap'
import { Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useNews } from '../context/NewsContext'
import { searchRecords } from '../services/newsStore'
import PageHeading from '../components/PageHeading'
import EmptyState from '../components/EmptyState'
import EntityDialog from '../components/EntityDialog'
import ConfirmDialog from '../components/ConfirmDialog'
import ArticlePreview from '../components/ArticlePreview'

export default function EntityPage({ config }) {
  const { data, remove } = useNews()
  const [params, setParams] = useSearchParams()
  const [editor, setEditor] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [preview, setPreview] = useState(null)
  const records = data[config.collection]
  const keyword = params.get('q') || ''
  const status = ['0', '1'].includes(params.get('status')) ? params.get('status') : 'all'
  const category = params.get('category') || ''
  const filtered = searchRecords(records, keyword, config.searchFields).filter(
    (item) =>
      (status === 'all' || item.status === Number(status)) &&
      (config.collection !== 'news' || !category || item.categoryId === category),
  )
  const columns = config.columns(data)

  useEffect(() => {
    if (params.get('new') === '1') {
      setEditor({ record: null })
      const next = new URLSearchParams(params)
      next.delete('new')
      setParams(next, { replace: true })
    }
  }, [params, setParams])

  function updateParam(key, value) {
    const next = new URLSearchParams(params)
    if (value && value !== 'all') next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  function saved(created) {
    setEditor(null)
    if (created) setParams({}, { replace: true })
  }

  function confirmDelete() {
    remove(config.collection, deleting.id)
    setDeleting(null)
  }

  return (
    <>
      <PageHeading title={config.title} description={config.description}>
        <Button onClick={() => setEditor({ record: null })}>
          <Plus size={16} />
          {config.addLabel}
        </Button>
      </PageHeading>
      <div className="management-tabs" role="group" aria-label="Filter by status">
        {[
          { value: 'all', label: config.allLabel },
          { value: '1', label: config.collection === 'news' ? 'Published' : 'Active' },
          { value: '0', label: config.collection === 'news' ? 'Drafts' : 'Inactive' },
        ].map((tab) => (
          <button
            key={tab.value}
            className={`management-tab ${status === tab.value ? 'active' : ''}`}
            aria-pressed={status === tab.value}
            onClick={() => updateParam('status', tab.value)}
          >
            {tab.label}
            <span className="tab-count">
              {tab.value === 'all'
                ? records.length
                : records.filter((item) => item.status === Number(tab.value)).length}
            </span>
          </button>
        ))}
      </div>
      <section className="panel" aria-label={config.title}>
        <div className="table-toolbar">
          <div className="search-field">
            <Search size={15} />
            <Form.Control
              aria-label={`Search ${config.collection}`}
              placeholder={config.searchPlaceholder}
              value={keyword}
              onChange={(event) => updateParam('q', event.target.value)}
            />
            {keyword && (
              <button
                className="icon-button search-clear"
                aria-label="Clear search"
                onClick={() => updateParam('q', '')}
              >
                <X size={14} />
              </button>
            )}
          </div>
          {config.collection === 'news' && (
            <Form.Select
              style={{ width: 175, fontSize: 11, padding: '10px 12px' }}
              aria-label="Filter category"
              value={category}
              onChange={(event) => updateParam('category', event.target.value)}
            >
              <option value="">All categories</option>
              {data.categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
          )}
          <span className="toolbar-count">
            {filtered.length}{' '}
            {filtered.length === 1 ? config.singular.toLowerCase() : config.countLabel}
          </span>
        </div>
        {filtered.length ? (
          <div className="table-responsive">
            <Table>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} scope="col">
                      {column.label}
                    </th>
                  ))}
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record, index) => (
                  <tr key={record.id} data-testid={`record-${record.id}`}>
                    {columns.map((column) => (
                      <td key={column.key}>{column.render(record, index)}</td>
                    ))}
                    <td>
                      <div className="row-actions">
                        {config.collection === 'news' && (
                          <button
                            className="icon-button"
                            aria-label={`Read article ${record.title}`}
                            onClick={() => setPreview(record)}
                          >
                            <Eye size={15} />
                          </button>
                        )}
                        <button
                          className="icon-button"
                          aria-label={`Edit ${config.singular.toLowerCase()} ${config.recordName(record)}`}
                          onClick={() => setEditor({ record })}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="icon-button"
                          aria-label={`Delete ${config.singular.toLowerCase()} ${config.recordName(record)}`}
                          disabled={record.id === 'user-admin'}
                          title={
                            record.id === 'user-admin'
                              ? 'The demo administrator cannot be deleted'
                              : `Delete ${config.singular.toLowerCase()}`
                          }
                          onClick={() => setDeleting(record)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <EmptyState
            title={records.length === 0 ? `No ${config.countLabel} yet` : 'No results found'}
            message={
              records.length === 0
                ? `Create your first ${config.singular.toLowerCase()} to get started.`
                : 'Try another search or clear your filters.'
            }
          >
            {records.length === 0 ? (
              <Button onClick={() => setEditor({ record: null })}>
                <Plus size={15} />
                {config.addLabel}
              </Button>
            ) : (
              <Button variant="light" onClick={() => setParams({}, { replace: true })}>
                Clear filters
              </Button>
            )}
          </EmptyState>
        )}
        <div className="table-caption">
          <span>
            Showing {filtered.length} of {records.length} {config.countLabel}
          </span>
          <span>FU News · Editorial workspace</span>
        </div>
      </section>
      {editor && (
        <EntityDialog
          config={config}
          record={editor.record}
          onClose={() => setEditor(null)}
          onSaved={saved}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title={`Delete ${config.singular.toLowerCase()}?`}
          description={
            <>
              You are about to delete <strong>{config.recordName(deleting)}</strong>. This action
              cannot be undone.
            </>
          }
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}
      {preview && <ArticlePreview article={preview} onClose={() => setPreview(null)} />}
    </>
  )
}
