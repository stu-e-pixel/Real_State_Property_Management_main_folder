import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import propertyService from "../../services/propertyService";
import type {
  PropertyState,
  CreatePropertyData,
  UpdatePropertyData,
  GetAllPropertiesResponse,
  PropertyResponse,
  GetPropertyByIdResponse,
} from "../../typescript/type/property.types";
import toast from "react-hot-toast";

const initialState: PropertyState = {
  properties: [],
  property: null,
  pagination: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    purpose: "",
    status: "",
    approvalStatus: "",
    minPrice: "",
    maxPrice: "",
  },
};

// =====================================================
// THUNKS
// =====================================================

export const createProperty = createAsyncThunk<
  PropertyResponse,
  CreatePropertyData,
  { rejectValue: string }
>("property/create", async (data, { rejectWithValue }) => {
  try {
    return await propertyService.createProperty(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to create property",
    );
  }
});

export const getPropertyById = createAsyncThunk<
  GetPropertyByIdResponse,
  string,
  { rejectValue: string }
>("property/getById", async (id, { rejectWithValue }) => {
  try {
    return await propertyService.getPropertyById(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch property",
    );
  }
});

export const updateProperty = createAsyncThunk<
  PropertyResponse,
  { id: string; data: UpdatePropertyData },
  { rejectValue: string }
>("property/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await propertyService.updateProperty(id, data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update property",
    );
  }
});

export const getAllProperties = createAsyncThunk<
  GetAllPropertiesResponse,
  {
    page?: number;
    limit?: number;
    propertyTitle?: string;
    minprice?: number | string;
    maxprice?: number | string;
  },
  { rejectValue: string }
>("property/getAll", async (params, { rejectWithValue }) => {
  try {
    return await propertyService.getAllProperties(params);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch properties",
    );
  }
});

export const softDeleteProperty = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("property/softDelete", async (id, { rejectWithValue }) => {
  try {
    await propertyService.softDeleteProperty(id);
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete property",
    );
  }
});

export const restoreProperty = createAsyncThunk<
  PropertyResponse,
  string,
  { rejectValue: string }
>("property/restore", async (id, { rejectWithValue }) => {
  try {
    return await propertyService.restoreProperty(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to restore property",
    );
  }
});

export const permanentDeleteProperty = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("property/permanentDelete", async (id, { rejectWithValue }) => {
  try {
    await propertyService.permanentDeleteProperty(id);
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete property permanently",
    );
  }
});

export const approveProperty = createAsyncThunk<
  PropertyResponse,
  { id: string; reason?: string } | string,
  { rejectValue: string }
>("property/approve", async (payload, { rejectWithValue }) => {
  try {
    const id = typeof payload === "string" ? payload : payload.id;
    const reason = typeof payload === "string" ? undefined : payload.reason;
    return await propertyService.approveProperty(id, reason);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to approve property",
    );
  }
});

export const getMyApprovedProperties = createAsyncThunk<
  GetAllPropertiesResponse,
  {
    search?: string;
    purpose?: string;
    page?: number;
    limit?: number;
  },
  { rejectValue: string }
>("property/getMyApproved", async (params, { rejectWithValue }) => {
  try {
    return await propertyService.getMyApprovedProperties(params);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch your properties",
    );
  }
});

export const getPublicApproved = createAsyncThunk<
  GetAllPropertiesResponse,
  {
    search?: string;
    purpose?: string;
    propertyType?: string;
    minprice?: number | string;
    maxprice?: number | string;
    bedrooms?: number | string;
    furnishingStatus?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  },
  { rejectValue: string }
>("property/getPublicApproved", async (params, { rejectWithValue }) => {
  try {
    return await propertyService.getPublicApproved(params);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch properties",
    );
  }
});

export const getOwnerProperties = createAsyncThunk<
  GetAllPropertiesResponse,
  void,
  { rejectValue: string }
>("property/getOwnerProperties", async (_, { rejectWithValue }) => {
  try {
    return await propertyService.getOwnerProperties();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch owner properties",
    );
  }
});

