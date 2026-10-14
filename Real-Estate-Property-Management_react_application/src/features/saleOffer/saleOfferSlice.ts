import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import saleOfferService from "../../services/saleOfferService";
import type {
  SaleOfferState,
  SaleOffer,
  CreateSaleOfferData,
  RespondToSaleOfferData,
  GetSaleOffersResponse,
  SaleOfferMutationResponse,
} from "../../typescript/type/saleOffer.types";
import toast from "react-hot-toast";

const initialState: SaleOfferState = {
  saleOffers: [],
  saleOffer: null,
  loading: false,
  error: null,
};

// =====================================================
// THUNKS
// =====================================================

export const createSaleOffer = createAsyncThunk<
  SaleOfferMutationResponse,
  CreateSaleOfferData,
  { rejectValue: string }
>("saleOffer/create", async (data, { rejectWithValue }) => {
  try {
    return await saleOfferService.createSaleOffer(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to submit offer",
    );
  }
});

export const getMySaleOffers = createAsyncThunk<
  GetSaleOffersResponse,
  void,
  { rejectValue: string }
>("saleOffer/getMine", async (_, { rejectWithValue }) => {
  try {
    return await saleOfferService.getMySaleOffers();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch offers",
    );
  }
});

export const getPropertySaleOffers = createAsyncThunk<
  GetSaleOffersResponse,
  string,
  { rejectValue: string }
>("saleOffer/getByProperty", async (propertyId, { rejectWithValue }) => {
  try {
    return await saleOfferService.getPropertySaleOffers(propertyId);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch property offers",
    );
  }
});

export const respondToSaleOffer = createAsyncThunk<
  SaleOfferMutationResponse,
  RespondToSaleOfferData,
  { rejectValue: string }
>("saleOffer/respond", async (data, { rejectWithValue }) => {
  try {
    return await saleOfferService.respondToSaleOffer(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to respond to offer",
    );
  }
});

export const withdrawSaleOffer = createAsyncThunk<
  SaleOfferMutationResponse,
  string,
  { rejectValue: string }
>("saleOffer/withdraw", async (id, { rejectWithValue }) => {
  try {
    return await saleOfferService.withdrawSaleOffer(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to withdraw offer",
    );
  }
});

export const deleteSaleOffer = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("saleOffer/delete", async (id, { rejectWithValue }) => {
  try {
    await saleOfferService.deleteSaleOffer(id);
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete offer",
    );
  }
});

export const getSaleOfferByOwner = createAsyncThunk<
  GetSaleOffersResponse,
  void,
  { rejectValue: string }
>("saleOffer/getByOwner", async (_, { rejectWithValue }) => {
  try {
    return await saleOfferService.getSaleOfferByOwner();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch offers",
    );
  }
});

export const getSaleOfferByAgent = createAsyncThunk<
  GetSaleOffersResponse,
  void,
  { rejectValue: string }
>("saleOffer/getByAgent", async (_, { rejectWithValue }) => {
  try {
    return await saleOfferService.getSaleOfferByAgent();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch offers",
    );
  }
});

// =====================================================
// HELPERS
// =====================================================

const replaceOffer = (state: SaleOfferState, updated: SaleOffer): void => {
  const index = state.saleOffers.findIndex((o) => o._id === updated._id);
  if (index !== -1) state.saleOffers[index] = updated;
};

// =====================================================
// SLICE
// =====================================================

const saleOfferSlice = createSlice({
  name: "saleOffer",
  initialState,
  reducers: {
    clearSaleOfferError: (state) => {
      state.error = null;
    },
    clearSelectedSaleOffer: (state) => {
      state.saleOffer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -------- CREATE --------
      .addCase(createSaleOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSaleOffer.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.saleOffers = [action.payload.data, ...state.saleOffers];
        }
        toast.success("Offer submitted successfully!");
      })
      .addCase(createSaleOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to submit offer");
      })

      // -------- MY --------
      .addCase(getMySaleOffers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMySaleOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.saleOffers = action.payload.data ?? [];
      })
      .addCase(getMySaleOffers.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch offers");
      })

      // -------- PROPERTY --------
      .addCase(getPropertySaleOffers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPropertySaleOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.saleOffers = action.payload.data ?? [];
      })
      .addCase(getPropertySaleOffers.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch offers");
      })

      // -------- RESPOND --------
      .addCase(respondToSaleOffer.pending, (state) => {
        state.loading = true;
      })
      .addCase(respondToSaleOffer.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          replaceOffer(state, action.payload.data);
        }
        toast.success(action.payload.message || "Response recorded");
      })
      .addCase(respondToSaleOffer.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to respond");
      })

      // -------- WITHDRAW --------
      .addCase(withdrawSaleOffer.pending, (state) => {
        state.loading = true;
      })
      .addCase(withdrawSaleOffer.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          replaceOffer(state, action.payload.data);
        }
        toast.success("Offer withdrawn");
      })
      .addCase(withdrawSaleOffer.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to withdraw");
      })

      // -------- DELETE --------
      .addCase(deleteSaleOffer.fulfilled, (state, action) => {
        state.saleOffers = state.saleOffers.filter(
          (o) => o._id !== action.payload,
        );
        toast.success("Offer deleted");
      })
      .addCase(deleteSaleOffer.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to delete offer");
      })
      // -------- OWNER --------
      .addCase(getSaleOfferByOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaleOfferByOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.saleOffers = action.payload.data ?? [];
      })
      .addCase(getSaleOfferByOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to fetch offers");
      })

      // -------- AGENT --------
      .addCase(getSaleOfferByAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaleOfferByAgent.fulfilled, (state, action) => {
        state.loading = false;
        state.saleOffers = action.payload.data ?? [];
      })
      .addCase(getSaleOfferByAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to fetch offers");
      });
  },
});

export const { clearSaleOfferError, clearSelectedSaleOffer } =
  saleOfferSlice.actions;
export default saleOfferSlice.reducer;
