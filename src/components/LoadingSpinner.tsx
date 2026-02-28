/**
 * LoadingSpinner Component
 *
 * A simple loading indicator displayed while pages are loading.
 */
import styles from "@/styles/LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({
  message = "読み込み中...",
}: LoadingSpinnerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <p className={styles.message}>{message}</p>
    </div>
  );
}
