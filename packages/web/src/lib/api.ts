import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    // No Next.js, o localStorage só está disponível no lado do cliente.
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
