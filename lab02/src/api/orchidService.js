import { getJson } from './apiClient.js'
export const CACHE_TTL = 30000
let snapshot = null
let generation = 0
export function validateOrchids(data) {
  if (
    !Array.isArray(data) ||
    data.some(
      (o) =>
        !o ||
        typeof o.id !== 'string' ||
        typeof o.orchidName !== 'string' ||
        typeof o.image !== 'string' ||
        typeof o.category !== 'string' ||
        typeof o.origin !== 'string' ||
        typeof o.color !== 'string' ||
        typeof o.description !== 'string' ||
        typeof o.isSpecial !== 'boolean' ||
        typeof o.rating !== 'number',
    ) ||
    new Set(data.map((o) => o.id)).size !== data.length
  )
    throw new Error('The orchid response has an invalid data structure.')
  return data
}
export async function getOrchids({ force = false, signal } = {}) {
  if (signal?.aborted) throw new DOMException('Request aborted', 'AbortError')
  if (!force && snapshot && Date.now() - snapshot.time < CACHE_TTL)
    return { orchids: structuredClone(snapshot.data), source: 'cache' }
  const requestGeneration = ++generation
  const data = validateOrchids(await getJson('/orchids.json', { signal }))
  if (!signal?.aborted && requestGeneration === generation)
    snapshot = { data: structuredClone(data), time: Date.now() }
  return { orchids: data, source: 'network' }
}
export function clearCache() {
  snapshot = null
  generation++
}
