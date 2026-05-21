import axios from "axios";
import { firebaseAuth } from "@shared/firebase/auth";

const api = axios.create({
  // Para Next.js, as variáveis de ambiente do lado do cliente devem usar process.env e ser prefixadas com NEXT_PUBLIC_
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api",
});

/**
 * Interceptor de Requisição:
 * Executa antes de cada chamada ao backend.
 */
api.interceptors.request.use(
  async (config) => {
    // Aguarda o Firebase Auth inicializar para evitar requisições sem token ao recarregar a página (F5)
    await firebaseAuth.authStateReady();
    const user = firebaseAuth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error(
        "Sessão expirada ou não autorizada. Redirecionando para o login.",
      );
      if (typeof window !== "undefined")
        window.dispatchEvent(new Event("coop-auth-error"));
    }
    return Promise.reject(error);
  },
);

export default api;
