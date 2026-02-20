import { test, expect } from '@playwright/test'

test('products page renders main title', async ({ page }) => {
  await page.goto('/products')
  await expect(page.getByRole('heading', { name: 'Panel de productos' })).toBeVisible()
})
