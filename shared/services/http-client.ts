import axios from "axios";
import { env } from "../config/env";
import { STORAGE_KEYS } from "../constants/storage-keys";

export const httpClient = axios.create({
  baseURL: env.apiUrl,
});

httpClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
