'use client';
import {memo} from 'react';

export default memo(function PrevButton({ userId, setUserId }: { userId: number, setUserId: any }) {
    const minUserId = 1;
    return (
        <button
            onClick={() => setUserId(userId - 1)}
            disabled={userId <= minUserId}
            className="self-start"
            data-testid="prev-button"

            style={{
            padding: '10px 20px',
            backgroundColor: userId <= minUserId ? '#ccc' : '#2196f3',
            color: 'white',
            position: 'absolute',
            left: 100,
            border: 'none',
            borderRadius: '5px',
            cursor: userId <= minUserId ? 'not-allowed' : 'pointer'
            }}
        >
            Previous
        </button>
    );
});
