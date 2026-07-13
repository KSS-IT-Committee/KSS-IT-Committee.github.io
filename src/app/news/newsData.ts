/**
 * @fileoverview News list data derived from the build-time posts artifact.
 * @module app/news/newsData
 */
import posts from "@/lib/posts.generated.json";

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  tag: string;
  content: string;
}

export function getNews(): NewsItem[] {
  const news = posts.map(
    (post) =>
      ({
        id: post.id,
        title: post.title,
        date: post.date.split("T")[0],
        tag: post.tag,
        content: post.content,
      }) satisfies NewsItem,
  );

  return news.sort((a, b) => (a.date < b.date ? 1 : -1));
}
