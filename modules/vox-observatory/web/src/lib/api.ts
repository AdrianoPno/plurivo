import axios from "axios";
import { MODULE_URLS } from "@shared/constants/modules.js";

const api = axios.create({
  // A URL base da API do seu módulo.
  // Usando a constante de shared/ e uma variável de ambiente como fallback.
  baseURL:
    process.env.NEXT_PUBLIC_VOX_API_URL || MODULE_URLS.voxObservatory.api,
});

/**
 * Interceptor de Requisição:
 * Anexa o token da plataforma em todas as chamadas para a API do Vox Observatory.
 */
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("platform-token");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Interceptor de Resposta:
 * Trata erros de autenticação (401) de forma global.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Dispara um evento global que o AuthProvider irá escutar para deslogar o usuário.
      window.dispatchEvent(new Event("auth-error"));
    }
    return Promise.reject(error);
  },
);

export default api;
