import { apiFetch } from "./client";

export function login(username: string) {
  return apiFetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ username }),
  });
}

export function getMe(): Promise<{ username: string }> {
  return apiFetch("/api/me");
}

export function logout() {
  return apiFetch("/api/logout", { method: "POST" });
}
