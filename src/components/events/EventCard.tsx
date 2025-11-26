/**
 * EventCard Component
 *
 * Displays an event summary in a clickable card format.
 *
 * @param {EventWithCounts} event - The event data with RSVP counts
 * @param {() => void} onClick - Click handler for navigation
 */
'use client';

import { EventWithCounts } from '@/types/events';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: EventWithCounts;
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    // time is in HH:MM:SS format
    return timeStr.slice(0, 5);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const getUserStatusClass = () => {
    if (!event.user_rsvp) return '';
    switch (event.user_rsvp) {
      case 'yes':
        return styles.userYes;
      case 'no':
        return styles.userNo;
      case 'maybe':
        return styles.userMaybe;
      default:
        return '';
    }
  };

  const getUserStatusText = () => {
    switch (event.user_rsvp) {
      case 'yes':
        return '参加';
      case 'no':
        return '不参加';
      case 'maybe':
        return '未定';
      default:
        return '';
    }
  };

  return (
    <div className={styles.card} onClick={onClick} onKeyDown={handleKeyDown} role="button" tabIndex={0}>
      <div className={styles.header}>
        <h3 className={styles.title}>{event.title}</h3>
        <span className={styles.dateTime}>
          {formatDate(event.event_date)} {formatTime(event.event_time)}
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
