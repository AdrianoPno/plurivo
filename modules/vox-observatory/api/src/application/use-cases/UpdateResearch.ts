import { Research, ResearchProps } from "@/domain/entities/Research.js";
import { ResearchRepository } from "@/domain/repositories/ResearchRepository.js";
import { UpdateResearchBody } from "@/interfaces/http/schemas/research.schema.js";
import { DocumentNotFoundException } from "@shared/firebase/admin.js";
import { ValidationException } from "../errors/ValidationException.js";

export class UpdateResearch {
  constructor(private researchRepository: ResearchRepository) {}

  async execute(id: string, data: UpdateResearchBody): Promise<Research> {
    const existingResearch = await this.researchRepository.findById(id);

    if (!existingResearch) {
      throw new DocumentNotFoundException(`Research with ID ${id} not found.`);
    }

    // Validação de data: usa a nova data se fornecida, senão, a existente.
    const startDate = data.startDate
      ? new Date(data.startDate)
      : existingResearch.props.startDate;
    const estimatedEndDate = data.estimatedEndDate
      ? new Date(data.estimatedEndDate)
      : existingResearch.props.estimatedEndDate;

    if (
      startDate &&
      estimatedEndDate &&
      estimatedEndDate.getTime() <= startDate.getTime()
    ) {
      throw new ValidationException(
        "A data de término estimada deve ser posterior à data de início.",
      );
    }

    const {
      startDate: startDateStr,
      estimatedEndDate: estimatedEndDateStr,
      actualEndDate: actualEndDateStr,
      artifacts,
      ...restOfData
    } = data;

    const dataForRepository: Partial<ResearchProps> = {
      ...restOfData,
    };

    if (startDateStr) {
      dataForRepository.startDate = new Date(startDateStr);
    }
    if (estimatedEndDateStr) {
      dataForRepository.estimatedEndDate = new Date(estimatedEndDateStr);
    }
    if (actualEndDateStr) {
      dataForRepository.actualEndDate = new Date(actualEndDateStr);
    } else if (actualEndDateStr === null) {
      dataForRepository.actualEndDate = null;
    }

    if (artifacts) {
      dataForRepository.artifacts = artifacts;
    }

    // Business rule: If status changes to 'concluída' and actualEndDate is empty, set it automatically
    if (data.status === "concluida" && !dataForRepository.actualEndDate) {
      dataForRepository.actualEndDate = new Date();
    }

    await this.researchRepository.update(id, dataForRepository);
    return (await this.researchRepository.findById(id)) as Research; // Fetch updated research
  }
}
