
import type { Property } from "./property.types";
import type { PopulatedUserLite } from "./inquiry.types";

// =====================================================
// ENUMS
// =====================================================

export type SaleOfferStatus =
  | "pending"
  | "countered"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "expired";

export type SaleOfferAction = "accept" | "reject" | "counter";

export type OfferActorModel = "User" | "Owner" | "Agent";

// =====================================================
// ENTITY
// =====================================================

export interface CounterOffer {
  _id: string;
  offeredBy: string;
  offeredByModel: OfferActorModel;
  amount: number;
  message: string;
  createdAt: string;
}

export interface SaleOffer {
  _id: string;
  property: Property | string;
  buyer: PopulatedUserLite | string;
  owner: PopulatedUserLite | string;
  agent: PopulatedUserLite | string | null;
  offerPrice: number;
  currentOfferPrice: number;
  status: SaleOfferStatus;
  message: string;
  offerHistory: CounterOffer[];
  respondedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// =====================================================
// PAYLOADS
// =====================================================

export interface CreateSaleOfferData {
  propertyId: string;
  offerPrice: number;
  message?: string;
}

export interface RespondToSaleOfferData {
  id: string;
  action: SaleOfferAction;
  counterOfferPrice?: number;
  message?: string;
}

// =====================================================
// RESPONSES
// =====================================================

export interface GetSaleOffersResponse {
  success: boolean;
  message?: string;
  count?: number;
  data: SaleOffer[];
}

export interface GetSaleOfferResponse {
  success: boolean;
  message?: string;
  data: SaleOffer;
}

export interface SaleOfferMutationResponse {
  success: boolean;
  message: string;
  data?: SaleOffer;
}

export interface DeleteSaleOfferResponse {
  success: boolean;
  message: string;
}

// =====================================================
// STATE
// =====================================================

export interface SaleOfferState {
  saleOffers: SaleOffer[];
  saleOffer: SaleOffer | null;
  loading: boolean;
  error: string | null;
}

// =====================================================
// FORM VALUES
// =====================================================

export interface SaleOfferFormValues {
  offerPrice: number;
  message: string;
}

export interface RespondSaleOfferFormValues {
  action: SaleOfferAction;
  counterOfferPrice?: number;
  message: string;
}