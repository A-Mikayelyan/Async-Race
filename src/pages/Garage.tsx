import React from "react";
import { getCars, updateCar, createCar } from "../api/garage";
import type { CarEntity } from "../api/types";
import { deleteCar } from "../api/garage";
import { deleteWinner } from "../api/winners";

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
  const [newName, setNewName] = React.useState("");
  const [newColor, setNewColor] = React.useState("#808080");
  const [creating, setCreating] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const nameValid = newName.trim().length >= 1 && newName.trim().length <= 20;

  const [cars, setCars] = React.useState<CarEntity[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCar, setSelectedCar] = React.useState<CarEntity | null>(null);

  const editMode = selectedCar !== null;

  const clearSelection = () => {
    setSelectedCar(null);
    setNewName("");
    setNewColor("#808080");
  };

  const onUpdate = async () => {
    if (!selectedCar) return;
    if (!nameValid) {
      alert("Name must be 1-20 characters!");
      return;
    }

    try {
      setUpdating(true);
      await updateCar(selectedCar.id, {
        name: newName.trim(),
        color: newColor,
      });
      await load(page);
      clearSelection();
    } catch (e) {
      alert(`Update failed: ${(e as Error).message}`);
    } finally {
      setUpdating(false);
    }
  };

  async function load(page: number) {
    try {
      setLoading(true);
      setError(null);
      const { items, total: t } = await getCars(page, LIMIT);
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

  async function onCreate() {
    if (!nameValid) {
      alert("Name must be 1-20 characters!");
      return;
    }
    try {
      setCreating(true);
      await createCar({ name: newName.trim(), color: newColor });
      setNewName("");
      await load(page);
    } catch (e) {
      alert(`Create failed: ${(e as Error).message}`);
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this car?")) return;

    try {
      setDeletingId(id);
      await deleteCar(id);
      await deleteWinner(id);

      if (selectedCar?.id === id) clearSelection();

      await load(page);
    } catch (e) {
      alert(`Deleting failed: ${(e as Error).message}`);
    } finally {
      setDeletingId(null);
    }
  }

  const randomColor = (): string => {
    return (
      "#" +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")
    );
  };

  const randomName = (): string => {
    const brands = BRANDS[Math.floor(Math.random() * BRANDS.length)];
    const models = MODELS[Math.floor(Math.random() * MODELS.length)];
    return `${brands} ${models}`;
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

      if (selectedCar) clearSelection;

      const carsToCreate = makeRandomCars(100);
      const eachStep = 5;

      for (let i = 0; i < carsToCreate.length; i += eachStep) {
        const step = carsToCreate.slice(i, i + eachStep);
        await Promise.allSettled(step.map((c) => createCar(c)));
      }

      await load(page);
    } catch (e) {
      alert(`Generation failed: ${(e as Error).message}`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="garage-container">
      <h1>Garage ({total})</h1>

      <div className="create-form">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Car name"
          maxLength={20}
          className="create-input"
        />
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          title={newColor}
          className="color-picker"
        />

        {!editMode && (
          <button
            type="button"
            onClick={onCreate}
            disabled={!nameValid || creating}
            className="create-button"
          >
            {creating ? "Creating…" : "Create"}
          </button>
        )}

        {editMode && (
          <>
            <button
              type="button"
              disabled={!nameValid || updating}
              className="update-button"
              title="Update (to be implemented next)"
              onClick={onUpdate}
            >
              Update
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="cancel-button"
              disabled={updating}
            >
              Cancel
            </button>
          </>
        )}

        <button
          className="generate-random"
          disabled={generating || creating || updating || loading}
          onClick={onGenerate100}
        >
          {generating ? "Generating" : "Generate 100"}
        </button>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      <div className="pagination-controls">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={loading || page === 1}
        >
          Prev
        </button>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={loading || page === totalPages}
        >
          Next
        </button>
      </div>

      <ul className="car-list">
        {cars.map((car) => {
          const isSelected = selectedCar?.id === car.id;
          return (
            <li key={car.id} className="car-item">
              <div
                className="car-color"
                style={{ backgroundColor: car.color }}
              />
              <strong>#{car.id}</strong> {car.name}
              <button
                className={`select-button${isSelected ? " is-selected" : ""}`}
                disabled={isSelected}
                onClick={() => {
                  setSelectedCar(car);
                  setNewName(car.name);
                  setNewColor(car.color);
                }}
              >
                {isSelected ? "Selected" : "Select"}
              </button>
              <button
                className="delete-button"
                onClick={() => onDelete(car.id)}
                disabled={deletingId === car.id || updating}
              >
                {deletingId === car.id ? "Deleting…" : "Delete"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
