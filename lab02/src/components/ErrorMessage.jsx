import { Alert, Button } from 'react-bootstrap'
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status-panel">
      <Alert variant="danger" role="alert">
        <Alert.Heading>We could not load the collection.</Alert.Heading>
        <p>{message}</p>
        <Button variant="outline-danger" onClick={onRetry}>
          Try again
        </Button>
      </Alert>
    </div>
  )
}
