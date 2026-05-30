export interface PostMeta {
  title: string;
  description: string;
  pubDate: Date;
  tags: string[];
  draft: boolean;
}

export interface Post {
  slug: string;
  meta: PostMeta;
}
