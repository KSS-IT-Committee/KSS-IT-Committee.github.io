import styles from "@/styles/tutorial.module.css";
import DynamicLink from "@/components/DynamicLink";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IT Committee Home page! ~tutorial~",
  description: "Home page for IT Committee",
};

export default function TutorialPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.h1}>委員会チュートリアル</h1>
      </div>

      <h2 className={styles.h2}>現在の一覧</h2>
      <ol className={styles.tutorialList}>
        <li>
          <DynamicLink link="/tutorial/install_wsl">WSLをインストールする</DynamicLink>
        </li>
        <li>
          <DynamicLink link="/tutorial/git">Gitを使ってみる〜Gitの概念〜</DynamicLink>
        </li>
        <li>
          <DynamicLink link="/tutorial/git-commands.nolink">Gitコマンドを使ってみる〜Gitのコマンド〜</DynamicLink>
        </li>
      </ol>
    </div>
  );
}