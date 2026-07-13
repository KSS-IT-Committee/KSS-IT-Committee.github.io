/**
 * @fileoverview Accessors for news posts rendered at build time.
 * @module lib/posts
 *
 * Posts are authored as markdown files in content/posts/ and rendered into
 * src/lib/posts.generated.json by scripts/build-posts.mjs (wired to the
 * predev/prebuild hooks). This module reads that artifact — never the
 * markdown from disk — so it works in the standalone Docker runtime too.
 */
import posts from "./posts.generated.json";

type Post = {
  id: string;
  contentHtml: string;
  title: string;
  date: string;
};

export function getAllPosts() {
  return posts.map((post) => ({
    id: post.slug,
    title: post.title,
    date: post.date,
    tag: post.tag,
  }));
}

export async function getPostById(id: string): Promise<Post> {
  const post = posts.find((p) => p.slug === id);

  if (!post) {
    throw new Error(`Post ${id} not found`);
  }

  return {
    id: post.slug,
    contentHtml: post.contentHtml,
    title: post.title,
    date: post.date,
  };
}
