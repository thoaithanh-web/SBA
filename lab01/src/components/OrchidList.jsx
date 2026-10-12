import { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { OrchidsData } from '../shared/OrchidsData'
import OrchidCard from './OrchidCard'
import OrchidDetailModal from './OrchidDetailModal'
export default function OrchidList() {
  const [selected, setSelected] = useState(null)
  return (
    <Container id="orchids" className="collection">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE COLLECTION</p>
          <h2>Eight remarkable blooms.</h2>
        </div>
        <span className="count-note">
          {OrchidsData.length} orchids · Carefully illustrated
        </span>
      </div>
      <Row className="g-4">
        {OrchidsData.map((orchid) => (
          <Col key={orchid.id} xs={12} sm={6} lg={4}>
            <OrchidCard orchid={orchid} onDetail={setSelected} />
          </Col>
        ))}
      </Row>
      <OrchidDetailModal orchid={selected} onClose={() => setSelected(null)} />
    </Container>
  )
}
