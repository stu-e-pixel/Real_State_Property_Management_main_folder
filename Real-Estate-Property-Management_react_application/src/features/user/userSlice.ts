import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit"
import userService from "../../services/userService";
import type {
  UserState,
  GetAllUsersResponse,
  GetUserResponse,
  AccountStatus,
} from "../../typescript/type/user.types";
import toast from "react-hot-toast";

const initialState: UserState = {
  users: [],
  user: null,
  profile: null,
  pagination: null,
  loading: false,
  error: null,
};

export const getAllUsers = createAsyncThunk<
  GetAllUsersResponse,
  {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    isEmailVerified?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
  { rejectValue: string }
>("user/getAll", async (params, { rejectWithValue }) => {
  try {
    return await userService.getAllUsers(params);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch users"
    );
  }
});

export const getUserById = createAsyncThunk<
  GetUserResponse,
  string,
  { rejectValue: string }
>("user/getById", async (id, { rejectWithValue }) => {
  try {
    return await userService.getUserById(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch user"
    );
  }
});

export const updateUserStatus = createAsyncThunk<
  { id: string; status: AccountStatus },
  { id: string; status: AccountStatus },
  { rejectValue: string }
>("user/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    await userService.updateUserStatus(id, { status });
    return { id, status };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update status"
    );
  }
});

export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("user/delete", async (id, { rejectWithValue }) => {
  try {
    await userService.deleteUser(id);
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete user"
    );
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllUsers.fulfilled,
        (state, action: PayloadAction<GetAllUsersResponse>) => {
          state.loading = false;
          state.users = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to fetch users");
      })

      .addCase(getUserById.fulfilled, (state, action) => {
        state.user = action.payload.data ?? null;
      })

      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload.id
        );
        if (index !== -1) {
          state.users[index].status = action.payload.status;
        }
        toast.success("Status updated successfully!");
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading=false
        toast.error(action.payload ?? "Failed to update status");
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
        toast.success("User deleted successfully!");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading=false
        toast.error(action.payload ?? "Failed to delete user");
      });
  },
});

export const { clearUserError, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;