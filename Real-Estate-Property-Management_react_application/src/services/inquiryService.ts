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
  
  createInquiry: async (
    data: CreateInquiryData
  ): Promise<CreateInquiryResponse> => {
    const response = await api.post<CreateInquiryResponse>(
      "/v4/api/createInquiry",
      data
    );
    return response.data;
  },

  
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

 
  getMyInquiries: async (): Promise<GetInquiriesResponse> => {
    const response = await api.get<GetInquiriesResponse>(
      "/v4/api/getInquiry"
    );
    return response.data;
  },

  
  getInquiryById: async (id: string): Promise<GetInquiryResponse> => {
    const response = await api.get<GetInquiryResponse>(
      `/v4/api/getInquiryById/${id}`
    );
    return response.data;
  },

  
  getAgentInquiries: async (): Promise<GetInquiriesResponse> => {
    const response = await api.get<GetInquiriesResponse>(
      "/v4/api/getAgentInquiries"
    );
    return response.data;
  },

  
  getAllInquiries: async (): Promise<GetInquiriesResponse> => {
    const response = await api.get<GetInquiriesResponse>(
      "/v4/api/getAllInquiry"
    );
    return response.data;
  },

 
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