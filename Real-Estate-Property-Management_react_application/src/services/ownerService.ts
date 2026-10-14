import api from "./api";
import type {
  Owner,
  OwnerRegisterData,
  UpdateOwnerProfileData,
  GetAllOwnersResponse,
  GetOwnerResponse,
  UpdateOwnerStatusResponse,
  ApiResponse,
  AccountStatus,
} from "../typescript/type/owner.types";

const buildFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    // Image array
    if (
      key === "image" &&
      Array.isArray(value) &&
      value[0] instanceof File
    ) {
      formData.append("image", value[0]);
      return;
    }

    // FileList
    if (
      key === "image" &&
      value instanceof FileList &&
      value.length > 0
    ) {
      formData.append("image", value[0]);
      return;
    }

    // Ignore undefined/null
    if (value === undefined || value === null) {
      return;
    }

    // Object / Array
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    // String / Number / Boolean
    formData.append(key, String(value));
  });

  return formData;
};

const ownerService = {
  createOwner: async (data: OwnerRegisterData): Promise<ApiResponse<Owner>> => {
    const formData = buildFormData(data as unknown as Record<string, unknown>);
    const response = await api.post<ApiResponse<Owner>>(
      "/v8/api/createowner",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<Owner>> => {
    const response = await api.get<ApiResponse<Owner>>("/v8/api/getprofile");
    return response.data;
  },

  updateProfile: async (
    data: UpdateOwnerProfileData
  ): Promise<ApiResponse<Owner>> => {
    const formData = buildFormData(data as unknown as Record<string, unknown>);
    const response = await api.put<ApiResponse<Owner>>(
      "/v8/api/profile/update",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(
      "/v8/api/change-password",
      data
    );
    return response.data;
  },

  getAllOwners: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<GetAllOwnersResponse> => {
    const response = await api.get<GetAllOwnersResponse>(
      "/v8/api/admin/owners/allowners",
      { params }
    );
    return response.data;
  },

  getOwnerById: async (id: string): Promise<GetOwnerResponse> => {
    const response = await api.get<GetOwnerResponse>(
      `/v8/api/admin/owners/${id}`
    );
    return response.data;
  },

  updateOwnerStatus: async (
    id: string,
    data: { status: AccountStatus }
  ): Promise<UpdateOwnerStatusResponse> => {
    const response = await api.patch<UpdateOwnerStatusResponse>(
      `/v8/api/admin/owners/update/${id}/status`,
      data
    );
    return response.data;
  },

  deleteOwner: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(
      `/v8/api/admin/owners/delete/${id}`
    );
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.get<ApiResponse>("/v8/api/logout");
    return response.data;
  },
};

export default ownerService;