import { IUser, UserRole } from "@shared/types/user.js";
import { ModulePermission } from "@shared/types/user.js";
import { AppError } from "@shared/utils/AppError.js";

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

const getApiUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL;
  if (!apiUrl) {
    throw new AppError("URL da API não configurada.", 500);
  }
  return apiUrl;
};

const getHeaders = () => {
  const token = localStorage.getItem("platform-token");
  if (!token) {
    throw new AppError("Token de autenticação não encontrado.", 401);
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async <T = any>(response: Response): Promise<T> => {
  if (!response.ok) {
    // Dispara um evento global que o AuthProvider pode ouvir para fazer logout
    if (response.status === 401) {
      window.dispatchEvent(new Event("auth-error"));
    }
    const errorData = await response.json().catch(() => ({}));
    throw new AppError(
      errorData.message || "Erro na requisição",
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T; // Retorna undefined para respostas sem conteúdo
  }

  const successData = await response.json();
  return successData.data;
};

export const getUsers = async (): Promise<{
  success: boolean;
  data: IUser[];
}> => {
  const response = await fetch(`${getApiUrl()}/users`, {
    headers: getHeaders(),
  });
  // Passamos o tipo genérico para o handleResponse saber o que está validando
  return handleResponse<{ success: boolean; data: IUser[] }>(response);
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
  // Agora pode usar o handler genérico, que sabe lidar com respostas 204
  return handleResponse(response);
};
