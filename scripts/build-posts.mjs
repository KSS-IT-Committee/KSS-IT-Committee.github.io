#!/usr/bin/env node
// Renders content/posts/*.md (frontmatter + markdown body) into a single
// src/lib/posts.generated.json at build time. The Docker runner stage ships
// only the build output — not content/ — so the news pages must never read
// the markdown from disk at runtime; they statically import this artifact
// instead.

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = join(repoRoot, "content", "posts");
const OUT_FILE = join(repoRoot, "src", "lib", "posts.generated.json");

const log = (msg) => console.log(`[posts] ${msg}`);

function writeArtifact(posts) {
  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(posts, null, 2) + "\n");
}

if (!existsSync(SOURCE_DIR)) {
  writeArtifact([]);
  log(`no sources at ${SOURCE_DIR}; wrote empty artifact`);
  process.exit(0);
}

const files = readdirSync(SOURCE_DIR)
  .filter((f) => f.endsWith(".md"))
  .sort();

const posts = await Promise.all(
  files.map(async (file) => {
    const raw = readFileSync(join(SOURCE_DIR, file), "utf8");
    const { data, content } = matter(raw);
    if (!data.title || !data.date) {
      throw new Error(
        `[posts] ${file}: missing required frontmatter: title or date`,
      );
    }
    const slug = file.replace(/\.md$/, "");
    const contentHtml = String(await remark().use(html).process(content));
    return {
      slug,
      id: typeof data.id === "string" ? data.id : slug,
      title: data.title,
      date: new Date(data.date).toISOString(),
      tag: typeof data.tag === "string" ? data.tag : "",
      content,
      contentHtml,
    };
  }),
);

writeArtifact(posts);
log(
  `wrote ${posts.length} post${posts.length === 1 ? "" : "s"} to ${OUT_FILE}`,
);
