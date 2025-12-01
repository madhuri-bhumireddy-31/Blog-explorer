'use client';
import { useState } from 'react';
import { usePostComments } from '@/app/hooks/usePostComments';

export default function Comments({ postId }: { postId: number }) {
  const [showComments, setShowComments] = useState(false);


// Use useQuery to fetch comments
const { data: comments, isLoading, error } = usePostComments(postId, showComments);

  return (
    <div>
      <button aria-label="Comments"
        onClick={() => setShowComments(!showComments)}
        data-testid="comments-component"
        style={{
          backgroundColor: showComments ? '#ccc' : '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '8px 12px',
          cursor: 'pointer',
        }}
      >
        Comments
      </button>

      {showComments && (
        <div style={{ marginTop: '10px' }}>
          {isLoading && <p>Loading comments...</p>}
          {error && <p style={{ color: 'red' }}>Error loading comments</p>}
          {comments && (
            <>
              <h4
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px',
                  borderBottom: '2px solid #2196f3',
                  paddingBottom: '4px',
                }}
              >
                Comments:
              </h4>
              {comments.map((c: any) => (
                <div
                  key={c.id}
                  style={{ borderTop: '1px solid #eee', paddingTop: '5px', marginTop: '5px' }}
                >
                  <p>
                    <strong>{c.name}</strong> ({c.email}):
                  </p>
                  <p>{c.body}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
