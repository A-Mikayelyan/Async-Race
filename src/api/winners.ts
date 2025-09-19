const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:3000";

export type SortOrder = "ASC" | "DESC";
export type SortKey = "wins" | "time" | "id" | "name";

export type Winner = { id: number; wins: number; time: number };
export type CarEntity = { id: number; name: string; color: string };

export type WinnerView = {
  id: number;
  wins: number;
  time: number;
  name: string;
  color: string;
};

const WINNERS = `${API}/winners`;
const CARS = `${API}/garage`;

export async function getWinners(params: {
  page: number;
  limit: number;
  sort: SortKey;
  order: SortOrder;
}): Promise<{ items: WinnerView[]; total: number }> {
  const { page, limit, sort, order } = params;

  const url = new URL(WINNERS);
  url.searchParams.set("_page", String(page));
  url.searchParams.set("_limit", String(limit));

  url.searchParams.set("_sort", sort === "name" ? "id" : sort);
  url.searchParams.set("_order", order);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`winners LIST failed (${res.status})`);
  const total = Number(res.headers.get("X-Total-Count") ?? "0");
  const winners = (await res.json()) as Winner[];

  if (winners.length === 0) return { items: [], total };

  const carsUrl = new URL(CARS);
  winners.forEach((w) => carsUrl.searchParams.append("id", String(w.id)));
  const carsRes = await fetch(carsUrl.toString());
  if (!carsRes.ok) throw new Error(`cars fetch failed (${carsRes.status})`);
  const cars = (await carsRes.json()) as CarEntity[];
  const byId = new Map(cars.map((c) => [c.id, c]));

  let items: WinnerView[] = winners.map((w) => {
    const car = byId.get(w.id);
    return {
      id: w.id,
      wins: w.wins,
      time: w.time,
      name: car?.name ?? "Unknown",
      color: car?.color ?? "#cccccc",
    };
  });

  if (sort === "name") {
    items = items.sort((a, b) =>
      order === "ASC"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }

  return { items, total };
}

export async function upsertWinner(id: number, time: number): Promise<void> {
  const res = await fetch(`${WINNERS}/${id}`);
  if (res.ok) {
    const cur = (await res.json()) as Winner;
    const next: Winner = {
      id,
      wins: cur.wins + 1,
      time: Math.min(cur.time, time),
    };
    const put = await fetch(`${WINNERS}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (!put.ok) throw new Error(`winners PUT failed (${put.status})`);
    return;
  }
  if (res.status === 404) {
    const newbie: Winner = { id, wins: 1, time };
    const post = await fetch(WINNERS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newbie),
    });
    if (!post.ok) throw new Error(`winners POST failed (${post.status})`);
    return;
  }
  throw new Error(`winners GET failed (${res.status})`);
}

export async function deleteWinner(id: number): Promise<void> {
  const res = await fetch(`${WINNERS}/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 404) {
    throw new Error(`winners DELETE failed (${res.status})`);
  }
}
