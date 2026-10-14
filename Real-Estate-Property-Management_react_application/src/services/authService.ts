import api from "./api";
import { tokenStorage } from "../utils/tokenStorage";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  VerifyEmailData,
  ResendOTPData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  UpdateProfileData,
  ApiResponse,
  User,
} from "../typescript/type/auth.types";

const buildFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (key === "image" && Array.isArray(value) && value[0] instanceof File) {
      formData.append("image", value[0]);
    } else if (key === "image" && value instanceof FileList && value.length) {
      formData.append("image", value[0]);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  return formData;
};

const authService = {
  register: async (data: RegisterData): Promise<ApiResponse<User>> => {
    const formData = buildFormData(data as unknown as Record<string, unknown>);
    const response = await api.post<ApiResponse<User>>(
      "/v1/api/register",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailData): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>("/v1/api/verify-email", data);
    return response.data;
  },

  resendOTP: async (data: ResendOTPData): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(
      "/v1/api/resend-email-otp",
      data
    );
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/v1/api/login", credentials);
    const { data } = response.data;

    if (data.accessToken) {
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      tokenStorage.setUser(data.user, data.model);
    }

    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.get("/v1/api/logout");
    } finally {
      tokenStorage.clearAll();
    }
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>("/v1/api/getprofile");
    return response.data;
  },

  updateProfile: async (
    data: UpdateProfileData
  ): Promise<ApiResponse<User>> => {
    const formData = buildFormData(data as unknown as Record<string, unknown>);
    const response = await api.put<ApiResponse<User>>(
      "/v1/api/profile/update",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(
      "/v1/api/change-password",
      data
    );
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(
      "/v1/api/forgot-password",
      data
    );
    return response.data;
  },

  resetPassword: async (
    id: string,
    token: string,
    data: ResetPasswordData
  ): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(
      `/v1/api/reset-password/${id}/${token}`,
      data
    );
    return response.data;
  },
};

export default authService;