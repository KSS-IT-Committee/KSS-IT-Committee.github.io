/**
 * CommitteeInfoPageClient Component
 *
 * Client-side wrapper for the committee info page layout.
 *
 * Purpose:
 * - Provides consistent layout for committee info content
 * - Includes navigation (back to home) and logout functionality
 * - Renders child content passed from the server component
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - The page content to render
 *
 * @example
 * <CommitteeInfoPageClient>
 *   <h2>Member Content</h2>
 *   <ul>...</ul>
 * </CommitteeInfoPageClient>
 */
'use client';

import { ReactNode } from "react";
import styles from "@/styles/tutorial.module.css";
import BackButton from "@/components/BackButton";
import LogoutButton from "@/components/LogoutButton";

interface CommitteeInfoPageClientProps {
  children: ReactNode;
}

export default function CommitteeInfoPageClient({ children }: CommitteeInfoPageClientProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.h1}>委員会専用ページ</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        <BackButton path={"/"} title={"ホームに戻る"} />
        <LogoutButton />
      </div>

      {children}
    </div>
  );
}
