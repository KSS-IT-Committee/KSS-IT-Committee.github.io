import styles from "@/styles/tutorial.module.css";
import DynamicLink from "@/components/DynamicLink";
import AuthGuard from "@/components/AuthGuard";
import TutorialPageClient from "./TutorialPageClient";

export default async function TutorialPage() {
  return (
    <AuthGuard>
      <TutorialPageClient>
        <h2 className={styles.h2}>現在の一覧</h2>
        <ol className={styles.tutorialList}>
          <li>
            <DynamicLink link="/tutorial/install_wsl">WSLをインストールする</DynamicLink>
          </li>
          <li>
            <DynamicLink link="/tutorial/git">Gitを使ってみる〜Gitの概念〜</DynamicLink>
          </li>
          <li>
            <DynamicLink link="/tutorial/git-commands">Gitコマンドを使ってみる〜Gitのコマンド〜</DynamicLink>
          </li>
        </ol>
      </TutorialPageClient>
    </AuthGuard>
  );
}

