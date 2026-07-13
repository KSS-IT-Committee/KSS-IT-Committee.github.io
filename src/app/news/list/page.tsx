/**
 * @fileoverview News list page showing every published news post.
 * @module app/news/list/page
 *
 * Statically generated from the build-time posts artifact.
 * This is a public page - no authentication required.
 */
export const dynamic = "force-static";

import { Metadata } from "next";

import { getNews } from "@/app/news/newsData";
import { NewsItem } from "@/app/news/newsItem";
import { BackButton } from "@/components/BackButton";

import styles from "@/app/news/list/news-page.module.css";

export const metadata: Metadata = {
  title: "News List",
  description: "IT委員会 ニュース一覧ページ",
};

export default function NewsListPage() {
  const sorted = [...getNews()].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className={styles.newsContainer}>
      <BackButton path="/" title="トップに戻る" />
      <div className={styles.header}>
        <h1 className={styles.newsTitle}>ニュース一覧</h1>
        <p className={styles.newsIntro}>最新のニュースをお届けします。</p>
      </div>
      <div className={styles.newsContent}>
        <p className={styles.information}>
          お知らせをクリックすると詳細が表示されます。
        </p>
        <ul className={styles.newsList}>
          {sorted.map((item) => (
            <NewsItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}
