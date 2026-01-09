import { apiFetch } from "./client";
import type { Post } from "../types/post";

export function getPostsByTopic(topicId: number): Promise<Post[]> {
  return apiFetch(`/api/posts?topicId=${topicId}`);
}

export function createPost(title: string, content: string, topicId: number) {
  return apiFetch("/api/posts", {
    method: "POST",
    body: JSON.stringify({ title, content, topicId }),
  });
}

export function deletePost(id: number) {
  return apiFetch(`/api/posts/${id}`, { method: "DELETE" });
}
