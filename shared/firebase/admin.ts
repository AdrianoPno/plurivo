import admin from "firebase-admin";
import path from "node:path";

export class DocumentNotFoundException extends Error {
  constructor(message = "Documento não encontrado.") {
    super(message);
    this.name = "DocumentNotFoundException";
  }
}

if (!admin.apps.length) {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Sobe os 3 níveis corretamente a partir do processo de execução das APIs
    const rootKeyPath = path.resolve(
      process.cwd(),
      "../../../firebase-key.json",
    );

    admin.initializeApp({
      credential: admin.credential.cert(rootKeyPath),
    });
  } else {
    admin.initializeApp();
  }
}

export const auth = admin.auth();
export const firestore = admin.firestore();

/** @deprecated Use `firestore` for Firestore instances. */
export const getDatabase = () => admin.firestore();

export { admin };
