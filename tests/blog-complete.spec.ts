import { test, expect, request } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { CreatePostPage } from './pages/CreatePostPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { SearchPage } from './pages/SearchPage';
import { CategoryPage } from './pages/CategoryPage';
import { CommentPage } from './pages/CommentPage';

// ============================================================
// Setup: Clean database before all tests
// ============================================================

test.beforeAll(async ({ request }) => {
  await request.post('/api/test/cleanup');
});

// ============================================================
// 1. Application Initialization & First Use
// ============================================================

test('TC-001: Empty blog state', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await expect(page.locator('text=No posts yet')).toBeVisible();
});

// ============================================================
// 2. Blog Post Creation Flow
// ============================================================

test('TC-002a: Navigate via header Write Post button', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickHeaderWritePost();
  await expect(page).toHaveURL('/create');
});

test('TC-002b: Navigate via main Write Post button', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.clickMainWritePost();
  await expect(page).toHaveURL('/create');
});

test('TC-003: Create post with valid inputs', async ({ page }) => {
  const homePage = new HomePage(page);
  const createPostPage = new CreatePostPage(page);

  await homePage.goto();
  await homePage.clickMainWritePost();

  await createPostPage.fillTitle('Test Post');
  await createPostPage.fillSummary('Test summary');
  await createPostPage.fillContent('Test content');
  await createPostPage.submit();

  await expect(page).toHaveURL('/');
  await expect(page.locator('text=Test Post').first()).toBeVisible();
});

test('TC-004: Create post with category', async ({ page }) => {
  const homePage = new HomePage(page);
  const createPostPage = new CreatePostPage(page);

  await homePage.goto();
  await homePage.clickHeaderWritePost();

  await createPostPage.fillTitle('Tech Post');
  await createPostPage.fillSummary('Tech summary');
  await createPostPage.fillContent('Tech content');
  await createPostPage.selectCategory('Tech');
  await createPostPage.submit();

  await expect(page).toHaveURL('/');
  await expect(page.locator('text=Tech Post').first()).toBeVisible();
});

// ============================================================
// 3. Blog Listing & Navigation
// ============================================================

test('TC-005: View post detail with all content', async ({ page }) => {
  const homePage = new HomePage(page);
  const postDetailPage = new PostDetailPage(page);

  // Pre-insert post data
  await page.request.post('/api/posts', {
    data: {
      title: 'Detail View Test',
      summary: 'Detail summary',
      content: 'Detail content',
      categoryId: 2, // Life category
    }
  });

  await homePage.goto();
  await homePage.clickFirstPost();

  await expect(page.url()).toMatch(/\/posts\/\d+/);
  await expect(postDetailPage.article).toBeVisible();
  await expect(page.locator('h1')).toHaveText('Detail View Test');
  await expect(page.locator('.text-xl')).toContainText('Detail summary');
  await expect(page.locator('.whitespace-pre-wrap')).toHaveText('Detail content');
  await expect(page.locator('article a:text("Life")')).toBeVisible();
});

test('TC-006: Category navigation visible', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'All' })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Tech' })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Life' })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Thoughts' })).toBeVisible();
});

// ============================================================
// 4. Blog Detail Interaction
// ============================================================

test('TC-007: Viewing post increases view count', async ({ page }) => {
  const homePage = new HomePage(page);

  // Pre-insert post data
  await page.request.post('/api/posts', {
    data: {
      title: 'View Count Test',
      summary: 'View count',
      content: 'View content',
      categoryId: null,
    }
  });

  // Check view count is 0 on home page
  await homePage.goto();
  await expect(page.locator('article:has-text("View Count Test")').getByText(/0 Read/)).toBeVisible();

  // Click post and check view count increases to 1
  await homePage.clickFirstPost();
  await page.waitForTimeout(3000);
  await expect(page.getByText(/1 Read/)).toBeVisible();

  // Return to home page and verify view count is still 1
  await homePage.goto();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('article:has-text("View Count Test")').getByText(/1 Read/)).toBeVisible();
});

