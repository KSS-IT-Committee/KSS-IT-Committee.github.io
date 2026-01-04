import styles from "@/styles/base.module.css";
import DynamicLink from "@/components/DynamicLink";

export default function Page() {
  return (
    <>
    <h1>デモページ一覧</h1>
    <ul>
      <li><DynamicLink link="/demo/rotarymars.nolink">rotarymars</DynamicLink></li>
      <li><a href="demo/utsukushiioto0816-tech">utsukushiioto0816-tech</a></li>
    </ul>
    </>
  );
}