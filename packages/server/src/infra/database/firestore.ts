import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import path from "node:path";

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
