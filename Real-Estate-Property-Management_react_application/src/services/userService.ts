import api from "./api";
import type {
  GetAllUsersResponse,
  GetUserResponse,
  UpdateUserStatusResponse,
  ApiResponse,
  AccountStatus,
} from "../typescript/type/user.types";

const userService = {
  
  getAllUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    isEmailVerified?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<GetAllUsersResponse> => {
    const response = await api.get<GetAllUsersResponse>(
      "/v1/api/admin/users",
      { params }
    );
    return response.data;
  },

  
  getUserById: async (id: string): Promise<GetUserResponse> => {
    const response = await api.get<GetUserResponse>(
      `/v1/api/admin/users/${id}`
    );
    return response.data;
  },

  
  updateUserStatus: async (
    id: string,
    data: { status: AccountStatus }
  ): Promise<UpdateUserStatusResponse> => {
    const response = await api.patch<UpdateUserStatusResponse>(
      `/v1/api/admin/users/status/${id}`,
      data
    );
    return response.data;
  },

  
  deleteUser: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(
      `/v1/api/admin/user/delete/${id}`
    );
    return response.data;
  },
};

export default userService;