// =====================================================
// SLICE
// =====================================================

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    clearPropertyError: (state) => {
      state.error = null;
    },
    clearSelectedProperty: (state) => {
      state.property = null;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<PropertyState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },

  extraReducers: (builder) => {
    builder
      // -------- CREATE --------
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProperty.fulfilled,
        (state, action: PayloadAction<PropertyResponse>) => {
          state.loading = false;
          state.property = action.payload.data;
          state.properties = [action.payload.data, ...state.properties];
          toast.success("Property created successfully!");
        },
      )
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to create property");
      })

      // -------- UPDATE --------
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateProperty.fulfilled,
        (state, action: PayloadAction<PropertyResponse>) => {
          state.loading = false;
          state.property = action.payload.data;
          const index = state.properties.findIndex(
            (p) => p._id === action.payload.data._id,
          );
          if (index !== -1) state.properties[index] = action.payload.data;
          toast.success("Property updated successfully!");
        },
      )
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to update property");
      })

      // -------- GET ALL --------
      .addCase(getAllProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllProperties.fulfilled,
        (state, action: PayloadAction<GetAllPropertiesResponse>) => {
          state.loading = false;
          state.properties = action.payload.data;
          state.pagination = {
            currentPage: action.payload.currentPage,
            limit: 10,
            total: action.payload.totalProperty ?? action.payload.count ?? 0,
            totalPages: action.payload.totalpage,
          };
        },
      )
      .addCase(getAllProperties.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch properties");
      })

      // -------- SOFT DELETE --------
      .addCase(softDeleteProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(
          (p) => p._id !== action.payload,
        );
        toast.success("Property deleted successfully!");
      })
      .addCase(softDeleteProperty.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to delete property");
      })

      // -------- RESTORE --------
      .addCase(restoreProperty.fulfilled, (state, action) => {
        state.properties = [action.payload.data, ...state.properties];
        toast.success("Property restored successfully!");
      })
      .addCase(restoreProperty.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to restore property");
      })

      // -------- PERMANENT DELETE --------
      .addCase(permanentDeleteProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(
          (p) => p._id !== action.payload,
        );
        toast.success("Property deleted permanently!");
      })
      .addCase(permanentDeleteProperty.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to delete property");
      })

      // -------- APPROVE --------
      .addCase(approveProperty.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveProperty.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.properties.findIndex(
          (p) => p._id === action.payload.data._id,
        );
        if (index !== -1) state.properties[index] = action.payload.data;
        toast.success("Property approved successfully!");
      })
      .addCase(approveProperty.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to approve property");
      })

      .addCase(getPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPropertyById.fulfilled,
        (state, action: PayloadAction<GetPropertyByIdResponse>) => {
          state.loading = false;
          state.property = action.payload.data;
        },
      )
      .addCase(getPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to fetch property");
      })

      .addCase(getMyApprovedProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getMyApprovedProperties.fulfilled,
        (state, action: PayloadAction<GetAllPropertiesResponse>) => {
          state.loading = false;
          state.properties = action.payload.data;
          state.pagination = {
            currentPage: action.payload.currentPage,
            limit: 10,
            total: action.payload.totalProperty ?? action.payload.count ?? 0,
            totalPages: action.payload.totalpage,
          };
        },
      )
      .addCase(getMyApprovedProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to fetch your properties");
      })

      .addCase(getPublicApproved.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPublicApproved.fulfilled,
        (state, action: PayloadAction<GetAllPropertiesResponse>) => {
          state.loading = false;
          state.properties = action.payload.data;
          state.pagination = {
            currentPage: action.payload.currentPage,
            limit: 12,
            total: action.payload.totalProperty ?? action.payload.count ?? 0,
            totalPages: action.payload.totalpage,
          };
        },
      )
      .addCase(getPublicApproved.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to fetch properties");
      })

      .addCase(getOwnerProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOwnerProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.data ?? [];
      })
      .addCase(getOwnerProperties.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch properties");
      });
  },
});

export const {
  clearPropertyError,
  clearSelectedProperty,
  setFilters,
  resetFilters,
} = propertySlice.actions;
export default propertySlice.reducer;
