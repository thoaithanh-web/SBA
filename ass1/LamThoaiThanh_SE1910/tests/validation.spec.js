import { test, expect } from '@playwright/test'
import { login, openCreate } from './helpers'

test.beforeEach(async ({ page }) => {
  await login(page)
})

test('reject empty and duplicate category names', async ({ page }) => {
  await page.goto('/categories')
  const dialog = await openCreate(page, 'New category')
  await dialog.getByRole('button', { name: 'Create category', exact: true }).click()
  await expect(dialog.getByRole('alert')).toHaveText('Category name is required.')
  await dialog.getByLabel('Category name').fill('  CAMPUS LIFE  ')
  await dialog.getByRole('button', { name: 'Create category', exact: true }).click()
  await expect(dialog.getByRole('alert')).toContainText('already exists')
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(page.getByRole('row')).toHaveCount(7)
})

test('reject empty users, duplicate usernames and invalid email', async ({ page }) => {
  await page.goto('/users')
  const dialog = await openCreate(page, 'New user')
  await dialog.getByRole('button', { name: 'Create user', exact: true }).click()
  await expect(dialog.getByRole('alert')).toHaveText('Username is required.')
  await dialog.getByLabel('Full name').fill('Someone')
  await dialog.getByLabel('Username', { exact: true }).fill(' admin ')
  await dialog.getByRole('button', { name: 'Create user', exact: true }).click()
  await expect(dialog.getByRole('alert')).toContainText('already in use')
  await dialog.getByLabel('Username', { exact: true }).fill('new.editor')
  await dialog.getByLabel('Email address').fill('invalid')
  await dialog.getByRole('button', { name: 'Create user', exact: true }).click()
  await expect(dialog.getByRole('alert')).toHaveText('Enter a valid email address.')
})

test('reject incomplete articles and excessive tags', async ({ page }) => {
  await page.goto('/news')
  const dialog = await openCreate(page, 'New article')
  await dialog.getByRole('button', { name: 'Create article', exact: true }).click()
  await expect(dialog.getByRole('alert')).toHaveText('Article title is required.')
  await dialog.getByLabel('Article title').fill('Test')
  await dialog.getByRole('button', { name: 'Create article', exact: true }).click()
  await expect(dialog.getByRole('alert')).toHaveText('Article content is required.')
  await dialog.getByLabel('Article content').fill('Test content')
  await dialog.getByRole('button', { name: 'Create article', exact: true }).click()
  await expect(dialog.getByRole('alert')).toHaveText('Select an existing category.')
  await dialog.getByLabel('Category', { exact: true }).selectOption('cat-1')
  await dialog.getByLabel('Tags', { exact: true }).fill('1,2,3,4,5,6,7,8,9')
  await dialog.getByRole('button', { name: 'Create article', exact: true }).click()
  await expect(dialog.getByRole('alert')).toContainText('up to 8 tags')
})

test('block linked categories and linked authors from deletion', async ({ page }) => {
  await page.goto('/categories')
  await page.getByRole('button', { name: 'Delete category Campus life', exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText(
    'This category has articles',
  )
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click()
  await page.goto('/users')
  await page.getByRole('button', { name: 'Delete user thanh.lam', exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('This user has articles')
})

test('protect built-in administrator and show no-result states', async ({ page }) => {
  await page.goto('/users')
  await expect(page.getByRole('button', { name: 'Delete user Admin', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Edit user Admin', exact: true }).click()
  const dialog = page.getByRole('dialog')
  for (const label of ['Username', 'Role', 'Status'])
    await expect(dialog.getByLabel(label, { exact: true })).toBeDisabled()
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click()
  for (const [path, search] of [
    ['categories', 'categories'],
    ['users', 'users'],
    ['news', 'news'],
  ]) {
    await page.goto(`/${path}`)
    await page.getByLabel(`Search ${search}`).fill('no-such-record-99999')
    await expect(page.getByRole('heading', { name: 'No results found', exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Clear search' }).click()
    await expect(page.getByRole('heading', { name: 'No results found', exact: true })).toHaveCount(
      0,
    )
  }
})

test('persist failures leave dialog open and source data unchanged', async ({ page }) => {
  await page.goto('/categories')
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    }
  })
  const dialog = await openCreate(page, 'New category')
  await dialog.getByLabel('Category name').fill('Should not save')
  await dialog.getByRole('button', { name: 'Create category', exact: true }).click()
  await expect(dialog.getByRole('alert')).toContainText('could not be saved')
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(page.getByText('Should not save', { exact: true })).toHaveCount(0)
})

test('render user-supplied markup as text', async ({ page }) => {
  await page.goto('/categories')
  const dialog = await openCreate(page, 'New category')
  await dialog.getByLabel('Category name').fill('<img src=x onerror=alert(1)>')
  await dialog.getByRole('button', { name: 'Create category', exact: true }).click()
  await expect(page.getByText('<img src=x onerror=alert(1)>', { exact: true })).toBeVisible()
  await expect(page.locator('img[src="x"]')).toHaveCount(0)
})
