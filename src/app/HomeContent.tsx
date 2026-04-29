'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PostCard from '@/components/PostCard';
import type { Post, Category } from '@/lib/schema';

interface PostWithMeta extends Post {
  category?: Category | null;
}

export default function HomeContent() {
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLabel, setFilterLabel] = useState('All Posts');
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    if (query) {
      setFilterLabel(`Search Results: "${query}"`);
      fetchPosts(`?q=${encodeURIComponent(query)}`);
    } else if (category) {
      const cat = categories.find(c => c.slug === category);
      setFilterLabel(cat ? `Category: ${cat.name}` : category);
      fetchPosts(`?category=${category}`);
    } else {
      setFilterLabel('All Posts');
      fetchPosts('');
    }
  }, [searchParams, categories]);

  const fetchMeta = async () => {
    const catRes = await fetch('/api/categories');
    const cats = await catRes.json();
    setCategories(cats);
  };

  const fetchPosts = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts${query}`);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      fetchPosts(window.location.search);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const getCategoryForPost = (post: Post): Category | null => {
    if (!post.categoryId) return null;
    return categories.find(c => c.id === post.categoryId) || null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">No posts yet</h2>
        <p className="text-gray-500 mb-6">Start writing your first post!</p>
        <Link
          href="/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Write Post
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{filterLabel}</h1>
        {(searchParams.get('q') || searchParams.get('category')) && (
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Clear Filter
          </Link>
        )}
      </div>
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            category={getCategoryForPost(post)}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
