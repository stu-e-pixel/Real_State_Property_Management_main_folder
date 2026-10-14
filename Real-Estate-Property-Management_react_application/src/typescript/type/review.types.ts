

export type ReviewStatus = "pending" | "approved" | "rejected";

export type ReviewAction = "approve" | "reject";

// =====================================================
// NESTED SHAPES (from aggregation)
// =====================================================

export interface ReviewPropertyLite {
  _id: string;
  title: string;
}

export interface ReviewUserLite {
  _id: string;
  name: string;
  email?: string;
}

// =====================================================
// ENTITY
// =====================================================

export interface Review {
  _id: string;
  property: ReviewPropertyLite | string;
  user: ReviewUserLite | string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  reason?: string;
  reply?: string;
  repliedAt?: string | null;
  repliedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

// =====================================================
// PAYLOADS
// =====================================================

export interface CreateReviewData {
  property: string;
  rating: number;
  comment: string;
}

export interface ReviewUserLite {
  _id: string;
  name: string;
  email?: string;
  image?: string;
}

export interface UpdateReviewData {
  id: string;
  rating?: number;
  comment?: string;
}

export interface ReviewActionData {
  id: string;
  action: ReviewAction;
  reason?: string;
}

// =====================================================
// RESPONSES
// =====================================================

export interface GetReviewsResponse {
  success: boolean;
  message?: string;
  count?: number;
  reviews?: Review[];
  data?: Review[];
}

export interface GetPropertyReviewsResponse {
  success: boolean;
  message?: string;
  property: ReviewPropertyLite;
  statistics: {
    totalReviews: number;
    averageRating: number;
    highestRating: number;
    lowestRating: number;
  };
  data: Review[];
}

export interface GetReviewResponse {
  success: boolean;
  message?: string;
  review: Review;
}

export interface ReviewMutationResponse {
  success: boolean;
  message: string;
  review?: Review;
}

export interface DeleteReviewResponse {
  success: boolean;
  message: string;
}

// =====================================================
// STATE
// =====================================================

export interface ReviewState {
  reviews: Review[];
  propertyReviews: Review[];
  propertyStatistics: GetPropertyReviewsResponse["statistics"] | null;
  review: Review | null;
  loading: boolean;
  error: string | null;
}

// =====================================================
// FORM VALUES
// =====================================================

export interface ReviewFormValues {
  rating: number;
  comment: string;
}

export interface ReviewPropertyLite {
  _id: string;
  title: string;
  propertyType?: string;
  purpose?: string;
  images?: { image: string; public_id: string }[];   // ✅ ADD THIS
}

export interface UpdateReviewFormValues {
  rating: number;
  comment: string;
}

export interface ReviewActionFormValues {
  action: ReviewAction;
  reason: string;
}

export interface ReplyToReviewData {
  id: string;
  reply: string;
}