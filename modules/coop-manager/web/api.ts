import axios from "axios";
import { MODULE_URLS, MODULES } from "@shared/constants/modules.js";

const api = axios.create({
  // Para Next.js, as variáveis de ambiente do lado do cliente devem usar process.env e ser prefixadas com NEXT_PUBLIC_
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004/api",
});

/**
 * Interceptor de Requisição:
 * Executa antes de cada chamada ao backend.
 */
api.interceptors.request.use(
  async (config) => {
    // Agora buscamos o token único da plataforma gerenciado pelo Shell
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
 * Útil para tratar erros globais (Ex: 401 Unauthorized)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Opcional: Lógica para deslogar o usuário se o token falhar no backend
      // Isso é útil se o token expirar e o Firebase ainda não o atualizou.
      console.error(
        "Sessão expirada ou não autorizada. Redirecionando para o login.",
      );
      // Para deslogar globalmente, você pode disparar um evento customizado
      // que o seu AuthProvider escuta para chamar a função de logout.
      window.dispatchEvent(new Event("auth-error"));
    }
    return Promise.reject(error);
  },
);

export default api;
