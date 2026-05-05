import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
});

/**
 * Interceptor de Requisição:
 * Garante que o token mais atual do localStorage seja enviado.
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("vox-api-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Interceptor de Resposta:
 * Trata erros globais, especificamente o 401 (Unauthorized) para evitar loopings.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error.response?.status === 401;
    const isAuthEndpoint = error.config?.url?.includes("/auth/sessions");

    if (isUnauthorized && !isAuthEndpoint) {
      if (typeof window !== "undefined") {
        // Limpa o token para evitar que requisições subsequentes continuem falhando
        localStorage.removeItem("vox-api-token");
        Cookies.remove("session", { path: "/" });

        const isLoginPage = window.location.pathname.includes("/login");

        // Só redireciona se o usuário já não estiver na tela de login
        if (!isLoginPage) {
          window.location.href = "/login?session=expired";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;

// --- Interfaces ---

export interface ApiUser {
  uid: string;
  nome: string;
  email: string;
  role: "ADMIN" | "VIEWER" | "SUPER";
  status: "ativo" | "inativo";
}

export interface UpdateUserData {
  nome?: string;
}

export interface CreateResearchData {
  title: string;
  description: string;
  objective: string;
  methodology:
    | "quantitativa"
    | "qualitativa"
    | "etnografica"
    | "teste_usabilidade";
  startDate: string;
  estimatedEndDate: string;
  targetAudience: string;
  location: string;
  estimatedCost: number;
  tags: string[];
  status: "em_andamento" | "concluida" | "pausada";
}

export type UpdateResearchData = Partial<Omit<CreateResearchData, "status">>;

// A interface completa, baseada no que a API retorna
export type Research = CreateResearchData & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export interface ListResearchesFilters {
  status?: "em_andamento" | "concluida" | "pausada";
  tag?: string;
  location?: string;
  title?: string;
}

// --- Funções de API ---

/**
 * Troca o idToken do Firebase pelo token JWT da API Vox.
 */
export async function exchangeFirebaseTokenForApiToken(
  idToken: string,
): Promise<string> {
  const response = await api.post("/auth/sessions", { idToken });
  const { token } = response.data;
  return token;
}

/**
 * Busca os dados do perfil do usuário logado.
 */
export async function getMe(): Promise<ApiUser> {
  const response = await api.get("/me");
  return response.data;
}

/**
 * Atualiza os dados do perfil do usuário logado.
 */
export async function updateMe(data: UpdateUserData): Promise<ApiUser> {
  const response = await api.patch("/me", data);
  return response.data;
}

/**
 * Cria uma nova pesquisa/descoberta no Vox Observatory.
 */
export async function createResearch(data: CreateResearchData): Promise<void> {
  await api.post("/researches", data);
}

/**
 * Atualiza uma pesquisa/descoberta existente.
 */
export async function updateResearch({
  id,
  data,
}: {
  id: string;
  data: UpdateResearchData;
}) {
  await api.patch(`/researches/${id}`, data);
}

/**
 * Lista todas as pesquisas/descobertas.
 */
export async function getResearches(filters?: ListResearchesFilters) {
  const response = await api.get("/researches", {
    params: filters,
  });
  return response.data;
}
