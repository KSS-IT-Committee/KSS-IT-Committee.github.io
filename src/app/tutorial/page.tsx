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
import styles from "@/styles/tutorial.module.css";
import DynamicLink from "@/components/DynamicLink";
import AuthGuard from "@/components/AuthGuard";
import TutorialPageClient from "./TutorialPageClient";

/**
 * Tutorial index page component (Server Component).
 *
 * Wraps content in AuthGuard for session validation,
 * then renders the client component with tutorial links.
 *
 * @returns {Promise<JSX.Element>} The protected tutorial index page
 */
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

