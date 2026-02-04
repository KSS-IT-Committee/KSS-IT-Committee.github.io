/**
 * ErrorMessage Component
 *
 * Reusable error message display component with consistent styling.
 */
import styles from "@/styles/ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return <div className={styles.error}>{message}</div>;
}
