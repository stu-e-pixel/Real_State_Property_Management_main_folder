/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { AgentPagination, Filters } from "./api.types";
export type AccountStatus = "active" | "inactive" | "blocked";

interface AgentAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  image?: string | null;

  licenseNumber?: string;
  agencyName?: string;
  experience: number;

  specialization: string[];

  bio?: string;

  address: AgentAddress;

  role: string;
  status: AccountStatus;

  isEmailVerified: boolean;
  isDeleted: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface AgentRegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;

  licenseNumber?: string;
  agencyName?: string;
  experience?: number;

  specialization?: string[];

  bio?: string;

  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };

  image?: File[];
}

export interface UpdateAgentProfileData {
  name?: string;
  phone?: string;
  licenseNumber?: string;
  agencyName?: string;
  experience?: number | string;
  specialization?: string;
  bio?: string;
  address?: string;
  image?: FileList | File[];
}

export interface GetAllAgentsResponse {
  success: boolean;
  message: string;
  pagination: AgentPagination;
  filters: Filters;
  agents: Agent[];
}

export interface GetAgentResponse extends ApiResponse<Agent> {}

export interface UpdateAgentStatusResponse {
  success: boolean;
  message: string;
  status: AccountStatus;
}

export interface AgentState {
  agents: Agent[];
  agent: Agent | null;
  profile: Agent | null;
  pagination: AgentPagination | null;
  loading: boolean;
  error: string | null;
}

export interface AgentRegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;

  licenseNumber?: string;
  agencyName?: string;
  experience: number;

  specialization: string[];

  bio?: string;

  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
}

export type UpdateAgentProfileFormValues = {
  name?: string;
  phone?: string;
  licenseNumber?: string;
  agencyName?: string;
  experience?: number;
  specialization?: string;
  bio?: string;
  address?: string;
};

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}