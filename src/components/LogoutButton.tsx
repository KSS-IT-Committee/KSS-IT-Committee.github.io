'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './LogoutButton.module.css';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={styles.logoutButton}
      disabled={loading}
    >
      {loading ? 'ログアウト中...' : 'ログアウト'}
    </button>
  );
}
