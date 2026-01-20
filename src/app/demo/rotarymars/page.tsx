import styles from './rotarymars.module.css';
import Image from 'next/image';
import BackButton from '@/components/BackButton';

/**
 * Renders a static personal/demo profile page for the user "rotarymars".
 *
 * @returns The JSX element representing the profile page content with a universe theme.
 */
export default function RotaryMarsDemoPage() {
  return (
    <div className={styles.container}>
      <div className={styles.stars}></div>
      <div className={styles.content}>
        <BackButton path="/demo" title="一覧へ" />

        <header className={styles.header}>
          <div className={styles.iconWrapper}>
            <Image
              src="https://github.com/rotarymars.png"
              alt="rotarymarsのアイコン"
              width={150}
              height={150}
              className={styles.icon}
            />
          </div>
          <h1 className={styles.title}>rotarymars</h1>
          <p className={styles.subtitle}>🪐Phobos, Deimos🪐</p>
        </header>

        <main className={styles.main}>
          <section className={styles.section}>
            <h2>自己紹介</h2>
            <div className={styles.info}>
              <p><strong>部活:</strong> 物理研究会</p>
              <p><strong>委員会:</strong> IT委員会</p>
              <p><strong>趣味:</strong> ピアノ、バレエ</p>
              <p><strong>好きなもの:</strong> プログラミング</p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>プログラミング</h2>
            <div className={styles.skills}>
              <p>C、C++をメインで書きます。</p>
              <p>機械学習ライブラリを使うためにPythonも書きます。</p>
              <p>もう少し言語の幅を広げたいです。</p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>リンク</h2>
            <div className={styles.links}>
              <a
                href="https://x.com/rotarymars"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg"
                  alt="X"
                  width={40}
                  height={40}
                />
                X
              </a>
              <a
                href="https://atcoder.jp/users/rotarymars"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <Image
                  src="https://img.atcoder.jp/assets/favicon.png"
                  alt="Atcoder's icon"
                  width={40}
                  height={40}
                />
                AtCoder
              </a>
              <a
                href="https://qiita.com/rotarymars"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <Image
                  src="https://cdn.qiita.com/assets/favicons/public/production-c620d3e403342b1022967ba5e3db1aaa.ico"
                  alt="Qiita"
                  width={40}
                  height={40}
                />
                Qiita
              </a>
            </div>
            <div className={styles.links}>
              <a
                href="https://github.com/rotarymars"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <Image
                  src="/images/github-mark.svg"
                  alt="GitHub"
                  width={40}
                  height={40}
                />
                GitHub
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
