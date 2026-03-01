/**
 * PageNavBar Component
 *
 * Reusable navigation bar for pages with back button and logout functionality.
 */
"use client";

import { BackButton } from "@/components/BackButton";
import { LogoutButton } from "@/components/LogoutButton";

import styles from "@/styles/PageNavBar.module.css";

interface PageNavBarProps {
  backPath: string;
  backTitle: string;
}

export function PageNavBar({ backPath, backTitle }: PageNavBarProps) {
  return (
    <div className={styles.navBar}>
      <BackButton path={backPath} title={backTitle} />
      <LogoutButton />
    </div>
  );
}
