import { useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { useNews } from '../context/NewsContext'

export default function EntityDialog({ config, record, onClose, onSaved }) {
  const { data, save } = useNews()
  const [values, setValues] = useState(() =>
    Object.fromEntries(
      config
        .fields(data)
        .map((field) => [
          field.name,
          record
            ? Array.isArray(record[field.name])
              ? record[field.name].join(', ')
              : String(record[field.name] ?? '')
            : String(field.defaultValue ?? ''),
        ]),
    ),
  )
  const [error, setError] = useState('')
  const fields = config.fields(data)

  function submit(event) {
    event.preventDefault()
    setError('')
    try {
      save(config.collection, values, record?.id)
      onSaved(!record)
    } catch (exception) {
      setError(exception.message)
    }
  }

  return (
    <Modal
      show
      onHide={onClose}
      centered
      size={config.collection === 'news' ? 'lg' : undefined}
      aria-labelledby="entity-dialog-title"
    >
      <Form onSubmit={submit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title id="entity-dialog-title">
            {record ? 'Edit' : 'Create'} {config.singular.toLowerCase()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="modal-description">
            {record ? 'Update the details below and save your changes.' : config.createDescription}
          </p>
          {error && (
            <Alert variant="danger" role="alert">
              {error}
            </Alert>
          )}
          <div className="form-grid">
            {fields.map((field, index) => (
              <Form.Group
                key={field.name}
                className={field.fullWidth ? 'full-width' : ''}
                controlId={`field-${field.name}`}
              >
                <Form.Label>
                  {field.label}
                  {field.required && (
                    <span aria-hidden="true" className="text-danger">
                      {' '}
                      *
                    </span>
                  )}
                </Form.Label>
                {field.options ? (
                  <Form.Select
                    value={values[field.name]}
                    onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
                    required={field.required}
                    autoFocus={index === 0}
                    disabled={
                      record?.id === 'user-admin' &&
                      ['username', 'role', 'status'].includes(field.name)
                    }
                  >
                    {field.placeholder && <option value="">{field.placeholder}</option>}
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    as={field.multiline ? 'textarea' : 'input'}
                    rows={field.multiline ? field.rows || 3 : undefined}
                    type={field.type || 'text'}
                    value={values[field.name]}
                    onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    required={field.required}
                    autoFocus={index === 0}
                    disabled={record?.id === 'user-admin' && field.name === 'username'}
                    autoComplete="off"
                  />
                )}
                {field.help && <Form.Text>{field.help}</Form.Text>}
              </Form.Group>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {record ? 'Save changes' : `Create ${config.singular.toLowerCase()}`}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
