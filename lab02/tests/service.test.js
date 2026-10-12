import { test, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { getOrchids, clearCache, CACHE_TTL } from '../src/api/orchidService.js'
const data = JSON.parse(
  await readFile(new URL('../public/orchids.json', import.meta.url)),
)
const originalFetch = globalThis.fetch
const originalNow = Date.now
afterEach(() => {
  globalThis.fetch = originalFetch
  Date.now = originalNow
  clearCache()
})
test('cache expires at TTL boundary, force bypasses and returned arrays are isolated', async () => {
  let now = 1000,
    calls = 0
  Date.now = () => now
  globalThis.fetch = async () => {
    calls++
    return new Response(JSON.stringify(data))
  }
  const first = await getOrchids()
  first.orchids[0].orchidName = 'mutated'
  now += CACHE_TTL - 1
  assert.equal((await getOrchids()).orchids[0].orchidName, data[0].orchidName)
  assert.equal(calls, 1)
  now++
  await getOrchids()
  assert.equal(calls, 2)
  await getOrchids({ force: true })
  assert.equal(calls, 3)
})
test('a failed request is never cached', async () => {
  let calls = 0
  globalThis.fetch = async () => {
    calls++
    return calls === 1
      ? new Response('missing', { status: 404 })
      : new Response(JSON.stringify(data))
  }
  await assert.rejects(getOrchids(), /HTTP 404/)
  assert.equal((await getOrchids()).source, 'network')
  assert.equal(calls, 2)
})
test('aborted request cannot overwrite a newer successful snapshot', async () => {
  let release
  globalThis.fetch = () =>
    new Promise((resolve) => {
      release = resolve
    })
  const controller = new AbortController()
  const old = getOrchids({ signal: controller.signal })
  controller.abort()
  globalThis.fetch = async () => new Response(JSON.stringify(data))
  await getOrchids({ force: true })
  release(new Response(JSON.stringify([])))
  await old
  assert.equal((await getOrchids()).orchids.length, 8)
})
test('network failure and duplicate ids are rejected', async () => {
  globalThis.fetch = async () => {
    throw new TypeError('offline')
  }
  await assert.rejects(getOrchids(), /Network unavailable/)
  globalThis.fetch = async () =>
    new Response(JSON.stringify([data[0], data[0]]))
  await assert.rejects(getOrchids(), /invalid data structure/)
})
