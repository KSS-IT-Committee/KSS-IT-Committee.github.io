/**
 * EditEventClient Component
 *
 * Client-side form for editing existing events.
 */
"use client";

import { FormEvent,useEffect, useState } from "react";
import { useParams,useRouter } from "next/navigation";

import { ErrorMessage } from "@/components/ErrorMessage";
import { EventForm, EventFormData } from "@/components/EventForm";
import { PageNavBar } from "@/components/PageNavBar";
import { API_ENDPOINTS, ERROR_MESSAGES } from "@/lib/constants";
import {
  ApiErrorResponse,
  EventResponse,
  UpdateEventRequest,
} from "@/types/api";

import styles from "@/styles/events-content.module.css";

export function EditEventClient() {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    eventDate: "",
    eventTime: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.EVENT_BY_ID(eventId));
        const data: EventResponse = await response.json();

        if (response.ok) {
          const { event } = data;
          setFormData({
            title: event.title,
            description: event.description || "",
            eventDate: event.event_date.split("T")[0], // Convert ISO date to YYYY-MM-DD
            eventTime: event.event_time.slice(0, 5), // Extract HH:MM from time
            location: event.location,
          });
          setIsCreator(data.is_creator || false);

          if (!data.is_creator) {
            setError(ERROR_MESSAGES.NO_EDIT_PERMISSION);
          }
        } else {
          const errorData = data as unknown as ApiErrorResponse;
          setError(errorData.error || ERROR_MESSAGES.EVENT_FETCH_FAILED);
        }
      } catch (error) {
        console.error("Failed to fetch event for editing:", error);
        setError(ERROR_MESSAGES.NETWORK_ERROR);
      } finally {
        setIsFetching(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleFormDataChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const requestBody: UpdateEventRequest = {
        title: formData.title,
        description: formData.description || null,
        event_date: formData.eventDate,
        event_time: formData.eventTime,
        location: formData.location,
      };

      const response = await fetch(API_ENDPOINTS.EVENT_BY_ID(eventId), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        router.push(`/events/${eventId}`);
      } else {
        const data: ApiErrorResponse = await response.json();
        setError(data.error || ERROR_MESSAGES.EVENT_UPDATE_FAILED);
      }
    } catch (error) {
      console.error(`Failed to update event: ${error}`);
      setError(ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>{ERROR_MESSAGES.LOADING}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PageNavBar
        backPath={`/events/${eventId}`}
        backTitle="イベント詳細に戻る"
      />

      <h1 className={styles.title}>イベントを編集</h1>

      {isCreator && (
        <EventForm
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onSubmit={handleSubmit}
          loading={isLoading}
          error={error}
          submitButtonText="イベントを更新"
          loadingText="更新中..."
        />
      )}
      {!isCreator && <ErrorMessage message={error} />}
    </div>
  );
}
