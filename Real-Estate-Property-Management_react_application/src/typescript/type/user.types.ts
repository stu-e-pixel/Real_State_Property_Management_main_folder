/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { UserPagination, Filters } from "./api.types";
import type { User } from "./auth.types";
export type AccountStatus = "active" | "inactive" | "blocked";
export interface Customer extends User {}

export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  count: number;
  data: Customer[];
  pagination: UserPagination;
  filters: Filters;
}

export interface GetUserResponse extends ApiResponse<Customer> {}

export interface UpdateUserStatusResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    status: AccountStatus;
  };
}

export interface UserState {
  users: Customer[];
  user: Customer | null;
  profile: Customer | null;
  pagination: UserPagination | null;
  loading: boolean;
  error: string | null;
}

export interface UpdateUserStatusPayload {
  id: string;
  status: AccountStatus;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}