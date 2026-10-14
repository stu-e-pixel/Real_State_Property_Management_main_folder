import React, { useState, useEffect } from "react";
import {
  IconButton,
  Badge,
  Menu,
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Stack,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  DoneAll,
  DeleteOutlined,
  Refresh,
  Info,
  CheckCircle,
  Cancel,
  Email,
  Event,
  LocalOffer,
  ReceiptLong,
  Star,
  Home,
  Description,
  AssignmentTurnedIn,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../features/notification/notificationSlice";
import type { AppNotification } from "../../typescript/type/notification.types";

// =====================================================
// META MAP
// =====================================================

const getNotificationMeta = (type: string) => {
  const map: Record<string, { icon: React.ReactNode; color: string }> = {
    inquiry_created: { icon: <Email />, color: "#8b5cf6" },
    inquiry_replied: { icon: <Email />, color: "#10b981" },
    appointment_created: { icon: <Event />, color: "#f59e0b" },
    appointment_confirmed: { icon: <CheckCircle />, color: "#10b981" },
    appointment_rejected: { icon: <Cancel />, color: "#ef4444" },
    appointment_rescheduled: { icon: <Event />, color: "#06b6d4" },
    appointment_cancelled: { icon: <Cancel />, color: "#ef4444" },
    rental_created: { icon: <AssignmentTurnedIn />, color: "#f59e0b" },
    rental_approved: { icon: <CheckCircle />, color: "#10b981" },
    rental_rejected: { icon: <Cancel />, color: "#ef4444" },
    lease_created: { icon: <Description />, color: "#6366f1" },
    lease_terminated: { icon: <Description />, color: "#ef4444" },
    lease_expiring: { icon: <Description />, color: "#f59e0b" },
    sale_offer_created: { icon: <LocalOffer />, color: "#f59e0b" },
    sale_offer_countered: { icon: <LocalOffer />, color: "#06b6d4" },
    sale_offer_accepted: { icon: <CheckCircle />, color: "#10b981" },
    sale_offer_rejected: { icon: <Cancel />, color: "#ef4444" },
    transaction_created: { icon: <ReceiptLong />, color: "#6366f1" },
    transaction_updated: { icon: <ReceiptLong />, color: "#3b82f6" },
    review_created: { icon: <Star />, color: "#eab308" },
    review_approved: { icon: <Star />, color: "#10b981" },
    review_rejected: { icon: <Star />, color: "#ef4444" },
    property_approved: { icon: <Home />, color: "#10b981" },
    property_rejected: { icon: <Home />, color: "#ef4444" },
    system: { icon: <Info />, color: "#3b82f6" },
  };

  return map[type] || { icon: <Info />, color: "#6b7280" };
};

// =====================================================
// TIME FORMATTER
// =====================================================

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

// =====================================================
// COMPONENT
// =====================================================

const NotificationBell: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { notifications, unreadCount, loading } = useAppSelector(
    (state) => state.notification
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  // =====================================================
  // FETCH WHEN MENU OPENS
  // =====================================================

  useEffect(() => {
    if (open) {
      dispatch(fetchNotifications({ page: 1, limit: 20 }));
    }
  }, [open, dispatch]);

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleRefresh = () => {
    dispatch(fetchNotifications({ page: 1, limit: 20 }));
    dispatch(fetchUnreadCount());
  };

  const handleNotificationClick = async (n: AppNotification) => {
    if (!n.isRead) {
      dispatch(markNotificationAsRead(n._id));
    }
    handleClose();

    if (n.link) navigate(n.link);
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation();
    dispatch(deleteNotification(id));
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={handleOpen} size="large" color="inherit">
          <Badge
            badgeContent={unreadCount > 99 ? "99+" : unreadCount}
            color="error"
            overlap="circular"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "calc(100vw - 32px)", sm: 400 },
              maxWidth: 420,
              maxHeight: 600,
              mt: 1,
              borderRadius: 2,
              boxShadow: 6,
            },
          },
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            <Typography>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Box
                sx={{
                  bgcolor: "error.main",
                  color: "#fff",
                  px: 1,
                  py: 0.25,
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 700,
                  minWidth: 22,
                  textAlign: "center",
                }}
              >
                {unreadCount}
              </Box>
            )}
          </Box>

          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={handleRefresh}
                disabled={loading}
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>

            {unreadCount > 0 && (
              <Tooltip title="Mark all as read">
                <IconButton size="small" onClick={handleMarkAllRead}>
                  <DoneAll fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>

        {/* BODY */}
        {loading && notifications.length === 0 ? (
          <Box>
            <CircularProgress size={32} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box >
            <NotificationsIcon
              sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
            <Typography variant="caption" color="text.disabled">
              We'll notify you when something happens
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 400, overflowY: "auto" }}>
            {notifications.map((n) => {
              const meta = getNotificationMeta(n.type);

              return (
                <ListItem
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  sx={{
                    cursor: "pointer",
                    bgcolor: n.isRead ? "transparent" : "#eff6ff",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      bgcolor: n.isRead ? "#f9fafb" : "#dbeafe",
                    },
                  }}
                  secondaryAction={
                    <IconButton
                      size="small"
                      edge="end"
                      onClick={(e) => handleDelete(e, n._id)}
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={n.sender?.image}
                      sx={{
                        bgcolor: `${meta.color}15`,
                        color: meta.color,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {n.sender?.image ? null : meta.icon}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    sx={{ pr: 3 }}
                    primary={
                      <Box
                        
                      >
                        <Typography
                          
                        >
                          {n.title}
                        </Typography>
                        {!n.isRead && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Stack spacing={0.25}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {n.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {formatTime(n.createdAt)}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}

        {/* FOOTER */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1.5, textAlign: "center" }}>
              <Button
                size="small"
                onClick={() => {
                  handleClose();
                  navigate("/user/notifications");
                }}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;