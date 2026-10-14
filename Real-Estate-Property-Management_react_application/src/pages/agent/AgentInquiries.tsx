import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";

import {
  Visibility,
  Close,
  Reply,
  Email,
  Phone,
  Home,
  Send,
} from "@mui/icons-material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";
import FormInput from "../../components/common/FormInput";

import { replyInquirySchema } from "../../utils/validations";

import {
  getAgentInquiries,
  getOwnerInquiries,
  getInquiryById,
  replyToInquiry,
  updateInquiryStatus,
  clearSelectedInquiry,
} from "../../features/inquiry/inquirySlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type {
  Inquiry,
  InquiryStatus,
  ReplyInquiryFormValues,
} from "../../typescript/type/inquiry.types";

import type { Property } from "../../typescript/type/property.types";

// =====================================================
// CONFIG
// =====================================================

const STATUS_COLORS: Record<
  string,
  "default" | "info" | "success" | "warning"
> = {
  pending: "warning",
  contacted: "info",
  resolved: "success",
  closed: "default",
};

const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const isPopulatedProperty = (
  val: Property | string | undefined
): val is Property => !!val && typeof val === "object" && "title" in val;

// =====================================================
// PROPS
// =====================================================

interface AgentInquiriesProps {
  mode: "agent" | "owner";
}

// =====================================================
// COMPONENT
// =====================================================

