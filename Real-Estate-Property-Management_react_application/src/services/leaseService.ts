import api from "./api";
import type {
  CreateLeaseData,
  UpdateLeaseData,
  TerminateLeaseData,
  ExpireLeaseData,
  GetLeasesResponse,
  GetAggregatedLeasesResponse,
  GetLeaseResponse,
  LeaseMutationResponse,
  DeleteLeaseResponse,
} from "../typescript/type/lease.types";

const BASE = "/v7/api/lease";

const leaseService = {
 
  createLease: async (
    data: CreateLeaseData
  ): Promise<LeaseMutationResponse> => {
    const response = await api.post<LeaseMutationResponse>(
      `${BASE}/create`,
      data
    );
    return response.data;
  },

  
  getAllLeases: async (): Promise<GetLeasesResponse> => {
    const response = await api.get<GetLeasesResponse>(
      `${BASE}/admin/all`
    );
    return response.data;
  },

 
  getMyLeases: async (): Promise<GetLeasesResponse> => {
    const response = await api.get<GetLeasesResponse>(`${BASE}/my`);
    return response.data;
  },

 
  getOwnerLeases: async (): Promise<GetAggregatedLeasesResponse> => {
    const response = await api.get<GetAggregatedLeasesResponse>(
      `${BASE}/owner`
    );
    return response.data;
  },

  
  getAgentLeases: async (): Promise<GetLeasesResponse> => {
    const response = await api.get<GetLeasesResponse>(`${BASE}/agent`);
    return response.data;
  },

  
  getLeaseById: async (id: string): Promise<GetLeaseResponse> => {
    const response = await api.get<GetLeaseResponse>(`${BASE}/${id}`);
    return response.data;
  },

  
  updateLease: async (
    data: UpdateLeaseData
  ): Promise<LeaseMutationResponse> => {
    const response = await api.put<LeaseMutationResponse>(
      `${BASE}/update`,
      data
    );
    return response.data;
  },

  
  terminateLease: async (
    data: TerminateLeaseData
  ): Promise<LeaseMutationResponse> => {
    const response = await api.put<LeaseMutationResponse>(
      `${BASE}/terminate`,
      data
    );
    return response.data;
  },

  
  expireLease: async (
    data: ExpireLeaseData
  ): Promise<LeaseMutationResponse> => {
    const response = await api.put<LeaseMutationResponse>(
      `${BASE}/expire`,
      data
    );
    return response.data;
  },

  
  deleteLease: async (id: string): Promise<DeleteLeaseResponse> => {
    const response = await api.delete<DeleteLeaseResponse>(
      `${BASE}/${id}`
    );
    return response.data;
  },
};

export default leaseService;