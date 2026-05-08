import { test, expect, request } from '@playwright/test';

// ============================================================
// API Tests for Posts
// ============================================================

test.describe('Posts API', () => {
  // Clean up before each test
  test.beforeEach(async ({ request }) => {
    await request.post('/api/test/cleanup');
  });

  test('GET /api/posts returns empty array initially', async ({ request }) => {
    const response = await request.get('/api/posts');
    expect(response.status()).toBe(200);

    const posts = await response.json();
    expect(posts).toEqual([]);
  });

  test('POST /api/posts creates a new post', async ({ request }) => {
    const response = await request.post('/api/posts', {
      data: {
        title: 'API Test Post',
        summary: 'API summary',
        content: 'API content',
        categoryId: null,
      }
    });

    expect(response.status()).toBe(201);

    const post = await response.json();
    expect(post.id).toBeDefined();
    expect(post.title).toBe('API Test Post');
    expect(post.summary).toBe('API summary');
    expect(post.content).toBe('API content');
    expect(post.categoryId).toBeNull();
    expect(post.viewCount).toBe(0);
  });

  test('POST /api/posts with category', async ({ request }) => {
    const response = await request.post('/api/posts', {
      data: {
        title: 'Tech Post',
        summary: 'Tech summary',
        content: 'Tech content',
        categoryId: 1, // Tech category
      }
    });

    expect(response.status()).toBe(201);

    const post = await response.json();
    expect(post.categoryId).toBe(1);
  });

  test('POST /api/posts missing required fields returns 400', async ({ request }) => {
    const response = await request.post('/api/posts', {
      data: {
        title: 'Missing Content',
        // summary and content missing
      }
    });

    expect(response.status()).toBe(400);
  });

  test('GET /api/posts returns all posts after creation', async ({ request }) => {
    // Create 3 posts
    await request.post('/api/posts', {
      data: { title: 'Post 1', summary: 'S1', content: 'C1', categoryId: null }
    });
    await request.post('/api/posts', {
      data: { title: 'Post 2', summary: 'S2', content: 'C2', categoryId: null }
    });
    await request.post('/api/posts', {
      data: { title: 'Post 3', summary: 'S3', content: 'C3', categoryId: null }
    });

    const response = await request.get('/api/posts');
    expect(response.status()).toBe(200);

    const posts = await response.json();
    expect(posts).toHaveLength(3);
  });

  test('GET /api/posts with category filter', async ({ request }) => {
    // Create posts with different categories
    await request.post('/api/posts', {
      data: { title: 'Tech Post', summary: 'T', content: 'C', categoryId: 1 }
    });
    await request.post('/api/posts', {
      data: { title: 'Life Post', summary: 'L', content: 'C', categoryId: 2 }
    });

    const response = await request.get('/api/posts?category=tech');
    expect(response.status()).toBe(200);

    const posts = await response.json();
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Tech Post');
  });

  test('GET /api/posts with search query', async ({ request }) => {
    await request.post('/api/posts', {
      data: { title: 'JavaScript Guide', summary: 'JS', content: 'C', categoryId: null }
    });
    await request.post('/api/posts', {
      data: { title: 'Python Tutorial', summary: 'Py', content: 'C', categoryId: null }
    });

    const response = await request.get('/api/posts?q=JavaScript');
    expect(response.status()).toBe(200);

    const posts = await response.json();
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('JavaScript Guide');
  });

  test('GET /api/posts/:id returns specific post', async ({ request }) => {
    // Create a post
    const createResponse = await request.post('/api/posts', {
      data: { title: 'Specific Post', summary: 'S', content: 'C', categoryId: null }
    });
    const created = await createResponse.json();

    // Get by ID
    const response = await request.get(`/api/posts/${created.id}`);
    expect(response.status()).toBe(200);

    const post = await response.json();
    expect(post.id).toBe(created.id);
    expect(post.title).toBe('Specific Post');
  });

  test('DELETE /api/posts/:id removes post', async ({ request }) => {
    // Create a post
    const createResponse = await request.post('/api/posts', {
      data: { title: 'To Delete', summary: 'S', content: 'C', categoryId: null }
    });
    const created = await createResponse.json();

    // Delete the post
    const deleteResponse = await request.delete(`/api/posts/${created.id}`);
    expect(deleteResponse.status()).toBe(200);

    // Verify post is deleted
    const getResponse = await request.get(`/api/posts/${created.id}`);
    expect(getResponse.status()).toBe(404);
  });

  test('Posts are ordered by createdAt descending', async ({ request }) => {
    // Create posts with slight delay to ensure different timestamps
    const post1 = await (await request.post('/api/posts', {
      data: { title: 'First Post', summary: 'S', content: 'C', categoryId: null }
    })).json();

    // Wait to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 1000));

    const post2 = await (await request.post('/api/posts', {
      data: { title: 'Second Post', summary: 'S', content: 'C', categoryId: null }
    })).json();

    const response = await request.get('/api/posts');
    const posts = await response.json();

    // Newer post should be first
    expect(posts[0].id).toBe(post2.id);
    expect(posts[1].id).toBe(post1.id);
  });
});
