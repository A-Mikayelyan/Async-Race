import React from "react";
import { getWinners } from "../api/winners";
import type { WinnerView, SortKey, SortOrder } from "../api/types";
import CarIcon from "../assets/car.svg";
import "../styles/winners.css";

const PAGE_SIZE = 10;
const SORTABLE: SortKey[] = ["wins", "time", "name", "id"];

function useWinners() {
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState<SortKey>("time");
  const [order, setOrder] = React.useState<SortOrder>("ASC");
  const [rows, setRows] = React.useState<WinnerView[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<null | string>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { items, total } = await getWinners({
        page,
        limit: PAGE_SIZE,
        sort,
        order,
      });
      setRows(items);
      setTotal(total);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load winners");
    } finally {
      setLoading(false);
    }
  }, [page, sort, order]);

  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    page,
    setPage,
    sort,
    setSort,
    order,
    setOrder,
    rows,
    total,
    loading,
    error,
  };
}

function sortIndicator(active: boolean, order: SortOrder) {
  if (!active) return null;
  return <span className="ml-2">{order === "ASC" ? "▲" : "▼"}</span>;
}

function formatTime(t: number) {
  return t.toFixed(2);
}

export default function WinnersPage() {
  const {
    page,
    setPage,
    sort,
    setSort,
    order,
    setOrder,
    rows,
    total,
    loading,
    error,
  } = useWinners();

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canPrev = page > 1;
  const canNext = page < pageCount;

  function onSort(next: SortKey) {
    if (!SORTABLE.includes(next)) return;
    if (sort === next) {
      setOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSort(next);
      setOrder(next === "time" ? "ASC" : "DESC");
    }
  }

  return (
    <div className="winners-screen">
      <header className="screen-title">WINNERS</header>

      <div className="table-wrap neon-border">
        <table className="winners-table">
          <colgroup>
            <col />
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th
                onClick={() => onSort("id")}
                role="button"
                aria-label="Sort by number"
              >
                № {sortIndicator(sort === "id", order)}
              </th>
              <th>CAR</th>
              <th
                onClick={() => onSort("name")}
                role="button"
                aria-label="Sort by name"
              >
                NAME {sortIndicator(sort === "name", order)}
              </th>
              <th
                onClick={() => onSort("wins")}
                role="button"
                aria-label="Sort by wins"
              >
                WINS {sortIndicator(sort === "wins", order)}
              </th>
              <th
                onClick={() => onSort("time")}
                role="button"
                aria-label="Sort by best time"
              >
                BEST TIME (SECONDS) {sortIndicator(sort === "time", order)}
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="muted">
                  Loading…
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={5} className="error">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  No winners yet — run a race!
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              rows.map((r) => (
                <tr key={r.id}>
                  <td className="num">{r.id}</td>
                  <td className="car">
                    <img
                      src={CarIcon}
                      alt=""
                      style={{ filter: `drop-shadow(0 0 6px ${r.color})` }}
                    />
                  </td>
                  <td className="name">{r.name}</td>
                  <td className="wins">{r.wins}</td>
                  <td className="time">{formatTime(r.time)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* <footer className="pager">
        <button
          className="nav"
          disabled={!canPrev}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          ◀
        </button>
        <span className="page-label">PAGE #{page}</span>
        <button
          className="nav"
          disabled={!canNext}
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
        >
          ▶
        </button>
      </footer> */}
    </div>
  );
}
