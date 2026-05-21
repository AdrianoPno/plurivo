import { getAuth, connectAuthEmulator } from "firebase/auth";
import { firebaseApp } from "./config";

/**
 * A instância única e compartilhada do serviço de Autenticação do Firebase para o cliente.
 */
export const firebaseAuth = getAuth(firebaseApp);

// Em ambiente de desenvolvimento, você pode conectar ao Emulador do Firebase.
// Este é o local correto para fazer isso, aplicando a todos os módulos.
// if (process.env.NODE_ENV === "development") {
//   connectAuthEmulator(firebaseAuth, "http://localhost:9099");
// }
