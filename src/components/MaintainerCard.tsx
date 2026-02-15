/**
 * MaintainerCard Component
 *
 * A card component that displays information about a project maintainer with their GitHub profile.
 *
 * Purpose:
 * - Displays a maintainer's GitHub avatar and name in a styled card format
 * - Links directly to the maintainer's GitHub profile
 * - Provides a consistent visual representation for team member profiles
 *
 * Props:
 * @param {string} username - The GitHub username (used to fetch avatar and build profile link)
 * @param {string} name - The display name of the maintainer
 *
 * Features:
 * - Automatically fetches GitHub avatar using the pattern: `https://github.com/{username}.png`
 * - Opens GitHub profile in a new tab when clicked
 * - Uses `rel="noopener noreferrer"` for security best practices
 * - Optimized image loading with Next.js Image component (80x80px)
 *
 * Structure:
 * div.card
 *   └── a.link (GitHub profile link)
 *       ├── Image (GitHub avatar)
 *       └── p.name (Display name)
 *
 * Styling:
 * Uses CSS modules from `@/styles/MaintainerCard.module.css` with classes:
 * - card: Card container
 * - link: Anchor element styling
 * - avatar: Avatar image styling
 * - name: Name text styling
 *
 * Use Cases:
 * - Displaying project maintainers on an "About" or "Team" page
 * - Showing contributors in a grid or list layout
 * - Providing quick access to maintainer GitHub profiles
 *
 * Example Usage:
 * ```tsx
 * <MaintainerCard username="octocat" name="The Octocat" />
 * <MaintainerCard username="torvalds" name="Linus Torvalds" />
 * ```
 *
 * Technical Notes:
 * - Next.js Image: Automatic image optimization and lazy loading
 * - External Links: Opens in new tab with security attributes (noopener, noreferrer)
 * - GitHub API: Uses GitHub's CDN for profile images (reliable and fast)
 * - Accessibility: Includes proper alt text for screen readers
 * - Requires configuration: Requires remotePatterns configuration in next.config.ts
 */
import { memo } from "react";
import Image from "next/image";

import styles from "@/styles/MaintainerCard.module.css";

interface MaintainerCardProps {
  username: string;
  name: string;
}

function MaintainerCardBase({ username, name }: MaintainerCardProps) {
  return (
    <div className={styles.card}>
      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        <Image
          src={`https://github.com/${username}.png`}
          width={460}
          height={460}
          alt={`${name}'s profile`}
          className={styles.avatar}
        />
        <p className={styles.name}>{name}</p>
      </a>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export const MaintainerCard = memo(MaintainerCardBase);
