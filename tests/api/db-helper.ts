import { expect } from '@playwright/test';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'blog.db');

export function queryDb(sql: string, params: any[] = []): any {
  const db = new Database(dbPath);
  try {
    const stmt = db.prepare(sql);
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return stmt.all(...params);
    } else {
      return stmt.run(...params);
    }
  } finally {
    db.close();
  }
}

// Posts table assertions
export function assertPostInDb(postId: number, expectedData: {
  title?: string;
  summary?: string;
  content?: string;
  categoryId?: number | null;
  viewCount?: number;
}) {
  const post = queryDb('SELECT * FROM posts WHERE id = ?', [postId]) as any[];

  if (expectedData.title !== undefined) {
    expect(post[0].title).toBe(expectedData.title);
  }
  if (expectedData.summary !== undefined) {
    expect(post[0].summary).toBe(expectedData.summary);
  }
  if (expectedData.content !== undefined) {
    expect(post[0].content).toBe(expectedData.content);
  }
  if (expectedData.categoryId !== undefined) {
    expect(post[0].category_id).toBe(expectedData.categoryId);
  }
  if (expectedData.viewCount !== undefined) {
    expect(post[0].view_count).toBe(expectedData.viewCount);
  }
}

export function assertPostNotInDb(postId: number) {
  const post = queryDb('SELECT * FROM posts WHERE id = ?', [postId]) as any[];
  expect(post.length).toBe(0);
}

export function assertPostCountInDb(expectedCount: number) {
  const result = queryDb('SELECT COUNT(*) as count FROM posts') as any[];
  expect(result[0].count).toBe(expectedCount);
}

// Comments table assertions
export function assertCommentInDb(commentId: number, expectedData: {
  postId?: number;
  authorName?: string;
  content?: string;
}) {
  const comment = queryDb('SELECT * FROM comments WHERE id = ?', [commentId]) as any[];

  if (expectedData.postId !== undefined) {
    expect(comment[0].post_id).toBe(expectedData.postId);
  }
  if (expectedData.authorName !== undefined) {
    expect(comment[0].author_name).toBe(expectedData.authorName);
  }
  if (expectedData.content !== undefined) {
    expect(comment[0].content).toBe(expectedData.content);
  }
}

export function assertCommentNotInDb(commentId: number) {
  const comment = queryDb('SELECT * FROM comments WHERE id = ?', [commentId]) as any[];
  expect(comment.length).toBe(0);
}

export function assertCommentCountForPost(postId: number, expectedCount: number) {
  const result = queryDb(
    'SELECT COUNT(*) as count FROM comments WHERE post_id = ?',
    [postId]
  ) as any[];
  expect(result[0].count).toBe(expectedCount);
}

// API-DB consistency validation helper
export function validateApiDbConsistency(
  apiResponse: any,
  tableName: 'posts' | 'comments',
  operation: 'CREATE' | 'UPDATE' | 'DELETE'
) {
  switch (tableName) {
    case 'posts':
      if (operation === 'CREATE') {
        assertPostInDb(apiResponse.id, {
          title: apiResponse.title,
          summary: apiResponse.summary,
          content: apiResponse.content,
          categoryId: apiResponse.categoryId,
        });
      } else if (operation === 'DELETE') {
        assertPostNotInDb(apiResponse.id);
      }
      break;
    case 'comments':
      if (operation === 'CREATE') {
        assertCommentInDb(apiResponse.id, {
          postId: apiResponse.postId,
          authorName: apiResponse.authorName,
          content: apiResponse.content,
        });
      } else if (operation === 'DELETE') {
        assertCommentNotInDb(apiResponse.id);
      }
      break;
  }
}
