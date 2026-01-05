import Image from 'next/image';
import x-logo from './images/x-logo.png';
import github-logo from './images/github-logo.png';
import styles from '../styles.module.css';

export default function kinoto0103() {
    return (
        <>
            <header>
                <h1 className={styles.yusei-magic}>kinoto0103</h1>
            </header>
            <main>
                <div className={styles.icon-and-profile}>
                    <img src="./images/icon.png" alt="kinoto" className={styles.icon} />
                    <section className={styles.zen-maru}>
                        <p>誕生日：2012年1月3日</p>
                        <p>部活：軽音、物研ロボット班</p>
                        <p>委員会：IT、対面式、立志、ゲート、新聞</p>
                        <p>趣味：ピアノ、DTM、イラスト</p>
                        <p>好きな食べ物：焼き芋</p>
                        <p>好きなアニメ：まどマギ</p>
                        <p>勉強したことのある言語：Python, C++, HTML, CSS, JavaScript</p>
                    </section>
                </div>
                <div className={styles.introduction}>
                    <p>クリエイティブなことと甘い食べ物が好きです。</p>
                    <p>いつか作曲してMVを作ったりゲームを作ったりしてみたいなと思いながら生活しています。</p>
                    <p>小1から小6までロボットプログラミング教室に通っていましたが、pythonやHTMLなどの勉強を始めたのは中学に入ってからです。</p>
                    <p>プログラミングはまだまだ初心者ですが頑張ります。よろしくお願いします！</p>
                </div>
                <div className={styles.accounts}>
                    <a href="https://x.com/toco0103k" target="_blank" rel="noreferrer"><Image src={x-logo} alt="kinoto" /></a>
                    <a href="https://github.com/kinoto0103" target="_blank" rel="noreferrer"><Image src={github-logo} alt="kinoto0103" /></a>
                </div>
            </main>
        </>
    );
}
