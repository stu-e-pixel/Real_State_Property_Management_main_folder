import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import { fetchUnreadCount } from "../features/notification/notificationSlice";

interface PollingOptions {
  interval?: number; // default 30000 (30s)
  enabled?: boolean;
}

export const useNotificationPolling = ({
  interval = 30000,
  enabled = true,
}: PollingOptions = {}) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled || !isAuthenticated) return;

    // Immediate first fetch
    dispatch(fetchUnreadCount());

    // Start interval
    intervalRef.current = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, interval);

    // Pause when tab is hidden, resume when visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        dispatch(fetchUnreadCount());
        intervalRef.current = setInterval(() => {
          dispatch(fetchUnreadCount());
        }, interval);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, isAuthenticated, enabled, interval]);
};