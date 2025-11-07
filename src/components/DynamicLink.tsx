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