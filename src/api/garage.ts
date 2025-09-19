// src/api/garage.ts
import type { CarEntity, Paginated } from "./types";

const BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:3000";

export type CreateCarBody = Omit<CarEntity, "id">;

export type UpdateCarBody = Partial<Omit<CarEntity, "id">>;

export async function getCars(
  page = 1,
  limit = 7
): Promise<Paginated<CarEntity>> {
  const url = new URL(`${BASE}/garage`);
  url.searchParams.set("_page", String(page));
  url.searchParams.set("_limit", String(limit));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  const items = (await res.json()) as CarEntity[];
  const total = Number(res.headers.get("X-Total-Count") ?? items.length);
  return { items, total };
}

export async function createCar(body: CreateCarBody): Promise<CarEntity> {
  const res = await fetch(`${BASE}/garage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as CarEntity;
}

export async function updateCar(
  id: number,
  body: UpdateCarBody
): Promise<CarEntity> {
  const res = await fetch(`${BASE}/garage/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as CarEntity;
}

export async function deleteCar(id: number): Promise<void> {
  const res = await fetch(`${BASE}/garage/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
}
