'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Error boundary caught:', error);
    }
  }, [error]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>エラーが発生しました</h2>
      <p>申し訳ございません。予期しないエラーが発生しました。</p>
      <button
        onClick={reset}
        style={{
          padding: '0.5rem 1rem',
          marginTop: '1rem',
          cursor: 'pointer',
        }}
      >
        再試行
      </button>
    </div>
  );
}
