import { createSeedData } from '../data/seed'

export const DATA_KEY = 'fu-news:data:v1'
const collections = ['categories', 'users', 'news']
const validStatus = value => value === 0 || value === 1
const hasText = value => typeof value === 'string' && value.trim().length > 0
const normalize = value => String(value ?? '').trim().toLocaleLowerCase()

function validateStoredData(data) {
  if (!data || data.version !== 1 || !hasText(data.settings?.publicationName) || typeof data.settings?.tagline !== 'string') return false
  if (!collections.every(key => Array.isArray(data[key]) && data[key].every(item => hasText(item.id) && validStatus(item.status)) && new Set(data[key].map(item => item.id)).size === data[key].length)) return false
  if (!data.categories.every(item => hasText(item.name) && typeof item.description === 'string')) return false
  if (!data.users.every(item => hasText(item.username) && hasText(item.name) && typeof item.email === 'string' && [1, 2].includes(item.role))) return false
  if (new Set(data.users.map(item => normalize(item.username))).size !== data.users.length) return false
  if (new Set(data.categories.map(item => normalize(item.name))).size !== data.categories.length) return false
  if (!data.users.some(item => item.id === 'user-admin' && item.username === 'Admin' && item.role === 1 && item.status === 1)) return false
  return data.news.every(item => hasText(item.title) && hasText(item.content) && Array.isArray(item.tags) && item.tags.every(tag => typeof tag === 'string') && !Number.isNaN(Date.parse(item.createdAt)) && !Number.isNaN(Date.parse(item.updatedAt)) && data.categories.some(category => category.id === item.categoryId) && data.users.some(user => user.id === item.createdBy))
}

export function loadData() {
  try {
    const raw = localStorage.getItem(DATA_KEY)
    if (!raw) return { data: createSeedData(), warning: '' }
    const parsed = JSON.parse(raw)
    if (!validateStoredData(parsed)) throw new Error('Invalid saved data')
    return { data: parsed, warning: '' }
  } catch {
    return { data: createSeedData(), warning: 'Saved data could not be read. Demo data is shown; your next successful save will replace the unreadable data.' }
  }
}

export function persistData(data) {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data))
  } catch {
    throw new Error('Your changes could not be saved. Allow site storage or free some browser space, then try again.')
  }
}

function required(value, label, maximum) {
  if (!hasText(value)) throw new Error(`${label} is required.`)
  if (value.trim().length > maximum) throw new Error(`${label} must be ${maximum} characters or fewer.`)
  return value.trim()
}

export function saveRecord(data, collection, values, id) {
  if (!collections.includes(collection)) throw new Error('Unknown record type.')
  const existing = id ? data[collection].find(item => item.id === id) : null
  if (id && !existing) throw new Error('This record no longer exists. Close the dialog and refresh the list.')
  const status = Number(values.status)
  if (!validStatus(status)) throw new Error('Select a valid status.')
  let record = { id: id || `${collection}-${crypto.randomUUID()}`, status }

  if (collection === 'categories') {
    const name = required(values.name, 'Category name', 80)
    if (data.categories.some(item => item.id !== id && normalize(item.name) === normalize(name))) throw new Error('A category with this name already exists.')
    if (String(values.description || '').trim().length > 300) throw new Error('Description must be 300 characters or fewer.')
    record = { ...record, name, description: String(values.description || '').trim() }
  }

  if (collection === 'users') {
    const username = required(values.username, 'Username', 40)
    const name = required(values.name, 'Full name', 80)
    const email = String(values.email || '').trim()
    const role = Number(values.role)
    if (!/^[a-zA-Z0-9._-]+$/.test(username)) throw new Error('Username may contain only letters, numbers, dots, underscores and hyphens.')
    if (data.users.some(item => item.id !== id && normalize(item.username) === normalize(username))) throw new Error('This username is already in use.')
    if (email.length > 120 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) throw new Error('Enter a valid email address.')
    if (![1, 2].includes(role)) throw new Error('Select a valid role.')
    if (id === 'user-admin' && (username !== 'Admin' || role !== 1 || status !== 1)) throw new Error('The demo administrator must remain active with username Admin and role Admin.')
    record = { ...record, username, name, email, role }
  }

  if (collection === 'news') {
    const title = required(values.title, 'Article title', 160)
    const content = required(values.content, 'Article content', 20000)
    if (!data.categories.some(item => item.id === values.categoryId)) throw new Error('Select an existing category.')
    if (!data.users.some(item => item.id === values.createdBy)) throw new Error('Select an existing author.')
    const tags = [...new Set(String(values.tags || '').split(',').map(tag => tag.trim()).filter(Boolean))]
    if (tags.length > 8 || tags.some(tag => tag.length > 30)) throw new Error('Use up to 8 tags, each 30 characters or fewer.')
    record = { ...record, title, content, categoryId: values.categoryId, createdBy: values.createdBy, tags, createdAt: existing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() }
  }

  return { ...data, [collection]: id ? data[collection].map(item => item.id === id ? record : item) : [record, ...data[collection]] }
}

export function deleteRecord(data, collection, id) {
  if (!collections.includes(collection) || !data[collection].some(item => item.id === id)) throw new Error('This record no longer exists.')
  if (collection === 'categories' && data.news.some(item => item.categoryId === id)) throw new Error('This category has articles. Reassign or delete its articles first.')
  if (collection === 'users' && id === 'user-admin') throw new Error('The demo administrator cannot be deleted.')
  if (collection === 'users' && data.news.some(item => item.createdBy === id)) throw new Error('This user has articles. Reassign or delete their articles first.')
  return { ...data, [collection]: data[collection].filter(item => item.id !== id) }
}

export function saveSettings(data, values) {
  const publicationName = required(values.publicationName, 'Publication name', 60)
  const tagline = required(values.tagline, 'Tagline', 150)
  return { ...data, settings: { publicationName, tagline } }
}

export function searchRecords(records, keyword, fields) {
  const query = normalize(keyword)
  return records.filter(item => fields.some(field => normalize(item[field]).includes(query)))
}