const AgentInquiries: React.FC<AgentInquiriesProps> = ({ mode }) => {
  const dispatch = useAppDispatch();

  const { inquiries, inquiry, loading } = useAppSelector(
    (state) => state.inquiry
  );

  const [tab, setTab] = useState<string>("all");
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [replyOpen, setReplyOpen] = useState<boolean>(false);
  const [replyTarget, setReplyTarget] = useState<Inquiry | null>(null);

  const { control, handleSubmit, reset } = useForm<ReplyInquiryFormValues>({
    resolver: yupResolver(replyInquirySchema),
    defaultValues: {
      reply: "",
    },
  });

  // ================= FETCH =================

  useEffect(() => {
    if (mode === "agent") {
      dispatch(getAgentInquiries());
    } else {
      dispatch(getOwnerInquiries());
    }

    return () => {
      dispatch(clearSelectedInquiry());
    };
  }, [dispatch, mode]);

  // ================= VIEW =================

  const handleView = async (id: string): Promise<void> => {
    await dispatch(getInquiryById(id));
    setViewOpen(true);
  };

  const closeView = (): void => {
    setViewOpen(false);
    dispatch(clearSelectedInquiry());
  };

  // ================= REPLY =================

  const openReply = (i: Inquiry): void => {
    setReplyTarget(i);

    reset({
      reply: i.reply ?? "",
    });

    setReplyOpen(true);
  };

  const closeReply = (): void => {
    setReplyOpen(false);
    setReplyTarget(null);
    reset({
      reply: "",
    });
  };

  const submitReply = async (data: ReplyInquiryFormValues): Promise<void> => {
    if (!replyTarget) {
      return;
    }

    const result = await dispatch(
      replyToInquiry({
        id: replyTarget._id,
        data,
      })
    );

    if (replyToInquiry.fulfilled.match(result)) {
      setReplyOpen(false);
      setReplyTarget(null);
      reset({
        reply: "",
      });
    }
  };

  // ================= STATUS =================

  const handleStatusChange = (id: string, status: InquiryStatus): void => {
    dispatch(
      updateInquiryStatus({
        id,
        status,
      })
    );
  };

  // ================= FILTER =================

  const filtered =
    tab === "all" ? inquiries : inquiries.filter((i) => i.status === tab);

  // ================= COUNTS =================

  const counts = {
    all: inquiries.length,

    pending: inquiries.filter((i) => i.status === "pending").length,

    contacted: inquiries.filter((i) => i.status === "contacted").length,

    resolved: inquiries.filter((i) => i.status === "resolved").length,

    closed: inquiries.filter((i) => i.status === "closed").length,
  };

  // ================= HEADER TEXT =================

  const headerTitle =
    mode === "agent" ? "Customer Inquiries" : "Customer Inquiries";

  const headerSubtitle =
    mode === "agent"
      ? "Inquiries for the properties assigned to you"
      : "Inquiries for your properties without an assigned agent";

  // ================= RENDER =================

  return (
    <MainLayout>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* ================= HEADER ================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              {headerTitle}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              {headerSubtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`${counts.pending} Pending`}
              color="warning"
              variant="outlined"
            />

            <Chip
              label={`${counts.contacted} Contacted`}
              color="info"
              variant="outlined"
            />

            <Chip
              label={`${counts.resolved} Resolved`}
              color="success"
              variant="outlined"
            />
          </Box>
        </Box>

        <Divider
          sx={{
            mb: 2,
          }}
        />

        {/* ================= TABS ================= */}

        <Tabs
          value={tab}
          onChange={(_event, value) => setTab(value)}
          sx={{
            mb: 3,
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="all" label={`All (${counts.all})`} />

          <Tab value="pending" label={`Pending (${counts.pending})`} />

          <Tab value="contacted" label={`Contacted (${counts.contacted})`} />

          <Tab value="resolved" label={`Resolved (${counts.resolved})`} />

          <Tab value="closed" label={`Closed (${counts.closed})`} />
        </Tabs>

        {/* ================= CONTENT ================= */}

        {loading && inquiries.length === 0 ? (
          <Loader message="Loading inquiries..." />
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              No inquiries in this category.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {filtered.map((i) => (
              <Box
                key={i._id}
                sx={{
                  width: {
                    xs: "100%",
                    md: "calc(50% - 12px)",
                  },
                }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{
                      flex: 1,
                    }}
                  >
                    {/* ================= CUSTOMER ================= */}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          minWidth: 0,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            flexShrink: 0,
                          }}
                        >
                          {i.name.charAt(0).toUpperCase()}
                        </Avatar>

                        <Box
                          sx={{
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            {i.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {i.email}
                          </Typography>

                          {i.phone && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                display: "block",
                              }}
                            >
                              {i.phone}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Chip
                        label={i.status}
                        color={STATUS_COLORS[i.status] ?? "default"}
                        size="small"
                      />
                    </Box>

                    {/* ================= PROPERTY ================= */}

                    {isPopulatedProperty(i.property) && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                          p: 1,
                          bgcolor: "#f9fafb",
                          borderRadius: 1,
                        }}
                      >
                        <Home fontSize="small" color="action" />

                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {i.property.title}
                        </Typography>
                      </Box>
                    )}

                    {/* ================= MESSAGE ================= */}

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {i.message}
                    </Typography>

                    {/* ================= REPLY ================= */}

                    {i.reply && (
                      <Alert
                        severity="success"
                        sx={{
                          mt: 2,
                        }}
                      >
                        <Typography variant="caption">
                          <b>Your reply:</b> {i.reply}
                        </Typography>
                      </Alert>
                    )}

                    {/* ================= DATE ================= */}

                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        mt: 1,
                      }}
                    >
                      {new Date(i.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>

                  <Divider />

                  {/* ================= CARD ACTIONS ================= */}

                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <FormControl
                      size="small"
                      sx={{
                        minWidth: 130,
                      }}
                    >
                      <Select
                        value={i.status}
                        onChange={(event) =>
                          handleStatusChange(
                            i._id,
                            event.target.value as InquiryStatus
                          )
                        }
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Tooltip title="View details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleView(i._id)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Reply">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => openReply(i)}
                        >
                          <Reply fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* =====================================================
          VIEW DIALOG
      ===================================================== */}

      <Dialog open={viewOpen} onClose={closeView} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          >
            Inquiry Details
          </Typography>

          <IconButton
            onClick={closeView}
            size="small"
            aria-label="Close inquiry details"
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {loading && !inquiry ? (
            <Loader message="Loading..." />
          ) : inquiry ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* From */}

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  From
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {inquiry.name}
                </Typography>
              </Box>

              {/* Contact Information */}

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Email fontSize="small" color="action" />

                    <Typography variant="caption">{inquiry.email}</Typography>
                  </Box>
                </Box>

                {inquiry.phone && (
                  <Box
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "calc(50% - 8px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Phone fontSize="small" color="action" />

                      <Typography variant="caption">{inquiry.phone}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Message */}

              <Box>
                <Divider
                  sx={{
                    my: 1,
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Message
                </Typography>

                <Alert
                  severity="info"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  {inquiry.message}
                </Alert>
              </Box>

              {/* Reply */}

              {inquiry.reply && (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Your Reply
                  </Typography>

                  <Alert
                    severity="success"
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    {inquiry.reply}
                  </Alert>
                </Box>
              )}
            </Box>
          ) : (
            <Typography variant="body2">Not found.</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          REPLY DIALOG
      ===================================================== */}

      <Dialog open={replyOpen} onClose={closeReply} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: 600,
          }}
        >
          Reply to Inquiry
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Box
            component="form"
            id="reply-inquiry-form"
            onSubmit={handleSubmit(submitReply)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: 2,
            }}
          >
            {replyTarget && (
              <Alert severity="info">
                <b>{replyTarget.name}</b> — {replyTarget.message}
              </Alert>
            )}

            <FormInput<ReplyInquiryFormValues>
              name="reply"
              control={control}
              label="Your Reply"
              multiline
              rows={5}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            gap: 1,
          }}
        >
          <Button type="button" onClick={closeReply}>
            Cancel
          </Button>

          <Button
            type="submit"
            form="reply-inquiry-form"
            variant="contained"
            startIcon={<Send />}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default AgentInquiries;