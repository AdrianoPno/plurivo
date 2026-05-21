import { auth, firestore } from "@shared/firebase/admin.js";

/**
 * Exporta instâncias autenticadas do Firebase Admin para o backend do coop-manager.
 * O Firebase Admin SDK já será inicializado automaticamente pelo shared/firebase/admin.ts
 * usando a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS.
 */
export const db = firestore;
export const adminAuth = auth;
