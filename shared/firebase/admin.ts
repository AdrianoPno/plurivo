import path from "node:path";

import { App, cert, getApps, initializeApp } from "firebase-admin/app";

import { Firestore, getFirestore } from "firebase-admin/firestore";

import { getStorage } from "firebase-admin/storage";

export class DocumentNotFoundException extends Error {
  constructor(message: string) {
    super(message);

    this.name = "DocumentNotFoundException";
  }
}

const keyPath = process.env.FIREBASE_KEY_PATH;

if (!keyPath) {
  throw new Error("A variável FIREBASE_KEY_PATH não foi definida.");
}

const resolvedPath = path.resolve(process.cwd(), keyPath);

let appInstance: App;

if (!getApps().length) {
  appInstance = initializeApp({
    credential: cert(resolvedPath),

    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
} else {
  appInstance = getApps()[0] as App;
}

const firestore = getFirestore(appInstance);

firestore.settings({
  ignoreUndefinedProperties: true,
});

const storage = getStorage(appInstance).bucket();

export { appInstance };

export { firestore };

export { storage };

export function getDatabase(): Firestore {
  return firestore;
}

export function getBucket() {
  return storage;
}
