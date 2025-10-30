import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
    <h1 className={styles.h1}>都立小石川中等教育学校　IT委員会</h1>
    <Image
      src="/images/IT-logo.png"
      width={200}
      height={200}
      alt="IT委員会のロゴ"
      ></Image>
    </>
  );
}
