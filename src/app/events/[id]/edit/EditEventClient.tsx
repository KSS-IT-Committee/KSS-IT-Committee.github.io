/**
 * EditEventClient Component
 *
 * Client-side form for editing existing events.
 */
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BackButton from '@/components/BackButton';
import LogoutButton from '@/components/LogoutButton';
import styles from '../../create/create.module.css';

interface EventData {
  id: number;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  location: string;
}

export default function EditEventClient() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();

        if (response.ok) {
          const event: EventData = data.event;
          setTitle(event.title);
          setDescription(event.description || '');
          // Convert ISO date to YYYY-MM-DD format for date input
          setEventDate(event.event_date.split('T')[0]);
          setEventTime(event.event_time.slice(0, 5));
          setLocation(event.location);
          setIsCreator(data.is_creator);

          if (!data.is_creator) {
            setError('このイベントを編集する権限がありません');
          }
        } else {
          setError(data.error || 'イベントの取得に失敗しました');
        }
      } catch {
        setError('ネットワークエラーが発生しました');
      } finally {
        setFetching(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: description || null,
          event_date: eventDate,
          event_time: eventTime,
          location,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/events/${eventId}`);
      } else {
        setError(data.error || 'イベントの更新に失敗しました');
      }
    } catch {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          読み込み中...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <BackButton path={`/events/${eventId}`} title="イベント詳細に戻る" />
        <LogoutButton />
      </div>

      <h1 className={styles.title}>イベントを編集</h1>

      {error && <div className={styles.error}>{error}</div>}

      {isCreator && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              タイトル<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              説明
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              disabled={loading}
              placeholder="イベントの詳細（任意）"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="eventDate" className={styles.label}>
                日付<span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="eventDate"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={styles.input}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="eventTime" className={styles.label}>
                時間<span className={styles.required}>*</span>
              </label>
              <input
                type="time"
                id="eventTime"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className={styles.input}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location" className={styles.label}>
              場所<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={styles.input}
              required
              disabled={loading}
              placeholder="例: 情報室"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? '更新中...' : 'イベントを更新'}
          </button>
        </form>
      )}
    </div>
  );
}
