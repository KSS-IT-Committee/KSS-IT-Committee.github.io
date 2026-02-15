/**
 * @fileoverview Tutorial index page (protected).
 * @module app/tutorial/page
 *
 * A protected page that lists all available tutorials for committee members.
 * Requires authentication via AuthGuard.
 *
 * Available Tutorials:
 * 1. WSL Installation - Setting up Windows Subsystem for Linux
 * 2. Git Concepts - Understanding version control and Git basics
 * 3. Git Commands - Practical Git command-line usage
 *
 * Uses DynamicLink component to handle incomplete tutorials gracefully.
 *
 * @requires Authentication - Users must be logged in to access this page
 */
import { AuthGuard } from "@/components/AuthGuard";
import { Linklist } from "@/components/Linklist";

import { TutorialPageClient } from "./TutorialPageClient";

import styles from "@/styles/tutorial.module.css";

/**
 * Tutorial index page component (Server Component).
 *
 * Wraps content in AuthGuard for session validation,
 * then renders the client component with tutorial links.
 *
 * @returns {Promise<JSX.Element>} The protected tutorial index page
 */
export default async function TutorialPage() {
  const Links = [
    { url: "/tutorial/install_wsl", title: "WSLをインストールする" },
    { url: "/tutorial/git", title: "Gitを使ってみる〜Gitの概念〜" },
    {
      url: "/tutorial/git-commands",
      title: "Gitコマンドを使ってみる〜Gitのコマンド〜",
    },
  ];

  return (
    <AuthGuard>
      <TutorialPageClient>
        <h2 className={styles.h2}>チュートリアル一覧</h2>
        <Linklist links={Links} />
      </TutorialPageClient>
    </AuthGuard>
  );
}
