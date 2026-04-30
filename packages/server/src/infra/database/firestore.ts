import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import path from "node:path";

// Custom error for document not found
export class DocumentNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DocumentNotFoundException";
  }
}

const keyPath = process.env.FIREBASE_KEY_PATH;

if (!keyPath) {
  throw new Error("A variável de ambiente FIREBASE_KEY_PATH não foi definida.");
}

const resolvedPath = path.resolve(process.cwd(), keyPath);

let dbInstance: Firestore | null = null;
let appInstance: App | null = null;

export const initializeFirebaseAdmin = () => {
  // Garante que a inicialização ocorra apenas uma vez.
  if (appInstance) return;

  if (!getApps().length) {
    appInstance = initializeApp({
      credential: cert(resolvedPath),
    });
  } else {
    appInstance = getApps()[0];
  }

  const db = getFirestore(appInstance);
  db.settings({ ignoreUndefinedProperties: true });
  dbInstance = db;
};

export const getDatabase = (): Firestore => {
  if (!dbInstance) {
    initializeFirebaseAdmin();
  }
  return dbInstance!;
};

export const getBucket = () => {
  if (!appInstance) {
    initializeFirebaseAdmin();
  }
  if (!process.env.FIREBASE_STORAGE_BUCKET) {
    throw new Error(
      "A variável de ambiente FIREBASE_STORAGE_BUCKET não foi definida.",
    );
  }
  return getStorage(appInstance!).bucket(process.env.FIREBASE_STORAGE_BUCKET);
};
