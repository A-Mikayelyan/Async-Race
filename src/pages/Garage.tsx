import React from "react";
import { getCars, updateCar, createCar, deleteCar } from "../api/garage";
import type { CarEntity } from "../api/types";
import CarRow from "../components/CarRow";
import { upsertWinner, deleteWinner } from "../api/winners";
import WinnerOverlay from "../components/WinnerMessage";

const LIMIT = 7;

const BRANDS = [
  "Tesla",
  "Ford",
  "BMW",
  "Audi",
  "Toyota",
  "Honda",
  "Volvo",
  "Kia",
  "Hyundai",
  "Nissan",
  "Chevy",
  "Porsche",
  "Lexus",
  "Mazda",
  "Jaguar",
];

const MODELS = [
  "Falcon",
  "Edge",
  "Prime",
  "Bolt",
  "Roadster",
  "Neo",
  "Vector",
  "Aero",
  "Pulse",
  "Nimbus",
  "Zen",
  "Orbit",
  "Vibe",
  "Nova",
  "Flux",
];

export default function Garage() {
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const [generating, setGenerating] = React.useState(false);

  const [createName, setCreateName] = React.useState("");
  const [createColor, setCreateColor] = React.useState("#808080");

  const [editName, setEditName] = React.useState("");
  const [editColor, setEditColor] = React.useState("#808080");

  const [creating, setCreating] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const [cars, setCars] = React.useState<CarEntity[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCar, setSelectedCar] = React.useState<CarEntity | null>(null);

  const [overlay, setOverlay] = React.useState<{
    name: string;
    seconds: number;
  } | null>(null);
  const [racing, setRacing] = React.useState(false);

  const startFnsRef = React.useRef<
    Record<number, () => Promise<number | void>>
  >({});
  const stopFnsRef = React.useRef<Record<number, () => Promise<void>>>({});

  const clearSelection = () => {
    setSelectedCar(null);
    setEditName("");
    setEditColor("#808080");
  };

  async function load(p: number) {
    try {
      setLoading(true);
      setError(null);
      const { items, total: t } = await getCars(p, LIMIT);
      setCars(items);
      setTotal(t);
      setTotalPages(Math.max(1, Math.ceil(t / LIMIT)));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load(page);
  }, [page]);

  const nameValid =
    createName.trim().length >= 1 && createName.trim().length <= 20;
  const editValid = editName.trim().length >= 1 && editName.trim().length <= 20;

  async function onCreate() {
    if (!nameValid) {
      alert("Name must be 1-20 characters!");
      return;
    }
    try {
      setCreating(true);
      await createCar({ name: createName.trim(), color: createColor });
      setCreateName("");
      await load(page);
    } catch (e) {
      alert(`Create failed: ${(e as Error).message}`);
    } finally {
      setCreating(false);
    }
  }

  const onUpdate = async () => {
    if (!selectedCar) return;
    if (!editValid) {
      alert("Name must be 1-20 characters!");
      return;
    }
    try {
      setUpdating(true);
      await updateCar(selectedCar.id, {
        name: editName.trim(),
        color: editColor,
      });
      await load(page);
      clearSelection();
    } catch (e) {
      alert(`Update failed: ${(e as Error).message}`);
    } finally {
      setUpdating(false);
    }
  };

  async function onDelete(id: number) {
    if (racing) return;
    if (!confirm("Delete this car?")) return;
    try {
      setDeletingId(id);
      await deleteCar(id);
      try {
        await deleteWinner(id);
      } catch {}
      if (selectedCar?.id === id) clearSelection();
      await load(page);
    } catch (e) {
      alert(`Deleting failed: ${(e as Error).message}`);
    } finally {
      setDeletingId(null);
    }
  }

  const randomColor = (): string =>
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0");

  const randomName = (): string => {
    const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
    const model = MODELS[Math.floor(Math.random() * MODELS.length)];
    return `${brand} ${model}`;
  };

  function makeRandomCars(n: number): { name: string; color: string }[] {
    return Array.from({ length: n }, () => ({
      name: randomName(),
      color: randomColor(),
    }));
  }

  async function onGenerate100() {
    try {
      setGenerating(true);
      if (selectedCar) clearSelection();
      const carsToCreate = makeRandomCars(100);
      const chunkSize = 5;
      for (let i = 0; i < carsToCreate.length; i += chunkSize) {
        const chunk = carsToCreate.slice(i, i + chunkSize);
        await Promise.allSettled(chunk.map((c) => createCar(c)));
      }
      await load(page);
    } catch (e) {
      alert(`Generation failed: ${(e as Error).message}`);
    } finally {
      setGenerating(false);
    }
  }

  async function onRaceAll() {
    if (racing || cars.length === 0) return;
    setRacing(true);
    setOverlay(null);

    const ids = cars.map((c) => c.id);
    let resolved = false;
    let remaining = ids.length;

    await new Promise<void>((resolve) => {
      ids.forEach((id) => {
        const start = startFnsRef.current[id];
        if (!start) {
          if (--remaining === 0 && !resolved) resolve();
          return;
        }

        start()
          .then((t) => {
            if (!resolved && typeof t === "number") {
              resolved = true;
              const carEntity = cars.find((c) => c.id === id);
              const seconds = t / 1000;
              upsertWinner(id, +seconds.toFixed(2)).catch(() => {});
              setOverlay({ name: carEntity?.name ?? `#${id}`, seconds });
              resolve();
            }
          })
          .catch(() => {})
          .finally(() => {
            if (--remaining === 0 && !resolved) resolve();
          });
      });
    });

    setRacing(false);
  }

  async function onResetAll() {
    const ids = Object.keys(stopFnsRef.current).map(Number);
    await Promise.allSettled(ids.map((id) => stopFnsRef.current[id]?.()));
    setOverlay(null);
    setRacing(false);
  }

  const isGarageEmpty = !loading && !error && total === 0;

  return (
    <div className="garage-container">
      <div
        className="controls-row"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          margin: "10px 0 6px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="btn-race"
            onClick={onRaceAll}
            disabled={racing || cars.length === 0}
          >
            Race
          </button>
          <button
            className="btn-reset"
            onClick={onResetAll}
            disabled={cars.length === 0}
          >
            Reset
          </button>
        </div>

        <div
          className="pod pod-create"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 280,
          }}
        >
          <input
            type="text"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder="Type car brand"
            maxLength={20}
            className="create-input"
            style={{ flex: "1 1 200px" }}
            disabled={racing}
          />
          <input
            type="color"
            value={createColor}
            onChange={(e) => setCreateColor(e.target.value)}
            title={createColor}
            className="color-picker"
            disabled={racing}
          />
          <button
            className="create-button"
            onClick={onCreate}
            disabled={racing || creating || !nameValid}
          >
            Create
          </button>
        </div>

        <div
          className="pod pod-update"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 280,
            opacity: selectedCar ? 1 : 0.6,
          }}
          title={selectedCar ? "" : "Select a car to enable update"}
        >
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Type car brand"
            maxLength={20}
            className="create-input"
            style={{ flex: "1 1 200px" }}
            disabled={racing || !selectedCar}
          />
          <input
            type="color"
            value={editColor}
            onChange={(e) => setEditColor(e.target.value)}
            title={editColor}
            className="color-picker"
            disabled={racing || !selectedCar}
          />
          <button
            className="update-button"
            onClick={onUpdate}
            disabled={racing || !selectedCar || updating || !editValid}
          >
            Update
          </button>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            className="generate-random"
            disabled={racing || generating || creating || updating || loading}
            onClick={onGenerate100}
          >
            Generate Cars
          </button>

          <div
            className="pagination-controls compact"
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={racing || loading || page === 1}
            >
              Prev
            </button>
            <span style={{ minWidth: 90, textAlign: "center" }}>
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={racing || loading || page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      <section aria-label="Cars" style={{ marginTop: 8 }}>
        {isGarageEmpty && (
          <div
            role="status"
            aria-live="polite"
            className="empty-garage"
            style={{
              border: "2px dashed var(--line)",
              borderRadius: 12,
              padding: "18px 20px",
              textAlign: "center",
              color: "var(--muted)",
              boxShadow: "0 0 12px rgba(255,77,210,.18)",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                letterSpacing: ".08em",
                marginBottom: 6,
              }}
            >
              No cars in the garage
            </div>
            <div>
              Create one above or click <strong>Generate Cars</strong>.
            </div>
          </div>
        )}

        {!isGarageEmpty &&
          cars.map((car) => {
            const isSelected = selectedCar?.id === car.id;
            return (
              <CarRow
                key={car.id}
                car={{ id: car.id, name: car.name, color: car.color }}
                isSelected={isSelected}
                isUpdating={updating}
                isDeleting={deletingId === car.id}
                onSelect={() => {
                  if (racing) return;
                  setSelectedCar(car);
                  setEditName(car.name);
                  setEditColor(car.color);
                }}
                onDelete={() => onDelete(car.id)}
                onRegister={(id, fns) => {
                  startFnsRef.current[id] = fns.start;
                  stopFnsRef.current[id] = fns.stop;
                }}
                onUnregister={(id) => {
                  delete startFnsRef.current[id];
                  delete stopFnsRef.current[id];
                }}
                disabled={racing}
                raceLock={racing}
              />
            );
          })}
      </section>

      <WinnerOverlay
        open={!!overlay}
        name={overlay?.name ?? ""}
        seconds={overlay?.seconds ?? 0}
        onClose={() => setOverlay(null)}
      />
    </div>
  );
}
