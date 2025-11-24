import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../services/api";
import type { CarRequestModel, CarResponseModel, OwnerResponseModel } from "../models/Models";


type Mode = "create" | "edit";

const emptyCar: CarRequestModel = {
  make: "",
  model: "",
  color: "",
  year: new Date().getFullYear(),
  vin: "",
  registrationNumber: "",
  price: 0,
  ownerId: 0,
};

export function ManageCarsPage() {
  const [cars, setCars] = useState<CarResponseModel[]>([]);
  const [owners, setOwners] = useState<OwnerResponseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formMode, setFormMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CarRequestModel>(emptyCar);

  useEffect(() => {
    loadCars();
    loadOwners();
  }, []);

  async function loadCars() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet("/cars");
      setCars(data as CarResponseModel[]);
    } catch (err) {
      console.error(err);
      setError("Failed to load cars.");
    } finally {
      setLoading(false);
    }
  }

  async function loadOwners() {
    try {
      const data = await apiGet("/owners");
      setOwners(data as OwnerResponseModel[]);
    } catch (err) {
      console.error(err);
      setError("Failed to load owners.");
    }
  }

  // Type as 'any' to avoid JSX runtime conflicts
  function handleChange(e: any) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "ownerId"
          ? Number(value)
          : name === "price"
          ? Number(value)
          : value,
    }));
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    saveCar().catch((err) => {
      console.error(err);
      setError("Failed to save car.");
    });
  }

  async function saveCar() {
    setError(null);

    if (formMode === "create") {
      const created = await apiPost("/cars", formData);
      setCars((prev) => [...prev, created as CarResponseModel]);
    } else if (formMode === "edit" && editingId != null) {
      const updated = await apiPut(`/cars/${editingId}`, formData);
      setCars((prev) =>
        prev.map((c) => (c.id === editingId ? (updated as CarResponseModel) : c))
      );
    }

    resetForm();
  }

  function resetForm() {
    setFormData(emptyCar);
    setFormMode("create");
    setEditingId(null);
  }

  function handleEdit(car: CarResponseModel) {
    setFormMode("edit");
    setEditingId(car.id);

    setFormData({
      make: car.brand,
      model: car.model,
      color: car.color,
      year: car.modelYear,
      vin: car.vin,
      registrationNumber: car.registrationNumber,
      price: car.price,
      ownerId: car.owner?.id ?? 0,
    });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      setError(null);
      await apiDelete(`/cars/${id}`);
      setCars((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete car.");
    }
  }

  return (
    <section>
      <h2>Manage Cars</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading cars...</p>}

      {/* Cars list */}
      <table className="cars-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand / Make</th>
            <th>Model</th>
            <th>Color</th>
            <th>Year</th>
            <th>VIN</th>
            <th>Reg #</th>
            <th>Price</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td data-label="ID">{car.id}</td>
              <td data-label="Brand / Make">{car.brand}</td>
              <td data-label="Model">{car.model}</td>
              <td data-label="Color">{car.color}</td>
              <td data-label="Year">{car.modelYear}</td>
              <td data-label="VIN">{car.vin}</td>
              <td data-label="Reg #">{car.registrationNumber}</td>
              <td data-label="Price">${car.price.toFixed(2)}</td>
              <td data-label="Owner">
                {car.owner
                  ? `${car.owner.firstname} ${car.owner.lastname}`
                  : "N/A"}
              </td>
              <td data-label="Actions">
                <button onClick={() => handleEdit(car)}>Edit</button>
                <button onClick={() => handleDelete(car.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {cars.length === 0 && !loading && (
            <tr>
              <td colSpan={10}>No cars found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Form */}
      <h3>{formMode === "create" ? "Add New Car" : "Edit Car"}</h3>

      <form onSubmit={handleSubmit} className="car-form">
        <div>
          <label>
            Make/Brand:
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Model:
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Color:
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Year:
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            VIN:
            <input
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Registration #:
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={formData.price}
              step="0.01"
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Owner:
            <select
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              required
            >
              <option value={0}>-- Select Owner --</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.firstname} {owner.lastname}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <button type="submit">
            {formMode === "create" ? "Create" : "Update"}
          </button>
          {formMode === "edit" && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}