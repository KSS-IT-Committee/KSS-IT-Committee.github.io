"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./min.module.css";
import { useMinContents } from "./importcontents";



export default function ShirymminPage() {
  const [lang, changelang] = useState<number>(0);
  // APIを利用してJSONから抽出しています。変更をしやすくするのと、言語変更処理が楽なためです。

  const data = useMinContents();

  if (!data) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.name}>Loading…</h1>
        </header>
        <div className={styles.maincon}>
          <p>データを読み込み中です…</p>
        </div>
      </div>
    );
  }
  return (
    <>
        <div className={styles.page} key={1}>
          <header className={styles.header}>
            <h1 className={styles.name}>{data.name}</h1>
            <div className={styles.langbutton}>
              <button className={styles.changelanguage} onClick={() => changelang(0)}>
                Japanese  /
              </button>

              <button className={styles.changelanguage} onClick={() => changelang(1)}>
                English
              </button>
            </div>
          </header>
          <hr className={styles.mobileline} />
          <div className={styles.maincon}>
            {data?.description?.[lang]?.map((info: string, idx: number) => (
              <p key={idx}>{info}</p>
            ))}
            <div className={styles.gridcontents}>
              <div className={styles.infoparent}>
                <div className={styles.infomations}>
                  <div className={styles.link}>
                    <Link href={data.mygithub} target="_blank" rel="noopener noreferrer" className={styles.a}>

                      <Image className={styles.image} src={data.imagesrc} width={200} height={200} alt={'Github Avatar'} />
                      <p>GitHub Link</p>



                    </Link>

                  </div>
                  <div>
                    <p className={styles.info}>{data.term}</p>
                    <p className={styles.info}>{data.birthday}</p>
                  </div>

                </div>
              </div>



              {[0, 1, 2].map(n => {
                return (
                  <div key={n}>
                    <h2 className={styles.subtitle}>{data?.subtitle?.[lang]?.[n]}</h2>
                    {data?.contents?.[lang]?.[n]?.map((content, idx) => {
                      return (
                        <div className={styles.contents} key={`${n}-${idx}`}>
                          <p className={styles.content}>{content}</p>
                        </div>

                      )
                    })}
                  </div>
                )
              })}

            </div>




          </div>



        </div>
    </>
  );
}
