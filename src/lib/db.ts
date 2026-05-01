import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { posts, categories, comments } from './schema';
import path from 'path';

const dbPath = path.join(process.cwd(), 'blog.db');
const sqlite = new Database(dbPath);

export const db = drizzle(sqlite);

export function initDb() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      category_id INTEGER REFERENCES categories(id),
      created_at INTEGER NOT NULL,
      view_count INTEGER DEFAULT 0
    )
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE
    )
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE
    )
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS post_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL REFERENCES posts(id),
      tag_id INTEGER NOT NULL REFERENCES tags(id),
      UNIQUE(post_id, tag_id)
    )
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL REFERENCES posts(id),
      author_name TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);

  // Seed default categories
  const existingCategories = sqlite.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (existingCategories.count === 0) {
    sqlite.exec(`INSERT INTO categories (name, slug) VALUES ('Tech', 'tech')`);
    sqlite.exec(`INSERT INTO categories (name, slug) VALUES ('Life', 'life')`);
    sqlite.exec(`INSERT INTO categories (name, slug) VALUES ('Thoughts', 'thoughts')`);
  }
}

export { posts, categories, comments };

export function clearAllData() {
  sqlite.exec('DELETE FROM comments');
  sqlite.exec('DELETE FROM posts');
  // Reset autoincrement counters so next record starts from 1
  sqlite.exec("DELETE FROM sqlite_sequence WHERE name='posts'");
  sqlite.exec("DELETE FROM sqlite_sequence WHERE name='comments'");
}
