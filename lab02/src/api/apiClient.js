export async function getJson(url, { signal } = {}) {
  let response
  try {
    response = await fetch(url, { signal, cache: 'no-store' })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Network unavailable. Check your connection and try again.')
  }
  if (!response.ok)
    throw new Error(
      `HTTP ${response.status}: unable to load the orchid collection.`,
    )
  try {
    return await response.json()
  } catch {
    throw new Error('The orchid response is not valid JSON.')
  }
}
