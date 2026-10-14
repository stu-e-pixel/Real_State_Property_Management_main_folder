import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit"
import agentService from "../../services/agentService";
import type {
  AgentState,
  Agent,
  AgentRegisterData,
  UpdateAgentProfileData,
  GetAllAgentsResponse,
  GetAgentResponse,
  ApiResponse,
  AccountStatus,
} from "../../typescript/type/agent.types";
import toast from "react-hot-toast";

const initialState: AgentState = {
  agents: [],
  agent: null,
  profile: null,
  pagination: null,
  loading: false,
  error: null,
};

export const createAgent = createAsyncThunk<
  ApiResponse<Agent>,
  AgentRegisterData,
  { rejectValue: string }
>("agent/create", async (data, { rejectWithValue }) => {
  try {
    return await agentService.createAgent(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to create agent"
    );
  }
});

export const getAllAgents = createAsyncThunk<
  GetAllAgentsResponse,
  { page?: number; limit?: number; search?: string; status?: string },
  { rejectValue: string }
>("agent/getAll", async (params, { rejectWithValue }) => {
  try {
    return await agentService.getAllAgents(params);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch agents"
    );
  }
});

export const getAgentById = createAsyncThunk<
  GetAgentResponse,
  string,
  { rejectValue: string }
>("agent/getById", async (id, { rejectWithValue }) => {
  try {
    return await agentService.getAgentById(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch agent"
    );
  }
});

export const updateAgentStatus = createAsyncThunk<
  { id: string; status: AccountStatus },
  { id: string; status: AccountStatus },
  { rejectValue: string }
>("agent/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    await agentService.updateAgentStatus(id, { status });
    return { id, status };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update status"
    );
  }
});

export const deleteAgent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("agent/delete", async (id, { rejectWithValue }) => {
  try {
    await agentService.deleteAgent(id);
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete agent"
    );
  }
});

export const getAgentProfile = createAsyncThunk<
  ApiResponse<Agent>,
  void,
  { rejectValue: string }
>("agent/getProfile", async (_, { rejectWithValue }) => {
  try {
    return await agentService.getProfile();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch profile"
    );
  }
});

export const updateAgentProfile = createAsyncThunk<
  ApiResponse<Agent>,
  UpdateAgentProfileData,
  { rejectValue: string }
>("agent/updateProfile", async (data, { rejectWithValue }) => {
  try {
    return await agentService.updateProfile(data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update profile"
    );
  }
});

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    clearAgentError: (state) => {
      state.error = null;
    },
    clearSelectedAgent: (state) => {
      state.agent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAgent.fulfilled, (state) => {
        state.loading = false;
        toast.success("Agent registered successfully! Please verify email.");
      })
      .addCase(createAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to create agent");
      })

      .addCase(getAllAgents.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllAgents.fulfilled,
        (state, action: PayloadAction<GetAllAgentsResponse>) => {
          state.loading = false;
          state.agents = action.payload.agents;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(getAllAgents.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch agents");
      })

      .addCase(getAgentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAgentById.fulfilled, (state, action) => {
        state.loading = false;
        state.agent = action.payload.data ?? null;
      })
      .addCase(getAgentById.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch agent");
      })

      .addCase(updateAgentStatus.fulfilled, (state, action) => {
        const index = state.agents.findIndex(
          (a) => a._id === action.payload.id
        );
        if (index !== -1) {
          state.agents[index].status = action.payload.status;
        }
        toast.success("Status updated successfully!");
      })
      .addCase(updateAgentStatus.rejected, (state, action) => {
        state.loading=false
        toast.error(action.payload ?? "Failed to update status");
      })

      .addCase(deleteAgent.fulfilled, (state, action) => {
        state.agents = state.agents.filter((a) => a._id !== action.payload);
        toast.success("Agent deleted successfully!");
      })
      .addCase(deleteAgent.rejected, (state, action) => {
        state.loading=false
        toast.error(action.payload ?? "Failed to delete agent");
      })

      .addCase(getAgentProfile.fulfilled, (state, action) => {
        state.profile = action.payload.data ?? null;
      })

      .addCase(updateAgentProfile.fulfilled, (state, action) => {
        state.profile = action.payload.data ?? null;
        toast.success("Profile updated successfully!");
      })
      .addCase(updateAgentProfile.rejected, (state, action) => {
        state.loading=false
        toast.error(action.payload ?? "Failed to update profile");
      });
  },
});

export const { clearAgentError, clearSelectedAgent } = agentSlice.actions;
export default agentSlice.reducer;