/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { OwnerPagination, Filters } from "./api.types";
export type AccountStatus = "active" | "inactive" | "blocked";

export interface OwnerAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface Owner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: OwnerAddress;
  status: AccountStatus;
  image?: string | null;
}

export interface OwnerRegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;

  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };

  image?: File[];
}
export interface UpdateOwnerProfileData {
  name?: string;
  phone?: string;
  address?: string;
  image?: FileList | File[];
}

export interface GetAllOwnersResponse {
  success: boolean;
  message: string;
  pagination: OwnerPagination;
  filters: Filters;
  owners: Owner[];
}

export interface GetOwnerResponse {
  success: boolean;
  owner: Owner;
}

export interface UpdateOwnerStatusResponse {
  success: boolean;
  message: string;
  status: AccountStatus;
}

export interface OwnerState {
  owners: Owner[];
  owner: Owner | null;
  profile: Owner | null;
  pagination: OwnerPagination | null;
  loading: boolean;
  error: string | null;
}

export interface OwnerRegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;

  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
}

export type UpdateOwnerProfileFormValues = {
  name?: string;
  phone?: string;
  address?: string;
};

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}


