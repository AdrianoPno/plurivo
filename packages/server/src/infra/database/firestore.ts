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

let app: App;

export const getDatabase = (): Firestore => {
  if (!getApps().length) {
    app = initializeApp({
      credential: cert(resolvedPath),
    });
  } else {
    app = getApps()[0];
  }

  const db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });

  return db;
};

export const getBucket = () => {
  if (!process.env.FIREBASE_STORAGE_BUCKET) {
    throw new Error(
      "A variável de ambiente FIREBASE_STORAGE_BUCKET não foi definida.",
    );
  }
  return getStorage().bucket(process.env.FIREBASE_STORAGE_BUCKET);
};
