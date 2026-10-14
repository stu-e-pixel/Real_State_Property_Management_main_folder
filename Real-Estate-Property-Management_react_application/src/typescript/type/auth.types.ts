export type UserRole = "admin" | "agent" | "owner" | "customer";
export type AccountStatus = "active" | "inactive" | "blocked";
export type UserModel = "User" | "Owner" | "Agent";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  isEmailVerified: boolean;
  image?: string;
  public_id?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
    model: UserModel;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;
  image?: FileList | File[];
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}

export interface ResendOTPData {
  email: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  confirm_password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  image?: FileList | File[];
  address?: string;
}

export interface AuthState {
  user: User | null;
  model: UserModel | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  profile: User | null;
}

export type AuthFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type VerifyEmailFormValues = {
  email: string;
  otp: string;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type ResetPasswordFormValues = {
  password: string;
  confirm_password: string;
};

export type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type UpdateProfileFormValues = {
  name?: string;
  phone?: string;
};

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}