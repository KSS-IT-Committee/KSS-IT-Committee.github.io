'use client';

import { ReactNode } from "react";
import styles from "@/styles/tutorial.module.css";
import BackButton from "@/components/BackButton";
import LogoutButton from "@/components/LogoutButton";

interface TutorialPageClientProps {
  children: ReactNode;
}

export default function TutorialPageClient({ children }: TutorialPageClientProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.h1}>委員会チュートリアル</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        <BackButton path={"/"} title={"ホームに戻る"} />
        <LogoutButton />
      </div>

      {children}
    </div>
  );
}
