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
"use client";

import { ReactNode } from "react";

import { PageNavBar } from "@/components/PageNavBar";

import styles from "@/styles/tutorial.module.css";

interface CommitteeInfoPageClientProps {
  children: ReactNode;
}

export function CommitteeInfoPageClient({
  children,
}: CommitteeInfoPageClientProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.h1}>委員専用ページ</h1>
      </div>

      <PageNavBar backPath="/" backTitle="ホームに戻る" />

      {children}
    </div>
  );
}
