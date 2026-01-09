import { apiFetch } from "./client";
import type { Comment } from "../types/comment";

export function getComments(postId: number): Promise<Comment[]> {
  return apiFetch(`/api/comments?postId=${postId}`);
}

export function createComment(content: string, postId: number) {
  return apiFetch("/api/comments", {
    method: "POST",
    body: JSON.stringify({ content, postId }),
  });
}

export function deleteComment(id: number) {
  return apiFetch(`/api/comments/${id}`, { method: "DELETE" });
}
