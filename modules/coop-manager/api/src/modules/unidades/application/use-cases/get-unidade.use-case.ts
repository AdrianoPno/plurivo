import { IUnidadeRepository } from "../../domain/repositories/unidade.repository.js";
import { IUnidade } from "../../unidades.types.js";
import { AppError } from "@shared/utils/app-error.js";

export class GetUnidadeUseCase {
  constructor(private unidadeRepository: IUnidadeRepository) {}

  async execute(id: string): Promise<IUnidade> {
    const unidade = await this.unidadeRepository.getById(id);

    if (!unidade) {
      throw new AppError("Unidade não encontrada.", 404);
    }

    return unidade;
  }
}
