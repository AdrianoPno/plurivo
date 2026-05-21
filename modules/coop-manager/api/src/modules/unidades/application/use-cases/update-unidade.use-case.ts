import { IUnidadeRepository } from "../../domain/repositories/unidade.repository.js";
import { IUpdateUnidadeDTO } from "../../unidades.types.js";
import { AppError } from "@shared/utils/app-error.js";

export class UpdateUnidadeUseCase {
  constructor(private unidadeRepository: IUnidadeRepository) {}

  async execute(id: string, data: IUpdateUnidadeDTO): Promise<void> {
    const unidade = await this.unidadeRepository.getById(id);

    if (!unidade) {
      throw new AppError("Unidade não encontrada.", 404);
    }

    // Normalização da sigla para manter consistência no banco
    if (data.sigla) {
      data.sigla = data.sigla.toLowerCase();
      // Nota: A validação de sigla única deve ser feita no repositório ou aqui
      // caso o banco não suporte restrições nativas.
    }

    await this.unidadeRepository.update(id, data);
  }
}
