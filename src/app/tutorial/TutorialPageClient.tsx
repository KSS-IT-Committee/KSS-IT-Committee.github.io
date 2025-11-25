'use client';

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/tutorial.module.css";
import BackButton from "@/components/BackButton";
import LogoutButton from "@/components/LogoutButton";

interface TutorialPageClientProps {
  children: ReactNode;
}

export default function TutorialPageClient({ children }: TutorialPageClientProps) {
  const router = useRouter();

  // Check session validity when page becomes visible (handles back button)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/check', { method: 'GET' });
        if (!response.ok) {
          router.replace('/login');
        }
      } catch {
        router.replace('/login');
      }
    };

    // Check on visibility change (back/forward navigation)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };

    // Check on pageshow (handles bfcache)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        checkSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [router]);

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
