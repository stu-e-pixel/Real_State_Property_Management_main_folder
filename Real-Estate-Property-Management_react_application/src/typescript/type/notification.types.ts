import type { UserRole } from "./auth.types";



export type NotificationType =
  | "inquiry_created"
  | "inquiry_replied"
  | "appointment_created"
  | "appointment_confirmed"
  | "appointment_rejected"
  | "appointment_rescheduled"
  | "appointment_cancelled"
  | "rental_created"
  | "rental_approved"
  | "rental_rejected"
  | "lease_created"
  | "lease_terminated"
  | "lease_expiring"
  | "sale_offer_created"
  | "sale_offer_countered"
  | "sale_offer_accepted"
  | "sale_offer_rejected"
  | "transaction_created"
  | "transaction_updated"
  | "review_created"
  | "review_approved"
  | "review_rejected"
  | "property_approved"
  | "property_rejected"
  | "system";

export interface NotificationSender {
  _id: string;
  name: string;
  image?: string;
  role?: UserRole;
}

export interface AppNotification {
  _id: string;
  recipient: string;
  recipientRole: UserRole;
  sender?: NotificationSender | null;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  refId?: string;
  refModel?: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPagination {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: NotificationPagination | null;
}