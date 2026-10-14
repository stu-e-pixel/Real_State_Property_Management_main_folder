import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type{PayloadAction} from "@reduxjs/toolkit"
import rentalService from "../../services/rentalService";
import type {
  RentalState,
  RentalApplication,
  CreateRentalApplicationData,
  UpdateRentalApplicationData,
  RentalActionData,
  GetRentalApplicationsResponse,
  GetRentalApplicationResponse,
  RentalMutationResponse,
} from "../../typescript/type/rental.types";
import toast from "react-hot-toast";

const initialState: RentalState = {
  applications: [],
  application: null,
  loading: false,
  error: null,
};

// =====================================================
// THUNKS
// =====================================================

export const createRentalApplication = createAsyncThunk<
  RentalMutationResponse,
  CreateRentalApplicationData,
  { rejectValue: string }
>("rental/create", async (data, { rejectWithValue }) => {
  try {
    return await rentalService.createRentalApplication(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to submit application"
    );
  }
});

export const updateRentalApplication = createAsyncThunk<
  RentalMutationResponse,
  { id: string; data: UpdateRentalApplicationData },
  { rejectValue: string }
>("rental/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await rentalService.updateRentalApplication(id, data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update application"
    );
  }
});

export const getMyRentalApplications = createAsyncThunk<
  GetRentalApplicationsResponse,
  void,
  { rejectValue: string }
>("rental/getMine", async (_, { rejectWithValue }) => {
  try {
    return await rentalService.getMyRentalApplications();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch applications"
    );
  }
});

export const getOwnerRentalApplications = createAsyncThunk<
  GetRentalApplicationsResponse,
  void,
  { rejectValue: string }
>("rental/getOwner", async (_, { rejectWithValue }) => {
  try {
    return await rentalService.getOwnerRentalApplications();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch owner applications"
    );
  }
});

export const getAgentRentalApplications = createAsyncThunk<
  GetRentalApplicationsResponse,
  void,
  { rejectValue: string }
>("rental/getAgent", async (_, { rejectWithValue }) => {
  try {
    return await rentalService.getAgentRentalApplications();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch agent applications"
    );
  }
});

export const getRentalApplicationById = createAsyncThunk<
  GetRentalApplicationResponse,
  string,
  { rejectValue: string }
>("rental/getById", async (id, { rejectWithValue }) => {
  try {
    return await rentalService.getRentalApplicationById(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch application"
    );
  }
});

export const withdrawRentalApplication = createAsyncThunk<
  RentalMutationResponse,
  string,
  { rejectValue: string }
>("rental/withdraw", async (id, { rejectWithValue }) => {
  try {
    return await rentalService.withdrawRentalApplication(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to withdraw application"
    );
  }
});

export const rentalApplicationAction = createAsyncThunk<
  RentalMutationResponse,
  RentalActionData,
  { rejectValue: string }
>("rental/action", async (data, { rejectWithValue }) => {
  try {
    return await rentalService.rentalApplicationAction(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to process action"
    );
  }
});

// =====================================================
// HELPERS
// =====================================================

const replaceApplication = (
  state: RentalState,
  updated: RentalApplication
): void => {
  const index = state.applications.findIndex((a) => a._id === updated._id);
  if (index !== -1) state.applications[index] = updated;
};

// =====================================================
// SLICE
// =====================================================

const rentalSlice = createSlice({
  name: "rental",
  initialState,
  reducers: {
    clearRentalError: (state) => {
      state.error = null;
    },
    clearSelectedRental: (state) => {
      state.application = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -------- CREATE --------
      .addCase(createRentalApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRentalApplication.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.applications = [action.payload.data, ...state.applications];
        }
        toast.success("Rental application submitted successfully!");
      })
      .addCase(createRentalApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to submit application");
      })

      // -------- UPDATE --------
      .addCase(updateRentalApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRentalApplication.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          replaceApplication(state, action.payload.data);
        }
        toast.success("Application updated successfully!");
      })
      .addCase(updateRentalApplication.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to update application");
      })

      // -------- MY --------
      .addCase(getMyRentalApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getMyRentalApplications.fulfilled,
        (state, action: PayloadAction<GetRentalApplicationsResponse>) => {
          state.loading = false;
          state.applications = action.payload.data ?? [];
        }
      )
      .addCase(getMyRentalApplications.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch applications");
      })

      // -------- OWNER --------
      .addCase(getOwnerRentalApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getOwnerRentalApplications.fulfilled,
        (state, action: PayloadAction<GetRentalApplicationsResponse>) => {
          state.loading = false;
          state.applications = action.payload.data ?? [];
        }
      )
      .addCase(getOwnerRentalApplications.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch applications");
      })

      // -------- AGENT --------
      .addCase(getAgentRentalApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAgentRentalApplications.fulfilled,
        (state, action: PayloadAction<GetRentalApplicationsResponse>) => {
          state.loading = false;
          state.applications = action.payload.data ?? [];
        }
      )
      .addCase(getAgentRentalApplications.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch applications");
      })

      // -------- BY ID --------
      .addCase(getRentalApplicationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getRentalApplicationById.fulfilled,
        (state, action: PayloadAction<GetRentalApplicationResponse>) => {
          state.loading = false;
          state.application = action.payload.data ?? null;
        }
      )
      .addCase(getRentalApplicationById.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch application");
      })

      // -------- WITHDRAW --------
      .addCase(withdrawRentalApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(withdrawRentalApplication.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          replaceApplication(state, action.payload.data);
        }
        toast.success("Application withdrawn successfully!");
      })
      .addCase(withdrawRentalApplication.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to withdraw application");
      })

      // -------- ACTION (approve/reject) --------
      .addCase(rentalApplicationAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(rentalApplicationAction.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          replaceApplication(state, action.payload.data);
        }
        toast.success(action.payload.message || "Action completed");
      })
      .addCase(rentalApplicationAction.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to process action");
      });
  },
});

export const { clearRentalError, clearSelectedRental } = rentalSlice.actions;
export default rentalSlice.reducer;