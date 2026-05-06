export type AuthProvider = "google" | "email" | "github";

export interface AuthSession {
  token: string;
  refreshToken?: string;

  expiresAt?: number;
}

export interface AuthUser {
  uid: string;

  name: string;

  email: string;

  photoUrl?: string;

  role: "ADMIN" | "MANAGER" | "USER";

  provider?: AuthProvider;

  companyId?: string;

  sectorId?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;

  loading: boolean;

  authenticated: boolean;
}
