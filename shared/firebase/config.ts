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

// Validação para alertar claramente se as variáveis não foram carregadas sem derrubar a compilação
if (typeof window !== "undefined" && !firebaseConfig.apiKey) {
  console.error(
    "🔥 ERRO CRÍTICO: Chaves do Firebase ausentes no frontend. " +
      "O Next.js exige que o arquivo .env.local esteja DENTRO da pasta do projeto " +
      "(ex: modules/vox-observatory/web/.env.local). Verifique se o arquivo existe e contém NEXT_PUBLIC_FIREBASE_API_KEY.",
  );
}

export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);
