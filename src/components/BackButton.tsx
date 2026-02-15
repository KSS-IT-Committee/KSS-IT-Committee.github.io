/**
 * BackButton Component
 *
 * A navigation button that links to a previous or parent page.
 *
 * Purpose:
 * - Provides consistent back/navigation functionality across the app
 * - Uses Next.js Link for client-side navigation
 * - Displays a left arrow (←) followed by custom title text
 *
 * @param {Object} props - Component props
 * @param {string} props.path - The URL path to navigate to
 * @param {string} props.title - The button text (displayed after the arrow)
 *
 * @example
 * <BackButton path="/tutorial" title="一覧に戻る" />
 */
"use client";
import Link from "next/link";

import styles from "@/styles/BackButton.module.css";

interface BackButtonProps {
  path: string;
  title: string;
}

export function BackButton({ path, title }: BackButtonProps) {
  return (
    <Link href={path} className={styles.backButton}>
      ← {title}
    </Link>
  );
}
