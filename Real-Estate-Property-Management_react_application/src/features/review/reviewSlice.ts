import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import reviewService from "../../services/reviewService";
import type {
  ReviewState,
  Review,
  CreateReviewData,
  UpdateReviewData,
  ReviewActionData,
  GetReviewsResponse,
  GetPropertyReviewsResponse,
  ReviewMutationResponse,
  ReplyToReviewData,
} from "../../typescript/type/review.types";
import toast from "react-hot-toast";

const initialState: ReviewState = {
  reviews: [],
  propertyReviews: [],
  propertyStatistics: null,
  review: null,
  loading: false,
  error: null,
};

export const createReview = createAsyncThunk<
  ReviewMutationResponse,
  CreateReviewData,
  { rejectValue: string }
>("review/create", async (data, { rejectWithValue }) => {
  try {
    return await reviewService.createReview(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to submit review",
    );
  }
});

export const getMyReviews = createAsyncThunk<
  GetReviewsResponse,
  void,
  { rejectValue: string }
>("review/getMine", async (_, { rejectWithValue }) => {
  try {
    return await reviewService.getMyReviews();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch your reviews",
    );
  }
});

export const updateReview = createAsyncThunk<
  ReviewMutationResponse,
  UpdateReviewData,
  { rejectValue: string }
>("review/update", async (data, { rejectWithValue }) => {
  try {
    return await reviewService.updateReview(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update review",
    );
  }
});

export const getPropertyReviews = createAsyncThunk<
  GetPropertyReviewsResponse,
  string,
  { rejectValue: string }
>("review/getByProperty", async (propertyId, { rejectWithValue }) => {
  try {
    return await reviewService.getPropertyReviews(propertyId);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch property reviews",
    );
  }
});

export const getAllReviews = createAsyncThunk<
  GetReviewsResponse,
  { status?: string; rating?: number; property?: string } | undefined,
  { rejectValue: string }
>("review/getAll", async (params, { rejectWithValue }) => {
  try {
    return await reviewService.getAllReviews(params);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch reviews",
    );
  }
});

export const getPendingReviews = createAsyncThunk<
  GetReviewsResponse,
  void,
  { rejectValue: string }
>("review/getPending", async (_, { rejectWithValue }) => {
  try {
    return await reviewService.getPendingReviews();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch pending reviews",
    );
  }
});

export const reviewAction = createAsyncThunk<
  ReviewMutationResponse,
  ReviewActionData,
  { rejectValue: string }
>("review/action", async (data, { rejectWithValue }) => {
  try {
    return await reviewService.reviewAction(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to process action",
    );
  }
});

export const getReviewById = createAsyncThunk<
  Review,
  string,
  { rejectValue: string }
>("review/getById", async (id, { rejectWithValue }) => {
  try {
    const response = await reviewService.getReviewById(id);
    return response.review;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch review",
    );
  }
});

export const deleteReview = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("review/delete", async (id, { rejectWithValue }) => {
  try {
    await reviewService.deleteReview(id);
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete review",
    );
  }
});

export const getOwnerReviews = createAsyncThunk<
  GetReviewsResponse,
  void,
  { rejectValue: string }
>("review/getOwnerReviews", async (_, { rejectWithValue }) => {
  try {
    return await reviewService.getOwnerReviews();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch reviews",
    );
  }
});

export const getAgentReviews = createAsyncThunk<
  GetReviewsResponse,
  void,
  { rejectValue: string }
>("review/getAgentReviews", async (_, { rejectWithValue }) => {
  try {
    return await reviewService.getAgentReviews();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch reviews",
    );
  }
});

export const replyToReview = createAsyncThunk<
  ReviewMutationResponse,
  ReplyToReviewData,
  { rejectValue: string }
>("review/reply", async ({ id, reply }, { rejectWithValue }) => {
  try {
    return await reviewService.replyToReview(id, reply);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to add reply",
    );
  }
});

export const updateReviewStatusByOwner = createAsyncThunk<
  ReviewMutationResponse,
  { id: string; status: "approved" | "rejected"; reason?: string },
  { rejectValue: string }
>("review/updateStatusByOwner", async (data, { rejectWithValue }) => {
  try {
    return await reviewService.updateReviewStatusByOwner(
      data.id,
      data.status,
      data.reason,
    );
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update review status",
    );
  }
});

const replaceReview = (state: ReviewState, updated: Review): void => {
  const index = state.reviews.findIndex((r) => r._id === updated._id);
  if (index !== -1) state.reviews[index] = updated;
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
    clearSelectedReview: (state) => {
      state.review = null;
    },
    clearPropertyReviews: (state) => {
      state.propertyReviews = [];
      state.propertyStatistics = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.review) {
          state.reviews = [action.payload.review, ...state.reviews];
        }
        toast.success("Review submitted for moderation");
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to submit review");
      })

      .addCase(getMyReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.data ?? action.payload.reviews ?? [];
      })
      .addCase(getMyReviews.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch reviews");
      })

      .addCase(getPropertyReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPropertyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.propertyReviews = action.payload.data ?? [];
        state.propertyStatistics = action.payload.statistics ?? null;
      })
      .addCase(getPropertyReviews.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch property reviews");
      })

      .addCase(getAllReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews ?? action.payload.data ?? [];
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch reviews");
      })

      .addCase(getPendingReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPendingReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews ?? action.payload.data ?? [];
      })
      .addCase(getPendingReviews.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch pending reviews");
      })

      .addCase(reviewAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(reviewAction.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.review) {
          replaceReview(state, action.payload.review);

          if (state.reviews.length > 0) {
            state.reviews = state.reviews.map((r) =>
              r._id === action.payload.review?._id ? action.payload.review! : r,
            );
          }
        }
        toast.success(action.payload.message || "Action completed");
      })
      .addCase(reviewAction.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to process action");
      })

      .addCase(getReviewById.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getReviewById.fulfilled,
        (state, action: PayloadAction<Review>) => {
          state.loading = false;
          state.review = action.payload;
        },
      )
      .addCase(getReviewById.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch review");
      })

      .addCase(updateReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.review) {
          replaceReview(state, action.payload.review);
        }
        toast.success("Review updated successfully");
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to update review");
      })

      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
        toast.success("Review deleted successfully");
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to delete review");
      })

      .addCase(getOwnerReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOwnerReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews ?? action.payload.data ?? [];
      })
      .addCase(getOwnerReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to fetch reviews");
      })

      .addCase(getAgentReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAgentReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews ?? action.payload.data ?? [];
      })
      .addCase(getAgentReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to fetch reviews");
      })
      .addCase(replyToReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(replyToReview.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.review) {
          replaceReview(state, action.payload.review);
        }
        toast.success("Reply added successfully!");
      })
      .addCase(replyToReview.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to add reply");
      })

      .addCase(updateReviewStatusByOwner.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReviewStatusByOwner.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.review) {
          replaceReview(state, action.payload.review);
        }
        toast.success(action.payload.message || "Status updated");
      })
      .addCase(updateReviewStatusByOwner.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to update status");
      });
  },
});

export const { clearReviewError, clearSelectedReview, clearPropertyReviews } =
  reviewSlice.actions;
export default reviewSlice.reducer;
