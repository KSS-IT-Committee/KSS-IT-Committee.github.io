import Image from "next/image";
import styles from "./MaintainerCard.module.css";

interface MaintainerCardProps {
  username: string;
  name: string;
}

export default function MaintainerCard({ username, name }: MaintainerCardProps) {
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
          width={80}
          height={80}
          alt={`${name}'s profile`}
          className={styles.avatar}
        />
        <p className={styles.name}>{name}</p>
      </a>
    </div>
  );
}