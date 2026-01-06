import Image from 'next/image';
import github_logo from '../../../../../public/images/github-mark.svg';
import icon from '../../../../../public/images/kinoto0103/icon.png';
import styles from './styles.module.css';

export default function Kinoto0103() {
    return (
        <>
            <header>
                <h1>kinoto0103</h1>
            </header>
            <main>
                <div className={styles.icon_and_profile}>
                    <Image src={icon} alt="icon" className={styles.icon} />
                    <section>
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
                    <a href="https://github.com/kinoto0103" target="_blank" rel="noreferrer"><Image src={github_logo} alt="GitHub" /></a>
                </div>
            </main>
        </>
    );
}
