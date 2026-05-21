import { db } from "../../config/firebase.js";
import { AppError } from "../../../../../../shared/utils/AppError";
import { IUser } from "../users/usuario.types";

export class UsersService {
  private collection = db.collection("users");

  /**
   * Busca um usuário pelo UID do Firebase.
   * Usado pelo AuthMiddleware e AuthController.
   */
  async getById(uid: string): Promise<IUser> {
    const doc = await this.collection.doc(uid).get();

    if (!doc.exists) {
      throw new AppError("Usuário não encontrado no banco de dados.", 404);
    }

    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      // Garante que campos de data sejam tratados corretamente se vierem do Firestore
      createdAt: data?.createdAt?.toDate
        ? data.createdAt.toDate()
        : data?.createdAt,
    } as IUser;
  }

  /**
   * Cria o perfil inicial do usuário.
   * Geralmente chamado por um Admin ou no primeiro login (se houver auto-cadastro).
   */
  async create(
    userData: Omit<IUser, "id" | "createdAt" | "ativo">,
  ): Promise<void> {
    const userRef = this.collection.doc(userData.uid);
    const doc = await userRef.get();

    if (doc.exists) {
      throw new AppError("Usuário já cadastrado.", 400);
    }

    await userRef.set({
      ...userData,
      ativo: true,
      role: userData.role || "USER",
      createdAt: new Date(),
    });
  }

  /**
   * Atualiza dados do perfil (ex: mudar role ou unidade).
   * Restrito a ADM no Controller.
   */
  async update(uid: string, data: Partial<IUser>): Promise<void> {
    const userRef = this.collection.doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    await userRef.update({
      ...data,
      updatedAt: new Date(),
    });
  }
}
