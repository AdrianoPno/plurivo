import { IUnidadeRepository } from "../../domain/repositories/unidade.repository";
import { IUnidade } from "../../unidades.types";

export class ListUnidadesUseCase {
  constructor(private unidadeRepository: IUnidadeRepository) {}

  async execute(): Promise<IUnidade[]> {
    return this.unidadeRepository.list();
  }
}
