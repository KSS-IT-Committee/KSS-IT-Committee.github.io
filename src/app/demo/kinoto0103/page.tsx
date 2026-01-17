import Image from 'next/image';
import styles from './styles.module.css';
import github_logo from '../../../../public/images/github-mark.svg';
import { Yusei_Magic } from 'next/font/google';
import { Zen_Maru_Gothic } from 'next/font/google';

const yuseiMagic = Yusei_Magic({
  subsets: ['latin'],
  weight: ['400']
});

const zenMaruGothic = Zen_Maru_Gothic({
  preload: false,
  weight: ['500']
});

export default function Kinoto0103() {
  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <header>
          <h1 className={yuseiMagic.className}>kinoto0103</h1>
        </header>
        <main className={zenMaruGothic.className}>
          <div className={styles.icon_and_profile}>
            <Image src="https://github.com/kinoto0103.png" alt="icon" className={styles.icon} width={200} height={200} />
            <section className={styles.profile}>
              <h1 className={yuseiMagic.className}>Profile</h1>
              <div className={styles.profile_items}>
                <article><h2>誕生日</h2><p>2012年1月3日</p></article>
                <article><h2>部活</h2><p>軽音楽研究会、物理研究会ロボット班</p></article>
                <article><h2>委員会</h2><p>IT、対面式、立志、ゲート、新聞</p></article>
                <article><h2>趣味</h2><p>ピアノ、DTM、イラスト</p></article>
                <article><h2>好きな食べ物</h2><p>焼き芋、チョコレート</p></article>
                <article><h2>勉強したことがあるもの</h2><p>Python, C++, HTML, CSS, JavaScript, Reactなど</p></article>
              </div>
            </section>
          </div>
          <div className={styles.introduction}>
            <p>クリエイティブなことと甘い食べ物が好きです。</p>
            <p>いつか作曲してMVを作ったりゲームを作ったりしてみたいなと思いながら生活しています。</p>
            <p>小1から小6までロボットプログラミング教室に通っていましたが、PythonやHTMLなどの勉強を始めたのは中学に入ってからです。</p>
            <p>プログラミングはまだまだ初心者ですが頑張ります。よろしくお願いします！</p>
          </div>
          <div className={styles.accounts}>
            <a href="https://github.com/kinoto0103" target="_blank" rel="noopener noreferrer">
              <Image src={github_logo} alt="GitHub" width={200} height={200} /></a>
          </div>
        </main>

      </div>
    </div>
  );
}
