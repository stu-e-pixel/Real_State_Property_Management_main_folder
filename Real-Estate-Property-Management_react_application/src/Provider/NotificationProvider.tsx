import React from "react";
import { useNotificationPolling } from "../hooks/useNotificationPolling";

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useNotificationPolling({ interval: 30000, enabled: true });

  return <>{children}</>;
};

export default NotificationProvider;