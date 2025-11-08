/**
 * DynamicLink Component
 *
 * A wrapper component around Next.js's Link component that provides conditional rendering
 * based on link readiness.
 *
 * Purpose:
 * - Enables developers to mark links as "not ready" by appending `.nolink` to the href
 * - When a link is marked with `.nolink`, it renders as plain text instead of a clickable link
 * - Allows for graceful degradation of navigation when target pages aren't yet implemented
 *
 * Props:
 * @param {string} link - The target URL or path (append `.nolink` to disable the link)
 * @param {ReactNode} children - The link text/content to display
 *
 * Behavior:
 * - Uses regex `/.*\.nolink/` to test if the link ends with `.nolink`
 * - If link ends with `.nolink`: Renders children wrapped in a <span> (non-clickable)
 * - Otherwise: Renders children wrapped in Next.js <Link> (clickable, client-side navigation)
 *
 * Use Cases:
 * - Prototyping navigation structure before all pages are implemented
 * - Temporarily disabling links without removing them from the UI
 * - Progressive development where UI is built before all routes are complete
 *
 * Example Usage:
 * ```tsx
 * // Active link (will be clickable)
 * <DynamicLink link="/tutorial/install_wsl">Install WSL</DynamicLink>
 *
 * // Inactive link (will be plain text)
 * <DynamicLink link="/tutorial/coming-soon.nolink">Coming Soon</DynamicLink>
 * ```
 *
 * Technical Notes:
 * - Accessibility: Degrades gracefully to span when link is inactive
 */
import Link from "next/link";
import { ReactNode } from "react";

export default function DynamicLink({ link, children }: { link: string; children: ReactNode }) {
  const match_re = new RegExp(".*\.nolink");

  // If link ends with .nolink, just display as text (link not ready yet)
  if (match_re.test(link)) {
    return <span>{children}</span>;
  } else {
    // Otherwise, use Next.js Link for internal navigation
    return <Link href={link}>{children}</Link>;
  }
}