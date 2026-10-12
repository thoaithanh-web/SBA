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
