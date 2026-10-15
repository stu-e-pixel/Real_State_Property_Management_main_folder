import type { Property } from "./property.types";
import type { PopulatedUserLite } from "./inquiry.types";
import type { RentalApplication } from "./rental.types";



export type LeaseStatus = "active" | "expired" | "terminated";



export interface AgreementDocument {
  url: string;
  public_id: string;
}



export interface Lease {
  _id: string;
  property: Property | string;
  tenant: PopulatedUserLite | string;
  owner: PopulatedUserLite | string;
  agent: PopulatedUserLite | string | null;
  rentalApplication: RentalApplication | string | null;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  agreementDocument: AgreementDocument | string | null;
  status: LeaseStatus;
  terminationReason?: string;
  createdAt: string;
  updatedAt: string;
}



export interface AggregatedLease {
  _id: string;
  propertyData: Property;
  tenantData: PopulatedUserLite;
  ownerData: PopulatedUserLite;
  agentData?: PopulatedUserLite | null;
  rentalApplication: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  agreementDocument: AgreementDocument | string | null;
  status: LeaseStatus;
  terminationReason?: string;
  createdAt: string;
  updatedAt: string;
}



export interface CreateLeaseData {
  rentalApplication: string;
  startDate: string; // ISO
  endDate: string; // ISO
  monthlyRent: number;
  securityDeposit?: number;
  agreementDocument?: string;
}

export interface UpdateLeaseData {
  id: string;
  startDate?: string;
  endDate?: string;
  monthlyRent?: number;
  securityDeposit?: number;
  agreementDocument?: string;
}

export interface TerminateLeaseData {
  id: string;
  terminationReason: string;
}

export interface ExpireLeaseData {
  id: string;
}



export interface GetLeasesResponse {
  success: boolean;
  message?: string;
  count?: number;
  data: Lease[];
}

export interface GetAggregatedLeasesResponse {
  success: boolean;
  message?: string;
  count?: number;
  data: AggregatedLease[];
}

export interface GetLeaseResponse {
  success: boolean;
  message?: string;
  data: Lease;
}

export interface LeaseMutationResponse {
  success: boolean;
  message: string;
  data?: Lease;
  lease?: Lease;
}

export interface DeleteLeaseResponse {
  success?: boolean;
  status?: boolean;
  message: string;
}



export interface LeaseState {
  leases: Lease[];
  aggregatedLeases: AggregatedLease[];
  lease: Lease | null;
  loading: boolean;
  error: string | null;
}



export interface LeaseFormValues {
  rentalApplication: string;
  startDate: string; // yyyy-MM-ddTHH:mm for datetime-local
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  agreementDocument: string;
}

export interface UpdateLeaseFormValues {
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  agreementDocument: string;
}

export interface TerminateLeaseFormValues {
  terminationReason: string;
}