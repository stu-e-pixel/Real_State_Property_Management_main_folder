import api from "./api";
import type {
  CreatePropertyData,
  UpdatePropertyData,
  GetAllPropertiesResponse,
  PropertyResponse,
  DeletePropertyResponse,
  GetPropertyByIdResponse,
} from "../typescript/type/property.types";

const buildFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value === undefined || value === null || value === "") return;

    // ---------- Images (multiple) ----------
    if (key === "images") {
      if (value instanceof FileList) {
        Array.from(value).forEach((file) => formData.append("images", file));
      } else if (Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) formData.append("images", file);
        });
      }
      return;
    }

    // ---------- Amenities (array → repeat) ----------
    if (key === "amenities") {
      if (Array.isArray(value)) {
        value.forEach((a) => formData.append("amenities", String(a)));
      } else if (typeof value === "string" && value.trim()) {
        value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((a) => formData.append("amenities", a));
      }
      return;
    }

    // ---------- Location (nested object) ----------
    if (key === "location" && typeof value === "object") {
      const loc = value as { type: string; coordinates: number[] };
      formData.append("location[type]", loc.type);
      formData.append("location[coordinates][0]", String(loc.coordinates[0]));
      formData.append("location[coordinates][1]", String(loc.coordinates[1]));
      return;
    }

    // ---------- Everything else ----------
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

const propertyService = {
  // ---------------- CREATE (owner) ----------------
  createProperty: async (
    data: CreatePropertyData
  ): Promise<PropertyResponse> => {
    const formData = buildFormData(data as unknown as Record<string, unknown>);

    const response = await api.post<PropertyResponse>(
      "/v2/api/create-property",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  getPropertyById: async (id: string): Promise<GetPropertyByIdResponse> => {
  const response = await api.get<GetPropertyByIdResponse>(
    `/v2/api/property/${id}`
  );
  return response.data;
},

  // ---------------- UPDATE (owner) ----------------
  updateProperty: async (
    id: string,
    data: UpdatePropertyData
  ): Promise<PropertyResponse> => {
    const formData = buildFormData(data as unknown as Record<string, unknown>);

    const response = await api.put<PropertyResponse>(
      `/v2/api/property/update/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  // ---------------- GET ALL (role-based) ----------------
  getAllProperties: async (params: {
    page?: number;
    limit?: number;
    propertyTitle?: string;
    minprice?: number | string;
    maxprice?: number | string;
  }): Promise<GetAllPropertiesResponse> => {
    const response = await api.get<GetAllPropertiesResponse>(
      "/v2/api/getAllProperty",
      { params }
    );
    return response.data;
  },

  // ---------------- SOFT DELETE (owner) ----------------
  softDeleteProperty: async (id: string): Promise<DeletePropertyResponse> => {
    const response = await api.delete<DeletePropertyResponse>(
      `/v2/api/softdeleteproperty/${id}`
    );
    return response.data;
  },

  // ---------------- RESTORE (owner) ----------------
  restoreProperty: async (id: string): Promise<PropertyResponse> => {
    const response = await api.patch<PropertyResponse>(
      `/v2/api/retrivedeletedproperty/${id}`
    );
    return response.data;
  },

  // ---------------- PERMANENT DELETE (owner) ----------------
  permanentDeleteProperty: async (
    id: string
  ): Promise<DeletePropertyResponse> => {
    const response = await api.delete<DeletePropertyResponse>(
      `/v2/api/delete/property/Permanently/${id}`
    );
    return response.data;
  },

  // ---------------- MY APPROVED (agent) ----------------
getMyApprovedProperties: async (params: {
  search?: string;
  purpose?: string;
  page?: number;
  limit?: number;
}): Promise<GetAllPropertiesResponse> => {
  const response = await api.get<GetAllPropertiesResponse>(
    "/v2/api/my-approved-properties",
    { params }
  );
  return response.data;
},

  // ---------------- APPROVE (admin) ----------------
  approveProperty: async (
  id: string,
  rejectionReason?: string
): Promise<PropertyResponse> => {
  const response = await api.patch<PropertyResponse>(
    `/v2/api/approveproperty/${id}`,
    { rejectionReason } // optional
  );
  return response.data;
},

getPublicApproved: async (params: {
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
}): Promise<GetAllPropertiesResponse> => {
  const response = await api.get<GetAllPropertiesResponse>(
    "/v2/api/public-approved",
    { params }
  );
  return response.data;
},

getOwnerProperties: async (): Promise<GetAllPropertiesResponse> => {
  const response = await api.get<GetAllPropertiesResponse>(
    "/v2/api/owner/my-properties"
  );
  return response.data;
},

};

export default propertyService;