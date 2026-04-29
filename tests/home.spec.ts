import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { CreatePostPage } from './pages/CreatePostPage';
import { PostDetailPage } from './pages/PostDetailPage';

test.beforeEach(async ({ page }) => {
  await page.request.post('/api/test/cleanup');
});

test.describe('Post Management', () => {
  test('TC-001: Navigate to create post page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.clickWritePost();
    await expect(page).toHaveURL('/create');
    await expect(page.locator('form:has-text("Title")')).toBeVisible();
  });

  test('TC-002: Create post', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    await createPostPage.createPost('Test Post', 'Test summary', 'Test content');
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Test Post').first()).toBeVisible();
  });

  test('TC-003: Create post with category', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    await createPostPage.createPost('Tech Post', 'Tech summary', 'Tech content', 'Tech');
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Tech Post').first()).toBeVisible();
  });

  test('TC-005: View post detail', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    const homePage = new HomePage(page);
    const postDetailPage = new PostDetailPage(page);

    await createPostPage.createPost('Detail View Test', 'Detail summary', 'Detail content');

    await homePage.goto();
    const firstPostHref = await homePage.getFirstPostLink();
    await page.goto(firstPostHref);
    await expect(page.url()).toMatch(/\/posts\/\d+/);
    await expect(postDetailPage.article).toBeVisible();
  });

  test('TC-006: Delete post', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    const homePage = new HomePage(page);

    await createPostPage.createPost('Post to Delete', 'Delete test', 'Delete content');

    await homePage.goto();
    page.on('dialog', dialog => dialog.accept());
    await homePage.deletePost('Post to Delete');
    await expect(page.locator('text=Post to Delete').first()).not.toBeVisible();
  });
});
