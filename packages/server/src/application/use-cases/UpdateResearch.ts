import { Research } from "@/domain/entities/Research";
import { ResearchRepository } from "@/domain/repositories/ResearchRepository";
import { UpdateResearchBody } from "@/interfaces/http/schemas/research.schema";
import { DocumentNotFoundException } from "@/infra/database/firestore";
import { ResearchProps } from "@/domain/entities/Research";

export class UpdateResearch {
  constructor(private researchRepository: ResearchRepository) {}

  async execute(id: string, data: UpdateResearchBody): Promise<Research> {
    const existingResearch = await this.researchRepository.findById(id);

    if (!existingResearch) {
      throw new DocumentNotFoundException(`Research with ID ${id} not found.`);
    }

    // Objeto para armazenar os dados a serem atualizados, com datas convertidas para Date
    const dataForRepository: Partial<ResearchProps> = {};

    // Itera sobre os dados recebidos (UpdateResearchBody) e converte tipos quando necessário
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key as keyof UpdateResearchBody];

        // Converte strings de data para objetos Date
        if (
          (key === "startDate" ||
            key === "estimatedEndDate" ||
            key === "actualEndDate") &&
          typeof value === "string"
        ) {
          (dataForRepository as any)[key] = new Date(value);
        } else if (key === "actualEndDate" && value === null) {
          // Garante que null seja passado corretamente para actualEndDate
          (dataForRepository as any)[key] = null;
        } else {
          // Para outros campos, atribui diretamente
          (dataForRepository as any)[key] = value;
        }
      }
    }

    // Business rule: If status changes to 'concluída' and actualEndDate is empty, set it automatically
    if (data.status === "concluida" && !dataForRepository.actualEndDate) {
      dataForRepository.actualEndDate = new Date();
    }

    await this.researchRepository.update(id, dataForRepository);
    return (await this.researchRepository.findById(id)) as Research; // Fetch updated research
  }
}
