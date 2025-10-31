import Image from "next/image";
import styles from "./page.module.css";
import MaintainerCard from "@/components/MaintainerCard";

const maintainers: { username: string; name: string }[] = [
  // { username: "0517MITSU", name: "0517MITSU" },
  // { username: "Aki603", name: "Aki603" },
  // { username: "Apple-1124", name: "Apple-1124" },
  // { username: "hatuna-827", name: "hatuna-827" },
  // { username: "K10-K10", name: "K10-K10" },
  // { username: "katsumata68", name: "katsumata68" },
  // { username: "kinoto0103", name: "kinoto0103" },
  // { username: "kotaro-0131", name: "kotaro-0131" },
  // { username: "mochi-k18", name: "mochi-k18" },
  // { username: "rotarymars", name: "rotarymars" },
  // { username: "SakaYq4875", name: "SakaYq4875" },
  // { username: "Shirym-min", name: "Shirym-min" },
  // { username: "utsukushiioto0816-tech", name: "utsukushiioto0816-tech" },
];

export default function Home() {
  return (
    <>
      <h1 className={styles.h1}>都立小石川中等教育学校 IT委員会</h1>
      <Image
        src="/images/IT-logo.png"
        width={200}
        height={200}
        alt="IT委員会のロゴ"
      />

      <section className={styles.maintainersSection}>
        <h2 className={styles.h2}>Maintainers</h2>
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
    </>
  );
}
