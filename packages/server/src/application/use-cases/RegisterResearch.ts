import { Research } from "@/domain/entities/Research";
import { ResearchRepository } from "@/domain/repositories/ResearchRepository";
import { CreateResearchBody } from "@/interfaces/http/schemas/research.schema";
import { ValidationException } from "../errors/ValidationException";

export class RegisterResearch {
  constructor(private researchRepository: ResearchRepository) {}

  async execute(data: CreateResearchBody): Promise<Research> {
    // 1. Validação de data
    const startDate = new Date(data.startDate);
    const estimatedEndDate = new Date(data.estimatedEndDate);

    if (estimatedEndDate.getTime() <= startDate.getTime()) {
      throw new ValidationException(
        "A data de término estimada deve ser posterior à data de início.",
      );
    }

    const newResearch = new Research({
      title: data.title,
      description: data.description,
      objective: data.objective,
      status: data.status,
      methodology: data.methodology,
      startDate: startDate,
      estimatedEndDate: estimatedEndDate,
      actualEndDate: null, // Always null on creation, updated via PATCH
      estimatedCost: data.estimatedCost,
      actualCost: 0, // Always 0 on creation, updated via PATCH
      targetAudience: data.targetAudience,
      location: data.location,
      tags: data.tags,
      artifacts: data.artifacts
        ? data.artifacts.map((artifact) => artifact.url)
        : [],
      insights: data.insights,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Persistência via repositório de infra (Firestore)
    return await this.researchRepository.save(newResearch);
  }
}
