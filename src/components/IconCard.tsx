import Image from "next/image";
import styles from "./IconCard.module.css";

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

export default function IconCard({
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
