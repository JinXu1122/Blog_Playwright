import { test, expect } from '@playwright/test';
import { SearchPage } from './pages/SearchPage';
import { HomePage } from './pages/HomePage';
import { CreatePostPage } from './pages/CreatePostPage';

test.beforeEach(async ({ page }) => {
  await page.request.post('/api/test/cleanup');
});

test.describe('Search Tests', () => {
  test('TC-010: Search with matching results', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    const searchPage = new SearchPage(page);

    await createPostPage.createPost('Next.js Guide', 'Next.js tutorial', 'Next.js content');

    await searchPage.goto();
    await searchPage.search('Next.js');
    await expect(page).toHaveURL(/\/\?q=Next\.js/);
    await expect(page.locator('text=Next.js Guide').first()).toBeVisible();
  });

  test('TC-011: Search with no matching results', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
    await searchPage.search('xyz123');
    await expect(page.locator('text=No posts yet')).toBeVisible();
  });

  test('TC-012: Search text cleared when switching category', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const homePage = new HomePage(page);

    await searchPage.goto();
    await page.goto('/?q=test');
    await homePage.clickCategory('Tech');
    await expect(page).toHaveURL(/\/\?category=tech/);
    await expect(searchPage.searchInput).toHaveValue('');
  });

  test('TC-013: Clear filter returns all posts', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    const homePage = new HomePage(page);

    await createPostPage.createPost('Tech Category Post', 'Tech summary', 'Tech content', 'Tech');

    await page.goto('/?category=tech');
    await homePage.clickClearFilter();
    await expect(page).toHaveURL('/');
  });
});
