const API_BASE = "http://localhost:8000";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  if (res.status === 204) return null as T;

  const text = await res.text();
  if (!text) return null as T;

  return JSON.parse(text) as T;
}
