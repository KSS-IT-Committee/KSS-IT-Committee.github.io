import { ReactNode } from "react";
import styles from "@/styles/tutorial-content.module.css";

interface TutorialLayoutProps {
  title: string;
  children: ReactNode;
}

export default function TutorialLayout({ title, children }: TutorialLayoutProps) {
  return (
    <div className={styles.container}>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </article>
    </div>
  );
}
