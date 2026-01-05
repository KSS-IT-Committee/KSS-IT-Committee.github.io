import styles from "@/styles/base.module.css";
import DynamicLink from "@/components/DynamicLink";

export default function Page() {
  return (
    <>
    <h1>デモページ一覧</h1>
    <ul>
      <li><DynamicLink link="/demo/rotarymars.nolink">rotarymars</DynamicLink></li>
      <li><DynamicLink link="/demo/kinoto0103">kinoto0103</DynamicLink></li>
    </ul>
    </>
  );
}