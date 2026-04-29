import { test, expect } from '@playwright/test';
import { CategoryPage } from './pages/CategoryPage';

test.beforeEach(async ({ page }) => {
  await page.request.post('/api/test/cleanup');
});

test.describe('Category Filter Tests', () => {
  test('TC-014: Filter posts by category', async ({ page }) => {
    const categoryPage = new CategoryPage(page);
    await categoryPage.goto();
    await categoryPage.selectCategory('Tech');
    await expect(page).toHaveURL(/\/\?category=tech/);
  });

  test('TC-015: Category navigation visible', async ({ page }) => {
    const categoryPage = new CategoryPage(page);
    await categoryPage.goto();
    await expect(page.locator('text=All')).toBeVisible();
    await expect(page.locator('text=Tech')).toBeVisible();
    await expect(page.locator('text=Life')).toBeVisible();
    await expect(page.locator('text=Thoughts')).toBeVisible();
  });
});
