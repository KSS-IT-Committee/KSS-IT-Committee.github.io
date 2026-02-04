import Image from "next/image";
import styles from "@/styles/IconCard.module.css";

type Props = {
  icon: string;
  label: string;
  href: string;

  /** アイコン直径(px) */
  size?: number;

  /** カード横(px) */
  width?: number;

  /** カード縦(px) */
  height?: number;

  /** 角の丸さ(px) */
  radius?: number;
  /** アイコンと文字の間隔(px) */
  gap?: number;
};

/**
 * Renders a clickable card displaying an icon above a label that opens the provided URL in a new tab.
 *
 * @param icon - Source URL or path for the icon image.
 * @param label - Text displayed as the card label (also used to form the image alt text).
 * @param href - Destination URL opened when the card is clicked.
 * @param size - Diameter of the icon in pixels (default: 80).
 * @param width - Card width in pixels (default: 220).
 * @param height - Card height in pixels (default: 180).
 * @param radius - Corner radius of the card in pixels (default: 24).
 * @param gap - Vertical spacing between the icon and label in pixels (default: 12).
 * @returns A JSX anchor element containing the icon and label that opens `href` in a new browser tab.
 */
export function IconCard({
  icon,
  label,
  href,
  size = 80,
  width = 220,
  height = 180,
  radius = 24,
  gap = 12,
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      style={
        {
          "--icon-size": `${size}px`,
          "--card-width": `${width}px`,
          "--card-height": `${height}px`,
          "--card-radius": `${radius}px`,
          "--card-gap": `${gap}px`,
        } as React.CSSProperties
      }
    >
      <div className={styles.icon}>
        <Image
          src={icon}
          alt={`${label} のロゴ`}
          fill
          sizes={`${size}px`}
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className={styles.label}>{label}</div>
    </a>
  );
}