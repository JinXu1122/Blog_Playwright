import { NextRequest, NextResponse } from 'next/server';
import { initDb } from '@/lib/db';
import { getPostById, deletePost, incrementViewCount, getCommentsForPost, getCategoryById } from '@/lib/posts';

initDb();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = parseInt(id);
  const post = getPostById(postId);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  incrementViewCount(postId);

  // Get updated post with new view count
  const updatedPost = getPostById(postId);
  const comments = getCommentsForPost(postId);
  const category = updatedPost?.categoryId ? getCategoryById(updatedPost.categoryId) : null;

  return NextResponse.json({
    ...updatedPost,
    comments,
    category,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = deletePost(parseInt(id));

  if (!success) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}