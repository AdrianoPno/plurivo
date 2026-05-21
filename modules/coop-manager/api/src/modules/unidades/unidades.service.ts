import { db } from "../../config/firebase.js";
import { AppError } from "../../../../../../shared/utils/AppError.js";
import {
  IUnidade,
  ICreateUnidadeDTO,
  IUpdateUnidadeDTO,
} from "./unidades.types.js";

export class UnidadesService {
  private collection = db.collection("unidades");

  async listAll(): Promise<IUnidade[]> {
    const snapshot = await this.collection.orderBy("nome", "asc").get();
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as IUnidade,
    );
  }

  async getById(id: string): Promise<IUnidade> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new AppError("Unidade não encontrada.", 404);
    }
    return { id: doc.id, ...doc.data() } as IUnidade;
  }

  async create(data: ICreateUnidadeDTO): Promise<string> {
    const sigla = data.sigla.toLowerCase();
    const existing = await this.collection.where("sigla", "==", sigla).get();
    if (!existing.empty) {
      throw new AppError("A sigla informada já está em uso.", 400);
    }

    const newUnidade: Omit<IUnidade, "id"> = {
      nome: data.nome,
      sigla,
      status: data.status || "ATIVO",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await this.collection.add(newUnidade);
    return docRef.id;
  }

  async update(id: string, data: IUpdateUnidadeDTO): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new AppError("Unidade não encontrada.", 404);
    }

    if (data.sigla) {
      const newSigla = data.sigla.toLowerCase();
      if (doc.data()?.sigla !== newSigla) {
        const existing = await this.collection
          .where("sigla", "==", newSigla)
          .get();
        if (!existing.empty) {
          throw new AppError("A sigla informada já está em uso.", 400);
        }
      }
      data.sigla = newSigla;
    }

    await docRef.update({ ...data, updatedAt: new Date() });
  }

  async delete(id: string): Promise<void> {
    // Validação: Não permitir exclusão se houver dependências
    const usersSnapshot = await db
      .collection("users")
      .where("unidadeId", "==", id)
      .limit(1)
      .get();
    if (!usersSnapshot.empty) {
      throw new AppError(
        "Não é possível excluir a unidade, pois existem usuários vinculados a ela.",
        400,
      );
    }

    const cooperadosSnapshot = await db
      .collection("cooperados")
      .where("unidadeId", "==", id)
      .limit(1)
      .get();
    if (!cooperadosSnapshot.empty) {
      throw new AppError(
        "Não é possível excluir a unidade, pois existem cooperados vinculados a ela.",
        400,
      );
    }

    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new AppError("Unidade não encontrada.", 404);
    }

    await docRef.delete();
  }
}
