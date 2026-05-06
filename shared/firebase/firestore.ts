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

let dbInstance: Firestore | null = null;
let appInstance: App | null = null;

function getFirebaseKeyPath() {
  const keyPath = process.env.FIREBASE_KEY_PATH;

  if (!keyPath) {
    throw new Error(
      "A variável de ambiente FIREBASE_KEY_PATH não foi definida.",
    );
  }

  return path.resolve(process.cwd(), keyPath);
}

function getFirebaseStorageBucket() {
  const bucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!bucket) {
    throw new Error(
      "A variável de ambiente FIREBASE_STORAGE_BUCKET não foi definida.",
    );
  }

  return bucket;
}

export function initializeFirebaseAdmin() {
  if (appInstance && dbInstance) {
    return;
  }

  const apps = getApps();

  if (apps.length > 0) {
    appInstance = apps[0];
  } else {
    appInstance = initializeApp({
      credential: cert(getFirebaseKeyPath()),
      storageBucket: getFirebaseStorageBucket(),
    });
  }

  const db = getFirestore(appInstance);

  db.settings({
    ignoreUndefinedProperties: true,
  });

  dbInstance = db;
}

export function getDatabase(): Firestore {
  if (!dbInstance) {
    initializeFirebaseAdmin();
  }

  return dbInstance!;
}

export function getBucket() {
  if (!appInstance) {
    initializeFirebaseAdmin();
  }

  return getStorage(appInstance!).bucket(getFirebaseStorageBucket());
}
