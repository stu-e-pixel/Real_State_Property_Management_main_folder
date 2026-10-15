import api from "./api";
import type {
  CreateAppointmentData,
  AppointmentActionData,
  CancelAppointmentData,
  GetAppointmentsResponse,
  GetAppointmentResponse,
  AppointmentMutationResponse,
} from "../typescript/type/appointment.types";

const appointmentService = {
 
  createAppointment: async (
    data: CreateAppointmentData
  ): Promise<AppointmentMutationResponse> => {
    const response = await api.post<AppointmentMutationResponse>(
      "/v5/api/customer/create/appointment",
      data
    );
    return response.data;
  },

  
  getMyAppointments: async (): Promise<GetAppointmentsResponse> => {
    const response = await api.get<GetAppointmentsResponse>(
      "/v5/api/customer/appointments"
    );
    return response.data;
  },

  
  getAgentAppointments: async (): Promise<GetAppointmentsResponse> => {
    const response = await api.get<GetAppointmentsResponse>(
      "/v5/api/agent/appointments"
    );
    return response.data;
  },

 
  getOwnerAppointments: async (): Promise<GetAppointmentsResponse> => {
    const response = await api.get<GetAppointmentsResponse>(
      "/v5/api/owner/appointemnts/property"
    );
    return response.data;
  },

 
  getAppointmentById: async (
    id: string
  ): Promise<GetAppointmentResponse> => {
    const response = await api.get<GetAppointmentResponse>(
      `/v5/api/appointment/single/${id}`
    );
    return response.data;
  },

  
  appointmentAction: async (
    data: AppointmentActionData
  ): Promise<AppointmentMutationResponse> => {
    const response = await api.put<AppointmentMutationResponse>(
      "/v5/api/appointment/action",
      data 
    );
    return response.data;
  },

 
  cancelAppointment: async (
    data: CancelAppointmentData
  ): Promise<AppointmentMutationResponse> => {
    const response = await api.delete<AppointmentMutationResponse>(
      "/v5/api/appointemnt/cancel",
      { data }
    );
    return response.data;
  },

  
getAllAppointments: async (): Promise<GetAppointmentsResponse> => {
  const response = await api.get<GetAppointmentsResponse>(
    "/v5/api/appointment/all"
  );
  return response.data;
},
};

export default appointmentService;