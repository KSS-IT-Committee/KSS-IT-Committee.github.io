import mainstyle from "../page.module.css"
export const metadata: Metadata = {
  title: "IT Committee Home page! ~tutorial~",
  description: "Home page for IT Committee",
};
export default function page() {
  return (
    <>
      <h1 className={mainstyle.h1}>委員会チュートリアル</h1>
      <h2 className={mainstyle.h2}>現在の一覧</h2>
      <ol>
        <li>WSLをインストールする</li>
      </ol>
    </>
  );
}