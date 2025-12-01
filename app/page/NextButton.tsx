'use client';
import {memo} from 'react';

export default memo( function NextButton({ userId, setUserId }: { userId: number, setUserId: any }) {
const maxUserId = 10;
return (
    <button
        onClick={() => setUserId(userId + 1)}
        disabled={userId >= maxUserId}
        data-testid="next-button"

        style={{
        padding: '10px 20px',
        backgroundColor: userId >= maxUserId ? '#ccc' : '#4caf50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        position: 'absolute',
        right: 100,
        cursor: userId >= maxUserId ? 'not-allowed' : 'pointer'
        }}
    >
        Next
    </button>
);
});
