
import type { Property } from "./property.types";
import type { PopulatedUserLite } from "./inquiry.types";
import type { SaleOffer } from "./saleOffer.types";



export type PaymentStatus = "unpaid" | "partial" | "paid";

export type TransactionStatus =
  | "initiated"
  | "agreement_signed"
  | "payment_pending"
  | "completed"
  | "cancelled";



export interface SaleTransaction {
  _id: string;
  property: Property | string;
  offer: SaleOffer | string;
  buyer: PopulatedUserLite | string;
  owner: PopulatedUserLite | string;
  agent: PopulatedUserLite | string | null;
  agreedPrice: number;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  transactionStatus: TransactionStatus;
  agreementDate?: string | null;
  completedAt?: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
  propertyDetails?: Property;
  buyerDetails?: PopulatedUserLite;
  ownerDetails?: PopulatedUserLite;
  agentDetails?: PopulatedUserLite | null;
  offerDetails?: SaleOffer | null;
}



export interface CreateSaleTransactionData {
  offerId: string;
  notes?: string;
}

export interface UpdateSaleTransactionData {
  id: string;
  transactionStatus?: TransactionStatus;
  paymentStatus?: PaymentStatus;
  amountPaid?: number;
  notes?: string;
}



export interface GetSaleTransactionsResponse {
  success: boolean;
  message?: string;
  count?: number;
  data: SaleTransaction[];
}

export interface GetSaleTransactionResponse {
  success: boolean;
  message?: string;
  data: SaleTransaction;
}

export interface SaleTransactionMutationResponse {
  success: boolean;
  message: string;
  data?: SaleTransaction;
}



export interface SaleTransactionState {
  transactions: SaleTransaction[];
  transaction: SaleTransaction | null;
  loading: boolean;
  error: string | null;
}



export interface UpdateTransactionFormValues {
  transactionStatus: TransactionStatus;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  notes: string;
}