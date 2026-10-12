import axios from 'axios'
import { validateOrchids } from './orchidService'
export async function getOrchidsWithAxios({ signal } = {}) {
  const response = await axios.get('/orchids.json', { signal })
  return validateOrchids(response.data)
}
