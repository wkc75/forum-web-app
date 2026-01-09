import { apiFetch } from "./client";
import type { Post } from "../types/post";
import type { Comment } from "../types/comment";

export function getMyPosts(): Promise<Post[]> {
  return apiFetch("/api/me/posts");
}

export function getMyComments(): Promise<Comment[]> {
  return apiFetch("/api/me/comments");
}
