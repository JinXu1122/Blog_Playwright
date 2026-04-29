import { test, expect } from '@playwright/test';
import { CreatePostPage } from './pages/CreatePostPage';
import { HomePage } from './pages/HomePage';
import { CommentPage } from './pages/CommentPage';

test.beforeEach(async ({ page }) => {
  await page.request.post('/api/test/cleanup');
});

test.describe('View Count Tests', () => {
  test('TC-007: Viewing post increases view count', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    const homePage = new HomePage(page);

    await createPostPage.createPost('View Count Test', 'View count', 'View content');

    await homePage.goto();
    const firstPostHref = await homePage.getFirstPostLink();
    await page.goto(firstPostHref);
    await expect(page.locator('article')).toBeVisible();
    await expect(page.getByText(/1 Read/)).toBeVisible({ timeout: 10000 });
  });

  test('TC-008: Adding comment does not increase view count', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    const homePage = new HomePage(page);
    const commentPage = new CommentPage(page);

    await createPostPage.createPost('View Count Comment Test', 'View count', 'View content');

    await homePage.goto();
    const firstPostHref = await homePage.getFirstPostLink();
    await page.goto(firstPostHref);
    await expect(page.getByText(/1 Read/)).toBeVisible();

    await commentPage.addComment('Tester', 'Nice!');
    await expect(page.getByText(/1 Read/)).toBeVisible();
  });

  test('TC-009: Repeated viewing increases count each time', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    const homePage = new HomePage(page);

    await createPostPage.createPost('Repeated View Test', 'View count', 'View content');

    await homePage.goto();
    const firstPostHref = await homePage.getFirstPostLink();
    await page.goto(firstPostHref);
    await expect(page.getByText(/1 Read/)).toBeVisible();

    await homePage.goto();
    const secondPostHref = await homePage.getFirstPostLink();
    await page.goto(secondPostHref);
    await expect(page.getByText(/2 Read/)).toBeVisible();
  });
});
