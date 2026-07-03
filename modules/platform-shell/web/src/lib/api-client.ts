import { MODULE_URLS } from "@shared/constants/modules";
import type { IUser, ModulePermission, UserRole } from "@shared/types/user.js";
import { AppError } from "@shared/utils/app-error.js";
import type {
  CreateTenantInput,
  Tenant,
  UpdateTenantInput,
} from "@shared/types/tenant.js";

export interface ICreateUserPayload {
  nome: string;
  email: string;
  role: UserRole;
  password?: string;
  unidadeId?: string;
  permissions: ModulePermission[];
}

export type IUpdateUserPayload = Partial<
  Omit<ICreateUserPayload, "email" | "password"> & { ativo: boolean }
>;

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_PLATFORM_SHELL_API_URL ??
  MODULE_URLS.platformShell.api;

const getHeaders = () => {
  const token = localStorage.getItem("platform-token");

  if (!token) {
    throw new AppError("Token de autenticacao nao encontrado.", 401);
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async <T = unknown>(response: Response): Promise<T> => {
  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event("auth-error"));
    }

    const errorData = await response.json().catch(() => ({}));
    const message =
      typeof errorData.message === "string"
        ? errorData.message
        : "Erro na requisicao";

    throw new AppError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const successData = await response.json();
  return successData.data;
};

export const getUsers = async (): Promise<IUser[]> => {
  const response = await fetch(`${getApiUrl()}/users`, {
    headers: getHeaders(),
  });

  return handleResponse<IUser[]>(response);
};

export const createUser = async (
  userData: ICreateUserPayload,
): Promise<{ uid: string }> => {
  const response = await fetch(`${getApiUrl()}/users`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

export const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: IUpdateUserPayload;
}): Promise<void> => {
  const response = await fetch(`${getApiUrl()}/users/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(`${getApiUrl()}/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return handleResponse(response);
};

export const getTenants = async (): Promise<Tenant[]> => {
  const response = await fetch(`${getApiUrl()}/tenants`, {
    headers: getHeaders(),
  });
  return handleResponse<Tenant[]>(response);
};

export const getCurrentTenant = async (): Promise<Tenant | null> => {
  const response = await fetch(`${getApiUrl()}/tenants/current`, {
    headers: getHeaders(),
  });
  return handleResponse<Tenant | null>(response);
};

export const createTenant = async (
  data: CreateTenantInput,
): Promise<Tenant> => {
  const response = await fetch(`${getApiUrl()}/tenants`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Tenant>(response);
};

export const updateTenant = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateTenantInput;
}): Promise<Tenant> => {
  const response = await fetch(`${getApiUrl()}/tenants/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Tenant>(response);
};
