'use client';
import { useState } from 'react';
import { usePostAuthor } from '../hooks/usePostAuthor';
import { useQuery } from '@tanstack/react-query';

export default function AuthorDetails({ userId }: { userId: number }) {
  const [showAuthor, setShowAuthor] = useState(false);

const { data: author, isLoading, error } = usePostAuthor(userId, showAuthor);

  return (
    <div>
      <button
        onClick={() => setShowAuthor(!showAuthor)}
        data-testid="author-component"
        style={{
          backgroundColor: showAuthor ? '#ccc' : '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '8px 12px',
          cursor: 'pointer',
        }}
      >
        Author
      </button>

      {showAuthor && (
        <div style={{ marginTop: '10px' }}>
          {isLoading && <p>Loading author details...</p>}
          {error && <p style={{ color: 'red' }}>Error loading author details</p>}
          {author && (
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
                Author Details
              </h4>
              <p>
                <strong>Name:</strong> {author.name}
              </p>
              <p>
                <strong>Username:</strong> {author.username}
              </p>
              <p>
                <strong>Email:</strong> {author.email}
              </p>
              <p>
                <strong>Website:</strong> {author.website}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
