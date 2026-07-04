import "dotenv/config";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import path from "node:path";

const keyPath = process.env.FIREBASE_KEY_PATH;
if (!keyPath) {
  console.error(
    "❌ Erro: A variável FIREBASE_KEY_PATH não está definida no seu .env.local",
  );
  process.exit(1);
}

const resolvedKey = path.isAbsolute(keyPath)
  ? keyPath
  : path.resolve(process.cwd(), keyPath);

if (getApps().length === 0) {
  initializeApp({
    credential: cert(resolvedKey),
  });
}

const adminAuth = getAuth();
const db = getFirestore();

const SUPER_USER = {
  email: "admin@plurivo.local",
  password: "Mudar@Senha123!",
  displayName: "Administrador Root",
};

async function seed() {
  try {
    let userRecord;

    try {
      userRecord = await adminAuth.getUserByEmail(SUPER_USER.email);
      console.log(`ℹ️ Usuário Auth ${SUPER_USER.email} já existe.`);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        userRecord = await adminAuth.createUser({
          email: SUPER_USER.email,
          password: SUPER_USER.password,
          displayName: SUPER_USER.displayName,
          emailVerified: true,
        });
        console.log(`✨ Novo usuário criado no Auth! UID: ${userRecord.uid}`);
      } else {
        throw error;
      }
    }

    // 1. Injeta as Custom Claims no token do Firebase Auth (Bypass do middleware checkRoles)
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: "SUPER" });
    console.log("🚀 Custom Claims injetadas no Auth.");

    // 2. Persiste o perfil do usuário no Firestore para bater com o Schema da API
    const userFirestoreRef = db.collection("users").doc(userRecord.uid);

    const userProfileData = {
      uid: userRecord.uid,
      nome: SUPER_USER.displayName,
      email: SUPER_USER.email,
      role: "SUPER", // Alinhado com o UserRoleEnum do Zod
      ativo: true,
      unidadeId: null,
      permissions: [], // Modifique aqui se a sua aplicação exigir módulos iniciais
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await userFirestoreRef.set(userProfileData, { merge: true });
    console.log(
      "💾 Perfil do usuário espelhado no Firestore na coleção 'users'.",
    );

    console.log("------------------------------------------------------------");
    console.log(`✅ SEED COMPLETO! Usuário pronto para login.`);
    console.log("------------------------------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("❌ Falha ao executar o seed do usuário:", error);
    process.exit(1);
  }
}

seed();
