import api from "./api";
import type { AppNotification, NotificationPagination } from "../typescript/type/notification.types";

const BASE = "/v13/api";

interface GetNotificationsResponse {
  success: boolean;
  data: AppNotification[];
  unreadCount: number;
  pagination: NotificationPagination;
}

const notificationService = {
  
  getMyNotifications: async (params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
    type?: string;
  }): Promise<GetNotificationsResponse> => {
    const response = await api.get<GetNotificationsResponse>(BASE, { params });
    return response.data;
  },

 
  getUnreadCount: async (): Promise<{
    success: boolean;
    unreadCount: number;
  }> => {
    const response = await api.get(`${BASE}/unread-count`);
    return response.data;
  },

 
  markAsRead: async (
    id: string
  ): Promise<{ success: boolean; data: AppNotification }> => {
    const response = await api.put(`${BASE}/${id}/read`);
    return response.data;
  },

  
  markAllAsRead: async (): Promise<{
    success: boolean;
    message: string;
    modifiedCount: number;
  }> => {
    const response = await api.put(`${BASE}/read-all`);
    return response.data;
  },

  
  deleteNotification: async (
    id: string
  ): Promise<{ success: boolean }> => {
    const response = await api.delete(`${BASE}/${id}`);
    return response.data;
  },

  
  clearAll: async (): Promise<{ success: boolean; deletedCount: number }> => {
    const response = await api.delete(`${BASE}/clear-all`);
    return response.data;
  },
};

export default notificationService;