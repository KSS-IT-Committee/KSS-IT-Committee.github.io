import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
    <h1 className={styles.h1}>IT Committee Demo Home page!</h1>
    <Image
      src="/images/IT-logo.png"
      width={200}
      height={200}
      alt="IT Committee logo"
      ></Image>
    </>
  );
}
