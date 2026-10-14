import type { Property } from "./property.types";


// =====================================================
// ENUMS
// =====================================================

export type InquiryStatus =
  | "pending"
  | "contacted"
  | "resolved"
  | "closed";

// =====================================================
// POPULATED USER (for populated fields)
// =====================================================

export interface PopulatedUserLite {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  image?: string;
}

// =====================================================
// ENTITY
// =====================================================

export interface Inquiry {
  _id: string;
  property: Property | string;
  user: PopulatedUserLite | string;
  agent: PopulatedUserLite | string | null;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: InquiryStatus;
  reply?: string;
  repliedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// =====================================================
// PAYLOADS
// =====================================================

export interface CreateInquiryData {
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface UpdateInquiryData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface UpdateInquiryStatusData {
  status: InquiryStatus;
}

export interface ReplyInquiryData {
  reply: string;
}

// =====================================================
// RESPONSES
// =====================================================

export interface GetInquiriesResponse {
  status: boolean;
  message?: string;
  count: number;
  data?: Inquiry[];
  inquiries?: Inquiry[];
}

export interface GetInquiryResponse {
  status: boolean;
  message?: string;
  data: Inquiry;
}

export interface CreateInquiryResponse {
  status: boolean;
  message: string;
  data: Inquiry;
}

export interface UpdateInquiryResponse {
  status: boolean;
  message: string;
  data?: Inquiry;
  inquiry?: Inquiry;
}

export interface DeleteInquiryResponse {
  status: boolean;
  message: string;
}

// =====================================================
// STATE
// =====================================================

export interface InquiryState {
  inquiries: Inquiry[];
  inquiry: Inquiry | null;
  loading: boolean;
  error: string | null;
}

// =====================================================
// FORM VALUES
// =====================================================

export interface InquiryFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ReplyInquiryFormValues {
  reply: string;
}