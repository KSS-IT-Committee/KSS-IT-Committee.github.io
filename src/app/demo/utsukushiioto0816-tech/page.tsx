import Image from "next/image";
import styles from "./self-introduction.module.css";
export default function Utsukushiioto0816techPage() {

  return (
    <>
      <header className={styles.header}>
        About Me!
        <h2 className={styles.h2}>自己紹介ぺーじにようこそ！!</h2>
        <div style={{ border: "2px solid darkseagreen", width: "100%" }}></div>
      </header>
      <main className={styles.main}>
        <div className={styles.container}>
          <br />
          <div className={styles.profile}>
            <div style={{ border: "2px solid darkseagreen" }}></div>
            <h1 className={styles.h1}>プロフィール</h1>
            <Image
              src="https://avatars.githubusercontent.com/u/236381715?v=4"
              alt="utsukushiioto0816"
              width={150}
              height={150}
              style={{
                borderRadius: "50%",
                marginTop: 10,
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
            <p className={styles.p}>名前: utsukushiioto0816-tech</p>
            <p className={styles.p}>誕生日: 8月16日</p>
            <p className={styles.p}>部活: 女子バレー部,料理研究会,物理研究会</p>
            <div style={{ border: "2px solid darkseagreen" }}></div>
          </div>
          <div className={styles.introduction}>
            <h1 className={styles.h1}>自己紹介</h1>
            <p className={styles.p}>
              こんにちは。プログラミングできないのに委員会に入って3日で副委員長兼会計になった人です。
              特に語ることがないので、テンプレっぽいことを言って（書いて）おきます。
            </p>
            <p className={styles.p}>
              趣味は読書とお菓子作り、好きな食べ物はミニトマト、嫌いな食べ物はキノコ全般です。<br />
              委員会に入ったのは、プログラミングができるようになりたかったのと、誘われたからです。
            </p>
            <p className={styles.p}>技術も知識もほぼぜろですが、頑張るのでやさしくしてください。</p>
          </div>
          <div className={styles.goal}>
            <h1 className={styles.h1}>目標</h1>
            <p className={styles.p}>天命を待てるくらい人事を尽くすこと</p>
          </div>
          <div className={styles.links}>
            <h1 className={styles.h1}>GitHub</h1>
            <a href="https://github.com/utsukushiioto0816-tech">アカウントはこちら</a>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <p className={styles.p}>© 2026 utsukushiioto0816-tech. All rights reserved.</p>
      </footer>
    </>
  );
}
