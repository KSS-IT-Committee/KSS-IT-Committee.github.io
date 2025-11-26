import styles from "@/styles/tutorial.module.css";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import CommitteeInfoPageClient from "./CommitteeInfoPageClient";

export default async function CommitteeInfoPage() {
  return (
    <AuthGuard>
      <CommitteeInfoPageClient>
        <h2 className={styles.h2}>委員会メンバー専用コンテンツ</h2>
        <ul className={styles.tutorialList}>
          <li>
            <Link href="/tutorial">チュートリアル</Link>
          </li>
        </ul>
      </CommitteeInfoPageClient>
    </AuthGuard>
  );
}
