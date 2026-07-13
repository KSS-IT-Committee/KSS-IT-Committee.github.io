/**
 * @fileoverview News detail page rendering a single post's markdown.
 * @module app/news/[id]/page
 *
 * Every post is statically generated at build time from the posts artifact;
 * unknown ids 404 (dynamicParams is false).
 * This is a public page - no authentication required.
 */
import { Metadata } from "next";

import { BackButton } from "@/components/BackButton";
import { getAllPosts, getPostById } from "@/lib/posts";

import styles from "@/app/news/markdown.module.css";

export const metadata: Metadata = {
  title: "News",
  description: "IT委員会 ニュース詳細ページ",
};

// Next.js route segment config — the name is fixed by the framework API.
// eslint-disable-next-line @typescript-eslint/naming-convention
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ id: p.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  return (
    <div className={styles.container}>
      <BackButton path="/news/list" title="一覧に戻る" />
      <article>
        <div className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.date}>
            {new Date(post.date).toLocaleDateString("ja-JP")}
          </p>
        </div>
        <div className={styles.wrapper}>
          {/* contentHtml is rendered at build time by remark-html (sanitized
              by default) from repo-committed markdown — never user input. */}
          <div
            className={styles.markdown}
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>
      </article>
    </div>
  );
}
