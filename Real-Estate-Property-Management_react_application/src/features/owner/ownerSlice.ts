import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import ownerService from "../../services/ownerService";
import type {
  OwnerState,
  Owner,
  OwnerRegisterData,
  UpdateOwnerProfileData,
  GetAllOwnersResponse,
  GetOwnerResponse,
  ApiResponse,
  AccountStatus,
} from "../../typescript/type/owner.types";
import toast from "react-hot-toast";

const initialState: OwnerState = {
  owners: [],
  owner: null,
  profile: null,
  pagination: null,
  loading: false,
  error: null,
};

export const createOwner = createAsyncThunk<
  ApiResponse<Owner>,
  OwnerRegisterData,
  { rejectValue: string }
>("owner/create", async (data, { rejectWithValue }) => {
  try {
    return await ownerService.createOwner(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to create owner",
    );
  }
});

export const getAllOwners = createAsyncThunk<
  GetAllOwnersResponse,
  { page?: number; limit?: number; search?: string; status?: string },
  { rejectValue: string }
>("owner/getAll", async (params, { rejectWithValue }) => {
  try {
    return await ownerService.getAllOwners(params);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch owners",
    );
  }
});

export const getOwnerById = createAsyncThunk<
  GetOwnerResponse,
  string,
  { rejectValue: string }
>("owner/getById", async (id, { rejectWithValue }) => {
  try {
    return await ownerService.getOwnerById(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch owner",
    );
  }
});

export const updateOwnerStatus = createAsyncThunk<
  { id: string; status: AccountStatus },
  { id: string; status: AccountStatus },
  { rejectValue: string }
>("owner/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    await ownerService.updateOwnerStatus(id, { status });
    return { id, status };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update status",
    );
  }
});

export const deleteOwner = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("owner/delete", async (id, { rejectWithValue }) => {
  try {
    await ownerService.deleteOwner(id);
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete owner",
    );
  }
});

export const getOwnerProfile = createAsyncThunk<
  ApiResponse<Owner>,
  void,
  { rejectValue: string }
>("owner/getProfile", async (_, { rejectWithValue }) => {
  try {
    return await ownerService.getProfile();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch profile",
    );
  }
});

export const updateOwnerProfile = createAsyncThunk<
  ApiResponse<Owner>,
  UpdateOwnerProfileData,
  { rejectValue: string }
>("owner/updateProfile", async (data, { rejectWithValue }) => {
  try {
    return await ownerService.updateProfile(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update profile",
    );
  }
});

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    clearOwnerError: (state) => {
      state.error = null;
    },
    clearSelectedOwner: (state) => {
      state.owner = null;
    },
    clearOwnerProfile: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOwner.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOwner.fulfilled, (state) => {
        state.loading = false;
        toast.success("Owner registered successfully! Please verify email.");
      })
      .addCase(createOwner.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to create owner");
      })

      .addCase(getAllOwners.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllOwners.fulfilled,
        (state, action: PayloadAction<GetAllOwnersResponse>) => {
          state.loading = false;
          state.owners = action.payload.owners;
          state.pagination = action.payload.pagination;
        },
      )
      .addCase(getAllOwners.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch owners");
      })

      .addCase(getOwnerById.fulfilled, (state, action) => {
        state.owner = action.payload.owner;
      })

      .addCase(updateOwnerStatus.fulfilled, (state, action) => {
        const index = state.owners.findIndex(
          (o) => o._id === action.payload.id,
        );
        if (index !== -1) {
          state.owners[index].status = action.payload.status;
        }
        toast.success("Status updated successfully!");
      })

      .addCase(deleteOwner.fulfilled, (state, action) => {
        state.owners = state.owners.filter((o) => o._id !== action.payload);
        toast.success("Owner deleted successfully!");
      })

      .addCase(getOwnerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOwnerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data ?? null;
      })
      .addCase(getOwnerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to fetch profile");
      })

      .addCase(updateOwnerProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOwnerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data ?? null;
        toast.success("Profile updated successfully!");
      })
      .addCase(updateOwnerProfile.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to update profile");
      });
  },
});

export const { clearOwnerError, clearSelectedOwner, clearOwnerProfile } =
  ownerSlice.actions;
export default ownerSlice.reducer;
