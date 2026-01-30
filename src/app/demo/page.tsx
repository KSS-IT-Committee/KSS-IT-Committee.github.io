import styles from "@/styles/base.module.css";
import DynamicLink from "@/components/DynamicLink";

/**
 * Render a static page that lists available demo pages.
 *
 * Renders an h1 with the text "デモページ一覧" and an unordered list of five demo links.
 *
 * @returns A JSX fragment containing the heading and a list of `DynamicLink` items for each demo page.
 */
export default function Page() {
  return (
    <>
      <h1>デモページ一覧</h1>
      <ul>
        <li><DynamicLink link="/demo/rotarymars">rotarymars</DynamicLink></li>
        <li><DynamicLink link="/demo/utsukushiioto0816-tech">utsukushiioto0816-tech</DynamicLink></li>
        <li><DynamicLink link="/demo/K10-K10">K10-K10</DynamicLink></li>
        <li><DynamicLink link="/demo/SakaYq4875">SakaYq4875</DynamicLink></li>
        <li><DynamicLink link="/demo/kinoto0103">kinoto0103</DynamicLink></li>
        <li><DynamicLink link="/demo/hatuna-827">hatuna-827</DynamicLink></li>
      </ul>
    </>
  );
}