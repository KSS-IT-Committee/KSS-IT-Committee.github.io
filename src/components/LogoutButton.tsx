/**
 * LogoutButton Component
 *
 * A client-side button that handles user logout functionality.
 *
 * Purpose:
 * - Provides a logout action for authenticated users
 * - Calls the logout API endpoint and clears the session
 * - Redirects to login page after successful logout
 *
 * Features:
 * - Loading state during logout process
 * - Hard refresh to clear cached protected pages
 * - Japanese text labels ("ログアウト" / "ログアウト中...")
 *
 * @example
 * <LogoutButton />
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/LogoutButton.module.css";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // Use replace to prevent back navigation to cached pages
        router.replace("/login");
        // Force a hard refresh to clear any cached state
        window.location.href = "/login";
      }
    } catch (error) {
      console.error(`Logout error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={styles.logoutButton}
      disabled={loading}
    >
      {loading ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}
