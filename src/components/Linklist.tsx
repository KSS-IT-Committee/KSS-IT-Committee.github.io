import React from 'react';
import styles from "@/styles/Linklist.module.css";
import Link from 'next/link';

interface LinklistProps {
  links: { url: string; title: string; subtitle?: string; nolink?: boolean; }[];
}

export default function Linklist({ links }: LinklistProps) {
  return (
    <div className={styles.container}>
      {links.map(({ url, title, subtitle, nolink }, i) => (
        nolink ?
          <div key={`${i}-${url}`} className={styles.list}>
            <span className={styles.number}>{i + 1}</span>
            <span className={styles.nolinktitle}>{title}</span>
            <span className={styles.nolinksubtitle}>{subtitle}</span>
          </div>
          :
          <Link href={url} key={`${i}-${url}`} className={styles.link}>
            <div className={styles.list}>
              <span className={styles.number}>{i + 1}</span>
              <span className={styles.title}>{title}</span>
              <span className={styles.subtitle}>{subtitle}</span>
            </div>
          </Link>
      ))}
    </div>
  )
}
