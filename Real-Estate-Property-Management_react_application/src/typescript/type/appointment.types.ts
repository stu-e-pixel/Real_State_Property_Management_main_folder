
import type { Property } from "./property.types";



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



export interface AppointmentState {
  appointments: Appointment[];
  appointment: Appointment | null;
  loading: boolean;
  error: string | null;
}



export interface AppointmentFormValues {
  appointmentDate: string; 
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