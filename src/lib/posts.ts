import { eq, desc, like, sql } from 'drizzle-orm';
import { db, posts, categories, comments } from './db';
import type { Post, NewPost, Category, Comment, NewComment } from './schema';

export function getAllPosts() {
  return db.select().from(posts).orderBy(desc(posts.createdAt)).all();
}

export function getPostById(id: number) {
  return db.select().from(posts).where(eq(posts.id, id)).get();
}

export function createPost(post: NewPost): Post {
  const result = db.insert(posts).values(post).returning().get();
  return result;
}

export function deletePost(id: number): boolean {
  db.delete(comments).where(eq(comments.postId, id)).run();
  const result = db.delete(posts).where(eq(posts.id, id)).run();
  return result.changes > 0;
}

export function incrementViewCount(id: number) {
  db.update(posts).set({ viewCount: sql`${posts.viewCount} + 1` }).where(eq(posts.id, id)).run();
}

export function getAllCategories(): Category[] {
  return db.select().from(categories).all();
}

export function getCategoryById(id: number): Category | undefined {
  return db.select().from(categories).where(eq(categories.id, id)).get();
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return db.select().from(categories).where(eq(categories.slug, slug)).get();
}

export function getPostsByCategory(categoryId: number): Post[] {
  return db.select().from(posts).where(eq(posts.categoryId, categoryId)).orderBy(desc(posts.createdAt)).all();
}

export function searchPosts(query: string): Post[] {
  const searchPattern = `%${query}%`;
  return db
    .select()
    .from(posts)
    .where(like(posts.title, searchPattern))
    .orderBy(desc(posts.createdAt))
    .all();
}

export function getCommentsForPost(postId: number): Comment[] {
  return db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .orderBy(comments.createdAt)
    .all();
}

export function createComment(comment: NewComment): Comment {
  const result = db.insert(comments).values(comment).returning().get();
  return result;
}

export function deleteComment(id: number): boolean {
  const result = db.delete(comments).where(eq(comments.id, id)).run();
  return result.changes > 0;
}