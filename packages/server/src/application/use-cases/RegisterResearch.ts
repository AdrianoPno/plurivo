import { Research } from "@/domain/entities/Research";
import { ResearchRepository } from "@/domain/repositories/ResearchRepository";
import { CreateResearchBody } from "@/interfaces/http/schemas/research.schema";

export class RegisterResearch {
  constructor(private researchRepository: ResearchRepository) {}

  async execute(data: CreateResearchBody): Promise<Research> {
    // Converte as strings de data do Zod para objetos Date do JS
    const research = new Research({
      ...data,
      startDate: new Date(data.startDate),
      estimatedEndDate: new Date(data.estimatedEndDate),
      actualEndDate: data.actualEndDate ? new Date(data.actualEndDate) : null,
    });

    const savedResearch = await this.researchRepository.save(research);
    return savedResearch;
  }
}
