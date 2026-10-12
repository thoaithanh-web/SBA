import { test, expect } from '@playwright/test'
import fs from 'node:fs/promises'
test('list renders eight unique cards and valid local images', async ({
  page,
}) => {
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/')
  await expect(page.getByTestId('orchid-card')).toHaveCount(8)
  const names = await page
    .getByTestId('orchid-card')
    .locator('h3')
    .allTextContents()
  expect(new Set(names).size).toBe(8)
  await expect
    .poll(
      async () =>
        await page
          .getByTestId('orchid-card')
          .locator('img')
          .evaluateAll((imgs) =>
            imgs.every((i) => i.complete && i.naturalWidth > 0),
          ),
    )
    .toBe(true)
  expect(errors).toEqual([])
  await fs.mkdir('docs/evidence', { recursive: true })
  await page.screenshot({
    path: 'docs/evidence/01-gallery.png',
    fullPage: true,
  })
})
test('detail follows selected card and closes with button and Escape', async ({
  page,
}) => {
  await page.goto('/')
  await page
    .getByRole('button', { name: 'View detail Ceasar 4N', exact: true })
    .click()
  await expect(page.getByRole('dialog')).toContainText('Taiwan')
  await expect(page.getByRole('dialog')).toContainText('Ceasar 4N')
  await fs.mkdir('docs/evidence', { recursive: true })
  await page.screenshot({ path: 'docs/evidence/02-detail.png' })
  await page
    .getByRole('dialog')
    .locator('.modal-footer')
    .getByRole('button', { name: 'Close', exact: true })
    .click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page
    .getByRole('button', { name: 'View detail Golden Sun', exact: true })
    .click()
  await expect(page.getByRole('dialog')).toContainText('Golden Sun')
  await expect(page.getByRole('dialog')).not.toContainText('Ceasar 4N')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
test('mobile navbar and gallery fit the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByTestId('orchid-card')).toHaveCount(8)
  await page.getByRole('button', { name: 'Toggle navigation' }).click()
  await expect(
    page.getByRole('link', { name: 'Collection', exact: true }),
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await fs.mkdir('docs/evidence', { recursive: true })
  await page.screenshot({ path: 'docs/evidence/03-mobile.png', fullPage: true })
})

test('network load, cache hit, force reload and local filters', async ({
  page,
}) => {
  let requests = 0
  page.on('request', (r) => {
    if (new URL(r.url()).pathname === '/orchids.json') requests++
  })
  await page.goto('/')
  await expect(page.getByTestId('orchid-card')).toHaveCount(8)
  const first = requests
  expect(first).toBeGreaterThan(0)
  await page
    .getByRole('button', { name: 'Load collection', exact: true })
    .click()
  await expect(page.getByText('From cache · 30s TTL')).toBeVisible()
  expect(requests).toBe(first)
  await page.getByLabel('Search orchids').fill(' MINI ')
  await expect(page.getByTestId('orchid-card')).toHaveCount(1)
  await page.getByLabel('Search orchids').fill('unmatched')
  await expect(page.getByText('No matching orchids')).toBeVisible()
  await page.getByRole('button', { name: 'Clear filters' }).click()
  await page.getByLabel('Category', { exact: true }).selectOption('Cattleya')
  await expect(page.getByTestId('orchid-card')).toHaveCount(2)
  await page.getByLabel('Special only').check()
  await expect(page.getByTestId('orchid-card')).toHaveCount(1)
  expect(requests).toBe(first)
  await page.getByRole('button', { name: 'Force reload' }).click()
  await expect(page.getByText('Fresh from network')).toBeVisible()
  expect(requests).toBe(first + 1)
})
test('loading is visible while response is pending', async ({ page }) => {
  await page.route('**/orchids.json', async (route) => {
    await new Promise((r) => setTimeout(r, 800))
    await route.continue()
  })
  await page.goto('/')
  await expect(page.getByText('Gathering the collection…')).toBeVisible()
  await expect(page.getByTestId('orchid-card')).toHaveCount(8)
})
test('HTTP failure has error evidence and retry recovers', async ({ page }) => {
  await page.route('**/orchids.json', (route) =>
    route.fulfill({ status: 404, body: 'missing' }),
  )
  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('HTTP 404')
  await fs.mkdir('docs/evidence', { recursive: true })
  await page.screenshot({
    path: 'docs/evidence/04-http-error.png',
    fullPage: true,
  })
  await page.unroute('**/orchids.json')
  const response = page.waitForResponse(
    (r) => r.url().endsWith('/orchids.json') && r.status() === 200,
  )
  await page.getByRole('button', { name: 'Try again' }).click()
  const result = await response
  await fs.writeFile(
    'docs/evidence/network.json',
    JSON.stringify(
      {
        method: result.request().method(),
        url: new URL(result.url()).pathname,
        status: result.status(),
        contentType: result.headers()['content-type'],
        recordCount: (await result.json()).length,
      },
      null,
      2,
    ),
  )
  await expect(page.getByTestId('orchid-card')).toHaveCount(8)
})
test('invalid JSON is visible and does not crash', async ({ page }) => {
  await page.route('**/orchids.json', (r) =>
    r.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{invalid',
    }),
  )
  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('not valid JSON')
  await expect(page.getByText('Gathering the collection…')).toHaveCount(0)
})
test('empty response and invalid structure are handled distinctly', async ({
  page,
}) => {
  await page.route('**/orchids.json', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
  await page.goto('/')
  await expect(page.getByText('The collection is empty')).toBeVisible()
  await page.unroute('**/orchids.json')
  await page.route('**/orchids.json', (r) =>
    r.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '[{"id":"x"}]',
    }),
  )
  await page.getByRole('button', { name: 'Force reload' }).click()
  await expect(page.getByRole('alert')).toContainText('invalid data structure')
})
