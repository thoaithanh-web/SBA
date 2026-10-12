import { Badge, Button, Modal } from 'react-bootstrap'
export default function OrchidDetailModal({ orchid, onClose }) {
  if (!orchid) return null
  return (
    <Modal
      show
      onHide={onClose}
      centered
      size="lg"
      aria-labelledby="detail-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="detail-title">{orchid.orchidName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="detail-grid">
          <img src={orchid.image} alt={orchid.orchidName} />
          <div>
            <p className="eyebrow">{orchid.category}</p>
            <h2>A bloom worth noticing.</h2>
            {orchid.isSpecial && <Badge bg="success">Special orchid</Badge>}
            <p className="mt-3">{orchid.description}</p>
            <dl>
              <dt>Origin</dt>
              <dd>{orchid.origin}</dd>
              <dt>Color</dt>
              <dd>{orchid.color}</dd>
              <dt>Rating</dt>
              <dd>{orchid.rating} / 5</dd>
            </dl>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
