import { router } from "@inertiajs/react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// Create axios instance with base configuration
const httpClient = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true, // Enable sending cookies with requests
  withXSRFToken: true, // Enable CSRF token handling
});

// Handle response interceptor for common error handling
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Navigate to login page using Inertia
      router.visit("/login", {
        method: "get",
        preserveState: false,
        preserveScroll: true,
        replace: true,
        data: {},
      });
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
