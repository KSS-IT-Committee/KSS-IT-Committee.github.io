/**
 * EventForm Component
 *
 * Reusable form component for creating and editing events.
 */
'use client';

import { FormEvent } from 'react';
import styles from './EventForm.module.css';

export interface EventFormData {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
}

interface EventFormProps {
  formData: EventFormData;
  onFormDataChange: (field: keyof EventFormData, value: string) => void;
  onSubmit: (e: FormEvent) => void;
  loading: boolean;
  error: string;
  submitButtonText: string;
  loadingText: string;
}

export default function EventForm({
  formData,
  onFormDataChange,
  onSubmit,
  loading,
  error,
  submitButtonText,
  loadingText,
}: EventFormProps) {
  return (
    <>
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            タイトル<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => onFormDataChange('title', e.target.value)}
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
            value={formData.description}
            onChange={(e) => onFormDataChange('description', e.target.value)}
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
              value={formData.eventDate}
              onChange={(e) => onFormDataChange('eventDate', e.target.value)}
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
              value={formData.eventTime}
              onChange={(e) => onFormDataChange('eventTime', e.target.value)}
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
            value={formData.location}
            onChange={(e) => onFormDataChange('location', e.target.value)}
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
          {loading ? loadingText : submitButtonText}
        </button>
      </form>
    </>
  );
}
