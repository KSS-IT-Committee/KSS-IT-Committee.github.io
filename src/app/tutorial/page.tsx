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
          <DynamicLink link="/tutorial/install_wsl">
            <li>WSLをインストールする</li>
          </DynamicLink>
          <DynamicLink link="/tutorial/git">
            <li>Gitを使ってみる〜Gitの概念〜</li>
          </DynamicLink>
          <DynamicLink link="/tutorial/git-commands">
            <li>Gitコマンドを使ってみる〜Gitのコマンド〜</li>
          </DynamicLink>
        </ol>
      </TutorialPageClient>
    </AuthGuard>
  );
}

