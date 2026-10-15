import api from "./api";
import type {
  Agent,
  AgentRegisterData,
  UpdateAgentProfileData,
  GetAllAgentsResponse,
  GetAgentResponse,
  UpdateAgentStatusResponse,
  ApiResponse,
  AccountStatus,
} from "../typescript/type/agent.types";

const buildFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    // Image array
    if (
      key === "image" &&
      Array.isArray(value) &&
      value[0] instanceof File
    ) {
      formData.append("image", value[0]);
      return;
    }

    
    if (
      key === "image" &&
      value instanceof FileList &&
      value.length > 0
    ) {
      formData.append("image", value[0]);
      return;
    }

    
    if (value === undefined || value === null) {
      return;
    }

    
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
};

const agentService = {
  createAgent: async (
  data: AgentRegisterData
): Promise<ApiResponse<Agent>> => {
  const formData = buildFormData(
    data as unknown as Record<string, unknown>
  );

  console.log("========== FORM DATA ==========");

  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const response = await api.post<ApiResponse<Agent>>(
    "/v9/api/createagent",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
},

  getProfile: async (): Promise<ApiResponse<Agent>> => {
    const response = await api.get<ApiResponse<Agent>>("/v9/api/getprofile");
    return response.data;
  },

  updateProfile: async (
    data: UpdateAgentProfileData
  ): Promise<ApiResponse<Agent>> => {
    const formData = buildFormData(data as unknown as Record<string, unknown>);
    const response = await api.put<ApiResponse<Agent>>(
      "/v9/api/profile/update",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(
      "/v9/api/change-password",
      data
    );
    return response.data;
  },

  getAllAgents: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<GetAllAgentsResponse> => {
    const response = await api.get<GetAllAgentsResponse>(
      "/v9/api/admin/agents/allagents",
      { params }
    );
    return response.data;
  },

  getAgentById: async (id: string): Promise<GetAgentResponse> => {
    const response = await api.get<GetAgentResponse>(
      `/v9/api/admin/agents/${id}`
    );
    return response.data;
  },

  updateAgentStatus: async (
    id: string,
    data: { status: AccountStatus }
  ): Promise<UpdateAgentStatusResponse> => {
    const response = await api.patch<UpdateAgentStatusResponse>(
      `/v9/api/admin/agents/update/${id}/status`,
      data
    );
    return response.data;
  },

  deleteAgent: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(
      `/v9/api/admin/agents/delete/${id}`
    );
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.get<ApiResponse>("/v9/api/logout");
    return response.data;
  },
};

export default agentService;