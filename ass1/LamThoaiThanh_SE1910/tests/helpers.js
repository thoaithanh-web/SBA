import { expect } from '@playwright/test'

export async function login(page, path = '/dashboard') {
  await page.goto(path)
  await page.getByLabel('Username', { exact: true }).fill('Admin')
  await page.getByLabel('Password', { exact: true }).fill('Admin')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
}

export async function openCreate(page, name) {
  await page.getByRole('button', { name, exact: true }).first().click()
  return page.getByRole('dialog')
}

export async function createCategory(page, name = 'Test category') {
  await page.goto('/categories')
  const dialog = await openCreate(page, 'New category')
  await dialog.getByLabel('Category name').fill(name)
  await dialog.getByLabel('Description').fill('A category for repeatable tests.')
  await dialog.getByRole('button', { name: 'Create category', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  return page.getByRole('row').filter({ hasText: name })
}

export async function createUser(page, username = 'test.editor') {
  await page.goto('/users')
  const dialog = await openCreate(page, 'New user')
  await dialog.getByLabel('Full name').fill('Test Editor')
  await dialog.getByLabel('Username', { exact: true }).fill(username)
  await dialog.getByLabel('Email address').fill('editor@example.edu')
  await dialog.getByRole('button', { name: 'Create user', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  return page.getByRole('row').filter({ hasText: username })
}
