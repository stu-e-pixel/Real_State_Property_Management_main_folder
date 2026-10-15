import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Rating,
  Alert,
  TextField,
} from "@mui/material";
import { Close, Send, Home, Star } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { reviewSchema } from "../../utils/validations";
import { createReview } from "../../features/review/reviewSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/useAppDispatch";
import type {
  ReviewFormValues,
  CreateReviewData,
} from "../../typescript/type/review.types";
import type { Property } from "../../typescript/type/property.types";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  property: Property | null | undefined;
}

const ReviewModal = ({
  open,
  onClose,
  property,
}: ReviewModalProps) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.review);

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
    if (open) {
      reset({
        rating: 5,
        comment: "",
      });
    }
  }, [open, property?._id, reset]);

  const handleClose = () => {
    if (loading || isSubmitting) return;

    reset({
      rating: 5,
      comment: "",
    });

    onClose();
  };

  const onSubmit = async (
    data: ReviewFormValues,
  ): Promise<void> => {
    if (!property?._id) return;

    const payload: CreateReviewData = {
      property: property._id,
      rating: data.rating,
      comment: data.comment.trim(),
    };

    const result = await dispatch(createReview(payload));

    if (createReview.fulfilled.match(result)) {
      reset({
        rating: 5,
        comment: "",
      });

      onClose();
    }
  };

  if (!property) return null;

  const firstImage = property.images?.[0]?.image ?? undefined;
  const isBusy = loading || isSubmitting;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          component="span"
          sx={{ fontWeight: 600 }}
        >
          Write a Review
        </Typography>

        <IconButton
          onClick={handleClose}
          size="small"
          aria-label="Close review dialog"
          disabled={isBusy}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent>
        {/* Property snapshot */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            mb: 3,
            bgcolor: "action.hover",
            borderRadius: 2,
          }}
        >
          <Avatar
            src={firstImage}
            variant="rounded"
            sx={{
              width: 56,
              height: 56,
              flexShrink: 0,
            }}
          >
            <Home />
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700 }}
              noWrap
            >
              {property.title}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {property.propertyType} • {property.purpose}
            </Typography>
          </Box>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          Your review will be visible after admin approval.
        </Alert>

        <Box
          component="form"
          id="review-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Rating */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
                fontWeight: 700,
              }}
            >
              <Star
                fontSize="small"
                color="warning"
              />
              Your Rating
            </Typography>

            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Box>
                  <Rating
                    name={field.name}
                    value={field.value}
                    onChange={(_event, value) => {
                      field.onChange(value ?? 0);
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    size="large"
                    precision={1}
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

          
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                fontWeight: 700,
              }}
            >
              Your Review
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
                  placeholder="Share your experience about this property..."
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
          onClick={handleClose}
          disabled={isBusy}
        >
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          form="review-form"
          variant="contained"
          startIcon={<Send />}
          loading={isBusy}
        >
          Submit Review
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;