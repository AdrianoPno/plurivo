import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    // No Next.js, o localStorage só está disponível no lado do cliente.
    if (typeof window !== "undefined") {
      // O token da API do backend, não o cookie de sessão do Next.js
      const token = localStorage.getItem("vox-api-token");
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

// Definindo o tipo de usuário que esperamos da API, alinhado com o backend
export interface ApiUser {
  uid: string;
  nome: string;
  email: string;
  role: "ADMIN" | "VIEWER" | "SUPER";
  status: "ativo" | "inativo";
}

/**
 * Troca o idToken do Firebase pelo token JWT da nossa API.
 * @param idToken O token obtido do Firebase Auth no cliente.
 * @returns O token JWT da API.
 */
export async function exchangeFirebaseTokenForApiToken(
  idToken: string,
): Promise<string> {
  const response = await api.post("/auth/sessions", { idToken });
  const { token } = response.data;
  return token;
}

/**
 * Busca os dados do perfil do usuário autenticado na nossa API.
 * @returns Os dados do usuário.
 */
export async function getMe(): Promise<ApiUser> {
  const response = await api.get("/me");
  return response.data;
}
