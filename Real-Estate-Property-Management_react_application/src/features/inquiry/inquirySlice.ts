import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import inquiryService from "../../services/inquiryService";
import type {
  InquiryState,
  CreateInquiryData,
  UpdateInquiryData,
  ReplyInquiryData,
  CreateInquiryResponse,
  GetInquiriesResponse,
  GetInquiryResponse,
  UpdateInquiryResponse,
  Inquiry,
  InquiryStatus,
} from "../../typescript/type/inquiry.types";
import toast from "react-hot-toast";

const initialState: InquiryState = {
  inquiries: [],
  inquiry: null,
  loading: false,
  error: null,
};

export const createInquiry = createAsyncThunk<
  CreateInquiryResponse,
  CreateInquiryData,
  { rejectValue: string }
>("inquiry/create", async (data, { rejectWithValue }) => {
  try {
    return await inquiryService.createInquiry(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to send inquiry",
    );
  }
});

export const updateInquiry = createAsyncThunk<
  UpdateInquiryResponse,
  { id: string; data: UpdateInquiryData },
  { rejectValue: string }
>("inquiry/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await inquiryService.updateInquiry(id, data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update inquiry",
    );
  }
});

export const getMyInquiries = createAsyncThunk<
  GetInquiriesResponse,
  void,
  { rejectValue: string }
>("inquiry/getMine", async (_, { rejectWithValue }) => {
  try {
    return await inquiryService.getMyInquiries();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch your inquiries",
    );
  }
});

export const getInquiryById = createAsyncThunk<
  GetInquiryResponse,
  string,
  { rejectValue: string }
>("inquiry/getById", async (id, { rejectWithValue }) => {
  try {
    return await inquiryService.getInquiryById(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch inquiry",
    );
  }
});

export const getAgentInquiries = createAsyncThunk<
  GetInquiriesResponse,
  void,
  { rejectValue: string }
>("inquiry/getAgent", async (_, { rejectWithValue }) => {
  try {
    return await inquiryService.getAgentInquiries();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch agent inquiries",
    );
  }
});

export const getAllInquiries = createAsyncThunk<
  GetInquiriesResponse,
  void,
  { rejectValue: string }
>("inquiry/getAll", async (_, { rejectWithValue }) => {
  try {
    return await inquiryService.getAllInquiries();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch inquiries",
    );
  }
});

export const updateInquiryStatus = createAsyncThunk<
  { id: string; status: InquiryStatus },
  { id: string; status: InquiryStatus },
  { rejectValue: string }
>("inquiry/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    await inquiryService.updateInquiryStatus(id, { status });
    return { id, status };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update status",
    );
  }
});

export const replyToInquiry = createAsyncThunk<
  { id: string; reply: string; status: InquiryStatus },
  { id: string; data: ReplyInquiryData },
  { rejectValue: string }
>("inquiry/reply", async ({ id, data }, { rejectWithValue }) => {
  try {
    await inquiryService.replyToInquiry(id, data);
    return { id, reply: data.reply, status: "contacted" as InquiryStatus };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to send reply",
    );
  }
});

export const deleteInquiry = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("inquiry/delete", async (id, { rejectWithValue }) => {
  try {
    await inquiryService.deleteInquiry(id);
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete inquiry",
    );
  }
});

export const getOwnerInquiries = createAsyncThunk<
  GetInquiriesResponse,
  void,
  { rejectValue: string }
>("inquiry/getOwner", async (_, { rejectWithValue }) => {
  try {
    return await inquiryService.getOwnerInquiries();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch owner inquiries",
    );
  }
});

const getInquiriesArray = (payload: GetInquiriesResponse): Inquiry[] =>
  payload.data ?? payload.inquiries ?? [];

const replaceInquiry = (state: InquiryState, updated: Inquiry): void => {
  const index = state.inquiries.findIndex((i) => i._id === updated._id);
  if (index !== -1) state.inquiries[index] = updated;
  else state.inquiries.unshift(updated);
};

const inquirySlice = createSlice({
  name: "inquiry",
  initialState,
  reducers: {
    clearInquiryError: (state) => {
      state.error = null;
    },
    clearSelectedInquiry: (state) => {
      state.inquiry = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createInquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = [action.payload.data, ...state.inquiries];
        toast.success("Inquiry sent successfully!");
      })
      .addCase(createInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to send inquiry");
      })

      .addCase(updateInquiry.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInquiry.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data ?? action.payload.inquiry;
        if (updated) replaceInquiry(state, updated);
        toast.success("Inquiry updated successfully!");
      })
      .addCase(updateInquiry.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to update inquiry");
      })

      .addCase(getMyInquiries.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getMyInquiries.fulfilled,
        (state, action: PayloadAction<GetInquiriesResponse>) => {
          state.loading = false;
          state.inquiries = getInquiriesArray(action.payload);
        },
      )
      .addCase(getMyInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to fetch your inquiries");
      })

      .addCase(getInquiryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInquiryById.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiry = action.payload.data;
      })
      .addCase(getInquiryById.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch inquiry");
      })

      .addCase(getAgentInquiries.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAgentInquiries.fulfilled,
        (state, action: PayloadAction<GetInquiriesResponse>) => {
          state.loading = false;
          state.inquiries = getInquiriesArray(action.payload);
        },
      )
      .addCase(getAgentInquiries.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch agent inquiries");
      })

      .addCase(getAllInquiries.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllInquiries.fulfilled,
        (state, action: PayloadAction<GetInquiriesResponse>) => {
          state.loading = false;
          state.inquiries = getInquiriesArray(action.payload);
        },
      )
      .addCase(getAllInquiries.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch inquiries");
      })

      .addCase(updateInquiryStatus.fulfilled, (state, action) => {
        const index = state.inquiries.findIndex(
          (i) => i._id === action.payload.id,
        );
        if (index !== -1) {
          state.inquiries[index].status = action.payload.status;
        }
        toast.success("Status updated!");
      })
      .addCase(updateInquiryStatus.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to update status");
      })

      .addCase(replyToInquiry.fulfilled, (state, action) => {
        const index = state.inquiries.findIndex(
          (i) => i._id === action.payload.id,
        );
        if (index !== -1) {
          state.inquiries[index].reply = action.payload.reply;
          state.inquiries[index].status = action.payload.status;
          state.inquiries[index].repliedAt = new Date().toISOString();
        }
        toast.success("Reply sent!");
      })
      .addCase(replyToInquiry.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to send reply");
      })

      .addCase(deleteInquiry.fulfilled, (state, action) => {
        state.inquiries = state.inquiries.filter(
          (i) => i._id !== action.payload,
        );
        toast.success("Inquiry deleted!");
      })
      .addCase(deleteInquiry.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to delete inquiry");
      })
      .addCase(getOwnerInquiries.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getOwnerInquiries.fulfilled,
        (state, action: PayloadAction<GetInquiriesResponse>) => {
          state.loading = false;
          state.inquiries =
            action.payload.data ?? action.payload.inquiries ?? [];
        },
      )
      .addCase(getOwnerInquiries.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch owner inquiries");
      });
  },
});

export const { clearInquiryError, clearSelectedInquiry } = inquirySlice.actions;
export default inquirySlice.reducer;
