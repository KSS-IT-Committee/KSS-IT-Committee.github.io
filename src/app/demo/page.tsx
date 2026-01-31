import styles from "./demo.module.css";
import DynamicLink from "@/components/DynamicLink";

/**
 * Render a static page that lists available demo pages.
 *
 * Renders an h1 with the text "デモページ一覧" and an unordered list of five demo links.
 *
 * @returns A JSX fragment containing the heading and a list of `DynamicLink` items for each demo page.
 */
export default function DemoPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.title}>デモページ一覧</div>
        <div className={styles.content}>
          <div className={styles.link}><DynamicLink link="/demo/rotarymars">rotarymars</DynamicLink></div>
          <div className={styles.link}><DynamicLink link="/demo/utsukushiioto0816-tech">utsukushiioto0816-tech</DynamicLink></div>
          <div className={styles.link}><DynamicLink link="/demo/K10-K10">K10-K10</DynamicLink></div>
          <div className={styles.link}><DynamicLink link="/demo/SakaYq4875">SakaYq4875</DynamicLink></div>
          <div className={styles.link}><DynamicLink link="/demo/kinoto0103">kinoto0103</DynamicLink></div>
          <div className={styles.link}><DynamicLink link="/demo/hatuna-827">hatuna-827</DynamicLink></div>
        </div>
      </div>
    </div>
  );
}