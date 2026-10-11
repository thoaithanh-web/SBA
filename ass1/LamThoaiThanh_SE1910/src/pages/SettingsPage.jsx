import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { RotateCcw, Save, Settings2 } from 'lucide-react'
import { useNews } from '../context/NewsContext'
import PageHeading from '../components/PageHeading'
import ConfirmDialog from '../components/ConfirmDialog'

export default function SettingsPage() {
  const { data, updateSettings, reset } = useNews()
  const [values, setValues] = useState(data.settings)
  const [error, setError] = useState('')
  const [confirming, setConfirming] = useState(false)

  function submit(event) {
    event.preventDefault()
    setError('')
    try {
      updateSettings(values)
    } catch (exception) {
      setError(exception.message)
    }
  }

  function restore() {
    reset()
    setValues({ publicationName: 'FU News', tagline: 'The campus, connected.' })
    setError('')
    setConfirming(false)
  }

  return <><PageHeading title="Workspace settings" description="A few details that make this newsroom yours." /><div className="settings-layout"><section className="panel"><div className="panel-header"><div><h2>Publication details</h2><small>Displayed on your dashboard</small></div><Settings2 size={18} className="muted" /></div><Form className="settings-form" onSubmit={submit} noValidate>{error && <Alert variant="danger" role="alert">{error}</Alert>}<Form.Group className="form-group" controlId="publication-name"><Form.Label>Publication name</Form.Label><Form.Control required maxLength={60} value={values.publicationName} onChange={event => setValues({ ...values, publicationName: event.target.value })} /></Form.Group><Form.Group className="form-group" controlId="publication-tagline"><Form.Label>Tagline</Form.Label><Form.Control required maxLength={150} value={values.tagline} onChange={event => setValues({ ...values, tagline: event.target.value })} /></Form.Group><Button type="submit"><Save size={15} />Save settings</Button><div className="settings-divider"><h3 className="fs-6">Restore demo data</h3><p className="muted small">Replace all articles, categories, users and settings with the original demo records.</p><Button type="button" variant="outline-secondary" onClick={() => setConfirming(true)}><RotateCcw size={14} />Restore demo data</Button></div></Form></section><aside className="panel"><div className="panel-header"><h2>About this workspace</h2></div><div className="settings-details"><dl><dt>System</dt><dd>FUNewsManagementSystem</dd><dt>Student</dt><dd>Lâm Thoại Thanh · CE190169</dd><dt>Course & class</dt><dd>SBA301 · SE1910</dd><dt>Version</dt><dd>1.0.0</dd><dt>Data storage</dt><dd>This browser · localStorage</dd><dt>Sign-in</dt><dd>Admin / Admin · demo access</dd></dl></div><div className="panel-note">This is a coursework demo. Contributor records do not provide real sign-in accounts.</div></aside></div>{confirming && <ConfirmDialog title="Restore demo data?" description="All your changes to articles, categories, contributors and settings will be replaced with the original demo data. This action cannot be undone." confirmLabel="Restore demo data" onConfirm={restore} onClose={() => setConfirming(false)} />}</>
}
