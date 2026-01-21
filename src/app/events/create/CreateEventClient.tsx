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
import EventForm, { EventFormData } from '@/components/EventForm';
import { API_ENDPOINTS, ERROR_MESSAGES } from '@/lib/constants';
import { CreateEventRequest, ApiErrorResponse } from '@/types/api';
import styles from './create.module.css';

export default function CreateEventClient() {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormDataChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const requestBody: CreateEventRequest = {
        title: formData.title,
        description: formData.description || null,
        event_date: formData.eventDate,
        event_time: formData.eventTime,
        location: formData.location,
      };

      const response = await fetch(API_ENDPOINTS.EVENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiErrorResponse = await response.json();

      if (response.ok) {
        router.push('/events');
      } else {
        setError(data.error || ERROR_MESSAGES.EVENT_CREATE_FAILED);
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      setError(ERROR_MESSAGES.NETWORK_ERROR);
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

      <EventForm
        formData={formData}
        onFormDataChange={handleFormDataChange}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        submitButtonText="イベントを作成"
        loadingText="作成中..."
      />
    </div>
  );
}
