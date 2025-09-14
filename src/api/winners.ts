export async function deleteWinner(id: number): Promise<void> {
  const base = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:3000';
  const res = await fetch(`${base}/winners/${id}`, { method: 'DELETE' });
  // ignore 404 (car might not be a winner yet)
  if (!res.ok && res.status !== 404) throw new Error(`${res.status} ${res.statusText}`);
}
