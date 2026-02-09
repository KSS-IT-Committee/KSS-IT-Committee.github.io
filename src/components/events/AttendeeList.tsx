/**
 * AttendeeList Component
 *
 * Displays event attendees grouped by their RSVP status.
 *
 * @param {RSVPWithUser[]} attendees - Array of RSVPs with usernames
 */
"use client";

import { RSVPWithUser } from "@/types/events";
import styles from "@/styles/AttendeeList.module.css";

interface AttendeeListProps {
  attendees: RSVPWithUser[];
}

export function AttendeeList({ attendees }: AttendeeListProps) {
  const yesAttendees = attendees.filter((a) => a.status === "yes");
  const noAttendees = attendees.filter((a) => a.status === "no");
  const maybeAttendees = attendees.filter((a) => a.status === "maybe");

  const renderAttendeeList = (list: RSVPWithUser[]) => {
    if (list.length === 0) {
      return <p className={styles.empty}>なし</p>;
    }

    return (
      <div className={styles.list}>
        {list.map((attendee) => (
          <div key={attendee.id} className={styles.attendee}>
            <span className={styles.username}>{attendee.username}</span>
            {attendee.comment && (
              <span className={styles.comment}>{attendee.comment}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h4 className={`${styles.sectionTitle} ${styles.yes}`}>
          参加 <span className={styles.count}>({yesAttendees.length})</span>
        </h4>
        {renderAttendeeList(yesAttendees)}
      </div>

      <div className={styles.section}>
        <h4 className={`${styles.sectionTitle} ${styles.maybe}`}>
          未定 <span className={styles.count}>({maybeAttendees.length})</span>
        </h4>
        {renderAttendeeList(maybeAttendees)}
      </div>

      <div className={styles.section}>
        <h4 className={`${styles.sectionTitle} ${styles.no}`}>
          不参加 <span className={styles.count}>({noAttendees.length})</span>
        </h4>
        {renderAttendeeList(noAttendees)}
      </div>
    </div>
  );
}
