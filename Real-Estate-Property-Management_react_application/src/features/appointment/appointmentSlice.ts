import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import appointmentService from "../../services/appointmentService";
import type {
  AppointmentState,
  Appointment,
  CreateAppointmentData,
  AppointmentActionData,
  CancelAppointmentData,
  GetAppointmentsResponse,
  GetAppointmentResponse,
  AppointmentMutationResponse,
} from "../../typescript/type/appointment.types";
import toast from "react-hot-toast";

const initialState: AppointmentState = {
  appointments: [],
  appointment: null,
  loading: false,
  error: null,
};

export const createAppointment = createAsyncThunk<
  AppointmentMutationResponse,
  CreateAppointmentData,
  { rejectValue: string }
>("appointment/create", async (data, { rejectWithValue }) => {
  try {
    return await appointmentService.createAppointment(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to book appointment",
    );
  }
});

export const getMyAppointments = createAsyncThunk<
  GetAppointmentsResponse,
  void,
  { rejectValue: string }
>("appointment/getMine", async (_, { rejectWithValue }) => {
  try {
    return await appointmentService.getMyAppointments();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch appointments",
    );
  }
});

export const getAgentAppointments = createAsyncThunk<
  GetAppointmentsResponse,
  void,
  { rejectValue: string }
>("appointment/getAgent", async (_, { rejectWithValue }) => {
  try {
    return await appointmentService.getAgentAppointments();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch agent appointments",
    );
  }
});

export const getOwnerAppointments = createAsyncThunk<
  GetAppointmentsResponse,
  void,
  { rejectValue: string }
>("appointment/getOwner", async (_, { rejectWithValue }) => {
  try {
    return await appointmentService.getOwnerAppointments();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch owner appointments",
    );
  }
});

export const getAppointmentById = createAsyncThunk<
  GetAppointmentResponse,
  string,
  { rejectValue: string }
>("appointment/getById", async (id, { rejectWithValue }) => {
  try {
    return await appointmentService.getAppointmentById(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch appointment",
    );
  }
});

export const appointmentAction = createAsyncThunk<
  AppointmentMutationResponse,
  AppointmentActionData,
  { rejectValue: string }
>("appointment/action", async (data, { rejectWithValue }) => {
  try {
    return await appointmentService.appointmentAction(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to perform action",
    );
  }
});

export const cancelAppointment = createAsyncThunk<
  AppointmentMutationResponse,
  CancelAppointmentData,
  { rejectValue: string }
>("appointment/cancel", async (data, { rejectWithValue }) => {
  try {
    return await appointmentService.cancelAppointment(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to cancel appointment",
    );
  }
});

export const getAllAppointments = createAsyncThunk<
  GetAppointmentsResponse,
  void,
  { rejectValue: string }
>("appointment/getAll", async (_, { rejectWithValue }) => {
  try {
    return await appointmentService.getAllAppointments();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch appointments",
    );
  }
});



const replaceAppointment = (
  state: AppointmentState,
  updated: Appointment,
): void => {
  const index = state.appointments.findIndex((a) => a._id === updated._id);
  if (index !== -1) state.appointments[index] = updated;
};



const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearAppointmentError: (state) => {
      state.error = null;
    },
    clearSelectedAppointment: (state) => {
      state.appointment = null;
    },
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.appointments = [action.payload.data, ...state.appointments];
        }
        toast.success("Appointment booked successfully!");
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to book appointment");
      })

      
      .addCase(getMyAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getMyAppointments.fulfilled,
        (state, action: PayloadAction<GetAppointmentsResponse>) => {
          state.loading = false;
          state.appointments = action.payload.data;
        },
      )
      .addCase(getMyAppointments.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch appointments");
      })

     
      .addCase(getAgentAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAgentAppointments.fulfilled,
        (state, action: PayloadAction<GetAppointmentsResponse>) => {
          state.loading = false;
          state.appointments = action.payload.data;
        },
      )
      .addCase(getAgentAppointments.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch appointments");
      })

      
      .addCase(getOwnerAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getOwnerAppointments.fulfilled,
        (state, action: PayloadAction<GetAppointmentsResponse>) => {
          state.loading = false;
          state.appointments = action.payload.data;
        },
      )
      .addCase(getOwnerAppointments.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch appointments");
      })

      
      .addCase(getAppointmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAppointmentById.fulfilled,
        (state, action: PayloadAction<GetAppointmentResponse>) => {
          state.loading = false;
          state.appointment = action.payload.data;
        },
      )
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch appointment");
      })

     
      .addCase(appointmentAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(appointmentAction.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data ?? action.payload.appointment;
        if (updated) replaceAppointment(state, updated);
        toast.success(action.payload.message || "Action completed");
      })
      .addCase(appointmentAction.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to perform action");
      })

      
      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data ?? action.payload.appointment;
        if (updated) replaceAppointment(state, updated);
        toast.success("Appointment cancelled");
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to cancel appointment");
      })

      .addCase(getAllAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllAppointments.fulfilled,
        (state, action: PayloadAction<GetAppointmentsResponse>) => {
          state.loading = false;
          state.appointments = action.payload.data ?? [];
        },
      )
      .addCase(getAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to fetch appointments");
      });
  },
});

export const { clearAppointmentError, clearSelectedAppointment } =
  appointmentSlice.actions;
export default appointmentSlice.reducer;
