import { Research } from "@/domain/entities/Research";
import { ResearchRepository } from "@/domain/repositories/ResearchRepository";
import { CreateResearchBody } from "@/interfaces/http/schemas/research.schema";

export class RegisterResearch {
  constructor(private researchRepository: ResearchRepository) {}

  async execute(data: CreateResearchBody): Promise<Research> {
    // 1. Instanciação usando os termos em português do seu contrato
    const research = new Research({
      title: data.title,
      description: data.description,
      objective: data.objective,
      status: data.status,
      methodology: data.methodology,
      startDate: new Date(data.startDate),
      estimatedEndDate: new Date(data.estimatedEndDate),
      actualEndDate: data.actualEndDate ? new Date(data.actualEndDate) : null,
      estimatedCost: data.estimatedCost,
      actualCost: data.actualCost,
      targetAudience: data.targetAudience,
      location: data.location,
      tags: data.tags,
      artifacts: data.artifacts,
      insights: data.insights,
    });

    // 2. Persistência via repositório de infra (Firestore)
    return await this.researchRepository.save(research);
  }
}
