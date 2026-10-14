import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Skeleton,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";
import {
  Star,
  Delete,
  Edit,
  Home,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MainLayout from "../../components/layout/MainLayout";
import { reviewSchema } from "../../utils/validations";
import {
  getMyReviews,
  updateReview,
  deleteReview,
} from "../../features/review/reviewSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/useAppDispatch";
import type {
  Review,
  ReviewFormValues,
} from "../../typescript/type/review.types";

// =====================================================
// STATUS COLORS
// =====================================================

const STATUS_COLORS: Record<
  string,
  "default" | "success" | "error" | "warning"
> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

// =====================================================
// TYPE GUARDS
// =====================================================

const getPropertyTitle = (
  property: Review["property"],
): string => {
  if (
    typeof property === "object" &&
    property !== null &&
    "title" in property &&
    typeof property.title === "string"
  ) {
    return property.title;
  }

  return "Property";
};

// =====================================================
// PAGE
// =====================================================

const MyReviews = () => {
  const dispatch = useAppDispatch();

  const { reviews, loading } = useAppSelector(
    (state) => state.review,
  );

  const [tab, setTab] = useState<string>("all");
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Review | null>(null);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  useEffect(() => {
    dispatch(getMyReviews());
  }, [dispatch]);

  // =====================================================
  // EDIT REVIEW
  // =====================================================

  const openEdit = (review: Review): void => {
    setEditTarget(review);

    reset({
      rating: review.rating,
      comment: review.comment,
    });

    setEditOpen(true);
  };

  const closeEdit = (): void => {
    if (saving || isSubmitting) return;

    setEditOpen(false);
    setEditTarget(null);

    reset({
      rating: 5,
      comment: "",
    });
  };

  const submitEdit = async (
    data: ReviewFormValues,
  ): Promise<void> => {
    if (!editTarget || saving) return;

    setSaving(true);

    try {
      const result = await dispatch(
        updateReview({
          id: editTarget._id,
          rating: data.rating,
          comment: data.comment.trim(),
        }),
      );

      if (updateReview.fulfilled.match(result)) {
        setEditOpen(false);
        setEditTarget(null);

        reset({
          rating: 5,
          comment: "",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE REVIEW
  // =====================================================

  const handleDelete = async (id: string): Promise<void> => {
    if (
      deletingIds.includes(id) ||
      !window.confirm("Delete this review permanently?")
    ) {
      return;
    }

    setDeletingIds((previous) => [...previous, id]);

    try {
      await dispatch(deleteReview(id));
    } finally {
      setDeletingIds((previous) =>
        previous.filter((reviewId) => reviewId !== id),
      );
    }
  };

  // =====================================================
  // FILTERS AND COUNTS
  // =====================================================

  const filteredReviews =
    tab === "all"
      ? reviews
      : reviews.filter((review) => review.status === tab);

  const counts = {
    all: reviews.length,
    pending: reviews.filter(
      (review) => review.status === "pending",
    ).length,
    approved: reviews.filter(
      (review) => review.status === "approved",
    ).length,
    rejected: reviews.filter(
      (review) => review.status === "rejected",
    ).length,
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <MainLayout>
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
        }}
      >
        {/* Header */}
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
            <Typography
              variant="h5"
              sx={{ fontWeight: 700 }}
            >
              My Reviews
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Reviews you've submitted for properties
            </Typography>
          </Box>

          <Chip
            icon={<Star />}
            label={`${reviews.length} Total`}
            color="warning"
            variant="outlined"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Status Tabs */}
        <Tabs
          value={tab}
          onChange={(_event, value: string) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab value="all" label={`All (${counts.all})`} />
          <Tab
            value="pending"
            label={`Pending (${counts.pending})`}
          />
          <Tab
            value="approved"
            label={`Approved (${counts.approved})`}
          />
          <Tab
            value="rejected"
            label={`Rejected (${counts.rejected})`}
          />
        </Tabs>

        {/* Loading State */}
        {loading && reviews.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={item}
                variant="rounded"
                height={140}
                sx={{ borderRadius: 3 }}
              />
            ))}
          </Box>
        ) : filteredReviews.length === 0 ? (
          /* Empty State */
          <Box
            sx={{
              py: 8,
              textAlign: "center",
            }}
          >
            <Star
              sx={{
                fontSize: 80,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography color="text.secondary">
              No reviews in this category.
            </Typography>
          </Box>
        ) : (
          /* Reviews List */
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
                  width: {
                    xs: "100%",
                    md: "calc(50% - 12px)",
                  },
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
                    {/* Property and Status */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <Home
                          fontSize="small"
                          color="action"
                        />

                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700 }}
                          noWrap
                        >
                          {getPropertyTitle(review.property)}
                        </Typography>
                      </Box>

                      <Chip
                        label={review.status}
                        color={
                          STATUS_COLORS[review.status] ??
                          "default"
                        }
                        size="small"
                      />
                    </Box>

                    {/* Rating */}
                    <Rating
                      value={review.rating}
                      readOnly
                      size="small"
                      sx={{ mb: 1 }}
                    />

                    {/* Comment */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {review.comment}
                    </Typography>

                    {/* Admin Rejection Reason */}
                    {review.reason && (
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={`Admin: ${review.reason}`}
                          color="error"
                          size="small"
                          variant="outlined"
                          sx={{
                            maxWidth: "100%",
                            "& .MuiChip-label": {
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            },
                          }}
                        />
                      </Box>
                    )}

                    {/* Created Date */}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 1,
                      }}
                    >
                      {new Date(review.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>

                  <Divider />

                  {/* Actions */}
                  <CardActions
                    sx={{
                      justifyContent: "flex-end",
                      p: 1.5,
                    }}
                  >
                    {review.status !== "rejected" && (
                      <Tooltip title="Edit">
                        <span>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => openEdit(review)}
                            disabled={saving || deletingIds.includes(review._id)}
                            aria-label="Edit review"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
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
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Edit Review Dialog */}
      <Dialog
        open={editOpen}
        onClose={closeEdit}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 },
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 700 }}
        >
          Edit Review
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box
              component="form"
              id="edit-review-form"
              onSubmit={handleSubmit(submitEdit)}
            >
              {/* Rating Field */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Rating
                </Typography>

                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <Rating
                        name={field.name}
                        value={field.value}
                        onChange={(_event, value) =>
                          field.onChange(value ?? 0)
                        }
                        onBlur={field.onBlur}
                        ref={field.ref}
                        size="large"
                      />

                      {errors.rating && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            display: "block",
                            mt: 0.5,
                          }}
                        >
                          {errors.rating.message}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
              </Box>

              {/* Comment Field */}
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Comment
              </Typography>

              <Controller
                name="comment"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    multiline
                    rows={5}
                    fullWidth
                    placeholder="Share your experience..."
                    error={!!error}
                    helperText={error?.message}
                    slotProps={{
                      
                    }}
                  />
                )}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            gap: 1,
          }}
        >
          <Button
            onClick={closeEdit}
            disabled={saving || isSubmitting}
          >
            Cancel
          </Button>

          <LoadingButton
            variant="contained"
            type="submit"
            form="edit-review-form"
            loading={saving || isSubmitting}
          >
            Save Changes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default MyReviews;