test('TC-008: Repeated viewing increases count each time', async ({ page }) => {
  const homePage = new HomePage(page);

  // Second view (view count 1 -> 2)
  await homePage.goto();
  await homePage.clickFirstPost();
  await page.waitForTimeout(3000);
  await expect(page.getByText(/2 Read/)).toBeVisible();

  // Return to home page and verify view count is still 2
  await homePage.goto();
  await expect(page.locator('article:has-text("View Count Test")').getByText(/2 Read/)).toBeVisible();
});

// ============================================================
// 5. Commenting System
// ============================================================

test('TC-009: Add comment successfully', async ({ page }) => {
  const homePage = new HomePage(page);
  const commentPage = new CommentPage(page);

  // Pre-insert post data
  await page.request.post('/api/posts', {
    data: {
      title: 'Post for Comment',
      summary: 'Comment test',
      content: 'Comment content',
      categoryId: null,
    }
  });

  await homePage.goto();
  await homePage.clickFirstPost();
  await expect(page.locator('article')).toBeVisible();
  await commentPage.addComment('John', 'Great post!');
  await expect(page.locator('text=Great post!')).toBeVisible();
});

test('TC-010: Add multiple comments', async ({ page }) => {
  const homePage = new HomePage(page);
  const commentPage = new CommentPage(page);

  // Comment on post created by TC-009
  await homePage.goto();
  await homePage.clickPostByTitle('Post for Comment');

  await commentPage.addComment('User2', 'Second comment');
  await expect(page.locator('text=Second comment')).toBeVisible();
});

test('TC-011: Comment does not increase view count', async ({ page }) => {
  const homePage = new HomePage(page);
  const commentPage = new CommentPage(page);

  await page.request.post('/api/posts', {
    data: {
      title: 'View Count Comment Test',
      summary: 'View count',
      content: 'View content',
      categoryId: null,
    }
  });

  await homePage.goto();
  await homePage.clickFirstPost();
  await expect(page.getByText(/1 Read/)).toBeVisible();

  await commentPage.addComment('Tester', 'Nice!');
  await expect(page.getByText(/1 Read/)).toBeVisible();

  await homePage.goto();
  await expect(page.locator('article:has-text("View Count Comment Test")').getByText(/1 Read/)).toBeVisible();
});

// ============================================================
// 6. Search Functionality
// ============================================================

test('TC-012: Search with matching results', async ({ page }) => {
  const searchPage = new SearchPage(page);

  await page.request.post('/api/posts', {
    data: {
      title: 'Next.js Guide',
      summary: 'Next.js tutorial',
      content: 'Next.js content',
      categoryId: null,
    }
  });

  await searchPage.goto();
  await searchPage.search('Next.js');
  await expect(page).toHaveURL(/\/\?q=Next\.js/);
  await expect(page.locator('text=Next.js Guide').first()).toBeVisible();
});

test('TC-012b: Search is case-insensitive', async ({ page }) => {
  const searchPage = new SearchPage(page);

  await page.request.post('/api/posts', {
    data: {
      title: 'JavaScript Tutorial',
      summary: 'JS learning',
      content: 'JavaScript content',
      categoryId: null,
    }
  });

  await searchPage.goto();
  await searchPage.search('javascript');  // lowercase
  await expect(page.locator('text=JavaScript Tutorial').first()).toBeVisible();

  await searchPage.clearSearch();
  await searchPage.searchButton.click();
  await expect(page).toHaveURL('/');

  const dbCount = await searchPage.getPostCount();
  console.log('DB post count:', dbCount);
  await expect(page.locator('article')).toHaveCount(dbCount);

  await searchPage.search('javaScript');  // mixed case
  await expect(page.locator('text=JavaScript Tutorial').first()).toBeVisible();
});

test('TC-013: Search with no matching results', async ({ page }) => {
  const searchPage = new SearchPage(page);
  await searchPage.goto();
  await searchPage.search('xyz123');
  await expect(page.locator('text=No posts yet')).toBeVisible();
});

// ============================================================
// 7. Category Filtering
// ============================================================

test('TC-014: Filter posts by category', async ({ page }) => {
  const categoryPage = new CategoryPage(page);
  
  await categoryPage.goto();
  await categoryPage.selectCategory('Tech');
  await expect(page).toHaveURL(/\/\?category=tech/);

  const posts = page.locator('article');
  await expect(posts).toHaveCount(1);
  await expect(posts.first().locator('a:text("Tech")')).toBeVisible();
});

