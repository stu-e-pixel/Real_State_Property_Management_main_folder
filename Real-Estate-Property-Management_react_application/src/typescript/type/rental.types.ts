
import type { Property } from "./property.types";



export type RentalApplicationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "withdrawn";

export type RentalApplicationAction = "approve" | "reject";



export interface PopulatedUserLite {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  image?: string;
}



export interface RentalApplication {
  _id: string;
  property: Property | string;
  applicant: PopulatedUserLite | string;
  owner: PopulatedUserLite | string;
  agent: PopulatedUserLite | string | null;
  monthlyIncome: number;
  employmentStatus: string;
  occupation: string;
  documents: string[];
  message: string;
  status: RentalApplicationStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}



export interface CreateRentalApplicationData {
  property: string;
  monthlyIncome?: number;
  employmentStatus?: string;
  occupation?: string;
  documents?: string[] | string;
  message?: string;
}

export interface UpdateRentalApplicationData {
  monthlyIncome?: number;
  employmentStatus?: string;
  occupation?: string;
  documents?: string[] | string;
  message?: string;
}

export interface RentalActionData {
  id: string;
  action: RentalApplicationAction;
  rejectionReason?: string;
}



export interface GetRentalApplicationsResponse {
  success: boolean;
  message?: string;
  count?: number;
  data: RentalApplication[];
}

export interface GetRentalApplicationResponse {
  success: boolean;
  message?: string;
  data: RentalApplication;
}

export interface RentalMutationResponse {
  success: boolean;
  message: string;
  data?: RentalApplication;
}



export interface RentalState {
  applications: RentalApplication[];
  application: RentalApplication | null;
  loading: boolean;
  error: string | null;
}



export interface RentalApplicationFormValues {
  monthlyIncome: number;
  employmentStatus: string;
  occupation: string;
  message: string;
}

export interface RentalActionFormValues {
  rejectionReason: string;
}