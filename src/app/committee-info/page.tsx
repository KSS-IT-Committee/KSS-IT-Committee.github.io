/**
 * @fileoverview Committee information page (protected).
 * @module app/committee-info/page
 *
 * A protected page that displays committee member-exclusive content.
 * Requires authentication via AuthGuard.
 *
 * Content:
 * - Link to tutorial section
 * - Additional member-only resources
 *
 * @requires Authentication - Users must be logged in to access this page
 */
import styles from "@/styles/tutorial.module.css";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import CommitteeInfoPageClient from "./CommitteeInfoPageClient";

/**
 * Committee info page component (Server Component).
 *
 * Wraps content in AuthGuard for session validation,
 * then renders the client component with member-only links.
 *
 * @returns {Promise<JSX.Element>} The protected committee info page
 */
export default async function CommitteeInfoPage() {
  return (
    <AuthGuard>
      <CommitteeInfoPageClient>
        <h2 className={styles.h2}>委員会メンバー専用コンテンツ</h2>
        <ul className={styles.tutorialList}>
          <li>
            <Link href="/tutorial">チュートリアル</Link>
          </li>
          <li>
            <Link href="/events">イベント・出欠管理</Link>
          </li>
        </ul>
      </CommitteeInfoPageClient>
    </AuthGuard>
  );
}