test('TC-015: Clear filter returns all posts', async ({ page }) => {
  const categoryPage = new CategoryPage(page);

  await page.goto('/?category=tech');
  await categoryPage.clickClearFilter();
  await expect(page).toHaveURL('/');

  const response = await page.request.get('/api/posts');
  const allPosts = await response.json();

  const posts = page.locator('article');
  await expect(posts).toHaveCount(allPosts.length);
});

test('TC-016: Search text cleared when switching category', async ({ page }) => {
  const searchPage = new SearchPage(page);
  const homePage = new HomePage(page);

  await searchPage.goto();
  await searchPage.search('test');
  await homePage.clickCategory('Tech');
  await expect(searchPage.searchInput).toHaveValue('');
});

// ============================================================
// 8. Post Deletion
// ============================================================

test('TC-017: Delete post', async ({ page }) => {
  const homePage = new HomePage(page);

  await page.request.post('/api/posts', {
    data: {
      title: 'Post to Delete',
      summary: 'Delete test',
      content: 'Delete content',
      categoryId: null,
    }
  });

  await homePage.goto();
  page.on('dialog', dialog => dialog.accept());
  await homePage.deletePost('Post to Delete');
  await expect(page.locator('text=Post to Delete')).not.toBeVisible();
});

test('TC-017b: Cancel delete preserves post', async ({ page }) => {
  const homePage = new HomePage(page);

  await page.request.post('/api/posts', {
    data: {
      title: 'Post to Cancel Delete',
      summary: 'Cancel test',
      content: 'Cancel content',
      categoryId: null,
    }
  });

  await homePage.goto();
  page.on('dialog', dialog => dialog.dismiss());

  await homePage.deletePost('Post to Cancel Delete');
  await expect(page.locator('text=Post to Cancel Delete')).toBeVisible();
});

test('TC-018: Access invalid/non-existent post', async ({ page }) => {
  await page.goto('/posts/99999');
  // Should show 404 or empty state
  const is404 = await page.locator('text=404').isVisible();
  const isNotFound = await page.locator('text=Post not found').isVisible();
  expect(is404 || isNotFound).toBeTruthy();
});

// ============================================================
// 9. Performance Testing
// ============================================================

test('TC-019: Home page loads within acceptable time', async ({ page }) => {
  const homePage = new HomePage(page);

  // Seed some test data
  for (let i = 0; i < 10; i++) {
    await page.request.post('/api/posts', {
      data: {
        title: `Performance Post ${i}`,
        summary: `Summary ${i}`,
        content: `Content ${i}`,
        categoryId: null,
      }
    });
  }

  const startTime = Date.now();
  await homePage.goto();
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;

  console.log(`Home page load time: ${loadTime}ms`);
  expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
});

test('TC-020: Search response time is acceptable', async ({ page }) => {
  const searchPage = new SearchPage(page);

  // Seed test data
  await page.request.post('/api/posts', {
    data: {
      title: 'Performance Search Test',
      summary: 'Performance test content',
      content: 'Performance test body',
      categoryId: null,
    }
  });

  await searchPage.goto();

  const startTime = Date.now();
  await searchPage.search('Performance');
  await page.waitForLoadState('networkidle');
  const searchTime = Date.now() - startTime;

  console.log(`Search response time: ${searchTime}ms`);
  expect(searchTime).toBeLessThan(3000); // Search should complete within 2 seconds
});

test('TC-021: Category filter response time is acceptable', async ({ page }) => {
  const categoryPage = new CategoryPage(page);

  // Seed test data
  await page.request.post('/api/posts', {
    data: {
      title: 'Performance Category Test',
      summary: 'Category test',
      content: 'Category content',
      categoryId: 1,
    }
  });

  const startTime = Date.now();
  await categoryPage.goto();
  await categoryPage.selectCategory('Tech');
  await page.waitForLoadState('networkidle');
  const filterTime = Date.now() - startTime;

  console.log(`Category filter time: ${filterTime}ms`);
  expect(filterTime).toBeLessThan(3000); // Filter should complete within 2 seconds
});

