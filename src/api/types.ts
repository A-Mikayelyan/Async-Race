// src/api/types.ts

// ===== Sorting =====
export type SortOrder = "ASC" | "DESC";
export type SortKey = "wins" | "time" | "id" | "name";

// ===== Winners =====
export type Winner = {
  /** Car id (also used as winner id in json-server) */
  id: number;
  wins: number;
  /** Best time in seconds (lower is better) */
  time: number;
};

export type WinnerView = {
  /** Car id */
  id: number;
  wins: number;
  time: number;
  /** Joined from garage */
  name: string;
  color: string;
};

// ===== Cars / Garage =====
export type CarEntity = {
  id: number;
  name: string;
  color: string;
};

/**
 * Some files may import `Car` instead of `CarEntity`.
 * Export it as an alias so both work.
 */
export type Car = CarEntity;

// ===== Pagination helpers =====
/** Generic server response for paginated lists */
export type Paginated<T> = {
  items: T[];
  total: number; // X-Total-Count from json-server
};

/** Common query params you might pass to list endpoints */
export type PaginatedQuery = {
  page: number;   // 1-based
  limit: number;
  sort?: string;
  order?: SortOrder;
};
