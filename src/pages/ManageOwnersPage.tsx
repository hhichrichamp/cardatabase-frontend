import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../services/api";
import type {  OwnerRequestModel, OwnerResponseModel } from "../models/Models";

type Mode = "create" | "edit";

const emptyOwner: OwnerRequestModel = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  username: "",
  password: "",
};

export function ManageOwnersPage() {
  const [owners, setOwners] = useState<OwnerResponseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formMode, setFormMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<OwnerRequestModel>(emptyOwner);

  useEffect(() => {
    loadOwners();
  }, []);

  async function loadOwners() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet("/owners");
      setOwners(data as OwnerResponseModel[]);
    } catch (err) {
      console.error(err);
      setError("Failed to load owners.");
    } finally {
      setLoading(false);
    }
  }

  // same pattern as ManageCarsPage: no React event types
  function handleChange(e: any) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    saveOwner().catch((err) => {
      console.error(err);
      setError("Failed to save owner.");
    });
  }

  async function saveOwner() {
    setError(null);

    if (formMode === "create") {
      const created = await apiPost("/owners", formData);
      setOwners((prev) => [...prev, created as OwnerResponseModel]);
    } else if (formMode === "edit" && editingId != null) {
      const updated = await apiPut(`/owners/${editingId}`, formData);
      setOwners((prev) =>
        prev.map((o) => (o.id === editingId ? (updated as OwnerResponseModel) : o))
      );
    }

    resetForm();
  }

  function resetForm() {
    setFormData(emptyOwner);
    setFormMode("create");
    setEditingId(null);
  }

  function handleEdit(owner: OwnerResponseModel) {
    setFormMode("edit");
    setEditingId(owner.id);

    // username/password are not returned in OwnerResponseModel; keep them empty
    setFormData({
      firstname: owner.firstname,
      lastname: owner.lastname,
      email: owner.email,
      phone: owner.phone,
      username: "",
      password: "",
    });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this owner?")) return;

    try {
      setError(null);
      await apiDelete(`/owners/${id}`);
      setOwners((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete owner.");
    }
  }

  return (
    <section>
      <h2>Manage Owners</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading owners...</p>}

      {/* Owners list */}
      <table className="owners-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.id}>
              <td data-label="ID">{owner.id}</td>
              <td data-label="Firstname">{owner.firstname}</td>
              <td data-label="Lastname">{owner.lastname}</td>
              <td data-label="Email">{owner.email}</td>
              <td data-label="Phone">{owner.phone}</td>
              <td data-label="Actions">
                <button onClick={() => handleEdit(owner)}>Edit</button>
                <button onClick={() => handleDelete(owner.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {owners.length === 0 && !loading && (
            <tr>
              <td colSpan={6}>No owners found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Form */}
      <h3>{formMode === "create" ? "Add New Owner" : "Edit Owner"}</h3>

      <form onSubmit={handleSubmit} className="owner-form">
        <div>
          <label>
            Firstname:
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Lastname:
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Phone:
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required={formMode === "create"}
            />
          </label>
        </div>

        <div>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={formMode === "create"}
            />
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