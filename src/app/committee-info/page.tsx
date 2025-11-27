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
import AuthGuard from "@/components/AuthGuard";
import CommitteeInfoPageClient from "./CommitteeInfoPageClient";
import Linklist from "@/components/Linklist";

/**
 * Committee info page component (Server Component).
 *
 * Wraps content in AuthGuard for session validation,
 * then renders the client component with member-only links.
 *
 * @returns {Promise<JSX.Element>} The protected committee info page
 */
export default async function CommitteeInfoPage() {
  const Links = [
    { url: "/tutorial", title: "チュートリアル" },
    { url: "/events", title: "イベント・出欠管理" }
  ]

  return (
    <AuthGuard>
      <CommitteeInfoPageClient>
        <h2 className={styles.h2}>委員会メンバー専用コンテンツ</h2>
        <Linklist links={Links} />
      </CommitteeInfoPageClient>
    </AuthGuard>
  );
}
