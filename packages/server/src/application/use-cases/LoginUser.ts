import { LoginBody } from "@/interfaces/http/schemas/auth.schema";
import { getAuth } from "firebase-admin/auth";

// Erro customizado para credenciais/token inválido
export class InvalidCredentialsError extends Error {
  constructor() {
    super("Credenciais inválidas.");
    this.name = "InvalidCredentialsError";
  }
}

export class LoginUser {
  // O construtor pode ficar vazio ou receber outras dependências se necessário
  constructor() {}

  async execute({
    idToken,
  }: LoginBody): Promise<{ uid: string; email?: string }> {
    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const { uid, email } = decodedToken;
      // Opcional: Você pode buscar/criar um usuário no seu próprio banco de dados aqui
      // usando o uid/email do Firebase para sincronizar informações.
      return { uid, email };
    } catch (error) {
      // O token é inválido (expirado, malformado, etc.)
      throw new InvalidCredentialsError();
    }
  }
}
