import api from "./api";
import type {
  CreateReviewData,
  UpdateReviewData,
  ReviewActionData,
  GetReviewsResponse,
  GetPropertyReviewsResponse,
  GetReviewResponse,
  ReviewMutationResponse,
  DeleteReviewResponse,
} from "../typescript/type/review.types";

const BASE = "/v6/api"; 

const reviewService = {
  
  createReview: async (
    data: CreateReviewData
  ): Promise<ReviewMutationResponse> => {
    const response = await api.post<ReviewMutationResponse>(
      `${BASE}/reviews/create`,
      data
    );
    return response.data;
  },

 
  getMyReviews: async (): Promise<GetReviewsResponse> => {
    const response = await api.get<GetReviewsResponse>(
      `${BASE}/reviews/my`
    );
    return response.data;
  },

  
  updateReview: async (
    data: UpdateReviewData
  ): Promise<ReviewMutationResponse> => {
    const response = await api.put<ReviewMutationResponse>(
      `${BASE}/reviews/update`,
      data
    );
    return response.data;
  },

  
  getPropertyReviews: async (
    propertyId: string
  ): Promise<GetPropertyReviewsResponse> => {
    const response = await api.get<GetPropertyReviewsResponse>(
      `${BASE}/reviews/property/${propertyId}`
    );
    return response.data;
  },

 
  getAllReviews: async (params?: {
    status?: string;
    rating?: number;
    property?: string;
  }): Promise<GetReviewsResponse> => {
    const response = await api.get<GetReviewsResponse>(
      `${BASE}/reviews/admin/all`,
      { params }
    );
    return response.data;
  },

 
  getPendingReviews: async (): Promise<GetReviewsResponse> => {
    const response = await api.get<GetReviewsResponse>(
      `${BASE}/reviews/admin/pending`
    );
    return response.data;
  },

  
  reviewAction: async (
    data: ReviewActionData
  ): Promise<ReviewMutationResponse> => {
    const response = await api.put<ReviewMutationResponse>(
      `${BASE}/reviews/admin/action`,
      data
    );
    return response.data;
  },

 
  getReviewById: async (id: string): Promise<GetReviewResponse> => {
    const response = await api.get<GetReviewResponse>(
      `${BASE}/reviews/${id}`
    );
    return response.data;
  },


  deleteReview: async (id: string): Promise<DeleteReviewResponse> => {
    const response = await api.delete<DeleteReviewResponse>(
      `${BASE}/reviews/${id}`
    );
    return response.data;
  },

 
getOwnerReviews: async (): Promise<GetReviewsResponse> => {
  const response = await api.get<GetReviewsResponse>(
    `${BASE}/reviews/owner/my-properties`
  );
  return response.data;
},


getAgentReviews: async (): Promise<GetReviewsResponse> => {
  const response = await api.get<GetReviewsResponse>(
    `${BASE}/reviews/agent/my-properties`
  );
  return response.data;
},


replyToReview: async (
  id: string,
  reply: string
): Promise<ReviewMutationResponse> => {
  const response = await api.put<ReviewMutationResponse>(
    `${BASE}/reviews/${id}/reply`,
    { reply }
  );
  return response.data;
},


updateReviewStatusByOwner: async (
  id: string,
  status: "approved" | "rejected",
  reason?: string
): Promise<ReviewMutationResponse> => {
  const response = await api.put<ReviewMutationResponse>(
    `${BASE}/reviews/${id}/status`,
    { status, reason }
  );
  return response.data;
},
};

export default reviewService;