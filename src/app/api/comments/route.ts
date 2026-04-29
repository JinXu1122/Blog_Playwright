import { NextRequest, NextResponse } from 'next/server';
import { initDb } from '@/lib/db';
import { createComment, deleteComment } from '@/lib/posts';

initDb();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { postId, authorName, content } = body;

  if (!postId || !authorName || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const comment = createComment({
    postId,
    authorName,
    content,
    createdAt: new Date(),
  });

  return NextResponse.json(comment, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing comment id' }, { status: 400 });
  }

  const success = deleteComment(id);

  if (!success) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
