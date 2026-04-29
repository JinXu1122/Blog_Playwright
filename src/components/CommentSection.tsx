'use client';

import { useState } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import type { Comment } from '@/lib/schema';

interface CommentSectionProps {
  postId: number;
  initialComments: Comment[];
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const handleCommentAdded = (newComment: Comment) => {
    setComments(prev => [...prev, newComment]);
  };

  return (
    <section className="border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h2>
      <div className="mb-8">
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      </div>
      <CommentList comments={comments} />
    </section>
  );
}
