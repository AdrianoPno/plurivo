import axios from "axios";
import Cookies from "js-cookie";
import { useLoadingStore } from "@/store/use-loading-store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
});

/**
 * Interceptor de Requisição
 */
api.interceptors.request.use(
  (config) => {
    useLoadingStore.getState().startLoading();
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("vox-api-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    useLoadingStore.getState().stopLoading();
    return Promise.reject(error);
  },
);

/**
 * Interceptor de Resposta (Anti-Looping)
 */
api.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().stopLoading();
    return response;
  },
  (error) => {
    useLoadingStore.getState().stopLoading();
    const isUnauthorized = error.response?.status === 401;
    const isAuthEndpoint = error.config?.url?.includes("/auth/sessions");

    if (isUnauthorized && !isAuthEndpoint) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("vox-api-token");
        Cookies.remove("session", { path: "/" });

        const isLoginPage = window.location.pathname.includes("/login");

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

/**
 * Interface base para criação, refletindo o JSON completo enviado.
 */
export interface CreateResearchData {
  title: string;
  description: string;
  objective: string;
  methodology:
    | "quantitativa"
    | "qualitativa"
    | "etnografica"
    | "teste_usabilidade";
  startDate: string; // ISO Date String
  estimatedEndDate: string; // ISO Date String
  status: "em_andamento" | "concluida" | "pausada";
  targetAudience: string;
  location: string;
  estimatedCost: number;
  tags: string[];
  insights?: string; // Novo campo do JSON
  artifacts?: Artifact[]; // Adicionado para corresponder ao backend
}

export interface Artifact {
  url: string;
  name?: string;
  type?: string;
}

/**
 * Interface para atualização: permite editar custos reais e datas de término.
 */
export interface UpdateResearchData extends Partial<CreateResearchData> {
  actualEndDate?: string;
  actualCost?: number;
  artifacts?: Artifact[]; // Array de arquivos/links
}

/**
 * O objeto completo que vem da API (Response)
 */
export type Research = CreateResearchData & {
  id: string;
  createdAt: string;
  updatedAt: string;
  actualEndDate?: string;
  actualCost?: number;
  artifacts: any[];
};

export interface ListResearchesFilters {
  status?: "em_andamento" | "concluida" | "pausada";
  tag?: string;
  location?: string;
  title?: string;
}

// --- Funções de API ---

export async function exchangeFirebaseTokenForApiToken(
  idToken: string,
): Promise<string> {
  const response = await api.post("/auth/sessions", { idToken });
  const { token } = response.data;
  return token;
}

export async function getMe(): Promise<ApiUser> {
  const response = await api.get("/me");
  return response.data;
}

export async function updateMe(data: UpdateUserData): Promise<ApiUser> {
  const response = await api.patch("/me", data);
  return response.data;
}

export async function createResearch(
  data: CreateResearchData,
): Promise<Research> {
  const response = await api.post("/researches", data);
  return response.data;
}

export async function updateResearch({
  id,
  data,
}: {
  id: string;
  data: UpdateResearchData;
}) {
  await api.patch(`/researches/${id}`, data);
}

export async function getResearches(
  filters?: ListResearchesFilters,
): Promise<Research[]> {
  const response = await api.get("/researches", {
    params: filters,
  });
  return response.data;
}

export async function deleteResearch(id: string): Promise<void> {
  await api.delete(`/researches/${id}`);
}
