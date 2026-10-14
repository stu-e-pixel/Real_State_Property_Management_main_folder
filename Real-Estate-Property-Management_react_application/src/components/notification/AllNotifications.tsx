import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Stack,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Pagination,
  Skeleton,
  
} from "@mui/material";
import {
  DoneAll,
  DeleteOutlined,
  Notifications as NotificationsIcon,
  Delete,
  Info,
  CheckCircle,
  Cancel,
  Email,
  Event,
  LocalOffer,
  ReceiptLong,
  Star,
  Home,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../../features/notification/notificationSlice";
import type { AppNotification } from "../../typescript/type/notification.types";

// =====================================================
// META MAP (same as bell)
// =====================================================

const getNotificationMeta = (type: string) => {
  const map: Record<string, { icon: React.ReactNode; color: string }> = {
    inquiry_created: { icon: <Email />, color: "#8b5cf6" },
    appointment_created: { icon: <Event />, color: "#f59e0b" },
    appointment_confirmed: { icon: <CheckCircle />, color: "#10b981" },
    appointment_rejected: { icon: <Cancel />, color: "#ef4444" },
    rental_approved: { icon: <CheckCircle />, color: "#10b981" },
    rental_rejected: { icon: <Cancel />, color: "#ef4444" },
    sale_offer_created: { icon: <LocalOffer />, color: "#f59e0b" },
    sale_offer_accepted: { icon: <CheckCircle />, color: "#10b981" },
    sale_offer_rejected: { icon: <Cancel />, color: "#ef4444" },
    transaction_created: { icon: <ReceiptLong />, color: "#6366f1" },
    review_created: { icon: <Star />, color: "#eab308" },
    property_approved: { icon: <Home />, color: "#10b981" },
    system: { icon: <Info />, color: "#3b82f6" },
  };
  return map[type] || { icon: <Info />, color: "#6b7280" };
};

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

  return date.toLocaleString();
};

// =====================================================
// PAGE
// =====================================================

const AllNotifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { notifications, unreadCount, loading, pagination } = useAppSelector(
    (state) => state.notification
  );

  const [tab, setTab] = useState<"all" | "unread" | "read">("all");
  const [page, setPage] = useState(1);

  // =====================================================
  // FETCH
  // =====================================================

  useEffect(() => {
    const params: { page: number; limit: number; isRead?: boolean } = {
      page,
      limit: 15,
    };

    if (tab === "unread") params.isRead = false;
    if (tab === "read") params.isRead = true;

    dispatch(fetchNotifications(params));
  }, [dispatch, page, tab]);

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleNotificationClick = (n: AppNotification) => {
    if (!n.isRead) dispatch(markNotificationAsRead(n._id));
    if (n.link) navigate(n.link);
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
    setTimeout(() => {
      dispatch(fetchNotifications({ page: 1, limit: 15 }));
    }, 300);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(deleteNotification(id));
  };

  const handleClearAll = () => {
    if (window.confirm("Clear all notifications? This cannot be undone.")) {
      dispatch(clearAllNotifications());
      setTimeout(() => {
        dispatch(fetchNotifications({ page: 1, limit: 15 }));
      }, 300);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3 }}>
        {/* HEADER */}
        <Box
        >
          <Box>
            <Stack >
              <NotificationsIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography >
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Chip
                  label={`${unreadCount} new`}
                  color="error"
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              )}
            </Stack>
            <Typography >
              Stay updated on all your activities
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            {unreadCount > 0 && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<DoneAll />}
                onClick={handleMarkAllRead}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Mark All Read
              </Button>
            )}

            {notifications.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={handleClearAll}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Clear All
              </Button>
            )}
          </Stack>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* TABS */}
        <Tabs
          value={tab}
          onChange={(_e, v) => {
            setTab(v);
            setPage(1);
          }}
          sx={{ mb: 2 }}
        >
          <Tab value="all" label="All" />
          <Tab
            value="unread"
            label={`Unread ${unreadCount > 0 ? `(${unreadCount})` : ""}`}
          />
          <Tab value="read" label="Read" />
        </Tabs>

        {/* BODY */}
        {loading && notifications.length === 0 ? (
          <Stack spacing={1}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={80}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Stack>
        ) : notifications.length === 0 ? (
          <Box>
            <NotificationsIcon
              sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
            />
            <Typography>
              No notifications
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {tab === "unread"
                ? "You're all caught up! 🎉"
                : "Nothing to show here"}
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ p: 0 }}>
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
                      py: 2,
                      px: 2,
                      borderRadius: 2,
                      mb: 0.5,
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: n.isRead ? "#f9fafb" : "#dbeafe",
                        transform: "translateX(4px)",
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
                          width: 48,
                          height: 48,
                        }}
                      >
                        {n.sender?.image ? null : meta.icon}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      sx={{ pr: 4 }}
                      primary={
                        <Stack
                          
                        >
                          <Typography
                            
                          >
                            {n.title}
                          </Typography>
                          {!n.isRead && (
                            <Chip
                              label="New"
                              size="small"
                              color="primary"
                              sx={{
                                height: 20,
                                fontSize: 10,
                                fontWeight: 700,
                              }}
                            />
                          )}
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="body2" color="text.secondary">
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

            {/* PAGINATION */}
            {pagination && pagination.totalPages > 1 && (
              <Box >
                <Pagination
                  count={pagination.totalPages}
                  page={page}
                  onChange={(_e, p) => setPage(p)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default AllNotifications;