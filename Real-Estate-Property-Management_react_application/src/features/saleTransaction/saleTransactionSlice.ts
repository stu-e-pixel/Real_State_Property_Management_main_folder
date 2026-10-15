import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import saleTransactionService from "../../services/saleTransactionService";
import type {
  SaleTransactionState,
  SaleTransaction,
  CreateSaleTransactionData,
  UpdateSaleTransactionData,
  GetSaleTransactionsResponse,
  GetSaleTransactionResponse,
  SaleTransactionMutationResponse,
} from "../../typescript/type/saleTransaction.types";
import toast from "react-hot-toast";

const initialState: SaleTransactionState = {
  transactions: [],
  transaction: null,
  loading: false,
  error: null,
};

export const createSaleTransaction = createAsyncThunk<
  SaleTransactionMutationResponse,
  CreateSaleTransactionData,
  { rejectValue: string }
>("saleTransaction/create", async (data, { rejectWithValue }) => {
  try {
    return await saleTransactionService.createSaleTransaction(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to create transaction",
    );
  }
});

export const getMySaleTransactions = createAsyncThunk<
  GetSaleTransactionsResponse,
  void,
  { rejectValue: string }
>("saleTransaction/getMine", async (_, { rejectWithValue }) => {
  try {
    return await saleTransactionService.getMySaleTransactions();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch transactions",
    );
  }
});

export const getSaleTransactionById = createAsyncThunk<
  GetSaleTransactionResponse,
  string,
  { rejectValue: string }
>("saleTransaction/getById", async (id, { rejectWithValue }) => {
  try {
    return await saleTransactionService.getSaleTransactionById(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch transaction",
    );
  }
});

export const updateSaleTransaction = createAsyncThunk<
  SaleTransactionMutationResponse,
  UpdateSaleTransactionData,
  { rejectValue: string }
>("saleTransaction/update", async (data, { rejectWithValue }) => {
  try {
    return await saleTransactionService.updateSaleTransaction(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update transaction",
    );
  }
});

export const getAllSaleTransactionsAdmin = createAsyncThunk<
  GetSaleTransactionsResponse,
  void,
  { rejectValue: string }
>("saleTransaction/getAllAdmin", async (_, { rejectWithValue }) => {
  try {
    return await saleTransactionService.getAllSaleTransactionsAdmin();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch transactions",
    );
  }
});

const replaceTransaction = (
  state: SaleTransactionState,
  updated: SaleTransaction,
): void => {
  const index = state.transactions.findIndex((t) => t._id === updated._id);
  if (index !== -1) state.transactions[index] = updated;
};

const saleTransactionSlice = createSlice({
  name: "saleTransaction",
  initialState,
  reducers: {
    clearSaleTransactionError: (state) => {
      state.error = null;
    },
    clearSelectedTransaction: (state) => {
      state.transaction = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createSaleTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSaleTransaction.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.transactions = [action.payload.data, ...state.transactions];
        }
        toast.success("Transaction created successfully!");
      })
      .addCase(createSaleTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to create transaction");
      })

      .addCase(getMySaleTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMySaleTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data ?? [];
      })
      .addCase(getMySaleTransactions.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch transactions");
      })

      .addCase(getSaleTransactionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSaleTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload.data ?? null;
      })
      .addCase(getSaleTransactionById.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch transaction");
      })

      .addCase(updateSaleTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSaleTransaction.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          replaceTransaction(state, action.payload.data);
        }
        toast.success("Transaction updated successfully!");
      })
      .addCase(updateSaleTransaction.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to update transaction");
      })
      .addCase(getAllSaleTransactionsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSaleTransactionsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data ?? [];
      })
      .addCase(getAllSaleTransactionsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to fetch transactions");
      });
  },
});

export const { clearSaleTransactionError, clearSelectedTransaction } =
  saleTransactionSlice.actions;
export default saleTransactionSlice.reducer;
