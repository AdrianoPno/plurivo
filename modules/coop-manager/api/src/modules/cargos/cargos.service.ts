import { firestore as db } from "@shared/firebase/admin.js";
import { UserRole, ModulePermission } from "@shared/types/user.js";
import { AppError } from "@shared/utils/app-error.js";
import { ICreateCargoDTO, ICargo, IUpdateCargoDTO } from "./cargo.types.js";

interface AuthUser {
  uid: string;
  role: UserRole;
  permissions: ModulePermission[];
  unidadeId?: string;
}

const DEFAULT_CARGOS: ICreateCargoDTO[] = [
  { nome: "Presidente", limiteVagas: 1 },
  { nome: "Diretor Administrativo", limiteVagas: 1 },
  { nome: "Diretor Financeiro", limiteVagas: 1 },
  { nome: "Coordenador de Mobilizacao", limiteVagas: 1 },
  { nome: "Coordenador de Producao", limiteVagas: 1 },
  { nome: "Coordenador de Administracao", limiteVagas: 1 },
  { nome: "Conselho Fiscal", limiteVagas: 3 },
  { nome: "Operacao", limiteVagas: 100 },
];

export class CargosService {
  private collection = db.collection("cargos");
  private cooperadosCollection = db.collection("cooperados");

  async list(user: AuthUser, unidadeId?: string): Promise<ICargo[]> {
    await this.ensureDefaultCargos();

    const snapshot = await this.collection.orderBy("nome", "asc").get();
    const cargos = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as ICargo,
    );

    const scopeUnidadeId = user.role === "SUPER" ? unidadeId : user.unidadeId;
    const ocupacao = await this.getOcupacaoPorCargo(scopeUnidadeId);

    return cargos.map((cargo) => {
      const ocupadas = ocupacao.get(cargo.nome) || 0;
      return {
        ...cargo,
        ocupadas,
        disponiveis: Math.max(cargo.limiteVagas - ocupadas, 0),
      };
    });
  }

  async create(data: ICreateCargoDTO): Promise<string> {
    const nome = data.nome.trim();
    await this.assertNomeDisponivel(nome);

    const docRef = await this.collection.add({
      nome,
      limiteVagas: data.limiteVagas,
      ativo: data.ativo ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return docRef.id;
  }

  async update(id: string, data: IUpdateCargoDTO): Promise<void> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) {
      throw new AppError("Cargo nao encontrado.", 404);
    }

    const current = doc.data() as ICargo;
    const nextNome = data.nome?.trim();

    const ocupadas = await this.countCooperadosByCargo(current.nome);
    const nextLimite = data.limiteVagas ?? current.limiteVagas;

    if (nextNome && nextNome !== current.nome) {
      if (ocupadas > 0) {
        throw new AppError(
          "Nao e possivel renomear um cargo com cooperados vinculados.",
          400,
        );
      }

      await this.assertNomeDisponivel(nextNome, id);
    }

    if (nextLimite < ocupadas) {
      throw new AppError(
        `Nao e possivel reduzir o limite para ${nextLimite}; existem ${ocupadas} cooperados ativos neste cargo.`,
        400,
      );
    }

    await this.collection.doc(id).update({
      ...data,
      ...(nextNome ? { nome: nextNome } : {}),
      updatedAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) {
      throw new AppError("Cargo nao encontrado.", 404);
    }

    const cargo = doc.data() as ICargo;
    const ocupadas = await this.countCooperadosByCargo(cargo.nome);

    if (ocupadas > 0) {
      throw new AppError(
        "Nao e possivel excluir um cargo com cooperados vinculados.",
        400,
      );
    }

    await this.collection.doc(id).delete();
  }

  async assertCargoHasAvailableSlot(
    cargoNome: string,
    unidadeId: string,
    ignoreCooperadoId?: string,
  ): Promise<void> {
    const cargo = await this.getByNome(cargoNome);

    if (!cargo) {
      throw new AppError("Cargo nao cadastrado.", 400);
    }

    if (cargo.ativo === false) {
      throw new AppError("Cargo inativo.", 400);
    }

    const ocupadas = await this.countCooperadosByCargo(
      cargo.nome,
      unidadeId,
      ignoreCooperadoId,
    );

    if (ocupadas >= cargo.limiteVagas) {
      throw new AppError(
        `O cargo "${cargo.nome}" nao possui vagas disponiveis nesta unidade.`,
        400,
      );
    }
  }

  private async getByNome(nome: string): Promise<ICargo | null> {
    await this.ensureDefaultCargos();

    const snapshot = await this.collection
      .where("nome", "==", nome)
      .limit(1)
      .get();
    const doc = snapshot.docs[0];

    return doc ? ({ id: doc.id, ...doc.data() } as ICargo) : null;
  }

  private async assertNomeDisponivel(nome: string, ignoreId?: string) {
    const snapshot = await this.collection
      .where("nome", "==", nome)
      .limit(1)
      .get();
    const existing = snapshot.docs[0];

    if (existing && existing.id !== ignoreId) {
      throw new AppError("Ja existe um cargo com este nome.", 409);
    }
  }

  private async ensureDefaultCargos() {
    const snapshot = await this.collection.limit(1).get();

    if (!snapshot.empty) return;

    const batch = db.batch();
    const now = new Date();

    DEFAULT_CARGOS.forEach((cargo) => {
      const ref = this.collection.doc();
      batch.set(ref, {
        ...cargo,
        ativo: true,
        createdAt: now,
        updatedAt: now,
      });
    });

    await batch.commit();
  }

  private async getOcupacaoPorCargo(
    unidadeId?: string,
  ): Promise<Map<string, number>> {
    let query: FirebaseFirestore.Query = this.cooperadosCollection.where(
      "status",
      "==",
      "ATIVO",
    );

    if (unidadeId) {
      query = query.where("unidadeId", "==", unidadeId);
    }

    const snapshot = await query.get();
    const ocupacao = new Map<string, number>();

    snapshot.docs.forEach((doc) => {
      const cargo = doc.data().cargo;
      if (cargo) {
        ocupacao.set(cargo, (ocupacao.get(cargo) || 0) + 1);
      }
    });

    return ocupacao;
  }

  private async countCooperadosByCargo(
    cargoNome: string,
    unidadeId?: string,
    ignoreCooperadoId?: string,
  ): Promise<number> {
    let query: FirebaseFirestore.Query = this.cooperadosCollection
      .where("cargo", "==", cargoNome)
      .where("status", "==", "ATIVO");

    if (unidadeId) {
      query = query.where("unidadeId", "==", unidadeId);
    }

    const snapshot = await query.get();

    return snapshot.docs.filter((doc) => doc.id !== ignoreCooperadoId).length;
  }
}
