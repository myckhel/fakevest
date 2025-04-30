import { router } from "@inertiajs/react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// Create axios instance with base configuration
const httpClient = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle request interceptor for auth tokens
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response interceptor for common error handling
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // inertia visit to login page
      router.visit("/login", {
        method: "get",
        preserveState: false,
        preserveScroll: true,
        replace: true,
        data: {},
      });
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Generic request method with typing
export const request = async <T = any>(
  config: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await httpClient(config);
  return response.data;
};

// Common HTTP methods
export const Http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "GET", url }),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "POST", url, data }),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "PUT", url, data }),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "DELETE", url }),

  upload: <T = any>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ) =>
    request<T>({
      ...config,
      method: "POST",
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    }),
};

export default Http;
