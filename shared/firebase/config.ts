import { initializeApp, getApps, getApp } from "firebase/app";
import { env } from "../config/env";

const firebaseConfig = {
  apiKey: env.firebaseApiKey,
  authDomain: env.firebaseAuthDomain,
  projectId: env.firebaseProjectId,
  storageBucket: env.firebaseStorageBucket,
  messagingSenderId: env.firebaseMessagingSenderId,
  appId: env.firebaseAppId,
};

export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);
