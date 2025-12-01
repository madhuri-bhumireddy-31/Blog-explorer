'use client';
import { memo } from 'react';
import Comments from './Comments';
import AuthorDetails from './AuthorDetails';
import { useRouter } from 'next/navigation';

export default memo(function PostCard({ post, onHover }: { post: any; onHover: () => void }) {
  const router = useRouter();
  console.log('Rendering PostCard', post.id);
  return (
    <div
        style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '15px',
        margin: '15px',
        boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div
      onMouseEnter={onHover}
      onClick={() => router.push(`/post/${post.id}`)}
      className="border p-4 rounded-lg shadow hover:scale-105 transition-transform cursor-pointer">

      <p>
        <strong>ID:</strong> {post.id}
      </p>
      <p>
        <strong>Title:</strong> {post.title}
      </p>
      <p>
        <strong>Body:</strong> {post.body}
      </p>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Comments postId={post.id} />
        <AuthorDetails userId={post.userId} />
      </div>
    </div>
  );
});
