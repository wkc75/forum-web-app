import { apiFetch } from "./client";
import type { Topic } from "../types/topic";

export function getTopics(search?: string): Promise<Topic[]> {
  const params = new URLSearchParams();
  if (search) {
    params.set("q", search);
  }
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiFetch(`/api/topics${suffix}`);
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

export function getTopic(id: number): Promise<Topic> {
  return apiFetch(`/api/topics/${id}`);
}
