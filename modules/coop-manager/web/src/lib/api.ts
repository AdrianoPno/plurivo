import axios from "axios";

import { MODULE_URLS } from "@shared/constants/modules";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_PEOPLE_API_URL ||
    process.env.NEXT_PUBLIC_COOP_MANAGER_API_URL ||
    MODULE_URLS.coopManager.api,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("platform-token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      window.dispatchEvent(new Event("auth-error"));
    }

    return Promise.reject(error);
  },
);

export default api;
