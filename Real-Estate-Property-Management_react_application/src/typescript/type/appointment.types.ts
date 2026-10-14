
import type { Property } from "./property.types";

// =====================================================
// ENUMS
// =====================================================

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rejected"
  | "rescheduled";

export type AppointmentAction =
  | "confirm"
  | "reject"
  | "reschedule"
  | "complete";

// =====================================================
// ENTITY
// =====================================================

export interface Appointment {
  _id: string;
  property: Property | string;
  user: PopulatedUserLite | string;
  agent: PopulatedUserLite | string | null;
  appointmentDate: string;
  duration: number;
  message: string;
  status: AppointmentStatus;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// =====================================================
// PAYLOADS
// =====================================================

export interface CreateAppointmentData {
  property: string;
  appointmentDate: string; // ISO
  duration?: number;
  message?: string;
}

export interface AppointmentActionData {
  id: string;
  action: AppointmentAction;
  appointmentDate?: string;
  duration?: number;
  message?: string;
}

export interface CancelAppointmentData {
  id: string;
  cancellationReason?: string;
}

// =====================================================
// RESPONSES
// =====================================================

export interface GetAppointmentsResponse {
  success: boolean;
  message?: string;
  count?: number;
  cpount?: number; // typo coming from your backend ("getAgentAllAppointments")
  data: Appointment[];
}

export interface GetAppointmentResponse {
  success: boolean;
  message?: string;
  data: Appointment;
}

export interface AppointmentMutationResponse {
  success: boolean;
  message: string;
  data?: Appointment;
  appointment?: Appointment;
}

// =====================================================
// STATE
// =====================================================

export interface AppointmentState {
  appointments: Appointment[];
  appointment: Appointment | null;
  loading: boolean;
  error: string | null;
}

// =====================================================
// FORM VALUES
// =====================================================

export interface AppointmentFormValues {
  appointmentDate: string; // yyyy-MM-ddTHH:mm for datetime-local input
  duration: number;
  message: string;
}

export interface RescheduleFormValues {
  appointmentDate: string;
  duration: number;
  message: string;
}

export interface CancelFormValues {
  cancellationReason: string;
}

export interface PopulatedUserLite {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  image?: string;
}

export interface Appointment {
  _id: string;
  property: Property | string;
  user: PopulatedUserLite | string;
  agent: PopulatedUserLite | string | null;
  appointmentDate: string;
  duration: number;
  message: string;
  status: AppointmentStatus;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}