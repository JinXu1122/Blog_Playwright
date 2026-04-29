import { notFound } from 'next/navigation';
import Link from 'next/link';
import CommentSection from '@/components/CommentSection';
import type { Category, Comment } from '@/lib/schema';

interface PostWithMeta {
  id: number;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
  viewCount: number | null;
  categoryId: number | null;
  category: Category | null;
  comments: Comment[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const postId = parseInt(id);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/posts/${postId}`, { cache: 'no-store' });

  if (!res.ok) {
    notFound();
  }

  const post: PostWithMeta = await res.json();

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article>
      <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Back to List
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span>{formattedDate}</span>
          <span>·</span>
          <span>{post.viewCount || 0} Read{post.viewCount !== 1 ? 's' : ''}</span>
          {post.category && (
            <>
              <span>·</span>
              <Link
                href={`/?category=${post.category.slug}`}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                {post.category.name}
              </Link>
            </>
          )}
        </div>
      </header>

      <div className="prose prose-lg max-w-none mb-12">
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">{post.summary}</p>
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {post.content}
        </div>
      </div>

      <CommentSection postId={post.id} initialComments={post.comments} />
    </article>
  );
}
