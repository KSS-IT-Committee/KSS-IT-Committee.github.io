/**
 * CreateEventClient Component
 *
 * Client-side form for creating new events.
 */
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';
import LogoutButton from '@/components/LogoutButton';
import styles from './create.module.css';

export default function CreateEventClient() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
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
        router.push('/events');
      } else {
        setError(data.error || 'イベントの作成に失敗しました');
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <BackButton path="/events" title="イベント一覧に戻る" />
        <LogoutButton />
      </div>

      <h1 className={styles.title}>イベントを作成</h1>

      {error && <div className={styles.error}>{error}</div>}

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
          {loading ? '作成中...' : 'イベントを作成'}
        </button>
      </form>
    </div>
  );
}
