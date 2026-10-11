import { test, expect } from '@playwright/test'
import { login } from './helpers'

test('protect deep links and validate empty and wrong credentials', async ({ page }) => {
  await page.goto('/news?status=0')
  await expect(page).toHaveURL(/\/login$/)
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveText('Enter both your username and password.')
  await page.getByLabel('Username', { exact: true }).fill('Admin')
  await page.getByLabel('Password', { exact: true }).fill('incorrect')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Incorrect username or password')
  await page.getByRole('button', { name: 'Show password' }).click()
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'text')
  await page.getByRole('button', { name: 'Hide password' }).click()
  await page.getByLabel('Password', { exact: true }).fill('Admin')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL(/\/news\?status=0$/)
  await expect(page.getByRole('button', { name: /^Drafts/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('keep session on refresh and deny access after sign out', async ({ page }) => {
  await login(page)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await page.goBack()
  await page.goto('/users')
  await expect(page).toHaveURL(/\/login$/)
  expect(await page.evaluate(() => sessionStorage.getItem('fu-news:session:v1'))).toBeNull()
})

test('render all navigation routes, history and not found', async ({ page }) => {
  await login(page)
  for (const [link, heading] of [
    ['Category', 'Categories'],
    ['News', 'News articles'],
    ['Users', 'Users & contributors'],
    ['Settings', 'Workspace settings'],
  ]) {
    await page.getByRole('link', { name: link, exact: true }).click()
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible()
  }
  await page.goBack()
  await expect(
    page.getByRole('heading', { name: 'Users & contributors', exact: true }),
  ).toBeVisible()
  await page.goto('/unknown-page')
  await expect(page.getByRole('heading', { name: 'This page is off the press' })).toBeVisible()
  await page.getByRole('link', { name: 'Back to dashboard' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
})
