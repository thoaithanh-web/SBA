import { useState } from 'react'
import { Alert, Button, Modal } from 'react-bootstrap'
import { Trash2 } from 'lucide-react'

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Delete',
  onConfirm,
  onClose,
}) {
  const [error, setError] = useState('')

  function confirm() {
    setError('')
    try {
      onConfirm()
    } catch (exception) {
      setError(exception.message)
    }
  }

  return (
    <Modal show onHide={onClose} centered aria-labelledby="confirm-dialog-title">
      <Modal.Header closeButton>
        <Modal.Title id="confirm-dialog-title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span className="confirm-icon">
          <Trash2 size={24} />
        </span>
        <p className="confirm-description">{description}</p>
        {error && (
          <Alert variant="danger" role="alert">
            {error}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirm}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
