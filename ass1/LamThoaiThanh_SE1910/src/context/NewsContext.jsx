import { createContext, useContext, useState } from 'react'
import { Alert, Toast, ToastContainer } from 'react-bootstrap'
import { CheckCircle2, X } from 'lucide-react'
import { createSeedData } from '../data/seed'
import { deleteRecord, loadData, persistData, saveRecord, saveSettings } from '../services/newsStore'

const NewsContext = createContext(null)

export function NewsProvider({ children }) {
  const [initial] = useState(loadData)
  const [data, setData] = useState(initial.data)
  const [warning, setWarning] = useState(initial.warning)
  const [notification, setNotification] = useState('')

  function commit(next, message) {
    persistData(next)
    setData(next)
    setWarning('')
    setNotification(message)
  }

  function save(collection, values, id) {
    commit(saveRecord(data, collection, values, id), `${collection === 'news' ? 'Article' : collection === 'users' ? 'User' : 'Category'} ${id ? 'updated' : 'created'} successfully.`)
  }

  function remove(collection, id) {
    commit(deleteRecord(data, collection, id), 'Record deleted successfully.')
  }

  function updateSettings(values) {
    commit(saveSettings(data, values), 'Workspace settings saved.')
  }

  function reset() {
    commit(createSeedData(), 'Demo data restored successfully.')
  }

  return (
    <NewsContext.Provider value={{ data, save, remove, updateSettings, reset }}>
      {warning && <Alert variant="warning" className="storage-notice m-3" role="alert">{warning}</Alert>}
      {children}
      <ToastContainer><Toast show={Boolean(notification)} onClose={() => setNotification('')} autohide delay={4500}><Toast.Body><CheckCircle2 size={19} /><span role="status">{notification}</span><button className="icon-button" aria-label="Dismiss notification" onClick={() => setNotification('')}><X size={15} /></button></Toast.Body></Toast></ToastContainer>
    </NewsContext.Provider>
  )
}

export function useNews() {
  return useContext(NewsContext)
}
