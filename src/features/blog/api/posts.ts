import { getCollection } from "astro:content";
import type { PostMeta } from "../../../entities/post/types.ts";

export interface PostListItem {
  slug: string;
  meta: PostMeta;
}

function entrySlug(entry: { id: string }): string {
  return entry.id.replace(/\.md$/, "");
}

export async function getPosts(): Promise<PostListItem[]> {
  const entries = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  return entries
    .map((entry) => ({
      slug: entrySlug(entry),
      meta: {
        title: entry.data.title,
        description: entry.data.description,
        pubDate: entry.data.pubDate,
        tags: entry.data.tags,
        draft: entry.data.draft,
      },
    }))
    .sort((a, b) => b.meta.pubDate.getTime() - a.meta.pubDate.getTime());
}

export async function getPostBySlug(
  slug: string,
): Promise<{ entry: import("astro:content").CollectionEntry<"blog"> } | null> {
  const entries = await getCollection("blog");
  const entry = entries.find((e) => entrySlug(e) === slug);

  if (!entry) return null;
  if (import.meta.env.PROD && entry.data.draft) return null;

  return { entry };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  });
}

export function formatDateFull(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
