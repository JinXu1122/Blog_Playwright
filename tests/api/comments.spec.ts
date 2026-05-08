import { test, expect, request } from '@playwright/test';

// ============================================================
// API Tests for Comments
// ============================================================

test.describe('Comments API', () => {
  // Clean up before each test
  test.beforeEach(async ({ request }) => {
    await request.post('/api/test/cleanup');
  });

  test('POST /api/comments creates a comment', async ({ request }) => {
    // Create a post first
    const postResponse = await request.post('/api/posts', {
      data: {
        title: 'Post for Comment',
        summary: 'Test',
        content: 'Test content',
        categoryId: null,
      }
    });
    const post = await postResponse.json();

    // Create comment
    const commentResponse = await request.post('/api/comments', {
      data: {
        postId: post.id,
        authorName: 'John',
        content: 'Great post!',
      }
    });

    expect(commentResponse.status()).toBe(201);
    const comment = await commentResponse.json();
    expect(comment.id).toBeDefined();
    expect(comment.authorName).toBe('John');
    expect(comment.content).toBe('Great post!');
    expect(comment.postId).toBe(post.id);
  });

  test('POST /api/comments missing fields returns 400', async ({ request }) => {
    // Missing authorName
    const response = await request.post('/api/comments', {
      data: {
        postId: 1,
        content: 'Great post!',
      }
    });

    expect(response.status()).toBe(400);
  });

  test('DELETE /api/comments removes comment', async ({ request }) => {
    // Create a post and comment
    const postResponse = await request.post('/api/posts', {
      data: {
        title: 'Post for Delete Comment',
        summary: 'Test',
        content: 'Test content',
        categoryId: null,
      }
    });
    const post = await postResponse.json();

    const commentResponse = await request.post('/api/comments', {
      data: {
        postId: post.id,
        authorName: 'User',
        content: 'To delete',
      }
    });
    const comment = await commentResponse.json();

    // Delete comment
    const deleteResponse = await request.delete('/api/comments', {
      data: { id: comment.id }
    });

    expect(deleteResponse.status()).toBe(200);
  });

  test('DELETE /api/comments with non-existent id returns 404', async ({ request }) => {
    const deleteResponse = await request.delete('/api/comments', {
      data: { id: 99999 }
    });

    expect(deleteResponse.status()).toBe(404);
  });
});
