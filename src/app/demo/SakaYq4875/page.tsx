import style from './SakaYq4875.module.css';
import Image from 'next/image';
import Link from 'next/link';
import IconCard from '@/components/IconCard';
import BackButton from '@/components/BackButton';

/**
 * Renders a static personal/demo profile page for the user "SakaYq4875".
 *
 * @returns The JSX element representing the profile page content, including header, self-introduction sections, link icons, and footer.
 */
export default function SakaYq4875DemoPage() {
  return (
    <>
      <div className={style.page}>

        <div className={style.header}>
          <BackButton path="/demo" title="一覧へ"/>
          <Image src="https://avatars.githubusercontent.com/u/235658634?v=4" alt="SakaYq4875のアイコン" width={60} height={60} />
          <h1>SakaYq4875</h1>
          <p>（少し長いので注意）</p>
        </div>

        <div className={style.selfintroduction}>
          <div className={style.aboutme}>
            <h1>自己紹介</h1>
            <h2>名前</h2>
            <p>SakaYq4875</p>
            <h2>部活</h2>
            <p>
              クイズ研究会（略称：KSSQC）<br/>
              <a href="https://www.x.com/koishikawa_quiz">公式アカウント</a>
            </p>
          </div>
          
          <div className={style.programing}>
            <h1>プログラミング</h1>
            <h2>いつも使ってる言語</h2>
            <ul>
              <li>Python：競プロ、データサイエンス</li>
              <li>HTML,CSS,JavaScript,TypeScript：Webページ</li>
              <li>C++：競プロ</li>
            </ul>
            <h2>習得したい言語</h2>
            <ul>
              <li>C#：Unityを使いたい</li>
              <li>R：データサイエンスに使えそう</li>
            </ul>
            <h2>プログラミングに関する趣味</h2>
            <p>Ankiというアプリのアドオンをいじる</p>
            <p>競技プログラミング（競プロ）</p>
            <p>データサイエンス</p>
          </div>

          <div className={style.hobbies}>
            <h1>その他の趣味</h1>
            <h2>クイズ</h2>
            <p>本当に楽しい。1日に100問程の新しいクイズを覚えている。</p>
            <h2>数学</h2>
            <p><Link href="https://www.onlinemathcontest.com">OnlineMathContest</Link>というサイトで様々な数学の問題を解いている</p>
            <p>来年のJJMOは予選突破したいな。</p>
            <h2>3Dモデリング</h2>
            <p>Blenderを使っている</p>
          </div>

          <div className={style.goal}>
            <h1>目標</h1>
            <p>IT委員会フロントエンド長として、UI、UXなどについて気にしながら、すべての人にとって使いやすい創作展のホームページを作成したいです。</p>
            <p>また、プログラミングができる人を増やし、楽しいIT委員会を作っていきたいです。</p>
          </div>

        </div>

        <div className={style.links}>
          <IconCard icon="/images/github-mark.svg" label="Github" href="https://www.github.com/SakaYq4875" size={70} />
          <IconCard icon="https://onlinemathcontest.com/assets/images/logo/OnlineMathContestLogo.JPG" label="OnlineMathContest" href="https://onlinemathcontest.com/users/SakaYq4875" size={70} />
          <IconCard icon="https://img.atcoder.jp/assets/top/img/logo_bk.svg" label="Atcoder" href="https://atcoder.jp/user/SakaYq4875" size={70} />
          <IconCard icon="https://www.kaggle.com/static/images/favicon.ico" label="kaggle" href="https://www.kaggle.com/SakaYq4875" size={70} />
        </div>

        <footer className={style.footer}>
          <p>© 2026 SakaYq4875</p>
        </footer>

      </div>
    </>
  )
}
