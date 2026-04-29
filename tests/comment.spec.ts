import { test, expect } from '@playwright/test';
import { CreatePostPage } from './pages/CreatePostPage';
import { HomePage } from './pages/HomePage';
import { CommentPage } from './pages/CommentPage';

test.beforeEach(async ({ page }) => {
  await page.request.post('/api/test/cleanup');
});

test.describe('Comment Tests', () => {
  test('TC-016: Add comment successfully', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    const homePage = new HomePage(page);
    const commentPage = new CommentPage(page);

    await createPostPage.createPost('Post for Comment', 'Comment test', 'Comment content');

    await homePage.goto();
    const firstPostHref = await homePage.getFirstPostLink();
    await page.goto(firstPostHref);

    await commentPage.addComment('John', 'Great post!');
    await expect(page.locator('text=Great post!')).toBeVisible();
  });

  test('TC-018: Add multiple comments', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    const homePage = new HomePage(page);
    const commentPage = new CommentPage(page);

    await createPostPage.createPost('Post for Multiple Comments', 'Comment test', 'Comment content');

    await homePage.goto();
    const firstPostHref = await homePage.getFirstPostLink();
    await page.goto(firstPostHref);

    // First comment
    await commentPage.addComment('User1', 'First comment');
    await expect(page.locator('text=First comment')).toBeVisible();
    await page.waitForTimeout(500);

    // Second comment
    await commentPage.fillName('User2');
    await commentPage.fillComment('Second comment');
    await commentPage.postComment();
    await expect(page.locator('text=Second comment')).toBeVisible();
  });
});
