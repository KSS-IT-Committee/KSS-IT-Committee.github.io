/**
 * EventsPageClient Component
 *
 * Client-side component for the events list page.
 * Fetches and displays all events with RSVP counts.
 * Optimized with useCallback to prevent unnecessary re-renders.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { EventWithCounts } from '@/types/events';
import EventCard from '@/components/events/EventCard';
import BackButton from '@/components/BackButton';
import LogoutButton from '@/components/LogoutButton';
import styles from './events.module.css';

export default function EventsPageClient() {
  const [events, setEvents] = useState<EventWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Memoize fetchEvents to prevent recreation on every render
  const fetchEvents = useCallback(async () => {
    try {
      // Client-side fetch for authenticated endpoint
      // No cache options needed - respects server's Cache-Control headers
      const response = await fetch('/api/events');
      const data = await response.json();

      if (response.ok) {
        setEvents(data.events);
      } else {
        setError(data.error || 'イベントの取得に失敗しました');
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <BackButton path="/committee-info" title="メンバーページに戻る" />
        <LogoutButton />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>イベント・出欠管理</h1>
        <button
          type="button"
          className={styles.createButton}
          onClick={() => router.push('/events/create')}
        >
          イベントを作成
        </button>
      </div>

      {loading && <div className={styles.loading}>読み込み中...</div>}

      {error && <div className={styles.error}>{error}</div>}

      {!loading && !error && events.length === 0 && (
        <div className={styles.empty}>イベントがありません</div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className={styles.eventList}>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => router.push(`/events/${event.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
