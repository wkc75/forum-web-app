import { apiFetch } from "./client";
import type { Topic } from "../types/topic";

export function getTopics(): Promise<Topic[]> {
  return apiFetch("/api/topics");
}

export function createTopic(name: string) {
  return apiFetch("/api/topics", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function deleteTopic(id: number) {
  return apiFetch(`/api/topics/${id}`, { method: "DELETE" });
}
