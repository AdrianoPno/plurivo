import axios from "axios";

import { MODULE_URLS } from "@shared/constants/modules";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_RESEARCH_API_URL ||
    process.env.NEXT_PUBLIC_VOX_OBSERVATORY_API_URL ||
    MODULE_URLS.voxObservatory.api,
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

export type ApiUser = {
  uid: string;
  nome: string;
  email: string;
  role: "ADMIN" | "USER" | "VIEWER" | "SUPER";
  status: "ativo" | "inativo";
  ativo: boolean;
};

export type ResearchStatus = "em_andamento" | "concluida" | "pausada";

export type ResearchMethodology =
  | "quantitativa"
  | "qualitativa"
  | "etnografica"
  | "teste_usabilidade";

export type ResearchArtifact = {
  url: string;
  name?: string;
  type?: string;
};

export type Research = {
  id: string;
  title: string;
  description: string;
  objective: string;
  methodology: ResearchMethodology;
  status: ResearchStatus;
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string | null;
  estimatedCost: number;
  actualCost: number;
  targetAudience: string;
  location: string;
  tags: string[];
  insights?: string;
  artifacts: ResearchArtifact[];
  createdAt: string;
  updatedAt: string;
};

export type ListResearchesFilters = {
  status?: ResearchStatus;
  tag?: string;
  location?: string;
  title?: string;
  limit?: number;
  startAfter?: string;
};

export type ListResearchesResponse = {
  data: Research[];
  nextCursor?: string;
};

export type CreateResearchPayload = Omit<Research, "id" | "createdAt" | "updatedAt">;

export type UpdateResearchPayload = Partial<CreateResearchPayload>;

export async function getMe() {
  const response = await api.get<ApiUser>("/users/me");
  return response.data;
}

export async function updateMe(data: { nome?: string }) {
  const response = await api.patch<ApiUser>("/users/me", data);
  return response.data;
}

export async function getResearches(filters: ListResearchesFilters = {}) {
  const response = await api.get<ListResearchesResponse>("/researches", {
    params: filters,
  });

  return response.data;
}

export async function getResearchById(id: string) {
  const response = await api.get<Research>(`/researches/${id}`);
  return response.data;
}

export async function createResearch(data: CreateResearchPayload) {
  const response = await api.post<Research>("/researches", data);
  return response.data;
}

export async function updateResearch({
  id,
  data,
}: {
  id: string;
  data: UpdateResearchPayload;
}) {
  const response = await api.patch<Research>(`/researches/${id}`, data);
  return response.data;
}

export async function deleteResearch(id: string) {
  await api.delete(`/researches/${id}`);
}

export default api;
