import { ReactNode } from "react";
import Image from "next/image";
import data from "./contents.json";
import styles from "./K10-K10.module.css";

function ContentsBlock({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className={styles.Block}>
      <h2 className={styles.BlockTitle}>{title}</h2>
      <div className={styles.BlockContents}>{children}</div>
    </div>
  );
}

export default function K10K10Page() {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>{data.PageTitle}</h1>
      <ContentsBlock title={data.BlockTitle[0]}>
        <div className={styles.Row}>
          <div className={styles.Info}>
            {data.PList.map((s) => (
              <p key={s.item}>
                {s.item}: {s.value}
              </p>
            ))}
            {data.Services.map((s) => (
              <p key={s.service}>
                <a href={`${s.url}/${s.user}`} className={styles.Link}>
                  {s.service}
                </a>
              </p>
            ))}
          </div>
          <Image
            src={data.Icon}
            width={200}
            height={200}
            alt={data.IconAlt}
            className={styles.Icon}
          />
        </div>
      </ContentsBlock>
      <ContentsBlock title={data.BlockTitle[1]}>
        {data.InfoContents.map((line: string, i: number) => (
          <p key={i}>{line}</p>
        ))}
      </ContentsBlock>
    </div>
  );
}
