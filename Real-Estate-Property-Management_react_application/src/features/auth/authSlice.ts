import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit"
import authService from "../../services/authService";
import { tokenStorage } from "../../utils/tokenStorage";
import type {
  AuthState,
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
} from "../../typescript/type/auth.types";
import toast from "react-hot-toast";

const initialState: AuthState = {
  user: tokenStorage.getUser(),
  model: tokenStorage.getModel(),
  isAuthenticated: tokenStorage.isAuthenticated(),
  loading: false,
  error: null,
  profile: null,
};

export const login = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    return await authService.login(credentials);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const register = createAsyncThunk<
  ApiResponse<User>,
  RegisterData,
  { rejectValue: string }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    return await authService.register(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Registration failed"
    );
  }
});

export const verifyEmail = createAsyncThunk<
  ApiResponse,
  VerifyEmailData,
  { rejectValue: string }
>("auth/verifyEmail", async (data, { rejectWithValue }) => {
  try {
    return await authService.verifyEmail(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Verification failed");
  }
});

export const resendOTP = createAsyncThunk<
  ApiResponse,
  ResendOTPData,
  { rejectValue: string }
>("auth/resendOTP", async (data, { rejectWithValue }) => {
  try {
    return await authService.resendOTP(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to resend OTP"
    );
  }
});

export const logout = createAsyncThunk<void, void>(
  "auth/logout",
  async () => {
    await authService.logout();
  }
);

export const getProfile = createAsyncThunk<
  ApiResponse<User>,
  void,
  { rejectValue: string }
>("auth/getProfile", async (_, { rejectWithValue }) => {
  try {
    return await authService.getProfile();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch profile"
    );
  }
});

export const updateProfile = createAsyncThunk<
  ApiResponse<User>,
  UpdateProfileData,
  { rejectValue: string }
>("auth/updateProfile", async (data, { rejectWithValue }) => {
  try {
    return await authService.updateProfile(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update profile"
    );
  }
});

export const changePassword = createAsyncThunk<
  ApiResponse,
  ChangePasswordData,
  { rejectValue: string }
>("auth/changePassword", async (data, { rejectWithValue }) => {
  try {
    return await authService.changePassword(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to change password"
    );
  }
});

export const forgotPassword = createAsyncThunk<
  ApiResponse,
  ForgotPasswordData,
  { rejectValue: string }
>("auth/forgotPassword", async (data, { rejectWithValue }) => {
  try {
    return await authService.forgotPassword(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to send reset link"
    );
  }
});

export const resetPassword = createAsyncThunk<
  ApiResponse,
  { id: string; token: string; data: ResetPasswordData },
  { rejectValue: string }
>("auth/resetPassword", async ({ id, token, data }, { rejectWithValue }) => {
  try {
    return await authService.resetPassword(id, token, data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to reset password"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.model = null;
      state.isAuthenticated = false;
      state.profile = null;
      tokenStorage.clearAll();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.data.user;
          state.model = action.payload.data.model;
          toast.success("Login successful!");
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
        toast.error(action.payload ?? "Login failed");
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        toast.success(
          "Registration successful! Please check your email for OTP."
        );
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
        toast.error(action.payload ?? "Registration failed");
      })

      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        toast.success("Email verified successfully!");
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Verification failed";
        toast.error(action.payload ?? "Verification failed");
      })

      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
        toast.success("New OTP sent successfully!");
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to resend OTP");
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.model = null;
        state.isAuthenticated = false;
        state.profile = null;
        toast.success("Logged out successfully");
      })

      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getProfile.fulfilled,
        (state, action: PayloadAction<ApiResponse<User>>) => {
          state.loading = false;
          state.profile = action.payload.data ?? null;
        }
      )
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<ApiResponse<User>>) => {
          state.loading = false;
          state.profile = action.payload.data ?? null;
          if (action.payload.data && state.user) {
            state.user = { ...state.user, ...action.payload.data };
            tokenStorage.setUser(state.user, state.model);
          }
          toast.success("Profile updated successfully!");
        }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to update profile");
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        toast.success("Password changed successfully!");
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to change password");
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        toast.success("Password reset email sent!");
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to send reset link");
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        toast.success("Password reset successfully!");
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to reset password");
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;