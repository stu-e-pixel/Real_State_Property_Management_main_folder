import api from "./api";
import type {
  CreateRentalApplicationData,
  UpdateRentalApplicationData,
  RentalActionData,
  GetRentalApplicationsResponse,
  GetRentalApplicationResponse,
  RentalMutationResponse,
} from "../typescript/type/rental.types";



const rentalService = {
 
  createRentalApplication: async (
    data: CreateRentalApplicationData
  ): Promise<RentalMutationResponse> => {
    const response = await api.post<RentalMutationResponse>(
    "/v10/api/createrentel",
      data
    );
    return response.data;
  },

  
  updateRentalApplication: async (
    id: string,
    data: UpdateRentalApplicationData
  ): Promise<RentalMutationResponse> => {
    const response = await api.put<RentalMutationResponse>(
      `/v10/api/update/${id}`,
      data
    );
    return response.data;
  },

 
  getMyRentalApplications: async (): Promise<GetRentalApplicationsResponse> => {
    const response = await api.get<GetRentalApplicationsResponse>(
      "/v10/api/my-applications"
    );
    return response.data;
  },

  
  withdrawRentalApplication: async (
    id: string
  ): Promise<RentalMutationResponse> => {
    const response = await api.patch<RentalMutationResponse>(
      `/v10/api/withdraw/${id}`
    );
    return response.data;
  },

  
  getOwnerRentalApplications: async (): Promise<GetRentalApplicationsResponse> => {
    const response = await api.get<GetRentalApplicationsResponse>(
      "/v10/api/owner/all"
    );
    return response.data;
  },

  
  getAgentRentalApplications: async (): Promise<GetRentalApplicationsResponse> => {
    const response = await api.get<GetRentalApplicationsResponse>(
      "/v10/api/agent/all"
    );
    return response.data;
  },

 
  getRentalApplicationById: async (
    id: string
  ): Promise<GetRentalApplicationResponse> => {
    const response = await api.get<GetRentalApplicationResponse>(
      `/v10/api/${id}`
    );
    return response.data;
  },

 
  rentalApplicationAction: async (
    data: RentalActionData
  ): Promise<RentalMutationResponse> => {
    const { id, action, rejectionReason } = data;
    const response = await api.patch<RentalMutationResponse>(
      `/v10/api/action/${id}`,
      { action, rejectionReason }
    );
    return response.data;
  },
};

export default rentalService;