/**
 * TutorialPageClient Component
 *
 * Client-side wrapper for the tutorial index page with session validation.
 *
 * Purpose:
 * - Provides consistent layout for tutorial listing
 * - Includes navigation (back to committee info) and logout functionality
 * - Handles browser back/forward cache (bfcache) session validation
 * - Redirects to login if session becomes invalid
 *
 * Session Validation:
 * - Checks session on visibility change (tab switching)
 * - Checks session on pageshow event (bfcache restoration)
 * - Prevents access to cached pages after logout
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - The page content to render
 *
 * @example
 * <TutorialPageClient>
 *   <h2>Tutorial List</h2>
 *   <ol>...</ol>
 * </TutorialPageClient>
 */
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageNavBar } from "@/components/PageNavBar";

import styles from "@/styles/tutorial.module.css";

interface TutorialPageClientProps {
  children: ReactNode;
}

export default function TutorialPageClient({
  children,
}: TutorialPageClientProps) {
  const router = useRouter();

  // Check session validity when page becomes visible (handles back button)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/check", { method: "GET" });
        if (!response.ok) {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      }
    };

    // Check on visibility change (back/forward navigation)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };

    // Check on pageshow (handles bfcache)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        checkSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.h1}>チュートリアル</h1>
      </div>

      <PageNavBar backPath="/committee-info" backTitle="委員専用ページに戻る" />

      {children}
    </div>
  );
}
