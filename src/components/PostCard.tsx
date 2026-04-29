import Link from 'next/link';
import type { Post, Category } from '@/lib/schema';

interface PostCardProps {
  post: Post;
  category?: Category | null;
  onDelete?: (id: number) => void;
}

export default function PostCard({ post, category, onDelete }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <Link href={`/posts/${post.id}`}>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
          {post.title}
        </h2>
      </Link>
      <p className="text-gray-600 mb-4 line-clamp-2">{post.summary}</p>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {category && (
          <Link
            href={`/?category=${category.slug}`}
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
          >
            {category.name}
          </Link>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {formattedDate} · {post.viewCount || 0} Read{post.viewCount !== 1 ? 's' : ''}
        </span>
        {onDelete && (
          <button
            onClick={() => onDelete(post.id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
