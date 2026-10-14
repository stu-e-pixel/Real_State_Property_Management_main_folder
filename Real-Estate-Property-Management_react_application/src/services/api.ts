import axios, { AxiosError } from "axios";
import type {InternalAxiosRequestConfig} from "axios"
import { tokenStorage } from "../utils/tokenStorage";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          if (!window.location.pathname.includes("/")) {
            tokenStorage.clearAll();
            toast.error("Session expired. Please login again.");
            window.location.href = "/";
          }
          break;
        case 403:
          toast.error(response.data?.message || "Access denied");
          break;
        case 404:
          break;
        case 500:
          toast.error(response.data?.message || "Server error");
          break;
        default:
          break;
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;