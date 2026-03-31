import Image from "next/image";

import { BackButton } from "@/components/BackButton";

import styles from "./karencaya.module.css";

/**
 * Renders a static personal/demo profile page for the user "karencaya".
 *
 * @returns The JSX element representing the profile page content.
 */
export default function KarencayaDemoPage() {
  return (
    <div className={styles.container}>
      <div className={styles.stars}></div>
      <div className={styles.content}>
        <BackButton path="/demo" title="デモサイト一覧へ戻る" />

        <header className={styles.header}>
          <div className={styles.iconWrapper}>
            <Image
              src="https://github.com/karencaya.png"
              alt="karencayaのアイコン"
              width={150}
              height={150}
              className={styles.icon}
            />
          </div>
          <h1 className={styles.title}>karencaya</h1>
          <p className={styles.subtitle}>Hello, I&apos;m karencaya!</p>
        </header>

        <main className={styles.main}>
          <section className={styles.section}>
            <h2>自己紹介</h2>
            <div className={styles.info}>
              <p>
                <strong>部活:</strong> IT委員会
              </p>
              <p>
                <strong>趣味:</strong> プログラミング、読書
              </p>
              <p>
                <strong>好きなもの:</strong> テクノロジー、音楽
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>プログラミング</h2>
            <div className={styles.skills}>
              <p>主にJavaScriptとTypeScriptを使っています。</p>
              <p>Next.jsやReactでウェブアプリケーションを開発しています。</p>
              <p>新しい技術を学ぶのが好きです。</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
