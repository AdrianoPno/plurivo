import { firestore as db } from "@shared/firebase/admin.js";
import { AppError } from "@shared/utils/app-error.js";
import { UserRole, ModulePermission } from "@shared/types/user";
import {
  ICooperado,
  ICreateCooperadoDTO,
  IUpdateCooperadoDTO,
} from "./cooperado.types";

// Alinhado com o que discutimos para o Auth
interface AuthUser {
  uid: string;
  role: UserRole;
  permissions: ModulePermission[];
  unidadeId?: string;
}

export class CooperadosService {
  private collection = db.collection("cooperados");

  async list(user: AuthUser): Promise<ICooperado[]> {
    let query: FirebaseFirestore.Query = this.collection;

    // Multi-tenant: ADMIN vê apenas o seu. SUPER vê tudo.
    if (user.role !== "SUPER") {
      if (!user.unidadeId) {
        throw new AppError("Usuario sem unidade associada.", 400);
      }
      query = query.where("unidadeId", "==", user.unidadeId);
    }

    const snapshot = await query.orderBy("nome", "asc").get();

    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as ICooperado,
    );
  }

  async create(data: ICreateCooperadoDTO, user: AuthUser): Promise<string> {
    let unidadeIdParaCriacao: string | undefined;

    if (user.role === "SUPER") {
      // Para SUPER, a unidadeId DEVE vir no corpo da requisição.
      unidadeIdParaCriacao = (data as any).unidadeId;
      if (!unidadeIdParaCriacao) {
        throw new AppError(
          "Usuário SUPER deve especificar a 'unidadeId' no corpo da requisição para criar um registro.",
          400,
        );
      }
    } else if (user.role === "ADMIN" || user.role === "USER") {
      // Para ADMIN, a unidadeId é extraída do seu token.
      unidadeIdParaCriacao = user.unidadeId;
      if (!unidadeIdParaCriacao) {
        throw new AppError("Usuario sem unidade associada.", 400);
      }
    } else {
      throw new AppError("Acesso negado. Permissão insuficiente.", 403);
    }

    const newDoc: Omit<ICooperado, "id"> = {
      ...data,
      unidadeId: unidadeIdParaCriacao,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    const docRef = await this.collection.add(newDoc);
    return docRef.id;
  }

  async update(
    id: string,
    data: IUpdateCooperadoDTO,
    user: AuthUser,
  ): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) throw new AppError("Cooperado não encontrado.", 404);

    // Bloqueio Multi-tenant
    if (user.role !== "SUPER" && doc.data()?.unidadeId !== user.unidadeId) {
      throw new AppError("Acesso negado: registro de outra unidade.", 403);
    }

    await docRef.update({
      ...data,
      atualizadoEm: new Date(),
    });
  }

  async getById(id: string, user: AuthUser): Promise<ICooperado> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) throw new AppError("Cooperado não encontrado.", 404);

    const cooperadoData = doc.data();

    if (user.role !== "SUPER" && cooperadoData?.unidadeId !== user.unidadeId) {
      throw new AppError("Cooperado não encontrado nesta unidade.", 404);
    }

    return { id: doc.id, ...cooperadoData } as ICooperado;
  }

  async delete(id: string, user: AuthUser): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) throw new AppError("Cooperado não encontrado.", 404);

    if (user.role !== "SUPER" && doc.data()?.unidadeId !== user.unidadeId) {
      throw new AppError("Acesso negado.", 403);
    }

    await docRef.delete();
  }
}
