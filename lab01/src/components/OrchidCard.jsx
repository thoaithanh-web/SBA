import { Badge, Button, Card } from 'react-bootstrap'
export default function OrchidCard({ orchid, onDetail }) {
  return (
    <Card className="orchid-card h-100" data-testid="orchid-card">
      <div className="card-image-wrap">
        <Card.Img variant="top" src={orchid.image} alt={orchid.orchidName} />
        {orchid.isSpecial && (
          <Badge className="special-badge" bg="light" text="dark">
            Special selection
          </Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <p className="eyebrow">{orchid.category}</p>
        <Card.Title as="h3">{orchid.orchidName}</Card.Title>
        <Card.Text>
          {orchid.origin} <span aria-hidden="true">·</span> {orchid.color}
        </Card.Text>
        <div className="card-bottom mt-auto">
          <span aria-label={`Rating ${orchid.rating} out of 5`}>
            ★ {orchid.rating}
          </span>
          <Button
            variant="link"
            onClick={() => onDetail(orchid)}
            aria-label={`View detail ${orchid.orchidName}`}
          >
            View detail ↗
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}
