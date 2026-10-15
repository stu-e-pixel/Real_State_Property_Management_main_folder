import { useEffect, useMemo, useState } from "react";
import {
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Box,
  Divider,
  Avatar,
  Skeleton,
  Tabs,
  Tab,
  Rating,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Star,
  Home,
  CheckCircle,
  Cancel,
  Pending,
  Reply as ReplyIcon,
  Edit,
  Send,
  Close,
  PublishedWithChanges,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import {
  getOwnerReviews,
  getAgentReviews,
  replyToReview,
  updateReviewStatusByOwner,
} from "../../features/review/reviewSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type { Review } from "../../typescript/type/review.types";

const STATUS_COLORS: Record<
  string,
  "default" | "success" | "error" | "warning"
> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

type ReviewTab = "all" | "pending" | "approved" | "rejected";
type ReviewStatus = "approved" | "rejected";

interface ManagePropertyReviewsProps {
  mode: "owner" | "agent";
}

const ManagePropertyReviews = ({ mode }: ManagePropertyReviewsProps) => {
  const dispatch = useAppDispatch();
  const { reviews, loading } = useAppSelector((state) => state.review);

  const [tab, setTab] = useState<ReviewTab>("all");

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<Review | null>(null);
  const [statusValue, setStatusValue] = useState<ReviewStatus>("approved");
  const [statusReason, setStatusReason] = useState("");
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "owner") {
      dispatch(getOwnerReviews());
    } else {
      dispatch(getAgentReviews());
    }
  }, [dispatch, mode]);

  const filteredReviews = useMemo(() => {
    if (tab === "all") return reviews;

    return reviews.filter((review) => review.status === tab);
  }, [reviews, tab]);

  const counts = useMemo(
    () => ({
      all: reviews.length,
      pending: reviews.filter((review) => review.status === "pending").length,
      approved: reviews.filter((review) => review.status === "approved").length,
      rejected: reviews.filter((review) => review.status === "rejected").length,
    }),
    [reviews],
  );

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce(
      (total, review) => total + review.rating,
      0,
    );

    return totalRating / reviews.length;
  }, [reviews]);

  const getPropertyTitle = (review: Review): string => {
    if (typeof review.property === "object" && review.property) {
      return review.property.title ?? "Property";
    }

    return "Property";
  };

  const getPropertyImage = (review: Review): string | undefined => {
    if (typeof review.property === "object" && review.property) {
      return review.property.images?.[0]?.image;
    }

    return undefined;
  };

  const getUserName = (review: Review): string => {
    if (typeof review.user === "object" && review.user) {
      return review.user.name ?? "Anonymous";
    }

    return "Anonymous";
  };

  const getUserEmail = (review: Review): string => {
    if (typeof review.user === "object" && review.user) {
      return review.user.email ?? "";
    }

    return "";
  };

  const getUserImage = (review: Review): string | undefined => {
    if (typeof review.user === "object" && review.user) {
      return review.user.image;
    }

    return undefined;
  };

  const openReply = (review: Review): void => {
    setReplyTarget(review);
    setReplyText(review.reply ?? "");
    setReplyOpen(true);
  };

  const closeReply = (): void => {
    if (replySubmitting) return;

    setReplyOpen(false);
    setReplyTarget(null);
    setReplyText("");
  };

  const submitReply = async (): Promise<void> => {
    if (!replyTarget || replySubmitting) return;

    const trimmedReply = replyText.trim();

    if (!trimmedReply || trimmedReply.length > 1000) return;

    setReplySubmitting(true);

    try {
      const result = await dispatch(
        replyToReview({
          id: replyTarget._id,
          reply: trimmedReply,
        }),
      );

      if (replyToReview.fulfilled.match(result)) {
        setReplyOpen(false);
        setReplyTarget(null);
        setReplyText("");

        if (mode === "owner") {
          await dispatch(getOwnerReviews());
        } else {
          await dispatch(getAgentReviews());
        }
      }
    } finally {
      setReplySubmitting(false);
    }
  };

  const openStatus = (
    review: Review,
    defaultAction: ReviewStatus = "approved",
  ): void => {
    setStatusTarget(review);
    setStatusValue(defaultAction);
    setStatusReason(review.reason ?? "");
    setStatusOpen(true);
  };

  const closeStatus = (): void => {
    if (statusSubmitting) return;

    setStatusOpen(false);
    setStatusTarget(null);
    setStatusValue("approved");
    setStatusReason("");
  };

  const submitStatus = async (): Promise<void> => {
    if (!statusTarget || statusSubmitting) return;

    const trimmedReason = statusReason.trim();

    if (
      statusValue === "rejected" &&
      (!trimmedReason || trimmedReason.length > 1000)
    ) {
      return;
    }

    setStatusSubmitting(true);

    try {
      const result = await dispatch(
        updateReviewStatusByOwner({
          id: statusTarget._id,
          status: statusValue,
          reason: statusValue === "rejected" ? trimmedReason : undefined,
        }),
      );

      if (updateReviewStatusByOwner.fulfilled.match(result)) {
        setStatusOpen(false);
        setStatusTarget(null);
        setStatusValue("approved");
        setStatusReason("");

        if (mode === "owner") {
          await dispatch(getOwnerReviews());
        } else {
          await dispatch(getAgentReviews());
        }
      }
    } finally {
      setStatusSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3 }}>
        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {mode === "owner"
                ? "My Property Reviews"
                : "Assigned Property Reviews"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {mode === "owner"
                ? "Moderate reviews on your properties"
                : "Moderate reviews on your assigned properties"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {avgRating > 0 && (
              <Chip
                icon={<Star />}
                label={`${avgRating.toFixed(1)} avg`}
                color="warning"
                variant="outlined"
              />
            )}

            <Chip
              label={`${reviews.length} Total`}
              color="primary"
              variant="outlined"
            />

            {counts.pending > 0 && (
              <Chip
                label={`${counts.pending} Pending`}
                color="warning"
                variant="filled"
              />
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Tabs
          value={tab}
          onChange={(_event, value: ReviewTab) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab value="all" label={`All (${counts.all})`} />
          <Tab value="pending" label={`Pending (${counts.pending})`} />
          <Tab value="approved" label={`Approved (${counts.approved})`} />
          <Tab value="rejected" label={`Rejected (${counts.rejected})`} />
        </Tabs>

        {loading && reviews.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {[1, 2, 3].map((item) => (
              <Box
                key={item}
                sx={{
                  width: { xs: "100%", md: "calc(50% - 12px)" },
                }}
              >
                <Skeleton
                  variant="rounded"
                  height={200}
                  sx={{ borderRadius: 3 }}
                />
              </Box>
            ))}
          </Box>
        ) : filteredReviews.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Star
              sx={{
                fontSize: 80,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography sx={{ mb: 1 }} color="text.secondary">
              No reviews in this category.
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {mode === "owner"
                ? "Reviews from customers on your properties will appear here."
                : "Reviews on your assigned properties will appear here."}
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
            {filteredReviews.map((review) => (
              <Box
                key={review._id}
                sx={{
                  width: { xs: "100%", md: "calc(50% - 12px)" },
                  minWidth: 0,
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
                  <CardContent sx={{ flex: 1 }}>
                    {/* PROPERTY HEADER */}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        src={getPropertyImage(review)}
                        variant="rounded"
                        sx={{ width: 40, height: 40 }}
                      >
                        <Home />
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          noWrap
                          sx={{ fontWeight: 700 }}
                        >
                          {getPropertyTitle(review)}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          Review #{review._id.slice(-6)}
                        </Typography>
                      </Box>

                      <Chip
                        label={review.status}
                        color={STATUS_COLORS[review.status] ?? "default"}
                        size="small"
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1.5,
                      }}
                    >
                      <Avatar
                        src={getUserImage(review)}
                        sx={{ width: 32, height: 32 }}
                      >
                        {getUserName(review).charAt(0)}
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ fontWeight: 600 }}
                        >
                          {getUserName(review)}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                          sx={{ overflowWrap: "anywhere" }}
                        >
                          {getUserEmail(review)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        mb: 1,
                      }}
                    >
                      {review.comment}
                    </Typography>

                    {review.status === "rejected" && review.reason && (
                      <Alert severity="error" sx={{ mt: 1, py: 0.5 }}>
                        <Typography variant="caption">
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            Reason:
                          </Box>{" "}
                          {review.reason}
                        </Typography>
                      </Alert>
                    )}

                    {review.reply && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 1.5,
                          bgcolor: "action.hover",
                          borderRadius: 2,
                          borderLeft: "3px solid",
                          borderColor: "info.main",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="info.main"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontWeight: 700,
                            mb: 0.5,
                          }}
                        >
                          <ReplyIcon fontSize="inherit" />
                          Your Reply
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {review.reply}
                        </Typography>

                        {review.repliedAt && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            {new Date(review.repliedAt).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                    )}

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      Submitted {new Date(review.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>

                  <Divider />

                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      p: 1.5,
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: `${STATUS_COLORS[review.status] ?? "text.secondary"}.main`,
                      }}
                    >
                      {review.status === "approved" && (
                        <>
                          <CheckCircle fontSize="small" />
                          <Typography variant="caption">Approved</Typography>
                        </>
                      )}

                      {review.status === "rejected" && (
                        <>
                          <Cancel fontSize="small" />
                          <Typography variant="caption">Rejected</Typography>
                        </>
                      )}

                      {review.status === "pending" && (
                        <>
                          <Pending fontSize="small" />
                          <Typography variant="caption">Pending</Typography>
                        </>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        size="small"
                        variant={
                          review.status === "pending" ? "contained" : "outlined"
                        }
                        color={
                          review.status === "approved"
                            ? "success"
                            : review.status === "rejected"
                              ? "error"
                              : "warning"
                        }
                        startIcon={<PublishedWithChanges fontSize="small" />}
                        onClick={() => openStatus(review)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        {review.status === "pending"
                          ? "Update Status"
                          : "Change Status"}
                      </Button>

                      <Button
                        size="small"
                        variant={review.reply ? "outlined" : "contained"}
                        color="info"
                        startIcon={
                          review.reply ? (
                            <Edit fontSize="small" />
                          ) : (
                            <ReplyIcon fontSize="small" />
                          )
                        }
                        onClick={() => openReply(review)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        {review.reply ? "Edit Reply" : "Reply"}
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      <Dialog
        open={replyOpen}
        onClose={closeReply}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography component="span" sx={{ fontWeight: 700 }}>
            {replyTarget?.reply ? "Edit Your Reply" : "Reply to Review"}
          </Typography>

          <IconButton
            onClick={closeReply}
            size="small"
            disabled={replySubmitting}
            aria-label="Close reply dialog"
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {replyTarget && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Avatar
                    src={getUserImage(replyTarget)}
                    sx={{ width: 32, height: 32 }}
                  >
                    {getUserName(replyTarget).charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {getUserName(replyTarget)}
                    </Typography>

                    <Rating value={replyTarget.rating} size="small" readOnly />
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  "{replyTarget.comment}"
                </Typography>
              </Box>
            )}

            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700 }}
              gutterBottom
            >
              Your Reply
            </Typography>

            <TextField
              multiline
              rows={5}
              fullWidth
              placeholder="Write your response to this review..."
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              slotProps={{
                htmlInput: {
                  maxLength: 1000,
                },
              }}
              helperText={`${replyText.length}/1000`}
              error={replyText.length > 1000}
            />

            <Alert severity="info" sx={{ mt: 2 }}>
              Your reply will be publicly visible alongside this review.
            </Alert>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={closeReply} disabled={replySubmitting}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="info"
            startIcon={<Send />}
            onClick={submitReply}
            disabled={
              replySubmitting ||
              !replyText.trim() ||
              replyText.trim().length > 1000
            }
          >
            {replySubmitting
              ? "Submitting..."
              : replyTarget?.reply
                ? "Update Reply"
                : "Submit Reply"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={statusOpen}
        onClose={closeStatus}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography component="span" sx={{ fontWeight: 700 }}>
            Update Review Status
          </Typography>

          <IconButton
            onClick={closeStatus}
            size="small"
            disabled={statusSubmitting}
            aria-label="Close status dialog"
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {statusTarget && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Avatar
                    src={getUserImage(statusTarget)}
                    sx={{ width: 32, height: 32 }}
                  >
                    {getUserName(statusTarget).charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {getUserName(statusTarget)}
                    </Typography>

                    <Rating value={statusTarget.rating} size="small" readOnly />
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  "{statusTarget.comment}"
                </Typography>
              </Box>
            )}

            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700 }}
              gutterBottom
            >
              New Status
            </Typography>

            <ToggleButtonGroup
              value={statusValue}
              exclusive
              onChange={(_event, value: ReviewStatus | null) => {
                if (value !== null) {
                  setStatusValue(value);
                }
              }}
              fullWidth
              sx={{ mb: 3 }}
            >
              <ToggleButton
                value="approved"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  "&.Mui-selected": {
                    bgcolor: "success.main",
                    color: "#fff",
                    "&:hover": {
                      bgcolor: "success.dark",
                    },
                  },
                }}
              >
                <CheckCircle sx={{ mr: 1 }} fontSize="small" />
                Approve
              </ToggleButton>

              <ToggleButton
                value="rejected"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  "&.Mui-selected": {
                    bgcolor: "error.main",
                    color: "#fff",
                    "&:hover": {
                      bgcolor: "error.dark",
                    },
                  },
                }}
              >
                <Cancel sx={{ mr: 1 }} fontSize="small" />
                Reject
              </ToggleButton>
            </ToggleButtonGroup>

            {statusValue === "rejected" && (
              <>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700 }}
                  gutterBottom
                >
                  Rejection Reason *
                </Typography>

                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Explain why this review is being rejected..."
                  value={statusReason}
                  onChange={(event) => setStatusReason(event.target.value)}
                  slotProps={{
                    htmlInput: {
                      maxLength: 1000,
                    },
                  }}
                  helperText={
                    `${statusReason.length}/1000` +
                    (!statusReason.trim() ? " — Reason is required" : "")
                  }
                  error={!statusReason.trim() || statusReason.length > 1000}
                />

                <Alert severity="warning" sx={{ mt: 2 }}>
                  The customer will see this reason. Be clear and respectful.
                </Alert>
              </>
            )}

            {statusValue === "approved" && (
              <Alert severity="success">
                This review will become publicly visible on the property page.
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={closeStatus} disabled={statusSubmitting}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color={statusValue === "approved" ? "success" : "error"}
            startIcon={<PublishedWithChanges />}
            onClick={submitStatus}
            disabled={
              statusSubmitting ||
              (statusValue === "rejected" &&
                (!statusReason.trim() || statusReason.length > 1000))
            }
          >
            {statusSubmitting
              ? "Updating..."
              : statusValue === "approved"
                ? "Approve Review"
                : "Reject Review"}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default ManagePropertyReviews;
