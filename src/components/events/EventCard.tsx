/**
 * EventCard Component
 *
 * Displays an event summary in a clickable card format.
 * Optimized with React.memo and useMemo for better performance.
 *
 * @param {EventWithCounts} event - The event data with RSVP counts
 * @param {() => void} onClick - Click handler for navigation
 */
"use client";

import { memo, useMemo } from "react";

import { EventWithCounts } from "@/types/events";

import styles from "@/styles/EventCard.module.css";

interface EventCardProps {
  event: EventWithCounts;
  onClick: () => void;
}

function EventCardBase({ event, onClick }: EventCardProps) {
  // Memoize formatted date and time to avoid recalculating on every render
  const formattedDate = useMemo(() => {
    const date = new Date(event.event_date);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [event.event_date]);

  const formattedTime = useMemo(() => {
    // time is in HH:MM:SS format
    return event.event_time.slice(0, 5);
  }, [event.event_time]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  const getUserStatusClass = () => {
    if (!event.user_rsvp) return "";
    switch (event.user_rsvp) {
      case "yes":
        return styles.userYes;
      case "no":
        return styles.userNo;
      case "maybe":
        return styles.userMaybe;
      default:
        return "";
    }
  };

  const getUserStatusText = () => {
    switch (event.user_rsvp) {
      case "yes":
        return "参加";
      case "no":
        return "不参加";
      case "maybe":
        return "未定";
      default:
        return "";
    }
  };

  return (
    <div
      className={styles.card}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{event.title}</h3>
        <span className={styles.dateTime}>
          {formattedDate} {formattedTime}
        </span>
      </div>

      <div className={styles.meta}>
        <div className={styles.location}>📍 {event.location}</div>
        <div className={styles.creator}>作成者: {event.creator_username}</div>
      </div>

      <div className={styles.counts}>
        <span className={`${styles.countItem} ${styles.yes}`}>
          ✓ {event.yes_count}
        </span>
        <span className={`${styles.countItem} ${styles.no}`}>
          ✗ {event.no_count}
        </span>
        <span className={`${styles.countItem} ${styles.maybe}`}>
          ? {event.maybe_count}
        </span>
        {event.user_rsvp && (
          <span className={`${styles.userStatus} ${getUserStatusClass()}`}>
            {getUserStatusText()}
          </span>
        )}
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export const EventCard = memo(EventCardBase);
