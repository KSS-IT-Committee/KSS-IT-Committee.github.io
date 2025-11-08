/**
 * TutorialLayout Component
 *
 * A reusable layout component that provides consistent styling and structure for tutorial pages.
 *
 * Purpose:
 * - Establishes a standardized layout pattern for all tutorial content
 * - Ensures visual consistency across the tutorial section of the site
 * - Handles the page title header and content container with pre-defined styling
 *
 * Props:
 * @param {string} title - The tutorial page title (displayed in h1)
 * @param {ReactNode} children - The main tutorial content
 *
 * Structure:
 * Creates a nested hierarchy:
 * div.container
 *   └── article.article
 *       ├── header.header
 *       │   └── h1.title (displays the title prop)
 *       └── div.content (renders children)
 *
 * Styling:
 * Uses CSS modules from `@/styles/tutorial-content.module.css` with classes:
 * - container: Outer wrapper
 * - article: Main article container
 * - header: Header section
 * - title: Title heading
 * - content: Content wrapper for tutorial body
 *
 * Use Cases:
 * - Wrapping tutorial page content to maintain consistent styling
 * - Providing semantic HTML structure (article, header elements)
 * - Centralizing tutorial page layout logic for easy maintenance
 *
 * Example Usage:
 * ```tsx
 * <TutorialLayout title="Install WSL">
 *   <p>This tutorial will guide you through installing WSL...</p>
 *   <h2>Prerequisites</h2>
 *   <ul>
 *     <li>Windows 10 or later</li>
 *   </ul>
 * </TutorialLayout>
 * ```
 *
 * Technical Notes:
 * - Flexibility: Children prop allows any content structure
 *
 * Component Relationship:
 * Works together with DynamicLink component - DynamicLink can be used within tutorial
 * content to create navigation between tutorials with built-in support for incomplete pages.
 */
"use client";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/tutorial-content.module.css";

interface TutorialLayoutProps {
  title: string;
  children: ReactNode;
}

export default function TutorialLayout({ title, children }: TutorialLayoutProps) {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <article className={styles.article}>
        <header className={styles.header}>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.backButton}
            aria-label="Go back to previous page"
          >
            ← Back
          </button>
          <h1 className={styles.title}>{title}</h1>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </article>
    </div>
  );
}
