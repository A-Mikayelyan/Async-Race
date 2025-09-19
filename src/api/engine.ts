export type EngineStatus = "started" | "stopped" | "drive";

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:3000";

export type StartResponse = { velocity: number; distance: number };

export async function startEngine(id: number): Promise<StartResponse> {
  const response = await fetch(`${API}/engine?id=${id}&status=started`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error(`startEngine failed (${response.status})`);
  return response.json();
}

export async function drive(
  id: number,
  signal?: AbortSignal | null
): Promise<Response> {
  const init: RequestInit = signal
    ? { method: "PATCH", signal }
    : { method: "PATCH" };
  return fetch(`${API}/engine?id=${id}&status=drive`, init);
}

export async function stopEngine(id: number): Promise<void> {
  const response = await fetch(`${API}/engine?id=${id}&status=stopped`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error(`stopEngine failed (${response.status})`);
}
