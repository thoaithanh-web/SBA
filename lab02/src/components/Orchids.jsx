import { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import useOrchids from '../hooks/useOrchids'
import OrchidCard from './OrchidCard'
import OrchidDetailModal from './OrchidDetailModal'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
export default function Orchids() {
  const { orchids, loading, error, source, reload, loadCached } = useOrchids()
  const [selected, setSelected] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [special, setSpecial] = useState(false)
  const visible = orchids.filter(
    (o) =>
      o.orchidName.toLowerCase().includes(keyword.trim().toLowerCase()) &&
      (!category || o.category === category) &&
      (!special || o.isSpecial),
  )
  return (
    <Container id="orchids" className="collection">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE LIVING COLLECTION</p>
          <h2>Find your favourite bloom.</h2>
        </div>
        <div className="data-tools">
          <span className="cache-note" role="status">
            {loading
              ? 'Loading…'
              : source === 'cache'
                ? 'From cache · 30s TTL'
                : source === 'network'
                  ? 'Fresh from network'
                  : ''}
          </span>
          <Button
            variant="outline-secondary"
            onClick={loadCached}
            disabled={loading}
          >
            Load collection
          </Button>
          <Button variant="dark" onClick={reload} disabled={loading}>
            Force reload
          </Button>
        </div>
      </div>
      <div className="filters">
        <Form.Control
          aria-label="Search orchids"
          placeholder="Search orchid names…"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Form.Select
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {[...new Set(orchids.map((o) => o.category))].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Form.Select>
        <Form.Check
          id="special-only"
          label="Special only"
          checked={special}
          onChange={(e) => setSpecial(e.target.checked)}
        />
        <span className="count-note">
          {visible.length} / {orchids.length} orchids
        </span>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : visible.length ? (
        <Row className="g-4">
          {visible.map((orchid) => (
            <Col key={orchid.id} xs={12} sm={6} lg={3}>
              <OrchidCard orchid={orchid} onDetail={setSelected} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="status-panel">
          <h3>
            {orchids.length ? 'No matching orchids' : 'The collection is empty'}
          </h3>
          <p>
            {orchids.length
              ? 'Try a different search or clear the filters.'
              : 'Please check back after new records are added.'}
          </p>
          {orchids.length > 0 && (
            <Button
              variant="outline-dark"
              onClick={() => {
                setKeyword('')
                setCategory('')
                setSpecial(false)
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
      <OrchidDetailModal orchid={selected} onClose={() => setSelected(null)} />
    </Container>
  )
}
