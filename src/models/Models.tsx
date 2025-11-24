// models.ts

export interface CarRequestModel {
  make: string;
  model: string;
  color: string;
  year: number;
  vin: string;
  registrationNumber: string;
  price: number;
  ownerId: number;
}

export interface OwnerSummary {
  id: number;
  firstname: string;
  lastname: string;
  // extend if needed
}

export interface CarResponseModel {
  id: number;
  model: string;
  brand: string;
  color: string;
  registrationNumber: string;
  modelYear: number;
  price: number;
  vin: string;
  owner: OwnerSummary | null;
}

// ---------- Owners ----------

export interface OwnerRequestModel {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  username: string;
  password: string;
}

export interface OwnerResponseModel {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}