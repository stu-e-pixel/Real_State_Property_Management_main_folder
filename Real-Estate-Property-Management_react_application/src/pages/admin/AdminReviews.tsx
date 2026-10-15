/* eslint-disable react-hooks/incompatible-library */
import { useCallback, useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Divider,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Rating,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Skeleton,
} from "@mui/material";
import {
  Search,
  Refresh,
  CheckCircle,
  Cancel,
  Delete,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MainLayout from "../../components/layout/MainLayout";
import { reviewActionSchema } from "../../utils/validations";
import {
  getAllReviews,
  getPendingReviews,
  reviewAction,
  deleteReview,
} from "../../features/review/reviewSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type {
  Review,
  ReviewActionFormValues,
} from "../../typescript/type/review.types";

const STATUS_COLORS: Record<
  string,
  "default" | "success" | "error" | "warning"
> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

const AdminReviews = () => {
  const dispatch = useAppDispatch();
  const { reviews, loading } = useAppSelector((state) => state.review);

  const [tab, setTab] = useState<"all" | "pending">("all");
  const [search, setSearch] = useState("");
  const [actionOpen, setActionOpen] = useState(false);
  const [actionTarget, setActionTarget] = useState<Review | null>(null);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const { control, handleSubmit, reset, watch } =
    useForm<ReviewActionFormValues>({
      resolver: yupResolver(reviewActionSchema),
      defaultValues: {
        action: "approve",
        reason: "",
      },
    });

  const selectedAction = watch("action");

  const fetchReviews = useCallback((): void => {
    if (tab === "pending") {
      dispatch(getPendingReviews());
    } else {
      dispatch(getAllReviews());
    }
  }, [dispatch, tab]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const openAction = (review: Review, action: "approve" | "reject"): void => {
    setActionTarget(review);

    reset({
      action,
      reason: "",
    });

    setActionOpen(true);
  };

  const closeAction = (): void => {
    if (submittingAction) return;

    setActionOpen(false);
    setActionTarget(null);

    reset({
      action: "approve",
      reason: "",
    });
  };

  const submitAction = async (data: ReviewActionFormValues): Promise<void> => {
    if (!actionTarget || submittingAction) return;

    setSubmittingAction(true);

    try {
      const result = await dispatch(
        reviewAction({
          id: actionTarget._id,
          action: data.action,
          reason: data.reason.trim(),
        }),
      );

      if (reviewAction.fulfilled.match(result)) {
        setActionOpen(false);
        setActionTarget(null);

        reset({
          action: "approve",
          reason: "",
        });

        fetchReviews();
      }
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (deletingIds.includes(id) || !window.confirm("Delete this review?")) {
      return;
    }

    setDeletingIds((previous) => [...previous, id]);

    try {
      const result = await dispatch(deleteReview(id));

      if (deleteReview.fulfilled.match(result)) {
        fetchReviews();
      }
    } finally {
      setDeletingIds((previous) =>
        previous.filter((reviewId) => reviewId !== id),
      );
    }
  };

  const searchTerm = search.trim().toLowerCase();

  const filteredReviews = reviews.filter((review) => {
    if (!searchTerm) return true;

    const user =
      typeof review.user === "object" && review.user !== null
        ? review.user
        : null;

    const property =
      typeof review.property === "object" && review.property !== null
        ? review.property
        : null;

    return (
      (user?.name ?? "").toLowerCase().includes(searchTerm) ||
      (user?.email ?? "").toLowerCase().includes(searchTerm) ||
      (property?.title ?? "").toLowerCase().includes(searchTerm) ||
      review.comment.toLowerCase().includes(searchTerm)
    );
  });

  const counts = {
    all: reviews.length,
    pending: reviews.filter((review) => review.status === "pending").length,
    approved: reviews.filter((review) => review.status === "approved").length,
    rejected: reviews.filter((review) => review.status === "rejected").length,
  };

  return (
    <MainLayout>
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
        }}
      >
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
              Review Moderation
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Approve or reject customer reviews
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Chip
              label={`${counts.pending} Pending`}
              color="warning"
              variant="outlined"
            />

            <Chip
              label={`${counts.approved} Approved`}
              color="success"
              variant="outlined"
            />

            <Chip
              label={`${counts.rejected} Rejected`}
              color="error"
              variant="outlined"
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Tabs
          value={tab}
          onChange={(_event, value: "all" | "pending") => setTab(value)}
          sx={{ mb: 3 }}
        >
          <Tab value="all" label={`All (${counts.all})`} />
          <Tab value="pending" label={`Pending (${counts.pending})`} />
        </Tabs>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <TextField
            placeholder="Search by user, property, comment..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Tooltip title="Refresh reviews">
            <span>
              <IconButton
                color="primary"
                onClick={fetchReviews}
                disabled={loading}
                aria-label="Refresh reviews"
              >
                <Refresh />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {loading && reviews.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={item}
                variant="rounded"
                height={70}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Box>
        ) : filteredReviews.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">No reviews found.</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredReviews.map((review) => {
                  const user =
                    typeof review.user === "object" && review.user !== null
                      ? review.user
                      : null;

                  const property =
                    typeof review.property === "object" &&
                    review.property !== null
                      ? review.property
                      : null;

                  return (
                    <TableRow key={review._id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user?.name ?? "Unknown"}
                        </Typography>

                        {user?.email && (
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ maxWidth: 160 }}
                        >
                          {property?.title ?? "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Rating value={review.rating} size="small" readOnly />
                      </TableCell>

                      <TableCell>
                        <Tooltip title={review.comment}>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 220 }}
                          >
                            {review.comment}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={review.status}
                          color={STATUS_COLORS[review.status] ?? "default"}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="caption">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        {review.status === "pending" && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => openAction(review, "approve")}
                                disabled={submittingAction}
                                aria-label="Approve review"
                              >
                                <CheckCircle fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => openAction(review, "reject")}
                                disabled={submittingAction}
                                aria-label="Reject review"
                              >
                                <Cancel fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}

                        <Tooltip title="Delete">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(review._id)}
                              disabled={deletingIds.includes(review._id)}
                              aria-label="Delete review"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={actionOpen}
        onClose={closeAction}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {selectedAction === "approve" ? "Approve Review" : "Reject Review"}
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {actionTarget && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Rating value={actionTarget.rating} readOnly size="small" />

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  }}
                >
                  {actionTarget.comment}
                </Typography>
              </Box>
            )}

            <Box
              component="form"
              id="review-action-form"
              onSubmit={handleSubmit(submitAction)}
            >
              {selectedAction === "reject" && (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    Rejection Reason
                  </Typography>

                  <Controller
                    name="reason"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Explain why this review is being rejected..."
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            gap: 1,
          }}
        >
          <Button onClick={closeAction} disabled={submittingAction}>
            Cancel
          </Button>

          <LoadingButton
            variant="contained"
            type="submit"
            form="review-action-form"
            color={selectedAction === "approve" ? "success" : "error"}
            loading={submittingAction}
          >
            {selectedAction === "approve" ? "Approve" : "Reject"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default AdminReviews;
