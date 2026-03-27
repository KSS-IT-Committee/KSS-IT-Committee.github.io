import Image from "next/image";
import { BackButton } from "@/components/BackButton";
import styles from "./style.module.css";
import profileImage from "./image.png";


export default function MochiK180DemoPage() {
    return (
    <div className={styles.all}>
      <div className={styles.top}>
        <Image src={profileImage} className={styles.icon} alt="picture" width={40} height={40} />
        <div className={styles.ames}>
          <div className={styles.name}>mochi-k18</div>
          <div className={styles.sub}>一応水泳部。自認はほぼ帰宅部。</div>
        </div>
      </div>
      <div className={styles.title}>自己紹介</div>
      <div className={styles.main}>
        <p>・誕生日：8月11日</p>
        <p>・部活：水泳部。今は幽霊部員のようだが、一応入学からの初期メンツ。頑張っていた時代もあった。</p>
        <p>・趣味：スキー、マンガを読むこと。特に異世界・転生モノ。スポーツマンガも好き。</p>
        <p>・長所(特技)：長所なんて自分で書くモノではないので得意なことでも書いておく。<br />　　　　　　　スキー、マッサージ(水泳部で鍛えられた。もはや趣味)、人に頼ること？</p>
        <p>・短所：定時で起きること。強制されないと何もできない。期限ギリギリまで課題等する気が起きない。</p>
        <p>プログラミング関係は初心者です。pythonは少しいじったことある。<br />
          いつもギリギリで生きています。他人に迷惑はかかりすぎないようにしてる、、、と思いたい。</p>
        <a href="https://github.com/mochi-k18" target="_blank" rel="noopener noreferrer">githubアカウント</a>
      </div>
    </div>
    );
}