/**
 * EventDetailClient Component
 *
 * Client-side component for the event detail page.
 * Shows event info, RSVP buttons, and attendee list.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { EventWithCreator, RSVPWithUser } from '@/types/events';
import { formatDate, formatTime } from '@/lib/dateUtils';
import RSVPButtons from '@/components/events/RSVPButtons';
import AttendeeList from '@/components/events/AttendeeList';
import BackButton from '@/components/BackButton';
import LogoutButton from '@/components/LogoutButton';
import styles from './detail.module.css';

interface EventData {
  event: EventWithCreator;
  attendees: RSVPWithUser[];
  counts: { yes: number; no: number; maybe: number };
  user_rsvp: 'yes' | 'no' | 'maybe' | null;
  user_id: number;
  is_creator: boolean;
}

export default function EventDetailClient() {
  const [data, setData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const responseData = await response.json();

      if (response.ok) {
        setData(responseData);
      } else if (response.status === 404) {
        setData(null);
      } else {
        setError(responseData.error || 'イベントの取得に失敗しました');
      }
    } catch {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleRsvp = async (status: 'yes' | 'no' | 'maybe', comment: string) => {
    setRsvpLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, comment }),
      });

      if (response.ok) {
        await fetchEvent();
      } else {
        const responseData = await response.json();
        setError(responseData.error || 'RSVPの更新に失敗しました');
      }
    } catch {
      setError('ネットワークエラーが発生しました');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('このイベントを削除しますか？')) {
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/events');
      } else {
        const responseData = await response.json();
        setError(responseData.error || 'イベントの削除に失敗しました');
      }
    } catch {
      setError('ネットワークエラーが発生しました');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getCurrentComment = () => {
    if (!data) return '';
    const userRsvp = data.attendees.find((a) => a.user_id === data.user_id);
    return userRsvp?.comment || '';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.nav}>
          <BackButton path="/events" title="イベント一覧に戻る" />
          <LogoutButton />
        </div>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.nav}>
          <BackButton path="/events" title="イベント一覧に戻る" />
          <LogoutButton />
        </div>
        <div className={styles.notFound}>イベントが見つかりません</div>
      </div>
    );
  }

  const { event, attendees, user_rsvp, is_creator } = data;

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <BackButton path="/events" title="イベント一覧に戻る" />
        <LogoutButton />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>{event.title}</h1>
        {is_creator && (
          <div className={styles.headerButtons}>
            <Link href={`/events/${eventId}/edit`} className={styles.editButton}>
              編集
            </Link>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? '削除中...' : '削除'}
            </button>
          </div>
        )}
      </div>

      <div className={styles.eventInfo}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>日時:</span>
          <span>{formatDate(event.event_date, true)} {formatTime(event.event_time)}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>場所:</span>
          <span>{event.location}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>作成者:</span>
          <span>{event.creator_username}</span>
        </div>
        {event.description && (
          <div className={styles.description}>{event.description}</div>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>出欠回答</h2>
        <RSVPButtons
          currentStatus={user_rsvp}
          currentComment={getCurrentComment()}
          onRsvp={handleRsvp}
          loading={rsvpLoading}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>参加者一覧</h2>
        <AttendeeList attendees={attendees} />
      </div>
    </div>
  );
}
