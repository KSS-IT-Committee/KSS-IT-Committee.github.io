import Image from "next/image";
import styles from "./page.module.css";
import MaintainerCard from "@/components/MaintainerCard";

const maintainers: { username: string; name: string }[] = [
  { username: "0517MITSU", name: "0517MITSU" },
  // { username: "Aki603", name: "Aki603" },
  // { username: "Apple-1124", name: "Apple-1124" },
  // { username: "hatuna-827", name: "hatuna-827" },
  // { username: "K10-K10", name: "K10-K10" },
  // { username: "katsumata68", name: "katsumata68" },
  { username: "kinoto0103", name: "kinoto0103" },
  { username: "kotaro-0131", name: "kotaro-0131" },
  { username: "mochi-k18", name: "mochi-k18" },
  { username: "rotarymars", name: "rotarymars" },
  { username: "SakaYq4875", name: "SakaYq4875" },
  { username: "Shirym-min", name: "Shirym-min" },
  { username: "utsukushiioto0816-tech", name: "utsukushiioto0816-tech" },
];

const activities: { title: string; description: string }[] = [
  {
    title: "ウェブ開発",
    description: "学校行事のホームページの作成・運営を行っています。"
  },
  {
    title: "システム開発",
    description: "投票・混雑状況の管理システムの開発を行っています。"
  },
  {
    title: "プログラミングの勉強",
    description: "委員のためのプログラミングの勉強を行っています。"
  }
];

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.h1}>都立小石川中等教育学校 IT委員会</h1>
        <div className={styles.logoWrapper}>
          <Image
            src="/images/IT-logo.png"
            width={180}
            height={180}
            alt="IT委員会のロゴ"
            className={styles.logo}
            priority
          />
        </div>
        <p className={styles.description}>
          主に学校行事におけるホームページの作成を手掛ける、IT委員会です。
        </p>
      </div>

      <div className={styles.divider} />

      <section>
        <h2 className={styles.h2}>活動内容</h2>
        <div className={styles.activitiesGrid}>
          {activities.map((activity, index) => (
            <div key={index} className={styles.activityCard}>
              <h3 className={styles.activityTitle}>{activity.title}</h3>
              <p className={styles.activityDescription}>{activity.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.maintainersSection}>
        <h2 className={styles.h2}>チームメンバー</h2>
        <h3 className={styles.h3}>計{maintainers.length}名</h3>
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