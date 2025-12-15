/**
 * @fileoverview Home page for the KSS IT Committee website.
 * @module app/page
 *
 * The main landing page displaying:
 * - Committee hero section with logo and description
 * - Activities section (web development, system development, programming study)
 * - Team members section with GitHub profile cards
 * - Link to GitHub organization
 *
 * This is a public page - no authentication required.
 */
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/base.module.css";
import MaintainerCard from "@/components/MaintainerCard";
import Plaintext from "@/components/Plaintext";

/** List of team members with public GitHub profiles */
const maintainers: { username: string; name: string }[] = [
  { username: "0517MITSU", name: "0517MITSU" },
  // { username: "Aki603", name: "Aki603" },
  // { username: "Apple-1124", name: "Apple-1124" },
  // { username: "hatuna-827", name: "hatuna-827" },
  { username: "K10-K10", name: "K10-K10" },
  // { username: "katsumata68", name: "katsumata68" },
  { username: "kinoto0103", name: "kinoto0103" },
  { username: "kotaro-0131", name: "kotaro-0131" },
  { username: "mochi-k18", name: "mochi-k18" },
  { username: "rotarymars", name: "rotarymars" },
  { username: "SakaYq4875", name: "SakaYq4875" },
  { username: "Shirym-min", name: "Shirym-min" },
  // { username: "utsukushiioto0816-tech", name: "utsukushiioto0816-tech" },
];

/** Committee activities displayed on the home page */
const activities: { title: string; description: string }[] = [
  {
    title: "ウェブ開発",
    description: "学校行事の ホームページの 作成・運営を 行っています。"
  },
  {
    title: "システム開発",
    description: "投票・混雑状況の 管理システムの 開発を 行っています。"
  },
  {
    title: "プログラミングの勉強",
    description: "委員のための プログラミングの 勉強を 行っています。"
  }
];

/**
 * Home page component.
 *
 * Renders the main landing page with committee information,
 * activities, team members, and external links.
 *
 * @returns {JSX.Element} The home page
 */
export default function Home() {
  const totalMaintainers = 13;
  const anonymousMaintainersCount = totalMaintainers - maintainers.length;

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.h1}><Plaintext>都立小石川中等教育学校  IT委員会</Plaintext></h1>
        <div className={styles.logoWrapper}>
          <Image
            src="/images/IT-logo.png"
            width={200}
            height={200}
            alt="IT委員会のロゴ"
            className={styles.logo}
            priority
          />
        </div>
        <p className={styles.description}>
          <Plaintext>主に学校行事における ホームページの作成を 手掛けています。</Plaintext>
        </p>
        <div style={{ marginTop: '2rem' }}>
          <Link href="/committee-info" className={styles.linkButton}>
            委員用情報を閲覧
          </Link>
        </div>
      </div>

      <div className={styles.divider} />

      <section>
        <h2 className={styles.h2}>活動内容</h2>
        <div className={styles.activitiesGrid}>
          {activities.map((activity, index) => (
            <div key={index} className={styles.activityCard}>
              <h3 className={styles.activityTitle}>{activity.title}</h3>
              <p className={styles.activityDescription}><Plaintext>{activity.description}</Plaintext></p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.maintainersSection}>
        <h2 className={styles.h2}>チームメンバー</h2>
        <h3 className={styles.h3}>
          計{totalMaintainers}名
          {anonymousMaintainersCount > 0 && ` (${anonymousMaintainersCount}名は匿名希望)`}
        </h3>
        <div className={styles.maintainersGrid}>
          {maintainers.map((maintainer) => (
            <MaintainerCard
              key={maintainer.username}
              username={maintainer.username}
              name={maintainer.name}
            />
          ))}
        </div>
      </section>

      <div className={styles.linksSection}>
        <a
          href="https://github.com/KSS-IT-Committee"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkButton}
        >
          <Image src="/images/github-mark.svg" width={24} height={24} alt="GitHub" />
          GitHub
        </a>
      </div>
    </div>
  );
}
