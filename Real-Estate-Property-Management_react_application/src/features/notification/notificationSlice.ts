import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "../../services/notificationService";
import type {
  NotificationState,
  AppNotification,
  NotificationPagination,
} from "../../typescript/type/notification.types";

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: null,
};

// =====================================================
// THUNKS
// =====================================================

export const fetchNotifications = createAsyncThunk<
  {
    data: AppNotification[];
    unreadCount: number;
    pagination: NotificationPagination;
  },
  { page?: number; limit?: number; isRead?: boolean; type?: string } | undefined,
  { rejectValue: string }
>("notification/fetch", async (params, { rejectWithValue }) => {
  try {
    const res = await notificationService.getMyNotifications(params);
    return {
      data: res.data,
      unreadCount: res.unreadCount,
      pagination: res.pagination,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to load notifications"
    );
  }
});

export const fetchUnreadCount = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>("notification/fetchUnreadCount", async (_, { rejectWithValue }) => {
  try {
    const res = await notificationService.getUnreadCount();
    return res.unreadCount;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch count"
    );
  }
});

export const markNotificationAsRead = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notification/markRead", async (id, { rejectWithValue }) => {
  try {
    await notificationService.markAsRead(id);
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed");
  }
});

export const markAllAsRead = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("notification/markAllRead", async (_, { rejectWithValue }) => {
  try {
    await notificationService.markAllAsRead();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed");
  }
});

export const deleteNotification = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notification/delete", async (id, { rejectWithValue }) => {
  try {
    await notificationService.deleteNotification(id);
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to delete");
  }
});

export const clearAllNotifications = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("notification/clearAll", async (_, { rejectWithValue }) => {
  try {
    await notificationService.clearAll();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to clear");
  }
});

// =====================================================
// SLICE
// =====================================================

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },
    resetNotifications: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // -------- FETCH --------
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
        state.unreadCount = action.payload.unreadCount;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      // -------- UNREAD COUNT --------
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      // -------- MARK ONE READ --------
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const n = state.notifications.find((x) => x._id === action.payload);
        if (n && !n.isRead) {
          n.isRead = true;
          n.readAt = new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // -------- MARK ALL READ --------
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date().toISOString(),
        }));
        state.unreadCount = 0;
      })

      // -------- DELETE --------
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const n = state.notifications.find((x) => x._id === action.payload);
        if (n && !n.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(
          (x) => x._id !== action.payload
        );
      })

      // -------- CLEAR ALL --------
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
      });
  },
});

export const {
  clearNotificationError,
  resetNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;