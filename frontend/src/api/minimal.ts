import { apiFetch } from "./client";

export type HealthResponse = {
  message: string;
  database: string;
  time: string;
  counts: {
    users: number;
    topics: number;
    posts: number;
    comments: number;
  };
};

export type ProfileResponse = {
  username: string;
  postCount: number;
  commentCount: number;
};

export function getHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>("/api/minimal/health");
}

export function getProfile(): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>("/api/minimal/profile");
}