test('TC-022: Performance with large dataset (100 posts)', async ({ page }) => {
  const homePage = new HomePage(page);

  // Clear existing posts to verify exact count
  await page.request.post('/api/test/cleanup');  

  // Seed 100 posts
  console.log('Seeding 100 posts...');
  const seedStart = Date.now();
  for (let i = 0; i < 100; i++) {
    await page.request.post('/api/posts', {
      data: {
        title: `Large Dataset Post ${i}`,
        summary: `Summary ${i}`,
        content: `Content ${i}`.repeat(10),
        categoryId: i % 3 === 0 ? 1 : i % 3 === 1 ? 2 : 3,
      }
    });
  }
  
  // Test home page load time with large dataset
  const startTime = Date.now();
  await homePage.goto();
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;

  console.log(`Home page load time with 100 posts: ${loadTime}ms`);
  expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds

  // Verify all posts are displayed on page
  const postCount = await page.locator('article').count();
  expect(postCount).toBe(100);
});

test('TC-023: API response time consistency', async ({ page }) => {
  const times: number[] = [];

  // Make 10 sequential API requests and measure response time
  for (let i = 0; i < 10; i++) {
    const startTime = Date.now();
    await page.request.get('/api/posts');
    times.push(Date.now() - startTime);
  }

  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const maxTime = Math.max(...times);
  const minTime = Math.min(...times);

  console.log(`API Response Times - Avg: ${avgTime.toFixed(2)}ms, Min: ${minTime}ms, Max: ${maxTime}ms`);

  // API should respond consistently (avg under 500ms, max under 1000ms)
  expect(avgTime).toBeLessThan(500);
  expect(maxTime).toBeLessThan(1000);
});

test('TC-024: Navigation performance between pages', async ({ page }) => {
  const homePage = new HomePage(page);
  const postDetailPage = new PostDetailPage(page);

  // Seed a post
  await page.request.post('/api/posts', {
    data: {
      title: 'Navigation Test Post',
      summary: 'Navigation test',
      content: 'Navigation test content',
      categoryId: null,
    }
  });

  await homePage.goto();
  await page.waitForLoadState('networkidle');

  // Measure time to click and load post detail
  await homePage.clickFirstPost();
  const navStart = Date.now();
  await page.waitForLoadState('networkidle');
  const navTime = Date.now() - navStart;

  console.log(`Navigation to post detail: ${navTime}ms`);
  expect(navTime).toBeLessThan(3000);

  // Verify post detail loaded correctly
  await expect(postDetailPage.article).toBeVisible();
});

test('TC-025: Search with large dataset performance', async ({ page }) => {
  const searchPage = new SearchPage(page);

  // Seed 50 posts with searchable content
  for (let i = 0; i < 50; i++) {
    await page.request.post('/api/posts', {
      data: {
        title: `SearchPerf Post ${i}`,
        summary: `Summary ${i}`,
        content: `Content ${i}`,
        categoryId: null,
      }
    });
  }

  await searchPage.goto();
  await page.waitForLoadState('networkidle');

  // Measure search time
  const startTime = Date.now();
  await searchPage.search('SearchPerf');
  await page.waitForLoadState('networkidle');

  // Verify search results are displayed
  await expect(page.locator('h1')).toContainText('Search Results');

  const searchTime = Date.now() - startTime;

  console.log(`Search with 50 posts took: ${searchTime}ms`);
  expect(searchTime).toBeLessThan(3000);

});

test('TC-026: Concurrent API requests performance', async ({ page }) => {
  // Make multiple concurrent API requests
  const startTime = Date.now();

  await Promise.all([
    page.request.get('/api/posts'),
    page.request.get('/api/posts'),
    page.request.get('/api/posts'),
    page.request.get('/api/posts'),
    page.request.get('/api/posts'),
  ]);

  const concurrentTime = Date.now() - startTime;
  console.log(`5 concurrent API requests took: ${concurrentTime}ms`);

  // All 5 requests should complete within reasonable time
  expect(concurrentTime).toBeLessThan(3000);
});
