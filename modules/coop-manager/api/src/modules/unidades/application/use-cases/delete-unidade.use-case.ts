import { db } from "../../../../config/firebase.js";
import { IUnidadeRepository } from "../../domain/repositories/unidade.repository.js";
import { AppError } from "@shared/utils/app-error.js";

export class DeleteUnidadeUseCase {
  constructor(private unidadeRepository: IUnidadeRepository) {}

  async execute(id: string): Promise<void> {
    const unidade = await this.unidadeRepository.getById(id);

    if (!unidade) {
      throw new AppError("Unidade não encontrada.", 404);
    }

    // Validação de Integridade: Não permite excluir se houver usuários vinculados
    // Seguindo a lógica do antigo service.
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

    await this.unidadeRepository.delete(id);
  }
}
