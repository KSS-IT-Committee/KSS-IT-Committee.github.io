'use client'
import Image from 'next/image';
import styles from './hatuna-demo.module.css';
import { useEffect, useState } from 'react';

interface LoadImageProps {
  className?: string | undefined;
  src: string;
  alt: string;
  height: number;
  width: number;
}

function LoadImage({ className, src, alt, height, width }: LoadImageProps) {
  return (
    <div style={{ height, width, margin: "10px 0px", border: "2px solid #000" }}>
      <div className={styles.load}>
        <Image
          className={className}
          src={src}
          alt={alt}
          height={height}
          width={width}
        />
      </div>
    </div>
  )
}

export default function Hatuna() {
  const [isActive, setIsActive] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    let step = 0
    const timerID = window.setInterval(() => {
      setActiveStep(++step);
      console.log(step);
    }, 1000);
    const timeoutID = window.setTimeout(() => {
      clearInterval(timerID);
    }, 10000);
    return () => {
      clearInterval(timerID);
      clearTimeout(timeoutID);
    };
  }, []);

  return (
    <div className={styles.page} onContextMenu={(event) => { event.preventDefault(); alert('右クリックは禁止です！'); }} style={{ fontSize: activeStep <= 0 ? '' : '16px', fontFamily: activeStep <= 1 ? '' : 'DotGothic16' }}>
      <div className={styles.sidebarContainer}>
        <div className={styles.minititle} onClick={() => console.log(activeStep)}>K I T e C</div>
        <div className={styles.sidebarWrapper}>
          <div className={styles.sidebarContent} style={{ display: activeStep <= 3 ? 'none' : 'block' }}>
            <div className={styles.bannerText}><span onClick={() => setIsActive(true)}>☆★</span> 相互リンク募集中 <span onClick={() => alert('深淵をのぞく時、深淵もまたこちらをのぞいているのだ')}>★☆</span></div>
            <a href='https://kss-it-committee-github-io.vercel.app/' target='blank' rel='noopener noreferrer'>
              <Image
                className={styles.banner}
                src='/images/demo/hatuna/KITeC-banner.png'
                alt='KITeC-banner'
                width={88}
                height={31}
              />
            </a>
            <a href='https://hatuna-827.github.io/' target='blank' rel='noopener noreferrer'>
              <Image
                className={styles.banner}
                src='/images/demo/hatuna/hatuna-banner.png'
                alt='hatuna-banner'
                width={88}
                height={31}
              />
            </a>
            <a href='https://k10-k10.github.io/' target='blank' rel='noopener noreferrer'>
              <Image
                className={styles.banner}
                src='/images/demo/hatuna/k10-k10-banner.png'
                alt='k10-k10-banner'
                width={88}
                height={31}
              />
            </a>
            <Image
              className={styles.banner}
              src='/images/demo/hatuna/varmeta-banner.png'
              alt='varmeta-banner'
              width={88}
              height={31}
            />
            <a href='https://www.cao.go.jp/minister/2009_t_hirai/kaiken/20201124kaiken.html' target='blank' rel='noopener noreferrer'>
              <Image
                className={styles.banner}
                src='/images/demo/hatuna/PPAP-banner.png'
                alt='PPAP-banner'
                width={88}
                height={31}
              />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.top} style={{ display: isActive ? 'none' : 'block', backgroundImage: activeStep <= 4 ? '' : 'url("/images/demo/hatuna/bg.png")' }}>
        <div className={styles.title}>hatuna-827&apos;s demo page</div>
        <p>hatuna-827のデモページへようこそ♪</p>
        <p>以下の注意事項を確認したうえで、お進みください。</p>
        <br />
        <p>== 注意事項 ==</p>
        <p>・内容にはミームなどが含まれている危険性があります。</p>
        <p>・内容にhatuna-827の自己紹介は含まれていません。</p>
        <p>・コンテンツはすべて冗談です。</p>
        <p>・注意事項を読み、下のTからお入りください。</p>
        <p>・実在の人物、出来事との類似点はすべて偶然です。</p>
        <br />
        <div className={styles.ENTER}>
          <span onClick={() => alert('🔎お前を消す方法')}>E</span>
          <span onClick={() => alert('デモページ見るっていうレベルじゃねえぞ！')}>N</span>
          <span onClick={() => alert('左の☆★よりお入りください。')}>T</span>
          <span onClick={() => alert('そうか、そうか、つまりきみはそんなやつなんだな。')}>E</span>
          <span onClick={() => alert('インド人を右に')}>R</span>
        </div>
      </div>
      <div className={styles.mainContainer} style={{ display: isActive ? 'block' : 'none' }}>
        <div className={styles.title}>hatuna-827&apos;s demo page</div>
        <p>アナタは累計 <span className={styles.counter}><span>0</span><span>0</span><span>0</span><span>1</span><span>7</span><span>2</span><span>9</span></span> 人目の訪問者です。<span style={{ fontSize: 13, color: '#333' }}>……ﾌｯ､この程度で喜ぶと思いましたか？(笑い)</span></p>
        <p>キリ番を踏んだ方は、<span style={{ color: '#0aa', fontWeight: 600 }}>BBS</span>にカキコしてくださいネ♪</p>
        <p>踏み逃げ厳禁！</p>
        <h2 className={styles.h2}>掲示板</h2>
        <LoadImage
          src='https://github.com/hatuna-827.png'
          alt='hatuna-icon'
          height={200}
          width={200}
        />
        <LoadImage
          src='https://hatuna-827.github.io/varmeta-discord-bot/images/680_240.png'
          alt='varmea-banner'
          height={240}
          width={680}
        />
        <LoadImage
          src='https://hatuna-827.github.io/Lunarko/resources/icons/favicon.png'
          alt='varmea-banner'
          height={200}
          width={200}
        />
        <h2 className={styles.h2}>BBS</h2>
        <p>※直リン禁止！！</p>
        <p>※ネチケットを守りましょう。</p>
        <p>荒らし・中傷カキコはお断りします。</p>
        <br />
        <div className={styles.BBS}>
          {`1. 匿名希望 2011/03/34 08:27

    ／l、
  （ﾟ､ ｡ ７
    l  ~ヽ
    じしf_,)ノ

2. 匿名K 2011/03/34 10:10

    ____ ∧ ∧
    |＼ /(´～\`)＼< ﾆ ｬ ｰ
    |　|￣￣￣￣￣|
    |　|＝みかん＝|
    \ ＼|＿＿＿＿＿|

3. ｲｲﾝﾁｮｰ 20211/03/34 12:24

    \ ∧ ∧
    /(´Д\`)ノ< ﾆ ｬ ｰ ﾆ ｬ ｰ
    ￣￣￣￣|

4. 匿名希望 2011/03/34 13:37

    　　　　　　　／⌒ヽ
    　　　⊂二二二（＾ω＾）二⊃
    　　　　　 　|　 / 　　　　　　ﾌﾞｰﾝ
    　　　　 　 （　ヽノ
    　　　　　　 ﾉ>ノ　
    　　　 三　　レﾚ

5. 匿名希望 2011/03/34 13:37

    　　　　　　　　∑ ⊂(　＾ω＾)⊃ ｷｷｰ-ｯ!!

6. 匿名H 2011/03/34 15:01

    型ぽ
    　　∧＿∧
    　（　´∀｀）＜ その型、入らんが？

7. 匿名希望 2011/03/34 15:12

    　　 （・∀・）　　　|　|　ｶﾞｯ
    　　と　　　　）　 　 |　|
    　　　 Ｙ　/ノ　　　 人
    　　　　 /　）　 　 < 　>__Λ∩
    　　 ＿/し'　／／. Ｖ｀Д´）/ ←>>6
    　　（＿フ彡　　　　　 　　/

`}
        </div>
        <hr className={styles.hr} />
        <p>【 動 作 確 認 環 境 】</p>
        <p>Win7 / Internet Explorer</p>
        <p>【 推 奨 設 定 】</p>
        <p>文字サイズ：中</p>
        <p>画面最大希望</p>
      </div>
    </div>
  );
}
