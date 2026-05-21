import { IUnidadeRepository } from "../../domain/repositories/unidade.repository";
import { ICreateUnidadeDTO, IUnidade } from "../../unidades.types";

export class CreateUnidadeUseCase {
  constructor(private unidadeRepository: IUnidadeRepository) {}

  async execute(data: ICreateUnidadeDTO): Promise<string> {
    const newUnidade: Omit<IUnidade, "id"> = {
      nome: data.nome,
      sigla: data.sigla,
      status: data.status || "ATIVO",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.unidadeRepository.save(newUnidade);
  }
}
