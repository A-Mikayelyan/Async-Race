const BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:3000";

function url(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  const u = new URL(
    path.replace(/^\//, ""),
    BASE.endsWith("/") ? BASE : `${BASE}/`
  );
  if (params)
    Object.entries(params).forEach(
      ([k, v]) => v !== undefined && u.searchParams.set(k, String(v))
    );
  return u.toString();
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(url(path, params as any));
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(
    (import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:3000") + path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}
