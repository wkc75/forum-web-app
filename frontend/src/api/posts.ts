import { apiFetch } from "./client";
import type { Post } from "../types/post";

export interface PostQuery {
  topicId?: number;
  search?: string;
  sort?: "newest" | "popular";
}

export function getPosts(query: PostQuery = {}): Promise<Post[]> {
  const params = new URLSearchParams();
  if (query.topicId !== undefined) {
    params.set("topicId", String(query.topicId));
  }
  if (query.search) {
    params.set("q", query.search);
  }
  if (query.sort && query.sort !== "newest") {
    params.set("sort", query.sort);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiFetch(`/api/posts${suffix}`);
}

export function getPostsByTopic(topicId: number): Promise<Post[]> {
  return getPosts({ topicId });
}

export function createPost(
  title: string,
  content: string,
  topicId: number
): Promise<{ id: number }> {
  return apiFetch("/api/posts", {
    method: "POST",
    body: JSON.stringify({ title, content, topicId }),
  });
}

export function deletePost(id: number) {
  return apiFetch(`/api/posts/${id}`, { method: "DELETE" });
}
