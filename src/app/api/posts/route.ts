import { NextRequest, NextResponse } from 'next/server';
import { initDb } from '@/lib/db';
import { getAllPosts, createPost, searchPosts, getAllCategories, getPostsByCategory } from '@/lib/posts';
import type { Post } from '@/lib/schema';

initDb();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category');

  let posts: Post[] = [];

  if (query) {
    posts = searchPosts(query);
  } else if (category) {
    const categoryRecord = getAllCategories().find(c => c.slug === category);
    if (categoryRecord) {
      posts = getPostsByCategory(categoryRecord.id);
    }
  } else {
    posts = getAllPosts();
  }

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, summary, content, categoryId } = body;

  if (!title || !summary || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const post = createPost({ title, summary, content, categoryId: categoryId || null, createdAt: new Date() });

  return NextResponse.json(post, { status: 201 });
}