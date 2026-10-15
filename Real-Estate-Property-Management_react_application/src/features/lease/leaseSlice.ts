/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import leaseService from "../../services/leaseService";
import type {
  LeaseState,
  Lease,
  CreateLeaseData,
  UpdateLeaseData,
  TerminateLeaseData,
  ExpireLeaseData,
  GetLeasesResponse,
  GetAggregatedLeasesResponse,
  GetLeaseResponse,
  LeaseMutationResponse,
} from "../../typescript/type/lease.types";
import toast from "react-hot-toast";

const initialState: LeaseState = {
  leases: [],
  aggregatedLeases: [],
  lease: null,
  loading: false,
  error: null,
};

export const createLease = createAsyncThunk<
  LeaseMutationResponse,
  CreateLeaseData,
  { rejectValue: string }
>("lease/create", async (data, { rejectWithValue }) => {
  try {
    return await leaseService.createLease(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to create lease",
    );
  }
});

export const getAllLeases = createAsyncThunk<
  GetLeasesResponse,
  void,
  { rejectValue: string }
>("lease/getAll", async (_, { rejectWithValue }) => {
  try {
    return await leaseService.getAllLeases();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch leases",
    );
  }
});

export const getMyLeases = createAsyncThunk<
  GetLeasesResponse,
  void,
  { rejectValue: string }
>("lease/getMine", async (_, { rejectWithValue }) => {
  try {
    return await leaseService.getMyLeases();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch your leases",
    );
  }
});

export const getOwnerLeases = createAsyncThunk<
  GetAggregatedLeasesResponse,
  void,
  { rejectValue: string }
>("lease/getOwner", async (_, { rejectWithValue }) => {
  try {
    return await leaseService.getOwnerLeases();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch owner leases",
    );
  }
});

export const getAgentLeases = createAsyncThunk<
  GetLeasesResponse,
  void,
  { rejectValue: string }
>("lease/getAgent", async (_, { rejectWithValue }) => {
  try {
    return await leaseService.getAgentLeases();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch agent leases",
    );
  }
});

export const getLeaseById = createAsyncThunk<
  GetLeaseResponse,
  string,
  { rejectValue: string }
>("lease/getById", async (id, { rejectWithValue }) => {
  try {
    return await leaseService.getLeaseById(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch lease",
    );
  }
});

export const updateLease = createAsyncThunk<
  LeaseMutationResponse,
  UpdateLeaseData,
  { rejectValue: string }
>("lease/update", async (data, { rejectWithValue }) => {
  try {
    return await leaseService.updateLease(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update lease",
    );
  }
});

export const terminateLease = createAsyncThunk<
  LeaseMutationResponse,
  TerminateLeaseData,
  { rejectValue: string }
>("lease/terminate", async (data, { rejectWithValue }) => {
  try {
    return await leaseService.terminateLease(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to terminate lease",
    );
  }
});

export const expireLease = createAsyncThunk<
  LeaseMutationResponse,
  ExpireLeaseData,
  { rejectValue: string }
>("lease/expire", async (data, { rejectWithValue }) => {
  try {
    return await leaseService.expireLease(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to expire lease",
    );
  }
});

export const deleteLease = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("lease/delete", async (id, { rejectWithValue }) => {
  try {
    await leaseService.deleteLease(id);
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete lease",
    );
  }
});

const replaceLease = (state: LeaseState, updated: Lease): void => {
  const index = state.leases.findIndex((l) => l._id === updated._id);
  if (index !== -1) state.leases[index] = updated;
};

const leaseSlice = createSlice({
  name: "lease",
  initialState,
  reducers: {
    clearLeaseError: (state) => {
      state.error = null;
    },
    clearSelectedLease: (state) => {
      state.lease = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createLease.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLease.fulfilled, (state, action) => {
        state.loading = false;
        const lease = action.payload.data ?? action.payload.lease;
        if (lease) state.leases = [lease, ...state.leases];
        toast.success("Lease created successfully!");
      })
      .addCase(createLease.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to create lease");
      })

      .addCase(getAllLeases.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllLeases.fulfilled, (state, action) => {
        state.loading = false;
        state.leases = action.payload.data ?? [];
      })
      .addCase(getAllLeases.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch leases");
      })

      .addCase(getMyLeases.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyLeases.fulfilled, (state, action) => {
        state.loading = false;
        state.leases = action.payload.data ?? [];
      })
      .addCase(getMyLeases.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch your leases");
      })

      .addCase(getOwnerLeases.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOwnerLeases.fulfilled, (state, action) => {
        state.loading = false;

        const transformed: Lease[] = (action.payload.data ?? []).map(
          (agg: any) => ({
            _id: agg._id,
            property: agg.propertyData ?? agg.property,
            tenant: agg.tenantData ?? agg.tenant,
            owner: agg.ownerData ?? agg.owner,
            agent: agg.agentData ?? agg.agent,
            rentalApplication: agg.rentalApplication,
            startDate: agg.startDate,
            endDate: agg.endDate,
            monthlyRent: agg.monthlyRent,
            securityDeposit: agg.securityDeposit,
            agreementDocument: agg.agreementDocument,
            status: agg.status,
            terminationReason: agg.terminationReason,
            createdAt: agg.createdAt,
            updatedAt: agg.updatedAt,
          }),
        );

        state.leases = transformed;
        state.aggregatedLeases = action.payload.data ?? [];
      })
      .addCase(getOwnerLeases.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch owner leases");
      })

      .addCase(getAgentLeases.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAgentLeases.fulfilled, (state, action) => {
        state.loading = false;
        state.leases = action.payload.data ?? [];
      })
      .addCase(getAgentLeases.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch agent leases");
      })

      .addCase(getLeaseById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLeaseById.fulfilled, (state, action) => {
        state.loading = false;
        state.lease = action.payload.data ?? null;
      })
      .addCase(getLeaseById.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch lease");
      })

      .addCase(updateLease.fulfilled, (state, action) => {
        const updated = action.payload.data ?? action.payload.lease;
        if (updated) replaceLease(state, updated);
        toast.success("Lease updated successfully!");
      })
      .addCase(updateLease.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to update lease");
      })

      .addCase(terminateLease.fulfilled, (state, action) => {
        const updated = action.payload.data ?? action.payload.lease;
        if (updated) replaceLease(state, updated);
        toast.success("Lease terminated successfully!");
      })
      .addCase(terminateLease.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to terminate lease");
      })

      .addCase(expireLease.fulfilled, (state, action) => {
        const updated = action.payload.data ?? action.payload.lease;
        if (updated) replaceLease(state, updated);
        toast.success("Lease expired successfully!");
      })
      .addCase(expireLease.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to expire lease");
      })

      .addCase(deleteLease.fulfilled, (state, action) => {
        state.leases = state.leases.filter((l) => l._id !== action.payload);
        toast.success("Lease deleted successfully!");
      })
      .addCase(deleteLease.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to delete lease");
      });
  },
});

export const { clearLeaseError, clearSelectedLease } = leaseSlice.actions;
export default leaseSlice.reducer;
