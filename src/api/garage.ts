import { apiGet, apiPost } from './http';
import type { CarEntity, Paginated, Car } from './types';

export async function getCars(page = 1, limit = 7): Promise<Paginated<CarEntity>> {
  
  const items = await apiGet<CarEntity[]>('/garage', { _page: page, _limit: limit });
  
  const res = await fetch((import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:3000') + '/garage?_page=1&_limit=1');
  const total = Number(res.headers.get('X-Total-Count') ?? items.length);
  return { items, total };
}

export function createCar(data: Car): Promise<CarEntity> {
    return apiPost<CarEntity>('/garage', data)
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const base = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:3000';
  const res = await fetch(base + path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;


}
export function updateCar(id: number, data: Car): Promise<CarEntity> {
  return apiPatch<CarEntity>(`/garage/${id}`, data);
}

export async function deleteCar(id: number): Promise<void> {
  const base = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:3000';
  const res = await fetch(`${base}/garage/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
}

