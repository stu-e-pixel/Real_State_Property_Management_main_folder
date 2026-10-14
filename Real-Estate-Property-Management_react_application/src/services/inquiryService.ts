import api from "./api";
import type {
  CreateInquiryData,
  UpdateInquiryData,
  UpdateInquiryStatusData,
  ReplyInquiryData,
  CreateInquiryResponse,
  GetInquiriesResponse,
  GetInquiryResponse,
  UpdateInquiryResponse,
  DeleteInquiryResponse,
} from "../typescript/type/inquiry.types";

const inquiryService = {
  // ---------------- CREATE (customer) ----------------
  createInquiry: async (
    data: CreateInquiryData
  ): Promise<CreateInquiryResponse> => {
    const response = await api.post<CreateInquiryResponse>(
      "/v4/api/createInquiry",
      data
    );
    return response.data;
  },

  // ---------------- UPDATE (customer) ----------------
  updateInquiry: async (
    id: string,
    data: UpdateInquiryData
  ): Promise<UpdateInquiryResponse> => {
    const response = await api.put<UpdateInquiryResponse>(
      `/v4/api/updateInquiry/${id}`,
      data
    );
    return response.data;
  },

  // ---------------- MY INQUIRIES (customer) ----------------
  getMyInquiries: async (): Promise<GetInquiriesResponse> => {
    const response = await api.get<GetInquiriesResponse>(
      "/v4/api/getInquiry"
    );
    return response.data;
  },

  // ---------------- BY ID (any role) ----------------
  getInquiryById: async (id: string): Promise<GetInquiryResponse> => {
    const response = await api.get<GetInquiryResponse>(
      `/v4/api/getInquiryById/${id}`
    );
    return response.data;
  },

  // ---------------- AGENT INQUIRIES ----------------
  getAgentInquiries: async (): Promise<GetInquiriesResponse> => {
    const response = await api.get<GetInquiriesResponse>(
      "/v4/api/getAgentInquiries"
    );
    return response.data;
  },

  // ---------------- ALL INQUIRIES (admin) ----------------
  getAllInquiries: async (): Promise<GetInquiriesResponse> => {
    const response = await api.get<GetInquiriesResponse>(
      "/v4/api/getAllInquiry"
    );
    return response.data;
  },

  // ---------------- UPDATE STATUS (agent) ----------------
  updateInquiryStatus: async (
    id: string,
    data: UpdateInquiryStatusData
  ): Promise<UpdateInquiryResponse> => {
    const response = await api.put<UpdateInquiryResponse>(
      `/v4/api/updateInquiryStatus/${id}`,
      data
    );
    return response.data;
  },

  // ---------------- REPLY (agent) ----------------
  replyToInquiry: async (
    id: string,
    data: ReplyInquiryData
  ): Promise<UpdateInquiryResponse> => {
    const response = await api.patch<UpdateInquiryResponse>(
      `/v4/api/replyToInquiry/${id}`,
      data
    );
    return response.data;
  },

  // ---------------- DELETE ----------------
  deleteInquiry: async (id: string): Promise<DeleteInquiryResponse> => {
    const response = await api.delete<DeleteInquiryResponse>(
      `/v4/api/deleteInquiry/${id}`
    );
    return response.data;
  },

  getOwnerInquiries: async (): Promise<GetInquiriesResponse> => {
  const response = await api.get<GetInquiriesResponse>(
    "/v4/api/owner/inquiries"
  );
  return response.data;
},
};

export default inquiryService;