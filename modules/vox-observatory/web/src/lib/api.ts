import axios from "axios";
import Cookies from "js-cookie";

import { useLoadingStore } from "@/store/use-loading-store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002",
  withCredentials: true,
});

/**
 * Interceptor de Request
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
 * Interceptor de Response
 */
api.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().stopLoading();
    return response;
  },
  (error: unknown) => {
    useLoadingStore.getState().stopLoading();

    if (axios.isAxiosError(error)) {
      const isUnauthorized = error.response?.status === 401;
      const isAuthEndpoint = error.config?.url?.includes("/auth/sessions");

      if (isUnauthorized && !isAuthEndpoint && typeof window !== "undefined") {
        localStorage.removeItem("vox-api-token");

        Cookies.remove("session", {
          path: "/",
        });

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

/**
 * USER TYPES
 */
export type UserRole = "ADMIN" | "VIEWER" | "SUPER";

export type UserStatus = "ativo" | "inativo";

/**
 * RESEARCH TYPES
 */
export type ResearchStatus = "em_andamento" | "concluida" | "pausada";

export type ResearchMethodology =
  | "quantitativa"
  | "qualitativa"
  | "etnografica"
  | "teste_usabilidade";

/**
 * USER
 */
export interface ApiUser {
  uid: string;
  nome: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UpdateUserData {
  nome?: string;
}

/**
 * ARTIFACT
 */
export interface Artifact {
  url: string;
  name?: string;
  type?: string;
}

/**
 * CREATE RESEARCH
 */
export interface CreateResearchData {
  title: string;
  description: string;
  objective: string;

  methodology: ResearchMethodology;

  startDate: string;

  estimatedEndDate: string;

  status: ResearchStatus;

  targetAudience: string;

  location: string;

  estimatedCost: number;

  tags: string[];

  insights?: string;

  artifacts?: Artifact[];
}

/**
 * UPDATE RESEARCH
 */
export interface UpdateResearchData extends Partial<CreateResearchData> {
  actualEndDate?: string | null;
  actualCost?: number;
}

/**
 * RESEARCH RESPONSE
 */
export type Research = Omit<CreateResearchData, "artifacts"> & {
  id: string;

  createdAt: string; // createdAt não deve ser nulo

  updatedAt: string; // updatedAt não deve ser nulo

  actualEndDate?: string | null;

  actualCost?: number;

  artifacts: Artifact[];
};

/**
 * LIST FILTERS
 */
export interface ListResearchesFilters {
  title?: string;

  status?: ResearchStatus;

  location?: string;

  tag?: string;

  limit?: number;

  startAfter?: string;
}

/**
 * LIST RESPONSE
 */
export interface ListResearchesResponse {
  data: Research[];

  nextCursor?: string;
}

/**
 * AUTH
 */
export async function exchangeFirebaseTokenForApiToken(
  idToken: string,
): Promise<string> {
  const response = await api.post<{
    token: string;
  }>("/auth/sessions", {
    idToken,
  });

  return response.data.token;
}

/**
 * USER
 */
export async function getMe(): Promise<ApiUser> {
  const response = await api.get<ApiUser>("/me");

  return response.data;
}

export async function updateMe(data: UpdateUserData): Promise<ApiUser> {
  const response = await api.patch<ApiUser>("/me", data);

  return response.data;
}

/**
 * RESEARCH
 */
export async function createResearch(
  data: CreateResearchData,
): Promise<Research> {
  const response = await api.post<Research>("/researches", data);

  return response.data;
}

export async function updateResearch({
  id,
  data,
}: {
  id: string;
  data: UpdateResearchData;
}): Promise<void> {
  await api.patch(`/researches/${id}`, data);
}

export async function getResearches(
  filters?: ListResearchesFilters,
): Promise<ListResearchesResponse> {
  const response = await api.get<Research[] | ListResearchesResponse>(
    "/researches",
    {
      params: filters,
    },
  );

  /**
   * Compatibilidade:
   * Backend antigo -> retorna array
   * Backend novo -> retorna objeto paginado
   */
  if (Array.isArray(response.data)) {
    return {
      data: response.data,
      nextCursor: undefined,
    };
  }

  return response.data;
}

export async function getResearchById(id: string): Promise<Research> {
  const response = await api.get<Research>(`/researches/${id}`);

  return response.data;
}

export async function deleteResearch(id: string): Promise<void> {
  await api.delete(`/researches/${id}`);
}
