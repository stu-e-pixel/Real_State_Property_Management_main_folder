import { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Avatar,
  Rating,
  Alert,
  Skeleton,
} from "@mui/material";
import { Person } from "@mui/icons-material";

import {
  getPropertyReviews,
  clearPropertyReviews,
} from "../../features/review/reviewSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/useAppDispatch";
import type { Review } from "../../typescript/type/review.types";

interface PropertyReviewsSectionProps {
  propertyId: string;
}

interface PopulatedUser {
  _id: string;
  name: string;
}

const isPopulatedUser = (
  value: Review["user"],
): value is PopulatedUser => {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string"
  );
};

const PropertyReviewsSection = ({
  propertyId,
}: PropertyReviewsSectionProps) => {
  const dispatch = useAppDispatch();

  const {
    propertyReviews,
    propertyStatistics,
    loading,
  } = useAppSelector((state) => state.review);

  useEffect(() => {
    dispatch(getPropertyReviews(propertyId));

    return () => {
      dispatch(clearPropertyReviews());
    };
  }, [dispatch, propertyId]);

  const formatDate = (date: string | Date): string => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString();
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        mt: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Customer Reviews
      </Typography>

      {/* Review Statistics */}
      {propertyStatistics &&
        propertyStatistics.totalReviews > 0 && (
          <Box
            sx={{
              p: 2,
              bgcolor: "action.hover",
              borderRadius: 2,
              mb: 3,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {/* Average Rating */}
            <Box
              sx={{
                flex: "1 1 160px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Typography
                variant="h3"
                color="primary"
                sx={{ fontWeight: 700 }}
              >
                {propertyStatistics.averageRating.toFixed(1)}
              </Typography>

              <Rating
                value={propertyStatistics.averageRating}
                precision={0.5}
                readOnly
              />

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {propertyStatistics.totalReviews} review
                {propertyStatistics.totalReviews !== 1
                  ? "s"
                  : ""}
              </Typography>
            </Box>

            {/* Highest Rating */}
            <Box sx={{ flex: "1 1 100px" }}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Highest
              </Typography>

              <Typography
                variant="body2"
                sx={{ fontWeight: 600 }}
              >
                {propertyStatistics.highestRating} ⭐
              </Typography>
            </Box>

            {/* Lowest Rating */}
            <Box sx={{ flex: "1 1 100px" }}>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Lowest
              </Typography>

              <Typography
                variant="body2"
                sx={{ fontWeight: 600 }}
              >
                {propertyStatistics.lowestRating} ⭐
              </Typography>
            </Box>
          </Box>
        )}

      <Divider sx={{ mb: 2 }} />

      {/* Reviews List */}
      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[1, 2].map((item) => (
            <Skeleton
              key={item}
              variant="rounded"
              height={100}
              animation="wave"
            />
          ))}
        </Box>
      ) : propertyReviews.length === 0 ? (
        <Alert severity="info">
          No reviews yet. Be the first to review this property!
        </Alert>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {propertyReviews.map((review: Review) => {
            const populatedUser = isPopulatedUser(review.user)
              ? review.user
              : null;

            return (
              <Box
                key={review._id}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                }}
              >
                {/* Reviewer Information */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "primary.main",
                      flexShrink: 0,
                    }}
                  >
                    {populatedUser ? (
                      populatedUser.name.charAt(0).toUpperCase() ||
                      <Person fontSize="small" />
                    ) : (
                      <Person fontSize="small" />
                    )}
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700 }}
                    >
                      {populatedUser?.name || "Anonymous"}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {formatDate(review.createdAt)}
                    </Typography>
                  </Box>

                  <Rating
                    value={review.rating}
                    size="small"
                    readOnly
                    precision={1}
                  />
                </Box>

                {/* Review Comment */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  }}
                >
                  {review.comment}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default PropertyReviewsSection;