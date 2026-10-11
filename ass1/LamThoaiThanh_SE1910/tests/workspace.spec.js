import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { login } from './helpers'

test('dashboard totals and URL filters match the source records', async ({ page }) => {
  await login(page)
  await expect(page.locator('.stat-number')).toHaveText(['08', '04', '06', '05'])
  await page.getByRole('link', { name: 'Continue writing' }).click()
  await expect(page.getByRole('row')).toHaveCount(5)
  await expect(page.getByRole('button', { name: /^Drafts/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByLabel('Filter category').selectOption('cat-3')
  await expect(page.getByRole('row')).toHaveCount(3)
  await page.getByRole('button', { name: /^Published/ }).click()
  await expect(page.getByRole('heading', { name: 'No results found' })).toBeVisible()
})

test('settings save, validation and confirmed demo reset', async ({ page }) => {
  await login(page, '/settings')
  await page.getByLabel('Publication name').fill('')
  await page.getByRole('button', { name: 'Save settings' }).click()
  await expect(page.getByRole('alert')).toContainText('Publication name is required')
  await page.getByLabel('Publication name').fill('Campus Journal')
  await page.getByLabel('Tagline').fill('A shared campus story.')
  await page.getByRole('button', { name: 'Save settings' }).click()
  await page.goto('/dashboard')
  await expect(page.getByText('CAMPUS JOURNAL · EDITORIAL DESK')).toBeVisible()
  await expect(page.getByText(/A shared campus story/)).toBeVisible()
  await page.reload()
  await expect(page.getByText('CAMPUS JOURNAL · EDITORIAL DESK')).toBeVisible()
  await page.goto('/settings')
  await page.getByRole('button', { name: 'Restore demo data', exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(page.getByLabel('Publication name')).toHaveValue('Campus Journal')
  await page.getByRole('button', { name: 'Restore demo data', exact: true }).click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Restore demo data', exact: true })
    .click()
  await expect(page.getByLabel('Publication name')).toHaveValue('FU News')
})

test('recover unreadable saved data visibly and allow saving', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('fu-news:data:v1', '{invalid-json'))
  await login(page)
  await expect(page.getByRole('alert')).toContainText('Saved data could not be read')
  await page.goto('/categories')
  await page.getByRole('button', { name: 'New category', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Category name').fill('Recovered category')
  await dialog.getByRole('button', { name: 'Create category', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveCount(0)
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('fu-news:data:v1')).categories.length,
    ),
  ).toBe(7)
})

test('mobile menu, modal, keyboard focus and horizontal layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await login(page)
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.getByRole('link', { name: 'Category', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Categories', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
    'aria-expanded',
    'false',
  )
  await page.getByRole('button', { name: 'New category', exact: true }).click()
  await expect(page.getByRole('dialog').getByLabel('Category name')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'New category', exact: true })).toBeFocused()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})

test('desktop and mobile pages render without runtime errors', async ({ page }) => {
  const errors = []
  page.on('pageerror', (exception) => errors.push(exception.message))
  const capture = Boolean(process.env.CAPTURE_EVIDENCE)
  if (capture) await mkdir('docs/evidence', { recursive: true })
  await page.goto('/login')
  if (capture) await page.screenshot({ path: 'docs/evidence/01-login.png', fullPage: true })
  await login(page)
  for (const [path, file] of [
    ['dashboard', '02-dashboard'],
    ['categories', '03-categories'],
    ['news', '04-news'],
    ['users', '05-users'],
    ['settings', '06-settings'],
  ]) {
    await page.goto(`/${path}`)
    await expect(page.locator('h1')).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    if (capture) await page.screenshot({ path: `docs/evidence/${file}.png`, fullPage: true })
  }
  await page.goto('/news?new=1')
  await expect(page.getByRole('dialog')).toBeVisible()
  if (capture)
    await page.screenshot({ path: 'docs/evidence/07-article-dialog.png', fullPage: true })
  await page.keyboard.press('Escape')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/dashboard')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  if (capture) await page.screenshot({ path: 'docs/evidence/08-mobile.png', fullPage: true })
  expect(errors).toEqual([])
})
