import { LoginBody } from "../../interfaces/http/schemas/auth.schema.js";
import { getAuth } from "firebase-admin/auth";
import { UserRepository } from "@/domain/repositories/UserRepository.js";
import { User } from "@/domain/entities/User.js";
// Erro customizado para credenciais/token inválido
export class InvalidCredentialsError extends Error {
  constructor() {
    super("Credenciais inválidas.");
    this.name = "InvalidCredentialsError";
  }
}

export class LoginUser {
  constructor(private userRepository: UserRepository) {}

  async execute({ idToken }: LoginBody): Promise<User> {
    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const { uid, email } = decodedToken;

      let user = await this.userRepository.findByUid(uid);

      // Se o usuário não existir no nosso Firestore, podemos criá-lo com um papel padrão
      if (!user) {
        // Em um cenário real, você pode ter uma lógica mais complexa para definir o nome e o papel inicial
        user = new User({
          uid,
          email: email || "email_nao_disponivel@example.com", // Firebase pode não retornar email em alguns casos
          nome: decodedToken.name || "Novo Usuário",
          role: "VIEWER", // Papel padrão para novos usuários
          status: "ativo",
        });
        await this.userRepository.save(user);
      }
      return user;
    } catch (error) {
      // Log do erro original do Firebase para melhor depuração
      console.error("Falha na verificação do token de ID do Firebase:", error);
      // O token é inválido (expirado, malformado, etc.)
      throw new InvalidCredentialsError();
    }
  }
}
