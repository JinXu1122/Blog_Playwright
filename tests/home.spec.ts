import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { CreatePostPage } from './pages/CreatePostPage';
import { PostDetailPage } from './pages/PostDetailPage';

test.beforeEach(async ({ page }) => {
  await page.request.post('/api/test/cleanup');
});

test.describe('Post Management', () => {
 test('TC-001a: Navigate via header Write Post button', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickHeaderWritePost(); 
  await page.pause();
  await expect(page).toHaveURL('/create');
});

test('TC-001b: Navigate via main Write Post button', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickMainWritePost();  
  await page.pause();
  await expect(page).toHaveURL('/create');
});

  test('TC-002: Create post', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    await createPostPage.createPost('Test Post', 'Test summary', 'Test content');
    await page.pause();
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Test Post').first()).toBeVisible();
  });

  test('TC-003: Create post with category', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    await createPostPage.createPost('Tech Post', 'Tech summary', 'Tech content', 'Tech');
    await page.pause();
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Tech Post').first()).toBeVisible();
  });

  test('TC-005: View post detail with category', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    const homePage = new HomePage(page);
    const postDetailPage = new PostDetailPage(page);

    await createPostPage.createPost('Detail View Test', 'Detail summary', 'Detail content', 'Life');

    //await homePage.goto();
    const firstPostHref = await homePage.getFirstPostLink();
    await page.goto(firstPostHref);
    await page.pause();
    await expect(page.url()).toMatch(/\/posts\/\d+/);
    await expect(postDetailPage.article).toBeVisible();

    await expect(page.locator('h1')).toHaveText('Detail View Test');
    await expect(page.locator('.text-xl')).toContainText('Detail summary');
    await expect(page.locator('.whitespace-pre-wrap')).toHaveText('Detail content');
    await expect(page.locator('article a:text("Life")')).toBeVisible();
  });

  test('TC-006: Delete post', async ({ page }) => {
    const createPostPage = new CreatePostPage(page);
    const homePage = new HomePage(page);

    await createPostPage.createPost('Post to Delete', 'Delete test', 'Delete content');

    await homePage.goto();
    await page.pause(); 
    page.on('dialog', dialog => dialog.accept());
    await homePage.deletePost('Post to Delete');
    await expect(page.locator('text=Post to Delete').first()).not.toBeVisible();
  });
});
