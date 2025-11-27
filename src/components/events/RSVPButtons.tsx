/**
 * RSVPButtons Component
 *
 * Displays Yes/No/Maybe buttons with optional comment input for event RSVPs.
 *
 * @param {string | null} currentStatus - The user's current RSVP status
 * @param {string} currentComment - The user's current comment
 * @param {(status: string, comment: string) => Promise<void>} onRsvp - RSVP handler
 * @param {boolean} loading - Whether an RSVP is in progress
 */
'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/RSVPButtons.module.css';

interface RSVPButtonsProps {
  currentStatus: 'yes' | 'no' | 'maybe' | null;
  currentComment: string;
  onRsvp: (status: 'yes' | 'no' | 'maybe', comment: string) => Promise<void>;
  loading: boolean;
}

export default function RSVPButtons({
  currentStatus,
  currentComment,
  onRsvp,
  loading,
}: RSVPButtonsProps) {
  const [comment, setComment] = useState(currentComment);
  const [selectedStatus, setSelectedStatus] = useState<'yes' | 'no' | 'maybe' | null>(currentStatus);

  // Sync state with props when they change
  useEffect(() => {
    setComment(currentComment);
  }, [currentComment]);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const handleButtonClick = async (status: 'yes' | 'no' | 'maybe') => {
    setSelectedStatus(status);
    await onRsvp(status, comment);
  };

  const handleCommentSubmit = async () => {
    if (selectedStatus) {
      await onRsvp(selectedStatus, comment);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <button
          type="button"
          className={`${styles.button} ${styles.yes} ${selectedStatus === 'yes' ? styles.selected : ''}`}
          onClick={() => handleButtonClick('yes')}
          disabled={loading}
        >
          参加
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.no} ${selectedStatus === 'no' ? styles.selected : ''}`}
          onClick={() => handleButtonClick('no')}
          disabled={loading}
        >
          不参加
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.maybe} ${selectedStatus === 'maybe' ? styles.selected : ''}`}
          onClick={() => handleButtonClick('maybe')}
          disabled={loading}
        >
          未定
        </button>
      </div>

      <div className={styles.commentSection}>
        <textarea
          className={styles.commentInput}
          placeholder="コメント（任意）"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
        />
        {selectedStatus && comment !== currentComment && (
          <button
            type="button"
            className={styles.submitComment}
            onClick={handleCommentSubmit}
            disabled={loading}
          >
            コメントを更新
          </button>
        )}
      </div>
    </div>
  );
}
