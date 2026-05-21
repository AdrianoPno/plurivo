import axios from "axios";

const api = axios.create({
  // Para Next.js, as variáveis de ambiente do lado do cliente devem usar process.env e ser prefixadas com NEXT_PUBLIC_
  baseURL: process.env.NEXT_PUBLIC_COOP_API_URL || "http://localhost:3004/api",
});

/**
 * Interceptor de Requisição:
 * Executa antes de cada chamada ao backend.
 * Este padrão é alinhado com o 'vox-observatory', onde um token customizado da API
 * é armazenado no localStorage após a troca do token do Firebase.
 */
api.interceptors.request.use(
  async (config) => {
    // Em vez de buscar o token do Firebase a cada requisição,
    // buscamos o token da API que foi salvo no localStorage durante o login.
    if (typeof window !== "undefined") {
      // A chave do token deve ser padronizada, ex: 'coop-api-token'
      const token = localStorage.getItem("coop-api-token");

      if (config.headers) {
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
 * Trata erros globais, como tokens expirados.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error(
        "Sessão expirada ou não autorizada. Redirecionando para o login.",
      );
      // Dispara um evento para que o AuthProvider possa deslogar o usuário.
      // Isso centraliza a lógica de logout.
      window.dispatchEvent(new Event("coop-auth-error"));
    }
    return Promise.reject(error);
  },
);

export default api;
