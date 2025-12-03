'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error boundary caught:', error);
    }
  }, [error]);

  return (
    <html lang="ja">
      <body>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>重大なエラーが発生しました</h2>
          <p>申し訳ございません。アプリケーションでエラーが発生しました。</p>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1rem',
              marginTop: '1rem',
              cursor: 'pointer',
            }}
          >
            再読み込み
          </button>
        </div>
      </body>
    </html>
  );
}
