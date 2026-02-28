/**
 * EventDetailClient Component
 *
 * Client-side component for the event detail page.
 * Shows event info, RSVP buttons, and attendee list.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { BackButton } from "@/components/BackButton";
import { AttendeeList } from "@/components/events/AttendeeList";
import { RSVPButtons } from "@/components/events/RSVPButtons";
import { LogoutButton } from "@/components/LogoutButton";
import { EventWithCreator, RSVPWithUser } from "@/types/events";

import styles from "./detail.module.css";

interface EventData {
  event: EventWithCreator;
  attendees: RSVPWithUser[];
  counts: { yes: number; no: number; maybe: number };
  userRsvp: "yes" | "no" | "maybe" | null;
  user_id: number;
  isCreator: boolean;
}

export function EventDetailClient() {
  const [data, setData] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isrsvpLoading, setIsrsvpLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
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
        setError(responseData.error || "イベントの取得に失敗しました");
      }
    } catch (error) {
      console.error("Failed to fetch event:", error);
      setError("ネットワークエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleRsvp = async (
    status: "yes" | "no" | "maybe",
    comment: string,
  ) => {
    setIsrsvpLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, comment }),
      });

      if (response.ok) {
        await fetchEvent();
      } else {
        const responseData = await response.json();
        setError(responseData.error || "RSVPの更新に失敗しました");
      }
    } catch (error) {
      console.error("Failed to update RSVP:", error);
      setError("ネットワークエラーが発生しました");
    } finally {
      setIsrsvpLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("このイベントを削除しますか？")) {
      return;
    }

    setIsDeleteLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/events");
      } else {
        const responseData = await response.json();
        setError(responseData.error || "イベントの削除に失敗しました");
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      setError("ネットワークエラーが発生しました");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5);
  };

  const getCurrentComment = () => {
    if (!data) return "";
    const userRsvp = data.attendees.find((a) => a.user_id === data.user_id);
    return userRsvp?.comment || "";
  };

  if (isLoading) {
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

  const { event, attendees, userRsvp, isCreator } = data;

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <BackButton path="/events" title="イベント一覧に戻る" />
        <LogoutButton />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>{event.title}</h1>
        {isCreator && (
          <div className={styles.headerButtons}>
            <Link
              href={`/events/${eventId}/edit`}
              className={styles.editButton}
            >
              編集
            </Link>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDelete}
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? "削除中..." : "削除"}
            </button>
          </div>
        )}
      </div>

      <div className={styles.eventInfo}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>日時:</span>
          <span>
            {formatDate(event.event_date)} {formatTime(event.event_time)}
          </span>
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
          currentStatus={userRsvp}
          currentComment={getCurrentComment()}
          onRsvp={handleRsvp}
          loading={isrsvpLoading}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>参加者一覧</h2>
        <AttendeeList attendees={attendees} />
      </div>
    </div>
  );
}
