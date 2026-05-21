import admin from "firebase-admin";

/**
 * Custom exception for when a Firestore document is not found.
 */
export class DocumentNotFoundException extends Error {
  constructor(message = "Documento não encontrado.") {
    super(message);
    this.name = "DocumentNotFoundException";
  }
}
/**
 * Inicializa o Firebase Admin SDK de forma segura (singleton).
 *
 * O SDK procura automaticamente pela variável de ambiente `GOOGLE_APPLICATION_CREDENTIALS`
 * que deve apontar para o seu arquivo de chave de serviço (firebase-key.json).
 * Portanto, não é necessário passar credenciais explicitamente aqui.
 */
if (!admin.apps.length) {
  admin.initializeApp();
}

export const auth = admin.auth();
export const firestore = admin.firestore();

// This is likely a mistake in the consuming code, which should import `firestore`.
/** @deprecated Use `firestore` for Firestore instances. */
export const getDatabase = () => admin.firestore();
